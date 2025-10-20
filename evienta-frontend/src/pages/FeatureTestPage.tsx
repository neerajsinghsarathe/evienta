import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Play, Database, Server, Globe } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: any;
}

interface TestCategory {
  name: string;
  tests: TestResult[];
}

const FeatureTestPage: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestCategory[]>([]);
  const [testing, setTesting] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'success' | 'error' | 'warning' | 'pending'>('pending');

  useEffect(() => {
    runAllTests();
  }, []);

  const runAllTests = async () => {
    setTesting(true);
    const results: TestCategory[] = [];

    // Test Database Connection
    const dbTests = await testDatabaseConnection();
    results.push({ name: 'Database Connection', tests: dbTests });

    // Test Authentication
    const authTests = await testAuthentication();
    results.push({ name: 'Authentication', tests: authTests });

    // Test Venues API
    const venueTests = await testVenuesAPI();
    results.push({ name: 'Venues API', tests: venueTests });

    // Test Providers API
    const providerTests = await testProvidersAPI();
    results.push({ name: 'Providers API', tests: providerTests });

    // Test Bookings API
    const bookingTests = await testBookingsAPI();
    results.push({ name: 'Bookings API', tests: bookingTests });

    // Test Reviews API
    const reviewTests = await testReviewsAPI();
    results.push({ name: 'Reviews API', tests: reviewTests });

    // Test Messages API
    const messageTests = await testMessagesAPI();
    results.push({ name: 'Messages API', tests: messageTests });

    // Test Admin Features
    if (user?.role === 'admin') {
      const adminTests = await testAdminAPI();
      results.push({ name: 'Admin Features', tests: adminTests });
    }

    setTestResults(results);
    
    // Calculate overall status
    const allTests = results.flatMap(category => category.tests);
    const hasErrors = allTests.some(test => test.status === 'error');
    const hasWarnings = allTests.some(test => test.status === 'warning');
    
    if (hasErrors) {
      setOverallStatus('error');
    } else if (hasWarnings) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('success');
    }

    setTesting(false);
  };

  const testDatabaseConnection = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      if (response.ok) {
        tests.push({
          name: 'Backend Health Check',
          status: 'success',
          message: 'Backend server is running',
          details: data
        });
      } else {
        tests.push({
          name: 'Backend Health Check',
          status: 'error',
          message: 'Backend server not responding'
        });
      }
    } catch (error) {
      tests.push({
        name: 'Backend Health Check',
        status: 'error',
        message: `Backend connection failed: ${error.message}`
      });
    }

    return tests;
  };

  const testAuthentication = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      if (user) {
        const response = await apiService.getCurrentUser();
        tests.push({
          name: 'Get Current User',
          status: 'success',
          message: `Authenticated as ${response.user.name} (${response.user.role})`,
          details: response.user
        });
      } else {
        tests.push({
          name: 'Authentication Status',
          status: 'warning',
          message: 'Not authenticated - some features may not work'
        });
      }
    } catch (error) {
      tests.push({
        name: 'Authentication',
        status: 'error',
        message: `Auth error: ${error.message}`
      });
    }

    return tests;
  };

  const testVenuesAPI = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      // Test GET venues
      const venuesResponse = await apiService.getVenues({ limit: 5 });
      tests.push({
        name: 'GET /api/venues',
        status: 'success',
        message: `Retrieved ${venuesResponse.venues?.length || 0} venues`,
        details: venuesResponse
      });

      // Test venue search
      const searchResponse = await apiService.getVenues({ 
        search: 'ballroom', 
        location: 'New York',
        limit: 3 
      });
      tests.push({
        name: 'Venue Search',
        status: 'success',
        message: `Search returned ${searchResponse.venues?.length || 0} results`,
        details: searchResponse
      });

      // Test venue creation (if provider)
      if (user?.role === 'provider') {
        try {
          const newVenue = await apiService.createVenue({
            name: 'Test Venue ' + Date.now(),
            description: 'Test venue for API testing',
            location: 'Test Location',
            capacity: 100,
            price_per_hour: 200,
            amenities: ['WiFi', 'Parking'],
            images: ['https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg']
          });
          tests.push({
            name: 'CREATE Venue',
            status: 'success',
            message: 'Venue created successfully',
            details: newVenue
          });
        } catch (error) {
          tests.push({
            name: 'CREATE Venue',
            status: 'error',
            message: `Create failed: ${error.message}`
          });
        }
      } else {
        tests.push({
          name: 'CREATE Venue',
          status: 'warning',
          message: 'Requires provider role'
        });
      }

    } catch (error) {
      tests.push({
        name: 'Venues API',
        status: 'error',
        message: `Venues API failed: ${error.message}`
      });
    }

    return tests;
  };

  const testProvidersAPI = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      // Test GET providers
      const providersResponse = await apiService.getProviders({ limit: 5 });
      tests.push({
        name: 'GET /api/providers',
        status: 'success',
        message: `Retrieved ${providersResponse.providers?.length || 0} providers`,
        details: providersResponse
      });

      // Test provider profile (if provider)
      if (user?.role === 'provider') {
        try {
          const profileResponse = await apiService.getProviderProfile();
          tests.push({
            name: 'GET Provider Profile',
            status: 'success',
            message: 'Provider profile retrieved',
            details: profileResponse
          });
        } catch (error) {
          tests.push({
            name: 'GET Provider Profile',
            status: 'warning',
            message: 'No provider profile found - may need to create one'
          });
        }

        // Test profile update
        try {
          const updateResponse = await apiService.updateProviderProfile({
            business_name: 'Test Business ' + Date.now(),
            business_type: 'catering',
            description: 'Test business description',
            location: 'Test Location',
            services: ['Catering', 'Event Planning'],
            phone: '+1234567890',
            business_email: 'test@business.com'
          });
          tests.push({
            name: 'UPDATE Provider Profile',
            status: 'success',
            message: 'Provider profile updated',
            details: updateResponse
          });
        } catch (error) {
          tests.push({
            name: 'UPDATE Provider Profile',
            status: 'error',
            message: `Update failed: ${error.message}`
          });
        }
      } else {
        tests.push({
          name: 'Provider Operations',
          status: 'warning',
          message: 'Requires provider role'
        });
      }

    } catch (error) {
      tests.push({
        name: 'Providers API',
        status: 'error',
        message: `Providers API failed: ${error.message}`
      });
    }

    return tests;
  };

  const testBookingsAPI = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      // Test GET user bookings
      const bookingsResponse = await apiService.getUserBookings({ limit: 5 });
      tests.push({
        name: 'GET User Bookings',
        status: 'success',
        message: `Retrieved ${bookingsResponse.bookings?.length || 0} bookings`,
        details: bookingsResponse
      });

      // Test booking creation (if user has venues available)
      if (user?.role === 'user') {
        try {
          const venuesResponse = await apiService.getVenues({ limit: 1 });
          if (venuesResponse.venues && venuesResponse.venues.length > 0) {
            const testBooking = await apiService.createBooking({
              booking_type: 'venue',
              venue_id: venuesResponse.venues[0].id,
              event_date: '2025-06-15',
              event_time: '18:00',
              event_type: 'Wedding',
              guests_count: 50,
              duration_hours: 4,
              notes: 'Test booking from API test'
            });
            tests.push({
              name: 'CREATE Booking',
              status: 'success',
              message: 'Booking created successfully',
              details: testBooking
            });
          } else {
            tests.push({
              name: 'CREATE Booking',
              status: 'warning',
              message: 'No venues available for booking test'
            });
          }
        } catch (error) {
          tests.push({
            name: 'CREATE Booking',
            status: 'error',
            message: `Booking creation failed: ${error.message}`
          });
        }
      }

      // Test provider bookings (if provider)
      if (user?.role === 'provider') {
        try {
          const providerBookingsResponse = await apiService.getProviderBookings({ limit: 5 });
          tests.push({
            name: 'GET Provider Bookings',
            status: 'success',
            message: `Retrieved ${providerBookingsResponse.bookings?.length || 0} provider bookings`,
            details: providerBookingsResponse
          });
        } catch (error) {
          tests.push({
            name: 'GET Provider Bookings',
            status: 'error',
            message: `Provider bookings failed: ${error.message}`
          });
        }
      }

    } catch (error) {
      tests.push({
        name: 'Bookings API',
        status: 'error',
        message: `Bookings API failed: ${error.message}`
      });
    }

    return tests;
  };

  const testReviewsAPI = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      // Test get user reviews
      const reviewsResponse = await apiService.getUserReviews({ limit: 5 });
      tests.push({
        name: 'GET User Reviews',
        status: 'success',
        message: `Retrieved ${reviewsResponse.reviews?.length || 0} reviews`,
        details: reviewsResponse
      });

      // Test venue reviews
      const venuesResponse = await apiService.getVenues({ limit: 1 });
      if (venuesResponse.venues && venuesResponse.venues.length > 0) {
        const venueReviewsResponse = await apiService.getVenueReviews(venuesResponse.venues[0].id);
        tests.push({
          name: 'GET Venue Reviews',
          status: 'success',
          message: `Retrieved venue reviews`,
          details: venueReviewsResponse
        });
      }

    } catch (error) {
      tests.push({
        name: 'Reviews API',
        status: 'error',
        message: `Reviews API failed: ${error.message}`
      });
    }

    return tests;
  };

  const testMessagesAPI = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      // Test get conversations
      const conversationsResponse = await apiService.getConversations();
      tests.push({
        name: 'GET Conversations',
        status: 'success',
        message: `Retrieved ${conversationsResponse.conversations?.length || 0} conversations`,
        details: conversationsResponse
      });

      // Test unread count
      const unreadResponse = await apiService.getUnreadCount();
      tests.push({
        name: 'GET Unread Count',
        status: 'success',
        message: `Unread messages: ${unreadResponse.unread_count || 0}`,
        details: unreadResponse
      });

    } catch (error) {
      tests.push({
        name: 'Messages API',
        status: 'error',
        message: `Messages API failed: ${error.message}`
      });
    }

    return tests;
  };

  const testAdminAPI = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      // Test admin dashboard
      const dashboardResponse = await apiService.getAdminDashboard();
      tests.push({
        name: 'GET Admin Dashboard',
        status: 'success',
        message: 'Admin dashboard data retrieved',
        details: dashboardResponse
      });

      // Test pending providers
      const pendingResponse = await apiService.getPendingProviders();
      tests.push({
        name: 'GET Pending Providers',
        status: 'success',
        message: `Retrieved ${pendingResponse.providers?.length || 0} pending providers`,
        details: pendingResponse
      });

      // Test user management
      const usersResponse = await apiService.getUsers({ limit: 5 });
      tests.push({
        name: 'GET Users',
        status: 'success',
        message: `Retrieved ${usersResponse.users?.length || 0} users`,
        details: usersResponse
      });

    } catch (error) {
      tests.push({
        name: 'Admin API',
        status: 'error',
        message: `Admin API failed: ${error.message}`
      });
    }

    return tests;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Database Connection':
        return <Database className="h-6 w-6" />;
      case 'Authentication':
        return <Server className="h-6 w-6" />;
      default:
        return <Globe className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Feature Testing Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Comprehensive testing of all frontend and backend features
          </p>
          
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border ${getStatusColor(overallStatus)} mb-6`}>
            <div className="flex items-center space-x-3">
              {getStatusIcon(overallStatus)}
              <div>
                <h3 className="font-semibold">
                  Overall System Status: {overallStatus.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600">
                  {overallStatus === 'success' && 'All systems operational'}
                  {overallStatus === 'warning' && 'Some features have warnings'}
                  {overallStatus === 'error' && 'Critical issues detected'}
                  {overallStatus === 'pending' && 'Testing in progress...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={testing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {testing ? <LoadingSpinner size="sm" /> : <Play className="h-4 w-4" />}
              <span>{testing ? 'Testing...' : 'Run All Tests'}</span>
            </button>
            
            <div className="text-sm text-gray-600 flex items-center">
              Current User: {user ? `${user.name} (${user.role})` : 'Not authenticated'}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          {testResults.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category.name)}
                  <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  <span className="text-sm text-gray-500">
                    ({category.tests.filter(t => t.status === 'success').length}/{category.tests.length} passed)
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {category.tests.map((test, testIndex) => (
                    <div key={testIndex} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(test.status)}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{test.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                          {test.details && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                View Details
                              </summary>
                              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/test-crud'}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h4 className="font-medium text-gray-900">CRUD Operations</h4>
              <p className="text-sm text-gray-600">Test Create, Read, Update, Delete</p>
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h4 className="font-medium text-gray-900">User Dashboard</h4>
              <p className="text-sm text-gray-600">Test user interface features</p>
            </button>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => window.location.href = '/admin'}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <h4 className="font-medium text-gray-900">Admin Panel</h4>
                <p className="text-sm text-gray-600">Test admin features</p>
              </button>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Lucide React for icons</li>
                <li>• Vite development server</li>
                <li>• API proxy to backend</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Node.js with Express</li>
                <li>• MySQL database</li>
                <li>• JWT authentication</li>
                <li>• Stripe payment integration</li>
                <li>• Socket.IO for real-time features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureTestPage;