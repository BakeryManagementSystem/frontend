import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Lock,
  ShoppingBag,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Complete
  const [loading, setLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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
    cardholderName: '',
    billingAddress: {
      sameAsShipping: true,
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If cart is empty, redirect to products
    if (items.length === 0) {
      navigate('/products');
    }

    // Pre-fill with user data if available
    if (user) {
      setShippingData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || ''
      }));
    }
  }, [items, navigate, user]);

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: '1 business day' }
  ];

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'payment') {
      if (field.startsWith('billing.')) {
        const billingField = field.split('.')[1];
        setPaymentData(prev => ({
          ...prev,
          billingAddress: {
            ...prev.billingAddress,
            [billingField]: value
          }
        }));
      } else {
        setPaymentData(prev => ({ ...prev, [field]: value }));
      }
    }

    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];

    required.forEach(field => {
      if (!shippingData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (shippingData.email && !/\S+@\S+\.\S+/.test(shippingData.email)) {
      newErrors.email = 'Email is invalid';
    }

    return newErrors;
  };

  const validatePayment = () => {
    const newErrors = {};

    if (!paymentData.cardNumber?.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    if (!paymentData.cardholderName?.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    return newErrors;
  };

  const handleNext = () => {
    let formErrors = {};

    if (step === 1) {
      formErrors = validateShipping();
    } else if (step === 2) {
      formErrors = validatePayment();
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Clear cart and go to success
      clearCart();
      setStep(4);
    } catch (error) {
      setErrors({ order: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const selectedShipping = shippingOptions.find(option => option.id === shippingMethod);
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = selectedShipping?.price || 0;
  const total = subtotal + tax + shipping;

  if (step === 4) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
            <div className="order-summary">
              <div className="order-number">Order #BMS{Date.now()}</div>
              <div className="order-total">Total: ${total.toFixed(2)}</div>
            </div>
            <div className="success-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/buyer/orders')}
              >
                View Orders
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/products')}
              >
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
        {/* Header */}
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate('/cart')}>
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-icon">
              <Truck size={16} />
            </div>
            <span>Shipping</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-icon">
              <CreditCard size={16} />
            </div>
            <span>Payment</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-icon">
              <CheckCircle size={16} />
            </div>
            <span>Review</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="checkout-step">
                <h2>Shipping Information</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={shippingData.firstName}
                      onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={shippingData.lastName}
                      onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                    className={`form-input ${errors.address ? 'error' : ''}`}
                  />
                  {errors.address && <div className="error-message">{errors.address}</div>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      className={`form-input ${errors.city ? 'error' : ''}`}
                    />
                    {errors.city && <div className="error-message">{errors.city}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                      className={`form-input ${errors.state ? 'error' : ''}`}
                    />
                    {errors.state && <div className="error-message">{errors.state}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                      className={`form-input ${errors.zipCode ? 'error' : ''}`}
                    />
                    {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                  </div>
                </div>

                <div className="shipping-methods">
                  <h3>Shipping Method</h3>
                  {shippingOptions.map(option => (
                    <label key={option.id} className="shipping-option">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shippingMethod === option.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <div className="option-content">
                        <div className="option-name">{option.name}</div>
                        <div className="option-details">{option.days}</div>
                      </div>
                      <div className="option-price">${option.price}</div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="checkout-step">
                <h2>Payment Information</h2>

                <div className="payment-form">
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('payment', 'cardNumber', formatCardNumber(e.target.value))}
                      className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                        className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value.replace(/\D/g, ''))}
                        className={`form-input ${errors.cvv ? 'error' : ''}`}
                        placeholder="123"
                        maxLength="4"
                      />
                      {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('payment', 'cardholderName', e.target.value)}
                      className={`form-input ${errors.cardholderName ? 'error' : ''}`}
                    />
                    {errors.cardholderName && <div className="error-message">{errors.cardholderName}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="checkout-step">
                <h2>Review Your Order</h2>

                <div className="order-review">
                  <div className="review-section">
                    <h3>Shipping Address</h3>
                    <div className="review-content">
                      <p>{shippingData.firstName} {shippingData.lastName}</p>
                      <p>{shippingData.address}</p>
                      <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                      <p>{shippingData.email} • {shippingData.phone}</p>
                    </div>
                    <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
                  </div>

                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <div className="review-content">
                      <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                      <p>{paymentData.cardholderName}</p>
                    </div>
                    <button className="edit-btn" onClick={() => setStep(2)}>Edit</button>
                  </div>

                  <div className="review-section">
                    <h3>Shipping Method</h3>
                    <div className="review-content">
                      <p>{selectedShipping?.name}</p>
                      <p>{selectedShipping?.days}</p>
                    </div>
                  </div>
                </div>

                {errors.order && (
                  <div className="alert alert-error">
                    {errors.order}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="checkout-actions">
              {step > 1 && step < 4 && (
                <button className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
              )}

              {step < 3 && (
                <button className="btn btn-primary" onClick={handleNext}>
                  Continue
                </button>
              )}

              {step === 3 && (
                <button
                  className="btn btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading"></div>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="summary-breakdown">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-notice">
              <Lock size={16} />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
