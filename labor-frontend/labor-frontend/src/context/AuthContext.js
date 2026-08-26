import React, { createContext, useContext, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (authResponse) => {
    localStorage.setItem('token', authResponse.token);
    const userData = {
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      role: authResponse.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    persist(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    persist(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = (partialUpdate) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partialUpdate };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
