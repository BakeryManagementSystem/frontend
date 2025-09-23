import React, { useState } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { Bell, Check, Clock, Package, CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('cancel')) return <AlertCircle size={16} className="icon-cancelled" />;
    if (t.includes('deliver')) return <CheckCircle size={16} className="icon-delivered" />;
    if (t.includes('ship')) return <Truck size={16} className="icon-shipped" />;
    if (t.includes('payment') || t.includes('pay')) return <CreditCard size={16} className="icon-payment" />;
    if (t.includes('status')) return <Truck size={16} className="icon-status-update" />;
    if (t.includes('new') || t.includes('created') || t.includes('accept') || t === 'order' || t.includes('order')) return <Package size={16} className="icon-order" />;
    return <Bell size={16} />;
  };

  const getNotificationColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('cancel')) return 'error';
    if (t.includes('deliver') || t.includes('accept') || t.includes('success')) return 'success';
    if (t.includes('payment') || t.includes('pay')) return 'success';
    if (t.includes('ship') || t.includes('status') || t.includes('new') || t.includes('created') || t.includes('order')) return 'info';
    if (t.includes('require') || t.includes('warning')) return 'warning';
    return 'default';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="notification-dropdown">
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  <Check size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <Bell size={32} />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 15).map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read_at ? 'unread' : ''} ${getNotificationColor(notification.type)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        <Clock size={12} />
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    {!notification.read_at && (
                      <div className="unread-indicator" />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 15 && (
              <div className="notification-footer">
                <button className="view-all-btn">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
