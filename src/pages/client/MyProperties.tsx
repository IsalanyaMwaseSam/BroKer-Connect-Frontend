import React, { useState, useEffect } from 'react';
import { MapPin, Star, Calendar, Home, Phone, Mail } from 'lucide-react';

interface TakenProperty {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  location: {
    district: string;
    area: string;
    address: string;
  };
  features: {
    size: number;
    rooms: number;
    bathrooms: number;
    amenities: string[];
  };
  images: string[];
  broker: {
    name: string;
    phone: string;
    email: string;
  };
  review: {
    rating: number;
    comment: string;
    date: string;
  };
}

const MyProperties: React.FC = () => {
  const [properties, setProperties] = useState<TakenProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTakenProperties();
  }, []);

  const loadTakenProperties = async () => {
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://brokerconnectug.netlify.app' : 'http://localhost:3001'}/api/properties/client/taken`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load taken properties:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Properties</h1>

        {properties.length === 0 ? (
          <div className="card text-center py-8">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No properties taken yet</p>
            <p className="text-sm text-gray-400">Properties you mark as "taken" in reviews will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {properties.map((property) => (
              <div key={property.id} className="card">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {property.images[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{property.title}</h3>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Taken
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin size={14} className="mr-1" />
                      <span>{property.location.area}, {property.location.district}</span>
                    </div>

                    <div className="text-lg font-bold text-primary-600 mb-2">
                      {formatPrice(property.price, property.currency)}
                      {property.category === 'rental' && (
                        <span className="text-sm text-gray-500 font-normal">/month</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span className="text-sm font-medium">{property.review.rating}/5</span>
                      <span className="text-xs text-gray-500">
                        • Reviewed on {new Date(property.review.date).toLocaleDateString()}
                      </span>
                    </div>

                    {property.review.comment && (
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-3">
                        "{property.review.comment}"
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-600 mb-1">Broker Contact:</p>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-600">
                        <span>{property.broker.name}</span>
                        <div className="flex items-center">
                          <Phone size={12} className="mr-1" />
                          <span>{property.broker.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail size={12} className="mr-1" />
                          <span>{property.broker.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;