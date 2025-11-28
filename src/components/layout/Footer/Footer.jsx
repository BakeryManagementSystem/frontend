import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  ChefHat
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/bakerbari_logo_light.svg" alt="Bakerbari" className="footer-logo-image" />
              </div>
              <p className="footer-description">
                Your comprehensive Bakerbari platform. Streamline your bakery operations,
                manage inventory, track orders, and grow your bakery business with our powerful tools.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/shops">Shops</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                <li><Link to="/buyer/orders">My Orders</Link></li>
                <li><Link to="/checkout">Checkout</Link></li>
                <li><Link to="/buyer/wishlist">Wishlist</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* For Sellers */}
            <div className="footer-section">
              <h3 className="footer-title">For Sellers</h3>
              <ul className="footer-links">
                <li><Link to="/register">Join as Seller</Link></li>
                <li><Link to="/seller">Seller Dashboard</Link></li>
                <li><Link to="/seller/products">Manage Products</Link></li>
                <li><Link to="/seller/orders">Manage Orders</Link></li>
                <li><Link to="/seller/analytics">Analytics</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Features */}
        <div className="footer-features">
          <div className="feature-item">
            <Shield size={24} />
            <div className="feature-content">
              <h4>Secure Orders</h4>
              <p>Your data is protected</p>
            </div>
          </div>
          <div className="feature-item">
            <Truck size={24} />
            <div className="feature-content">
              <h4>Fresh Delivery</h4>
              <p>Quick and fresh delivery</p>
            </div>
          </div>
          <div className="feature-item">
            <ChefHat size={24} />
            <div className="feature-content">
              <h4>Quality Baking</h4>
              <p>Made fresh daily</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 Bakerbari. All rights reserved.</p>
            </div>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
