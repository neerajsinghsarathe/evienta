import React from 'react';
import { ExternalLink, Book, Code, Database, Shield, Zap } from 'lucide-react';

const ApiDocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EVIENTA API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive API documentation for developers building on the EVIENTA platform
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Book className="h-8 w-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Swagger UI</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Interactive API documentation with live testing capabilities
            </p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span className="text-sm font-medium">Open Documentation</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </div>
          </a>

          <a
            href="/test-features"
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="h-8 w-8 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Feature Testing</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Test all platform features and API endpoints
            </p>
            <div className="flex items-center text-emerald-600 group-hover:text-emerald-700">
              <span className="text-sm font-medium">Run Tests</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </div>
          </a>

          <a
            href="/test-crud"
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Database className="h-8 w-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">CRUD Testing</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Interactive testing of Create, Read, Update, Delete operations
            </p>
            <div className="flex items-center text-purple-600 group-hover:text-purple-700">
              <span className="text-sm font-medium">Test CRUD</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </div>
          </a>
        </div>

        {/* API Overview */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Base URL</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                http://localhost:5000/api
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Authentication</h3>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Include JWT token in headers:</p>
                <code className="text-sm font-mono">Authorization: Bearer &lt;your_token&gt;</code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Format</h3>
              <div className="bg-gray-100 p-3 rounded-lg">
                <pre className="text-sm text-gray-700">{`{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoint Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { name: 'Authentication', count: 5, icon: Shield, color: 'blue' },
            { name: 'Venues', count: 6, icon: Database, color: 'emerald' },
            { name: 'Providers', count: 5, icon: Code, color: 'purple' },
            { name: 'Bookings', count: 7, icon: Book, color: 'orange' }
          ].map((category) => (
            <div key={category.name} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{category.count}</p>
              <p className="text-sm text-gray-600">endpoints</p>
            </div>
          ))}
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{`// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Search Venues</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{`// Search venues with filters
const response = await fetch('/api/venues?' + new URLSearchParams({
  search: 'ballroom',
  location: 'New York',
  capacity: '100',
  minPrice: '200',
  maxPrice: '500'
}), {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

const { venues, pagination } = await response.json();`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Create Booking</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{`// Create a venue booking
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    booking_type: 'venue',
    venue_id: 'venue-uuid',
    event_date: '2025-06-15',
    event_time: '18:00',
    event_type: 'Wedding',
    guests_count: 150,
    duration_hours: 6,
    notes: 'Special requirements...'
  })
});

const { booking, clientSecret } = await response.json();`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Limits & Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>General API:</strong> 100 requests per 15 minutes</li>
                <li>• <strong>Authentication:</strong> 10 requests per 15 minutes</li>
                <li>• <strong>File Upload:</strong> 20 requests per hour</li>
                <li>• <strong>Webhooks:</strong> No limit</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use pagination for large datasets</li>
                <li>• Implement proper error handling</li>
                <li>• Cache responses when appropriate</li>
                <li>• Use webhooks for real-time updates</li>
                <li>• Validate input data before sending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;