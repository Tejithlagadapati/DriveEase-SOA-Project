import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { DEMO_USERS } from '../api/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('driveease_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('driveease_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('driveease_token', token);
      localStorage.setItem('driveease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('driveease_token');
      localStorage.removeItem('driveease_user');
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      // data: { token, userId, name, email, role }
      setToken(data.token);
      const userData = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('driveease_token');
    localStorage.removeItem('driveease_user');
  };

  // Quick switch for presentation / testing
  const loginAsDemo = async (roleType = 'ADMIN') => {
    const demoUser = DEMO_USERS.find((u) => u.role === roleType) || DEMO_USERS[0];
    return await login(demoUser.email, demoUser.password);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
