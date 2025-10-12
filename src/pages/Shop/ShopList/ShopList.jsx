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
  Eye
} from 'lucide-react';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

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
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Explore Bakery Shops</h1>
            <p>Discover amazing local bakeries and their delicious products</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="shop-controls">
          <form onSubmit={handleSearch} className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search bakery shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          <div className="filter-group">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Shops</option>
              <option value="verified">Verified Only</option>
              <option value="top-rated">Top Rated</option>
              <option value="new">New Shops</option>
            </select>

            <select
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
            <h3>No Shops Found</h3>
            <p>We couldn't find any bakery shops matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ShopCard = ({ shop }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Helper function to get image URL with fallbacks
  const getImageUrl = (shop, type) => {
    // Try both field names for compatibility
    if (type === 'logo') {
      return shop.logo || shop.logo_path;
    } else if (type === 'banner') {
      return shop.banner || shop.banner_path;
    }
    return null;
  };

  const logoUrl = getImageUrl(shop, 'logo');
  const bannerUrl = getImageUrl(shop, 'banner');

  return (
    <Link
      to={`/bakery/${shop.owner_id || shop.id}`}
      className="shop-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shop Banner */}
      <div className="shop-banner">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={shop.shop_name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="banner-placeholder" style={{ display: bannerUrl ? 'none' : 'flex' }}>
          <Store size={48} />
        </div>
        {shop.verified && (
          <div className="verified-badge">
            <span>✓ Verified</span>
          </div>
        )}
      </div>

      {/* Shop Logo */}
      <div className="shop-logo">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={shop.shop_name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="logo-placeholder" style={{ display: logoUrl ? 'none' : 'flex' }}>
          <Store size={32} />
        </div>
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
        </div>

        {/* Shop Performance Indicator */}
        <div className="shop-performance">
          {shop.total_sales > 50 && (
            <div className="performance-badge trending">
              <TrendingUp size={12} />
              <span>Popular</span>
            </div>
          )}
          {shop.average_rating >= 4.8 && (
            <div className="performance-badge top-rated">
              <Star size={12} />
              <span>Top Rated</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      {isHovered && (
        <div className="shop-card-overlay">
          <Eye size={20} />
          <span>View Shop</span>
        </div>
      )}
    </Link>
  );
};

export default ShopList;
