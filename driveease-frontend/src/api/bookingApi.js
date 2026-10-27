import { apiClient, mockStore } from './client';

export const bookingApi = {
  // POST /api/bookings
  createBooking: async ({ vehicleId, userId, startDate, endDate }) => {
    try {
      const response = await apiClient.post('/bookings', {
        vehicleId,
        userId,
        startDate,
        endDate,
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        // Mock fallback
        const bookings = mockStore.getBookings();
        const newBooking = {
          id: Date.now(),
          vehicleId: Number(vehicleId),
          userId: Number(userId),
          startDate,
          endDate,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        bookings.push(newBooking);
        mockStore.saveBookings(bookings);

        // In backend, vehicle status might change when confirmed, but we also mirror it
        return newBooking;
      }
      throw err;
    }
  },

  // GET /api/bookings
  getAllBookings: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (err) {
      if (!err.response) {
        return mockStore.getBookings();
      }
      throw err;
    }
  },

  // GET /api/bookings/{id}
  getBookingById: async (id) => {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const found = mockStore.getBookings().find((b) => String(b.id) === String(id));
        if (found) return found;
        throw new Error('Booking not found');
      }
      throw err;
    }
  },

  // POST /api/bookings/{id}/cancel
  cancelBooking: async (id) => {
    try {
      const response = await apiClient.post(`/bookings/${id}/cancel`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const bookings = mockStore.getBookings();
        const index = bookings.findIndex((b) => String(b.id) === String(id));
        if (index !== -1) {
          bookings[index].status = 'CANCELLED';
          bookings[index].updatedAt = new Date().toISOString();
          mockStore.saveBookings(bookings);

          // Return vehicle to available
          const vehicles = mockStore.getVehicles();
          const vIdx = vehicles.findIndex((v) => v.id === bookings[index].vehicleId);
          if (vIdx !== -1) {
            vehicles[vIdx].status = 'AVAILABLE';
            mockStore.saveVehicles(vehicles);
          }
          return bookings[index];
        }
        throw new Error('Booking not found');
      }
      throw err;
    }
  },

  // POST /api/bookings/{id}/return
  returnBooking: async (id) => {
    try {
      const response = await apiClient.post(`/bookings/${id}/return`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        const bookings = mockStore.getBookings();
        const index = bookings.findIndex((b) => String(b.id) === String(id));
        if (index !== -1) {
          bookings[index].status = 'COMPLETED';
          bookings[index].updatedAt = new Date().toISOString();
          mockStore.saveBookings(bookings);

          // Return vehicle to available
          const vehicles = mockStore.getVehicles();
          const vIdx = vehicles.findIndex((v) => v.id === bookings[index].vehicleId);
          if (vIdx !== -1) {
            vehicles[vIdx].status = 'AVAILABLE';
            mockStore.saveVehicles(vehicles);
          }
          return bookings[index];
        }
        throw new Error('Booking not found');
      }
      throw err;
    }
  },

  // PATCH /api/bookings/{id}/status?status=... (ADMIN)
  updateBookingStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/bookings/${id}/status`, null, {
        params: { status },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        const bookings = mockStore.getBookings();
        const index = bookings.findIndex((b) => String(b.id) === String(id));
        if (index !== -1) {
          bookings[index].status = status;
          bookings[index].updatedAt = new Date().toISOString();
          mockStore.saveBookings(bookings);

          // Mirror vehicle status updates based on backend logic
          const vehicles = mockStore.getVehicles();
          const vIdx = vehicles.findIndex((v) => v.id === bookings[index].vehicleId);
          if (vIdx !== -1) {
            if (status === 'CONFIRMED') vehicles[vIdx].status = 'RESERVED';
            else if (status === 'ACTIVE') vehicles[vIdx].status = 'RENTED';
            else if (status === 'COMPLETED' || status === 'CANCELLED') vehicles[vIdx].status = 'AVAILABLE';
            mockStore.saveVehicles(vehicles);
          }

          return bookings[index];
        }
        throw new Error('Booking not found');
      }
      throw err;
    }
  },
};
