import axios from 'axios';
import { INITIAL_VEHICLES, INITIAL_BOOKINGS, DEMO_USERS } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
});

// Request interceptor: add JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('driveease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only clear if on protected actions
      console.warn('Session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);

// ============================================================
// Client-Side Mock Store for seamless testing / demo when
// Spring Boot microservices are not currently booted up.
// Uses localStorage so updates persist across reloads!
// ============================================================
class MockDataService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('driveease_mock_vehicles')) {
      localStorage.setItem('driveease_mock_vehicles', JSON.stringify(INITIAL_VEHICLES));
    }
    if (!localStorage.getItem('driveease_mock_bookings')) {
      localStorage.setItem('driveease_mock_bookings', JSON.stringify(INITIAL_BOOKINGS));
    }
  }

  getVehicles() {
    this.init();
    return JSON.parse(localStorage.getItem('driveease_mock_vehicles') || '[]');
  }

  saveVehicles(vehicles) {
    localStorage.setItem('driveease_mock_vehicles', JSON.stringify(vehicles));
  }

  getBookings() {
    this.init();
    return JSON.parse(localStorage.getItem('driveease_mock_bookings') || '[]');
  }

  saveBookings(bookings) {
    localStorage.setItem('driveease_mock_bookings', JSON.stringify(bookings));
  }

  resetMockData() {
    localStorage.setItem('driveease_mock_vehicles', JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem('driveease_mock_bookings', JSON.stringify(INITIAL_BOOKINGS));
  }
}

export const mockStore = new MockDataService();
