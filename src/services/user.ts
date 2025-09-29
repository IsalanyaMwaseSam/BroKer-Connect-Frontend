import { User } from '../types';
import { authService } from './auth';
import { API_BASE_URL } from '../config/api';

class UserService {
  private baseURL = API_BASE_URL;

  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/me`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }
    
    const user = await response.json();
    return {
      ...user,
      createdAt: new Date(user.createdAt)
    };
  }
}

export const userService = new UserService();