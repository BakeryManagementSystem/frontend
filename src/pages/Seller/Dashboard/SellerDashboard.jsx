import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
import {
  Store,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Star,
  Eye,
  Plus,
  Edit,
  BarChart3,
  PieChart
} from 'lucide-react';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentOrders: [],
    topProducts: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();

    // Listen for order delivery events to refresh dashboard data
    const handleOrderDelivered = (event) => {
      console.log('Order delivered event received:', event.detail);
      // Refresh dashboard data to update revenue
      fetchDashboardData();
    };

    window.addEventListener('orderDelivered', handleOrderDelivered);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('orderDelivered', handleOrderDelivered);
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ApiService.getSellerDashboard();

      // Handle new response format with success/data wrapper
      const data = response.success ? response.data : response;

      setDashboardData({
        stats: data.stats || {},
        recentOrders: data.recentOrders || [],
        topProducts: data.topProducts || [],
        recentActivities: data.recentActivities || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={16} />;
      case 'review':
        return <Star size={16} />;
      case 'stock':
        return <Package size={16} />;
      default:
        return <Eye size={16} />;
    }
  };

  return (
    <div className="seller-dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome to your Store, {user?.name}!</h1>
            <p>Manage your products, orders, and grow your business</p>
          </div>
          <div className="header-actions">
            <Link to="/seller/products/new" className="btn btn-primary">
              <Plus size={18} />
              Add Product
            </Link>
            <Link to="/seller/shop" className="btn btn-outline">
              <Store size={18} />
              Manage Shop
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Package />
            </div>
            <div className="stat-content">
              <div className="stat-value">{dashboardData.stats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <Link to="/seller/products" className="stat-link">View All</Link>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <ShoppingCart />
            </div>
            <div className="stat-content">
              <div className="stat-value">{dashboardData.stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <Link to="/seller/orders" className="stat-link">Manage</Link>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">
              <DollarSign />
            </div>
            <div className="stat-content">
              <div className="stat-value">${dashboardData.stats.totalRevenue}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <Link to="/seller/analytics" className="stat-link">Analytics</Link>
          </div>

          <div className="stat-card investment">
            <div className="stat-icon">
              <PieChart />
            </div>
            <div className="stat-content">
              <div className="stat-value">${dashboardData.stats.totalIngredientInvestment || 0}</div>
              <div className="stat-label">Total Investment</div>
            </div>
            <Link to="/seller/ingredients" className="stat-link">Manage</Link>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="alert-cards">
          {dashboardData.stats.pendingOrders > 0 && (
            <div className="alert-card warning">
              <div className="alert-icon">
                <ShoppingCart />
              </div>
              <div className="alert-content">
                <h4>Pending Orders</h4>
                <p>You have {dashboardData.stats.pendingOrders} orders waiting for processing</p>
              </div>
              <Link to="/seller/orders?status=pending" className="btn btn-sm btn-outline">
                Process Orders
              </Link>
            </div>
          )}

          {dashboardData.stats.lowStockItems > 0 && (
            <div className="alert-card error">
              <div className="alert-icon">
                <Package />
              </div>
              <div className="alert-content">
                <h4>Low Stock Alert</h4>
                <p>{dashboardData.stats.lowStockItems} products are running low on inventory</p>
              </div>
              <Link to="/seller/products?filter=low-stock" className="btn btn-sm btn-outline">
                Restock Items
              </Link>
            </div>
          )}
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <section className="dashboard-section main-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/seller/orders" className="section-link">
                View All Orders
              </Link>
            </div>

            <div className="orders-table">
              <div className="table-header">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Product</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {dashboardData.recentOrders.map(order => (
                <div key={order.id} className="table-row">
                  <div className="order-id">#{order.id}</div>
                  <div className="customer-name">{order.customer}</div>
                  <div className="product-name">{order.product}</div>
                  <div className="order-amount">${order.amount}</div>
                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div className="order-actions">
                    <button className="action-btn">
                      <Eye size={14} />
                    </button>
                    <button className="action-btn">
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-sidebar">
            {/* Top Products */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Top Products</h3>
                <Link to="/seller/analytics" className="section-link">
                  <BarChart3 size={16} />
                </Link>
              </div>

              <div className="top-products">
                {dashboardData.topProducts.map(product => (
                  <div key={product.id} className="product-item">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <div className="product-stats">
                        <span className="sales">{product.sales} sales</span>
                        <span className="revenue">${product.revenue}</span>
                      </div>
                      <div className="product-meta">
                        <div className="rating">
                          <Star size={12} fill="currentColor" />
                          {product.rating}
                        </div>
                        <div className={`stock ${product.stock < 5 ? 'low' : ''}`}>
                          Stock: {product.stock}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activities */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Recent Activities</h3>
              </div>

              <div className="activities-list">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Quick Actions</h3>
              </div>

              <div className="quick-actions">
                <Link to="/seller/products/new" className="quick-action-btn primary">
                  <Plus size={18} />
                  Add New Product
                </Link>
                <Link to="/seller/ingredients" className="quick-action-btn">
                  <PieChart size={18} />
                  Manage Ingredients
                </Link>
                <Link to="/seller/orders" className="quick-action-btn">
                  <Package size={18} />
                  Process Orders
                </Link>
                <Link to="/seller/analytics" className="quick-action-btn">
                  <TrendingUp size={18} />
                  View Analytics
                </Link>
                <Link to="/seller/shop" className="quick-action-btn">
                  <Store size={18} />
                  Manage Shop
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
