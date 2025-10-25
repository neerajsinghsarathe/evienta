import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'customer' | 'vendor' | 'admin') => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      const token = localStorage.getItem('evienta_token');
      if (token) {
        try {
          if(user===null){
            const userData = await apiService.getCurrentUser();
            setUser(userData);
          }
        } catch (error) {
          localStorage.removeItem('evienta_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  if(loading){
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      localStorage.setItem('evienta_token', response.token);
      setUser(response.user);
      navigate('/profile');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'customer' | 'vendor' | 'admin') => {
    setLoading(true);
    try {
      const response = await apiService.register({ email, password, name, role });
      //localStorage.setItem('evienta_token', response.token);
      setUser(response.user);
      // Role-based navigation
      navigate('/login');
      // if (response.user.role === 'customer') {
      //   navigate('/dashboard/user');
      // } else if (response.user.role === 'vendor') {
      //   navigate('/dashboard/vendor');
      // } else {
      //   navigate('/dashboard/admin');
      // }
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