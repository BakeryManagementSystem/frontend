import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Package, Wheat, Croissant, Cake, Cookie, Cherry, Donut, Circle, Sparkles } from 'lucide-react';
import ApiService from '../../services/api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real categories from API
      const response = await ApiService.getCategories();

      if (response && Array.isArray(response)) {
        // Map API response to the format expected by the UI
        const mappedCategories = response.map(category => ({
          id: category.id,
          name: category.name,
          slug: category.slug || category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
          description: category.description || `Quality ${category.name.toLowerCase()} made fresh daily`,
          productCount: category.products_count || 0,
          image: getDefaultImage(category.name),
          icon: getCategoryIcon(category.name),
          color: getCategoryColor(category.name),
          trending: false, // Will be determined below
          subcategories: getDefaultSubcategories(category.name)
        }));

        // Determine trending categories with improved logic
        const sortedByCount = [...mappedCategories].sort((a, b) => b.productCount - a.productCount);

        // Mark categories as trending based on multiple criteria:
        // 1. Categories with more than 5 products
        // 2. Or the top 3 categories with the most products (even if they have few products)
        // 3. Ensure at least one category is marked as trending if any exist
        const trendingCategories = sortedByCount.filter(cat => cat.productCount > 5);

        if (trendingCategories.length === 0 && sortedByCount.length > 0) {
          // If no categories have more than 5 products, mark the top 3 as trending
          for (let i = 0; i < Math.min(3, sortedByCount.length); i++) {
            sortedByCount[i].trending = true;
          }
        } else if (trendingCategories.length > 0) {
          // Mark categories with more than 5 products as trending, max 4 categories
          for (let i = 0; i < Math.min(4, trendingCategories.length); i++) {
            const categoryIndex = mappedCategories.findIndex(cat => cat.id === trendingCategories[i].id);
            if (categoryIndex !== -1) {
              mappedCategories[categoryIndex].trending = true;
            }
          }
        }

        console.log('Categories loaded:', mappedCategories.length);
        console.log('Trending categories:', mappedCategories.filter(cat => cat.trending).length);
        console.log('Category details:', mappedCategories.map(cat => ({ name: cat.name, count: cat.productCount, trending: cat.trending })));

        setCategories(mappedCategories);
      } else {
        console.warn('Invalid response format:', response);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');

      // Fallback to empty array instead of mock data
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category icon
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Bread & Rolls': <Wheat size={32} />,
      'Pastries': <Croissant size={32} />,
      'Cakes': <Cake size={32} />,
      'Cookies': <Cookie size={32} />,
      'Muffins & Cupcakes': <Cherry size={32} />,
      'Donuts': <Donut size={32} />,
      'Bagels': <Circle size={32} />,
      'Specialty & Dietary': <Sparkles size={32} />
    };

    return iconMap[categoryName] || <Package size={32} />;
  };

  // Helper function to get category color
  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'Bread & Rolls': '#D2691E',
      'Pastries': '#DEB887',
      'Cakes': '#FF69B4',
      'Cookies': '#CD853F',
      'Muffins & Cupcakes': '#FFB6C1',
      'Donuts': '#FF6347',
      'Bagels': '#DAA520',
      'Specialty & Dietary': '#9370DB'
    };

    return colorMap[categoryName] || '#6639a6';
  };

  // Helper function to get default image
  const getDefaultImage = (categoryName) => {
    const imageMap = {
      'Bread & Rolls': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop&crop=center',
      'Pastries': 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=400&h=300&fit=crop&crop=center',
      'Cakes': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center',
      'Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center',
      'Muffins & Cupcakes': 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop&crop=center',
      'Donuts': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&crop=center',
      'Bagels': 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=300&fit=crop&crop=center',
      'Specialty & Dietary': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center'
    };

    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center';
  };

  // Helper function to get default subcategories
  const getDefaultSubcategories = (categoryName) => {
    const subcategoryMap = {
      'Bread & Rolls': ['Sourdough', 'Whole Wheat', 'Baguettes', 'Dinner Rolls', 'Specialty Breads'],
      'Pastries': ['Croissants', 'Danishes', 'Puff Pastries', 'Eclairs', 'Breakfast Pastries'],
      'Cakes': ['Birthday Cakes', 'Wedding Cakes', 'Cheesecakes', 'Layer Cakes', 'Custom Designs'],
      'Cookies': ['Chocolate Chip', 'Sugar Cookies', 'Macarons', 'Biscotti', 'Seasonal Cookies'],
      'Muffins & Cupcakes': ['Blueberry Muffins', 'Chocolate Cupcakes', 'Seasonal Flavors', 'Mini Cupcakes', 'Specialty Muffins'],
      'Specialty & Dietary': ['Seasonal Items', 'Gluten-Free', 'Vegan Options', 'Custom Orders', 'Holiday Specials']
    };

    return subcategoryMap[categoryName] || ['Browse All', 'Popular Items', 'New Arrivals'];
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/categories/${categorySlug}`);
  };

  const handleSubcategoryClick = (categorySlug, subcategory) => {
    navigate(`/products?category=${categorySlug}&subcategory=${encodeURIComponent(subcategory)}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="categories-page">
        <div className="container">
          <div className="page-header">
            <h1>Browse Categories</h1>
            <p>Loading categories...</p>
          </div>
          <div className="categories-loading">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="categories-page">
        <div className="container">
          <div className="page-header">
            <h1>Browse Categories</h1>
            <p>Unable to load categories</p>
          </div>
          <div className="error-state">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchCategories} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="categories-page">
        <div className="container">
          <div className="page-header">
            <h1>Browse Categories</h1>
            <p>No categories available</p>
          </div>
          <div className="empty-state">
            <Package size={64} />
            <h3>No categories found</h3>
            <p>Categories will appear here once they are added to the system.</p>
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
