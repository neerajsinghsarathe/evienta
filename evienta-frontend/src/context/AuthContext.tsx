import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'user' | 'provider' | 'admin') => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      const token = localStorage.getItem('evienta_token');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          localStorage.removeItem('evienta_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      localStorage.setItem('evienta_token', response.token);
      setUser(response.user);
      // Role-based navigation
      if (response.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (response.user.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/user');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'user' | 'provider' | 'admin') => {
    setLoading(true);
    try {
      const response = await apiService.register({ email, password, name, role });
      localStorage.setItem('evienta_token', response.token);
      setUser(response.user);
      // Role-based navigation
      if (response.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (response.user.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/user');
      }
    } catch (error) {
      console.log("Registration Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('evienta_token');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};