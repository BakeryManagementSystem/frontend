import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import apiService from '../../services/api';
import {
  Search,
  TrendingUp,
  ShoppingBag,
  Users,
  Star,
  ArrowRight,
  ChefHat,
  Shield,
  Truck,
  Cake,
  Cookie,
  Croissant,
  Wheat,
  Cherry,
  PieChart
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured products (latest products with limit)
        const featuredResponse = await apiService.getProducts({
          per_page: 4,
          page: 1
        });

        // Fetch trending products (you might want to add a specific endpoint for trending)
        const trendingResponse = await apiService.getProducts({
          per_page: 2,
          page: 1
        });

        // Fetch categories with better error handling
        const categoriesResponse = await apiService.getCategories();

        setFeaturedProducts(featuredResponse.data || []);
        setTrendingProducts(trendingResponse.data || []);

        // Handle different response formats for categories
        if (categoriesResponse) {
          let categoriesData = [];
          if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
            categoriesData = categoriesResponse.data;
          } else if (Array.isArray(categoriesResponse)) {
            categoriesData = categoriesResponse;
          }

          if (categoriesData.length > 0) {
            setCategories(categoriesData);
          } else {
            console.warn('No categories found, using fallback');
            // Set fallback categories if backend has no data
            setCategories([
              { id: 1, name: 'Artisan Breads', products_count: 3 },
              { id: 2, name: 'Cakes & Celebration', products_count: 4 },
              { id: 3, name: 'Pastries & Croissants', products_count: 3 },
              { id: 4, name: 'Cookies & Biscuits', products_count: 3 },
              { id: 5, name: 'Custom Orders', products_count: 3 },
              { id: 6, name: 'Bakery Bundles', products_count: 4 }
            ]);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);

        // Check if it's a network error (offline mode)
        if (err.message.includes('Unable to connect') ||
            err.message.includes('fetch') ||
            err.name === 'TypeError') {

          // In offline mode, still show fallback data but don't set as error
          setFeaturedProducts([
            { id: 1, name: "Fresh Croissant", price: "3.50", image: "/images/croissant.jpg", category: "Pastries" },
            { id: 2, name: "Chocolate Cake", price: "25.99", image: "/images/chocolate-cake.jpg", category: "Cakes" },
            { id: 3, name: "Sourdough Bread", price: "4.75", image: "/images/sourdough.jpg", category: "Breads" },
            { id: 4, name: "Blueberry Muffin", price: "2.25", image: "/images/blueberry-muffin.jpg", category: "Pastries" }
          ]);

          setTrendingProducts([
            { id: 1, name: "Fresh Croissant", price: "3.50", image: "/images/croissant.jpg", category: "Pastries" },
            { id: 2, name: "Chocolate Cake", price: "25.99", image: "/images/chocolate-cake.jpg", category: "Cakes" }
          ]);
        } else {
          // Other errors - show error message
          setError('Failed to load data. Please try again later.');
        }

        // Set fallback categories
        setCategories([
          { id: 1, name: 'Bread', products_count: 15 },
          { id: 2, name: 'Pastries', products_count: 12 },
          { id: 3, name: 'Cakes', products_count: 8 },
          { id: 4, name: 'Cookies', products_count: 20 },
          { id: 5, name: 'Cupcakes', products_count: 10 },
          { id: 6, name: 'Specialty', products_count: 5 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map category names to icons and colors
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'bread': { icon: <Wheat size={24} />, color: "#D2691E" },
      'breads': { icon: <Wheat size={24} />, color: "#D2691E" },
      'pastry': { icon: <Croissant size={24} />, color: "#DEB887" },
      'pastries': { icon: <Croissant size={24} />, color: "#DEB887" },
      'cake': { icon: <Cake size={24} />, color: "#FF69B4" },
      'cakes': { icon: <Cake size={24} />, color: "#FF69B4" },
      'cookie': { icon: <Cookie size={24} />, color: "#CD853F" },
      'cookies': { icon: <Cookie size={24} />, color: "#CD853F" },
      'cupcake': { icon: <Cherry size={24} />, color: "#FFB6C1" },
      'cupcakes': { icon: <Cherry size={24} />, color: "#FFB6C1" },
      'specialty': { icon: <PieChart size={24} />, color: "#9370DB" },
      'default': { icon: <PieChart size={24} />, color: "#9370DB" }
    };

    const key = categoryName?.toLowerCase() || 'default';
    return iconMap[key] || iconMap['default'];
  };

  const stats = [
    { icon: <Users size={32} />, value: "10K+", label: "Happy Customers" },
    { icon: <ShoppingBag size={32} />, value: "500+", label: "Bakery Items" },
    { icon: <Star size={32} />, value: "4.9", label: "Average Rating" },
    { icon: <TrendingUp size={32} />, value: "99%", label: "Fresh Guarantee" }
  ];

  if (error) {
    return (
      <div className="home">
        <div className="container">
          <div className="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Fresh Baked Goods from
                <span className="hero-highlight"> Local Bakers</span>
              </h1>
              <p className="hero-description">
                Discover artisan breads, pastries, cakes and more from your favorite local bakeries.
                Order fresh, quality baked goods made with love and delivered to your door.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-lg">
                  <Search size={20} />
                  Browse Bakery Items
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Join as Baker
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-elements">
                <div className="floating-item item-1">
                  <Cake size={40} />
                </div>
                <div className="floating-item item-2">
                  <Cookie size={35} />
                </div>
                <div className="floating-item item-3">
                  <Croissant size={30} />
                </div>
                <div className="floating-item item-4">
                  <Wheat size={38} />
                </div>
                <div className="floating-item item-5">
                  <Cherry size={25} />
                </div>
                <div className="floating-item item-6">
                  <PieChart size={32} />
                </div>
              </div>
              <div className="hero-gradient-bg">
                <div className="gradient-circle circle-1"></div>
                <div className="gradient-circle circle-2"></div>
                <div className="gradient-circle circle-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ChefHat />
              </div>
              <h3>Fresh Daily</h3>
              <p>All items baked fresh daily by local artisan bakers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Quality Guaranteed</h3>
              <p>100% satisfaction guarantee with premium ingredients</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Truck />
              </div>
              <h3>Fast Delivery</h3>
              <p>Same-day delivery available for fresh bakery items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our delicious range of baked goods</p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => {
              const { icon, color } = getCategoryIcon(category.name);
              return (
                <Link
                  key={category.id}
                  to={`/categories/${category.name.toLowerCase()}`}
                  className="category-card"
                >
                  <div className="category-icon" style={{ color }}>
                    {icon}
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">{category.products_count || 0} items</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Bakery Items</h2>
            <p>Hand-picked favorites from our best bakers</p>
            <Link to="/products" className="section-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-products">
                  <p>No featured products available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-products">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <p>Popular items our customers love</p>
          </div>
          {loading ? (
            <div className="products-grid limited">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid limited">
              {trendingProducts.length > 0 ? (
                trendingProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-products">
                  <p>No trending products available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Baking?</h2>
            <p>Join our community of local bakers and reach more customers with your delicious creations</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Become a Baker Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
