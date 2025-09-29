import { Broker, User } from '../types';
import { authService } from './auth';

class AdminService {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getPendingBrokers(): Promise<Broker[]> {
    const response = await fetch(`${this.baseURL}/admin/brokers/pending`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch brokers');
    }
    
    const brokers = await response.json();
    return brokers.map((broker: any) => ({
      ...broker,
      createdAt: new Date(broker.createdAt)
    }));
  }

  async verifyBroker(brokerId: string, action: 'approve' | 'reject'): Promise<void> {
    const response = await fetch(`${this.baseURL}/admin/brokers/${brokerId}/verify`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ action }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update broker verification');
    }
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseURL}/admin/users`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const users = await response.json();
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  }
}

export const adminService = new AdminService();