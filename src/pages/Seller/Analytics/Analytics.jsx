import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchAnalytics = async () => {
      setTimeout(() => {
        setAnalyticsData({
          overview: {
            totalRevenue: 12540.50,
            revenueChange: 12.5,
            totalOrders: 156,
            ordersChange: 8.3,
            averageOrderValue: 80.39,
            aovChange: -2.1,
            customerCount: 89,
            customerChange: 15.7
          },
          salesChart: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [1200, 1450, 980, 1680, 2100, 2800, 2330]
          },
          topProducts: [
            { name: 'Artisan Sourdough Bread', sales: 45, revenue: 404.55, growth: 12.5 },
            { name: 'Chocolate Croissants', sales: 38, revenue: 133.00, growth: -5.2 },
            { name: 'Red Velvet Cake', sales: 28, revenue: 699.72, growth: 25.8 },
            { name: 'Blueberry Muffins', sales: 32, revenue: 415.68, growth: 8.7 },
            { name: 'French Baguette', sales: 67, revenue: 301.50, growth: -12.3 }
          ],
          categoryBreakdown: [
            { category: 'Bread', percentage: 35, revenue: 4389.18 },
            { category: 'Cakes', percentage: 28, revenue: 3511.34 },
            { category: 'Pastries', percentage: 22, revenue: 2758.91 },
            { category: 'Muffins', percentage: 15, revenue: 1881.08 }
          ],
          customerInsights: {
            newCustomers: 23,
            returningCustomers: 66,
            customerRetentionRate: 74.2,
            averageLifetimeValue: 245.80
          },
          recentActivity: [
            { type: 'order', description: 'New order #ORD-2024-156', time: '2 minutes ago', value: '+$28.50' },
            { type: 'customer', description: 'New customer registration', time: '15 minutes ago', value: null },
            { type: 'product', description: 'Chocolate Cake went out of stock', time: '1 hour ago', value: null },
            { type: 'order', description: 'Order #ORD-2024-155 completed', time: '2 hours ago', value: '+$42.75' },
            { type: 'review', description: 'New 5-star review received', time: '3 hours ago', value: null }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [timeRange]);

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analyticsData.overview.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {getChangeIcon(analyticsData.overview.revenueChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.revenueChange)}`}>
                  {Math.abs(analyticsData.overview.revenueChange)}%
                </span>
                <span className="text-sm text-gray-500">vs last {timeRange}</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalOrders}</p>
              <div className="flex items-center space-x-1 mt-1">
                {getChangeIcon(analyticsData.overview.ordersChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.ordersChange)}`}>
                  {Math.abs(analyticsData.overview.ordersChange)}%
                </span>
                <span className="text-sm text-gray-500">vs last {timeRange}</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analyticsData.overview.averageOrderValue}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {getChangeIcon(analyticsData.overview.aovChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.aovChange)}`}>
                  {Math.abs(analyticsData.overview.aovChange)}%
                </span>
                <span className="text-sm text-gray-500">vs last {timeRange}</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.customerCount}</p>
              <div className="flex items-center space-x-1 mt-1">
                {getChangeIcon(analyticsData.overview.customerChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.customerChange)}`}>
                  {Math.abs(analyticsData.overview.customerChange)}%
                </span>
                <span className="text-sm text-gray-500">vs last {timeRange}</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Daily Sales</span>
            </div>
          </div>

          {/* Simple Bar Chart Representation */}
          <div className="space-y-3">
            {analyticsData.salesChart.labels.map((day, index) => (
              <div key={day} className="flex items-center space-x-3">
                <div className="w-12 text-sm text-gray-600">{day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-gradient-to-r from-primary-color to-primary-light h-6 rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${(analyticsData.salesChart.data[index] / Math.max(...analyticsData.salesChart.data)) * 100}%`
                    }}
                  >
                    <span className="text-white text-xs font-medium">
                      ${analyticsData.salesChart.data[index]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analyticsData.categoryBreakdown.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: ['#6639a6', '#7f4fc3', '#9b75d0', '#b794d9'][index]
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${category.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <Package className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-color text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${product.revenue}</p>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(product.growth)}
                    <span className={`text-xs ${getChangeColor(product.growth)}`}>
                      {Math.abs(product.growth)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Customer Insights</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData.customerInsights.newCustomers}
                </p>
                <p className="text-sm text-gray-600">New Customers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData.customerInsights.returningCustomers}
                </p>
                <p className="text-sm text-gray-600">Returning</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="font-medium text-gray-900">
                  {analyticsData.customerInsights.customerRetentionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${analyticsData.customerInsights.customerRetentionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Avg Lifetime Value</p>
              <p className="text-xl font-bold text-purple-600">
                ${analyticsData.customerInsights.averageLifetimeValue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-green-100' :
                  activity.type === 'customer' ? 'bg-blue-100' :
                  activity.type === 'product' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-green-600" />}
                  {activity.type === 'customer' && <Users className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'product' && <Package className="w-4 h-4 text-yellow-600" />}
                  {activity.type === 'review' && <Activity className="w-4 h-4 text-purple-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              {activity.value && (
                <span className="text-sm font-medium text-green-600">{activity.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Schedule Report</h3>
          <p className="text-sm text-gray-500 mb-4">Set up automated analytics reports</p>
          <button className="btn btn-secondary btn-sm">Configure</button>
        </div>

        <div className="card text-center">
          <Download className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
          <p className="text-sm text-gray-500 mb-4">Download detailed analytics data</p>
          <button className="btn btn-secondary btn-sm">Export CSV</button>
        </div>

        <div className="card text-center">
          <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Custom Dashboard</h3>
          <p className="text-sm text-gray-500 mb-4">Create personalized analytics view</p>
          <button className="btn btn-secondary btn-sm">Customize</button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
