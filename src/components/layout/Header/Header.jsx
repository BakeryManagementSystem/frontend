import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useNotifications } from '../../../context/NotificationContext';
import NotificationDropdown from '../../common/NotificationDropdown/NotificationDropdown';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Package,
  LogOut,
  Settings,
  ChefHat,
  Home,
  Grid3X3,
  Phone,
  Info
} from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, isBuyer, isSeller } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/';
    if (isBuyer) return '/buyer';
    if (user?.user_type === 'seller') return '/seller';
    if (user?.user_type === 'owner') return '/owner';
    return '/';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <ChefHat size={32} />
            <span>BMS</span>
          </Link>

          {/* Navigation */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link">
              <Home size={18} />
              Home
            </Link>
            <Link to="/products" className="nav-link">
              <Package size={18} />
              Products
            </Link>
            <Link to="/categories" className="nav-link">
              <Grid3X3 size={18} />
              Categories
            </Link>
            <Link to="/about" className="nav-link">
              <Info size={18} />
              About
            </Link>
            <Link to="/contact" className="nav-link">
              <Phone size={18} />
              Contact
            </Link>
          </nav>

          {/* Search */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search for bakery items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Notifications - only for authenticated users */}
            {isAuthenticated && <NotificationDropdown />}

            {/* Cart */}
            <button
              className="cart-btn"
              onClick={handleCartClick}
            >
              <ShoppingCart size={20} />
              {getItemCount() > 0 && (
                <span className="cart-badge">{getItemCount()}</span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="user-menu">
                <button
                  className="user-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User size={20} />
                  <span className="user-name">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="user-name-full">{user?.name}</div>
                        <div className="user-type">{user?.user_type}</div>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <Link
                      to={getDashboardLink()}
                      className="dropdown-link"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={16} />
                      Dashboard
                    </Link>

                    {isBuyer && (
                      <>
                        <Link
                          to="/buyer/orders"
                          className="dropdown-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package size={16} />
                          My Orders
                        </Link>
                        <Link
                          to="/buyer/favorites"
                          className="dropdown-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart size={16} />
                          Wishlist
                        </Link>
                      </>
                    )}

                    {(isSeller || user?.user_type === 'owner') && (
                      <>
                        <Link
                          to={`/${user?.user_type}/orders`}
                          className="dropdown-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package size={16} />
                          Orders
                        </Link>
                        <Link
                          to={`/${user?.user_type}/products`}
                          className="dropdown-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Grid3X3 size={16} />
                          My Products
                        </Link>
                      </>
                    )}

                    <Link
                      to={`/${user?.user_type === 'buyer' ? 'buyer' : user?.user_type}/profile`}
                      className="dropdown-link"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Profile
                    </Link>

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-link logout-btn"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <div className="mobile-search">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <Search size={20} />
                </button>
              </form>
            </div>

            <div className="mobile-nav-links">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/categories" onClick={() => setIsMenuOpen(false)}>Categories</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>

              {isAuthenticated && (
                <>
                  <div className="mobile-divider" />
                  <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  {isBuyer && (
                    <>
                      <Link to="/buyer/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                      <Link to="/buyer/favorites" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                    </>
                  )}
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                    Cart ({getItemCount()})
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
