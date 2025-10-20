import React, { useState } from 'react';
import { MapPin, Star, Users, Wifi, Car, Camera, Calendar, Clock, Phone, Mail, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Venue, Review } from '../types';
import BookingModal from '../components/booking/BookingModal';
import MessageCenter from '../components/messaging/MessageCenter';

const VenueDetailsPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock venue data
  const venue: Venue = {
    id: '1',
    name: 'Grand Ballroom Palace',
    description: 'An elegant and spacious ballroom perfect for weddings, galas, and corporate events. Our venue features stunning crystal chandeliers, marble floors, and floor-to-ceiling windows that provide natural light and beautiful city views.',
    location: 'Downtown, New York',
    capacity: 300,
    price_per_hour: 450,
    amenities: ['WiFi', 'Parking', 'Catering Kitchen', 'Audio System', 'Lighting', 'Air Conditioning', 'Bridal Suite', 'Photography Allowed'],
    images: [
      'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg',
      'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
      'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
      'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'
    ],
    rating: 4.8,
    reviews_count: 124,
    provider_id: '1',
    provider: {
      id: '1',
      user_id: '1',
      business_name: 'Elite Venues',
      business_type: 'Venue',
      description: 'Premium venue provider with over 15 years of experience',
      services: ['Venue Rental', 'Event Coordination'],
      portfolio_images: [],
      pricing_packages: [],
      rating: 4.8,
      reviews_count: 124,
      verified: true,
      location: 'New York',
      phone: '+1 (555) 123-4567',
      email: 'contact@elitevenues.com',
      availability_calendar: [],
      created_at: '2024-01-01'
    },
    availability: true,
    created_at: '2024-01-01'
  };

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      user_id: 'user1',
      venue_id: venue.id,
      booking_id: 'booking1',
      rating: 5,
      comment: 'Absolutely stunning venue! The staff was incredibly helpful and the space exceeded our expectations. Our wedding was perfect!',
      created_at: '2025-01-10T10:00:00Z',
      user: { name: 'Sarah Johnson', avatar: undefined }
    },
    {
      id: '2',
      user_id: 'user2',
      venue_id: venue.id,
      booking_id: 'booking2',
      rating: 4,
      comment: 'Beautiful venue with great amenities. The only minor issue was parking, but overall a fantastic experience.',
      created_at: '2025-01-08T14:30:00Z',
      user: { name: 'Michael Chen', avatar: undefined }
    },
    {
      id: '3',
      user_id: 'user3',
      venue_id: venue.id,
      booking_id: 'booking3',
      rating: 5,
      comment: 'Perfect for our corporate gala. Professional staff, excellent catering facilities, and the ambiance was exactly what we needed.',
      created_at: '2025-01-05T16:45:00Z',
      user: { name: 'Emma Wilson', avatar: undefined }
    }
  ];

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="h-5 w-5" />;
    }
    if (amenityLower.includes('parking')) {
      return <Car className="h-5 w-5" />;
    }
    if (amenityLower.includes('photo') || amenityLower.includes('camera')) {
      return <Camera className="h-5 w-5" />;
    }
    return <div className="h-5 w-5 bg-blue-100 rounded-full"></div>;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Search</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={venue.images[currentImageIndex]}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {venue.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {venue.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Venue Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Up to {venue.capacity} guests</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{venue.rating}</span>
                  <span className="text-gray-600">({venue.reviews_count} reviews)</span>
                </div>
                {venue.provider.verified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Verified
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{venue.description}</p>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {venue.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reviews ({reviews.length})
              </h3>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{review.user.name}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${venue.price_per_hour}
                </div>
                <div className="text-gray-600">per hour</div>
              </div>

              <div className="space-y-4 mb-6">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Now
                </button>
                
                <button
                  onClick={() => setShowMessageCenter(true)}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Send Message
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Free cancellation up to 48 hours before event
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosted by</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {venue.provider.business_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{venue.provider.business_name}</p>
                  <p className="text-sm text-gray-600">{venue.provider.business_type}</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4">{venue.provider.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{venue.provider.rating} rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since 2024</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Call</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-medium">{venue.capacity} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Hours</span>
                  <span className="font-medium">4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Setup Time</span>
                  <span className="font-medium">2 hours included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleanup</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>
            </div>
          </div>
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

      <MessageCenter
        isOpen={showMessageCenter}
        onClose={() => setShowMessageCenter(false)}
        recipientId={venue.provider.id}
        recipientName={venue.provider.business_name}
      />
    </div>
  );
};

export default VenueDetailsPage;