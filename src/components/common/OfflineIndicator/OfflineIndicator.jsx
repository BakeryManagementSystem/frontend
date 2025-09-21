import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const { isOffline } = useAuth();

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
