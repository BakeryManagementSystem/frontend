import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import theme from './styles/theme.js';

// Layout Components
import PublicLayout from './components/Layout/PublicLayout';
import BuyerLayout from './components/Layout/BuyerLayout';
import SellerLayout from './components/Layout/SellerLayout';

// Public Pages
import Home from './pages/Public/Home/Home.jsx';
import Marketplace from './pages/Public/Marketplace/Marketplace.jsx';
import ProductDetail from './pages/Public/ProductDetail/ProductDetail.jsx';
import About from './pages/Public/About/About.jsx';
import Contact from './pages/Public/Contact/Contact.jsx';

// Auth Pages
import Login from './pages/Auth/Login/Login.jsx';
import Register from './pages/Auth/Register/Register.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword.jsx';

// Buyer Pages
import BuyerDashboard from './pages/Buyer/Dashboard/Dashboard.jsx';
import OrderHistory from './pages/Buyer/OrderHistory/OrderHistory.jsx';
import Wishlist from './pages/Buyer/Wishlist/Wishlist.jsx';
import BuyerProfile from './pages/Buyer/Profile/Profile.jsx';
import Checkout from './pages/Buyer/Checkout/Checkout.jsx';

// Seller Pages
import SellerDashboard from './pages/Seller/Dashboard/Dashboard.jsx';
import ShopManagement from './pages/Seller/ShopManagement/ShopManagement.jsx';
import ProductManagement from './pages/Seller/ProductManagement/ProductManagement.jsx';
import InventoryManagement from './pages/Seller/InventoryManagement/InventoryManagement.jsx';
import OrderManagement from './pages/Seller/OrderManagement/OrderManagement.jsx';
import ShopAnalytics from './pages/Seller/Analytics/Analytics.jsx';
import SellerProfile from './pages/Seller/Profile/Profile.jsx';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';
import Cart from './components/Cart/Cart';
import NotFound from './pages/NotFound/NotFound.jsx';

import './App.css';

function App() {
  // Initialize theme CSS custom properties
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = theme.generateCSSCustomProperties();
    document.head.appendChild(style);

    return () => {
      // Cleanup on unmount
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                {/* Buyer Routes */}
                <Route path="/buyer" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['buyer', 'admin']}>
                      <BuyerLayout />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                }>
                  <Route index element={<BuyerDashboard />} />
                  <Route path="dashboard" element={<BuyerDashboard />} />
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="profile" element={<BuyerProfile />} />
                  <Route path="checkout" element={<Checkout />} />
                </Route>

                {/* Seller Routes */}
                <Route path="/seller" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['seller', 'admin']}>
                      <SellerLayout />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                }>
                  <Route index element={<SellerDashboard />} />
                  <Route path="dashboard" element={<SellerDashboard />} />
                  <Route path="shop" element={<ShopManagement />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="analytics" element={<ShopAnalytics />} />
                  <Route path="profile" element={<SellerProfile />} />
                </Route>

                {/* Cart - Available to authenticated users */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
