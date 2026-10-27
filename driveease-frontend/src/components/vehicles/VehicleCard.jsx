import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { getVehicleImage } from '../../api/mockData';
import { ArrowRight, Star, Zap, Gauge, Fuel, Activity, ShieldCheck, Flame } from 'lucide-react';

export const VehicleCard = ({ vehicle, onBook }) => {
  const isAvailable = vehicle.status === 'AVAILABLE';
  const imageUrl = getVehicleImage(vehicle);

  // Deterministic mock rating from vehicle id
  const rating = (4.7 + ((vehicle.id % 4) * 0.08)).toFixed(1);
  const tripCount = 38 + (vehicle.id * 14);

  const getHorsepower = () => {
    if (vehicle.vehicleType === 'COUPE') return '520 BHP';
    if (vehicle.vehicleType === 'LUXURY') return '455 BHP';
    if (vehicle.vehicleType === 'SUV') return '420 BHP';
    return '295 BHP';
  };

  const getAcceleration = () => {
    if (vehicle.vehicleType === 'COUPE') return '3.2s';
    if (vehicle.vehicleType === 'LUXURY') return '4.1s';
    if (vehicle.vehicleType === 'SUV') return '4.6s';
    return '5.4s';
  };

  const getTopSpeed = () => {
    if (vehicle.vehicleType === 'COUPE') return '315 KM/H';
    if (vehicle.vehicleType === 'LUXURY') return '285 KM/H';
    if (vehicle.vehicleType === 'SUV') return '260 KM/H';
    return '240 KM/H';
  };

  return (
    <div className="group relative bg-[#12161f] hover:bg-[#161b26] rounded-2xl border border-white/[0.08] hover:border-brand-500/60 overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between font-automotive">
      {/* Top Cockpit Racing Accent Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Car Image with Cockpit HUD Overlay */}
        <div className="relative h-56 w-full bg-[#0a0d12] overflow-hidden">
          <img
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-black/50" />

          {/* Status Badge */}
          <div className="absolute top-3.5 right-3.5">
            <StatusBadge status={vehicle.status} type="vehicle" />
          </div>

          {/* Registration Plate Tag with HUD styling */}
          <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest text-slate-200 border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span>VIN: {vehicle.registrationNumber}</span>
          </div>

          {/* Cockpit Telemetry HUD Strip at bottom of image */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-white px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/15 italic">
                {vehicle.vehicleType}
              </span>
              <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-500/30 flex items-center gap-1 font-mono">
                <Flame className="w-2.5 h-2.5 text-brand-500 fill-current" />
                {getHorsepower()}
              </span>
            </div>

            {/* Launch Control Indicator */}
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider backdrop-blur-md">
              READY
            </span>
          </div>
        </div>

        {/* Details & Telemetry Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-extrabold text-brand-400 tracking-widest uppercase text-[11px] flex items-center gap-1 font-mono">
              <Gauge className="w-3 h-3" />
              {vehicle.brand} • {vehicle.year}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200 font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
              <span className="text-slate-500 font-normal">({tripCount} logs)</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-white group-hover:text-brand-400 transition-colors truncate tracking-wide italic">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">
              Dual-Clutch Sequential • Active Aero
            </p>
          </div>

          {/* Vehicular Cockpit Telemetry Gauges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.08] text-center">
            {/* 0-100 Acceleration */}
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
              <span className="block text-brand-400 font-digital text-sm font-bold tracking-wider">
                {getAcceleration()}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                0-100 KM/H
              </span>
            </div>

            {/* Top Speed */}
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
              <span className="block text-slate-200 font-digital text-xs font-bold tracking-wider pt-0.5">
                {getTopSpeed()}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                TOP VELOCITY
              </span>
            </div>

            {/* Mileage Protocol */}
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
              <span className="block text-emerald-400 font-mono text-xs font-bold tracking-wider pt-0.5">
                UNLIMITED
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                TRACK KM
              </span>
            </div>
          </div>

          {/* Pricing & Telemetry Row */}
          <div className="pt-3 border-t border-white/[0.08] flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-white font-digital tracking-tight">
                ${Number(vehicle.dailyRate).toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400 font-mono uppercase ml-1">/ 24H</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              ZERO DEPOSIT
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions: Cockpit Launch Buttons */}
      <div className="px-5 sm:px-6 pb-6 pt-1 flex items-center gap-2.5">
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="flex-1 py-3 px-3 rounded-xl border border-white/10 hover:border-white/25 bg-black/40 hover:bg-white/[0.06] text-xs font-bold text-slate-200 text-center uppercase tracking-wider transition font-mono"
        >
          SPECS
        </Link>
        <button
          onClick={() => onBook && onBook(vehicle)}
          disabled={!isAvailable}
          className={`flex-1 py-3 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all duration-200 uppercase tracking-widest italic ${
            isAvailable
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-amber-500 text-white shadow-brand hover:shadow-glow-orange hover:-translate-y-0.5'
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5 font-mono'
          }`}
        >
          {isAvailable ? (
            <>
              <span>IGNITE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            'DEPLOYED'
          )}
        </button>
      </div>
    </div>
  );
};
