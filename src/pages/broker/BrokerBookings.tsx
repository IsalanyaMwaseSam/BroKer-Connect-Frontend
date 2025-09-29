import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, User, CheckCircle, X, Eye, Edit } from 'lucide-react';
import RescheduleModal from '../../components/RescheduleModal';

interface Booking {
  id: string;
  client_name: string;
  client_phone: string;
  property_title: string;
  district: string;
  area: string;
  visit_date: string;
  visit_time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'reschedule_pending' | 'counter_pending';
  created_at: string;
}

const BrokerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/bookings/broker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadBookings();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleReschedule = async (bookingId: string, newDate: string, newTime: string, message: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          visitDate: newDate, 
          visitTime: newTime, 
          message 
        })
      });

      if (response.ok) {
        loadBookings();
        alert('Reschedule request sent to client');
      }
    } catch (error) {
      console.error('Failed to reschedule booking:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'reschedule_pending': return 'bg-orange-100 text-orange-800';
      case 'counter_pending': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Property Visit Bookings</h1>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'reschedule_pending', label: 'Awaiting Client' },
            { key: 'counter_pending', label: 'Counter Proposal' },
            { key: 'completed', label: 'Completed' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label} ({bookings.filter(b => key === 'all' || b.status === key).length})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="card text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{booking.property_title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <User size={14} className="mr-2" />
                          <span>{booking.client_name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-2" />
                          <span>{booking.client_phone}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          <span>{new Date(booking.visit_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-2" />
                          <span>{formatTime(booking.visit_time)}</span>
                        </div>
                      </div>
                    </div>

                    {booking.message && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">{booking.message}</p>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <CheckCircle size={14} />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Edit size={14} />
                          <span>Reschedule</span>
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        <Eye size={14} />
                        <span>Mark as Completed</span>
                      </button>
                    )}

                    {booking.status === 'counter_pending' && (
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-purple-900">Client Counter-Proposal</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Response Needed</span>
                        </div>
                        <p className="text-sm text-purple-700 mb-3">
                          {booking.client_name} proposed: {new Date(booking.visit_date).toLocaleDateString()} at {formatTime(booking.visit_time)}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            <CheckCircle size={14} />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            <Edit size={14} />
                            <span>Reschedule Again</span>
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            <X size={14} />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reschedule Modal */}
        <RescheduleModal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          onReschedule={handleReschedule}
        />
      </div>
    </div>
  );
};

export default BrokerBookings;