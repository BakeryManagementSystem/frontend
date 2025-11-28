import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './InventoryTransactions.css';

const InventoryTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    ingredient_id: '',
    transaction_type: '',
    start_date: '',
    end_date: '',
  });

  const [formData, setFormData] = useState({
    ingredient_id: '',
    transaction_type: 'purchase',
    quantity: '',
    unit_price: '',
    notes: '',
  });

  const transactionTypes = [
    { value: 'purchase', label: 'Purchase', icon: '📦', color: 'green' },
    { value: 'usage', label: 'Usage', icon: '🔨', color: 'orange' },
    { value: 'adjustment', label: 'Adjustment', icon: '⚖️', color: 'blue' },
    { value: 'waste', label: 'Waste', icon: '🗑️', color: 'red' },
    { value: 'return', label: 'Return', icon: '↩️', color: 'gold' },
  ];

  useEffect(() => {
    fetchIngredients();
    fetchTransactions();
    fetchStats();
  }, [filters]);

  const fetchIngredients = async () => {
    try {
      const response = await api.get('/ingredients');
      setIngredients(response.data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.ingredient_id) params.append('ingredient_id', filters.ingredient_id);
      if (filters.transaction_type) params.append('transaction_type', filters.transaction_type);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await api.get(`/inventory-transactions?${params.toString()}`);
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await api.get(`/inventory-transactions/stats?${params.toString()}`);
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ingredient_id: parseInt(formData.ingredient_id),
        transaction_type: formData.transaction_type,
        quantity: parseFloat(formData.quantity),
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
        notes: formData.notes,
      };

      await api.post('/inventory-transactions', data);

      fetchTransactions();
      fetchStats();
      fetchIngredients(); // Refresh to get updated stock
      handleCloseModal();
    } catch (error) {
      console.error('Error recording transaction:', error);
      alert(error.message || 'Failed to record transaction');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      ingredient_id: '',
      transaction_type: 'purchase',
      quantity: '',
      unit_price: '',
      notes: '',
    });
  };

  const getTransactionTypeInfo = (type) => {
    return transactionTypes.find(t => t.value === type) || transactionTypes[0];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="inventory-transactions">
      <div className="transactions-header">
        <h1>Inventory Transactions</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Record Transaction
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card purchases">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Total Purchases</h3>
              <p className="stat-value">{formatCurrency(stats.total_purchases || 0)}</p>
            </div>
          </div>
          <div className="stat-card usage">
            <div className="stat-icon">🔨</div>
            <div className="stat-content">
              <h3>Total Usage</h3>
              <p className="stat-value">{formatCurrency(stats.total_usage || 0)}</p>
            </div>
          </div>
          <div className="stat-card waste">
            <div className="stat-icon">🗑️</div>
            <div className="stat-content">
              <h3>Total Waste</h3>
              <p className="stat-value">{formatCurrency(stats.total_waste || 0)}</p>
            </div>
          </div>
          <div className="stat-card transactions">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Transactions</h3>
              <p className="stat-value">{stats.transaction_count || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Ingredient</label>
          <select
            value={filters.ingredient_id}
            onChange={(e) => setFilters({ ...filters, ingredient_id: e.target.value })}
          >
            <option value="">All Ingredients</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} (Stock: {ing.current_stock} {ing.unit})
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Transaction Type</label>
          <select
            value={filters.transaction_type}
            onChange={(e) => setFilters({ ...filters, transaction_type: e.target.value })}
          >
            <option value="">All Types</option>
            {transactionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
          />
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setFilters({ ingredient_id: '', transaction_type: '', start_date: '', end_date: '' })}
        >
          Clear Filters
        </button>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table-container">
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="no-data">No transactions found</div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Cost</th>
                <th>Notes</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const typeInfo = getTransactionTypeInfo(transaction.transaction_type);
                return (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.transaction_date).toLocaleString()}</td>
                    <td>
                      <span className={`type-badge ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                    </td>
                    <td>{transaction.ingredient?.name || 'N/A'}</td>
                    <td className="quantity">
                      {transaction.quantity} {transaction.ingredient?.unit || ''}
                    </td>
                    <td>{transaction.unit_price ? formatCurrency(transaction.unit_price) : '-'}</td>
                    <td className="total-cost">{formatCurrency(transaction.total_cost || 0)}</td>
                    <td>{transaction.notes || '-'}</td>
                    <td>{transaction.user?.name || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record New Transaction</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Ingredient *</label>
                  <select
                    value={formData.ingredient_id}
                    onChange={(e) => {
                      const ingredient = ingredients.find(i => i.id === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        ingredient_id: e.target.value,
                        unit_price: ingredient?.current_unit_price || ''
                      });
                    }}
                    required
                  >
                    <option value="">Select Ingredient</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} - Current Stock: {ing.current_stock} {ing.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction Type *</label>
                  <select
                    value={formData.transaction_type}
                    onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                    required
                  >
                    {transactionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  <small>
                    {formData.transaction_type === 'purchase' && '📦 Increases stock'}
                    {formData.transaction_type === 'usage' && '🔨 Decreases stock'}
                    {formData.transaction_type === 'adjustment' && '⚖️ Can increase or decrease'}
                    {formData.transaction_type === 'waste' && '🗑️ Decreases stock'}
                    {formData.transaction_type === 'return' && '↩️ Increases stock'}
                  </small>
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    required
                  />
                  <small>
                    {formData.transaction_type === 'adjustment'
                      ? 'Use positive for increase, negative for decrease'
                      : 'Enter positive number'
                    }
                  </small>
                </div>

                <div className="form-group">
                  <label>Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    placeholder="Auto-filled from ingredient"
                  />
                  <small>Leave empty to use current ingredient price</small>
                </div>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    placeholder="Add any additional notes..."
                  />
                </div>

                {formData.quantity && formData.unit_price && (
                  <div className="form-group full-width">
                    <div className="cost-preview">
                      <strong>Estimated Total Cost:</strong>
                      <span className="cost-amount">
                        {formatCurrency(Math.abs(parseFloat(formData.quantity)) * parseFloat(formData.unit_price))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTransactions;
