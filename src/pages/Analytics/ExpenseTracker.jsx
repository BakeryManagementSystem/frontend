import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Filter,
  Calendar,
  Upload,
  Check,
  X,
  Moon,
  Sun,
  BarChart3,
  PieChart,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import './ExpenseTracker.css';

const ExpenseTracker = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: 'Office Supplies',
      amount: 150.50,
      category: 'Office',
      date: '2025-08-20',
      status: 'approved',
      receipt: null,
      type: 'expense'
    },
    {
      id: 2,
      description: 'Client Project Payment',
      amount: 2500.00,
      category: 'Revenue',
      date: '2025-08-22',
      status: 'approved',
      receipt: null,
      type: 'income'
    },
    {
      id: 3,
      description: 'Marketing Campaign',
      amount: 800.00,
      category: 'Marketing',
      date: '2025-08-21',
      status: 'pending',
      receipt: null,
      type: 'expense'
    }
  ]);

  const [categories] = useState([
    'Office', 'Marketing', 'Travel', 'Equipment', 'Software', 'Revenue', 'Consulting', 'Other'
  ]);

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    receipt: null
  });

  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Calculate financial metrics
  const totalIncome = expenses
    .filter(e => e.type === 'income' && e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter(e => e.type === 'expense' && e.status === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const profit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100) : 0;

  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;

  // Add new expense
  const addExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.category) {
      const expense = {
        id: expenses.length + 1,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        status: 'pending',
        receipt: newExpense.receipt
      };
      setExpenses([...expenses, expense]);
      setNewExpense({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        receipt: null
      });
      setActiveTab('expenses');
    }
  };

  // Update expense status
  const updateExpenseStatus = (id, status) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, status } : e
    ));
  };

  // Edit expense
  const startEditExpense = (expense) => {
    setEditingExpense({ ...expense });
  };

  const saveEditExpense = () => {
    if (editingExpense) {
      setExpenses(expenses.map(e => 
        e.id === editingExpense.id ? editingExpense : e
      ));
      setEditingExpense(null);
    }
  };

  const cancelEditExpense = () => {
    setEditingExpense(null);
  };

  // View expense details
  const viewExpenseDetails = (expense) => {
    setViewingExpense(expense);
  };

  const closeExpenseDetails = () => {
    setViewingExpense(null);
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Filter expenses with date range
  const filteredExpenses = expenses.filter(expense => {
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.status && expense.status !== filters.status) return false;
    if (filters.dateFrom && expense.date < filters.dateFrom) return false;
    if (filters.dateTo && expense.date > filters.dateTo) return false;
    return true;
  });

  // Generate category breakdown
  const categoryBreakdown = categories.map(category => {
    const categoryExpenses = expenses.filter(e => 
      e.category === category && e.type === 'expense' && e.status === 'approved'
    );
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    return { category, total, count: categoryExpenses.length };
  }).filter(item => item.total > 0);

  return (
    <div className="expense-tracker">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <DollarSign className="header-icon" />
            Expense Tracker
          </h1>
          <div className="header-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'add', label: 'Add Expense', icon: Plus },
            { id: 'expenses', label: 'Expenses', icon: FileText },
            { id: 'reports', label: 'Reports', icon: PieChart }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`nav-item ${activeTab === id ? 'nav-item-active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="main-content">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            {/* Financial Summary Cards */}
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-card-content">
                  <div className="summary-card-info">
                    <p className="summary-card-label">Total Income</p>
                    <p className="summary-card-value income">
                      ${totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="summary-card-icon income" size={24} />
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-card-content">
                  <div className="summary-card-info">
                    <p className="summary-card-label">Total Expenses</p>
                    <p className="summary-card-value expense">
                      ${totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <TrendingDown className="summary-card-icon expense" size={24} />
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-card-content">
                  <div className="summary-card-info">
                    <p className="summary-card-label">Net Profit</p>
                    <p className={`summary-card-value ${profit >= 0 ? 'income' : 'expense'}`}>
                      ${profit.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className={`summary-card-icon ${profit >= 0 ? 'income' : 'expense'}`} size={24} />
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-card-content">
                  <div className="summary-card-info">
                    <p className="summary-card-label">Pending Approvals</p>
                    <p className="summary-card-value pending">
                      {pendingExpenses}
                    </p>
                  </div>
                  <FileText className="summary-card-icon pending" size={24} />
                </div>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="card">
              <h3 className="card-title">Profit Margin Analysis</h3>
              <div className="profit-margin">
                <div className="profit-margin-content">
                  <div className="profit-margin-header">
                    <span>Profit Margin</span>
                    <span className={`profit-margin-value ${profitMargin >= 0 ? 'positive' : 'negative'}`}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-bar-fill ${profitMargin >= 0 ? 'positive' : 'negative'}`}
                      style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="card">
              <h3 className="card-title">Recent Expenses</h3>
              <div className="recent-expenses">
                {expenses.slice(0, 5).map(expense => (
                  <div key={expense.id} className="recent-expense-item">
                    <div className="recent-expense-info">
                      <p className="recent-expense-description">{expense.description}</p>
                      <p className="recent-expense-meta">{expense.category} • {expense.date}</p>
                    </div>
                    <div className="recent-expense-amount">
                      <p className={`amount ${expense.type === 'income' ? 'income' : 'expense'}`}>
                        {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                      </p>
                      <span className={`status-badge status-${expense.status}`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Expense Form */}
        {activeTab === 'add' && (
          <div className="add-expense-form">
            <h2 className="form-title">Add New Entry</h2>
            <div className="form-content">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  value={newExpense.type}
                  onChange={(e) => setNewExpense({...newExpense, type: e.target.value})}
                  className="form-input"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="form-input"
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Receipt Upload</label>
                <div className="upload-area">
                  <Upload className="upload-icon" size={24} />
                  <p className="upload-text">Drag & drop receipt or click to upload</p>
                  <input type="file" className="upload-input" accept="image/*" />
                </div>
              </div>

              <button
                onClick={addExpense}
                className="submit-button"
              >
                <Plus size={18} />
                Add {newExpense.type === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          </div>
        )}

        {/* Expenses List */}
        {activeTab === 'expenses' && (
          <div className="expenses-list">
            {/* Filters */}
            <div className="filters">
              <div className="filters-header">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="filter-toggle"
                >
                  <Filter size={18} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button
                  onClick={() => setFilters({ category: '', status: '', dateFrom: '', dateTo: '' })}
                  className="clear-filters-button"
                >
                  Clear All Filters
                </button>
              </div>
              
              {showFilters && (
                <div className="filters-content">
                  <div className="filter-group">
                    <label className="filter-label">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="form-input"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="form-input"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">
                      <Calendar size={16} />
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      className="form-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">
                      <Calendar size={16} />
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Expenses Table */}
            <div className="expenses-table-container">
              <div className="expenses-table-wrapper">
                <table className="expenses-table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-th">Description</th>
                      <th className="table-th">Category</th>
                      <th className="table-th">Amount</th>
                      <th className="table-th">Date</th>
                      <th className="table-th">Status</th>
                      <th className="table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(expense => (
                      <tr key={expense.id} className="table-row">
                        <td className="table-td">
                          <div>
                            <p className="expense-description">{expense.description}</p>
                            <p className="expense-type">{expense.type}</p>
                          </div>
                        </td>
                        <td className="table-td">{expense.category}</td>
                        <td className="table-td">
                          <span className={`expense-amount ${expense.type}`}>
                            {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="table-td">{expense.date}</td>
                        <td className="table-td">
                          <span className={`status-badge status-${expense.status}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="table-td">
                          <div className="action-buttons">
                            <button
                              onClick={() => viewExpenseDetails(expense)}
                              className="action-button view"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => startEditExpense(expense)}
                              className="action-button edit"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            {expense.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateExpenseStatus(expense.id, 'approved')}
                                  className="action-button approve"
                                  title="Approve"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => updateExpenseStatus(expense.id, 'rejected')}
                                  className="action-button reject"
                                  title="Reject"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="action-button delete"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="reports">
            {/* Report Summary */}
            <div className="card">
              <div className="report-header">
                <h2 className="card-title">Financial Reports</h2>
                <button className="export-button">
                  <Download size={18} />
                  Export Report
                </button>
              </div>

              <div className="report-summary">
                <div className="report-metric">
                  <h3 className="metric-title">Total Transactions</h3>
                  <p className="metric-value primary">{expenses.length}</p>
                </div>
                <div className="report-metric">
                  <h3 className="metric-title">Average Expense</h3>
                  <p className="metric-value secondary">
                    ${totalExpenses > 0 ? (totalExpenses / expenses.filter(e => e.type === 'expense').length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="report-metric">
                  <h3 className="metric-title">Profit Margin</h3>
                  <p className={`metric-value ${profitMargin >= 0 ? 'income' : 'expense'}`}>
                    {profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card">
              <h3 className="card-title">Expense Breakdown by Category</h3>
              <div className="category-breakdown">
                {categoryBreakdown.map(item => (
                  <div key={item.category} className="category-item">
                    <div className="category-info">
                      <div className="category-color"></div>
                      <span className="category-name">{item.category}</span>
                      <span className="category-count">({item.count} transactions)</span>
                    </div>
                    <span className="category-amount">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Edit Expense</h3>
              <button onClick={cancelEditExpense} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    value={editingExpense.type}
                    onChange={(e) => setEditingExpense({...editingExpense, type: e.target.value})}
                    className="form-input"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    value={editingExpense.description}
                    onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingExpense.amount}
                      onChange={(e) => setEditingExpense({...editingExpense, amount: parseFloat(e.target.value)})}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={editingExpense.category}
                      onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})}
                      className="form-input"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={editingExpense.date}
                    onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={cancelEditExpense} className="modal-button secondary">
                Cancel
              </button>
              <button onClick={saveEditExpense} className="modal-button primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Expense Details Modal */}
      {viewingExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Expense Details</h3>
              <button onClick={closeExpenseDetails} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="expense-details">
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className={`detail-value ${viewingExpense.type}`}>
                    {viewingExpense.type.charAt(0).toUpperCase() + viewingExpense.type.slice(1)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{viewingExpense.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className={`detail-value ${viewingExpense.type} amount-large`}>
                    {viewingExpense.type === 'income' ? '+' : '-'}${viewingExpense.amount.toFixed(2)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{viewingExpense.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(viewingExpense.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${viewingExpense.status}`}>
                    {viewingExpense.status.charAt(0).toUpperCase() + viewingExpense.status.slice(1)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">ID: {viewingExpense.id}</span>
                </div>
                {viewingExpense.receipt && (
                  <div className="detail-row">
                    <span className="detail-label">Receipt:</span>
                    <span className="detail-value">Attached</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                closeExpenseDetails();
                startEditExpense(viewingExpense);
              }} className="modal-button secondary">
                <Edit size={16} />
                Edit
              </button>
              <button onClick={closeExpenseDetails} className="modal-button primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;