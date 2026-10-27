import { apiClient, mockStore } from './client';

export const vehicleApi = {
  // GET /api/vehicles
  getAllVehicles: async () => {
    try {
      const response = await apiClient.get('/vehicles');
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockStore.getVehicles();
      }
      throw err;
    }
  },

  // GET /api/vehicles/available
  getAvailableVehicles: async () => {
    try {
      const response = await apiClient.get('/vehicles/available');
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockStore.getVehicles().filter((v) => v.status === 'AVAILABLE');
      }
      throw err;
    }
  },

  // GET /api/vehicles/{id}
  getVehicleById: async (id) => {
    try {
      const response = await apiClient.get(`/vehicles/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const found = mockStore.getVehicles().find((v) => String(v.id) === String(id));
        if (found) return found;
        throw new Error('Vehicle not found');
      }
      throw err;
    }
  },

  // POST /api/vehicles (ADMIN)
  createVehicle: async (vehicleData) => {
    try {
      const response = await apiClient.post('/vehicles', vehicleData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const list = mockStore.getVehicles();
        const newVehicle = {
          ...vehicleData,
          id: Date.now(),
          dailyRate: Number(vehicleData.dailyRate),
          year: Number(vehicleData.year),
          status: 'AVAILABLE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        list.push(newVehicle);
        mockStore.saveVehicles(list);
        return newVehicle;
      }
      throw err;
    }
  },

  // PUT /api/vehicles/{id} (ADMIN)
  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const list = mockStore.getVehicles();
        const index = list.findIndex((v) => String(v.id) === String(id));
        if (index !== -1) {
          list[index] = {
            ...list[index],
            ...vehicleData,
            dailyRate: Number(vehicleData.dailyRate),
            year: Number(vehicleData.year),
            updatedAt: new Date().toISOString(),
          };
          mockStore.saveVehicles(list);
          return list[index];
        }
        throw new Error('Vehicle not found');
      }
      throw err;
    }
  },

  // DELETE /api/vehicles/{id} (ADMIN)
  deleteVehicle: async (id) => {
    try {
      const response = await apiClient.delete(`/vehicles/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const list = mockStore.getVehicles().filter((v) => String(v.id) !== String(id));
        mockStore.saveVehicles(list);
        return true;
      }
      throw err;
    }
  },

  // PATCH /api/vehicles/{id}/status?status=... (ADMIN)
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/vehicles/${id}/status`, null, {
        params: { status },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        const list = mockStore.getVehicles();
        const index = list.findIndex((v) => String(v.id) === String(id));
        if (index !== -1) {
          list[index].status = status;
          list[index].updatedAt = new Date().toISOString();
          mockStore.saveVehicles(list);
          return list[index];
        }
        throw new Error('Vehicle not found');
      }
      throw err;
    }
  },
};
