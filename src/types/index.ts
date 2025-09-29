export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'broker' | 'client' | 'admin';
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Broker extends User {
  role: 'broker';
  licenseNumber: string;
  nin: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalReviews: number;
  commission: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  category: 'land' | 'rental' | 'house' | 'commercial';
  price: number;
  currency: 'UGX' | 'USD';
  location: {
    district: string;
    area?: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  features: {
    size: number;
    rooms?: number;
    bathrooms?: number;
    amenities: string[];
  };
  images: string[];
  videos?: string[];
  status: 'available' | 'sold' | 'rented' | 'pending';
  brokerId: string;
  isVerified: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  broker?: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    totalReviews: number;
  };
}

export interface Booking {
  id: string;
  propertyId: string;
  clientId: string;
  brokerId: string;
  visitDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  message?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: 'booking_fee' | 'deposit' | 'commission' | 'payment';
  amount: number;
  currency: 'UGX' | 'USD';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'mtn_money' | 'airtel_money' | 'bank_card' | 'cash';
  propertyId?: string;
  bookingId?: string;
  fromUserId: string;
  toUserId: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  brokerId: string;
  clientId: string;
  propertyId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: Date;
}