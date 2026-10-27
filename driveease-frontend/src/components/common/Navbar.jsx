import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Car,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Search,
  ArrowRight,
  Shield,
  Crown,
  Gauge,
  Zap,
  Flame,
  Activity
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, loginAsDemo } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [driveMode, setDriveMode] = useState('SPORT'); // COMFORT | SPORT | TRACK

  const handleLogout = () => {
    logout();
    success('Ignition powered down. Logged out.');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleDemoSwitch = async (role) => {
    try {
      await loginAsDemo(role);
      success(`Telemetry connected: ${role === 'ADMIN' ? 'Chief Operations Officer' : 'Verified Track Driver'}`);
      setDemoMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const cycleDriveMode = () => {
    const modes = ['COMFORT', 'SPORT', 'TRACK'];
    const next = modes[(modes.indexOf(driveMode) + 1) % modes.length];
    setDriveMode(next);
    success(`Drive Mode Engaged: [ ${next} ]`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#090b0e]/95 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      {/* =========================================================================
          F1 / SUPERCAR TACHOMETER SHIFT LIGHTS & TELEMETRY TICKER
          ========================================================================= */}
      <div className="bg-black/80 border-b border-white/[0.04] px-4 py-1 flex items-center justify-between text-[10px] font-mono tracking-wider overflow-hidden">
        {/* Left: Cockpit System Telemetry */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">TELEMETRY: ACTIVE</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 font-digital">OIL: 96°C</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400 font-digital">TIRE: 32 PSI OPTIMAL</span>
        </div>

        {/* Center: Shift Light Array */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] uppercase font-bold text-slate-500 mr-1 hidden lg:inline">RPM:</span>
          {/* 4 Green LEDs */}
          <span className="w-2.5 h-1.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          <span className="w-2.5 h-1.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          <span className="w-2.5 h-1.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          <span className="w-2.5 h-1.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          {/* 2 Amber LEDs */}
          <span className="w-2.5 h-1.5 rounded-sm bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
          <span className="w-2.5 h-1.5 rounded-sm bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
          {/* 2 Redline Shift LEDs */}
          <span className="w-2.5 h-1.5 rounded-sm bg-brand-500 shadow-[0_0_8px_#ff5a00] animate-pulse" />
          <span className="w-2.5 h-1.5 rounded-sm bg-rose-600 shadow-[0_0_8px_#e11d48] animate-pulse" />
        </div>

        {/* Right: Drive Mode Selector Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleDriveMode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition ${
              driveMode === 'TRACK'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : driveMode === 'SPORT'
                ? 'bg-brand-500/20 text-brand-400 border-brand-500/40 shadow-[0_0_10px_rgba(255,90,0,0.3)]'
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
            }`}
            title="Click to switch drive mode protocol"
          >
            <Activity className="w-2.5 h-2.5 animate-spin" />
            <span>MODE: {driveMode}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Brand Logo with Cockpit Emblem */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-500 via-amber-500 to-brand-600 flex items-center justify-center text-white shadow-brand group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 stroke-[2.3]" />
              {/* Tachometer needle accent */}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-black rounded-full border border-brand-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping" />
              </span>
            </div>
            <div>
              <div className="flex items-center tracking-wider font-automotive">
                <span className="text-2xl font-black text-white italic tracking-wider">DRIVE</span>
                <span className="text-2xl font-black text-brand-500 italic tracking-wider">EASE</span>
                <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/30 uppercase tracking-widest font-bold">
                  GT
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400 -mt-1 font-mono flex items-center gap-1">
                <Gauge className="w-2.5 h-2.5 text-brand-500" />
                Curated Self-Drive Mobility
              </p>
            </div>
          </Link>

          {/* Center Navigation Links with Automotive Accents */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition font-automotive ${
                isActive('/')
                  ? 'text-brand-500 bg-white/[0.05] border-b-2 border-brand-500 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              Cockpit
            </Link>

            <Link
              to="/vehicles"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition font-automotive ${
                isActive('/vehicles')
                  ? 'text-brand-500 bg-white/[0.05] border-b-2 border-brand-500 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              Fleet Hangar
            </Link>

            <a
              href="/#how-it-works"
              className="px-3.5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase text-slate-300 hover:text-white hover:bg-white/[0.03] transition font-automotive"
            >
              Launch Protocol
            </a>

            <a
              href="/#why-driveease"
              className="px-3.5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase text-slate-300 hover:text-white hover:bg-white/[0.03] transition font-automotive"
            >
              Telemetry &amp; Safety
            </a>

            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition font-automotive ${
                  isActive('/my-bookings')
                    ? 'text-brand-500 bg-white/[0.05] border-b-2 border-brand-500 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5 text-brand-500" />
                Trip Log
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-widest uppercase transition ml-1 font-automotive ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'bg-white/10 text-amber-400 hover:bg-white/20 border border-white/10'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Fleet Ops
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Engine Start/Stop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => navigate('/vehicles')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition border border-transparent hover:border-white/10"
              title="Search Machine"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Test Profile Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-brand-500/40 transition font-mono"
                title="Switch demo profile"
              >
                <Crown className="w-3.5 h-3.5 text-brand-500" />
                <span>PILOT TEST</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#12151c] rounded-2xl shadow-2xl border border-white/10 p-2 z-50 animate-scale-in"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Select Driver Profile
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('ADMIN')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-white/[0.06] transition"
                  >
                    <div>
                      <span className="font-bold text-white block">Chief Fleet Director</span>
                      <span className="text-[10px] text-slate-400">admin@driveease.com</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 text-[10px] font-bold border border-brand-500/30">
                      ADMIN
                    </span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('CUSTOMER')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-white/[0.06] transition"
                  >
                    <div>
                      <span className="font-bold text-white block">Track Pilot Client</span>
                      <span className="text-[10px] text-slate-400">john@example.com</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-bold">
                      PILOT
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="flex items-center gap-2 bg-white/[0.05] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                    {user?.name ? user.name[0].toUpperCase() : 'P'}
                  </div>
                  <span className="text-xs font-bold text-slate-200 line-clamp-1 max-w-[100px] font-automotive">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Cut Engine / Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition font-automotive uppercase tracking-wider"
              >
                <User className="w-3.5 h-3.5 text-brand-500" />
                <span>Pilot Login</span>
              </Link>
            )}

            {/* Vehicular Ignition CTA Button */}
            <Link
              to="/vehicles"
              className="relative group flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 rounded-xl shadow-brand hover:shadow-glow-orange transition duration-200 uppercase tracking-widest font-automotive italic"
            >
              <Zap className="w-3.5 h-3.5 fill-current animate-pulse text-amber-200" />
              <span>IGNITE RENTAL</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08] transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0c0f14] px-5 pt-4 pb-6 space-y-3 font-automotive">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] uppercase tracking-wider"
          >
            Cockpit Home
          </Link>
          <Link
            to="/vehicles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] uppercase tracking-wider"
          >
            Fleet Hangar
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] uppercase tracking-wider"
            >
              My Trip Log
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 uppercase tracking-wider"
            >
              Fleet Ops Command
            </Link>
          )}

          <div className="pt-3 border-t border-white/[0.08]">
            <div className="text-[10px] font-bold text-slate-500 mb-2 tracking-wider uppercase font-mono">
              Driver Authentication Switch
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoSwitch('ADMIN')}
                className="py-2 px-3 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30 text-xs font-bold"
              >
                Fleet Ops Admin
              </button>
              <button
                onClick={() => handleDemoSwitch('CUSTOMER')}
                className="py-2 px-3 rounded-xl bg-white/[0.05] text-slate-300 border border-white/[0.08] text-xs font-bold"
              >
                Pilot Driver
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08]">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{user?.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 uppercase font-mono"
                >
                  Kill Switch
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-slate-300 bg-white/[0.05] border border-white/[0.08] rounded-xl uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  to="/vehicles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-brand-500 rounded-xl shadow-brand uppercase tracking-wider"
                >
                  Ignite Rental
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
