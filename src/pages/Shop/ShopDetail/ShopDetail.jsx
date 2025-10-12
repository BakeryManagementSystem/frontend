import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import ApiService from '../../../services/api';
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
  Share2,
  Filter,
  Search,
  Package,
  Users,
  TrendingUp,
  Award,
  Clock,
  ShoppingBag,
  Phone,
  Mail,
  CheckCircle,
  Calendar
} from 'lucide-react';
import './ShopDetail.css';

const ShopDetail = () => {
  const { shopId } = useParams();
  const { addToCart } = useCart();
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchShopData();
    fetchShopProducts();
  }, [shopId]);

  const fetchShopData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ApiService.getShopByOwner(shopId);
      const { shop, owner } = response;

      // Parse JSON fields if they're strings
      const parseSafe = (field, defaultValue = {}) => {
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return defaultValue;
          }
        }
        return field || defaultValue;
      };

      setShopData({
        id: shop.id,
        owner_id: shop.owner_id,
        name: shop.shop_name || owner.name + "'s Shop",
        description: shop.description || 'A wonderful bakery shop',
        logo: shop.logo || shop.logo_path || null,
        banner: shop.banner || shop.banner_path || null,
        owner: owner.name,
        ownerEmail: owner.email,
        rating: shop.average_rating || 5.0,
        reviewCount: shop.total_reviews || 0,
        followerCount: shop.follower_count || 0,
        productCount: shop.total_products || 0,
        salesCount: shop.total_sales || 0,
        joinDate: shop.created_at,
        location: shop.address || '',
        verified: shop.verified || false,
        policies: parseSafe(shop.policies, {
          shipping: '',
          returns: '',
          exchange: ''
        }),
        social: parseSafe(shop.social, {
          website: '',
          facebook: '',
          twitter: '',
          instagram: ''
        }),
        theme: parseSafe(shop.theme, {
          primaryColor: '#6639a6',
          secondaryColor: '#7f4fc3',
          accentColor: '#9b75d0'
        })
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch shop data:', error);
      setError('Failed to load shop data. Please try again.');
      setLoading(false);
    }
  };

  const fetchShopProducts = async () => {
    try {
      const response = await ApiService.getProducts({
        owner_id: shopId,
        per_page: 100
      });
      const productList = response.data || [];
      setProducts(productList);
    } catch (error) {
      console.error('Failed to fetch shop products:', error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" className="star-icon" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="currentColor" opacity={0.5} className="star-icon" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="star-icon star-empty" />);
    }

    return stars;
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shopData.name,
        text: shopData.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="shop-detail loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (error || !shopData) {
    return (
      <div className="shop-not-found">
        <div className="container">
          <Package size={64} className="error-icon" />
          <h1>Shop Not Found</h1>
          <p>{error || "The shop you're looking for doesn't exist or has been removed."}</p>
          <Link to="/shops" className="btn btn-primary">Browse All Shops</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-detail" style={{
      '--shop-primary-color': shopData.theme?.primaryColor || '#6639a6',
      '--shop-secondary-color': shopData.theme?.secondaryColor || '#7f4fc3',
      '--shop-accent-color': shopData.theme?.accentColor || '#9b75d0'
    }}>
      {/* Shop Banner Image */}
      {shopData.banner && (
        <div className="shop-banner-image">
          <img
            src={shopData.banner}
            alt={`${shopData.name} banner`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="shop-banner-placeholder"><Store size="64" /></div>';
            }}
          />
        </div>
      )}
      {!shopData.banner && (
        <div className="shop-banner-image">
          <div className="shop-banner-placeholder">
            <Store size={64} />
          </div>
        </div>
      )}

      {/* Redesigned Shop Banner */}
      <div className="shop-banner">
        <div className="container">
          <div className="shop-header-content">
            {/* Shop Avatar */}
            <div className="shop-avatar-section">
              <div className="shop-avatar">
                <img
                  src={shopData.logo || 'https://images.unsplash.com/photo-1555507036-ab794f4eed25?w=150&h=150&fit=crop&crop=center'}
                  alt={shopData.name}
                />
              </div>
              {shopData.verified && (
                <div className="verified-badge" title="Verified Seller">
                  <CheckCircle size={16} />
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="shop-info-section">
              <div className="shop-title-section">
                <h1 className="shop-name">{shopData.name}</h1>
                {shopData.verified && (
                  <span className="verified-badge-text">
                    <CheckCircle size={14} />
                    Verified
                  </span>
                )}
              </div>

              <div className="shop-meta-section">
                <div className="meta-item">
                  <div className="stars">{renderStars(shopData.rating)}</div>
                  <span className="meta-text">
                    <strong>{shopData.rating}</strong> ({shopData.reviewCount} reviews)
                  </span>
                </div>

                {shopData.location && (
                  <div className="meta-item">
                    <MapPin size={14} />
                    <span className="meta-text">{shopData.location}</span>
                  </div>
                )}

                <div className="meta-item">
                  <Calendar size={14} />
                  <span className="meta-text">
                    Joined {new Date(shopData.joinDate).getFullYear()}
                  </span>
                </div>
              </div>

              <p className="shop-description">{shopData.description}</p>
            </div>

            {/* Shop Actions */}
            <div className="shop-actions-section">
              <button
                className={`action-button ${isFollowing ? 'following' : 'follow'}`}
                onClick={handleFollow}
              >
                <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <a
                href={`mailto:${shopData.ownerEmail || ''}`}
                className="action-button secondary"
                onClick={(e) => {
                  if (!shopData.ownerEmail) {
                    e.preventDefault();
                    alert('Contact email not available for this shop.');
                  }
                }}
              >
                <Mail size={16} />
                Contact
              </a>
              <button className="action-button secondary" onClick={handleShare}>
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Enhanced Shop Stats */}
        <div className="shop-stats-section">
          <div className="stat-card">
            <div className="stat-icon products">
              <Package size={24} />
            </div>
            <div className="stat-details">
              <div className="stat-value">{shopData.productCount}</div>
              <div className="stat-label">Products</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon followers">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <div className="stat-value">{shopData.followerCount.toLocaleString()}</div>
              <div className="stat-label">Followers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon sales">
              <TrendingUp size={24} />
            </div>
            <div className="stat-details">
              <div className="stat-value">{shopData.salesCount}</div>
              <div className="stat-label">Total Sales</div>
            </div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-icon rating">
              <Award size={24} />
            </div>
            <div className="stat-details">
              <div className="stat-value">{shopData.rating}</div>
              <div className="stat-label">Rating Score</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="shop-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={18} />
            Products ({filteredProducts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Store size={18} />
            About
          </button>
          <button
            className={`tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            <Award size={18} />
            Policies
          </button>
        </div>

        <div className="shop-content-wrapper">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="products-section fade-in">
              <div className="products-header">
                <div className="products-controls">
                  <div className="search-bar">
                    <Search className="search-icon" size={18} />
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
                    className="filter-select"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <Package size={64} />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="about-section fade-in">
              <div className="about-card">
                <h2>About {shopData.name}</h2>
                <p className="about-description">{shopData.description}</p>

                <div className="about-details">
                  <div className="detail-item">
                    <div className="detail-icon">
                      <Users size={20} />
                    </div>
                    <div className="detail-content">
                      <label>Shop Owner</label>
                      <span>{shopData.owner}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <MapPin size={20} />
                    </div>
                    <div className="detail-content">
                      <label>Location</label>
                      <span>{shopData.location || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <Clock size={20} />
                    </div>
                    <div className="detail-content">
                      <label>Member Since</label>
                      <span>{new Date(shopData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {(shopData.social.website || shopData.social.facebook || shopData.social.twitter || shopData.social.instagram) && (
                  <div className="social-section">
                    <h3>Connect With Us</h3>
                    <div className="social-links-grid">
                      {shopData.social.website && (
                        <a href={shopData.social.website} target="_blank" rel="noopener noreferrer" className="social-link-btn">
                          <Globe size={20} />
                          <span>Visit Website</span>
                        </a>
                      )}
                      {shopData.social.facebook && (
                        <a href={`https://facebook.com/${shopData.social.facebook}`} target="_blank" rel="noopener noreferrer" className="social-link-btn">
                          <Facebook size={20} />
                          <span>Facebook</span>
                        </a>
                      )}
                      {shopData.social.twitter && (
                        <a href={`https://twitter.com/${shopData.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link-btn">
                          <Twitter size={20} />
                          <span>Twitter</span>
                        </a>
                      )}
                      {shopData.social.instagram && (
                        <a href={`https://instagram.com/${shopData.social.instagram}`} target="_blank" rel="noopener noreferrer" className="social-link-btn">
                          <Instagram size={20} />
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="policies-section fade-in">
              <div className="policy-card">
                <div className="policy-header">
                  <Package size={24} />
                  <h3>Shipping Policy</h3>
                </div>
                <p>{shopData.policies.shipping || 'No shipping policy provided yet.'}</p>
              </div>

              <div className="policy-card">
                <div className="policy-header">
                  <Award size={24} />
                  <h3>Return Policy</h3>
                </div>
                <p>{shopData.policies.returns || 'No return policy provided yet.'}</p>
              </div>

              <div className="policy-card">
                <div className="policy-header">
                  <TrendingUp size={24} />
                  <h3>Exchange Policy</h3>
                </div>
                <p>{shopData.policies.exchange || 'No exchange policy provided yet.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
