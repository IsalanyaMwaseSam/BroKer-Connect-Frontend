import React, { useState, useEffect } from 'react';
import { Heart, Filter, Grid, List } from 'lucide-react';
import PropertyCard from '../../components/Property/PropertyCard';
import { Property } from '../../types';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock favorites data
    setFavorites([
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
        isVerified: true,
        views: 245,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }, []);

  const handleRemoveFavorite = (propertyId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== propertyId));
  };

  const filteredFavorites = favorites.filter(property => {
    if (filter === 'all') return true;
    return property.category === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
            <p className="text-sm text-gray-600">{favorites.length} properties saved</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Categories</option>
              <option value="house">Houses</option>
              <option value="rental">Rentals</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
            <p className="text-gray-600 mb-4">Start browsing properties and save your favorites here</p>
            <a href="/properties" className="btn-primary">Browse Properties</a>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredFavorites.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={handleRemoveFavorite}
                isFavorited={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;