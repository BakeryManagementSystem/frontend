import { useState, useEffect } from 'react';
import './Inbox.css';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Inbox = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchInboxData();
    }, []);

    const fetchInboxData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/owner/inbox`, {
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
            console.error('Inbox fetch error:', err);
        } finally {
            setLoading(false);
        }
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

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'status-pending',
            'accepted': 'status-accepted',
            'rejected': 'status-rejected'
        };

        return <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>;
    };

    if (loading) {
        return (
            <div className="inbox-container">
                <div className="loading-spinner">Loading inbox...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="inbox-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="inbox-container">
            <div className="inbox-header">
                <h1 className="inbox-title">📬 Order Notifications</h1>
                <p className="inbox-subtitle">
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="empty-inbox">
                        <div className="empty-icon">📭</div>
                        <h3>No notifications yet</h3>
                        <p>You'll see order notifications here when customers place orders.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification.purchase_id} className="notification-card">
                            <div className="notification-header">
                                <div className="notification-icon">🛍️</div>
                                <div className="notification-meta">
                                    <span className="notification-time">
                                        {formatDate(notification.order_date)}
                                    </span>
                                    {getStatusBadge(notification.order_status)}
                                </div>
                            </div>

                            <div className="notification-content">
                                <h3 className="notification-title">New Order Received!</h3>
                                <div className="notification-message">
                                    <p>
                                        You have an order from <strong>{notification.buyer_name}</strong>
                                        ({notification.buyer_email}) at <strong>{notification.buyer_phone}</strong>
                                        for <strong>{notification.product_name}</strong> to deliver at:
                                    </p>
                                    <div className="delivery-address">
                                        📍 {notification.buyer_address}
                                    </div>
                                </div>

                                <div className="order-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Product:</span>
                                        <span className="detail-value">{notification.product_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Quantity:</span>
                                        <span className="detail-value">{notification.quantity}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Total:</span>
                                        <span className="detail-value price">${notification.line_total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Inbox;