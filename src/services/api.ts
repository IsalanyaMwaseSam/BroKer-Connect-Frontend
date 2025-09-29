import { Property, Booking, Transaction, Review } from '../types';
import { authService } from './auth';

class ApiService {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Properties
  async getProperties(filters?: {
    category?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    rooms?: number;
  }): Promise<Property[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${this.baseURL}/properties?${params}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getProperty(id: string): Promise<Property> {
    const response = await fetch(`${this.baseURL}/properties/${id}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Property not found');
    }
    
    const property = await response.json();
    return {
      ...property,
      createdAt: new Date(property.createdAt),
      updatedAt: new Date(property.updatedAt)
    };
  }

  async createProperty(propertyData: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/properties`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        title: propertyData.title,
        description: propertyData.description,
        category: propertyData.category,
        price: propertyData.price,
        currency: propertyData.currency,
        district: propertyData.location.district,
        area: propertyData.location.area,
        address: propertyData.location.address,
        size: propertyData.features.size,
        rooms: propertyData.features.rooms,
        bathrooms: propertyData.features.bathrooms,
        amenities: propertyData.features.amenities,
        images: propertyData.images
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create property');
    }
    
    return response.json();
  }

  async getBrokerProperties(): Promise<Property[]> {
    const response = await fetch(`${this.baseURL}/properties/broker/properties`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch broker properties');
    }
    
    const properties = await response.json();
    return properties.map((property: any) => ({
      ...property,
      createdAt: new Date(property.createdAt),
      updatedAt: new Date(property.updatedAt)
    }));
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const response = await fetch(`${this.baseURL}/properties/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    return response.json();
  }

  // Bookings
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const response = await fetch(`${this.baseURL}/bookings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bookingData),
    });
    return response.json();
  }

  async getBookings(userId?: string): Promise<Booking[]> {
    const url = userId ? `${this.baseURL}/bookings?userId=${userId}` : `${this.baseURL}/bookings`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const response = await fetch(`${this.baseURL}/bookings/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  // Reviews
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const response = await fetch(`${this.baseURL}/reviews`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reviewData),
    });
    return response.json();
  }

  async getBrokerReviews(brokerId: string): Promise<Review[]> {
    const response = await fetch(`${this.baseURL}/reviews/broker/${brokerId}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();