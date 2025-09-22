import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import ApiService from '../../../services/api';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check connection status periodically
    const checkConnection = async () => {
      const online = await ApiService.checkConnection();
      setIsOffline(!online);
    };

    // Initial check
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="offline-indicator">
      <div className="offline-content">
        <WifiOff size={16} />
        <span>Offline Mode - Limited functionality</span>
        <AlertCircle size={14} className="warning-icon" />
      </div>
    </div>
  );
};

export default OfflineIndicator;
