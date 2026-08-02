import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verify token validity on load if token exists
    if (user?.token) {
      axiosClient
        .get('/auth/me')
        .then((res) => {
          if (res.data.success) {
            setUser((prev) => ({ ...prev, ...res.data.data }));
          }
        })
        .catch(() => {
          localStorage.removeItem('userInfo');
          setUser(null);
        });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/login', { email, password });
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        toast.success(`Welcome back, ${data.data.name}!`);
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/register', { name, email, password, role });
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        toast.success('Account created successfully!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
