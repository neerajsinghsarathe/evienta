import React, { useState } from 'react';
import { Menu, X, User, Bell, Search, Heart, MapPin, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../common/NotificationCenter';
import MessageCenter from '../messaging/MessageCenter';

interface HeaderProps {
  onSearchSubmit?: (query: string, location: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchSubmit }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery, location);
    }
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'vendor':
        return '/dashboard/vendor';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EVIENTA</span>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex-1 flex">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search venues, services..."
                      className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="w-px bg-gray-300"></div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Navigation & User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <a href={getDashboardPath()} className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </a>
                  {user.role === 'customer' && (
                    <>
                      <a href="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                        My Bookings
                      </a>
                      <a href="/favorites" className="relative text-gray-700 hover:text-blue-600 transition-colors">
                        <Heart className="h-5 w-5" />
                      </a>
                    </>
                  )}
                  {user.role === 'vendor' && (
                    <a href="/provider/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Bookings
                    </a>
                  )}
                  <a href="/test-crud" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Test CRUD
                  </a>
                  <a href="/test-features" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Test Features
                  </a>
                  <a href="/api-docs" className="text-gray-700 hover:text-blue-600 transition-colors">
                    API Docs
                  </a>
                  <button 
                    onClick={() => setShowMessages(true)}
                    className="relative text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full"></span>
                  </button>
                  <button 
                    onClick={() => setShowNotifications(true)}
                    className="relative text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </button>
                </nav>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden md:block">{user.name}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Profile Settings
                      </a>
                      {user.role === 'customer' && (
                        <a href="/loyalty" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                          Loyalty Points ({user.loyalty_points})
                        </a>
                      )}
                      <a href="/help" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Help & Support
                      </a>
                      <hr className="my-1" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3 border-t border-gray-200">
          <form onSubmit={handleSearch}>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search venues, services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <nav className="space-y-2">
              {user ? (
                <>
                  <a href={getDashboardPath()} className="block py-2 text-gray-700 hover:text-blue-600">
                    Dashboard
                  </a>
                  {user.role === 'customer' && (
                    <>
                      <a href="/bookings" className="block py-2 text-gray-700 hover:text-blue-600">
                        My Bookings
                      </a>
                      <a href="/favorites" className="block py-2 text-gray-700 hover:text-blue-600">
                        Favorites
                      </a>
                      <a href="/loyalty" className="block py-2 text-gray-700 hover:text-blue-600">
                        Loyalty Points ({user.loyalty_points})
                      </a>
                    </>
                  )}
                  <a href="/profile" className="block py-2 text-gray-700 hover:text-blue-600">
                    Profile Settings
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left py-2 text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                    Sign In
                  </a>
                  <a href="/register" className="block py-2 text-gray-700 hover:text-blue-600">
                    Sign Up
                  </a>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <MessageCenter 
        isOpen={showMessages} 
        onClose={() => setShowMessages(false)} 
      />
    </header>
  );
};

export default Header;