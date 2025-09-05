import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      const mockWishlist = [
        {
          id: 1,
          name: "Smart Watch Pro",
          price: 299.99,
          originalPrice: 349.99,
          image: "/placeholder-product.jpg",
          category: "Electronics",
          rating: 4.5,
          reviewCount: 234,
          inStock: true,
          seller: "TechStore",
          addedDate: "2024-01-10"
        },
        {
          id: 2,
          name: "Wireless Earbuds Premium",
          price: 79.99,
          image: "/placeholder-product.jpg",
          category: "Electronics",
          rating: 4.3,
          reviewCount: 89,
          inStock: false,
          seller: "AudioTech",
          addedDate: "2024-01-08"
        },
        {
          id: 3,
          name: "Designer Backpack",
          price: 59.99,
          originalPrice: 89.99,
          image: "/placeholder-product.jpg",
          category: "Fashion",
          rating: 4.7,
          reviewCount: 156,
          inStock: true,
          seller: "StyleHub",
          addedDate: "2024-01-05"
        },
        {
          id: 4,
          name: "Yoga Mat Premium",
          price: 34.99,
          image: "/placeholder-product.jpg",
          category: "Sports",
          rating: 4.6,
          reviewCount: 78,
          inStock: true,
          seller: "FitLife",
          addedDate: "2024-01-03"
        }
      ];
      setWishlistItems(mockWishlist);
      setLoading(false);
    }, 1000);
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    // Optionally show success message
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} fill="currentColor" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} fill="currentColor" opacity={0.5} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} />);
    }

    return stars;
  };

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'in-stock') return matchesSearch && item.inStock;
    if (filter === 'out-of-stock') return matchesSearch && !item.inStock;
    if (filter === 'on-sale') return matchesSearch && item.originalPrice;

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="wishlist loading">
        <div className="container">
          <div className="loading-text">Loading your wishlist...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>My Wishlist</h1>
          <p>Keep track of items you want to buy later</p>
        </div>

        {/* Controls */}
        <div className="wishlist-controls">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-options">
            <Filter size={16} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="on-sale">On Sale</option>
            </select>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="wishlist-content">
          {filteredItems.length > 0 ? (
            <>
              <div className="wishlist-stats">
                <span>{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in your wishlist</span>
              </div>

              <div className="wishlist-grid">
                {filteredItems.map(item => (
                  <div key={item.id} className="wishlist-item">
                    <div className="item-image-container">
                      <Link to={`/products/${item.id}`}>
                        <img src={item.image} alt={item.name} className="item-image" />
                      </Link>
                      {item.originalPrice && (
                        <div className="sale-badge">
                          Sale
                        </div>
                      )}
                      <button
                        className="remove-btn"
                        onClick={() => removeFromWishlist(item.id)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="item-info">
                      <div className="item-category">{item.category}</div>

                      <Link to={`/products/${item.id}`} className="item-name">
                        {item.name}
                      </Link>

                      <div className="item-rating">
                        <div className="stars">
                          {renderStars(item.rating)}
                        </div>
                        <span className="rating-count">({item.reviewCount})</span>
                      </div>

                      <div className="item-price">
                        {item.originalPrice && (
                          <span className="original-price">${item.originalPrice}</span>
                        )}
                        <span className="current-price">${item.price}</span>
                      </div>

                      <div className="item-seller">
                        by {item.seller}
                      </div>

                      <div className={`item-stock ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {item.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                      </div>

                      <div className="item-actions">
                        {item.inStock ? (
                          <button
                            className="btn btn-primary btn-full"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart size={16} />
                            Add to Cart
                          </button>
                        ) : (
                          <button className="btn btn-secondary btn-full" disabled>
                            Notify When Available
                          </button>
                        )}
                      </div>

                      <div className="item-added-date">
                        Added {new Date(item.addedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-wishlist">
              <Heart size={64} />
              <h3>Your wishlist is empty</h3>
              <p>
                {searchQuery || filter !== 'all'
                  ? 'No items match your current search or filter criteria.'
                  : 'Start adding items to your wishlist by clicking the heart icon on products you love.'
                }
              </p>
              <Link to="/products" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
