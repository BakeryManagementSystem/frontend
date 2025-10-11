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
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isFollowing, setIsFollowing] = useState(false);

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
        logo: shop.logo_path || null,
        banner: shop.banner_path || null,
        owner: owner.name,
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
          primaryColor: '#2563eb',
          secondaryColor: '#64748b',
          accentColor: '#f59e0b'
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
