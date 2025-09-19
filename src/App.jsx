import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';

// Public Pages
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Categories from './pages/Categories/Categories';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

// Auth Pages
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';

// Buyer Pages (Customer Pages for Bakery)
import BuyerDashboard from './pages/Buyer/Dashboard/BuyerDashboard';
import OrderHistory from './pages/Buyer/OrderHistory/OrderHistory';
import Wishlist from './pages/Buyer/Wishlist/Wishlist';
import Profile from './pages/Buyer/Profile/Profile';
import Checkout from './pages/Buyer/Checkout/Checkout';

// Seller Pages (Baker/Shop Manager Pages)
import SellerDashboard from './pages/Seller/Dashboard/SellerDashboard';
import SellerProducts from './pages/Seller/Products/SellerProducts';
import SellerOrders from './pages/Seller/Orders/SellerOrders';
import SellerProfile from './pages/Seller/Profile/SellerProfile';
import SellerShop from './pages/Seller/Shop/SellerShop';
import SellerAnalytics from './pages/Seller/Analytics/SellerAnalytics';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Shop Pages (Bakery Shop Pages)
import ShopDetail from './pages/Shop/ShopDetail/ShopDetail';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:category" element={<Products />} />
                <Route path="/bakery/:shopId" element={<ShopDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Buyer Protected Routes */}
                <Route path="/buyer" element={
                  <ProtectedRoute userType="buyer">
                    <BuyerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/orders" element={
                  <ProtectedRoute userType="buyer">
                    <OrderHistory />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/favorites" element={
                  <ProtectedRoute userType="buyer">
                    <Wishlist />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/profile" element={
                  <ProtectedRoute userType="buyer">
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute userType="buyer">
                    <Checkout />
                  </ProtectedRoute>
                } />

                {/* Seller Protected Routes */}
                <Route path="/seller" element={
                  <ProtectedRoute userType="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/seller/products" element={
                  <ProtectedRoute userType="seller">
                    <SellerProducts />
                  </ProtectedRoute>
                } />
                <Route path="/seller/orders" element={
                  <ProtectedRoute userType="seller">
                    <SellerOrders />
                  </ProtectedRoute>
                } />
                <Route path="/seller/profile" element={
                  <ProtectedRoute userType="seller">
                    <SellerProfile />
                  </ProtectedRoute>
                } />
                <Route path="/seller/shop" element={
                  <ProtectedRoute userType="seller">
                    <SellerShop />
                  </ProtectedRoute>
                } />
                <Route path="/seller/analytics" element={
                  <ProtectedRoute userType="seller">
                    <SellerAnalytics />
                  </ProtectedRoute>
                } />

                {/* Owner Protected Routes (same as seller routes) */}
                <Route path="/owner" element={
                  <ProtectedRoute userType="owner">
                    <SellerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/owner/products" element={
                  <ProtectedRoute userType="owner">
                    <SellerProducts />
                  </ProtectedRoute>
                } />
                <Route path="/owner/orders" element={
                  <ProtectedRoute userType="owner">
                    <SellerOrders />
                  </ProtectedRoute>
                } />
                <Route path="/owner/profile" element={
                  <ProtectedRoute userType="owner">
                    <SellerProfile />
                  </ProtectedRoute>
                } />
                <Route path="/owner/shop" element={
                  <ProtectedRoute userType="owner">
                    <SellerShop />
                  </ProtectedRoute>
                } />
                <Route path="/owner/analytics" element={
                  <ProtectedRoute userType="owner">
                    <SellerAnalytics />
                  </ProtectedRoute>
                } />

                {/* 404 Page */}
                <Route path="*" element={
                  <div className="container text-center" style={{ padding: '4rem 0' }}>
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
