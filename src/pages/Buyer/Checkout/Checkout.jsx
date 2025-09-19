import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useNotifications } from '../../../context/NotificationContext';
import ApiService from '../../../services/api';
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Lock,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: user?.name || '',
    billingAddress: {
      sameAsShipping: true,
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [shippingMethod, setShippingMethod] = useState('standard');

  useEffect(() => {
    if (!items.length) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const subtotal = getTotalPrice();
  const shippingCost = shippingMethod === 'express' ? 15.00 : (subtotal >= 25 ? 0 : 7.50);
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShippingData()) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePaymentData()) {
      setStep(3);
    }
  };

  const validateShippingData = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (let field of required) {
      if (!shippingData[field]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const validatePaymentData = () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
      setError('All payment fields are required');
      return false;
    }
    setError('');
    return true;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Create the order (this will be pending and wait for seller acceptance)
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        })),
        shipping_address: shippingData,
        shipping_method: shippingMethod,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax: tax,
        total: total,
        status: 'pending' // Order starts as pending, waiting for seller acceptance
      };

      const orderResponse = await ApiService.createOrder(orderData);

      if (orderResponse.success) {
        setOrderId(orderResponse.order.id);
        setStep(4);

        // Clear the cart after successful order creation
        clearCart();

        // Add notification for the buyer
        addNotification({
          id: Date.now(),
          type: 'order_created',
          title: 'Order Created Successfully',
          message: `Your order #${orderResponse.order.id} has been created and sent to sellers for approval.`,
          read_at: null,
          created_at: new Date().toISOString()
        });

        // The backend will automatically notify sellers about the new order

      } else {
        throw new Error(orderResponse.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (field, value) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (step === 4) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-success">
            <CheckCircle size={64} className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p>Your order #{orderId} has been created and sent to our bakery partners.</p>

            <div className="success-details">
              <div className="detail-item">
                <Clock size={20} />
                <div>
                  <h4>What happens next?</h4>
                  <p>Our bakery partners will review your order and confirm availability. You'll receive a notification once they accept your order.</p>
                </div>
              </div>

              <div className="detail-item">
                <CreditCard size={20} />
                <div>
                  <h4>Payment</h4>
                  <p>Payment will be processed only after the bakery accepts your order and confirms the delivery details.</p>
                </div>
              </div>

              <div className="detail-item">
                <Truck size={20} />
                <div>
                  <h4>Delivery</h4>
                  <p>You'll receive tracking information once your order is prepared and ready for delivery.</p>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <button onClick={() => navigate('/buyer/orders')} className="btn btn-primary">
                View My Orders
              </button>
              <button onClick={() => navigate('/products')} className="btn btn-outline">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Shipping</span>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Payment</span>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Review</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="checkout-content">
          <div className="checkout-main">
            {step === 1 && (
              <div className="checkout-section">
                <h2>Shipping Information</h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) => handleShippingChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) => handleShippingChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      value={shippingData.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        value={shippingData.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        value={shippingData.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="shipping-methods">
                    <h3>Shipping Method</h3>
                    <div className="shipping-options">
                      <label className="shipping-option">
                        <input
                          type="radio"
                          value="standard"
                          checked={shippingMethod === 'standard'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                        />
                        <div>
                          <strong>Standard Delivery</strong>
                          <span>{subtotal >= 25 ? 'FREE' : '$7.50'} • 3-5 business days</span>
                        </div>
                      </label>
                      <label className="shipping-option">
                        <input
                          type="radio"
                          value="express"
                          checked={shippingMethod === 'express'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                        />
                        <div>
                          <strong>Express Delivery</strong>
                          <span>$15.00 • 1-2 business days</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg">
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-section">
                <h2>Payment Information</h2>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="security-notice">
                    <Lock size={16} />
                    <span>Your payment information is secured with 256-bit SSL encryption</span>
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                      Back to Shipping
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg">
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-section">
                <h2>Review Your Order</h2>

                <div className="review-section">
                  <h3>Shipping Address</h3>
                  <div className="review-content">
                    <p>{shippingData.firstName} {shippingData.lastName}</p>
                    <p>{shippingData.address}</p>
                    <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                    <p>{shippingData.phone}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="edit-btn">Edit</button>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <div className="review-content">
                    <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                    <p>{paymentData.cardholderName}</p>
                  </div>
                  <button onClick={() => setStep(2)} className="edit-btn">Edit</button>
                </div>

                <div className="review-section">
                  <h3>Order Items</h3>
                  <div className="review-items">
                    {items.map(item => (
                      <div key={item.id} className="review-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-notice">
                  <AlertCircle size={16} />
                  <div>
                    <strong>Important:</strong> Your order will be sent to our bakery partners for approval.
                    Payment will only be processed after they accept your order and confirm availability.
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={() => setStep(2)} className="btn btn-outline">
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="total-line">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="total-line">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="total-line total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
