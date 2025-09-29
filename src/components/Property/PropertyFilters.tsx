import React from 'react';
import { Search, Filter } from 'lucide-react';

interface PropertyFiltersProps {
  filters: {
    search: string;
    category: string;
    district: string;
    minPrice: string;
    maxPrice: string;
    rooms: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, onFilterChange }) => {
  const districts = [
    'Kampala', 'Wakiso', 'Mukono', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu', 'Lira'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center mb-4">
        <Filter size={20} className="text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold">Filter Properties</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            <option value="land">Land</option>
            <option value="rental">Rental</option>
            <option value="house">House for Sale</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <select
            value={filters.district}
            onChange={(e) => onFilterChange('district', e.target.value)}
            className="input-field"
          >
            <option value="">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (UGX)</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (UGX)</label>
          <input
            type="number"
            placeholder="No limit"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
          <select
            value={filters.rooms}
            onChange={(e) => onFilterChange('rooms', e.target.value)}
            className="input-field"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;