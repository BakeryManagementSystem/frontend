import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
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
    // Simulate API call with mock data
    setTimeout(() => {
      setAnalyticsData({
        overview: {
          totalRevenue: 12450.75,
          totalOrders: 89,
          totalViews: 15420,
          conversionRate: 5.8,
          averageOrderValue: 139.90,
          totalProducts: 24,
          activeProducts: 20,
          lowStockProducts: 3
        },
        sales: {
          daily: [
            { date: '2024-01-01', revenue: 450, orders: 3 },
            { date: '2024-01-02', revenue: 680, orders: 5 },
            { date: '2024-01-03', revenue: 320, orders: 2 },
            { date: '2024-01-04', revenue: 890, orders: 6 },
            { date: '2024-01-05', revenue: 1200, orders: 8 },
            { date: '2024-01-06', revenue: 750, orders: 5 },
            { date: '2024-01-07', revenue: 920, orders: 7 }
          ],
          monthly: [
            { month: 'Jan', revenue: 8450, orders: 65 },
            { month: 'Feb', revenue: 9200, orders: 72 },
            { month: 'Mar', revenue: 11800, orders: 89 },
            { month: 'Apr', revenue: 12450, orders: 89 }
          ],
          byCategory: [
            { category: 'Electronics', revenue: 7800, percentage: 62.6 },
            { category: 'Accessories', revenue: 2900, percentage: 23.3 },
            { category: 'Audio', revenue: 1750, percentage: 14.1 }
          ]
        },
        products: {
          topSelling: [
            { id: 1, name: 'Premium Wireless Headphones', sales: 45, revenue: 8999.55 },
            { id: 2, name: 'Smart Home Camera', sales: 32, revenue: 2879.68 },
            { id: 3, name: 'Coffee Maker Pro', sales: 28, revenue: 4199.72 },
            { id: 4, name: 'Bluetooth Earbuds', sales: 15, revenue: 1199.85 },
            { id: 5, name: 'Wireless Charger', sales: 12, revenue: 359.88 }
          ],
          lowStock: [
            { id: 3, name: 'Coffee Maker Pro', stock: 2 },
            { id: 7, name: 'Phone Case Set', stock: 1 },
            { id: 12, name: 'Tablet Stand', stock: 3 }
          ]
        },
        customers: {
          newCustomers: 45,
          returningCustomers: 28,
          topCustomers: [
            { name: 'John Smith', orders: 8, spent: 1250.00 },
            { name: 'Sarah Johnson', orders: 6, spent: 890.50 },
            { name: 'Mike Wilson', orders: 5, spent: 750.25 }
          ],
          geography: [
            { location: 'California', customers: 23, percentage: 31.5 },
            { location: 'New York', customers: 18, percentage: 24.7 },
            { location: 'Texas', customers: 12, percentage: 16.4 },
            { location: 'Florida', customers: 10, percentage: 13.7 },
            { location: 'Others', customers: 10, percentage: 13.7 }
          ]
        }
      });
      setLoading(false);
    }, 1000);
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
            <button className="btn btn-outline">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign />
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-change positive">+12.5% vs last period</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <ShoppingCart />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.overview.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-change positive">+8.3% vs last period</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon views">
              <Eye />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.overview.totalViews.toLocaleString()}</div>
              <div className="stat-label">Shop Views</div>
              <div className="stat-change positive">+15.7% vs last period</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon conversion">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-value">{analyticsData.overview.conversionRate}%</div>
              <div className="stat-label">Conversion Rate</div>
              <div className="stat-change negative">-2.1% vs last period</div>
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
                    {analyticsData.sales.daily.slice(-7).map((day, index) => (
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
                    {analyticsData.sales.byCategory.map((category, index) => (
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
                    {analyticsData.customers.geography.map((location, index) => (
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
              {analyticsData.products.topSelling.map((product, index) => (
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
              <span className="alert-badge">{analyticsData.products.lowStock.length}</span>
            </div>
            <div className="low-stock-list">
              {analyticsData.products.lowStock.map(product => (
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
              {analyticsData.customers.topCustomers.map((customer, index) => (
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
                <div className="metric-value">{formatCurrency(analyticsData.overview.averageOrderValue)}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">New Customers</div>
                <div className="metric-value">{analyticsData.customers.newCustomers}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Returning Customers</div>
                <div className="metric-value">{analyticsData.customers.returningCustomers}</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Active Products</div>
                <div className="metric-value">{analyticsData.overview.activeProducts}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
