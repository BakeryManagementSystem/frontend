import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, showWishlist = true }) => {
  const { addToCart } = useCart();
  const { isBuyer, isAuthenticated } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isBuyer) {
      checkWishlistStatus();
    }
  }, [product.id, isAuthenticated, isBuyer]);

  const checkWishlistStatus = async () => {
    try {
      const response = await ApiService.checkWishlist(product.id);
      setIsInWishlist(response.in_wishlist);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to add items to your wishlist');
      return;
    }

    if (!isBuyer) {
      alert('Only buyers can add items to wishlist');
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        await ApiService.removeFromWishlist(product.id);
        setIsInWishlist(false);
      } else {
        await ApiService.addToWishlist(product.id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center'}
            alt={product.name}
            className="product-image"
          />

          {product.discount && (
            <div className="product-discount">
              -{product.discount}%
            </div>
          )}

          <div className="product-actions">
            {showWishlist && isAuthenticated && isBuyer && (
              <button
                className={`action-btn wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleWishlist}
                disabled={wishlistLoading}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            )}
            <button
              className="action-btn view-btn"
              title="Quick View"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        <div className="product-info">
          <div className="product-category">
            {product.category}
          </div>

          <h3 className="product-name">
            {product.name}
          </h3>

          <div className="product-rating">
            <div className="stars">
              {renderStars(product.rating || 0)}
            </div>
            <span className="rating-count">
              ({product.reviewCount || 0})
            </span>
          </div>

          <div className="product-seller">
            by {product.seller}
          </div>

          <div className="product-price">
            {product.originalPrice && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="current-price">{formatPrice(product.discountPrice || product.price)}</span>
          </div>

          {!product.inStock && (
            <div className="out-of-stock">
              Out of Stock
            </div>
          )}
        </div>
      </Link>

      <div className="product-actions-bottom">
        <button
          className="btn btn-primary btn-sm add-to-cart"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
