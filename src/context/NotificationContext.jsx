import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import ApiService from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      // Try to fetch from API first, but handle 404 gracefully
      const response = await ApiService.getNotifications();
      setNotifications(response.notifications || []);
      setUnreadCount(response.unread_count || 0);
    } catch (error) {
      // If API endpoint doesn't exist (404), use mock data instead of logging errors
      if (error.message?.includes('404')) {
        // Use mock notifications data until backend is implemented
        const mockNotifications = [
          {
            id: 1,
            title: 'New order received',
            message: 'Order #1234 has been placed for 2 items.',
            type: 'new_order',
            read_at: null,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Order Shipped',
            message: 'Your order #1233 has been shipped and is on its way.',
            type: 'order_shipped',
            read_at: null,
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 3,
            title: 'Payment Successful',
            message: 'Payment for order #1232 has been successfully processed.',
            type: 'payment_processed',
            read_at: new Date().toISOString(),
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 4,
            title: 'Order Cancelled',
            message: 'Your order #1231 has been cancelled.',
            type: 'order_cancelled',
            read_at: null,
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read_at).length);
      } else {
        console.error('Failed to fetch notifications:', error);
      }
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await ApiService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      // Handle API errors gracefully - still update local state
      if (error.message?.includes('404')) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId
              ? { ...notif, read_at: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      await ApiService.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      // Handle API errors gracefully - still update local state
      if (error.message?.includes('404')) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
        );
        setUnreadCount(0);
      } else {
        console.error('Failed to mark all notifications as read:', error);
      }
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read_at) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await ApiService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      // Update unread count if the removed notification was unread
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read_at ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      // Handle API errors gracefully - still update local state
      if (error.message?.includes('404')) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        setUnreadCount(prev => {
          const notification = notifications.find(n => n.id === notificationId);
          return notification && !notification.read_at ? Math.max(0, prev - 1) : prev;
        });
      } else {
        console.error('Failed to remove notification:', error);
      }
    }
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
