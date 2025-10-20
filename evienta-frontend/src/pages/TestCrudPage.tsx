import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface TestItem {
  id: string;
  name: string;
  description: string;
  type: 'venue' | 'provider' | 'booking';
  data: any;
}

const TestCrudPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'venues' | 'providers' | 'bookings'>('venues');
  const [items, setItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TestItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      switch (activeTab) {
        case 'venues':
          response = await apiService.getVenues({ limit: 20 });
          setItems(response.venues?.map((venue: any) => ({
            id: venue.id,
            name: venue.name,
            description: venue.description,
            type: 'venue' as const,
            data: venue
          })) || []);
          break;
        case 'providers':
          response = await apiService.getProviders({ limit: 20 });
          setItems(response.providers?.map((provider: any) => ({
            id: provider.id,
            name: provider.business_name,
            description: provider.description,
            type: 'provider' as const,
            data: provider
          })) || []);
          break;
        case 'bookings':
          response = await apiService.getUserBookings({ limit: 20 });
          setItems(response.bookings?.map((booking: any) => ({
            id: booking.id,
            name: `${booking.event_type} Event`,
            description: `${booking.guests_count} guests on ${booking.event_date}`,
            type: 'booking' as const,
            data: booking
          })) || []);
          break;
      }
    } catch (err: any) {
      setError(`Failed to load ${activeTab}: ${err.message}`);
      console.error(`Load ${activeTab} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'venues':
          response = await apiService.createVenue({
            name: formData.name || 'Test Venue',
            description: formData.description || 'Test venue description',
            location: formData.location || 'Test Location',
            capacity: parseInt(formData.capacity) || 100,
            price_per_hour: parseFloat(formData.price_per_hour) || 200,
            amenities: formData.amenities?.split(',').map((a: string) => a.trim()) || ['WiFi', 'Parking'],
            images: formData.images?.split(',').map((i: string) => i.trim()) || ['https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg'],
            venue_type: formData.venue_type || 'indoor'
          });
          break;
        case 'providers':
          response = await apiService.updateProviderProfile({
            business_name: formData.business_name || 'Test Provider',
            business_type: formData.business_type || 'catering',
            description: formData.description || 'Test provider description',
            location: formData.location || 'Test Location',
            services: formData.services?.split(',').map((s: string) => s.trim()) || ['Catering', 'Event Planning'],
            phone: formData.phone || '+1234567890',
            business_email: formData.business_email || 'test@provider.com'
          });
          break;
        case 'bookings':
          response = await apiService.createBooking({
            booking_type: 'venue',
            venue_id: formData.venue_id || items.find(i => i.type === 'venue')?.id,
            event_date: formData.event_date || new Date().toISOString().split('T')[0],
            event_time: formData.event_time || '18:00',
            event_type: formData.event_type || 'Wedding',
            guests_count: parseInt(formData.guests_count) || 50,
            duration_hours: parseInt(formData.duration_hours) || 4,
            notes: formData.notes || 'Test booking'
          });
          break;
      }
      
      setShowCreateForm(false);
      setFormData({});
      await loadData();
    } catch (err: any) {
      setError(`Failed to create ${activeTab.slice(0, -1)}: ${err.message}`);
      console.error(`Create ${activeTab} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (item: TestItem) => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'venues':
          response = await apiService.updateVenue(item.id, {
            name: formData.name || item.data.name,
            description: formData.description || item.data.description,
            location: formData.location || item.data.location,
            capacity: parseInt(formData.capacity) || item.data.capacity,
            price_per_hour: parseFloat(formData.price_per_hour) || item.data.price_per_hour
          });
          break;
        case 'providers':
          response = await apiService.updateProviderProfile({
            business_name: formData.business_name || item.data.business_name,
            business_type: formData.business_type || item.data.business_type,
            description: formData.description || item.data.description,
            location: formData.location || item.data.location
          });
          break;
        case 'bookings':
          response = await apiService.updateBookingStatus(item.id, 'confirmed');
          break;
      }
      
      setEditingItem(null);
      setFormData({});
      await loadData();
    } catch (err: any) {
      setError(`Failed to update ${activeTab.slice(0, -1)}: ${err.message}`);
      console.error(`Update ${activeTab} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: TestItem) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;
    
    setLoading(true);
    try {
      switch (activeTab) {
        case 'venues':
          await apiService.deleteVenue(item.id);
          break;
        case 'bookings':
          await apiService.cancelBooking(item.id, 'User cancelled');
          break;
        default:
          throw new Error(`Delete not implemented for ${activeTab}`);
      }
      
      await loadData();
    } catch (err: any) {
      setError(`Failed to delete ${activeTab.slice(0, -1)}: ${err.message}`);
      console.error(`Delete ${activeTab} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const renderCreateForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create New {activeTab.slice(0, -1)}</h3>
        <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleCreate} className="space-y-4">
        {activeTab === 'venues' && (
          <>
            <input
              type="text"
              placeholder="Venue Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price per hour"
                value={formData.price_per_hour || ''}
                onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </>
        )}
        
        {activeTab === 'providers' && (
          <>
            <input
              type="text"
              placeholder="Business Name"
              value={formData.business_name || ''}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <select
              value={formData.business_type || 'catering'}
              onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="catering">Catering</option>
              <option value="photography">Photography</option>
              <option value="music">Music/DJ</option>
              <option value="decoration">Decoration</option>
              <option value="venue">Venue</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </>
        )}
        
        {activeTab === 'bookings' && (
          <>
            <input
              type="date"
              value={formData.event_date || ''}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="time"
              value={formData.event_time || ''}
              onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <select
              value={formData.event_type || 'Wedding'}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Birthday">Birthday</option>
              <option value="Conference">Conference</option>
            </select>
            <input
              type="number"
              placeholder="Number of guests"
              value={formData.guests_count || ''}
              onChange={(e) => setFormData({ ...formData, guests_count: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </>
        )}
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            <Save className="h-4 w-4" />
            <span>Create</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCreateForm(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderEditForm = (item: TestItem) => (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-2">
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(item); }} className="space-y-3">
        {activeTab === 'venues' && (
          <>
            <input
              type="text"
              placeholder="Venue Name"
              value={formData.name || item.data.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={formData.description || item.data.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity || item.data.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price per hour"
                value={formData.price_per_hour || item.data.price_per_hour}
                onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        )}
        
        {activeTab === 'providers' && (
          <>
            <input
              type="text"
              placeholder="Business Name"
              value={formData.business_name || item.data.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={formData.description || item.data.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </>
        )}
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1"
          >
            {loading && <LoadingSpinner size="sm" />}
            <Save className="h-3 w-3" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={() => { setEditingItem(null); setFormData({}); }}
            className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">CRUD Operations Test</h1>
          <p className="text-gray-600">Test all Create, Read, Update, Delete operations for the platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'venues', label: 'Venues' },
              { key: 'providers', label: 'Providers' },
              { key: 'bookings', label: 'Bookings' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create New {activeTab.slice(0, -1)}</span>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && renderCreateForm()}

        {/* Data Display */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({items.length})
              </h2>
              <button
                onClick={loadData}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center space-x-1"
              >
                {loading && <LoadingSpinner size="sm" />}
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <p>No {activeTab} found. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          ID: {item.id}
                        </div>
                        {activeTab === 'venues' && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span>Capacity: {item.data.capacity} | </span>
                            <span>Price: ${item.data.price_per_hour}/hr | </span>
                            <span>Location: {item.data.location}</span>
                          </div>
                        )}
                        {activeTab === 'providers' && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span>Type: {item.data.business_type} | </span>
                            <span>Rating: {item.data.rating || 'N/A'} | </span>
                            <span>Verified: {item.data.verified ? 'Yes' : 'No'}</span>
                          </div>
                        )}
                        {activeTab === 'bookings' && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span>Status: {item.data.status} | </span>
                            <span>Payment: {item.data.payment_status} | </span>
                            <span>Amount: ${item.data.total_amount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => console.log('View details:', item)}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(activeTab === 'venues' || activeTab === 'bookings') && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {editingItem?.id === item.id && renderEditForm(item)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Test Results */}
        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Test Results</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📖</div>
              <div className="font-medium">READ</div>
              <div className="text-sm text-gray-600">
                {loading ? 'Testing...' : items.length > 0 ? '✅ Working' : '❌ No Data'}
              </div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">✏️</div>
              <div className="font-medium">CREATE/UPDATE</div>
              <div className="text-sm text-gray-600">
                {user?.role === 'provider' ? '✅ Available' : '⚠️ Need Provider Role'}
              </div>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🗑️</div>
              <div className="font-medium">DELETE</div>
              <div className="text-sm text-gray-600">
                {user?.role === 'provider' ? '✅ Available' : '⚠️ Need Provider Role'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCrudPage;