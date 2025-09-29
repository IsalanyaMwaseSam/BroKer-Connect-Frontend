import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          // Try to get fresh user data from server
          const { userService } = await import('../services/user');
          const freshUser = await userService.getCurrentUser();
          setUser(freshUser);
        } catch (error) {
          // Fallback to stored user data
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      }
      setLoading(false);
    };
    
    initializeUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password);
    authService.setAuth(user, token);
    setUser(user);
  };

  const register = async (userData: any) => {
    const { user, token } = await authService.register(userData);
    authService.setAuth(user, token);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, login, register, logout };
};