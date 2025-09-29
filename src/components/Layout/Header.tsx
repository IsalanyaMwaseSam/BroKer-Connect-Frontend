import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={user ? `/dashboard` : '/'} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">BrokerConnect</span>
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-8">
            <Link to="/properties" className="text-gray-700 hover:text-primary-600 font-medium">
              Properties
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                Dashboard
              </Link>
            )}
            <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <button className="p-1 sm:p-2 text-gray-600 hover:text-primary-600">
                  <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                </button>
                <button className="p-1 sm:p-2 text-gray-600 hover:text-primary-600">
                  <Bell size={18} className="sm:w-5 sm:h-5" />
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100">
                    <User size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-20 sm:max-w-none">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    {user.role === 'broker' && (
                      <Link to="/broker/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Properties
                      </Link>
                    )}
                    {user.role === 'client' && (
                      <>
                        <Link to="/my-bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Bookings
                        </Link>
                        <Link to="/my-properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Properties
                        </Link>
                        <Link to="/client/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Saved Properties
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <>
                        <Link to="/admin/brokers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Verify Brokers
                        </Link>
                        <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Manage Users
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/login" className="text-xs sm:text-sm text-gray-700 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;