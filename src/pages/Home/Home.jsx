import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard/ProductCard';
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
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedProducts([
        {
          id: 1,
          name: "Artisan Chocolate Croissants",
          price: 4.99,
          originalPrice: 6.99,
          image: "/placeholder-product.jpg",
          category: "Pastries",
          rating: 4.8,
          reviewCount: 128,
          seller: "Main Bakery",
          discount: 29
        },
        {
          id: 2,
          name: "Fresh Sourdough Bread",
          price: 5.99,
          image: "/placeholder-product.jpg",
          category: "Breads",
          rating: 4.9,
          reviewCount: 89,
          seller: "Main Bakery"
        },
        {
          id: 3,
          name: "Classic Vanilla Cupcakes (6-pack)",
          price: 12.99,
          originalPrice: 15.99,
          image: "/placeholder-product.jpg",
          category: "Cupcakes",
          rating: 4.7,
          reviewCount: 203,
          seller: "Sweet Delights",
          discount: 19
        },
        {
          id: 4,
          name: "Seasonal Fruit Tart",
          price: 18.99,
          image: "/placeholder-product.jpg",
          category: "Cakes",
          rating: 4.6,
          reviewCount: 156,
          seller: "Artisan Cakes"
        }
      ]);

      setTrendingProducts([
        {
          id: 5,
          name: "Cinnamon Rolls (4-pack)",
          price: 8.99,
          image: "/placeholder-product.jpg",
          category: "Pastries",
          rating: 4.8,
          reviewCount: 67,
          seller: "Morning Delights"
        },
        {
          id: 6,
          name: "Gluten-Free Brownies",
          price: 9.99,
          image: "/placeholder-product.jpg",
          category: "Specialty",
          rating: 4.5,
          reviewCount: 142,
          seller: "Healthy Treats"
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { name: "Breads", icon: <Wheat size={24} />, count: "150+", color: "#D2691E" },
    { name: "Pastries", icon: <Croissant size={24} />, count: "200+", color: "#DEB887" },
    { name: "Cakes", icon: <Cake size={24} />, count: "80+", color: "#FF69B4" },
    { name: "Cookies", icon: <Cookie size={24} />, count: "120+", color: "#CD853F" },
    { name: "Cupcakes", icon: <Cherry size={24} />, count: "90+", color: "#FFB6C1" },
    { name: "Specialty", icon: <PieChart size={24} />, count: "60+", color: "#9370DB" }
  ];

  const stats = [
    { icon: <Users size={32} />, value: "10K+", label: "Happy Customers" },
    { icon: <ShoppingBag size={32} />, value: "500+", label: "Bakery Items" },
    { icon: <Star size={32} />, value: "4.9", label: "Average Rating" },
    { icon: <TrendingUp size={32} />, value: "99%", label: "Fresh Guarantee" }
  ];

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
            <div className="hero-image">
              <img src="/placeholder-hero.jpg" alt="Fresh Bakery Items" />
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
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/categories/${category.name.toLowerCase()}`}
                className="category-card"
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} items</p>
              </Link>
            ))}
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
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
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
              {trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
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
