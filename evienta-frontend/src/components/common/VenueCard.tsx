import React from 'react';
import { MapPin, Star, Users, Wifi, Car, Camera } from 'lucide-react';
import { Venue } from '../../types';
import BookingModal from '../booking/BookingModal';

interface VenueCardProps {
  venue: Venue;
  onSelect?: (venue: Venue) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onSelect }) => {
  const [showBookingModal, setShowBookingModal] = React.useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(venue);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="h-4 w-4" />;
    }
    if (amenityLower.includes('parking')) {
      return <Car className="h-4 w-4" />;
    }
    if (amenityLower.includes('photo') || amenityLower.includes('camera')) {
      return <Camera className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={venue.images[0] || 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg'}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <div className="bg-white px-2 py-1 rounded-full shadow-md">
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="font-medium">{venue.rating}</span>
              <span className="text-gray-500">({venue.reviews_count})</span>
            </div>
          </div>
        </div>
        {!venue.availability && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {venue.name}
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              ${venue.price_per_hour}
            </div>
            <div className="text-sm text-gray-500">per hour</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{venue.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {venue.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm">Up to {venue.capacity} guests</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {venue.amenities.slice(0, 3).map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
            >
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {venue.amenities.length > 3 && (
            <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
              +{venue.amenities.length - 3} more
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            by {venue.provider.business_name}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              setShowBookingModal(true);
            }}
          >
            Book Now
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        venue={venue}
        onBookingComplete={(booking) => {
          console.log('Booking completed:', booking);
          setShowBookingModal(false);
        }}
      />
    </div>
  );
};

export default VenueCard;