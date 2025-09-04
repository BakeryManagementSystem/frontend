import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  ShoppingBag,
  Heart,
  Package,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Plus
} from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    totalSpent: 0,
    rewardPoints: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API calls
      setTimeout(() => {
        setStats({
          totalOrders: 24,
          wishlistItems: 8,
          totalSpent: 342.50,
          rewardPoints: 1250
        });

        setRecentOrders([
          {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'delivered',
            total: 28.50,
            items: 3,
            shop: 'Golden Grain Bakery'
          },
          {
            id: 'ORD-002',
            date: '2024-01-12',
            status: 'in-transit',
            total: 15.99,
            items: 2,
            shop: 'Sweet Dreams Bakery'
          },
          {
            id: 'ORD-003',
            date: '2024-01-10',
            status: 'delivered',
            total: 42.75,
            items: 5,
            shop: 'French Corner Bakery'
          }
        ]);

        setRecommendedProducts([
          {
            id: 1,
            name: 'Chocolate Chip Cookies',
            price: 12.99,
            image: '/api/placeholder/200/200',
            rating: 4.8,
            shop: 'Cookie Monster Bakery'
          },
          {
            id: 2,
            name: 'Fresh Croissants',
            price: 8.50,
            image: '/api/placeholder/200/200',
            rating: 4.9,
            shop: 'French Corner Bakery'
          },
          {
            id: 3,
            name: 'Blueberry Muffins',
            price: 15.99,
            image: '/api/placeholder/200/200',
            rating: 4.7,
            shop: 'Morning Glory Bakery'
          }
        ]);

        setFavoriteShops([
          {
            id: 1,
            name: 'Golden Grain Bakery',
            rating: 4.9,
            orders: 8,
            image: '/api/placeholder/100/100'
          },
          {
            id: 2,
            name: 'Sweet Dreams Bakery',
            rating: 4.8,
            orders: 5,
            image: '/api/placeholder/100/100'
          }
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
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-purple-100">
          Discover fresh bakery products and manage your orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reward Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rewardPoints}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/marketplace"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <ShoppingBag className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">Browse Products</span>
          </Link>

          <Link
            to="/buyer/orders"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <Package className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">My Orders</span>
          </Link>

          <Link
            to="/buyer/wishlist"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <Heart className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">Wishlist</span>
          </Link>

          <Link
            to="/buyer/profile"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-color hover:bg-purple-50 transition-colors"
          >
            <MapPin className="w-8 h-8 text-primary-color mb-2" />
            <span className="text-sm font-medium text-gray-700">Addresses</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/buyer/orders" className="text-primary-color hover:text-primary-dark text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.shop}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </div>
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

        {/* Favorite Shops */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Favorite Shops</h2>
            <Link to="/marketplace" className="text-primary-color hover:text-primary-dark text-sm">
              Explore More
            </Link>
          </div>

          <div className="space-y-4">
            {favoriteShops.map((shop) => (
              <div key={shop.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-color transition-colors">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{shop.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{shop.rating}</span>
                    <span className="text-sm text-gray-500">• {shop.orders} orders</span>
                  </div>
                </div>
                <Link
                  to={`/shop/${shop.id}`}
                  className="btn btn-sm btn-outline"
                >
                  Visit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
          <Link to="/marketplace" className="text-primary-color hover:text-primary-dark text-sm">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-color transition-colors">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.shop}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <span className="font-bold text-primary-color">${product.price}</span>
              </div>
              <button className="w-full mt-3 btn btn-sm btn-primary">
                <Plus className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
