import { User } from '../types';

class AuthService {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'broker' | 'client';
    licenseNumber?: string;
    nin?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setAuth(user: User, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
}

export const authService = new AuthService();