import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vehicleApi } from '../api/vehicleApi';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleFilters } from '../components/vehicles/VehicleFilters';
import { BookingModal } from '../components/vehicles/BookingModal';
import { Car, RefreshCw, Award, Gauge, Zap } from 'lucide-react';

export const Vehicles = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');

  // Booking Modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load fleet catalog', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setSortBy('featured');
  };

  const handleBook = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingOpen(true);
  };

  // Filter and sort computation
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          (v.brand && v.brand.toLowerCase().includes(q)) ||
          (v.model && v.model.toLowerCase().includes(q)) ||
          (v.registrationNumber && v.registrationNumber.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (selectedType !== 'ALL') {
      result = result.filter(
        (v) => (v.vehicleType || '').toUpperCase() === selectedType.toUpperCase()
      );
    }

    // Status filter
    if (selectedStatus !== 'ALL') {
      result = result.filter(
        (v) => (v.status || '').toUpperCase() === selectedStatus.toUpperCase()
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate));
    } else if (sortBy === 'year-desc') {
      result.sort((a, b) => Number(b.year) - Number(a.year));
    } else if (sortBy === 'brand') {
      result.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
    }

    return result;
  }, [vehicles, searchQuery, selectedType, selectedStatus, sortBy]);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-automotive">
      {/* Top Banner with Cockpit Styling */}
      <div className="relative rounded-2xl overflow-hidden bg-[#10141c] border border-white/[0.08] mb-8 p-8 sm:p-10 shadow-cockpit">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest font-mono">
              <Gauge className="w-3.5 h-3.5" />
              VERIFIED MOTORSPORT REGISTRY
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight italic">
              The DriveEase Hangar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Every machine is dyno-tested, guaranteed exact-VIN delivery, and accompanied by our 24/7 rapid pit crew support.
            </p>
          </div>

          <button
            onClick={fetchVehicles}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200 hover:text-white text-xs font-bold font-mono shadow-sm hover:border-brand-500/50 transition uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-500' : ''}`} />
            Sync Telemetry
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <VehicleFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-6 font-mono">
        <span>
          HANGAR CAPACITY: <strong className="text-white font-black">{filteredVehicles.length}</strong> ACTIVE MACHINES
        </span>
        {filteredVehicles.length !== vehicles.length && (
          <span className="text-brand-400 font-bold uppercase tracking-wider">FILTERS ENGAGED</span>
        )}
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-96 bg-[#12161f] rounded-2xl border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onBook={handleBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#12161f] rounded-2xl border border-white/10">
          <Car className="w-14 h-14 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-black text-white italic">No machines match this telemetry filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-sans">
            Adjust your criteria or reset filters to display the complete fleet collection.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 bg-brand-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-brand hover:bg-brand-600 transition font-mono italic"
          >
            RESET TELEMETRY FILTER
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vehicle={selectedVehicle}
        onSuccess={() => {
          fetchVehicles();
        }}
      />
    </div>
  );
};
