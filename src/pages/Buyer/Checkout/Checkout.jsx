import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext.jsx';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  CreditCard,
  MapPin,
  Truck,
  Shield,
  Plus,
  Edit,
  Check,
  ArrowLeft,
  Clock
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('standard');

  // Mock addresses - replace with API call
  useEffect(() => {
    setAddresses([
      {
        id: 1,
        type: 'home',
        street: '123 Main Street, Apt 4B',
        city: 'Dhaka',
        state: 'Dhaka Division',
        zipCode: '1208',
        isDefault: true
      },
      {
        id: 2,
        type: 'work',
        street: '456 Business Ave, Suite 200',
        city: 'Dhaka',
        state: 'Dhaka Division',
        zipCode: '1215',
        isDefault: false
      }
    ]);

    // Set default address
    const defaultAddr = addresses.find(addr => addr.isDefault);
    if (defaultAddr) setSelectedAddress(defaultAddr.id);
  }, []);

  const deliveryOptions = [
    { id: 'standard', label: 'Standard Delivery', time: '2-3 days', price: 2.99 },
    { id: 'express', label: 'Express Delivery', time: 'Same day', price: 5.99 },
    { id: 'pickup', label: 'Store Pickup', time: '2 hours', price: 0 }
  ];

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'mobile', label: 'Mobile Banking', icon: Shield },
    { id: 'cod', label: 'Cash on Delivery', icon: Truck }
  ];

  const calculateTotal = () => {
    const selectedDelivery = deliveryOptions.find(opt => opt.id === deliveryOption);
    const subtotal = totalPrice;
    const deliveryFee = selectedDelivery?.price || 0;
    const tax = subtotal * 0.08;
    return {
      subtotal,
      deliveryFee,
      tax,
      total: subtotal + deliveryFee + tax
    };
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    // Simulate order placement
    setTimeout(() => {
      clearCart();
      setLoading(false);
      navigate('/buyer/orders', {
        state: { message: 'Order placed successfully!' }
      });
    }, 2000);
  };

  const totals = calculateTotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to proceed with checkout.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= stepNum ? 'bg-primary-color text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`flex-1 h-1 mx-4 ${
                  step > stepNum ? 'bg-primary-color' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? 'text-primary-color' : 'text-gray-500'}>
            Delivery
          </span>
          <span className={step >= 2 ? 'text-primary-color' : 'text-gray-500'}>
            Payment
          </span>
          <span className={step >= 3 ? 'text-primary-color' : 'text-gray-500'}>
            Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Information */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                  <button className="btn btn-secondary btn-sm">
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                </div>

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? 'border-primary-color bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 capitalize">
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-primary-color text-white text-xs rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">{address.street}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Options */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Options</h2>
                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        deliveryOption === option.id
                          ? 'border-primary-color bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={deliveryOption === option.id}
                        onChange={() => setDeliveryOption(option.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Truck className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500">{option.time}</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">
                          {option.price === 0 ? 'Free' : `$${option.price}`}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes (Optional)</h2>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? 'border-primary-color bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <method.icon className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{method.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Card Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="form-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">CVV</label>
                        <input type="text" placeholder="123" className="form-input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Order Items */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image || '/api/placeholder/80/80'}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>${totals.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn btn-primary ml-auto"
                disabled={step === 1 && !selectedAddress}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn btn-primary ml-auto"
              >
                {loading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image || '/api/placeholder/50/50'}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{items.length - 3} more items
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>${totals.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Estimated delivery: 2-3 days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
