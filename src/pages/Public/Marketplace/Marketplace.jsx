import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  ChevronDown,
  X
} from 'lucide-react';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  // Mock data - replace with API call
  const mockProducts = [
    {
      id: 1,
      name: 'Artisan Sourdough Bread',
      price: 8.99,
      image: '/api/placeholder/300/300',
      category: 'bread',
      rating: 4.8,
      reviews: 124,
      description: 'Handcrafted sourdough bread with a perfect crust',
      baker: 'Golden Grain Bakery',
      inStock: true,
      discount: 10
    },
    {
      id: 2,
      name: 'Chocolate Croissant',
      price: 3.50,
      image: '/api/placeholder/300/300',
      category: 'pastries',
      rating: 4.9,
      reviews: 89,
      description: 'Buttery croissant filled with rich chocolate',
      baker: 'French Corner Bakery',
      inStock: true
    },
    {
      id: 3,
      name: 'Red Velvet Cake',
      price: 24.99,
      image: '/api/placeholder/300/300',
      category: 'cakes',
      rating: 4.7,
      reviews: 67,
      description: 'Classic red velvet cake with cream cheese frosting',
      baker: 'Sweet Dreams Bakery',
      inStock: true
    },
    {
      id: 4,
      name: 'Blueberry Muffins (6 pack)',
      price: 12.99,
      image: '/api/placeholder/300/300',
      category: 'muffins',
      rating: 4.6,
      reviews: 45,
      description: 'Fresh blueberry muffins made with organic ingredients',
      baker: 'Morning Glory Bakery',
      inStock: false
    },
    {
      id: 5,
      name: 'Glazed Donuts (dozen)',
      price: 15.99,
      image: '/api/placeholder/300/300',
      category: 'donuts',
      rating: 4.5,
      reviews: 156,
      description: 'Classic glazed donuts, perfect for any occasion',
      baker: 'Donut Delight',
      inStock: true,
      discount: 15
    },
    {
      id: 6,
      name: 'Apple Cinnamon Pie',
      price: 18.99,
      image: '/api/placeholder/300/300',
      category: 'pies',
      rating: 4.8,
      reviews: 92,
      description: 'Traditional apple pie with cinnamon and flaky crust',
      baker: 'Grandma\'s Kitchen',
      inStock: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'bread', label: 'Bread' },
    { value: 'cakes', label: 'Cakes' },
    { value: 'pastries', label: 'Pastries' },
    { value: 'muffins', label: 'Muffins' },
    { value: 'donuts', label: 'Donuts' },
    { value: 'pies', label: 'Pies' },
    { value: 'cookies', label: 'Cookies' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.baker.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const handleAddToCart = (product) => {
    addItem(product);
    // Show success message or toast
  };

  const ProductCard = ({ product }) => (
    <div className="card group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            -{product.discount}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-color transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">{product.baker}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-primary-color">
              ${product.price}
            </span>
          </div>

          {product.inStock && isAuthenticated && (
            <button
              onClick={() => handleAddToCart(product)}
              className="btn btn-sm btn-primary"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="spinner"></div>
          <span className="ml-3">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-600">Discover fresh bakery products from local artisans</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products, bakeries, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select w-auto"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select w-auto"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-color text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-color text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    In Stock
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Include Out of Stock
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Offers
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    On Sale
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Free Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No products found</p>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
