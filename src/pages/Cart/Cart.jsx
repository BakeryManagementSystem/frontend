import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (user?.user_type !== 'buyer') {
      alert('Only buyers can place orders');
      return;
    }

    navigate('/checkout');
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 25 ? 0 : 7.50;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={64} className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
          <h1>Shopping Cart ({items.length} items)</h1>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <h3>Your Items</h3>
              <button
                onClick={clearCart}
                className="clear-cart-btn"
                disabled={loading}
              >
                Clear Cart
              </button>
            </div>

            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&crop=center'}
                      alt={item.name}
                      className="product-image"
                    />
                  </div>

                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-seller">by {item.seller}</p>
                    <p className="item-category">{item.category}</p>

                    {!item.inStock && (
                      <span className="out-of-stock-badge">Out of Stock</span>
                    )}
                  </div>

                  <div className="item-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={loading}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={loading}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="item-price">
                    <span className="unit-price">{formatPrice(item.price)} each</span>
                    <span className="total-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>

                  <div className="item-actions">
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-line">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>

              <div className="summary-line">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className="summary-line total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="shipping-notice">
                {subtotal >= 25 ? (
                  <div className="free-shipping">
                    <Truck size={16} />
                    <span>Free shipping on this order!</span>
                  </div>
                ) : (
                  <div className="shipping-threshold">
                    <Truck size={16} />
                    <span>Add {formatPrice(25 - subtotal)} more for free shipping</span>
                  </div>
                )}
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={loading || items.some(item => !item.inStock)}
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </button>

              <div className="security-badges">
                <div className="security-badge">
                  <Shield size={16} />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations">
              <h4>You might also like</h4>
              <p>Discover more bakery items</p>
              <Link to="/products" className="btn btn-outline">
                Browse Products
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <Shield size={24} />
            <div>
              <h5>Secure Payment</h5>
              <p>Your payment information is protected</p>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={24} />
            <div>
              <h5>Fast Delivery</h5>
              <p>Fresh products delivered quickly</p>
            </div>
          </div>
          <div className="trust-item">
            <CreditCard size={24} />
            <div>
              <h5>Easy Returns</h5>
              <p>24-hour satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
