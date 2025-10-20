import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Star, Users, Plus, Edit, Eye, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Booking, ServiceProvider } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile' | 'analytics'>('overview');
  
  // State for data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providerProfile, setProviderProfile] = useState<ServiceProvider | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, profileRes, analyticsRes] = await Promise.all([
        apiService.getProviderBookings({ limit: 10 }),
        apiService.getProviderProfile(),
        apiService.getProviderAnalytics()
      ]);

      setBookings(bookingsRes.bookings || []);
      setProviderProfile(profileRes.provider);
      setAnalytics(analyticsRes);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Provider dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, status: string, reason?: string) => {
    try {
      await apiService.updateBookingStatus(bookingId, status, reason);
      // Refresh bookings
      const bookingsRes = await apiService.getProviderBookings({ limit: 10 });
      setBookings(bookingsRes.bookings || []);
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {providerProfile?.business_name || user?.name}!</h2>
        <p className="text-emerald-100 mb-4">Manage your bookings and grow your business</p>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('profile')}
            className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Update Profile
          </button>
          <button className="border-2 border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-emerald-600 transition-colors font-medium">
            Boost Listing
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.bookings?.total_bookings || bookings.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analytics?.bookings?.total_revenue || '0'}</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">+8% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{providerProfile?.rating || '0.0'}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-600 mt-2">{providerProfile?.reviews_count || 0} reviews</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <Eye className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">+15% from last week</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No bookings yet. Optimize your profile to get more bookings!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.event_type} Event</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.event_date).toLocaleDateString()} at {booking.event_time}
                      </p>
                      <p className="text-sm text-gray-500">{booking.guests_count} guests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-1">${booking.total_amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-3">
              <Plus className="h-5 w-5 text-emerald-600" />
              <span>Add New Package</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-3">
              <Edit className="h-5 w-5 text-emerald-600" />
              <span>Update Availability</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              <span>Message Customers</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Sarah M.</span>
              </div>
              <p className="text-sm text-gray-700">"Exceptional service and delicious food!"</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm text-gray-600">John D.</span>
              </div>
              <p className="text-sm text-gray-700">"Professional team, great experience."</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Events Completed</span>
              <span className="font-semibold">{bookings.filter(b => b.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue</span>
              <span className="font-semibold text-green-600">${analytics?.bookings?.total_revenue || '0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Reviews</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profile Views</span>
              <span className="font-semibold">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option>All Bookings</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-6">Optimize your profile to start receiving bookings!</p>
          <button
            onClick={() => setActiveTab('profile')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{booking.event_type} Event</h3>
                  <p className="text-gray-600">{booking.notes}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(booking.event_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{booking.guests_count} guests</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${booking.total_amount}
                </div>
                <div className="text-sm text-gray-600">
                  Payment: <span className={booking.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                    {booking.payment_status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Booked on {new Date(booking.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                        className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled', 'Provider declined')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                    Contact Customer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={providerProfile?.business_name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <select 
                    value={providerProfile?.business_type || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="catering">Catering</option>
                    <option value="photography">Photography</option>
                    <option value="music">DJ/Music</option>
                    <option value="decoration">Decoration</option>
                    <option value="venue">Venue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={providerProfile?.location || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={providerProfile?.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <textarea
                rows={6}
                value={providerProfile?.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Services Offered</h3>
              <div className="space-y-2">
                {(providerProfile?.services || []).map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={service}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button className="text-red-600 hover:text-red-700">Remove</button>
                  </div>
                ))}
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  + Add Service
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Packages</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {(providerProfile?.pricing_packages || []).map((pkg, index) => (
                <div key={pkg.id} className="border border-gray-300 rounded-lg p-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={pkg.name}
                      placeholder="Package Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <textarea
                      value={pkg.description}
                      placeholder="Package Description"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      value={pkg.price}
                      placeholder="Price per person"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              + Add Package
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold">{bookings.length} bookings</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Month</span>
              <span className="font-semibold">6 bookings</span>
            </div>
            <div className="text-sm text-green-600">+33% increase</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold">${analytics?.bookings?.total_revenue || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Month</span>
              <span className="font-semibold">$2,850</span>
            </div>
            <div className="text-sm text-green-600">+30% increase</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-semibold">{providerProfile?.rating || '0.0'}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reviews</span>
              <span className="font-semibold">{providerProfile?.reviews_count || 0}</span>
            </div>
            <div className="text-sm text-green-600">Excellent rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={loadDashboardData}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'bookings', label: 'Bookings' },
              { key: 'profile', label: 'Profile' },
              { key: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default ProviderDashboard;