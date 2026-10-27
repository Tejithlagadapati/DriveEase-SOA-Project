import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookingApi } from '../../api/bookingApi';
import { getVehicleImage } from '../../api/mockData';
import { Calendar, AlertCircle, Sparkles, ArrowRight, Gauge, ShieldCheck, Zap } from 'lucide-react';

export const BookingModal = ({ isOpen, onClose, vehicle, onSuccess }) => {
  const { user, isAuthenticated, loginAsDemo } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const threeDaysLater = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(threeDaysLater);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [startDate, endDate]);

  const totalCost = useMemo(() => {
    if (!vehicle) return 0;
    return (Number(vehicle.dailyRate) * rentalDays).toFixed(2);
  }, [vehicle, rentalDays]);

  if (!vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated || !user) {
      setErrorMsg('Please log in with your pilot profile to reserve this machine.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg('Check-in date cannot precede ignition date.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingApi.createBooking({
        vehicleId: vehicle.id,
        userId: user.userId,
        startDate,
        endDate,
      });

      success(`Launch Protocol Confirmed for ${vehicle.brand} ${vehicle.model}!`);
      if (onSuccess) onSuccess(res);
      onClose();
      navigate('/my-bookings');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Dispatch submission failed';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async () => {
    try {
      await loginAsDemo('CUSTOMER');
      success('Connected as verified pilot John Doe');
      setErrorMsg('');
    } catch (err) {
      toastError('Authentication failed');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`IGNITION DISPATCH // ${vehicle.brand} ${vehicle.model}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 font-automotive">
        {/* Vehicle Preview Card */}
        <div className="flex gap-4 p-4 bg-black/50 rounded-2xl border border-white/[0.08]">
          <img
            src={getVehicleImage(vehicle)}
            alt={vehicle.model}
            className="w-28 h-20 rounded-xl object-cover shrink-0 border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black text-brand-400 uppercase tracking-widest flex items-center gap-1 font-mono">
              <Gauge className="w-3 h-3 text-brand-500" />
              {vehicle.vehicleType} • {vehicle.year}
            </div>
            <h4 className="font-black text-white text-base truncate italic">
              {vehicle.brand} {vehicle.model}
            </h4>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              VIN: {vehicle.registrationNumber}
            </div>
            <div className="text-sm font-black text-brand-400 mt-1 font-digital">
              ${Number(vehicle.dailyRate).toFixed(2)}{' '}
              <span className="text-xs font-mono text-slate-500">/ 24H</span>
            </div>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated ? (
          <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 space-y-2.5">
            <div className="flex items-center gap-2 font-black text-brand-400 uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Pilot Authentication Required
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Connect your driver profile to finalize dispatch, or use 1-click test access:
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono">
              <button
                type="button"
                onClick={handleQuickLogin}
                className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg shadow-brand transition uppercase tracking-wider"
              >
                1-Click Pilot Access
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="px-3 py-1.5 bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-bold rounded-lg hover:bg-white/10 transition uppercase tracking-wider"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-300 flex items-center justify-between font-mono">
            <span>
              PILOT: <strong className="font-bold text-white font-automotive">{user.name}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold text-[10px] border border-brand-500/30">
              CALLSIGN #{user.userId}
            </span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dates Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                Ignition Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  min={todayStr}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white font-digital focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">
                Check-In Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate || todayStr}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white font-digital focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing Calculation Breakdown */}
          <div className="p-4 bg-black/60 rounded-xl border border-white/[0.08] space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Rental Duration</span>
              <span className="font-digital text-white font-bold">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Daily Rate</span>
              <span className="font-digital text-white font-bold">${Number(vehicle.dailyRate).toFixed(2)} / 24H</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Comprehensive CDW Shield</span>
              <span className="text-emerald-400 font-bold">COMPLIMENTARY</span>
            </div>
            <div className="pt-2 border-t border-white/[0.08] flex justify-between items-baseline">
              <span className="font-bold text-white uppercase tracking-wider font-automotive">TOTAL DISPATCH VALUATION</span>
              <span className="text-2xl font-black text-brand-400 font-digital">
                ${totalCost}
              </span>
            </div>
          </div>

          {/* CTA Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-brand hover:shadow-glow-orange flex items-center justify-center gap-2 transition hover:-translate-y-0.5 italic"
          >
            {submitting ? (
              <span>TRANSMITTING TELEMETRY...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-amber-200" />
                <span>CONFIRM LAUNCH DISPATCH</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};
