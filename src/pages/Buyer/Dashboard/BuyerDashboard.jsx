import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
import ProductCard from '../../../components/common/ProductCard/ProductCard';
import {
  ShoppingBag,
  Heart,
  Package,
  Star,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      totalSpent: 0,
      wishlistItems: 0
    },
    recentOrders: [],
    wishlistItems: [],
    recommendedProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch real dashboard data from the backend
      const response = await ApiService.getBuyerDashboard();

      // Handle both response formats
      const data = response.success && response.data ? response.data : response;

      setDashboardData({
        stats: data.stats || {
          totalOrders: 0,
          pendingOrders: 0,
          totalSpent: 0,
          wishlistItems: 0
        },
        recentOrders: data.recentOrders || [],
        wishlistItems: data.wishlistItems || [],
        recommendedProducts: data.recommendedProducts || []
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="status-icon delivered" size={16} />;
      case 'shipped':
        return <Truck className="status-icon shipped" size={16} />;
      case 'processing':
        return <Clock className="status-icon processing" size={16} />;
      case 'pending':
        return <Clock className="status-icon pending" size={16} />;
      default:
        return <Package className="status-icon" size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="buyer-dashboard">
        <div className="container">
          <div className="loading-text">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="buyer-dashboard">
        <div className="container">
          <div className="dashboard-error">
            <AlertCircle size={48} />
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name || 'Valued Customer'}!</h1>
          <p>Here's what's happening with your orders and wishlist</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-content">
              <h3>{dashboardData.stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{dashboardData.stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <h3>{formatPrice(dashboardData.stats.totalSpent)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={24} />
            </div>
            <div className="stat-content">
              <h3>{dashboardData.stats.wishlistItems}</h3>
              <p>Wishlist Items</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/buyer/orders" className="section-link">
              View All Orders →
            </Link>
          </div>
          <div className="orders-grid">
            {dashboardData.recentOrders.length > 0 ? (
              dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">#{order.id}</span>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </div>
                  <div className="order-details">
                    <p className="order-date">{formatDate(order.date)}</p>
                    <p className="order-total">{formatPrice(order.total)}</p>
                    <p className="order-items">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                  </div>
                  <Link to={`/buyer/orders/${order.id}`} className="order-link">
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Package size={48} />
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Your Wishlist</h2>
            <Link to="/buyer/wishlist" className="section-link">
              View All →
            </Link>
          </div>
          <div className="products-grid wishlist-grid">
            {dashboardData.wishlistItems.length > 0 ? (
              dashboardData.wishlistItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            ) : (
              <div className="empty-state">
                <Heart size={48} />
                <h3>Your wishlist is empty</h3>
                <p>Add products you love to your wishlist</p>
                <Link to="/products" className="btn btn-primary">
                  Discover Products
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recommended for You</h2>
          </div>
          <div className="products-grid recommended-grid">
            {dashboardData.recommendedProducts.length > 0 ? (
              dashboardData.recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="empty-state">
                <Star size={48} />
                <h3>No recommendations yet</h3>
                <p>Browse products to get personalized recommendations</p>
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
