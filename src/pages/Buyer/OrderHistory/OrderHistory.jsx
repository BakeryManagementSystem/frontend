import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  Eye,
  RotateCcw,
  MessageCircle
} from 'lucide-react';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data - replace with API call
  useEffect(() => {
    const fetchOrders = async () => {
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'delivered',
            total: 28.50,
            items: [
              { name: 'Artisan Sourdough Bread', quantity: 2, price: 8.99 },
              { name: 'Chocolate Croissants', quantity: 3, price: 3.50 }
            ],
            shop: 'Golden Grain Bakery',
            deliveryAddress: '123 Main St, Dhaka',
            estimatedDelivery: '2024-01-15',
            trackingNumber: 'TRK123456'
          },
          {
            id: 'ORD-002',
            date: '2024-01-12',
            status: 'in-transit',
            total: 15.99,
            items: [
              { name: 'Blueberry Muffins', quantity: 1, price: 15.99 }
            ],
            shop: 'Sweet Dreams Bakery',
            deliveryAddress: '123 Main St, Dhaka',
            estimatedDelivery: '2024-01-16',
            trackingNumber: 'TRK123457'
          },
          {
            id: 'ORD-003',
            date: '2024-01-10',
            status: 'processing',
            total: 42.75,
            items: [
              { name: 'Red Velvet Cake', quantity: 1, price: 24.99 },
              { name: 'Chocolate Donuts', quantity: 6, price: 2.99 }
            ],
            shop: 'French Corner Bakery',
            deliveryAddress: '123 Main St, Dhaka',
            estimatedDelivery: '2024-01-17',
            trackingNumber: 'TRK123458'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'in-transit':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'in-transit':
        return <Truck className="w-5 h-5" />;
      case 'processing':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <X className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="all">All Orders</option>
          <option value="processing">Processing</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Ordered on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-lg">${order.total}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className="pt-4 space-y-4">
                {/* Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shop & Delivery Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Shop</h4>
                    <p className="text-gray-600">{order.shop}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Delivery Address</h4>
                    <p className="text-gray-600">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Tracking & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                  <div>
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        Tracking: <span className="font-medium">{order.trackingNumber}</span>
                      </p>
                    )}
                    {order.estimatedDelivery && order.status !== 'delivered' && (
                      <p className="text-sm text-gray-600">
                        Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="btn btn-sm btn-secondary">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {order.status === 'delivered' && (
                      <>
                        <button className="btn btn-sm btn-outline">
                          <RotateCcw className="w-4 h-4" />
                          Reorder
                        </button>
                        <button className="btn btn-sm btn-outline">
                          <MessageCircle className="w-4 h-4" />
                          Review
                        </button>
                      </>
                    )}

                    {order.status === 'in-transit' && (
                      <button className="btn btn-sm btn-primary">
                        <Truck className="w-4 h-4" />
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? "You haven't placed any orders yet."
              : `No orders with status "${filter}" found.`
            }
          </p>
          <Link to="/marketplace" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
