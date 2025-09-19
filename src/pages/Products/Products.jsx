import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import ApiService from '../../services/api';
import {
  Filter,
  Grid,
  List,
  Star
} from 'lucide-react';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: category || '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    freeShipping: false
  });

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams, category, sortBy, filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      if (response && response.data) {
        setCategories(response.data.map(cat => cat.name || cat.category));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories
      setCategories([
        'Breads',
        'Pastries',
        'Cakes',
        'Muffins',
        'Donuts',
        'Bagels',
        'Cookies',
        'Specialty'
      ]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build API parameters
      const apiParams = {
        per_page: 12,
        page: currentPage
      };

      // Add search query
      if (searchQuery) {
        apiParams.q = searchQuery;
      }

      // Add category filter
      if (filters.category) {
        apiParams.category = filters.category;
      }

      // Fetch from API
      const response = await ApiService.getProducts(apiParams);

      if (response && response.data) {
        let fetchedProducts = response.data.map(product => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          originalPrice: product.discount_price ? parseFloat(product.price) : null,
          discountPrice: product.discount_price ? parseFloat(product.discount_price) : null,
          image: product.image_url || product.image_path || '/placeholder-product.jpg',
          category: product.category || 'General',
          rating: calculateAverageRating(product.reviews || []),
          reviewCount: (product.reviews || []).length,
          seller: product.owner?.shop_name || product.owner?.name || 'Unknown Seller',
          discount: product.discount_price ?
            Math.round(((parseFloat(product.price) - parseFloat(product.discount_price)) / parseFloat(product.price)) * 100) : 0,
          inStock: product.stock_quantity > 0,
          freeShipping: product.price >= 25, // Free shipping for orders over $25
          description: product.description,
          sku: product.sku,
          weight: product.weight,
          dimensions: product.dimensions,
          ingredients: product.ingredients || [],
          allergens: product.allergens || [],
          isFeatured: product.is_featured || false,
          status: product.status
        }));

        // Apply client-side filters (since backend doesn't support all filters yet)
        fetchedProducts = applyClientSideFilters(fetchedProducts);

        // Apply sorting
        fetchedProducts = applySorting(fetchedProducts);

        setProducts(fetchedProducts);
        setTotalProducts(response.meta?.total || fetchedProducts.length);
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 4.5; // Default rating
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  const applyClientSideFilters = (products) => {
    let filtered = [...products];

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.discountPrice || product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Free shipping filter
    if (filters.freeShipping) {
      filtered = filtered.filter(product => product.freeShipping);
    }

    return filtered;
  };

  const applySorting = (products) => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price-high':
        return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id); // Assuming higher ID means newer
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          // Featured products first, then by rating
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      category: category || '',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      freeShipping: false
    });
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    if (category) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'All Products';
  };

  // Show error state
  if (error) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <div className="products-title">
            <h1>{getPageTitle()}</h1>
            <p>{totalProducts} products found</p>
          </div>

          <div className="products-controls">
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>

            <div className="sort-control">
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

            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        <div className="products-content">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                {categories.map(cat => (
                  <label key={cat} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Rating</h4>
              <div className="filter-options">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="filter-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                    />
                    <span className="rating-filter">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                      & up
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Availability</h4>
              <label className="filter-option checkbox">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                />
                <span>In Stock</span>
              </label>
              <label className="filter-option checkbox">
                <input
                  type="checkbox"
                  checked={filters.freeShipping}
                  onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                />
                <span>Free Shipping</span>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {loading ? (
              <div className={`products-grid ${viewMode}`}>
                {[...Array(6)].map((_, index) => (
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
            ) : products.length > 0 ? (
              <div className={`products-grid ${viewMode}`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Filter Overlay for Mobile */}
        {showFilters && (
          <div className="filter-overlay" onClick={() => setShowFilters(false)}>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
