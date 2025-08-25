import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  Maximize2,
  X,
  Moon,
  Sun,
  FileText,
  TrendingDown
} from 'lucide-react';
import './dashboard.css';

const AnalyticsDashboard = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Dashboard state
  const [dateRange, setDateRange] = useState({
    start: '2024-07-01',
    end: '2024-08-24'
  });
  
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'orders', 'customers']);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [expandedChart, setExpandedChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample data for charts
  const [salesData, setSalesData] = useState([
    { date: '2024-07-01', revenue: 12450, orders: 145, customers: 89, avgOrderValue: 85.86 },
    { date: '2024-07-08', revenue: 15320, orders: 189, customers: 112, avgOrderValue: 81.06 },
    { date: '2024-07-15', revenue: 18940, orders: 234, customers: 156, avgOrderValue: 80.94 },
    { date: '2024-07-22', revenue: 16780, orders: 203, customers: 134, avgOrderValue: 82.66 },
    { date: '2024-07-29', revenue: 21560, orders: 267, customers: 178, avgOrderValue: 80.75 },
    { date: '2024-08-05', revenue: 19230, orders: 243, customers: 167, avgOrderValue: 79.14 },
    { date: '2024-08-12', revenue: 24680, orders: 312, customers: 203, avgOrderValue: 79.10 },
    { date: '2024-08-19', revenue: 22150, orders: 278, customers: 189, avgOrderValue: 79.68 }
  ]);

  const [productData, setProductData] = useState([
    { product: 'Laptop Pro', sales: 2450, units: 45, revenue: 110250, margin: 15.2 },
    { product: 'Smartphone X', sales: 3200, units: 128, revenue: 409600, margin: 22.8 },
    { product: 'Tablet Plus', sales: 1890, units: 67, revenue: 126630, margin: 18.5 },
    { product: 'Headphones', sales: 4320, units: 216, revenue: 86400, margin: 35.4 },
    { product: 'Smart Watch', sales: 2160, units: 72, revenue: 155520, margin: 28.1 },
    { product: 'Gaming Console', sales: 1560, units: 26, revenue: 124800, margin: 12.3 }
  ]);

  const [revenueBreakdown, setRevenueBreakdown] = useState([
    { category: 'Electronics', value: 450000, color: '#3b82f6', percentage: 37.5 },
    { category: 'Clothing', value: 280000, color: '#10b981', percentage: 23.3 },
    { category: 'Home & Garden', value: 195000, color: '#f59e0b', percentage: 16.3 },
    { category: 'Sports', value: 160000, color: '#ef4444', percentage: 13.3 },
    { category: 'Books', value: 85000, color: '#8b5cf6', percentage: 7.1 },
    { category: 'Other', value: 30000, color: '#6b7280', percentage: 2.5 }
  ]);

  const [monthlyComparison, setMonthlyComparison] = useState([
    { month: 'Jan', current: 89000, previous: 76000, growth: 17.1 },
    { month: 'Feb', current: 95000, previous: 82000, growth: 15.9 },
    { month: 'Mar', current: 112000, previous: 89000, growth: 25.8 },
    { month: 'Apr', current: 108000, previous: 94000, growth: 14.9 },
    { month: 'May', current: 125000, previous: 102000, growth: 22.5 },
    { month: 'Jun', current: 138000, previous: 115000, growth: 20.0 },
    { month: 'Jul', current: 142000, previous: 128000, growth: 10.9 },
    { month: 'Aug', current: 156000, previous: 134000, growth: 16.4 }
  ]);

  // Calculate key metrics with error handling
  const calculateMetrics = useCallback(() => {
    try {
      const totalRevenue = salesData.reduce((sum, item) => sum + (item?.revenue || 0), 0);
      const totalOrders = salesData.reduce((sum, item) => sum + (item?.orders || 0), 0);
      const totalCustomers = salesData.reduce((sum, item) => sum + (item?.customers || 0), 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate growth rates
      const recentData = salesData.slice(-2);
      const revenueGrowth = recentData.length === 2 ? 
        ((recentData[1]?.revenue - recentData[0]?.revenue) / recentData[0]?.revenue) * 100 : 0;
      const ordersGrowth = recentData.length === 2 ? 
        ((recentData[1]?.orders - recentData[0]?.orders) / recentData[0]?.orders) * 100 : 0;
      const customersGrowth = recentData.length === 2 ? 
        ((recentData[1]?.customers - recentData[0]?.customers) / recentData[0]?.customers) * 100 : 0;
      const aovGrowth = recentData.length === 2 ? 
        ((recentData[1]?.avgOrderValue - recentData[0]?.avgOrderValue) / recentData[0]?.avgOrderValue) * 100 : 0;

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        avgOrderValue,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        aovGrowth
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        customersGrowth: 0,
        aovGrowth: 0
      };
    }
  }, [salesData]);

  const metrics = calculateMetrics();

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setIsLoading(true);
      
      setTimeout(() => {
        setSalesData(prev => {
          const lastDate = new Date(prev[prev.length - 1]?.date || '2024-08-24');
          const newDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          const baseRevenue = 15000;
          const baseOrders = 200;
          const baseCustomers = 150;
          
          const newRevenue = baseRevenue + Math.floor(Math.random() * 10000);
          const newOrders = baseOrders + Math.floor(Math.random() * 100);
          const newCustomers = baseCustomers + Math.floor(Math.random() * 50);
          
          const newDataPoint = {
            date: newDate.toISOString().split('T')[0],
            revenue: newRevenue,
            orders: newOrders,
            customers: newCustomers,
            avgOrderValue: newRevenue / newOrders
          };

          return [...prev.slice(-7), newDataPoint];
        });
        
        setIsLoading(false);
      }, 1000);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleExport = useCallback((format) => {
    setIsLoading(true);
    setTimeout(() => {
      const data = {
        metrics,
        salesData,
        productData,
        revenueBreakdown,
        monthlyComparison,
        dateRange
      };
      
      // Simulate file generation
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-dashboard-${format.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
      alert(`Dashboard data exported as ${format}!`);
    }, 1500);
  }, [metrics, salesData, productData, revenueBreakdown, monthlyComparison, dateRange]);

  const handleDateRangeChange = useCallback((start, end) => {
    setDateRange({ start, end });
    setIsLoading(true);
    
    // Simulate data filtering
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const generateReport = useCallback((reportType) => {
    setIsLoading(true);
    setTimeout(() => {
      const reportData = {
        type: reportType,
        generatedAt: new Date().toISOString(),
        dateRange,
        data: reportType === 'weekly' ? salesData : 
              reportType === 'monthly' ? monthlyComparison : productData
      };
      
      alert(`${reportType} report generated successfully!`);
      console.log('Report data:', reportData);
      setIsLoading(false);
    }, 2000);
  }, [salesData, monthlyComparison, productData, dateRange]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Components
  const MetricCard = ({ title, value, icon: Icon, change, prefix = '', suffix = '' }) => (
    <div className={`metric-card ${isDarkMode ? 'dark' : ''}`}>
      <div className="metric-content">
        <div className={`metric-icon ${change >= 0 ? 'positive' : 'negative'}`}>
          <Icon size={24} />
        </div>
        <div className="metric-details">
          <p className="metric-title">{title}</p>
          <p className="metric-value">
            {prefix}{typeof value === 'number' ? value.toLocaleString(undefined, {
              minimumFractionDigits: prefix === '$' && value < 1000 ? 2 : 0,
              maximumFractionDigits: prefix === '$' && value < 1000 ? 2 : 0
            }) : value}{suffix}
          </p>
          {change !== undefined && (
            <p className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
              {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(change).toFixed(1)}% from last period
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const ChartContainer = ({ title, children, onExpand, expanded = false, loading = false }) => (
    <div className={`chart-container ${expanded ? 'expanded' : ''} ${isDarkMode ? 'dark' : ''}`}>
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-controls">
          {loading && <div className="loading-spinner" />}
          <button 
            onClick={onExpand}
            className={`chart-expand-btn ${isDarkMode ? 'dark' : ''}`}
          >
            {expanded ? <X size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
      <div className={`chart-content ${expanded ? 'expanded-content' : ''}`}>
        {children}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`custom-tooltip ${isDarkMode ? 'dark' : ''}`}>
          <p className="tooltip-label">{label}</p>
          {payload.map((pld, index) => (
            <p key={index} style={{ color: pld.color }} className="tooltip-item">
              {pld.name}: {typeof pld.value === 'number' ? pld.value.toLocaleString() : pld.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className={`dashboard-header ${isDarkMode ? 'dark' : ''}`}>
        <div className="header-container">
          <div className="header-content">
            <div className="header-title">
              <h1>Analytics Dashboard</h1>
              <p>Real-time insights and performance metrics</p>
            </div>
            
            {/* Controls */}
            <div className="header-controls">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Date Range Selector */}
              <div className={`date-range-selector ${isDarkMode ? 'dark' : ''}`}>
                <Calendar size={18} />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange(e.target.value, dateRange.end)}
                  className={`date-input ${isDarkMode ? 'dark' : ''}`}
                />
                <span className="date-separator">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange(dateRange.start, e.target.value)}
                  className={`date-input ${isDarkMode ? 'dark' : ''}`}
                />
              </div>

              {/* Auto Refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`refresh-toggle ${autoRefresh ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
                title="Toggle auto refresh"
              >
                <RefreshCw size={18} className={autoRefresh ? 'spinning' : ''} />
                <span>Auto Refresh</span>
              </button>

              {/* Export Options */}
              <div className="export-container">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleExport(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className={`export-select ${isDarkMode ? 'dark' : ''}`}
                  defaultValue=""
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    <Download size={14} /> Export
                  </option>
                  <option value="PDF">Export as PDF</option>
                  <option value="Excel">Export as Excel</option>
                  <option value="CSV">Export as CSV</option>
                  <option value="JSON">Export as JSON</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner large" />
            <p>Loading...</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            icon={DollarSign}
            change={metrics.revenueGrowth}
            prefix="$"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            icon={ShoppingCart}
            change={metrics.ordersGrowth}
          />
          <MetricCard
            title="Total Customers"
            value={metrics.totalCustomers}
            icon={Users}
            change={metrics.customersGrowth}
          />
          <MetricCard
            title="Avg Order Value"
            value={metrics.avgOrderValue}
            icon={TrendingUp}
            change={metrics.aovGrowth}
            prefix="$"
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid-top">
          {/* Sales Trend Chart */}
          <ChartContainer 
            title="Sales Trend Analysis"
            onExpand={() => setExpandedChart(expandedChart === 'sales' ? null : 'sales')}
            expanded={expandedChart === 'sales'}
            loading={isLoading && autoRefresh}
          >
            <ResponsiveContainer width="100%" height={expandedChart === 'sales' ? 400 : 300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Revenue ($)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Orders"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Product Performance Chart */}
          <ChartContainer 
            title="Product Performance"
            onExpand={() => setExpandedChart(expandedChart === 'products' ? null : 'products')}
            expanded={expandedChart === 'products'}
          >
            <ResponsiveContainer width="100%" height={expandedChart === 'products' ? 400 : 300}>
              <BarChart data={productData} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="product" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="units" fill="#10b981" name="Units Sold" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="charts-grid-bottom">
          {/* Revenue Breakdown Pie Chart */}
          <ChartContainer 
            title="Revenue by Category"
            onExpand={() => setExpandedChart(expandedChart === 'revenue' ? null : 'revenue')}
            expanded={expandedChart === 'revenue'}
          >
            <ResponsiveContainer width="100%" height={expandedChart === 'revenue' ? 400 : 300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={expandedChart === 'revenue' ? 120 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                  labelFormatter={() => 'Revenue'}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Monthly Comparison Chart */}
          <ChartContainer 
            title="Monthly Comparison (Current vs Previous Year)"
            onExpand={() => setExpandedChart(expandedChart === 'monthly' ? null : 'monthly')}
            expanded={expandedChart === 'monthly'}
          >
            <ResponsiveContainer width="100%" height={expandedChart === 'monthly' ? 400 : 300}>
              <AreaChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="month"
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stackId="1"
                  stroke="#6b7280"
                  fill="url(#colorPrevious)"
                  name="Previous Year ($)"
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="url(#colorCurrent)"
                  name="Current Year ($)"
                />
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Reports Section */}
        <div className={`reports-section ${isDarkMode ? 'dark' : ''}`}>
          <div className="reports-header">
            <h3>Sales Reports</h3>
            <p>Generate detailed reports for specific time periods</p>
          </div>
          <div className="reports-content">
            <div className="reports-grid">
              <div className={`report-card ${isDarkMode ? 'dark' : ''}`}>
                <div className="report-icon">
                  <FileText size={32} />
                </div>
                <h4>Weekly Sales Report</h4>
                <p>Detailed breakdown of weekly performance metrics including trends and insights</p>
                <button 
                  className={`report-btn ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => generateReport('weekly')}
                  disabled={isLoading}
                >
                  Generate Report
                </button>
              </div>
              <div className={`report-card ${isDarkMode ? 'dark' : ''}`}>
                <div className="report-icon">
                  <BarChart3 size={32} />
                </div>
                <h4>Monthly Summary</h4>
                <p>Comprehensive monthly analysis with comparisons and growth metrics</p>
                <button 
                  className={`report-btn ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => generateReport('monthly')}
                  disabled={isLoading}
                >
                  Generate Report
                </button>
              </div>
              <div className={`report-card ${isDarkMode ? 'dark' : ''}`}>
                <div className="report-icon">
                  <TrendingUp size={32} />
                </div>
                <h4>Product Analysis</h4>
                <p>In-depth product performance analysis with profitability insights</p>
                <button 
                  className={`report-btn ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => generateReport('product')}
                  disabled={isLoading}
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for expanded charts */}
      {expandedChart && (
        <div className="chart-overlay" onClick={() => setExpandedChart(null)} />
      )}
    </div>
  );
};

export default AnalyticsDashboard;