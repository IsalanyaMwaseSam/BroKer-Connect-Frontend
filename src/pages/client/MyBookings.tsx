import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, X, AlertCircle, Edit, Star } from 'lucide-react';
import RescheduleResponseModal from '../../components/RescheduleResponseModal';
import ReviewModal from '../../components/ReviewModal';

interface ClientBooking {
  id: string;
  property_id: string;
  broker_id: string;
  property_title: string;
  district: string;
  area: string;
  broker_name: string;
  broker_phone: string;
  visit_date: string;
  visit_time: string;
  client_name: string;
  client_phone: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'reschedule_pending' | 'counter_pending';
  created_at: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<ClientBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<ClientBooking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<ClientBooking | null>(null);
  const [reviewedBookings, setReviewedBookings] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBookings();
    checkReviewedBookings();
  }, []);

  const checkReviewedBookings = async () => {
    try {
      const reviewed = new Set<string>();
      for (const booking of bookings) {
        if (booking.status === 'completed') {
          const response = await fetch(`http://localhost:3001/api/reviews/booking/${booking.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (data.hasReview) {
            reviewed.add(booking.id);
          }
        }
      }
      setReviewedBookings(reviewed);
    } catch (error) {
      console.error('Failed to check reviewed bookings:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://brokerconnectug.netlify.app' : 'http://localhost:3001'}/api/bookings/client`, {
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle size={16} className="text-yellow-600" />;
      case 'confirmed': return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled': return <X size={16} className="text-red-600" />;
      case 'completed': return <CheckCircle size={16} className="text-blue-600" />;
      case 'reschedule_pending': return <Edit size={16} className="text-orange-600" />;
      case 'counter_pending': return <Clock size={16} className="text-purple-600" />;
      default: return null;
    }
  };

  const handleRescheduleResponse = async (bookingId: string, action: 'accept' | 'counter', newDate?: string, newTime?: string, message?: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/reschedule-response`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action, visitDate: newDate, visitTime: newTime, message })
      });

      if (response.ok) {
        loadBookings();
        alert(action === 'accept' ? 'Time accepted!' : 'Counter-proposal sent!');
      }
    } catch (error) {
      console.error('Failed to respond to reschedule:', error);
    }
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://brokerconnectug.netlify.app' : 'http://localhost:3001'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        setReviewedBookings(prev => new Set(Array.from(prev).concat(reviewData.bookingId)));
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Property Visits</h1>

        {bookings.length === 0 ? (
          <div className="card text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No property visits booked yet</p>
            <p className="text-sm text-gray-400">Book a visit from any property page to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{booking.property_title}</h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin size={14} className="mr-1" />
                      <span>{booking.area}, {booking.district}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-4">
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
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User size={14} className="mr-2" />
                      <span>{booking.broker_name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{booking.broker_phone}</span>
                    </div>
                  </div>
                </div>

                {booking.message && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {booking.status === 'reschedule_pending' ? 'Broker message:' : 'Your message:'}
                    </p>
                    <p className="text-sm text-gray-600">{booking.message}</p>
                  </div>
                )}

                {booking.status === 'reschedule_pending' && (
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-orange-900">Reschedule Request</h4>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Action Required</span>
                    </div>
                    <p className="text-sm text-orange-700 mb-3">
                      The broker has proposed a new time for your visit. Please review and respond.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => handleRescheduleResponse(booking.id, 'accept')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium"
                      >
                        Accept New Time
                      </button>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
                      >
                        Suggest Different Time
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                  
                  {booking.status === 'pending' && (
                    <div className="flex items-center space-x-2 text-xs text-yellow-600">
                      <AlertCircle size={12} />
                      <span>Waiting for broker confirmation</span>
                    </div>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <div className="flex items-center space-x-2 text-xs text-green-600">
                      <CheckCircle size={12} />
                      <span>Visit confirmed</span>
                    </div>
                  )}
                  
                  {booking.status === 'cancelled' && (
                    <div className="flex items-center space-x-2 text-xs text-red-600">
                      <X size={12} />
                      <span>Visit cancelled</span>
                    </div>
                  )}
                  
                  {booking.status === 'completed' && (
                    <div className="flex items-center space-x-2">
                      {reviewedBookings.has(booking.id) ? (
                        <div className="flex items-center space-x-2 text-xs text-green-600">
                          <Star size={12} fill="currentColor" />
                          <span>Reviewed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewBooking(booking)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center space-x-1"
                        >
                          <Star size={12} />
                          <span>Leave Review</span>
                        </button>
                      )}
                    </div>
                  )}
                  
                  {booking.status === 'reschedule_pending' && (
                    <div className="flex items-center space-x-2 text-xs text-orange-600">
                      <Edit size={12} />
                      <span>Reschedule response needed</span>
                    </div>
                  )}
                  
                  {booking.status === 'counter_pending' && (
                    <div className="flex items-center space-x-2 text-xs text-purple-600">
                      <Clock size={12} />
                      <span>Waiting for broker response</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Reschedule Response Modal */}
        <RescheduleResponseModal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          onResponse={handleRescheduleResponse}
        />

        {/* Review Modal */}
        <ReviewModal
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          booking={reviewBooking}
          onSubmit={handleReviewSubmit}
        />
      </div>
    </div>
  );
};

export default MyBookings;