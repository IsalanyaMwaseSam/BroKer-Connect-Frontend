import React, { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import PropertyCard from '../components/Property/PropertyCard';
import PropertyFilters from '../components/Property/PropertyFilters';
import { Property } from '../types';
import { apiService } from '../services/api';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    district: '',
    minPrice: '',
    maxPrice: '',
    rooms: ''
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const filterParams = {
        ...(filters.category && { category: filters.category }),
        ...(filters.district && { district: filters.district }),
        ...(filters.minPrice && { minPrice: parseInt(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: parseInt(filters.maxPrice) }),
        ...(filters.rooms && { rooms: parseInt(filters.rooms) })
      };
      
      const data = await apiService.getProperties(filterParams);
      
      // Apply search filter on frontend
      let filteredData = data;
      if (filters.search) {
        filteredData = data.filter(property =>
          property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          property.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          property.location.address.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setProperties(filteredData);
    } catch (error) {
      console.error('Failed to load properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
          <p className="text-gray-600">Discover your perfect property in Uganda</p>
        </div>

        <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {properties.length} properties found
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onFavorite={handleFavorite}
              isFavorited={favorites.has(property.id)}
            />
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                district: '',
                minPrice: '',
                maxPrice: '',
                rooms: ''
              })}
              className="mt-4 btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;