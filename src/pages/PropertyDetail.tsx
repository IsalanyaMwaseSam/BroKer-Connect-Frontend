import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Phone, Mail, MessageCircle, Calendar, Heart, Share2 } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../hooks/useAuth';
import ChatModal from '../components/Chat/ChatModal';
import BookingModal from '../components/BookingModal';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [existingBooking, setExistingBooking] = useState<any>(null);

  useEffect(() => {
    loadProperty();
    trackView();
    if (user?.role === 'client') {
      checkExistingBooking();
    }
  }, [id, user]);

  const trackView = async () => {
    try {
      await fetch(`http://localhost:3001/api/properties/${id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const checkExistingBooking = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/bookings/client', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const bookings = await response.json();
      const propertyBooking = bookings.find((b: any) => b.property_id === id && b.status !== 'cancelled');
      setExistingBooking(propertyBooking);
    } catch (error) {
      console.error('Failed to check existing booking:', error);
    }
  };

  const loadProperty = async () => {
    try {
      const { apiService } = await import('../services/api');
      const propertyData = await apiService.getProperty(id!);
      setProperty(propertyData);
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency === 'UGX' ? 'UGX' : 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>;
  }

  if (!property) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Property not found</h2>
        <Link to="/properties" className="btn-primary">Back to Properties</Link>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{property.location.area}, {property.location.district}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Heart size={20} />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
            </div>

            {/* Details */}
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {formatPrice(property.price, property.currency)}
                  </h3>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <Square size={16} className="mr-1" />
                      <span>{property.features.size} sqm</span>
                    </div>
                    {property.features.rooms && (
                      <div className="flex items-center">
                        <Bed size={16} className="mr-1" />
                        <span>{property.features.rooms} beds</span>
                      </div>
                    )}
                    {property.features.bathrooms && (
                      <div className="flex items-center">
                        <Bath size={16} className="mr-1" />
                        <span>{property.features.bathrooms} baths</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {property.status}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{property.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {property.features.amenities.map((amenity, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Broker Info */}
            <div className="card">
              <h3 className="font-medium text-gray-900 mb-4">Contact Broker</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{property.broker?.name}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>★ {property.broker?.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{property.broker?.totalReviews} reviews</span>
                  </div>
                </div>
              </div>

              {user?.role === 'client' && (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowContact(!showContact)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Phone size={16} />
                    <span>Show Contact</span>
                  </button>

                  {showContact && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-gray-600" />
                        <span className="text-sm">{property.broker?.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-gray-600" />
                        <span className="text-sm">{property.broker?.email}</span>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setShowMessageModal(true)}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={16} />
                    <span>Send Message</span>
                  </button>

                  {existingBooking ? (
                    <div className="w-full border border-blue-200 bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Visit Booked</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          existingBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          existingBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {existingBooking.status}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        {new Date(existingBooking.visit_date).toLocaleDateString()} at {existingBooking.visit_time}
                      </p>
                      <Link to="/my-bookings" className="text-xs text-blue-600 hover:underline">
                        View booking details →
                      </Link>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      className="w-full btn-secondary flex items-center justify-center space-x-2"
                    >
                      <Calendar size={16} />
                      <span>Book Visit</span>
                    </button>
                  )}
                </div>
              )}

              {!user && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Login to contact broker</p>
                  <Link to="/login" className="btn-primary">Login</Link>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="card">
              <h3 className="font-medium text-gray-900 mb-4">Location</h3>
              <div className="space-y-2 text-sm">
                <p><strong>District:</strong> {property.location.district}</p>
                <p><strong>Area:</strong> {property.location.area}</p>
                <p><strong>Address:</strong> {property.location.address}</p>
              </div>
              <div className="mt-4 h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Chat Modal */}
        <ChatModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          receiverId={property.brokerId}
          receiverName={property.broker?.name || 'Broker'}
          propertyId={property.id}
          propertyTitle={property.title}
          currentUserId={user?.id || ''}
        />

        {/* Booking Modal */}
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          property={property}
          brokerId={property.brokerId}
          brokerName={property.broker?.name || 'Broker'}
        />
      </div>
    </div>
  );
};

export default PropertyDetail;