import React, { useState } from 'react';
import { Search, MapPin, Star, Users, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import VenueCard from '../components/common/VenueCard';
import ServiceProviderCard from '../components/common/ServiceProviderCard';
import { Venue, ServiceProvider } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      setLoading(true);
      const [venuesRes, providersRes] = await Promise.all([
        apiService.getVenues({ limit: 6, featured: true }),
        apiService.getProviders({ limit: 6, verified: true })
      ]);
      
      setFeaturedVenues(venuesRes.venues || []);
      setFeaturedProviders(providersRes.providers || []);
    } catch (error) {
      console.error('Failed to load featured content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to search results page with query parameters
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`;
  };

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: 'Easy Search',
      description: 'Find the perfect venue and services with our advanced search and filtering system'
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: 'Instant Booking',
      description: 'Book venues and services instantly with real-time availability checking'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
      title: 'Verified Providers',
      description: 'All our service providers are thoroughly vetted and verified for quality assurance'
    },
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      title: 'Reviews & Ratings',
      description: 'Make informed decisions with authentic reviews and ratings from previous customers'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg)',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Plan Your Perfect Event
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with the best venues and service providers to make your events unforgettable
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search venues, photographers, caterers..."
                        className="w-full pl-12 pr-4 py-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        className="w-full pl-12 pr-4 py-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold"
                >
                  Search Events & Services
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-300">500+</div>
                <div className="text-blue-100">Venues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-300">1000+</div>
                <div className="text-blue-100">Service Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-300">50k+</div>
                <div className="text-blue-100">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-300">98%</div>
                <div className="text-blue-100">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EVIENTA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make event planning simple, efficient, and stress-free with our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Venues</h2>
              <p className="text-gray-600">Discover the most popular venues in your area</p>
            </div>
            <a
              href="/venues"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Service Providers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Service Providers</h2>
              <p className="text-gray-600">Connect with verified professionals for your event needs</p>
            </div>
            <a
              href="/services"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map((provider) => (
                <ServiceProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Plan Your Next Event?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust EVIENTA for their event planning needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/become-provider"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Become a Provider
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;