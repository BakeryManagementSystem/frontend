import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  ShoppingBag,
  Heart,
  Package,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    recentOrders: [],
    wishlistItems: [],
    recommendedProducts: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      setDashboardData({
        stats: {
          totalOrders: 18,
          pendingOrders: 3,
          totalSpent: 245.75,
          wishlistItems: 6
        },
        recentOrders: [
          {
            id: 'ORD-001',
            date: '2024-01-15',
            total: 45.99,
            status: 'delivered',
            items: 2,
            estimatedDelivery: '2024-01-16'
          },
          {
            id: 'ORD-002',
            date: '2024-01-12',
            total: 12.99,
            status: 'shipped',
            items: 1,
            estimatedDelivery: '2024-01-14'
          },
          {
            id: 'ORD-003',
            date: '2024-01-10',
            total: 24.98,
            status: 'processing',
            items: 3,
            estimatedDelivery: '2024-01-13'
          }
        ],
        wishlistItems: [
          {
            id: 1,
            name: "Custom Wedding Cake (3-tier)",
            price: 185.99,
            image: "/placeholder-wedding-cake.jpg",
            inStock: true
          },
          {
            id: 2,
            name: "Gluten-Free Brownies (9-pack)",
            price: 16.99,
            image: "/placeholder-brownies.jpg",
            inStock: false
          },
          {
            id: 3,
            name: "Fresh Bagels Variety Pack",
            price: 14.99,
            image: "/placeholder-bagels.jpg",
            inStock: true
          }
        ],
        recommendedProducts: [
          {
            id: 1,
            name: "Artisan Sourdough Bread",
            price: 8.99,
            image: "/placeholder-sourdough.jpg",
            rating: 4.8,
            reviewCount: 156
          },
          {
            id: 2,
            name: "Chocolate Croissants (6-pack)",
            price: 12.99,
            image: "/placeholder-croissants.jpg",
            rating: 4.9,
            reviewCount: 89
          },
          {
            id: 3,
            name: "Fresh Blueberry Muffins (12-pack)",
            price: 18.99,
            image: "/placeholder-muffins.jpg",
            rating: 4.6,
            reviewCount: 67
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="status-icon delivered" size={16} />;
      case 'shipped':
        return <Truck className="status-icon shipped" size={16} />;
      case 'processing':
        return <Clock className="status-icon processing" size={16} />;
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
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="buyer-dashboard loading">
        <div className="container">
          <div className="loading-text">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Here's an overview of your shopping activity</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingBag />
            </div>
            <div className="stat-content">
              <div className="stat-value">{dashboardData.stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock />
            </div>
            <div className="stat-content">
              <div className="stat-value">{dashboardData.stats.pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-value">${dashboardData.stats.totalSpent}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon wishlist">
              <Heart />
            </div>
            <div className="stat-content">
              <div className="stat-value">{dashboardData.stats.wishlistItems}</div>
              <div className="stat-label">Wishlist Items</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/buyer/orders" className="section-link">
                View All Orders
              </Link>
            </div>

            <div className="orders-list">
              {dashboardData.recentOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="order-info">
                      <span className="order-date">Placed on {new Date(order.date).toLocaleDateString()}</span>
                      <span className="order-items">{order.items} item{order.items > 1 ? 's' : ''}</span>
                    </div>
                    <div className="order-total">${order.total}</div>
                  </div>

                  {order.status !== 'delivered' && (
                    <div className="order-delivery">
                      Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </div>
                  )}

                  <div className="order-actions">
                    <Link to={`/buyer/orders/${order.id}`} className="btn btn-outline btn-sm">
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="btn btn-primary btn-sm">
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-sidebar">
            {/* Wishlist Preview */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Wishlist</h3>
                <Link to="/buyer/wishlist" className="section-link">
                  View All
                </Link>
              </div>

              <div className="wishlist-preview">
                {dashboardData.wishlistItems.map(item => (
                  <div key={item.id} className="wishlist-item">
                    <img src={item.image} alt={item.name} className="wishlist-image" />
                    <div className="wishlist-info">
                      <h4>{item.name}</h4>
                      <div className="wishlist-price">${item.price}</div>
                      <div className={`wishlist-stock ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Products */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Recommended for You</h3>
              </div>

              <div className="recommended-products">
                {dashboardData.recommendedProducts.map(product => (
                  <Link key={product.id} to={`/products/${product.id}`} className="recommended-item">
                    <img src={product.image} alt={product.name} className="recommended-image" />
                    <div className="recommended-info">
                      <h4>{product.name}</h4>
                      <div className="recommended-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{product.rating} ({product.reviewCount})</span>
                      </div>
                      <div className="recommended-price">${product.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Quick Actions</h3>
              </div>

              <div className="quick-actions">
                <Link to="/products" className="quick-action-btn">
                  <ShoppingBag size={20} />
                  Browse Products
                </Link>
                <Link to="/buyer/orders" className="quick-action-btn">
                  <Package size={20} />
                  Track Orders
                </Link>
                <Link to="/buyer/wishlist" className="quick-action-btn">
                  <Heart size={20} />
                  View Wishlist
                </Link>
                <Link to="/buyer/profile" className="quick-action-btn">
                  <Star size={20} />
                  Update Profile
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
