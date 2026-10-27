import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { vehicleApi } from '../../api/vehicleApi';
import { bookingApi } from '../../api/bookingApi';
import { useToast } from '../../context/ToastContext';
import {
  Car,
  CalendarCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Crown,
  Server,
  Gauge
} from 'lucide-react';

export const AdminDashboard = () => {
  const { success, error: toastError } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vData, bData] = await Promise.all([
        vehicleApi.getAllVehicles(),
        bookingApi.getAllBookings(),
      ]);
      setVehicles(vData);
      setBookings(bData);
    } catch (err) {
      console.error(err);
      toastError('Failed to load operations metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const rentedVehicles = vehicles.filter((v) => v.status === 'RENTED').length;
  const reservedVehicles = vehicles.filter((v) => v.status === 'RESERVED').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'MAINTENANCE').length;

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const activeBookings = bookings.filter((b) => b.status === 'ACTIVE').length;

  const handleQuickStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, newStatus);
      success(`Booking #${bookingId} transitioned to ${newStatus}`);
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Status transition failed';
      toastError(msg);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-600 mb-1">
                <Crown className="w-4 h-4 text-brand-500" />
                Fleet Operations &amp; Intelligence
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Operations Command Center
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/vehicles"
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-brand transition flex items-center gap-2 hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                Fleet Manager
              </Link>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-cream-50 p-6 rounded-3xl border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">Total Fleet</span>
                <Car className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-3xl font-black text-stone-900">{totalVehicles}</div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                {availableVehicles} active &amp; ready
              </div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">Active Rentals</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700">{activeBookings}</div>
              <div className="text-[11px] text-stone-500 font-medium mt-1">
                {rentedVehicles} vehicles on road
              </div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">Pending Dispatch</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-700">{pendingBookings}</div>
              <div className="text-[11px] text-stone-500 font-medium mt-1">
                Awaiting confirmation
              </div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">In Maintenance</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-rose-700">{maintenanceVehicles}</div>
              <div className="text-[11px] text-stone-500 font-medium mt-1">
                Under service review
              </div>
            </div>
          </div>

          {/* Microservices Routing Status Box */}
          <div className="bg-cream-50 text-stone-800 rounded-3xl p-6 border border-cream-300 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-black uppercase tracking-widest text-stone-900">
                  SOA Microservices Network Status
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE CLUSTER
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300/80">
                <div className="text-stone-400 text-[10px] uppercase font-bold">API Gateway</div>
                <div className="font-mono text-brand-600 font-bold mt-1">:8090</div>
                <div className="text-[10px] text-stone-500 mt-1">OAuth2 &amp; Central Proxy</div>
              </div>
              <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300/80">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Vehicle Service</div>
                <div className="font-mono text-brand-600 font-bold mt-1">:8081</div>
                <div className="text-[10px] text-stone-500 mt-1">Catalog &amp; State Locking</div>
              </div>
              <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300/80">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Booking Service</div>
                <div className="font-mono text-brand-600 font-bold mt-1">:8082</div>
                <div className="text-[10px] text-stone-500 mt-1">Reservation Orchestration</div>
              </div>
              <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300/80">
                <div className="text-stone-400 text-[10px] uppercase font-bold">User Service</div>
                <div className="font-mono text-brand-600 font-bold mt-1">:8083</div>
                <div className="text-[10px] text-stone-500 mt-1">JWT Profile Authentication</div>
              </div>
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="bg-cream-50 rounded-3xl border border-cream-300 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Recent Client Reservations</h3>
                <p className="text-xs text-stone-500">
                  Advance bookings through verified state transitions.
                </p>
              </div>
              <Link
                to="/admin/bookings"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 uppercase tracking-wider"
              >
                Full Pipeline ({bookings.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-cream-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-cream-200 text-stone-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Asset ID</th>
                      <th className="py-3 px-3">Client ID</th>
                      <th className="py-3 px-3">Window</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-cream-100/60 transition">
                        <td className="py-3 px-3 font-mono font-bold text-stone-900">#{b.id}</td>
                        <td className="py-3 px-3 font-semibold text-stone-700">Vehicle #{b.vehicleId}</td>
                        <td className="py-3 px-3 text-stone-500">Client #{b.userId}</td>
                        <td className="py-3 px-3 text-stone-600 font-mono text-[11px]">
                          {b.startDate} → {b.endDate}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={b.status} type="booking" />
                        </td>
                        <td className="py-3 px-3 text-right">
                          {b.status === 'PENDING' && (
                            <button
                              onClick={() => handleQuickStatusChange(b.id, 'CONFIRMED')}
                              className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition shadow-brand"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleQuickStatusChange(b.id, 'ACTIVE')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition shadow-sm"
                            >
                              Dispatch
                            </button>
                          )}
                          {b.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleQuickStatusChange(b.id, 'COMPLETED')}
                              className="px-3 py-1 bg-obsidian hover:bg-stone-800 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition"
                            >
                              Complete
                            </button>
                          )}
                          {(b.status === 'COMPLETED' || b.status === 'CANCELLED') && (
                            <span className="text-stone-400 font-medium text-[11px]">Archived</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-stone-400">No reservations on record.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
