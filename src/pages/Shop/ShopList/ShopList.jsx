import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../../services/api';
import {
  Store,
  Star,
  MapPin,
  Package,
  TrendingUp,
  Search,
  Filter,
  Heart,
  Eye,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchShops();
  }, [filter, sortBy]);

  const fetchShops = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        filter,
        sort: sortBy,
        search: searchQuery
      };

      const response = await ApiService.getAllShops(params);
      // Handle the API response structure: { success: true, data: [...] }
      const shopsData = response.success ? response.data : (response.data || response.shops || []);
      setShops(shopsData);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
      setError('Failed to load shops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchShops();
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchShops();
  };

  const filteredShops = shops.filter(shop => {
    if (searchQuery && !shop.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !shop.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="shop-list-page loading">
        <div className="loading-spinner"></div>
        <p>Loading bakery shops...</p>
      </div>
    );
  }

  return (
    <div className="shop-list-page">
      <div className="container">
        {/* Enhanced Page Header with Search */}
        <div className="page-header-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <Store size={20} />
              <span>Discover Local Bakeries</span>
            </div>
            <h1>Find Your Perfect Bakery</h1>
            <p>Explore {shops.length} amazing local bakeries and discover their delicious handcrafted products</p>

            {/* Enhanced Search Bar */}
            <div className="hero-search-container">
              <form onSubmit={handleSearch} className="hero-search-bar">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={22} />
                  <input
                    type="text"
                    placeholder="Search by bakery name, specialty, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="hero-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="clear-search-btn"
                      aria-label="Clear search"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <button type="submit" className="hero-search-btn">
                  <Search size={20} />
                  <span>Search</span>
                </button>
              </form>

              {/* Quick Filter Tags */}
              <div className="quick-filters">
                <button
                  className={`filter-tag ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Bakeries
                </button>
                <button
                  className={`filter-tag ${filter === 'verified' ? 'active' : ''}`}
                  onClick={() => setFilter('verified')}
                >
                  <span className="verified-dot"></span>
                  Verified
                </button>
                <button
                  className={`filter-tag ${filter === 'top-rated' ? 'active' : ''}`}
                  onClick={() => setFilter('top-rated')}
                >
                  <Star size={14} />
                  Top Rated
                </button>
                <button
                  className={`filter-tag ${filter === 'new' ? 'active' : ''}`}
                  onClick={() => setFilter('new')}
                >
                  <TrendingUp size={14} />
                  New Shops
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="hero-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>

        {/* Enhanced Controls Bar */}
        <div className="shop-controls-bar">
          <div className="controls-left">
            <p className="results-count">
              <strong>{filteredShops.length}</strong> {filteredShops.length === 1 ? 'bakery' : 'bakeries'} found
            </p>
          </div>

          <div className="controls-right">
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
            </button>

            <div className="sort-dropdown">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="rating">Highest Rated</option>
                <option value="products">Most Products</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-content">
              <div className="filter-section">
                <h4>Shop Type</h4>
                <div className="filter-options">
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Artisan Bakery</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Cake Specialist</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Pastry Shop</span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h4>Rating</h4>
                <div className="filter-options">
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span className="rating-label">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} /> & Up
                    </span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h4>Location</h4>
                <div className="filter-options">
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Near Me</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {/* Shop Grid */}
        {filteredShops.length > 0 ? (
          <div className="shops-grid">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.owner_id || shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="no-shops">
            <Store size={64} />
            <h3>No Bakeries Found</h3>
            <p>We couldn't find any bakery shops matching your criteria. Try adjusting your search or filters.</p>
            <button onClick={clearSearch} className="btn btn-primary">
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ShopCard = ({ shop }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/bakery/${shop.owner_id || shop.id}`}
      className="shop-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shop Banner */}
      <div className="shop-banner">
        {shop.banner_path ? (
          <img src={shop.banner_path} alt={shop.shop_name} />
        ) : (
          <div className="banner-placeholder">
            <Store size={48} />
          </div>
        )}
        {shop.verified && (
          <div className="verified-badge">
            <span>✓ Verified</span>
          </div>
        )}
      </div>

      {/* Shop Logo */}
      <div className="shop-logo">
        {shop.logo_path ? (
          <img src={shop.logo_path} alt={shop.shop_name} />
        ) : (
          <div className="logo-placeholder">
            <Store size={32} />
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className="shop-info">
        <h3 className="shop-name">{shop.shop_name || 'Unnamed Shop'}</h3>

        <p className="shop-description">
          {shop.description?.substring(0, 100) || 'A wonderful bakery shop'}
          {shop.description?.length > 100 && '...'}
        </p>

        {/* Shop Stats */}
        <div className="shop-stats">
          <div className="stat-item">
            <Star className="icon filled" size={16} />
            <span>{shop.average_rating?.toFixed(1) || '5.0'}</span>
            <span className="stat-label">({shop.total_reviews || 0} reviews)</span>
          </div>

          <div className="stat-item">
            <Package className="icon" size={16} />
            <span>{shop.total_products || 0}</span>
            <span className="stat-label">products</span>
          </div>

          <div className="stat-item">
            <TrendingUp className="icon" size={16} />
            <span>{shop.total_sales || 0}</span>
            <span className="stat-label">sales</span>
          </div>
        </div>

        {/* Shop Actions */}
        <div className={`shop-actions ${isHovered ? 'visible' : ''}`}>
          <button className="btn-icon" title="Add to Favorites">
            <Heart size={18} />
          </button>
          <button className="btn-icon" title="Quick View">
            <Eye size={18} />
          </button>
          <span className="view-shop">View Shop</span>
        </div>
      </div>
    </Link>
  );
};

export default ShopList;
