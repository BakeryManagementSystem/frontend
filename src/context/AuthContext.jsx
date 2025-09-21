import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await ApiService.getUser();
      setUser(response.user || response);
      setIsOffline(false);
    } catch (error) {
      console.error('Failed to fetch user:', error);

      // Check if it's a network/connection error
      if (error.message.includes('Unable to connect') ||
          error.message.includes('fetch') ||
          error.name === 'TypeError') {
        // Network error - keep user logged in but mark as offline
        setIsOffline(true);
        // Try to get cached user data from localStorage
        const cachedUser = localStorage.getItem('cached_user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (e) {
            console.error('Failed to parse cached user:', e);
          }
        }
      } else {
        // Authentication error - token is invalid
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      const { token, user } = response;

      setToken(token);
      setUser(user);
      setIsOffline(false);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('cached_user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);

      // Check if offline
      if (error.message.includes('Unable to connect')) {
        setIsOffline(true);
        return {
          success: false,
          error: 'Unable to connect to server. Please check your internet connection and try again.'
        };
      }

      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData);
      const { token, user } = response;

      setToken(token);
      setUser(user);
      setIsOffline(false);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('cached_user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);

      // Check if offline
      if (error.message.includes('Unable to connect')) {
        setIsOffline(true);
        return {
          success: false,
          error: 'Unable to connect to server. Please check your internet connection and try again.'
        };
      }

      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      if (token && !isOffline) {
        await ApiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsOffline(false);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('cached_user');
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isOffline,
    isAuthenticated: !!user,
    isBuyer: user?.user_type === 'buyer',
    isSeller: user?.user_type === 'seller',
    isOwner: user?.user_type === 'owner',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
