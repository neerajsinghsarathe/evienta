import React, { useState, useEffect, ChangeEvent } from 'react';
import { Calendar, DollarSign, Star, Users, Plus, Edit, Eye, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Booking, ServiceProvider } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Country, State, City } from 'country-state-city';
import BusinessCard from '../../components/BusinessCard';

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile' | 'analytics'>('overview');

  // State for data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providerProfile, setProviderProfile] = useState<ServiceProvider | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const loadDashboardData = async () => {
    try {
      setLoading(true);
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
  const SERVICE_OPTIONS = [
    "Function halls", "Banquet halls", "Meeting halls", "Ball rooms", "Cattering services", "Dj services",
    "Band", "Choreography", "Farm houses", "Singers group", "Anchors", "Decoraters", "Makeup artist",
    "Dress designer", "Gift designer", "Pub party booking", "Event managers", "Artists", "Tent house",
    "Poojarii", "Drivers", "Car renters", "Security", "Photography", "Staycation", "Destination wedding places booking",
    "Office party places booking", "Extra curricular activities", "Booking golf",
  ];

  type PricingPackage = {
    id: number;
    name: string;
    description: string;
    price: number;
  };

  const RenderProfile: React.FC = () => {
    const mockBusinesses = [
      {
        business_name: "Cafe Emerald",
        phone: "9876543210",
        country: "India",
        state: "Telangana",
        city: "Hyderabad",
        description: "A cozy cafe serving specialty coffee and fresh bakes in the heart of Hyderabad. Come enjoy our warm hospitality and aromatic brews.",
        services: ["Coffee", "Snacks", "Free WiFi", "Outdoor Seating"],
        images: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
        ],
        pricing_packages: [
          { id: 1, name: "Breakfast Combo", description: "Coffee + Croissant", price: 180 },
          { id: 2, name: "Lunch Special", description: "Pasta + Drink", price: 300 }
        ]
      },
      // Add more mock businesses as needed
    ];
    const [businesses, setBusinesses] = useState<any>(mockBusinesses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const countries = Country.getAllCountries();
    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
    const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];
    const { user } = useAuth();

    const [formState, setFormState] = useState<any>({
      business_name: "",
      phone: "",
      city: "",
      state: "",
      country: "",
      description: "",
      services: [],
      images: [],
      imagePreviews: [],
      pricing_packages: []
    });
    const [serviceSearch, setServiceSearch] = useState("");
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherService, setOtherService] = useState("");
    const [imageError, setImageError] = useState("");

    // Handlers for form state
    const handleFieldChange = (name: string, value: any) => {
      setFormState((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    };
    const handleServiceCheck = (service: string, checked: boolean) => {
      setFormState((prev: any) => ({
        ...prev,
        services: checked
          ? [...prev.services, service]
          : prev.services.filter((s: any) => s !== service),
      }));
    };
    const handleRemoveService = (service: string) => {
      setFormState((prev: any) => ({
        ...prev,
        services: prev.services.filter((s: any) => s !== service),
      }));
    };
    const filteredServices = SERVICE_OPTIONS.filter(
      (opt) =>
        opt.toLowerCase().includes(serviceSearch.toLowerCase()) &&
        !formState.services?.includes(opt)
    );

    // Add pricing package logic
    const handleAddPackage = () => {
      setFormState((prev: any) => ({
        ...prev,
        pricing_packages: [
          ...prev.pricing_packages,
          { id: Date.now(), name: "", description: "", price: 0 },
        ],
      }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (formState.images.length + files.length > 8) {
        setImageError("Maximum 8 images allowed.");
        return;
      }
      setImageError("");

      // Generate base64 preview for each file
      Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        )
      ).then((previews) => {
        setFormState((prev: any) => ({
          ...prev,
          images: [...prev.images, ...files],
          imagePreviews: [...prev.imagePreviews, ...previews],
        }));
      });
    };

    const handleRemoveImage = (idx: number) => {
      setFormState((prev: any) => ({
        ...prev,
        images: prev.images.filter((_: any, i: number) => i !== idx),
        imagePreviews: prev.imagePreviews.filter((_: any, i: number) => i !== idx),
      }));
    };

    const handlePackageChange = (index: number, key: keyof PricingPackage, value: any) => {
      setFormState((prev: any) => {
        const pkgs = [...prev.pricing_packages];
        pkgs[index] = { ...pkgs[index], [key]: value };
        return { ...prev, pricing_packages: pkgs };
      });
    };

    // Handle "Add Business" submit
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      if (!formState.images || formState.images.length < 3) {
        setImageError("Please upload at least 3 images");
        return;
      }

      // Convert File objects to base64 strings (returns an array)
      const imagesAsBase64 = await Promise.all(
        (formState.images || []).map(
          (file: any) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      );

      // Inline: copy all keys/values from formState, overwrite images, and omit imagePreviews
      const payload = {
        ...formState,
        images: imagesAsBase64
      };
      delete payload.imagePreviews;

      // Now send the same object shape as your state but with images as base64 strings, and no imagePreviews
      await fetch('/api/vendor-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // ...reset form, UI etc
    };


    // Modal UI
    const BusinessModal = (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
        <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-4xl h-[40rem] overflow-y-auto relative">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            onClick={() => setIsModalOpen(false)}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Add Business</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={formState.business_name}
                      onChange={e => handleFieldChange("business_name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={selectedCountry}
                      onChange={e => {
                        setSelectedCountry(e.target.value);
                        setSelectedState(""); // Reset state when country changes
                        setSelectedCity("");  // Reset city when country changes
                        handleFieldChange("country", countries.find(c => c.isoCode === e.target.value)?.name || "");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={selectedState}
                      onChange={e => {
                        setSelectedState(e.target.value);
                        setSelectedCity(""); // Reset city when state changes
                        handleFieldChange("state", states.find(s => s.isoCode === e.target.value)?.name || "");
                      }}
                      disabled={!selectedCountry}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      value={selectedCity}
                      onChange={e => {
                        setSelectedCity(e.target.value);
                        handleFieldChange("city", cities.find(c => c.name === e.target.value)?.name || "");
                      }}
                      disabled={!selectedState}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={e => handleFieldChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {/* Services Offered Multi-select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formState.services?.map((service: any) => (
                        <span
                          key={service}
                          className="flex items-center bg-emerald-100 rounded px-2 py-1 text-emerald-700 text-sm"
                        >
                          {service}
                          <button
                            type="button"
                            className="ml-2 text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveService(service)}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={serviceSearch}
                      onChange={e => setServiceSearch(e.target.value)}
                      className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Type to search services..."
                    />
                    <div className="max-h-40 overflow-y-auto border rounded">
                      {filteredServices.map(service => (
                        <label
                          key={service}
                          className="flex items-center py-1 px-3 hover:bg-emerald-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formState.services?.includes(service)}
                            onChange={e => handleServiceCheck(service, e.target.checked)}
                            className="mr-2"
                          />
                          {service}
                        </label>
                      ))}
                      <label className="flex items-center py-1 px-3 hover:bg-emerald-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOtherInput}
                          onChange={e => setShowOtherInput(e.target.checked)}
                          className="mr-2"
                        />
                        Other
                      </label>
                      {/* Show textbox if "Other" checked */}
                      {showOtherInput && (
                        <div className="flex mt-2 space-x-2 p-2">
                          <input
                            value={otherService}
                            onChange={e => setOtherService(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your service"
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (
                                  otherService.trim() &&
                                  !formState.services.includes(otherService.trim())
                                ) {
                                  handleServiceCheck(otherService.trim(), true);
                                  setOtherService("");
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="bg-emerald-600 text-white rounded px-3"
                            onClick={() => {
                              if (
                                otherService.trim() &&
                                !formState.services.includes(otherService.trim())
                              ) {
                                handleServiceCheck(otherService.trim(), true);
                                setOtherService("");
                              }
                            }}
                          >
                            Add
                          </button>
                        </div>
                      )}
                      {filteredServices.length === 0 && (
                        <div className="px-3 py-2 text-gray-400 text-sm">
                          No matching services
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <textarea
                  rows={6}
                  value={formState.description}
                  onChange={e => handleFieldChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Images (min 3 required)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-3"
                  />
                  {imageError && <div className="text-red-500 text-sm mb-2">{imageError}</div>}

                  {/* Image previews with hover tooltips */}
                  <div className="flex flex-wrap gap-3">
                    {formState.imagePreviews?.map((url: string, idx: number) => (
                      <div key={idx} className="relative w-28 h-28 border rounded group">
                        <img
                          src={url}
                          alt={`Business preview ${idx + 1}`}
                          className="w-28 h-28 object-cover rounded"
                          title={formState.images[idx]?.name || `Image ${idx + 1}`} // Tooltip on hover
                        />
                        {/* Hover overlay with filename */}
                        <div className="absolute inset-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-center break-words">
                          {formState.images[idx]?.name || `Image ${idx + 1}`}
                        </div>
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-0 right-0 bg-white bg-opacity-80 hover:bg-red-100 text-red-600 rounded-full p-1 m-1"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Allowed: up to 8 images. Only image files supported. Hover over images to see filenames.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Pricing Packages</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {formState.pricing_packages?.map((pkg: any, index: number) => (
                    <div key={pkg.id ?? index} className="border border-gray-300 rounded-lg p-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={pkg.name}
                          placeholder="Package Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          onChange={e => handlePackageChange(index, "name", e.target.value)}
                        />
                        <textarea
                          value={pkg.description}
                          placeholder="Package Description"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          onChange={e => handlePackageChange(index, "description", e.target.value)}
                        />
                        <input
                          type="number"
                          value={pkg.price}
                          placeholder="Price per person"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          onChange={e =>
                            handlePackageChange(index, "price", Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  type="button"
                  onClick={handleAddPackage}
                >
                  + Add Package
                </button>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors" type="submit">
                Save Business
              </button>
            </div>
          </form>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-emerald-700">Vendor Businesses</h1>
        {businesses.length === 0 ? (
          <div className="flex flex-col items-center p-12 bg-white rounded-lg border border-gray-100 shadow-md">
            <div className="mb-2 text-lg text-gray-500 font-semibold">No businesses found.</div>
            <button
              className="px-5 py-3 mt-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Business
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button
                className="px-5 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Business
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {businesses.map((biz:any, idx:number) => (
                <BusinessCard key={idx} business={biz} onEdit={()=>{setIsModalOpen(true)}} onDelete={()=>true} />
              ))}
            </div>
          </div>
        )}
        {isModalOpen && BusinessModal}
      </div>
    );
  };
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
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
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
        {activeTab === 'profile' && <RenderProfile />}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default ProviderDashboard;