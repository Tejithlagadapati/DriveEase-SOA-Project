import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { vehicleApi } from '../../api/vehicleApi';
import { useToast } from '../../context/ToastContext';
import { AlertCircle, Plus, Check } from 'lucide-react';

export const VehicleFormModal = ({ isOpen, onClose, vehicleToEdit, onSaved }) => {
  const isEditing = !!vehicleToEdit;
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    vehicleType: 'SEDAN',
    year: new Date().getFullYear(),
    dailyRate: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        registrationNumber: vehicleToEdit.registrationNumber || '',
        brand: vehicleToEdit.brand || '',
        model: vehicleToEdit.model || '',
        vehicleType: vehicleToEdit.vehicleType || 'SEDAN',
        year: vehicleToEdit.year || new Date().getFullYear(),
        dailyRate: vehicleToEdit.dailyRate || '',
      });
    } else {
      setFormData({
        registrationNumber: '',
        brand: '',
        model: '',
        vehicleType: 'SEDAN',
        year: new Date().getFullYear(),
        dailyRate: '',
      });
    }
    setErrorMsg('');
  }, [vehicleToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.registrationNumber.trim()) {
      setErrorMsg('Registration plate number is required');
      return;
    }
    if (!formData.brand.trim()) {
      setErrorMsg('Brand is required');
      return;
    }
    if (!formData.model.trim()) {
      setErrorMsg('Model is required');
      return;
    }
    if (!formData.dailyRate || Number(formData.dailyRate) <= 0) {
      setErrorMsg('Daily rate must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        registrationNumber: formData.registrationNumber.trim().toUpperCase(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        vehicleType: formData.vehicleType,
        year: parseInt(formData.year, 10),
        dailyRate: parseFloat(formData.dailyRate),
      };

      if (isEditing) {
        await vehicleApi.updateVehicle(vehicleToEdit.id, payload);
        success(`Vehicle ${payload.brand} ${payload.model} updated successfully`);
      } else {
        await vehicleApi.createVehicle(payload);
        success(`New vehicle ${payload.brand} ${payload.model} added to fleet`);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Modify Vehicle #${vehicleToEdit.id}` : 'Commission New Vehicle Asset'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
              Registration Plate *
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g. KA-01-AB-1234"
              required
              className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs font-mono uppercase text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
              Vehicle Category *
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="SEDAN">SEDAN</option>
              <option value="SUV">SUV</option>
              <option value="COUPE">COUPE</option>
              <option value="HATCHBACK">HATCHBACK</option>
              <option value="LUXURY">LUXURY</option>
              <option value="TRUCK">TRUCK</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
              Brand / Manufacturer *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Porsche, Tesla, BMW"
              required
              className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
              Model Name *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. 911 Carrera, Model 3"
              required
              className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
              Model Year *
            </label>
            <input
              type="number"
              name="year"
              min="1900"
              max="2030"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
              Daily Rental Rate ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              name="dailyRate"
              value={formData.dailyRate}
              onChange={handleChange}
              placeholder="e.g. 120.00"
              required
              className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-xs font-black text-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 rounded-xl hover:bg-cream-150 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-brand transition flex items-center gap-1.5 uppercase tracking-wider hover:-translate-y-0.5"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Check className="w-4 h-4" />
                Update Asset
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Vehicle
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
