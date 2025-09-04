import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  BarChart3
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    rating: 0,
    customers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API calls
      setTimeout(() => {
        setStats({
          totalRevenue: 5842.50,
          totalProducts: 45,
          totalOrders: 128,
          rating: 4.8,
          customers: 89,
          pendingOrders: 8
        });

        setRecentOrders([
          {
            id: 'ORD-101',
            customer: 'Sarah Johnson',
            date: '2024-01-15',
            status: 'pending',
            total: 28.50,
            items: 3
          },
          {
            id: 'ORD-102',
            customer: 'Mike Chen',
            date: '2024-01-15',
            status: 'processing',
            total: 15.99,
            items: 2
          },
          {
            id: 'ORD-103',
            customer: 'Emma Davis',
            date: '2024-01-14',
            status: 'shipped',
            total: 42.75,
            items: 5
          },
          {
            id: 'ORD-104',
            customer: 'John Smith',
            date: '2024-01-14',
            status: 'delivered',
            total: 18.25,
            items: 2
          }
        ]);

        setTopProducts([
          {
            id: 1,
            name: 'Artisan Sourdough Bread',
            sales: 45,
            revenue: 404.55,
            image: '/api/placeholder/100/100'
          },
          {
            id: 2,
            name: 'Chocolate Croissants',
            sales: 38,
            revenue: 133.00,
            image: '/api/placeholder/100/100'
          },
          {
            id: 3,
            name: 'Blueberry Muffins',
            sales: 32,
            revenue: 415.68,
            image: '/api/placeholder/100/100'
          }
        ]);

        setLowStockProducts([
          {
            id: 1,
            name: 'Red Velvet Cake',
            stock: 2,
            threshold: 5,
            status: 'critical'
          },
          {
            id: 2,
            name: 'Chocolate Donuts',
            stock: 4,
            threshold: 10,
            status: 'low'
          },
          {
            id: 3,
            name: 'Apple Pie',
            stock: 3,
            threshold: 8,
            status: 'low'
          }
        ]);

        setSalesData([
          { day: 'Mon', sales: 450 },
          { day: 'Tue', sales: 620 },
          { day: 'Wed', sales: 380 },
          { day: 'Thu', sales: 740 },
          { day: 'Fri', sales: 890 },
          { day: 'Sat', sales: 1200 },
          { day: 'Sun', sales: 980 }
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'low':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-color to-primary-light text-white rounded-2xl p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome to your shop, {user?.name}! 🏪
        </h1>
        <p className="text-purple-100">
          Manage your products, track orders, and grow your business
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">${stats.totalRevenue}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalProducts}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-purple-600">{stats.totalOrders}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Shop Rating</p>
              <p className="text-xl font-bold text-yellow-600">{stats.rating}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-xl font-bold text-indigo-600">{stats.customers}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-xl font-bold text-orange-600">{stats.pendingOrders}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/seller/products"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <Plus className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </Link>

          <Link
            to="/seller/orders"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <ShoppingCart className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Orders</span>
          </Link>

          <Link
            to="/seller/inventory"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <Package className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">Inventory</span>
          </Link>

          <Link
            to="/seller/analytics"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/seller/orders" className="text-primary-color hover:text-primary-dark text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-color transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.total}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
            <Link to="/seller/products" className="text-primary-color hover:text-primary-dark text-sm">
              Manage Products
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">${product.revenue}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            Low Stock Alert
          </h2>
          <Link to="/seller/inventory" className="text-primary-color hover:text-primary-dark text-sm">
            Manage Inventory
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lowStockProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStockStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Stock: {product.stock}</span>
                <span className="text-gray-500">Min: {product.threshold}</span>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="btn btn-sm btn-primary flex-1">
                  <Plus className="w-4 h-4 mr-1" />
                  Restock
                </button>
                <button className="btn btn-sm btn-secondary">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Sales</h2>
          <Link to="/seller/analytics" className="text-primary-color hover:text-primary-dark text-sm">
            View Detailed Analytics
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {salesData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-2">{day.day}</div>
              <div className="flex items-end justify-center h-24">
                <div
                  className="bg-primary-color rounded-t"
                  style={{
                    width: '20px',
                    height: `${(day.sales / Math.max(...salesData.map(d => d.sales))) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
              </div>
              <div className="text-xs font-medium text-gray-700 mt-2">${day.sales}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
