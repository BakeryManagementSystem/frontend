import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import {
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  X,
  ChevronDown
} from 'lucide-react';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
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
  }, [searchParams, category, sortBy, filters]);

  const fetchProducts = async () => {
    setLoading(true);
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
          rating: 4.8,
          reviewCount: 128,
          seller: "Heritage Bakery",
          discount: 18,
          inStock: true,
          freeShipping: true
        },
        {
          id: 2,
          name: "Chocolate Croissants (6-pack)",
          price: 12.99,
          image: "/placeholder-croissant.jpg",
          category: "Pastries",
          rating: 4.9,
          reviewCount: 89,
          seller: "French Corner Bakery",
          inStock: true,
          freeShipping: false
        },
        {
          id: 3,
          name: "Custom Birthday Cake (8-inch)",
          price: 45.99,
          originalPrice: 55.99,
          image: "/placeholder-cake.jpg",
          category: "Cakes",
          rating: 4.7,
          reviewCount: 203,
          seller: "Sweet Dreams Bakery",
          discount: 18,
          inStock: true,
          freeShipping: true
        },
        {
          id: 4,
          name: "Fresh Blueberry Muffins (12-pack)",
          price: 18.99,
          image: "/placeholder-muffins.jpg",
          category: "Muffins",
          rating: 4.6,
          reviewCount: 156,
          seller: "Morning Glory Bakery",
          inStock: false,
          freeShipping: true
        },
        {
          id: 5,
          name: "Cinnamon Sugar Donuts (6-pack)",
          price: 9.99,
          image: "/placeholder-donuts.jpg",
          category: "Donuts",
          rating: 4.5,
          reviewCount: 67,
          seller: "Golden Donut Shop",
          inStock: true,
          freeShipping: false
        },
        {
          id: 6,
          name: "Gluten-Free Brownies (9-pack)",
          price: 16.99,
          originalPrice: 19.99,
          image: "/placeholder-brownies.jpg",
          category: "Specialty",
          rating: 4.4,
          reviewCount: 142,
          seller: "Healthy Bites Bakery",
          discount: 15,
          inStock: true,
          freeShipping: true
        },
        {
          id: 7,
          name: "Classic Bagels Variety Pack (12-pack)",
          price: 14.99,
          image: "/placeholder-bagels.jpg",
          category: "Bagels",
          rating: 4.6,
          reviewCount: 98,
          seller: "Brooklyn Bagel Co",
          inStock: true,
          freeShipping: false
        },
        {
          id: 8,
          name: "Wedding Cupcakes (24-pack)",
          price: 59.99,
          originalPrice: 69.99,
          image: "/placeholder-wedding-cupcakes.jpg",
          category: "Specialty",
          rating: 4.8,
          reviewCount: 76,
          seller: "Elegant Events Bakery",
          discount: 14,
          inStock: true,
          freeShipping: true
        },
        {
          id: 9,
          name: "Seasonal Fruit Tarts (4-pack)",
          price: 22.99,
          image: "/placeholder-tarts.jpg",
          category: "Pastries",
          rating: 4.7,
          reviewCount: 134,
          seller: "Garden Fresh Bakery",
          inStock: true,
          freeShipping: true
        },
        {
          id: 10,
          name: "Artisan Pizza Dough (2-pack)",
          price: 6.99,
          image: "/placeholder-dough.jpg",
          category: "Specialty",
          rating: 4.3,
          reviewCount: 89,
          seller: "Italian Kitchen Bakery",
          inStock: true,
          freeShipping: false
        }
      ];

      // Apply filters
      let filteredProducts = mockProducts;

      if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filters.category) {
        filteredProducts = filteredProducts.filter(product =>
          product.category.toLowerCase() === filters.category.toLowerCase()
        );
      }

      if (filters.rating > 0) {
        filteredProducts = filteredProducts.filter(product =>
          product.rating >= filters.rating
        );
      }

      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
      }

      if (filters.freeShipping) {
        filteredProducts = filteredProducts.filter(product => product.freeShipping);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // In real app, would sort by date
          break;
        default:
          // Featured - no sorting
          break;
      }

      setProducts(filteredProducts);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: category || '',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      freeShipping: false
    });
  };

  const categories = [
    'Breads',
    'Pastries',
    'Cakes',
    'Muffins',
    'Donuts',
    'Bagels',
    'Cookies',
    'Specialty'
  ];

  const getPageTitle = () => {
    if (category) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'All Products';
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="products-header">
          <div className="products-title">
            <h1>{getPageTitle()}</h1>
            <p>{products.length} products found</p>
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
