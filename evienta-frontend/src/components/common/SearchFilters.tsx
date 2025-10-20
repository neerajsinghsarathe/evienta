import React, { useState } from 'react';
import { Filter, Calendar, DollarSign, Users, Star, MapPin } from 'lucide-react';
import { SearchFilters as SearchFiltersType } from '../../types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Conference', 'Workshop', 
    'Concert', 'Exhibition', 'Graduation', 'Other'
  ];

  const amenities = [
    'WiFi', 'Parking', 'Catering', 'Audio System', 'Projector', 'Air Conditioning',
    'Photography Allowed', 'Decorations Allowed', 'Outdoor Space', 'Kitchen Access'
  ];

  const updateFilters = (key: keyof SearchFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters</span>
          </button>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => updateFilters('location', e.target.value)}
                placeholder="Enter city or area"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilters('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Event Date
              </label>
              <input
                type="date"
                value={filters.date || ''}
                onChange={(e) => updateFilters('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Price Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Price Range (per hour)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.priceRange?.[0] || ''}
                  onChange={(e) => updateFilters('priceRange', [Number(e.target.value), filters.priceRange?.[1] || 1000])}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="self-center text-gray-500">to</span>
                <input
                  type="number"
                  value={filters.priceRange?.[1] || ''}
                  onChange={(e) => updateFilters('priceRange', [filters.priceRange?.[0] || 0, Number(e.target.value)])}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Guest Capacity
              </label>
              <input
                type="number"
                value={filters.capacity || ''}
                onChange={(e) => updateFilters('capacity', Number(e.target.value))}
                placeholder="Number of guests"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4 inline mr-1" />
                Minimum Rating
              </label>
              <select
                value={filters.rating || ''}
                onChange={(e) => updateFilters('rating', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            {/* Amenities */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities?.includes(amenity) || false}
                      onChange={(e) => {
                        const currentAmenities = filters.amenities || [];
                        if (e.target.checked) {
                          updateFilters('amenities', [...currentAmenities, amenity]);
                        } else {
                          updateFilters('amenities', currentAmenities.filter(a => a !== amenity));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;