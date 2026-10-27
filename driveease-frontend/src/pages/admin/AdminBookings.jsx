import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { bookingApi } from '../../api/bookingApi';
import { vehicleApi } from '../../api/vehicleApi';
import { useToast } from '../../context/ToastContext';
import {
  CalendarClock,
  CheckCircle,
  Play,
  RotateCcw,
  RefreshCw,
  Search,
  Gauge
} from 'lucide-react';

export const AdminBookings = () => {
  const { success, error: toastError } = useToast();
  const [bookings, setBookings] = useState([]);
  const [vehiclesMap, setVehiclesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
      setBookings(bookingsData);
    } catch (err) {
      console.error(err);
      toastError('Failed to load reservation pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransition = async (bookingId, targetStatus) => {
    setActionLoadingId(bookingId);
    try {
      await bookingApi.updateBookingStatus(bookingId, targetStatus);
      success(`Booking #${bookingId} successfully transitioned to ${targetStatus}`);
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Status transition failed';
      toastError(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const v = vehiclesMap[b.vehicleId];
      const matchVehicle = v && `${v.brand} ${v.model} ${v.registrationNumber}`.toLowerCase().includes(q);
      const matchIds = String(b.id).includes(q) || String(b.userId).includes(q);
      return matchVehicle || matchIds;
    }
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-6 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Reservation Pipeline &amp; Lifecycle
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Advance customer reservations through verified states: Pending → Confirmed → Active → Completed.
              </p>
            </div>

            <button
              onClick={loadData}
              className="px-4 py-2.5 bg-cream-50 border border-cream-300 text-stone-700 hover:text-stone-900 rounded-2xl text-xs font-bold shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-500' : ''}`} />
              Refresh Pipeline
            </button>
          </div>

          {/* Workflow visual guide */}
          <div className="p-5 bg-cream-50 border border-cream-300 rounded-3xl text-xs space-y-3 shadow-soft">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-brand-500" />
              Operational Sequence:
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                PENDING
              </span>
              <span className="text-stone-400">→</span>
              <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-brand-700 border border-orange-300 font-bold">
                CONFIRMED (Locks Asset)
              </span>
              <span className="text-stone-400">→</span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                ACTIVE (Client Dispatched)
              </span>
              <span className="text-stone-400">→</span>
              <span className="px-2.5 py-1 rounded-xl bg-cream-200 text-stone-700 border border-cream-300 font-bold">
                COMPLETED (Asset Freed)
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-cream-50 rounded-3xl border border-cream-300 p-5 shadow-soft flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID, client ID, or vehicle make/model..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['ALL', 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-obsidian text-white shadow-sm font-bold'
                      : 'bg-cream-100 text-stone-600 hover:text-stone-900 hover:bg-cream-200 border border-cream-300/80'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-cream-50 rounded-3xl border border-cream-300 shadow-soft overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-cream-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-150 border-b border-cream-300 text-stone-500 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Order Ref</th>
                      <th className="py-3.5 px-4">Vehicle Asset</th>
                      <th className="py-3.5 px-4">Client</th>
                      <th className="py-3.5 px-4">Rental Window</th>
                      <th className="py-3.5 px-4">Current Status</th>
                      <th className="py-3.5 px-4 text-right">State Transition Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {filteredBookings.map((b) => {
                      const v = vehiclesMap[b.vehicleId];
                      const isPending = b.status === 'PENDING';
                      const isConfirmed = b.status === 'CONFIRMED';
                      const isActive = b.status === 'ACTIVE';
                      const isCompleted = b.status === 'COMPLETED';
                      const isCancelled = b.status === 'CANCELLED';

                      return (
                        <tr key={b.id} className="hover:bg-cream-100/60 transition">
                          <td className="py-4 px-4 font-mono font-bold text-stone-900">
                            #{b.id}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-stone-900">
                              {v ? `${v.brand} ${v.model}` : `Asset #${b.vehicleId}`}
                            </div>
                            {v && (
                              <div className="text-[11px] font-mono font-bold text-brand-600">
                                {v.registrationNumber}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-stone-600 font-medium">
                            Client ID #{b.userId}
                          </td>
                          <td className="py-4 px-4 font-mono text-stone-500 text-[11px]">
                            {b.startDate} → {b.endDate}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={b.status} type="booking" />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-2 justify-end">
                              {/* PENDING -> CONFIRMED */}
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleTransition(b.id, 'CONFIRMED')}
                                    disabled={actionLoadingId === b.id}
                                    className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition shadow-brand"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleTransition(b.id, 'CANCELLED')}
                                    disabled={actionLoadingId === b.id}
                                    className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}

                              {/* CONFIRMED -> ACTIVE */}
                              {isConfirmed && (
                                <>
                                  <button
                                    onClick={() => handleTransition(b.id, 'ACTIVE')}
                                    disabled={actionLoadingId === b.id}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    Dispatch (Active)
                                  </button>
                                  <button
                                    onClick={() => handleTransition(b.id, 'CANCELLED')}
                                    disabled={actionLoadingId === b.id}
                                    className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}

                              {/* ACTIVE -> COMPLETED */}
                              {isActive && (
                                <button
                                  onClick={() => handleTransition(b.id, 'COMPLETED')}
                                  disabled={actionLoadingId === b.id}
                                  className="px-3.5 py-1.5 bg-obsidian hover:bg-stone-800 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Check In Asset
                                </button>
                              )}

                              {(isCompleted || isCancelled) && (
                                <span className="text-stone-400 font-medium text-[11px]">
                                  Concluded
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-stone-400 text-xs">
                No reservation orders found matching active criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
