import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import ApiService from '../../../services/api';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Eye,
  ShoppingCart,
  Star,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import './SellerAnalytics.css';

const SellerAnalytics = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    sales: {},
    products: {},
    customers: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [activeChart, setActiveChart] = useState('sales');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch real analytics data from multiple endpoints with time range parameter
      const [dashboardData, orderStats, shopStats] = await Promise.all([
        ApiService.getSellerDashboard({ timeRange }),
        ApiService.getSellerOrderStats({ timeRange }),
        ApiService.getSellerShopStats({ timeRange })
      ]);

      // Extract data from responses (handle both wrapped and unwrapped formats)
      const dashboard = dashboardData.success ? dashboardData.data : dashboardData;
      const orders = orderStats.success ? orderStats.data : orderStats;
      const shop = shopStats.success ? shopStats.data : shopStats;

      // Access stats from dashboard (it's nested under 'stats' key)
      const stats = dashboard.stats || {};

      setAnalyticsData({
        overview: {
          totalRevenue: stats.totalRevenue || orders.total_revenue || 0,
          totalOrders: stats.totalOrders || orders.total_orders || 0,
          totalViews: shop.total_views || 0,
          conversionRate: ((stats.totalOrders || orders.total_orders || 0) / (shop.total_views || 1) * 100) || 0,
          averageOrderValue: orders.average_order_value || (stats.totalRevenue / (stats.totalOrders || 1)) || 0,
          totalProducts: stats.totalProducts || shop.total_products || 0,
          activeProducts: stats.totalProducts || shop.total_products || 0,
          lowStockProducts: stats.lowStockItems || 0,
          // Add percentage changes from API data
          revenueChange: 0,
          ordersChange: 0,
          viewsChange: 0,
          conversionRateChange: 0
        },
        sales: {
          daily: orders.daily_sales || [],
          monthly: orders.monthly_sales || [],
          byCategory: orders.sales_by_category || []
        },
        products: {
          topSelling: dashboard.topProducts || [],
          lowStock: []
        },
        customers: {
          newCustomers: 0,
          returningCustomers: 0,
          topCustomers: [],
          geography: []
        }
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      addNotification('Failed to load analytics data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (reportType = 'overview') => {
    try {
      await ApiService.exportAnalytics(timeRange, reportType);
      addNotification('Analytics report downloaded successfully!', 'success');
    } catch (error) {
      console.error('Failed to export analytics:', error);
      addNotification('Failed to export analytics report. Please try again.', 'error');
    }
  };

  const handlePreviewReport = async (reportType = 'overview') => {
    try {
      await ApiService.previewAnalytics(timeRange, reportType);
    } catch (error) {
      console.error('Failed to preview analytics:', error);
      addNotification('Failed to preview analytics report. Please try again.', 'error');
    }
  };

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '12months', label: 'Last 12 Months' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="seller-analytics">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Analytics Dashboard</h1>
            <p>Track your shop performance and sales metrics</p>
          </div>
          <div className="header-actions">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="export-dropdown">
              <button className="btn btn-outline" onClick={() => handleExportReport('overview')}>
                <Download size={16} />
                Export Overview
              </button>
              <button className="btn btn-primary" onClick={() => handleExportReport('detailed')}>
                <Download size={16} />
                Export Detailed
              </button>
              <button className="btn btn-ghost" onClick={() => handlePreviewReport('overview')}>
                <Eye size={16} />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign />
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(analyticsData.overview?.totalRevenue || 0)}</div>
              <div className="stat-label">Total Revenue</div>
              <div className={`stat-change ${(analyticsData.overview?.revenueChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                {(analyticsData.overview?.revenueChange || 0) >= 0 ? '+' : ''}{(analyticsData.overview?.revenueChange || 0).toFixed(1)}% vs last period
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <ShoppingCart />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.overview?.totalOrders || 0}</div>
              <div className="stat-label">Total Orders</div>
              <div className={`stat-change ${(analyticsData.overview?.ordersChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                {(analyticsData.overview?.ordersChange || 0) >= 0 ? '+' : ''}{(analyticsData.overview?.ordersChange || 0).toFixed(1)}% vs last period
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon views">
              <Eye />
            </div>
            <div className="stat-content">
              <div className="stat-value">{(analyticsData.overview?.totalViews || 0).toLocaleString()}</div>
              <div className="stat-label">Shop Views</div>
              <div className={`stat-change ${(analyticsData.overview?.viewsChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                {(analyticsData.overview?.viewsChange || 0) >= 0 ? '+' : ''}{(analyticsData.overview?.viewsChange || 0).toFixed(1)}% vs last period
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon conversion">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-value">{(analyticsData.overview?.conversionRate || 0).toFixed(1)}%</div>
              <div className="stat-label">Conversion Rate</div>
              <div className={`stat-change ${(analyticsData.overview?.conversionRateChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                {(analyticsData.overview?.conversionRateChange || 0) >= 0 ? '+' : ''}{(analyticsData.overview?.conversionRateChange || 0).toFixed(1)}% vs last period
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-header">
            <h2>Performance Charts</h2>
            <div className="chart-tabs">
              <button
                className={`chart-tab ${activeChart === 'sales' ? 'active' : ''}`}
                onClick={() => setActiveChart('sales')}
              >
                <LineChart size={16} />
                Sales Trend
              </button>
              <button
                className={`chart-tab ${activeChart === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveChart('categories')}
              >
                <PieChart size={16} />
                Categories
              </button>
              <button
                className={`chart-tab ${activeChart === 'geography' ? 'active' : ''}`}
                onClick={() => setActiveChart('geography')}
              >
                <BarChart3 size={16} />
                Geography
              </button>
            </div>
          </div>

          <div className="chart-container">
            {activeChart === 'sales' && (
              <div className="chart-placeholder">
                <LineChart size={48} />
                <p>Sales trend chart would be displayed here</p>
                <div className="chart-data">
                  <h4>Recent Sales Data:</h4>
                  <div className="data-points">
                    {(analyticsData.sales?.daily || []).slice(-7).map((day, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{new Date(day.date).toLocaleDateString()}</span>
                        <span className="revenue">{formatCurrency(day.revenue)}</span>
                        <span className="orders">{day.orders} orders</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChart === 'categories' && (
              <div className="chart-placeholder">
                <PieChart size={48} />
                <p>Category breakdown chart would be displayed here</p>
                <div className="chart-data">
                  <h4>Sales by Category:</h4>
                  <div className="category-breakdown">
                    {(analyticsData.sales?.byCategory || []).map((category, index) => (
                      <div key={index} className="category-item">
                        <span className="category-name">{category.category}</span>
                        <span className="category-revenue">{formatCurrency(category.revenue)}</span>
                        <span className="category-percentage">{category.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeChart === 'geography' && (
              <div className="chart-placeholder">
                <BarChart3 size={48} />
                <p>Geographic distribution chart would be displayed here</p>
                <div className="chart-data">
                  <h4>Customers by Location:</h4>
                  <div className="geography-breakdown">
                    {(analyticsData.customers?.geography || []).map((location, index) => (
                      <div key={index} className="location-item">
                        <span className="location-name">{location.location}</span>
                        <span className="location-customers">{location.customers} customers</span>
                        <span className="location-percentage">{location.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="detailed-analytics">
          {/* Top Products */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Top Selling Products</h3>
              <button className="btn btn-outline btn-sm">View All</button>
            </div>
            <div className="products-list">
              {(analyticsData.products?.topSelling || []).map((product, index) => (
                <div key={product.id} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      {product.sales} sold • {formatCurrency(product.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Low Stock Alert</h3>
              <span className="alert-badge">{(analyticsData.products?.lowStock || []).length}</span>
            </div>
            <div className="low-stock-list">
              {(analyticsData.products?.lowStock || []).map(product => (
                <div key={product.id} className="stock-item">
                  <div className="stock-info">
                    <div className="stock-name">{product.name}</div>
                    <div className="stock-level">Only {product.stock} left</div>
                  </div>
                  <button className="btn btn-primary btn-sm">Restock</button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Top Customers</h3>
              <button className="btn btn-outline btn-sm">View All</button>
            </div>
            <div className="customers-list">
              {(analyticsData.customers?.topCustomers || []).map((customer, index) => (
                <div key={index} className="customer-item">
                  <div className="customer-rank">#{index + 1}</div>
                  <div className="customer-info">
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-stats">
                      {customer.orders} orders • {formatCurrency(customer.spent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Key Metrics</h3>
            </div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-label">Average Order Value</div>
                <div className="metric-value">{formatCurrency(analyticsData.overview?.averageOrderValue || 0)}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">New Customers</div>
                <div className="metric-value">{analyticsData.customers?.newCustomers || 0}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Returning Customers</div>
                <div className="metric-value">{analyticsData.customers?.returningCustomers || 0}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Active Products</div>
                <div className="metric-value">{analyticsData.overview?.activeProducts || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
