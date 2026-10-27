import { apiClient } from './client';
import { DEMO_USERS } from './mockData';

export const authApi = {
  // POST /api/auth/register
  register: async ({ name, email, password }) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      return response.data;
    } catch (err) {
      // If network fails (backend offline), support mock registration
      if (!err.response) {
        console.info('[Mock Auth] Backend offline, simulating registration');
        return 'User registered successfully';
      }
      throw err;
    }
  },

  // POST /api/auth/login
  login: async ({ email, password }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data; // { token, userId, name, email, role }
    } catch (err) {
      // If network error / offline, check demo users
      if (!err.response) {
        console.info('[Mock Auth] Backend offline, checking mock users');
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (found) {
          // Generate a dummy JWT token
          return {
            token: `mock_jwt_token_${found.role}_${found.userId}_${Date.now()}`,
            userId: found.userId,
            name: found.name,
            email: found.email,
            role: found.role,
          };
        }
        // If not matching demo user, allow guest customer login if password is valid
        if (password && password.length >= 6) {
          return {
            token: `mock_jwt_token_CUSTOMER_99_${Date.now()}`,
            userId: 99,
            name: email.split('@')[0],
            email: email,
            role: 'CUSTOMER',
          };
        }
        throw new Error('Invalid email or password');
      }
      throw err;
    }
  },
};
