import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, MessageSquare, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Property, Booking } from '../../types';

const BrokerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalViews: 0,
    pendingBookings: 0,
    monthlyInquiries: 0
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Mock data - replace with API calls
    setStats({
      totalProperties: 12,
      activeListings: 8,
      totalViews: 1247,
      pendingBookings: 3,
      monthlyInquiries: 28
    });
  }, []);

  const isVerified = user?.role === 'broker' && (user as any).verificationStatus === 'verified';

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Account Verification Pending</h2>
            <p className="text-yellow-700 mb-4">
              Your broker account is currently under review. You'll be able to access your dashboard once verified.
            </p>
            <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
              <h3 className="font-medium text-gray-900 mb-2">Verification Requirements:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ License Number: {(user as any)?.licenseNumber}</li>
                <li>✓ National ID: {(user as any)?.nin}</li>
                <li>⏳ Admin Review: In Progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Broker Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <Link to="/broker/properties/new" className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
            <Plus size={16} />
            <span>Add Property</span>
          </Link>
        </div>

        {/* Verification Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-800">Account Verified</p>
            <p className="text-xs text-green-600">You can now list properties and receive bookings</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Properties</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Listings</p>
                <p className="text-xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Views</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Bookings</p>
                <p className="text-xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Monthly Inquiries</p>
                <p className="text-xl font-bold text-gray-900">{stats.monthlyInquiries}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Link to="/broker/properties" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Properties</h3>
                <p className="text-xs text-gray-600">View and edit your listings</p>
              </div>
            </div>
          </Link>

          <Link to="/broker/bookings" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View Bookings</h3>
                <p className="text-xs text-gray-600">Manage property visits</p>
              </div>
            </div>
          </Link>

          <Link to="/broker/messages" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Messages</h3>
                <p className="text-xs text-gray-600">Chat with clients</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Recent Properties</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Modern House in Kololo</p>
                    <p className="text-xs text-gray-600">45 views • 2 inquiries</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Pending Bookings</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Jane Doe</p>
                    <p className="text-xs text-gray-600">House in Kampala • Tomorrow 2PM</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Accept</button>
                    <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;