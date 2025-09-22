import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
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
  const [error, setError] = useState('');
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
    setError('');
    try {
      const params = {
        filter,
        sort: sortBy,
        search: searchQuery
      };

      const response = await ApiService.getSellerProducts(params);
      setProducts(response.data || response.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => p.status === 'active').length}</div>
            <div className="stat-label">Active Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => (p.stock || 0) < 5).length}</div>
            <div className="stat-label">Low Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.filter(p => (p.stock || 0) === 0).length}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.reduce((sum, p) => sum + (p.sales || 0), 0)}</div>
            <div className="stat-label">Total Sales</div>
          </div>
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
                      ${product.price || 0}
                    </div>

                    <div className="table-cell stock-cell">
                      <span className={`stock-value ${(product.stock || 0) < 5 ? 'low' : ''}`}>
                        {product.stock || 0}
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
                            {renderStars(product.rating || 0)}
                          </div>
                          <span>({product.reviewCount || 0})</span>
                        </div>
                        <div className="sales">{product.sales || 0} sold</div>
                      </div>
                    </div>

                    <div className="table-cell actions-cell">
                      <div className="action-buttons">
                        <Link to={`/products/${product.id}`} className="action-btn" title="View">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/seller/products/${product.id}/edit`} className="action-btn" title="Edit">
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
      </div>
    </div>
  );
};

export default SellerProducts;
