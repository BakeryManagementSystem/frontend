import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import ApiService from '../../../services/api';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Search,
  Star,
  Filter
} from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
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
      setWishlistItems(response || []);
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
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      alert('Failed to remove item from wishlist. Please try again.');
    }
  };

  const handleAddToCart = (item) => {
    const product = {
      id: item.product_id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      seller: item.seller,
      inStock: item.inStock
    };
    addToCart(product);
  };

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'in-stock' && item.inStock) ||
      (filter === 'out-of-stock' && !item.inStock);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading"></div>
            <p>Loading your wishlist...</p>
          </div>
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
          <div className="empty-wishlist">
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

            {/* Wishlist Grid */}
            <div className="wishlist-grid">
              {filteredItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <Link to={`/products/${item.product_id}`}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'}
                        alt={item.name}
                        className="product-image"
                      />
                    </Link>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromWishlist(item.product_id)}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="item-info">
                    <div className="item-category">{item.category}</div>

                    <h3 className="item-name">
                      <Link to={`/products/${item.product_id}`}>
                        {item.name}
                      </Link>
                    </h3>

                    <div className="item-seller">
                      by {item.seller}
                    </div>

                    <div className="item-price">
                      <span className="current-price">${item.price}</span>
                    </div>

                    <div className="item-status">
                      <span className={`status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="item-added">
                      Added {new Date(item.addedDate).toLocaleDateString()}
                    </div>

                    <div className="item-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>

                      <Link
                        to={`/products/${item.product_id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && searchQuery && (
              <div className="no-results">
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
