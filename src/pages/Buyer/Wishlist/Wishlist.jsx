import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../../services/api';
import ProductCard from '../../../components/common/ProductCard/ProductCard';
import {
  Heart,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getWishlist();

      // Handle both direct array and nested data property
      let wishlistData = [];
      if (response && response.success && Array.isArray(response.data)) {
        wishlistData = response.data;
      } else if (Array.isArray(response)) {
        wishlistData = response;
      } else if (response) {
        wishlistData = response;
      }

      setWishlistItems(wishlistData || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setError('Failed to load wishlist items. Please try again later.');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await ApiService.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => (item.product_id || item.id) !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      alert('Failed to remove item from wishlist. Please try again.');
    }
  };

  const filteredItems = wishlistItems.filter(item => {
    const name = (item.name || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const inStock = !!item.inStock;
    const matchesFilter = filter === 'all' ||
      (filter === 'in-stock' && inStock) ||
      (filter === 'out-of-stock' && !inStock);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading-text">Loading wishlist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="error-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchWishlist} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>My Wishlist</h1>
          <p>Save items for later and never lose track of what you love</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist empty-state">
            <Heart size={64} className="empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Start adding items to your wishlist to see them here</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="wishlist-controls">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search wishlist items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-controls">
                <Filter size={16} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Items ({wishlistItems.length})</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="results-info">
              <p>Showing {filteredItems.length} of {wishlistItems.length} items</p>
            </div>

            {/* Wishlist Grid using ProductCard */}
            <div className="products-grid">
              {filteredItems.map(item => {
                const product = {
                  id: item.product_id || item.id,
                  name: item.name,
                  image: item.image,
                  price: item.price,
                  category: item.category,
                  seller: item.seller,
                  inStock: item.inStock,
                  rating: item.rating || 0,
                  reviewCount: item.reviewCount || 0,
                };
                return (
                  <div key={product.id} className="wishlist-card-wrapper">
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(product.id)}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && searchQuery && (
              <div className="no-results empty-state">
                <h3>No items found</h3>
                <p>No wishlist items match your search for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-outline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
