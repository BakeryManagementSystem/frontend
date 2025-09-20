import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
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
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.getSellerOrders();

      // Transform the backend response to match the component's expected format
      const transformedOrders = response.purchases?.map(purchase => ({
        id: `ORD-${purchase.order_id}`,
        orderId: purchase.order_id,
        customer: {
          name: purchase.buyer?.name || 'Unknown Customer',
          email: purchase.buyer?.email || '',
          avatar: '/placeholder-avatar.jpg'
        },
        products: [{
          id: purchase.product_id,
          name: purchase.product?.name || 'Unknown Product',
          quantity: purchase.quantity,
          price: parseFloat(purchase.unit_price),
          image: purchase.product?.image_url || '/placeholder-product.jpg'
        }],
        total: parseFloat(purchase.line_total),
        status: 'pending', // Default status since backend doesn't provide order status in purchases
        orderDate: purchase.sold_at,
        shippingAddress: {
          street: 'N/A',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A'
        }
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
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
