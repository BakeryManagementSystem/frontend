import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Package, Wheat, Croissant, Cake, Cookie, Cherry, Donut, Circle, Sparkles } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      setCategories([
        {
          id: 1,
          name: 'Bread & Rolls',
          slug: 'bread-rolls',
          description: 'Fresh artisan breads, dinner rolls, baguettes, and specialty loaves',
          productCount: 150,
          image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop&crop=center',
          icon: <Wheat size={32} />,
          color: '#D2691E',
          trending: true,
          subcategories: ['Sourdough', 'Whole Wheat', 'Baguettes', 'Dinner Rolls', 'Specialty Breads']
        },
        {
          id: 2,
          name: 'Pastries',
          slug: 'pastries',
          description: 'Delicate pastries, croissants, danishes, and sweet breakfast treats',
          productCount: 200,
          image: 'https://images.unsplash.com/photo-1555507036-ab794f4eed25?w=400&h=300&fit=crop&crop=center',
          icon: <Croissant size={32} />,
          color: '#DEB887',
          trending: true,
          subcategories: ['Croissants', 'Danishes', 'Puff Pastries', 'Eclairs', 'Breakfast Pastries']
        },
        {
          id: 3,
          name: 'Cakes',
          slug: 'cakes',
          description: 'Custom cakes, layer cakes, cheesecakes, and celebration desserts',
          productCount: 80,
          image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center',
          icon: <Cake size={32} />,
          color: '#FF69B4',
          trending: false,
          subcategories: ['Birthday Cakes', 'Wedding Cakes', 'Cheesecakes', 'Layer Cakes', 'Custom Designs']
        },
        {
          id: 4,
          name: 'Cookies',
          slug: 'cookies',
          description: 'Freshly baked cookies, biscotti, macarons, and sweet treats',
          productCount: 120,
          image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center',
          icon: <Cookie size={32} />,
          color: '#CD853F',
          trending: false,
          subcategories: ['Chocolate Chip', 'Sugar Cookies', 'Macarons', 'Biscotti', 'Seasonal Cookies']
        },
        {
          id: 5,
          name: 'Muffins & Cupcakes',
          slug: 'muffins-cupcakes',
          description: 'Delicious muffins, cupcakes, and individual sweet treats',
          productCount: 90,
          image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop&crop=center',
          icon: <Cherry size={32} />,
          color: '#FFB6C1',
          trending: false,
          subcategories: ['Blueberry Muffins', 'Chocolate Cupcakes', 'Seasonal Flavors', 'Mini Cupcakes', 'Specialty Muffins']
        },
        {
          id: 6,
          name: 'Donuts',
          slug: 'donuts',
          description: 'Fresh donuts, glazed, filled, and specialty varieties',
          productCount: 60,
          image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&crop=center',
          icon: <Donut size={32} />,
          color: '#FF6347',
          trending: true,
          subcategories: ['Glazed Donuts', 'Filled Donuts', 'Cake Donuts', 'Old-Fashioned', 'Specialty Donuts']
        },
        {
          id: 7,
          name: 'Bagels',
          slug: 'bagels',
          description: 'Traditional and specialty bagels, fresh baked daily',
          productCount: 45,
          image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=300&fit=crop&crop=center',
          icon: <Circle size={32} />,
          color: '#DAA520',
          trending: false,
          subcategories: ['Plain Bagels', 'Everything Bagels', 'Sesame Bagels', 'Specialty Flavors', 'Mini Bagels']
        },
        {
          id: 8,
          name: 'Specialty & Dietary',
          slug: 'specialty',
          description: 'Gluten-free, vegan, keto-friendly, and dietary-specific baked goods',
          productCount: 70,
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&crop=center',
          icon: <Sparkles size={32} />,
          color: '#9370DB',
          trending: true,
          subcategories: ['Gluten-Free', 'Vegan Options', 'Keto-Friendly', 'Sugar-Free', 'Organic']
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/categories/${categorySlug}`);
  };

  const handleSubcategoryClick = (categorySlug, subcategory) => {
    navigate(`/products?category=${categorySlug}&subcategory=${encodeURIComponent(subcategory)}`);
  };

  if (loading) {
    return (
      <div className="categories-page loading">
        <div className="container">
          <div className="loading-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="category-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Browse Categories</h1>
          <p>Discover products across all categories</p>

          <div className="category-search">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                className="category-search-input"
              />
            </div>
          </div>
        </div>

        {/* Trending Categories */}
        <section className="trending-section">
          <div className="section-header">
            <h2>
              <TrendingUp size={24} />
              Trending Categories
            </h2>
          </div>

          <div className="trending-categories">
            {categories.filter(cat => cat.trending).map(category => (
              <div key={category.id} className="trending-category">
                <div
                  className="trending-category-content"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <div className="category-icon-large" style={{ color: category.color }}>{category.icon}</div>
                  <h3>{category.name}</h3>
                  <p>{category.productCount.toLocaleString()} products</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section className="all-categories-section">
          <div className="section-header">
            <h2>
              <Package size={24} />
              All Categories
            </h2>
          </div>

          <div className="categories-grid">
            {categories.map(category => (
              <div key={category.id} className="category-card">
                <div className="category-image-container">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-overlay">
                    <button
                      className="view-category-btn"
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      View Products
                    </button>
                  </div>
                  {category.trending && (
                    <div className="trending-badge">
                      <TrendingUp size={14} />
                      Trending
                    </div>
                  )}
                </div>

                <div className="category-info">
                  <div className="category-header">
                    <div className="category-icon" style={{ color: category.color }}>{category.icon}</div>
                    <h3 className="category-name">{category.name}</h3>
                  </div>

                  <p className="category-description">{category.description}</p>

                  <div className="category-stats">
                    <span className="product-count">
                      {category.productCount.toLocaleString()} products
                    </span>
                  </div>

                  <div className="subcategories">
                    <h4>Popular in {category.name}:</h4>
                    <div className="subcategory-list">
                      {category.subcategories.slice(0, 4).map((subcategory, index) => (
                        <button
                          key={index}
                          className="subcategory-tag"
                          onClick={() => handleSubcategoryClick(category.slug, subcategory)}
                        >
                          {subcategory}
                        </button>
                      ))}
                      {category.subcategories.length > 4 && (
                        <button
                          className="subcategory-tag more"
                          onClick={() => handleCategoryClick(category.slug)}
                        >
                          +{category.subcategories.length - 4} more
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="categories-cta">
          <div className="cta-content">
            <h2>Can't find what you're looking for?</h2>
            <p>Browse all products or use our advanced search to find exactly what you need</p>
            <div className="cta-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Browse All Products
              </Link>
              <Link to="/products?advanced=true" className="btn btn-outline btn-lg">
                Advanced Search
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
