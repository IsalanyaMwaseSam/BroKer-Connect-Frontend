import { User } from '../types';
import { authService } from './auth';

class UserService {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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