import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicleApi';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { BookingModal } from '../components/vehicles/BookingModal';
import {
  Car,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  Key,
  MapPin,
  ChevronDown,
  Check,
  Compass,
  Navigation,
  Star,
  Gauge,
  Play,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Award,
  Layers,
  Activity,
  Fuel,
  Users,
  Flame,
  Cpu
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Booking Tab state (Daily, Airport, Long-Term)
  const [rentalType, setRentalType] = useState('daily');
  const [pickupCity, setPickupCity] = useState('Bengaluru (Indiranagar Hub)');
  const [activeGear, setActiveGear] = useState('D');

  // Dates
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(tomorrowStr);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Hero carousel slide state
  const [heroSlide, setHeroSlide] = useState(1);
  const totalSlides = 4;

  const heroFeaturedCars = [
    {
      brand: 'LAMBORGHINI',
      tagline: 'FOR THE ROADS YOU REMEMBER',
      subtitle: 'ICONIC CARS. REAL EXPERIENCES. SELF-DRIVE.',
      model: 'Huracán EVO V10',
      specs: '0-100 in 2.9s • 640 BHP',
      rpm: '8,500 RPM',
      boost: '1.4 BAR'
    },
    {
      brand: 'PORSCHE',
      tagline: 'PRECISION TRACK DYNAMICS',
      subtitle: 'ENGINEERED IN STUTTGART. UNLEASHED.',
      model: '911 Carrera S (992)',
      specs: '0-100 in 3.3s • 443 BHP',
      rpm: '7,500 RPM',
      boost: '1.2 BAR'
    },
    {
      brand: 'RANGE ROVER',
      tagline: 'COMMAND EVERY HORIZON',
      subtitle: 'FIRST-CLASS CABIN. ALL-TERRAIN POISE.',
      model: 'Autobiography V8 Twin-Turbo',
      specs: 'Air Suspension • 523 BHP',
      rpm: '6,000 RPM',
      boost: '1.1 BAR'
    },
    {
      brand: 'MERCEDES-AMG',
      tagline: 'AFFALTERBACH MOTORSPORT POWER',
      subtitle: 'HANDCRAFTED BITURBO COCKPIT.',
      model: 'AMG GT 63 S 4-Door',
      specs: '0-100 in 3.1s • 630 BHP',
      rpm: '7,000 RPM',
      boost: '1.5 BAR'
    }
  ];

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleApi.getAllVehicles();
        setVehicles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleBook = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory !== 'ALL') params.set('type', selectedCategory);
    navigate(`/vehicles?${params.toString()}`);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const nextHeroSlide = () => {
    setHeroSlide((prev) => (prev % totalSlides) + 1);
  };

  const prevHeroSlide = () => {
    setHeroSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  // Filtered available fleet
  const displayedVehicles = vehicles
    .filter((v) => {
      if (selectedCategory === 'ALL') return true;
      return (v.vehicleType || '').toUpperCase() === selectedCategory.toUpperCase();
    })
    .slice(0, 6);

  const categories = [
    { id: 'ALL', name: 'All Machines', icon: Car, count: vehicles.length },
    { id: 'SEDAN', name: 'Grand Tourers', icon: Navigation, count: vehicles.filter(v => v.vehicleType === 'SEDAN').length },
    { id: 'SUV', name: 'All-Terrain 4x4', icon: Compass, count: vehicles.filter(v => v.vehicleType === 'SUV').length },
    { id: 'COUPE', name: 'Apex Coupes', icon: Zap, count: vehicles.filter(v => v.vehicleType === 'COUPE').length },
  ];

  const luxuryMarques = [
    'PORSCHE',
    'MERCEDES-BENZ',
    'BMW',
    'AUDI',
    'RANGE ROVER',
    'TESLA',
    'JAGUAR',
    'VOLVO',
    'FERRARI',
    'ASTON MARTIN'
  ];

  const fleetCategories = [
    {
      title: 'Sports Coupes',
      subtitle: 'APEX THRILL & DOWNSHIFTS',
      description: 'Twin-turbo flat-6 & high-rev V10s with paddle-shift telemetry.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      type: 'COUPE',
      count: '8 DEPLOYED',
      telemetry: '0-100: 3.2s • 520 BHP'
    },
    {
      title: 'Prestige 4x4 SUVs',
      subtitle: 'EXPEDITION SUPREMACY',
      description: 'Intelligent torque vectoring, electronic air suspension, and high vantage.',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      type: 'SUV',
      count: '12 DEPLOYED',
      telemetry: 'AWD • 420 BHP'
    },
    {
      title: 'Executive GT Sedans',
      subtitle: 'FIRST-CLASS AUTOBAHN POISE',
      description: 'Acoustic privacy glass, twin-turbo V8, and massaging Nappa thrones.',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      type: 'SEDAN',
      count: '10 DEPLOYED',
      telemetry: '0-100: 4.1s • 455 BHP'
    },
    {
      title: 'Electric Hyper-Tourers',
      subtitle: 'INSTANT TORQUE LAUNCH',
      description: 'Sub-2.5 second launch control with digital cockpit autonomy.',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
      type: 'COUPE',
      count: '6 DEPLOYED',
      telemetry: '1020 BHP • 600 KM'
    }
  ];

  const currentCar = heroFeaturedCars[heroSlide - 1];

  return (
    <div className="flex-1 bg-[#090b0e] text-slate-100 font-automotive">
      
      {/* =========================================================================
          HERO SECTION: VEHICULAR COCKPIT & HIGH-PERFORMANCE DISPATCH
          ========================================================================= */}
      <section className="relative min-h-[88vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-hud-grid">
        {/* Background Hero Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b0e] via-[#090b0e]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-[#090b0e]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Heading + Cockpit Dispatch Terminal */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Telemetry Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-black/70 border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-200">
                  // LAUNCH PROTOCOL: ARMED • CURATED SELF-DRIVE FLEET
                </span>
              </div>

              {/* Main Vehicular Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.02] italic">
                DRIVE BEYOND{' '}
                <span className="text-brand-500 drop-shadow-[0_0_25px_rgba(255,90,0,0.4)]">
                  ORDINARY.
                </span>
              </h1>

              {/* Cockpit Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed tracking-wide">
                Exotic supercars, twin-turbo grand tourers, and prestige all-terrain SUVs. Calibrated, fueled, sanitized, and keyless ready for launch.
              </p>

              {/* Cockpit Dispatch Terminal Card */}
              <div className="bg-[#10141c]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-cockpit max-w-xl space-y-5">
                
                {/* Mode Selector Tabs + Gear Selector HUD */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  {/* Protocol Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 text-center font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => setRentalType('daily')}
                      className={`py-2 px-2 font-bold rounded-lg transition-all ${
                        rentalType === 'daily'
                          ? 'bg-brand-500 text-white shadow-brand font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      DAILY PROTOCOL
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalType('airport')}
                      className={`py-2 px-2 font-bold rounded-lg transition-all ${
                        rentalType === 'airport'
                          ? 'bg-brand-500 text-white shadow-brand font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      AIRPORT VALET
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalType('monthly')}
                      className={`py-2 px-2 font-bold rounded-lg transition-all ${
                        rentalType === 'monthly'
                          ? 'bg-brand-500 text-white shadow-brand font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      LONG TOUR
                    </button>
                  </div>

                  {/* Automotive Gear Display */}
                  <div className="hidden sm:flex items-center gap-1 bg-black/80 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-mono font-black">
                    {['P', 'R', 'N', 'D', 'S'].map((gear) => (
                      <button
                        key={gear}
                        type="button"
                        onClick={() => setActiveGear(gear)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition ${
                          activeGear === gear
                            ? 'bg-brand-500 text-white shadow-[0_0_8px_#ff5a00]'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {gear}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispatch Form Controls */}
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  {/* Pick-up Location */}
                  <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 focus-within:border-brand-500 transition">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      Dispatch &amp; Return Hangar
                    </label>
                    <select
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer tracking-wider font-mono"
                    >
                      <option value="Bengaluru (Indiranagar Hub)" className="bg-[#10141c] text-white">
                        Bengaluru Hub (Indiranagar Central Terminal)
                      </option>
                      <option value="Bengaluru Airport (KIA VIP Valet)" className="bg-[#10141c] text-white">
                        Bengaluru KIA Terminal (VIP Curbside Valet)
                      </option>
                      <option value="Mumbai (Bandra West)" className="bg-[#10141c] text-white">
                        Mumbai Hub (Bandra West Waterfront)
                      </option>
                      <option value="Delhi NCR (CyberCity Hub)" className="bg-[#10141c] text-white">
                        Delhi NCR Hub (CyberCity Terminal)
                      </option>
                      <option value="Hyderabad (Hitec City)" className="bg-[#10141c] text-white">
                        Hyderabad Hub (Hitec City Track Hub)
                      </option>
                    </select>
                  </div>

                  {/* Pick-up & Return Dates with Telemetry Font */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/50 p-3 rounded-xl border border-white/10 focus-within:border-brand-500 transition">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-brand-500" />
                        Ignition Date
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        min={todayStr}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer font-digital"
                      />
                    </div>

                    <div className="bg-black/50 p-3 rounded-xl border border-white/10 focus-within:border-brand-500 transition">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-brand-500" />
                        Check-In Date
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        min={pickupDate || todayStr}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer font-digital"
                      />
                    </div>
                  </div>

                  {/* Search / Launch CTA Button */}
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-brand hover:shadow-glow-orange flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 italic"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-200" />
                    <span>SCAN AVAILABLE FLEET ({vehicles.length} CERTIFIED)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Cockpit Guarantees */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-300 font-bold border-t border-white/[0.08] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-brand-500 stroke-[3]" />
                    ZERO DEPOSIT
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-brand-500 stroke-[3]" />
                    UNLIMITED KM
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-brand-500 stroke-[3]" />
                    FREE CANCEL
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: High-End Cockpit Instrument HUD */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-end items-end space-y-6">
              
              {/* Telemetry Instrument Cluster Box */}
              <div className="bg-[#10141c]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-cockpit space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                    COCKPIT INSTRUMENT CLUSTER
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    DIAGNOSTIC: OK
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 font-mono block">
                    {currentCar.brand}
                  </span>
                  <h3 className="text-2xl font-black text-white italic tracking-wide">
                    {currentCar.tagline}
                  </h3>
                  <p className="text-xs font-bold text-brand-500 tracking-wider">
                    {currentCar.subtitle}
                  </p>
                </div>

                {/* Digital Speedometer & RPM Redline Bar */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/60 p-3 rounded-xl border border-white/[0.08] text-center">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">REDLINE RPM</span>
                    <span className="text-lg font-black text-brand-400 font-digital tracking-wider">
                      {currentCar.rpm}
                    </span>
                  </div>
                  <div className="bg-black/60 p-3 rounded-xl border border-white/[0.08] text-center">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">TURBO BOOST</span>
                    <span className="text-lg font-black text-white font-digital tracking-wider">
                      {currentCar.boost}
                    </span>
                  </div>
                </div>

                {/* Model badge */}
                <div className="p-3 bg-black/60 rounded-xl border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{currentCar.model}</span>
                  <span className="text-brand-400 font-bold font-digital">{currentCar.specs}</span>
                </div>
              </div>

              {/* Action Buttons & Slide Controls */}
              <div className="flex items-center gap-4">
                <Link
                  to="/vehicles"
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white flex items-center justify-center shadow-brand hover:shadow-glow-orange hover:scale-105 transition"
                  title="Explore Cockpit"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </Link>

                <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-xs font-mono text-slate-300">
                  <button
                    onClick={prevHeroSlide}
                    className="hover:text-brand-500 transition"
                    title="Previous Vehicle"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold tracking-widest font-digital">
                    0{heroSlide} / 0{totalSlides}
                  </span>
                  <button
                    onClick={nextHeroSlide}
                    className="hover:text-brand-500 transition"
                    title="Next Vehicle"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CARBON FIBRE MARQUEE BRAND STRIP
          ========================================================================= */}
      <section className="bg-[#0b0e14] border-y border-white/[0.08] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 sm:gap-10">
            {luxuryMarques.map((marque, i) => (
              <span
                key={i}
                className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-slate-400 hover:text-brand-400 transition cursor-default italic"
              >
                {marque}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ICONIC CARS FOR EVERY JOURNEY: VEHICULAR CATEGORY SHOWCASE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="our-fleet">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest font-mono">
            <Gauge className="w-3.5 h-3.5" />
            MOTORSPORT CLASSIFICATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight italic">
            Iconic Machines For Every Mission.
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Calibrated and tuned for high-speed coastal expressways, mountain hairpin apexes, or five-star city curb arrival.
          </p>
        </div>

        {/* 4 Cards Grid in Vehicular Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleetCategories.map((item, idx) => (
            <Link
              to={`/vehicles?type=${item.type}`}
              key={idx}
              className="group relative rounded-2xl overflow-hidden bg-[#12161f] border border-white/[0.08] hover:border-brand-500/60 shadow-cockpit transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-black/20 to-transparent" />
                  
                  <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold text-brand-400 border border-brand-500/30 uppercase tracking-widest font-mono">
                    {item.count}
                  </div>

                  <div className="absolute bottom-3 left-3.5 text-[11px] font-digital font-bold text-white bg-black/70 px-2.5 py-0.5 rounded backdrop-blur-md border border-white/10">
                    {item.telemetry}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest font-mono block">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-brand-400 transition italic">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/[0.06]">
                <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-wider font-mono transition">
                  INSPECT SQUADRON
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] group-hover:bg-brand-500 text-slate-300 group-hover:text-white flex items-center justify-center transition">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          REAL-TIME SHOWROOM FLEET GRID
          ========================================================================= */}
      <section className="bg-[#0b0e14] py-20 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-1 block font-mono">
                TELEMETRY READY // DISPATCH QUEUE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight italic">
                Active Machines in Hangar
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition font-mono ${
                    selectedCategory === cat.id
                      ? 'bg-brand-500 text-white shadow-brand'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-[#12161f] rounded-2xl border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : displayedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onBook={handleBook} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#12161f] rounded-2xl border border-white/10">
              <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No machines in this hangar queue</h3>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="mt-4 px-4 py-2 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-brand font-mono"
              >
                Reset Queue
              </button>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest border border-white/10 hover:border-brand-500/50 transition font-mono italic"
            >
              <span>ACCESS COMPLETE CATALOG ({vehicles.length} VEHICLES)</span>
              <ArrowRight className="w-4 h-4 text-brand-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3-STEP DRIVER LAUNCH PROTOCOL
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="how-it-works">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400 block font-mono">
            FRICTIONLESS ENGAGEMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight italic">
            Driver Launch Protocol in 3 Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            100% digital authorization. Zero queue counters. Keyless Bluetooth mobile unlock or curbside drop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#10141c] p-8 rounded-2xl border border-white/[0.08] hover:border-brand-500/40 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-black text-lg mb-6 shadow-sm font-digital">
              01
            </div>
            <h3 className="text-lg font-black text-white mb-2 italic">Select Machine &amp; Hangar</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Choose your exact sports coupe, SUV, or sedan. Pick dates, curbside valet or hub pick-up, with zero hidden surcharges.
            </p>
          </div>

          <div className="bg-[#10141c] p-8 rounded-2xl border border-white/[0.08] hover:border-brand-500/40 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-black text-lg mb-6 shadow-sm font-digital">
              02
            </div>
            <h3 className="text-lg font-black text-white mb-2 italic">Instant Telemetry KYC</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Upload your Driver&apos;s License and verification. Machine intelligence confirms qualification in under 120 seconds.
            </p>
          </div>

          <div className="bg-[#10141c] p-8 rounded-2xl border border-white/[0.08] hover:border-brand-500/40 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-black text-lg mb-6 shadow-sm font-digital">
              03
            </div>
            <h3 className="text-lg font-black text-white mb-2 italic">Ignite, Launch &amp; Return</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Take the keys, verify check-in telemetry on your phone, enjoy unlimited track kilometers, and return with one tap.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE DRIVEEASE SAFETY & TELEMETRY STANDARD
          ========================================================================= */}
      <section className="bg-[#0b0e14] py-20 border-y border-white/[0.08]" id="why-driveease">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 block font-mono">
                THE DRIVEEASE RIGOR
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight italic">
                Engineered for High-Output Driving
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                Every machine undergoes an exhaustive 40-point safety and dyno telemetry check prior to release.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white italic">Zero Liability Shield</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">
                      Complete comprehensive CDW protection and tire-rim coverage included automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white italic">Exact VIN Guarantee</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">
                      Drive the exact machine model, engine package, and chassis color shown — never a downgrade.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white italic">24/7 Rapid Pit Crew Roadside</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">
                      Rapid dispatch fleet technicians and flatbed assistance stationed across all active metros.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Telemetry Metric Tiles */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-[#12161f] p-6 rounded-2xl border border-white/[0.08] text-center space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-white block font-digital">
                  50,000+
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">
                  EXPEDITIONS COMPLETED
                </span>
              </div>

              <div className="bg-[#12161f] p-6 rounded-2xl border border-white/[0.08] text-center space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-brand-500 block font-digital">
                  4.9 / 5.0
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">
                  DRIVER SATISFACTION
                </span>
              </div>

              <div className="bg-[#12161f] p-6 rounded-2xl border border-white/[0.08] text-center space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-white block font-digital">
                  100%
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">
                  EXACT VIN MATCH
                </span>
              </div>

              <div className="bg-[#12161f] p-6 rounded-2xl border border-white/[0.08] text-center space-y-2">
                <span className="text-3xl sm:text-4xl font-black text-brand-500 block font-digital">
                  &lt; 2 MIN
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">
                  DISPATCH VERIFICATION
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400 block font-mono">
            DISPATCH QUERIES
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight italic">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 font-sans">
          {[
            {
              q: 'How does self-drive car rental work with DriveEase?',
              a: 'Select your machine, set reservation dates, and verify your ID in under 2 minutes. We deliver the fueled, sanitized vehicle directly to your doorstep or airport valet hub with keyless access.'
            },
            {
              q: 'Is there a security deposit required?',
              a: 'DriveEase offers zero security deposit on select verified profiles. For exotic coupes and flagships, a minimal pre-authorization hold is placed on your card and automatically released upon safe check-in.'
            },
            {
              q: 'What documents are required to pilot a vehicle?',
              a: 'You only need a valid Government ID and an active Driver’s License (minimum 1 year driving experience). Digital verification takes under 2 minutes.'
            },
            {
              q: 'What is the cancellation policy?',
              a: 'We provide 100% free cancellation with a full refund up to 24 hours prior to your scheduled reservation pick-up time. Zero questions asked.'
            },
            {
              q: 'Is insurance and roadside assistance included?',
              a: 'Yes! Every DriveEase rental includes comprehensive insurance with third-party liability and 24/7 on-demand roadside assistance across all coverage cities.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#10141c] rounded-xl border border-white/[0.08] overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-brand-400 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-brand-500' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          BOOKING MODAL
          ========================================================================= */}
      {isBookingOpen && selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedVehicle(null);
          }}
          onSuccess={() => {
            setIsBookingOpen(false);
            setSelectedVehicle(null);
          }}
        />
      )}

    </div>
  );
};
