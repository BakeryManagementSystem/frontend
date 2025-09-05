import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Download
} from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          date: '2024-01-15',
          total: 199.99,
          status: 'delivered',
          items: [
            {
              id: 1,
              name: 'Premium Wireless Headphones',
              price: 199.99,
              quantity: 1,
              image: '/placeholder-product.jpg'
            }
          ],
          estimatedDelivery: '2024-01-18',
          trackingNumber: 'BMS123456789'
        },
        {
          id: 'ORD-002',
          date: '2024-01-12',
          total: 89.99,
          status: 'shipped',
          items: [
            {
              id: 2,
              name: 'Smart Home Camera',
              price: 89.99,
              quantity: 1,
              image: '/placeholder-product.jpg'
            }
          ],
          estimatedDelivery: '2024-01-16',
          trackingNumber: 'BMS987654321'
        },
        {
          id: 'ORD-003',
          date: '2024-01-10',
          total: 149.99,
          status: 'processing',
          items: [
            {
              id: 3,
              name: 'Coffee Maker Pro',
              price: 149.99,
              quantity: 1,
              image: '/placeholder-product.jpg'
            }
          ],
          estimatedDelivery: '2024-01-17'
        },
        {
          id: 'ORD-004',
          date: '2024-01-08',
          total: 79.99,
          status: 'cancelled',
          items: [
            {
              id: 4,
              name: 'Bluetooth Earbuds',
              price: 79.99,
              quantity: 1,
              image: '/placeholder-product.jpg'
            }
          ]
        }
      ];

      // Apply filter
      let filteredOrders = mockOrders;
      if (filter !== 'all') {
        filteredOrders = mockOrders.filter(order => order.status === filter);
      }

      setOrders(filteredOrders);
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
      case 'cancelled':
        return <Package className="status-icon cancelled" size={16} />;
      default:
        return <Package className="status-icon" size={16} />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="order-history loading">
        <div className="container">
          <div className="loading-text">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Order History</h1>
          <p>Track and manage all your orders</p>
        </div>

        {/* Controls */}
        <div className="order-controls">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                className={`filter-tab ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p>Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <div className="item-price">${item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total}</strong>
                  </div>

                  <div className="order-actions">
                    <button className="btn btn-outline btn-sm">
                      <Eye size={16} />
                      View Details
                    </button>

                    {order.status === 'delivered' && (
                      <button className="btn btn-primary btn-sm">
                        Write Review
                      </button>
                    )}

                    {order.trackingNumber && (
                      <button className="btn btn-secondary btn-sm">
                        <Truck size={16} />
                        Track Package
                      </button>
                    )}

                    <button className="btn btn-outline btn-sm">
                      <Download size={16} />
                      Invoice
                    </button>
                  </div>
                </div>

                {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="delivery-info">
                    Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-orders">
              <Package size={64} />
              <h3>No orders found</h3>
              <p>You haven't placed any orders yet or no orders match your search.</p>
              <button className="btn btn-primary">Start Shopping</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
