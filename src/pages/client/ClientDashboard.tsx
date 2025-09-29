import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Calendar, MessageSquare, Eye, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    savedProperties: 0,
    activeBookings: 0,
    viewedProperties: 0,
    messages: 0
  });


  useEffect(() => {
    // Mock data
    setStats({
      savedProperties: 8,
      activeBookings: 2,
      viewedProperties: 24,
      messages: 5
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/properties" className="btn-primary flex items-center space-x-2">
              <Search size={16} />
              <span>Browse Properties</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Saved</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.savedProperties}</p>
              </div>
              <Heart className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Bookings</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Viewed</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.viewedProperties}</p>
              </div>
              <Eye className="w-6 h-6 text-purple-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Messages</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.messages}</p>
              </div>
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link to="/properties" className="card hover:shadow-md transition-shadow">
            <div className="text-center p-2">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">Search</h3>
              <p className="text-xs text-gray-600 truncate">Find properties</p>
            </div>
          </Link>

          <Link to="/client/favorites" className="card hover:shadow-md transition-shadow">
            <div className="text-center p-2">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 mx-auto mb-1 sm:mb-2" />
              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">Saved</h3>
              <p className="text-xs text-gray-600 truncate">Favorites</p>
            </div>
          </Link>

          <Link to="/my-bookings" className="card hover:shadow-md transition-shadow">
            <div className="text-center p-2">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-1 sm:mb-2" />
              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">Bookings</h3>
              <p className="text-xs text-gray-600 truncate">Visits</p>
            </div>
          </Link>

          <Link to="/my-properties" className="card hover:shadow-md transition-shadow">
            <div className="text-center p-2">
              <Home className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-1 sm:mb-2" />
              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">Properties</h3>
              <p className="text-xs text-gray-600 truncate">Taken</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Recently Viewed</h3>
              <Link to="/client/history" className="text-xs text-primary-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Modern House in Kololo</p>
                    <p className="text-xs text-gray-600">450M UGX • Kampala</p>
                  </div>
                  <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Upcoming Visits</h3>
              <Link to="/my-bookings" className="text-xs text-primary-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium">House Visit - Kololo</p>
                      <p className="text-xs text-gray-600">with John Broker</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Confirmed</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Tomorrow, 2:00 PM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Properties */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Recommended for You</h3>
            <Link to="/properties" className="text-xs text-primary-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full h-32 bg-gray-200"></div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1">Modern Apartment</h4>
                  <p className="text-xs text-gray-600 mb-2">Kampala • 2 bed, 2 bath</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-primary-600">300M UGX</span>
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;