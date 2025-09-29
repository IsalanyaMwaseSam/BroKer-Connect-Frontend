import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Eye, Star } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onFavorite, isFavorited }) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency === 'UGX' ? 'UGX' : 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-full">
      <div className="relative">
        <img
          src={property.images[0] || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
            {property.category.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
          {property.isVerified && (
            <span className="bg-success text-white px-2 py-1 rounded text-xs">Verified</span>
          )}
          <button
            onClick={() => onFavorite?.(property.id)}
            className={`p-2 rounded-full ${isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}
          >
            <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          <Eye size={12} />
          <span>{property.views}</span>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/properties/${property.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-primary-600">{property.title}</h3>
        </Link>
        
        {(property as any).rating && (
          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-sm font-medium">{(property as any).rating}</span>
            <span className="text-xs text-gray-500">({(property as any).reviewCount} reviews)</span>
          </div>
        )}
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{property.location.district}, {property.location.address}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-600 mb-3">
          <div className="flex items-center">
            <Square size={16} className="mr-1" />
            <span className="text-sm">{property.features.size} sqm</span>
          </div>
          {property.features.rooms && (
            <div className="flex items-center">
              <Bed size={16} className="mr-1" />
              <span className="text-sm">{property.features.rooms}</span>
            </div>
          )}
          {property.features.bathrooms && (
            <div className="flex items-center">
              <Bath size={16} className="mr-1" />
              <span className="text-sm">{property.features.bathrooms}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-primary-600">
              {formatPrice(property.price, property.currency)}
            </span>
            {property.category === 'rental' && (
              <span className="text-gray-500 text-sm">/month</span>
            )}
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium self-start sm:self-auto ${
            property.status === 'available' ? 'bg-green-100 text-green-800' :
            property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {property.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;