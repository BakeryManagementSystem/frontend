import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
import {
  Package,
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import './SellerOrders.css';

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await ApiService.getSellerOrders(params);

      // Check if response has the expected structure
      if (response.success && response.orders) {
        // Use the proper orders data structure from seller orders API
        const transformedOrders = response.orders.map(order => ({
          id: order.id,
          orderId: order.id,
          customer: {
            name: order.buyer?.name || order.customer?.name || 'Unknown Customer',
            email: order.buyer?.email || order.customer?.email || '',
            avatar: '/placeholder-avatar.jpg'
          },
          products: order.orderItems?.map(item => ({
            id: item.product_id,
            name: item.product?.name || 'Unknown Product',
            quantity: item.quantity,
            price: parseFloat(item.price || 0),
            image: item.product?.image_url || item.product?.image_path || '/placeholder-product.jpg',
            stock: item.product?.stock_quantity || 0
          })) || [],
          total: parseFloat(order.total || 0),
          status: order.status || 'pending',
          orderDate: order.created_at,
          shippingAddress: order.shipping_address || {
            street: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zipCode: 'N/A'
          }
        }));

        setOrders(transformedOrders);
      } else if (response.data) {
        // Handle the actual API response structure from SellerOrderController
        const transformedOrders = response.data.map(order => ({
          id: order.id,
          orderId: order.id,
          customer: {
            name: order.customer?.name || 'Unknown Customer',
            email: order.customer?.email || '',
            avatar: '/placeholder-avatar.jpg'
          },
          products: order.items?.map(item => ({
            id: item.product_id,
            name: item.product_name || 'Unknown Product',
            quantity: item.quantity,
            price: parseFloat(item.price || 0),
            image: item.product_image || '/placeholder-product.jpg',
            stock: 0 // Stock info not available in this response
          })) || [],
          total: parseFloat(order.total_amount || 0),
          status: order.status || 'pending',
          orderDate: order.created_at,
          shippingAddress: order.delivery_address || {
            street: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zipCode: 'N/A'
          }
        }));

        setOrders(transformedOrders);
      } else {
        // Fallback for empty or unexpected response
        setOrders([]);
        setError('No orders found or unexpected response format.');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError(`Failed to load orders: ${error.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    // Set loading state for this specific order
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`); // Debug log
      const response = await ApiService.updateSellerOrderStatus(orderId, newStatus);
      console.log('Update response:', response); // Debug log

      // Update local state only after successful API call
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Show success message
      alert(`Order #${orderId} status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} successfully`);

      // If order is delivered, trigger dashboard refresh to update revenue
      if (newStatus === 'delivered') {
        // Dispatch a custom event to notify dashboard components to refresh
        window.dispatchEvent(new CustomEvent('orderDelivered', {
          detail: { orderId, revenue: orders.find(o => o.id === orderId)?.total || 0 }
        }));

        console.log('Order delivered - dashboard should refresh revenue calculations');
      }

    } catch (error) {
      console.error('Failed to update order status:', error);

      // More detailed error handling
      let errorMessage = 'Failed to update order status. ';

      if (error.message.includes('422')) {
        errorMessage += 'Invalid status value provided.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage += 'You are not authorized to update this order.';
      } else if (error.message.includes('404')) {
        errorMessage += 'Order not found.';
      } else if (error.message.includes('Unable to connect')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }

      alert(errorMessage);
    } finally {
      // Remove loading state for this order
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      await ApiService.generateInvoice(orderId);
      // Success notification could be added here
    } catch (error) {
      console.error('Failed to download invoice:', error);
      // Error notification could be added here
    }
  };

  const handlePreviewInvoice = async (orderId) => {
    try {
      await ApiService.previewInvoice(orderId);
    } catch (error) {
      console.error('Failed to preview invoice:', error);
      // Error notification could be added here
    }
  };

  const filteredOrders = orders.filter(order =>
    String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="seller-orders">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Order Management</h1>
          <p>Track and manage your customer orders</p>
        </div>

        {/* Show loading state */}
        {loading && (
          <div className="loading-state">
            <RefreshCw className="icon-spin" size={32} />
            <p>Loading orders...</p>
          </div>
        )}

        {/* Show error state */}
        {error && (
          <div className="error-state">
            <AlertCircle size={32} />
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Show orders when loaded and no error */}
        {!loading && !error && (
          <>
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
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
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

              <button className="btn btn-refresh" onClick={refreshOrders} disabled={refreshing}>
                {refreshing ? <RefreshCw className="icon-spin" size={16} /> : <RefreshCw size={16} />}
                Refresh
              </button>
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

                        {/* Processing status button for pending orders */}
                        {order.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                              disabled={updatingStatus[order.id]}
                            >
                              {updatingStatus[order.id] ? (
                                <RefreshCw className="icon-spin" size={14} />
                              ) : (
                                <Clock size={14} />
                              )}
                              Mark as Processing
                            </button>
                            <button
                              className="btn btn-outline btn-sm text-error"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              disabled={updatingStatus[order.id]}
                            >
                              {updatingStatus[order.id] ? (
                                <RefreshCw className="icon-spin" size={14} />
                              ) : (
                                'Cancel Order'
                              )}
                            </button>
                          </>
                        )}

                        {/* Shipped status button for processing orders */}
                        {order.status === 'processing' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            disabled={updatingStatus[order.id]}
                          >
                            {updatingStatus[order.id] ? (
                              <RefreshCw className="icon-spin" size={14} />
                            ) : (
                              <Truck size={14} />
                            )}
                            Mark as Shipped
                          </button>
                        )}

                        {/* Delivered status button for shipped orders */}
                        {order.status === 'shipped' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            disabled={updatingStatus[order.id]}
                          >
                            {updatingStatus[order.id] ? (
                              <RefreshCw className="icon-spin" size={14} />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Mark as Delivered
                          </button>
                        )}

                        <button className="btn btn-outline btn-sm" onClick={() => handleDownloadInvoice(order.id)}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
