import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  X,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Phone,
  Download,
  RefreshCw
} from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchOrders = async () => {
      setTimeout(() => {
        const mockOrders = [
          {
            id: 'ORD-2024-001',
            customer: {
              name: 'Sarah Johnson',
              email: 'sarah@example.com',
              phone: '+880 1234-567890'
            },
            items: [
              { name: 'Artisan Sourdough Bread', quantity: 2, price: 8.99 },
              { name: 'Chocolate Croissants', quantity: 4, price: 3.50 }
            ],
            total: 31.98,
            status: 'pending',
            priority: 'normal',
            orderDate: '2024-01-15T10:30:00',
            deliveryDate: '2024-01-16T15:00:00',
            deliveryAddress: '123 Main St, Dhaka 1208',
            paymentMethod: 'card',
            paymentStatus: 'paid',
            notes: 'Please deliver before 3 PM'
          },
          {
            id: 'ORD-2024-002',
            customer: {
              name: 'Mike Chen',
              email: 'mike@example.com',
              phone: '+880 1234-567891'
            },
            items: [
              { name: 'Red Velvet Cake', quantity: 1, price: 24.99 }
            ],
            total: 24.99,
            status: 'processing',
            priority: 'high',
            orderDate: '2024-01-15T09:15:00',
            deliveryDate: '2024-01-15T18:00:00',
            deliveryAddress: '456 Business Ave, Dhaka 1215',
            paymentMethod: 'mobile',
            paymentStatus: 'paid',
            notes: 'Birthday cake - please write "Happy Birthday Alex"'
          },
          {
            id: 'ORD-2024-003',
            customer: {
              name: 'Emma Davis',
              email: 'emma@example.com',
              phone: '+880 1234-567892'
            },
            items: [
              { name: 'Blueberry Muffins', quantity: 6, price: 2.99 },
              { name: 'Coffee Cake', quantity: 1, price: 18.50 }
            ],
            total: 36.44,
            status: 'ready',
            priority: 'normal',
            orderDate: '2024-01-14T14:20:00',
            deliveryDate: '2024-01-15T10:00:00',
            deliveryAddress: '789 Garden Road, Dhaka 1209',
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            notes: ''
          },
          {
            id: 'ORD-2024-004',
            customer: {
              name: 'John Smith',
              email: 'john@example.com',
              phone: '+880 1234-567893'
            },
            items: [
              { name: 'French Baguette', quantity: 3, price: 4.50 }
            ],
            total: 13.50,
            status: 'delivered',
            priority: 'normal',
            orderDate: '2024-01-13T11:45:00',
            deliveryDate: '2024-01-14T16:30:00',
            deliveryAddress: '321 Oak Street, Dhaka 1212',
            paymentMethod: 'card',
            paymentStatus: 'paid',
            notes: ''
          },
          {
            id: 'ORD-2024-005',
            customer: {
              name: 'Lisa Wang',
              email: 'lisa@example.com',
              phone: '+880 1234-567894'
            },
            items: [
              { name: 'Chocolate Chip Cookies', quantity: 12, price: 1.99 }
            ],
            total: 23.88,
            status: 'cancelled',
            priority: 'low',
            orderDate: '2024-01-12T16:00:00',
            deliveryDate: '2024-01-13T12:00:00',
            deliveryAddress: '654 Pine Avenue, Dhaka 1210',
            paymentMethod: 'mobile',
            paymentStatus: 'refunded',
            notes: 'Customer requested cancellation'
          }
        ];
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'ready':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'normal':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4" />;
      case 'ready':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate summary stats
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;
  const todayRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString() &&
             ['delivered', 'ready', 'processing'].includes(order.status);
    })
    .reduce((sum, order) => sum + order.total, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ready for Pickup</p>
              <p className="text-2xl font-bold text-purple-600">{readyOrders}</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-600">${todayRevenue.toFixed(2)}</p>
            </div>
            <Truck className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-medium border-none bg-transparent focus:ring-0 ${getStatusColor(order.status).split(' ')[0]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${order.total}</div>
                    <div className="text-xs text-gray-500">{order.paymentStatus}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                    <div className="text-xs text-gray-500">
                      Delivery: {formatDate(order.deliveryDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Order ID</h3>
                    <p className="text-gray-600">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-gray-600">{selectedOrder.customer.email}</p>
                    <p className="text-gray-600">{selectedOrder.customer.phone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg">${selectedOrder.total}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{selectedOrder.deliveryAddress}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Delivery Date: {formatDate(selectedOrder.deliveryDate)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Order Notes</h3>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 btn btn-primary">
                    <MessageCircle className="w-4 h-4" />
                    Contact Customer
                  </button>
                  <button className="flex-1 btn btn-secondary">
                    <Download className="w-4 h-4" />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
