import React, { useState, useEffect, useMemo } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VehicleFormModal } from '../../components/admin/VehicleFormModal';
import { vehicleApi } from '../../api/vehicleApi';
import { useToast } from '../../context/ToastContext';
import {
  Car,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw
} from 'lucide-react';

export const AdminVehicles = () => {
  const { success, error: toastError } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      toastError('Failed to load fleet inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setVehicleToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setVehicleToEdit(v);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the fleet registry?`)) {
      return;
    }
    try {
      await vehicleApi.deleteVehicle(id);
      success(`Vehicle ${name} removed from fleet`);
      await fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Removal failed';
      toastError(msg);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await vehicleApi.updateStatus(id, newStatus);
      success(`Status updated to ${newStatus}`);
      await fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Status update failed';
      toastError(msg);
    }
  };

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          (v.brand && v.brand.toLowerCase().includes(q)) ||
          (v.model && v.model.toLowerCase().includes(q)) ||
          (v.registrationNumber && v.registrationNumber.toLowerCase().includes(q))
      );
    }

    if (filterType !== 'ALL') {
      result = result.filter(
        (v) => (v.vehicleType || '').toUpperCase() === filterType.toUpperCase()
      );
    }

    if (filterStatus !== 'ALL') {
      result = result.filter(
        (v) => (v.status || '').toUpperCase() === filterStatus.toUpperCase()
      );
    }

    return result;
  }, [vehicles, searchQuery, filterType, filterStatus]);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-6 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Fleet Inventory Registry
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Add new vehicles, update rental rates, and control operational statuses.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-brand transition flex items-center gap-2 self-start sm:self-auto hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-cream-50 rounded-3xl border border-cream-300 p-5 shadow-soft flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Make, Model, or Plate..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-2.5 px-3 bg-cream-100 border border-cream-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Classes</option>
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="COUPE">Coupe</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="LUXURY">Luxury</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2.5 px-3 bg-cream-100 border border-cream-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="RENTED">Rented</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <button
                onClick={fetchVehicles}
                className="p-2.5 border border-cream-300 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-cream-150 transition"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-cream-50 rounded-3xl border border-cream-300 shadow-soft overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-cream-150 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-150 border-b border-cream-300 text-stone-500 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Vehicle Model</th>
                      <th className="py-3.5 px-4">Plate Number</th>
                      <th className="py-3.5 px-4">Class</th>
                      <th className="py-3.5 px-4">Year</th>
                      <th className="py-3.5 px-4">Daily Rate</th>
                      <th className="py-3.5 px-4">Operational State</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {filteredVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-cream-100/60 transition">
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          {v.brand} {v.model}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                          {v.registrationNumber}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-600">
                          {v.vehicleType}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500">{v.year}</td>
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          ${Number(v.dailyRate).toFixed(2)}
                          <span className="text-[10px] text-stone-400 font-normal ml-1">/day</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={v.status}
                            onChange={(e) => handleStatusChange(v.id, e.target.value)}
                            className="text-xs font-semibold rounded-xl px-2.5 py-1 bg-cream-100 border border-cream-300 text-stone-800 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                          >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="RESERVED">RESERVED</option>
                            <option value="RENTED">RENTED</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                            <option value="INACTIVE">INACTIVE</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="p-2 text-stone-400 hover:text-brand-600 hover:bg-cream-150 rounded-xl transition"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(v.id, `${v.brand} ${v.model}`)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Remove Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-stone-400 text-xs">
                No fleet vehicles found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleToEdit={vehicleToEdit}
        onSaved={fetchVehicles}
      />
    </div>
  );
};
