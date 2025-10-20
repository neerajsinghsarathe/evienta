import React from 'react';
import { MapPin, Star, Shield, Phone, Mail } from 'lucide-react';
import { ServiceProvider } from '../../types';
import BookingModal from '../booking/BookingModal';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onSelect?: (provider: ServiceProvider) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider, onSelect }) => {
  const [showBookingModal, setShowBookingModal] = React.useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(provider);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={provider.portfolio_images[0] || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'}
          alt={provider.business_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <div className="bg-white px-2 py-1 rounded-full shadow-md flex items-center space-x-1">
            <span className="text-sm font-medium text-blue-600">{provider.business_type}</span>
            {provider.verified && (
              <Shield className="h-3 w-3 text-green-500 fill-current" />
            )}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white px-2 py-1 rounded-full shadow-md">
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="font-medium">{provider.rating}</span>
              <span className="text-gray-500">({provider.reviews_count})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {provider.business_name}
          </h3>
          {provider.verified && (
            <div className="flex items-center space-x-1 text-green-600">
              <Shield className="h-4 w-4 fill-current" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{provider.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {provider.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {provider.services.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs"
            >
              {service}
            </span>
          ))}
          {provider.services.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{provider.services.length - 3} more
            </span>
          )}
        </div>

        {provider.pricing_packages.length > 0 && (
          <div className="mb-3">
            <div className="text-sm text-gray-600">Starting from</div>
            <div className="text-lg font-bold text-green-600">
              ${Math.min(...provider.pricing_packages.map(p => p.price))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-blue-600 transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-blue-600 transition-colors">
              <Mail className="h-4 w-4" />
            </button>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              setShowBookingModal(true);
            }}
          >
            Book Service
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        provider={provider}
        onBookingComplete={(booking) => {
          console.log('Booking completed:', booking);
          setShowBookingModal(false);
        }}
      />
    </div>
  );
};

export default ServiceProviderCard;