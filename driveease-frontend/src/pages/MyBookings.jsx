import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { vehicleApi } from '../api/vehicleApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { getVehicleImage } from '../api/mockData';
import {
  Calendar,
  Car,
  Clock,
  ArrowRight,
  RotateCcw,
  FileText,
  Gauge
} from 'lucide-react';

export const MyBookings = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [bookings, setBookings] = useState([]);
  const [vehiclesMap, setVehiclesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, vehiclesData] = await Promise.all([
        bookingApi.getAllBookings(),
        vehicleApi.getAllVehicles(),
      ]);

      const vMap = {};
      vehiclesData.forEach((v) => {
        vMap[v.id] = v;
      });
      setVehiclesMap(vMap);

      const filtered = user?.role === 'ADMIN'
        ? bookingsData
        : bookingsData.filter((b) => Number(b.userId) === Number(user?.userId));

      setBookings(filtered);
    } catch (err) {
      console.error(err);
      toastError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? Full refund will be processed immediately.')) {
      return;
    }
    setActionLoadingId(bookingId);
    try {
      await bookingApi.cancelBooking(bookingId);
      success('Reservation cancelled. Refund receipt issued.');
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Cancellation failed';
      toastError(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReturnVehicle = async (bookingId) => {
    if (!window.confirm('Confirm vehicle return? This will conclude your active rental session.')) {
      return;
    }
    setActionLoadingId(bookingId);
    try {
      await bookingApi.returnBooking(bookingId);
      success('Vehicle checked in successfully! Final invoice generated.');
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Return failed';
      toastError(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UPCOMING') return b.status === 'PENDING' || b.status === 'CONFIRMED';
    if (activeTab === 'ACTIVE') return b.status === 'ACTIVE';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-1 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-brand-500" />
            Client Driver Itinerary
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            My Reservations
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Review your rental schedule, track active trips, or manage vehicle checkout.
          </p>
        </div>

        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-brand transition hover:-translate-y-0.5"
        >
          Book Another Car
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-cream-300 pb-4">
        {['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tab
                ? 'bg-obsidian text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-cream-150'
            }`}
          >
            {tab === 'UPCOMING' ? 'Pending & Confirmed' : tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-cream-50 rounded-3xl border border-cream-300 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const vehicle = vehiclesMap[b.vehicleId];
            const startDate = new Date(b.startDate);
            const endDate = new Date(b.endDate);
            const diffDays = Math.max(
              1,
              Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            );
            const dailyRate = vehicle?.dailyRate ? Number(vehicle.dailyRate) : 0;
            const total = (dailyRate * diffDays).toFixed(2);

            const canCancel = b.status === 'PENDING' || b.status === 'CONFIRMED';
            const canReturn = b.status === 'ACTIVE';

            return (
              <div
                key={b.id}
                className="bg-cream-50 rounded-3xl border border-cream-300 p-6 shadow-soft hover:shadow-card transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Vehicle image & Details */}
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-28 h-24 rounded-2xl bg-stone-950 overflow-hidden shrink-0 border border-cream-300">
                    <img
                      src={vehicle ? getVehicleImage(vehicle) : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                      alt="Vehicle"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-stone-500 tracking-wider">
                        ITINERARY #{b.id}
                      </span>
                      <StatusBadge status={b.status} type="booking" />
                    </div>

                    <h3 className="text-lg font-black text-stone-900 truncate">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : `Fleet Asset #${b.vehicleId}`}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1.5">
                      {vehicle && (
                        <span className="font-mono bg-cream-150 px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-stone-800 border border-cream-300">
                          {vehicle.registrationNumber}
                        </span>
                      )}
                      <span>•</span>
                      <span className="font-mono">
                        {b.startDate} → {b.endDate} ({diffDays} {diffDays === 1 ? 'day' : 'days'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-cream-200">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-stone-400 block uppercase font-bold tracking-wider">Total Charge</span>
                    <span className="text-xl font-black text-stone-900">${total}</span>
                    <span className="text-[10px] text-stone-500 block font-medium">${dailyRate} / day</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Cancel button */}
                    {canCancel && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={actionLoadingId === b.id}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition uppercase tracking-wider"
                      >
                        {actionLoadingId === b.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}

                    {/* Return button */}
                    {canReturn && (
                      <button
                        onClick={() => handleReturnVehicle(b.id)}
                        disabled={actionLoadingId === b.id}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {actionLoadingId === b.id ? 'Processing...' : 'Return Vehicle'}
                      </button>
                    )}

                    {vehicle && (
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 bg-cream-150 hover:bg-cream-200 border border-cream-300 transition"
                      >
                        Specs
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream-50 rounded-3xl border border-cream-300 shadow-soft">
          <Calendar className="w-14 h-14 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-900">No reservations found in this section</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Ready to book your next business trip or weekend drive?
          </p>
          <Link
            to="/vehicles"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-brand hover:bg-brand-600 transition"
          >
            Explore Fleet
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
