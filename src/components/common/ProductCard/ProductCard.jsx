import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, showWishlist = true }) => {
  const { addToCart } = useCart();
  const { isBuyer } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add wishlist functionality here
    console.log('Add to wishlist:', product.id);
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
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="product-image"
          />

          {product.discount && (
            <div className="product-discount">
              -{product.discount}%
            </div>
          )}

          <div className="product-actions">
            <button
              className="action-btn wishlist-btn"
              onClick={handleWishlist}
              title="Add to Wishlist"
            >
              <Heart size={18} />
            </button>
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

          <div className="product-price">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="current-price">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="product-seller">
            by {product.seller || 'BMS Store'}
          </div>
        </div>
      </Link>

      {isBuyer && (
        <div className="product-card-footer">
          <button
            className="btn btn-primary btn-full add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
