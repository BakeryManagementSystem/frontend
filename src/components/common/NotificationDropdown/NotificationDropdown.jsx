import React, { useState } from 'react';
import { useNotifications } from '../../../context/NotificationContext.jsx';
import { Bell, Check, Clock, Package, CreditCard } from 'lucide-react';
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
    switch (type) {
      case 'order_created':
      case 'order_accepted':
      case 'order_shipped':
      case 'order_delivered':
        return <Package size={16} />;
      case 'payment_processed':
      case 'payment_required':
        return <CreditCard size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order_accepted':
      case 'order_delivered':
      case 'payment_processed':
        return 'success';
      case 'order_created':
      case 'order_shipped':
        return 'info';
      case 'payment_required':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="notification-dropdown">
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
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
                notifications.slice(0, 10).map(notification => (
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
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {!notification.read_at && (
                      <div className="unread-indicator" />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 10 && (
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
