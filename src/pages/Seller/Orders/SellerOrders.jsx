import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Package,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  MessageCircle
} from 'lucide-react';
import './SellerOrders.css';

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-101',
          customer: {
            name: 'John Smith',
            email: 'john.smith@email.com',
            avatar: '/placeholder-avatar.jpg'
          },
          products: [
            {
              id: 1,
              name: 'Premium Wireless Headphones',
              quantity: 1,
              price: 199.99,
              image: '/placeholder-product.jpg'
            }
          ],
          total: 199.99,
          status: 'pending',
          orderDate: '2024-01-15T10:30:00Z',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        },
        {
          id: 'ORD-102',
          customer: {
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            avatar: '/placeholder-avatar.jpg'
          },
          products: [
            {
              id: 2,
              name: 'Smart Home Camera',
              quantity: 2,
              price: 89.99,
              image: '/placeholder-product.jpg'
            }
          ],
          total: 179.98,
          status: 'shipped',
          orderDate: '2024-01-14T14:20:00Z',
          shippedDate: '2024-01-15T09:00:00Z',
          trackingNumber: 'TRK123456789',
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210'
          }
        },
        {
          id: 'ORD-103',
          customer: {
            name: 'Mike Wilson',
            email: 'mike.w@email.com',
            avatar: '/placeholder-avatar.jpg'
          },
          products: [
            {
              id: 3,
              name: 'Coffee Maker Pro',
              quantity: 1,
              price: 149.99,
              image: '/placeholder-product.jpg'
            }
          ],
          total: 149.99,
          status: 'delivered',
          orderDate: '2024-01-13T16:45:00Z',
          shippedDate: '2024-01-14T08:30:00Z',
          deliveredDate: '2024-01-16T12:15:00Z',
          trackingNumber: 'TRK987654321',
          shippingAddress: {
            street: '789 Pine Rd',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601'
          }
        },
        {
          id: 'ORD-104',
          customer: {
            name: 'Emma Davis',
            email: 'emma.d@email.com',
            avatar: '/placeholder-avatar.jpg'
          },
          products: [
            {
              id: 4,
              name: 'Bluetooth Earbuds',
              quantity: 1,
              price: 79.99,
              image: '/placeholder-product.jpg'
            }
          ],
          total: 79.99,
          status: 'cancelled',
          orderDate: '2024-01-12T11:20:00Z',
          cancelledDate: '2024-01-13T09:00:00Z',
          cancelReason: 'Customer requested cancellation',
          shippingAddress: {
            street: '321 Elm St',
            city: 'Miami',
            state: 'FL',
            zipCode: '33101'
          }
        }
      ];

      // Apply status filter
      let filteredOrders = mockOrders;
      if (statusFilter !== 'all') {
        filteredOrders = mockOrders.filter(order => order.status === statusFilter);
      }

      setOrders(filteredOrders);
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" size={16} />;
      case 'shipped':
        return <Truck className="status-icon shipped" size={16} />;
      case 'delivered':
        return <CheckCircle className="status-icon delivered" size={16} />;
      case 'cancelled':
        return <AlertCircle className="status-icon cancelled" size={16} />;
      default:
        return <Package className="status-icon" size={16} />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="seller-orders loading">
        <div className="container">
          <div className="loading-text">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-orders">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Order Management</h1>
          <p>Track and manage your customer orders</p>
        </div>

        {/* Controls */}
        <div className="orders-controls">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="count">
                  ({orders.filter(o => status === 'all' || o.status === status).length})
                </span>
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
                    <div className="order-meta">
                      <span>Placed on {new Date(order.orderDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="order-total">${order.total}</span>
                    </div>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="order-content">
                  {/* Customer Info */}
                  <div className="customer-section">
                    <h4>Customer</h4>
                    <div className="customer-info">
                      <img src={order.customer.avatar} alt={order.customer.name} className="customer-avatar" />
                      <div className="customer-details">
                        <div className="customer-name">{order.customer.name}</div>
                        <div className="customer-email">{order.customer.email}</div>
                      </div>
                      <button className="btn btn-outline btn-sm">
                        <MessageCircle size={14} />
                        Contact
                      </button>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="products-section">
                    <h4>Products</h4>
                    <div className="order-products">
                      {order.products.map(product => (
                        <div key={product.id} className="order-product">
                          <img src={product.image} alt={product.name} className="product-image" />
                          <div className="product-details">
                            <div className="product-name">{product.name}</div>
                            <div className="product-quantity">Qty: {product.quantity}</div>
                          </div>
                          <div className="product-price">${(product.price * product.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="shipping-section">
                    <h4>Shipping Address</h4>
                    <div className="shipping-address">
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    </div>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-dates">
                    {order.shippedDate && (
                      <div className="date-info">
                        Shipped: {new Date(order.shippedDate).toLocaleDateString()}
                        {order.trackingNumber && (
                          <span className="tracking">Tracking: {order.trackingNumber}</span>
                        )}
                      </div>
                    )}
                    {order.deliveredDate && (
                      <div className="date-info">
                        Delivered: {new Date(order.deliveredDate).toLocaleDateString()}
                      </div>
                    )}
                    {order.cancelledDate && (
                      <div className="date-info cancelled">
                        Cancelled: {new Date(order.cancelledDate).toLocaleDateString()}
                        {order.cancelReason && <span className="reason">({order.cancelReason})</span>}
                      </div>
                    )}
                  </div>

                  <div className="order-actions">
                    <button className="btn btn-outline btn-sm">
                      <Eye size={14} />
                      View Details
                    </button>

                    {order.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                        >
                          <Truck size={14} />
                          Mark as Shipped
                        </button>
                        <button
                          className="btn btn-outline btn-sm text-error"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          Cancel Order
                        </button>
                      </>
                    )}

                    {order.status === 'shipped' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                      >
                        <CheckCircle size={14} />
                        Mark as Delivered
                      </button>
                    )}

                    <button className="btn btn-outline btn-sm">
                      <Download size={14} />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <Package size={64} />
              <h3>No orders found</h3>
              <p>
                {searchQuery || statusFilter !== 'all'
                  ? 'No orders match your current search or filter criteria.'
                  : 'You haven\'t received any orders yet. Keep promoting your products!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
