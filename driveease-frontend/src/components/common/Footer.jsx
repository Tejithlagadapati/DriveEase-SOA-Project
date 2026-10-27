import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  ShieldCheck,
  Globe2,
  Clock,
  Sparkles,
  Mail,
  MapPin,
  Lock,
  Gauge
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-[#07090d] border-t border-white/[0.08] text-slate-400 relative">
      {/* Top orange gradient accent */}
      <div className="h-0.5 bg-gradient-to-r from-brand-600 via-amber-500 to-brand-500" />

      {/* Top Banner: Corporate Guarantee */}
      <div className="border-b border-white/[0.06] py-8 bg-[#0a0c10]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Full Premium CDW Shield</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Comprehensive zero liability protection</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Guaranteed Exact Machine</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Drive the precise car you select, not a substitute</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Global Dispatch 24/7</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Rapid roadside dispatch across 40+ airport hubs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Encrypted Reservations</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Enterprise JWT security &amp; transparent billing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white shadow-brand">
                <Car className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                DRIVE<span className="text-brand-500">EASE</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              DriveEase Mobility Corporation is the world&apos;s premier curated self-drive network, delivering high-performance sports cars, flagship executive sedans, and luxury all-terrain SUVs.
            </p>
            <div className="pt-2 text-xs space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>Global Headquarters: 500 Madison Ave, New York, NY 10022</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-slate-300">concierge@driveease.com</span>
              </div>
            </div>
          </div>

          {/* Fleet Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-brand-500" />
              Fleet Classes
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/vehicles?type=COUPE" className="hover:text-brand-400 transition">
                  Performance Coupes &amp; GTs
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=SUV" className="hover:text-brand-400 transition">
                  Prestige All-Terrain SUVs
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=SEDAN" className="hover:text-brand-400 transition">
                  Executive Business Sedans
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=LUXURY" className="hover:text-brand-400 transition">
                  Ultra-Luxury Flagships
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-brand-400 transition">
                  Electric Hyper-Tourers
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions & Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">Airport VIP Meet &amp; Greet</span>
              </li>
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">Corporate Fleet Accounts</span>
              </li>
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">Monthly Luxury Subscriptions</span>
              </li>
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">VIP Doorstep Delivery</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
              Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">Driver Qualification Policy</span>
              </li>
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">Security Deposit Terms</span>
              </li>
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">Fleet Telematics Privacy</span>
              </li>
              <li>
                <span className="hover:text-brand-400 cursor-pointer transition">24/7 Roadside Assistance Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DriveEase Mobility Corp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition">Security Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
