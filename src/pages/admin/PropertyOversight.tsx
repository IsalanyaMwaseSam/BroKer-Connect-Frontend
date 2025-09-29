import React, { useState, useEffect } from 'react';
import { Shield, Eye, Flag, CheckCircle, X, MapPin, DollarSign } from 'lucide-react';
import { Property } from '../../types';

const PropertyOversight: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState('pending');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    // Mock properties data
    setProperties([
      {
        id: '1',
        title: 'Modern 3-Bedroom House in Kampala',
        description: 'Beautiful modern house with garden and parking',
        category: 'house',
        price: 450000000,
        currency: 'UGX',
        location: {
          district: 'Kampala',
          address: 'Kololo, Kampala',
          coordinates: { lat: 0.3476, lng: 32.5825 }
        },
        features: {
          size: 200,
          rooms: 3,
          bathrooms: 2,
          amenities: ['Parking', 'Garden', 'Security']
        },
        images: ['/placeholder-house.jpg'],
        status: 'available',
        brokerId: 'broker1',
        isVerified: false,
        views: 245,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Prime Land for Sale in Wakiso',
        description: '2 acres of prime land perfect for development',
        category: 'land',
        price: 800000000,
        currency: 'UGX',
        location: {
          district: 'Wakiso',
          address: 'Kira, Wakiso',
          coordinates: { lat: 0.4162, lng: 32.6297 }
        },
        features: {
          size: 8094,
          amenities: ['Road Access', 'Water', 'Electricity']
        },
        images: ['/placeholder-land.jpg'],
        status: 'available',
        brokerId: 'broker2',
        isVerified: true,
        views: 189,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      }
    ]);
  }, []);

  const handlePropertyAction = async (propertyId: string, action: 'verify' | 'reject' | 'flag') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProperties(prev => prev.map(property => 
      property.id === propertyId 
        ? { ...property, isVerified: action === 'verify' }
        : property
    ));
    
    setSelectedProperty(null);
  };

  const filteredProperties = properties.filter(property => {
    switch (filter) {
      case 'pending':
        return !property.isVerified;
      case 'verified':
        return property.isVerified;
      case 'flagged':
        return false; // Mock: no flagged properties
      default:
        return true;
    }
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency === 'UGX' ? 'UGX' : 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStats = () => {
    const total = properties.length;
    const pending = properties.filter(p => !p.isVerified).length;
    const verified = properties.filter(p => p.isVerified).length;
    const flagged = 0; // Mock
    
    return { total, pending, verified, flagged };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Oversight</h1>
            <p className="text-sm text-gray-600">{stats.pending} properties awaiting verification</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Properties</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Review</p>
                <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Verified</p>
                <p className="text-xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Flagged</p>
                <p className="text-xl font-bold text-red-600">{stats.flagged}</p>
              </div>
              <Flag className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'pending', label: 'Pending Review', count: stats.pending },
            { key: 'verified', label: 'Verified', count: stats.verified },
            { key: 'flagged', label: 'Flagged', count: stats.flagged },
            { key: 'all', label: 'All Properties', count: stats.total }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredProperties.map(property => (
                <div key={property.id} className="card hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedProperty(property)}>
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin size={14} className="mr-1" />
                            <span>{property.location.district}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <DollarSign size={14} className="mr-1" />
                            <span>{formatPrice(property.price, property.currency)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            property.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.isVerified ? 'Verified' : 'Pending'}
                          </span>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye size={12} className="mr-1" />
                            <span>{property.views} views</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{property.category}</span>
                          <span>{property.features.size} sqm</span>
                          <span>Listed {property.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Details Panel */}
          <div className="lg:col-span-1">
            {selectedProperty ? (
              <div className="card sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Property Review</h3>
                  <button 
                    onClick={() => setSelectedProperty(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="w-full h-32 bg-gray-200 rounded-lg"></div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedProperty.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{selectedProperty.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedProperty.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">{formatPrice(selectedProperty.price, selectedProperty.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{selectedProperty.features.size} sqm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedProperty.location.district}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Amenities</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedProperty.features.amenities.map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {!selectedProperty.isVerified && (
                    <div className="space-y-3 pt-4 border-t">
                      <button
                        onClick={() => handlePropertyAction(selectedProperty.id, 'verify')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <CheckCircle size={16} />
                        <span>Verify Property</span>
                      </button>
                      
                      <button
                        onClick={() => handlePropertyAction(selectedProperty.id, 'reject')}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <X size={16} />
                        <span>Reject Listing</span>
                      </button>
                      
                      <button
                        onClick={() => handlePropertyAction(selectedProperty.id, 'flag')}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <Flag size={16} />
                        <span>Flag for Review</span>
                      </button>
                    </div>
                  )}

                  {selectedProperty.isVerified && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Verified Property</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">This property is live on the platform</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center py-8">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a property to review details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOversight;