import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, MoreVertical, MessageSquare } from 'lucide-react';
import { Property } from '../../types';

const BrokerProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { apiService } = await import('../../services/api');
      const brokerProperties = await apiService.getBrokerProperties();
      setProperties(brokerProperties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  const handleStatusChange = (propertyId: string, newStatus: Property['status']) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status: newStatus } : p
    ));
  };

  const handleDelete = (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency === 'UGX' ? 'UGX' : 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            <p className="text-sm text-gray-600">{properties.length} properties listed</p>
          </div>
          <Link to="/broker/properties/new" className="btn-primary flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Property</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Properties' },
            { key: 'available', label: 'Available' },
            { key: 'pending', label: 'Pending' },
            { key: 'sold', label: 'Sold' },
            { key: 'rented', label: 'Rented' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first property listing</p>
            <Link to="/broker/properties/new" className="btn-primary">Add Property</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map(property => (
              <div key={property.id} className="card">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location.district} • {property.features.size} sqm</p>
                        <p className="text-lg font-bold text-primary-600 mt-1">
                          {formatPrice(property.price, property.currency)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {property.status}
                        </span>
                        
                        {property.isVerified && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          <span>{property.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare size={14} className="mr-1" />
                          <span>{(property as any).messageCount || 0} messages</span>
                        </div>
                        <span>Listed {property.createdAt.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={property.status}
                          onChange={(e) => handleStatusChange(property.id, e.target.value as Property['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="available">Available</option>
                          <option value="pending">Pending</option>
                          <option value="sold">Sold</option>
                          <option value="rented">Rented</option>
                        </select>
                        
                        <Link
                          to={`/broker/properties/${property.id}/edit`}
                          className="p-1 text-gray-600 hover:text-blue-600"
                        >
                          <Edit size={16} />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
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

export default BrokerProperties;