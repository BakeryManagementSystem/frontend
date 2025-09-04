import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  Heart,
  Home,
  Store
} from 'lucide-react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const { isMobile } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      const role = user?.role;
      if (role === 'buyer') {
        navigate('/buyer/dashboard');
      } else if (role === 'seller') {
        navigate('/seller/dashboard');
      }
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-color rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {isMobile ? 'BMS' : 'Bakery Marketplace'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-700 hover:text-primary-color transition-colors">
                  Home
                </Link>
                <Link to="/marketplace" className="text-gray-700 hover:text-primary-color transition-colors">
                  Marketplace
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-primary-color transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary-color transition-colors">
                  Contact
                </Link>
              </nav>
            )}

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-600 hover:text-primary-color transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              {isAuthenticated && (
                <button
                  onClick={toggleCart}
                  className="p-2 text-gray-600 hover:text-primary-color transition-colors relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-color text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}

              {/* User Account */}
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-color transition-colors"
              >
                <User className="w-5 h-5" />
                {!isMobile && (
                  <span>{isAuthenticated ? user?.name : 'Login'}</span>
                )}
              </button>

              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-600 hover:text-primary-color transition-colors md:hidden"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="border-t border-gray-200 p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobile && isMenuOpen && (
            <div className="border-t border-gray-200 md:hidden">
              <nav className="py-4 space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-color transition-colors"
                  onClick={toggleMenu}
                >
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link
                  to="/marketplace"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-color transition-colors"
                  onClick={toggleMenu}
                >
                  <div className="flex items-center space-x-3">
                    <Store className="w-5 h-5" />
                    <span>Marketplace</span>
                  </div>
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-color transition-colors"
                  onClick={toggleMenu}
                >
                  <span className="ml-8">About</span>
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-color transition-colors"
                  onClick={toggleMenu}
                >
                  <span className="ml-8">Contact</span>
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/buyer/wishlist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-color transition-colors"
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5" />
                      <span>Wishlist</span>
                    </div>
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-color rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Bakery Marketplace</span>
              </div>
              <p className="text-gray-600 text-sm">
                Your one-stop destination for fresh bakery products and artisanal treats.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-600 hover:text-primary-color transition-colors">Home</Link></li>
                <li><Link to="/marketplace" className="text-gray-600 hover:text-primary-color transition-colors">Marketplace</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-primary-color transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-primary-color transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
              <ul className="space-y-2 text-sm">
                {!isAuthenticated ? (
                  <>
                    <li><Link to="/auth/login" className="text-gray-600 hover:text-primary-color transition-colors">Login</Link></li>
                    <li><Link to="/auth/register" className="text-gray-600 hover:text-primary-color transition-colors">Register</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/buyer/dashboard" className="text-gray-600 hover:text-primary-color transition-colors">Dashboard</Link></li>
                    <li><Link to="/buyer/orders" className="text-gray-600 hover:text-primary-color transition-colors">Orders</Link></li>
                    <li><Link to="/buyer/wishlist" className="text-gray-600 hover:text-primary-color transition-colors">Wishlist</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 info@bakerymarketplace.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Bakery Street, Food City</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Bakery Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
