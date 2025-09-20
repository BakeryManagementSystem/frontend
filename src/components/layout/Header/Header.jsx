import React, { useState, useEffect } from 'react';
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
  Info,
  Plus,
  Bell
} from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, isBuyer, isSeller } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const header = document.querySelector('.header');
      if (header && !header.contains(event.target)) {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    if (isMenuOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen]);

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
    setIsUserMenuOpen(false);
  };

  const handleAddProductClick = () => {
    if (user?.user_type === 'seller') {
      navigate('/seller/products/add');
    } else if (user?.user_type === 'owner') {
      navigate('/owner/products/add');
    }
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/';
    if (isBuyer) return '/buyer';
    if (user?.user_type === 'seller') return '/seller';
    if (user?.user_type === 'owner') return '/owner';
    return '/';
  };

  const getUserTypeDisplay = () => {
    if (user?.user_type === 'buyer') return 'Buyer';
    if (user?.user_type === 'seller') return 'Seller';
    if (user?.user_type === 'owner') return 'Owner';
    return user?.user_type || '';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div
          className={`mobile-backdrop ${(isMenuOpen || isUserMenuOpen) ? 'active' : ''}`}
          onClick={closeAllMenus}
        />
      )}

      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo" onClick={closeAllMenus}>
              <ChefHat size={32} />
              <span>BMS</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav desktop-nav">
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

            {/* Desktop Search */}
            <div className="search-container desktop-search">
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

            {/* Desktop Auth/User Section */}
            <div className="header-actions desktop-actions">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <NotificationDropdown />

                  {/* Seller/Owner: Add Product Button */}
                  {(isSeller || user?.user_type === 'owner') && (
                    <button
                      className="add-product-btn"
                      onClick={handleAddProductClick}
                      title="Add New Product"
                    >
                      <Plus size={20} />
                    </button>
                  )}

                  {/* Buyer: Cart Button */}
                  {isBuyer && (
                    <button
                      className="cart-btn"
                      onClick={handleCartClick}
                    >
                      <ShoppingCart size={20} />
                      {getItemCount() > 0 && (
                        <span className="cart-badge">{getItemCount()}</span>
                      )}
                    </button>
                  )}

                  {/* User Profile */}
                  <div className="user-menu">
                    <button
                      className="user-btn desktop-user-btn"
                      onClick={toggleUserMenu}
                    >
                      <User size={20} />
                      <div className="user-info-desktop">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-type">{getUserTypeDisplay()}</span>
                      </div>
                    </button>

                    {isUserMenuOpen && (
                      <div className="user-dropdown">
                        <div className="user-info">
                          <div className="user-avatar">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="user-name-full">{user?.name}</div>
                            <div className="user-type-full">{getUserTypeDisplay()}</div>
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
                </>
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
            </div>

            {/* Mobile Actions */}
            <div className="mobile-actions">
              {isAuthenticated ? (
                <>
                  {/* Mobile Notifications */}
                  <div className="mobile-notification">
                    <NotificationDropdown />
                  </div>

                  {/* Mobile Seller: Add Product */}
                  {(isSeller || user?.user_type === 'owner') && (
                    <button
                      className="mobile-icon-btn add-product-btn"
                      onClick={handleAddProductClick}
                      title="Add New Product"
                    >
                      <Plus size={20} />
                    </button>
                  )}

                  {/* Mobile Buyer: Cart */}
                  {isBuyer && (
                    <button
                      className="mobile-icon-btn cart-btn"
                      onClick={handleCartClick}
                      title="Shopping Cart"
                    >
                      <ShoppingCart size={20} />
                      {getItemCount() > 0 && (
                        <span className="cart-badge">{getItemCount()}</span>
                      )}
                    </button>
                  )}

                  {/* Mobile User Profile */}
                  <button
                    className="mobile-icon-btn user-btn"
                    onClick={toggleUserMenu}
                    title="User Menu"
                  >
                    <User size={20} />
                  </button>

                  {/* Mobile User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="mobile-user-dropdown">
                      <div className="user-info">
                        <div className="user-avatar">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="user-name-full">{user?.name}</div>
                          <div className="user-type-full">{getUserTypeDisplay()}</div>
                        </div>
                      </div>

                      <div className="dropdown-divider" />

                      <Link
                        to={getDashboardLink()}
                        className="dropdown-link"
                        onClick={closeAllMenus}
                      >
                        <Package size={16} />
                        Dashboard
                      </Link>

                      {isBuyer && (
                        <>
                          <Link
                            to="/buyer/orders"
                            className="dropdown-link"
                            onClick={closeAllMenus}
                          >
                            <Package size={16} />
                            My Orders
                          </Link>
                          <Link
                            to="/buyer/favorites"
                            className="dropdown-link"
                            onClick={closeAllMenus}
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
                            onClick={closeAllMenus}
                          >
                            <Package size={16} />
                            Orders
                          </Link>
                          <Link
                            to={`/${user?.user_type}/products`}
                            className="dropdown-link"
                            onClick={closeAllMenus}
                          >
                            <Grid3X3 size={16} />
                            My Products
                          </Link>
                        </>
                      )}

                      <Link
                        to={`/${user?.user_type === 'buyer' ? 'buyer' : user?.user_type}/profile`}
                        className="dropdown-link"
                        onClick={closeAllMenus}
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
                </>
              ) : (
                /* Mobile Not Logged In: Cart + Menu */
                <button
                  className="mobile-icon-btn cart-btn"
                  onClick={handleCartClick}
                  title="Shopping Cart"
                >
                  <ShoppingCart size={20} />
                  {getItemCount() > 0 && (
                    <span className="cart-badge">{getItemCount()}</span>
                  )}
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-btn"
                onClick={toggleMobileMenu}
                title={isMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
            <div className="mobile-nav-content">
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
                <Link to="/" onClick={closeAllMenus}>
                  <Home size={18} />
                  Home
                </Link>
                <Link to="/products" onClick={closeAllMenus}>
                  <Package size={18} />
                  Products
                </Link>
                <Link to="/categories" onClick={closeAllMenus}>
                  <Grid3X3 size={18} />
                  Categories
                </Link>
                <Link to="/about" onClick={closeAllMenus}>
                  <Info size={18} />
                  About
                </Link>
                <Link to="/contact" onClick={closeAllMenus}>
                  <Phone size={18} />
                  Contact
                </Link>

                {!isAuthenticated && (
                  <>
                    <div className="mobile-divider" />
                    <Link to="/login" onClick={closeAllMenus} className="mobile-auth-link">
                      Login
                    </Link>
                    <Link to="/register" onClick={closeAllMenus} className="mobile-auth-link">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
