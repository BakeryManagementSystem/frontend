import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
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
  const { getItemCount, toggleCart } = useCart();
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
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div className="header-logo">
              <Link to="/" className="logo-link" onClick={closeMenus}>
                <ChefHat size={32} className="logo-icon" />
                <div className="logo-text">
                  <span className="logo-title">BMS</span>
                  <span className="logo-subtitle">Bakery Management</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <Link to="/" className="nav-link">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/products" className="nav-link">
                <Package size={18} />
                <span>Products</span>
              </Link>
              <Link to="/categories" className="nav-link">
                <Grid3X3 size={18} />
                <span>Categories</span>
              </Link>
              <Link to="/about" className="nav-link">
                <Info size={18} />
                <span>About</span>
              </Link>
              <Link to="/contact" className="nav-link">
                <Phone size={18} />
                <span>Contact</span>
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="header-search">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search bakery items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <button type="submit" className="search-button">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Header Actions */}
            <div className="header-actions">
              {/* Cart */}
              {isBuyer && (
                <button className="action-btn cart-btn" onClick={toggleCart}>
                  <ShoppingCart size={22} />
                  {getItemCount() > 0 && (
                    <span className="cart-badge">{getItemCount()}</span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="user-menu">
                  <button className="action-btn user-btn" onClick={toggleUserMenu}>
                    <User size={22} />
                    <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div className="menu-overlay" onClick={toggleUserMenu}></div>
                      <div className="user-dropdown">
                        <div className="user-dropdown-header">
                          <div className="user-avatar">
                            <User size={24} />
                          </div>
                          <div className="user-info">
                            <div className="user-dropdown-name">{user?.name}</div>
                            <div className="user-dropdown-email">{user?.email}</div>
                            <div className="user-role">
                              {isBuyer && <span className="role-badge buyer">Customer</span>}
                              {isSeller && <span className="role-badge seller">Baker</span>}
                            </div>
                          </div>
                        </div>

                        <div className="user-dropdown-menu">
                          {isBuyer && (
                            <>
                              <Link to="/buyer/dashboard" className="dropdown-item" onClick={toggleUserMenu}>
                                <User size={16} />
                                <span>Dashboard</span>
                              </Link>
                              <Link to="/buyer/orders" className="dropdown-item" onClick={toggleUserMenu}>
                                <Package size={16} />
                                <span>My Orders</span>
                              </Link>
                              <Link to="/buyer/wishlist" className="dropdown-item" onClick={toggleUserMenu}>
                                <Heart size={16} />
                                <span>Wishlist</span>
                              </Link>
                              <Link to="/buyer/profile" className="dropdown-item" onClick={toggleUserMenu}>
                                <Settings size={16} />
                                <span>Profile</span>
                              </Link>
                            </>
                          )}

                          {isSeller && (
                            <>
                              <Link to="/seller/dashboard" className="dropdown-item" onClick={toggleUserMenu}>
                                <ChefHat size={16} />
                                <span>Dashboard</span>
                              </Link>
                              <Link to="/seller/products" className="dropdown-item" onClick={toggleUserMenu}>
                                <Package size={16} />
                                <span>Products</span>
                              </Link>
                              <Link to="/seller/orders" className="dropdown-item" onClick={toggleUserMenu}>
                                <ShoppingCart size={16} />
                                <span>Orders</span>
                              </Link>
                              <Link to="/seller/shop" className="dropdown-item" onClick={toggleUserMenu}>
                                <ChefHat size={16} />
                                <span>Manage Shop</span>
                              </Link>
                              <Link to="/seller/profile" className="dropdown-item" onClick={toggleUserMenu}>
                                <Settings size={16} />
                                <span>Profile</span>
                              </Link>
                            </>
                          )}

                          <div className="dropdown-divider"></div>
                          <button onClick={handleLogout} className="dropdown-item logout-btn">
                            <LogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-outline" onClick={closeMenus}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={closeMenus}>
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
            <div className="mobile-menu">
              {/* Mobile Search */}
              <div className="mobile-search">
                <form onSubmit={handleSearch} className="mobile-search-form">
                  <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search bakery items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <button type="submit" className="search-button">
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Mobile Navigation */}
              <nav className="mobile-nav">
                <Link to="/" className="mobile-nav-link" onClick={closeMenus}>
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                <Link to="/products" className="mobile-nav-link" onClick={closeMenus}>
                  <Package size={20} />
                  <span>Products</span>
                </Link>
                <Link to="/categories" className="mobile-nav-link" onClick={closeMenus}>
                  <Grid3X3 size={20} />
                  <span>Categories</span>
                </Link>
                <Link to="/about" className="mobile-nav-link" onClick={closeMenus}>
                  <Info size={20} />
                  <span>About</span>
                </Link>
                <Link to="/contact" className="mobile-nav-link" onClick={closeMenus}>
                  <Phone size={20} />
                  <span>Contact</span>
                </Link>

                {/* Mobile User Menu */}
                {isAuthenticated && (
                  <>
                    <div className="mobile-divider"></div>
                    <div className="mobile-user-section">
                      <div className="mobile-user-info">
                        <User size={24} />
                        <div>
                          <div className="mobile-user-name">{user?.name}</div>
                          <div className="mobile-user-email">{user?.email}</div>
                        </div>
                      </div>

                      {isBuyer && (
                        <>
                          <Link to="/buyer/dashboard" className="mobile-nav-link" onClick={closeMenus}>
                            <User size={20} />
                            <span>Dashboard</span>
                          </Link>
                          <Link to="/buyer/orders" className="mobile-nav-link" onClick={closeMenus}>
                            <Package size={20} />
                            <span>My Orders</span>
                          </Link>
                          <Link to="/buyer/wishlist" className="mobile-nav-link" onClick={closeMenus}>
                            <Heart size={20} />
                            <span>Wishlist</span>
                          </Link>
                        </>
                      )}

                      {isSeller && (
                        <>
                          <Link to="/seller/dashboard" className="mobile-nav-link" onClick={closeMenus}>
                            <ChefHat size={20} />
                            <span>Dashboard</span>
                          </Link>
                          <Link to="/seller/products" className="mobile-nav-link" onClick={closeMenus}>
                            <Package size={20} />
                            <span>Products</span>
                          </Link>
                          <Link to="/seller/orders" className="mobile-nav-link" onClick={closeMenus}>
                            <ShoppingCart size={20} />
                            <span>Orders</span>
                          </Link>
                        </>
                      )}

                      <button onClick={handleLogout} className="mobile-nav-link logout">
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Mobile Auth Buttons */}
                {!isAuthenticated && (
                  <>
                    <div className="mobile-divider"></div>
                    <div className="mobile-auth">
                      <Link to="/login" className="btn btn-outline btn-full" onClick={closeMenus}>
                        Login
                      </Link>
                      <Link to="/register" className="btn btn-primary btn-full" onClick={closeMenus}>
                        Sign Up
                      </Link>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
