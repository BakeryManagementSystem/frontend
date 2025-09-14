import { useState, useEffect } from 'react';
import './OrderStatus.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const OrderStatus = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/owner/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setError(data.message || 'Failed to fetch orders');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Orders fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        await updateOrderStatus(orderId, 'accepted');
    };

    const handleRejectOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to reject this order? This action cannot be undone.')) {
            await updateOrderStatus(orderId, 'rejected');
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            setActionLoading(true);
            const response = await fetch(`${API_BASE}/api/owner/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);

                // Remove from UI
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order.order_id !== orderId)
                );

                // Optionally log updated order for confirmation
                console.log("Updated order:", data.order);

                setSelectedOrder(null);
            } else {
                alert(data.message || 'Failed to update order status');
            }
        } catch (err) {
            alert('Network error occurred');
            console.error('Status update error:', err);
        } finally {
            setActionLoading(false);
        }
    };


    const openOrderModal = (order) => {
        setSelectedOrder(order);
        document.body.style.overflow = 'hidden';
    };

    const closeOrderModal = () => {
        setSelectedOrder(null);
        document.body.style.overflow = '';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': '#f59e0b',
            'accepted': '#10b981',
            'rejected': '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    if (loading) {
        return (
            <div className="order-status-container">
                <div className="loading-spinner">Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-status-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="order-status-container">
            <div className="orders-header">
                <h1 className="orders-title">📊 Order Management</h1>
                <p className="orders-subtitle">
                    Manage and track all your orders ({orders.length} total)
                </p>
            </div>

            <div className="orders-grid">
                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-icon">📦</div>
                        <h3>No orders yet</h3>
                        <p>Orders will appear here when customers place them.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.order_id}
                            className="order-card"
                            onClick={() => openOrderModal(order)}
                        >
                            <div className="order-card-header">
                                <div className="order-product-image">
                                    {order.product_image ? (
                                        <img src={order.product_image} alt={order.product_name} />
                                    ) : (
                                        <div className="image-placeholder">📦</div>
                                    )}
                                </div>
                                <div
                                    className="order-status-badge"
                                    style={{ backgroundColor: getStatusColor(order.order_status) }}
                                >
                                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                </div>
                            </div>

                            <div className="order-card-content">
                                <h3 className="order-product-name">{order.product_name}</h3>
                                <p className="order-buyer">From: {order.buyer_name}</p>
                                <div className="order-details-summary">
                                    <span>Qty: {order.quantity}</span>
                                    <span className="order-total">${order.line_total}</span>
                                </div>
                                <p className="order-date">{formatDate(order.order_date)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedOrder && (
                <div className="modal-backdrop" onClick={closeOrderModal}>
                    <div
                        className="order-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Order Details</h2>
                            <button
                                className="close-button"
                                onClick={closeOrderModal}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="order-product-section">
                                <div className="product-image-large">
                                    {selectedOrder.product_image ? (
                                        <img src={selectedOrder.product_image} alt={selectedOrder.product_name} />
                                    ) : (
                                        <div className="image-placeholder-large">📦</div>
                                    )}
                                </div>

                                <div className="product-info">
                                    <h3>{selectedOrder.product_name}</h3>
                                    <p className="product-category">{selectedOrder.product_category}</p>
                                    <p className="product-description">{selectedOrder.product_description}</p>
                                </div>
                            </div>

                            <div className="order-details-section">
                                <div className="details-grid">
                                    <div className="detail-group">
                                        <h4>Customer Information</h4>
                                        <p><strong>Name:</strong> {selectedOrder.buyer_name}</p>
                                        <p><strong>Email:</strong> {selectedOrder.buyer_email}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.buyer_phone}</p>
                                        <p><strong>Address:</strong> {selectedOrder.buyer_address}</p>
                                    </div>

                                    <div className="detail-group">
                                        <h4>Order Information</h4>
                                        <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                                        <p><strong>Unit Price:</strong> ${selectedOrder.unit_price}</p>
                                        <p><strong>Total Amount:</strong> ${selectedOrder.line_total}</p>
                                        <p><strong>Order Date:</strong> {formatDate(selectedOrder.order_date)}</p>
                                        <p>
                                            <strong>Status:</strong>
                                            <span
                                                className="status-inline"
                                                style={{ color: getStatusColor(selectedOrder.order_status) }}
                                            >
                                                {selectedOrder.order_status.charAt(0).toUpperCase() + selectedOrder.order_status.slice(1)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedOrder.order_status === 'pending' && (
                            <div className="modal-actions">
                                <button
                                    className="btn btn-reject"
                                    onClick={() => updateOrderStatus(selectedOrder.order_id, 'rejected')}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Processing...' : 'Reject Order'}
                                </button>
                                <button
                                    className="btn btn-accept"
                                    onClick={() => updateOrderStatus(selectedOrder.order_id, 'accepted')}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Processing...' : 'Accept Order'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatus;