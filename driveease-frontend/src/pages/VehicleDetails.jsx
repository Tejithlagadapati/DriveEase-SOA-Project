import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicleApi';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { getVehicleImage } from '../api/mockData';
import {
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Award,
  Crown,
  Gauge,
  Fuel,
  Activity,
  Flame,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAsDemo } = useAuth();
  const { success, error: toastError } = useToast();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const threeDaysLater = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(threeDaysLater);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const data = await vehicleApi.getVehicleById(id);
        setVehicle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicle();
  }, [id]);

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

  const handleBooking = async (e) => {
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
      await bookingApi.createBooking({
        vehicleId: vehicle.id,
        userId: user.userId,
        startDate,
        endDate,
      });

      success(`Launch Protocol Confirmed for ${vehicle.brand} ${vehicle.model}!`);
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

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center font-automotive">
        <h2 className="text-2xl font-black text-white italic">Machine Not Found In Hangar</h2>
        <p className="text-xs text-slate-400 mt-2 font-mono">The requested vehicle asset is not registered in the active queue.</p>
        <Link
          to="/vehicles"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-brand font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Fleet Hangar
        </Link>
      </div>
    );
  }

  const isAvailable = vehicle.status === 'AVAILABLE';
  const imageUrl = getVehicleImage(vehicle);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-automotive">
      {/* Return button */}
      <Link
        to="/vehicles"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-8 transition uppercase tracking-widest font-mono"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Fleet Hangar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Image & Telemetry Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Car Photo */}
          <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-cockpit aspect-video">
            <img
              src={imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute top-5 right-5">
              <StatusBadge status={vehicle.status} type="vehicle" />
            </div>
            <div className="absolute bottom-5 left-5 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-200 border border-white/10">
              VIN CHASSIS: {vehicle.registrationNumber}
            </div>
          </div>

          {/* Heading Header Box */}
          <div className="bg-[#10141c] rounded-2xl border border-white/[0.08] p-8 shadow-cockpit">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-400 mb-2 font-mono">
              <Gauge className="w-4 h-4 text-brand-500" />
              <span>{vehicle.vehicleType}</span>
              <span>•</span>
              <span>YEAR {vehicle.year}</span>
              <span>•</span>
              <span className="text-slate-400">ASSET #{vehicle.id}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight italic">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
              DriveEase Certified Fleet Asset #{vehicle.id}. Dynamometer verified, full CDW telemetry enabled, sanitized, and armed for immediate mobile keyless unlock or VIP curbside drop.
            </p>
          </div>

          {/* Vehicular Specifications Grid */}
          <div className="bg-[#10141c] rounded-2xl border border-white/[0.08] p-8 shadow-cockpit">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-brand-500" />
              POWERTRAIN &amp; TELEMETRY BENCHMARK
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-black/50 rounded-xl border border-white/[0.08]">
                <span className="text-slate-400 block text-[10px] uppercase">Drivetrain</span>
                <span className="text-white font-bold text-sm mt-1 block">AWD Steptronic</span>
              </div>
              <div className="p-4 bg-black/50 rounded-xl border border-white/[0.08]">
                <span className="text-slate-400 block text-[10px] uppercase">Engine Output</span>
                <span className="text-brand-400 font-digital font-bold text-sm mt-1 block">450+ BHP</span>
              </div>
              <div className="p-4 bg-black/50 rounded-xl border border-white/[0.08]">
                <span className="text-slate-400 block text-[10px] uppercase">0-100 KM/H Acceleration</span>
                <span className="text-white font-digital font-bold text-sm mt-1 block">3.4 SEC</span>
              </div>
              <div className="p-4 bg-black/50 rounded-xl border border-white/[0.08]">
                <span className="text-slate-400 block text-[10px] uppercase">Fuel Induction</span>
                <span className="text-white font-bold text-sm mt-1 block">Twin-Turbo High Octane</span>
              </div>
              <div className="p-4 bg-black/50 rounded-xl border border-white/[0.08]">
                <span className="text-slate-400 block text-[10px] uppercase">Kilometer Protocol</span>
                <span className="text-emerald-400 font-bold text-sm mt-1 block">Unlimited Track KM</span>
              </div>
              <div className="p-4 bg-black/50 rounded-xl border border-white/[0.08]">
                <span className="text-slate-400 block text-[10px] uppercase">Access Key</span>
                <span className="text-white font-bold text-sm mt-1 block">Bluetooth Mobile Key</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch Reservation Box */}
        <div className="space-y-6">
          <div className="bg-[#10141c] rounded-2xl border border-white/[0.08] p-6 sm:p-7 shadow-cockpit space-y-6 sticky top-28">
            <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-3xl font-black text-white font-digital">
                  ${Number(vehicle.dailyRate).toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono uppercase ml-1">/ 24H</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 uppercase">
                ZERO DEPOSIT
              </span>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-sans">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
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
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
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

              {/* Pricing breakdown */}
              <div className="p-4 bg-black/50 rounded-xl border border-white/[0.08] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Calculated Days</span>
                  <span className="font-digital text-white font-bold">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Comprehensive CDW</span>
                  <span className="text-emerald-400 font-bold">INCLUDED</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-baseline">
                  <span className="font-bold text-white font-automotive uppercase">TOTAL VALUATION</span>
                  <span className="text-2xl font-black text-brand-400 font-digital">
                    ${totalCost}
                  </span>
                </div>
              </div>

              {/* CTA button */}
              <button
                type="submit"
                disabled={submitting || !isAvailable}
                className={`w-full py-4 px-6 rounded-xl text-xs font-black uppercase tracking-widest italic transition flex items-center justify-center gap-2 ${
                  isAvailable
                    ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 text-white shadow-brand hover:shadow-glow-orange hover:-translate-y-0.5'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5 font-mono'
                }`}
              >
                {submitting ? (
                  <span>TRANSMITTING TELEMETRY...</span>
                ) : isAvailable ? (
                  <>
                    <Zap className="w-4 h-4 fill-current text-amber-200" />
                    <span>CONFIRM DISPATCH RESERVATION</span>
                  </>
                ) : (
                  'CURRENTLY DEPLOYED'
                )}
              </button>
            </form>

            {!isAuthenticated && (
              <div className="pt-2 border-t border-white/[0.08] text-center font-mono">
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="w-full py-2 bg-white/[0.05] hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl border border-white/10 transition uppercase tracking-wider"
                >
                  ⚡ Fast 1-Click Pilot Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
