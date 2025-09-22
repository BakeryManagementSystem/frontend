import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import ProductCard from '../../../components/common/ProductCard/ProductCard';
import {
  Store,
  Star,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Heart,
  Share,
  Filter,
  Search,
  Package,
  Users,
  Eye,
  TrendingUp
} from 'lucide-react';
import './ShopDetail.css';

const ShopDetail = () => {
  const { shopId } = useParams();
  const { addToCart } = useCart();
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchShopData();
    fetchShopProducts();
  }, [shopId]);

  const fetchShopData = async () => {
    // Simulate API call with mock data
    setTimeout(() => {
      setShopData({
        id: shopId,
        name: 'Sweet Dreams Bakery',
        description: 'Artisan bakery specializing in fresh-baked breads, pastries, and custom cakes. We use only the finest ingredients and traditional baking methods to create delicious treats for every occasion.',
        logo: '/placeholder-bakery-logo.jpg',
        banner: '/placeholder-bakery-banner.jpg',
        owner: 'Maria Rodriguez',
        rating: 4.8,
        reviewCount: 186,
        followerCount: 892,
        productCount: 32,
        salesCount: 1245,
        joinDate: '2023-08-15',
        location: 'Downtown Bakery District',
        verified: true,
        policies: {
          shipping: 'Free delivery for orders over $30 within 5 miles. Fresh items delivered same day. Custom cakes require 48-hour advance notice.',
          returns: 'Fresh bakery items must be returned within 24 hours if unsatisfactory. Custom orders are non-refundable unless there is a quality issue.',
          exchange: 'We accept exchanges for packaged goods within 3 days. Fresh items can only be exchanged if there is a quality concern.'
        },
        social: {
          website: 'https://sweetdreamsbakery.com',
          facebook: 'sweetdreamsbakery',
          twitter: '@sweetdreams_bakery',
          instagram: 'sweetdreamsbakery'
        },
        theme: {
          primaryColor: '#6639a6',
          secondaryColor: '#7f4fc3',
          accentColor: '#9b75d0'
        }
      });
      setLoading(false);
    }, 1000);
  };

  const fetchShopProducts = async () => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: "Artisan Sourdough Bread",
          price: 8.99,
          originalPrice: 10.99,
          image: "/placeholder-bread.jpg",
          category: "Breads",
          rating: 4.7,
          reviewCount: 89,
          seller: "Sweet Dreams Bakery",
          discount: 18,
          inStock: true
        },
        {
          id: 2,
          name: "Chocolate Croissants (6-pack)",
          price: 12.99,
          originalPrice: 15.99,
          image: "/placeholder-croissant.jpg",
          category: "Pastries",
          rating: 4.9,
          reviewCount: 156,
          seller: "Sweet Dreams Bakery",
          discount: 19,
          inStock: true
        },
        {
          id: 3,
          name: "Custom Birthday Cake",
          price: 45.00,
          image: "/placeholder-cake.jpg",
          category: "Cakes",
          rating: 4.8,
          reviewCount: 78,
          seller: "Sweet Dreams Bakery",
          inStock: true
        },
        {
          id: 4,
          name: "Fresh Blueberry Muffins (12-pack)",
          price: 18.99,
          image: "/placeholder-muffins.jpg",
          category: "Muffins",
          rating: 4.6,
          reviewCount: 45,
          seller: "Sweet Dreams Bakery",
          inStock: false
        }
      ];
      setProducts(mockProducts);
    }, 1500);
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];


  if (!shopData) {
    return (
      <div className="shop-not-found">
        <div className="container">
          <h1>Shop Not Found</h1>
          <p>The shop you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-detail">
      {/* Shop Banner */}
      <div className="shop-banner">
        <img src={shopData.banner || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop&crop=center'} alt={shopData.name} className="banner-image" />
        <div className="banner-overlay">
          <div className="container">
            <div className="shop-header">
              <div className="shop-info">
                <div className="shop-main-info">
                  <div className="shop-avatar">
                    <div className="shop-logo">
                      <img src={shopData.logo || 'https://images.unsplash.com/photo-1555507036-ab794f4eed25?w=120&h=120&fit=crop&crop=center'} alt={shopData.name} />
                      {shopData.verified && (
                        <div className="verified-badge" title="Verified Seller">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shop-details">
                    <h1>{shopData.name}</h1>
                    <div className="shop-meta">
                      <div className="shop-rating">
                        <div className="stars">
                          {renderStars(shopData.rating)}
                        </div>
                        <span>{shopData.rating} ({shopData.reviewCount} reviews)</span>
                      </div>
                      <div className="shop-location">
                        <MapPin size={14} />
                        {shopData.location}
                      </div>
                    </div>
                    <p className="shop-description">{shopData.description}</p>
                  </div>
                </div>

                <div className="shop-actions">
                  <button
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleFollow}
                  >
                    <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="btn btn-outline">
                    <MessageCircle size={16} />
                    Contact
                  </button>
                  <button className="btn btn-outline">
                    <Share size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Shop Stats */}
        <div className="shop-stats">
          <div className="stat-item">
            <Package size={20} />
            <div className="stat-content">
              <div className="stat-value">{shopData.productCount}</div>
              <div className="stat-label">Products</div>
            </div>
          </div>
          <div className="stat-item">
            <Users size={20} />
            <div className="stat-content">
              <div className="stat-value">{shopData.followerCount.toLocaleString()}</div>
              <div className="stat-label">Followers</div>
            </div>
          </div>
          <div className="stat-item">
            <TrendingUp size={20} />
            <div className="stat-content">
              <div className="stat-value">{shopData.salesCount}</div>
              <div className="stat-label">Sales</div>
            </div>
          </div>
          <div className="stat-item">
            <Star size={20} />
            <div className="stat-content">
              <div className="stat-value">{shopData.rating}</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>

        <div className="shop-content">
          {/* Products Section */}
          <div className="products-section">
            <div className="products-header">
              <h2>Products ({filteredProducts.length})</h2>

              <div className="products-controls">
                <div className="search-bar">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="category-filter"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-products">
                <Package size={48} />
                <h3>No products found</h3>
                <p>No products match your search criteria.</p>
              </div>
            )}
          </div>

          {/* Shop Sidebar */}
          <div className="shop-sidebar">
            {/* Shop Info */}
            <div className="sidebar-section">
              <h3>About This Shop</h3>
              <div className="shop-info-card">
                <div className="info-item">
                  <span className="label">Owner:</span>
                  <span className="value">{shopData.owner}</span>
                </div>
                <div className="info-item">
                  <span className="label">Member since:</span>
                  <span className="value">{new Date(shopData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Location:</span>
                  <span className="value">{shopData.location}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(shopData.social.website || shopData.social.facebook || shopData.social.twitter || shopData.social.instagram) && (
              <div className="sidebar-section">
                <h3>Connect With Us</h3>
                <div className="social-links">
                  {shopData.social.website && (
                    <a href={shopData.social.website} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Globe size={16} />
                      Website
                    </a>
                  )}
                  {shopData.social.facebook && (
                    <a href={`https://facebook.com/${shopData.social.facebook}`} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Facebook size={16} />
                      Facebook
                    </a>
                  )}
                  {shopData.social.twitter && (
                    <a href={`https://twitter.com/${shopData.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Twitter size={16} />
                      Twitter
                    </a>
                  )}
                  {shopData.social.instagram && (
                    <a href={`https://instagram.com/${shopData.social.instagram}`} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Instagram size={16} />
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Policies */}
            <div className="sidebar-section">
              <h3>Shop Policies</h3>
              <div className="policies">
                <details className="policy-item">
                  <summary>Shipping Policy</summary>
                  <p>{shopData.policies.shipping}</p>
                </details>
                <details className="policy-item">
                  <summary>Return Policy</summary>
                  <p>{shopData.policies.returns}</p>
                </details>
                <details className="policy-item">
                  <summary>Exchange Policy</summary>
                  <p>{shopData.policies.exchange}</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
