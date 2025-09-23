import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
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
            src={product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff'}
            alt={product.name}
            className="product-image"
          />

          {product.discount && (
            <div className="product-discount">
              -{product.discount}%
            </div>
          )}
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

          {product.seller && (
            <div className="product-seller">
              by {product.seller}
            </div>
          )}

          <div className="product-price">
            {product.originalPrice && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="current-price">{formatPrice(product.discountPrice || product.price)}</span>
          </div>

          {product.inStock === false && (
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
          disabled={product.inStock === false}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
