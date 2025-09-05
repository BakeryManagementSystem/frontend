import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  Heart,
  Share,
  Minus,
  Plus,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
  Store,
  MessageCircle
} from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isBuyer } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      const mockProduct = {
        id: parseInt(id),
        name: "Artisan Sourdough Bread",
        price: 8.99,
        originalPrice: 10.99,
        discount: 18,
        images: [
          "/placeholder-sourdough.jpg",
          "/placeholder-sourdough-2.jpg",
          "/placeholder-sourdough-3.jpg",
          "/placeholder-sourdough-4.jpg"
        ],
        category: "Breads",
        rating: 4.8,
        reviewCount: 128,
        seller: {
          name: "Heritage Bakery",
          rating: 4.9,
          totalSales: 2450
        },
        inStock: true,
        stockCount: 8,
        freeShipping: true,
        description: "Our signature artisan sourdough bread is crafted using traditional methods with a 24-hour fermentation process. Made with organic flour and natural starter, this bread features a perfectly crispy crust and tangy, airy crumb that's perfect for any meal.",
        features: [
          "24-hour natural fermentation",
          "Made with organic flour",
          "Natural sourdough starter",
          "No artificial preservatives",
          "Baked fresh daily",
          "Crispy crust, soft interior"
        ],
        specifications: {
          "Baker": "Heritage Bakery",
          "Type": "Artisan Sourdough",
          "Weight": "1.5 lbs (680g)",
          "Ingredients": "Organic flour, water, salt, sourdough starter",
          "Shelf Life": "3-5 days",
          "Storage": "Room temperature in bread bag",
          "Allergens": "Contains gluten",
          "Baked": "Fresh daily at 6 AM"
        },
        reviews: [
          {
            id: 1,
            user: "Maria L.",
            rating: 5,
            date: "2024-01-15",
            comment: "Best sourdough in the city! Perfect crust and amazing flavor. My family loves it!"
          },
          {
            id: 2,
            user: "David K.",
            rating: 5,
            date: "2024-01-10",
            comment: "Absolutely fantastic bread. The tangy flavor and texture are perfect. Will order again!"
          },
          {
            id: 3,
            user: "Jennifer S.",
            rating: 4,
            date: "2024-01-08",
            comment: "Great quality sourdough. Stays fresh for days and makes amazing toast."
          }
        ]
      };
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show success message or redirect
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="currentColor" opacity={0.5} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="container">
          <div className="loading-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span onClick={() => navigate('/products')}>Products</span>
          <span onClick={() => navigate(`/categories/${product.category.toLowerCase()}`)}>
            {product.category}
          </span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="main-product-image"
              />
              {product.discount && (
                <div className="product-discount-badge">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-actions">
                <button className="action-btn">
                  <Heart size={20} />
                </button>
                <button className="action-btn">
                  <Share size={20} />
                </button>
              </div>
            </div>

            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="product-pricing">
              <div className="current-price">${product.price}</div>
              {product.originalPrice && (
                <div className="original-price">${product.originalPrice}</div>
              )}
              {product.discount && (
                <div className="savings">
                  You save ${(product.originalPrice - product.price).toFixed(2)}
                </div>
              )}
            </div>

            <div className="product-availability">
              {product.inStock ? (
                <span className="in-stock">
                  ✓ In Stock ({product.stockCount} available)
                </span>
              ) : (
                <span className="out-of-stock">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            <div className="product-features">
              <h4>Key Features:</h4>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {isBuyer && product.inStock && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      disabled={quantity >= product.stockCount}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="purchase-buttons">
                  <button
                    className="btn btn-outline btn-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-primary btn-full"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            <div className="seller-info">
              <div className="seller-header">
                <Store size={20} />
                <h4>Sold by {product.seller.name}</h4>
              </div>
              <div className="seller-details">
                <div className="seller-rating">
                  <div className="stars">
                    {renderStars(product.seller.rating)}
                  </div>
                  <span>{product.seller.rating} ({product.seller.totalSales} sales)</span>
                </div>
                <button className="btn btn-secondary btn-sm">
                  <MessageCircle size={16} />
                  Contact Seller
                </button>
              </div>
            </div>

            <div className="product-guarantees">
              <div className="guarantee-item">
                <Shield size={20} />
                <span>Secure Payment</span>
              </div>
              {product.freeShipping && (
                <div className="guarantee-item">
                  <Truck size={20} />
                  <span>Free Shipping</span>
                </div>
              )}
              <div className="guarantee-item">
                <RotateCcw size={20} />
                <span>30-day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button
              className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button
              className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <p>{product.description}</p>
                <h4>Features:</h4>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="specifications-content">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="spec-label">{key}</td>
                        <td className="spec-value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                {product.reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.user}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
