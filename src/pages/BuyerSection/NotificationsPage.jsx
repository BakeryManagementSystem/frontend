import { useState, useEffect } from 'react';
import "./NotificationsPage.css"
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedNotification, setSelectedNotification] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/buyer/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setNotifications(data.notifications);
            } else {
                setError(data.message || 'Failed to fetch notifications');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Notifications fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const openNotificationModal = (notification) => {
        setSelectedNotification(notification);
        document.body.style.overflow = 'hidden';
    };

    const closeNotificationModal = () => {
        setSelectedNotification(null);
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
            'terminated': '#ef4444'  // Using 'terminated' as per request
        };
        return colors[status] || '#6b7280';
    };

    if (loading) {
        return (
            <div className="notification-container">
                <div className="loading-spinner">Loading notifications...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="notification-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="notification-container">
            <div className="notifications-header">
                <h1 className="notifications-title">🔔 Notifications</h1>
                <p className="notifications-subtitle">
                    Your order updates and notifications ({notifications.length} total)
                </p>
            </div>

            <div className="notifications-grid">
                {notifications.length === 0 ? (
                    <div className="empty-notifications">
                        <div className="empty-icon">🔔</div>
                        <h3>No notifications yet</h3>
                        <p>Notifications will appear here when there are updates to your orders.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.purchase_id}
                            className="notification-card"
                            onClick={() => openNotificationModal(notification)}
                        >
                            <div className="notification-card-header">
                                <div className="notification-product-image">
                                    {notification.product_image ? (
                                        <img src={notification.product_image} alt={notification.product_name} />
                                    ) : (
                                        <div className="image-placeholder">📦</div>
                                    )}
                                </div>
                                <div
                                    className="notification-status-badge"
                                    style={{ backgroundColor: getStatusColor(notification.order_status) }}
                                >
                                    {notification.order_status.charAt(0).toUpperCase() + notification.order_status.slice(1)}
                                </div>
                            </div>

                            <div className="notification-card-content">
                                <h3 className="notification-product-name">{notification.product_name}</h3>
                                <p className="notification-message">
                                    Your order for {notification.product_name} is {notification.order_status}
                                </p>
                                <div className="notification-details-summary">
                                    <span>Qty: {notification.quantity}</span>
                                    <span className="notification-total">${notification.line_total}</span>
                                </div>
                                <p className="notification-date">{formatDate(notification.order_date)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedNotification && (
                <div className="modal-backdrop" onClick={closeNotificationModal}>
                    <div
                        className="notification-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Notification Details</h2>
                            <button
                                className="close-button"
                                onClick={closeNotificationModal}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="notification-product-section">
                                <div className="product-image-large">
                                    {selectedNotification.product_image ? (
                                        <img src={selectedNotification.product_image} alt={selectedNotification.product_name} />
                                    ) : (
                                        <div className="image-placeholder-large">📦</div>
                                    )}
                                </div>

                                <div className="product-info">
                                    <h3>{selectedNotification.product_name}</h3>
                                    <p className="product-category">{selectedNotification.product_category}</p>
                                    <p className="product-description">{selectedNotification.product_description}</p>
                                </div>
                            </div>

                            <div className="notification-details-section">
                                <div className="details-grid">
                                    <div className="detail-group">
                                        <h4>Order Information</h4>
                                        <p><strong>Quantity:</strong> {selectedNotification.quantity}</p>
                                        <p><strong>Total Amount:</strong> ${selectedNotification.line_total}</p>
                                        <p><strong>Order Date:</strong> {formatDate(selectedNotification.order_date)}</p>
                                        <p>
                                            <strong>Status:</strong>
                                            <span
                                                className="status-inline"
                                                style={{ color: getStatusColor(selectedNotification.order_status) }}
                                            >
                                                {selectedNotification.order_status.charAt(0).toUpperCase() + selectedNotification.order_status.slice(1)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;