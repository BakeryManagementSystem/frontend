import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  MoreVertical,
  Copy,
  Star
} from 'lucide-react';
import './SellerProducts.css';

const SellerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filter, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: "Artisan Sourdough Bread",
          sku: "BRD-001",
          price: 8.99,
          stock: 6,
          status: 'active',
          category: "Breads",
          image: "/placeholder-sourdough.jpg",
          rating: 4.8,
          reviewCount: 128,
          sales: 89,
          createdAt: "2024-01-15",
          lastUpdated: "2024-01-20"
        },
        {
          id: 2,
          name: "Chocolate Croissants (6-pack)",
          sku: "PST-002",
          price: 12.99,
          stock: 12,
          status: 'active',
          category: "Pastries",
          image: "/placeholder-croissants.jpg",
          rating: 4.9,
          reviewCount: 203,
          sales: 67,
          createdAt: "2024-01-12",
          lastUpdated: "2024-01-18"
        },
        {
          id: 3,
          name: "Custom Birthday Cake (8-inch)",
          sku: "CKE-003",
          price: 45.99,
          stock: 2,
          status: 'low_stock',
          category: "Cakes",
          image: "/placeholder-birthday-cake.jpg",
          rating: 4.7,
          reviewCount: 156,
          sales: 23,
          createdAt: "2024-01-10",
          lastUpdated: "2024-01-19"
        },
        {
          id: 4,
          name: "Fresh Blueberry Muffins (12-pack)",
          sku: "MUF-004",
          price: 18.99,
          stock: 0,
          status: 'out_of_stock',
          category: "Muffins",
          image: "/placeholder-muffins.jpg",
          rating: 4.6,
          reviewCount: 67,
          sales: 45,
          createdAt: "2024-01-08",
          lastUpdated: "2024-01-16"
        },
        {
          id: 5,
          name: "Cinnamon Sugar Donuts (6-pack)",
          sku: "DNT-005",
          price: 9.99,
          stock: 8,
          status: 'active',
          category: "Donuts",
          image: "/placeholder-donuts.jpg",
          rating: 4.5,
          reviewCount: 89,
          sales: 56,
          createdAt: "2024-01-06",
          lastUpdated: "2024-01-17"
        },
        {
          id: 6,
          name: "Gluten-Free Brownies (9-pack)",
          sku: "SPE-006",
          price: 16.99,
          stock: 4,
          status: 'low_stock',
          category: "Specialty",
          image: "/placeholder-brownies.jpg",
          rating: 4.4,
          reviewCount: 142,
          sales: 34,
          createdAt: "2024-01-05",
          lastUpdated: "2024-01-15"
        },
        {
          id: 7,
          name: "Everything Bagels (12-pack)",
          sku: "BGL-007",
          price: 14.99,
          stock: 15,
          status: 'active',
          category: "Bagels",
          image: "/placeholder-bagels.jpg",
          rating: 4.6,
          reviewCount: 98,
          sales: 78,
          createdAt: "2024-01-04",
          lastUpdated: "2024-01-14"
        },
        {
          id: 8,
          name: "Wedding Cupcakes (24-pack)",
          sku: "CPC-008",
          price: 59.99,
          stock: 3,
          status: 'low_stock',
          category: "Specialty",
          image: "/placeholder-wedding-cupcakes.jpg",
          rating: 4.8,
          reviewCount: 76,
          sales: 12,
          createdAt: "2024-01-03",
          lastUpdated: "2024-01-13"
        }
      ];

      // Apply filters
      let filteredProducts = mockProducts;
      if (filter !== 'all') {
        filteredProducts = mockProducts.filter(product => product.status === filter);
      }

      // Apply sorting
      switch (sortBy) {
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'stock':
          filteredProducts.sort((a, b) => a.stock - b.stock);
          break;
        case 'sales':
          filteredProducts.sort((a, b) => b.sales - a.sales);
          break;
        default: // newest
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      setProducts(filteredProducts);
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status, stock) => {
    if (status === 'draft') return { text: 'Draft', class: 'draft' };
    if (status === 'out_of_stock' || stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
    if (status === 'low_stock' || stock < 5) return { text: 'Low Stock', class: 'low-stock' };
    if (status === 'active') return { text: 'Active', class: 'active' };
    return { text: status, class: 'default' };
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          fill={i < rating ? "currentColor" : "none"}
          className={i < rating ? "filled" : ""}
        />
      );
    }
    return stars;
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSelected = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
      setShowBulkActions(false);
    } else {
      const allIds = filteredProducts.map(p => p.id);
      setSelectedProducts(allIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      setShowBulkActions(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="seller-products loading">
        <div className="container">
          <div className="loading-text">Loading your products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-products">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>My Products</h1>
            <p>Manage your product catalog and inventory</p>
          </div>
          <Link to="/seller/products/new" className="btn btn-primary">
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Controls */}
        <div className="products-controls">
          <div className="search-filter-group">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Stock Level</option>
                <option value="sales">Best Selling</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="bulk-actions">
              <span>{selectedProducts.length} products selected</span>
              <button className="btn btn-outline btn-sm">
                <Edit size={16} />
                Bulk Edit
              </button>
              <button
                className="btn btn-outline btn-sm text-error"
                onClick={handleBulkDelete}
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="products-table-container">
          {filteredProducts.length > 0 ? (
            <div className="products-table">
              <div className="table-header">
                <div className="table-cell checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="table-cell">Product</div>
                <div className="table-cell">SKU</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Stock</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Performance</div>
                <div className="table-cell">Actions</div>
              </div>

              {filteredProducts.map(product => {
                const statusBadge = getStatusBadge(product.status, product.stock);
                return (
                  <div key={product.id} className="table-row">
                    <div className="table-cell checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </div>

                    <div className="table-cell product-cell">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-category">{product.category}</div>
                      </div>
                    </div>

                    <div className="table-cell sku-cell">
                      <span className="sku">{product.sku}</span>
                      <button className="copy-btn" title="Copy SKU">
                        <Copy size={12} />
                      </button>
                    </div>

                    <div className="table-cell price-cell">
                      ${product.price}
                    </div>

                    <div className="table-cell stock-cell">
                      <span className={`stock-value ${product.stock < 5 ? 'low' : ''}`}>
                        {product.stock}
                      </span>
                    </div>

                    <div className="table-cell status-cell">
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </div>

                    <div className="table-cell performance-cell">
                      <div className="performance-stats">
                        <div className="rating">
                          <div className="stars">
                            {renderStars(product.rating)}
                          </div>
                          <span>({product.reviewCount})</span>
                        </div>
                        <div className="sales">{product.sales} sold</div>
                      </div>
                    </div>

                    <div className="table-cell actions-cell">
                      <div className="action-buttons">
                        <Link to={`/products/${product.id}`} className="action-btn" title="View">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/seller/products/edit/${product.id}`} className="action-btn" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="action-btn" title="More">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-products">
              <Package size={64} />
              <h3>No products found</h3>
              <p>
                {searchQuery || filter !== 'all'
                  ? 'No products match your current search or filter criteria.'
                  : 'You haven\'t added any products yet. Start building your catalog!'
                }
              </p>
              <Link to="/seller/products/new" className="btn btn-primary">
                <Plus size={18} />
                Add Your First Product
              </Link>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => p.status === 'active').length}</div>
            <div className="stat-label">Active Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => p.stock < 5).length}</div>
            <div className="stat-label">Low Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => p.stock === 0).length}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.reduce((sum, p) => sum + p.sales, 0)}</div>
            <div className="stat-label">Total Sales</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
