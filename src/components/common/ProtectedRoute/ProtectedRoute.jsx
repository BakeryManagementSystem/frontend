import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check user type if specified
  if (userType && user?.user_type !== userType) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = user?.user_type === 'buyer' ? '/buyer' : '/seller';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
