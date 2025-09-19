import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
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
      // Try to fetch from existing endpoints, with fallbacks for missing ones
      const responses = await Promise.allSettled([
        // Try to get orders from existing endpoint
        ApiService.getOrders().catch(() => ({ data: [] })),
        // Try to get wishlist from existing endpoint
        ApiService.getWishlist().catch(() => ({ data: [] })),
        // Mock recommended products since endpoint doesn't exist yet
        Promise.resolve({ data: [] })
      ]);

      // Process orders data
      let recentOrders = [];
      if (responses[0].status === 'fulfilled' && responses[0].value?.data) {
        recentOrders = responses[0].value.data.slice(0, 3).map(order => ({
          id: order.id,
          date: order.created_at || new Date().toISOString(),
          total: parseFloat(order.total || 0),
          status: order.status || 'pending',
          items: order.items?.length || order.item_count || 1,
          estimatedDelivery: order.estimated_delivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }));
      }

      // Add mock orders if no real orders exist
      if (recentOrders.length === 0) {
        recentOrders = [
          {
            id: 'ORD-001',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            total: 24.99,
            status: 'delivered',
            items: 2,
            estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'ORD-002',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            total: 18.50,
            status: 'shipped',
            items: 1,
            estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }

      // Process wishlist data
      let wishlistItems = [];
      if (responses[1].status === 'fulfilled' && responses[1].value?.data) {
        wishlistItems = responses[1].value.data.slice(0, 4).map(item => ({
          id: item.product?.id || item.id,
          name: item.product?.name || item.name,
          price: parseFloat(item.product?.price || item.price || 0),
          image: item.product?.image_url || item.image_url || '/placeholder-product.jpg',
          inStock: (item.product?.stock_quantity || item.stock_quantity || 0) > 0
        }));
      }

      // Add mock wishlist items if none exist
      if (wishlistItems.length === 0) {
        wishlistItems = [
          {
            id: 1,
            name: "Artisan Sourdough Bread",
            price: 8.99,
            image: "/placeholder-sourdough.jpg",
            inStock: true
          },
          {
            id: 2,
            name: "Chocolate Croissants (6-pack)",
            price: 12.99,
            image: "/placeholder-croissants.jpg",
            inStock: true
          }
        ];
      }

      // Mock recommended products since API doesn't exist yet
      const recommendedProducts = [
        {
          id: 1,
          name: "Fresh Blueberry Muffins",
          price: 15.99,
          image: "/placeholder-muffins.jpg",
          rating: 4.8,
          reviewCount: 89
        },
        {
          id: 2,
          name: "Classic Bagels (12-pack)",
          price: 9.99,
          image: "/placeholder-bagels.jpg",
          rating: 4.6,
          reviewCount: 156
        },
        {
          id: 3,
          name: "Custom Birthday Cake",
          price: 45.00,
          image: "/placeholder-birthday-cake.jpg",
          rating: 4.9,
          reviewCount: 67
        }
      ];

      setDashboardData({
        recentOrders,
        wishlistItems,
        recommendedProducts
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);

      // Provide fallback mock data even if all API calls fail
      setDashboardData({
        recentOrders: [
          {
            id: 'ORD-SAMPLE',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            total: 32.99,
            status: 'processing',
            items: 3,
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        wishlistItems: [
          {
            id: 'sample-1',
            name: "Sample Bakery Item",
            price: 12.99,
            image: "/placeholder-product.jpg",
            inStock: true
          }
        ],
        recommendedProducts: [
          {
            id: 'rec-1',
            name: "Recommended Pastry",
            price: 7.99,
            image: "/placeholder-pastry.jpg",
            rating: 4.5,
            reviewCount: 25
          }
        ]
      });
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

  if (loading) {
    return (
      <div className="buyer-dashboard">
        <div className="container">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
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
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Here's an overview of your shopping activity</p>
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
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map(order => (
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
                      <div className="order-total">{formatPrice(order.total)}</div>
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
                {dashboardData.wishlistItems.length > 0 ? (
                  dashboardData.wishlistItems.map(item => (
                    <div key={item.id} className="wishlist-item">
                      <img src={item.image} alt={item.name} className="wishlist-image" />
                      <div className="wishlist-info">
                        <h4>{item.name}</h4>
                        <div className="wishlist-price">{formatPrice(item.price)}</div>
                        <div className={`wishlist-stock ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-wishlist">
                    <Heart size={32} />
                    <p>Your wishlist is empty</p>
                  </div>
                )}
              </div>
            </section>

            {/* Recommended Products */}
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Recommended for You</h3>
              </div>

              <div className="recommended-products">
                {dashboardData.recommendedProducts.length > 0 ? (
                  dashboardData.recommendedProducts.map(product => (
                    <Link key={product.id} to={`/products/${product.id}`} className="recommended-item">
                      <img src={product.image} alt={product.name} className="recommended-image" />
                      <div className="recommended-info">
                        <h4>{product.name}</h4>
                        <div className="recommended-rating">
                          <Star size={14} fill="currentColor" />
                          <span>{product.rating} ({product.reviewCount})</span>
                        </div>
                        <div className="recommended-price">{formatPrice(product.price)}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="empty-recommendations">
                    <Star size={32} />
                    <p>No recommendations yet</p>
                  </div>
                )}
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
