import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const VehicleFilters = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  onReset,
}) => {
  const vehicleTypes = ['ALL', 'SEDAN', 'SUV', 'COUPE', 'HATCHBACK', 'LUXURY'];
  const statusOptions = ['ALL', 'AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE'];

  return (
    <div className="bg-[#12151b] rounded-3xl border border-white/[0.08] p-5 sm:p-7 shadow-2xl mb-8 space-y-5">
      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make, model, or plate (e.g. Porsche 911, Tesla Model S, BMW M4, Audi RS)..."
            className="w-full pl-11 pr-4 py-3 bg-[#161920] border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-3 px-4 bg-[#161920] border border-white/10 rounded-2xl text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-500 transition cursor-pointer"
          >
            <option value="featured" className="bg-[#161920] text-white">Featured Popularity</option>
            <option value="price-asc" className="bg-[#161920] text-white">Daily Rate: Low to High</option>
            <option value="price-desc" className="bg-[#161920] text-white">Daily Rate: High to Low</option>
            <option value="year-desc" className="bg-[#161920] text-white">Model Year: Newest First</option>
            <option value="brand" className="bg-[#161920] text-white">Brand Alphabetical</option>
          </select>

          <button
            onClick={onReset}
            className="p-3 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-2xl transition border border-white/10"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
        {/* Vehicle Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          {vehicleTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                selectedType === type
                  ? 'bg-brand-500 text-white shadow-brand font-bold'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Fleet Status */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
