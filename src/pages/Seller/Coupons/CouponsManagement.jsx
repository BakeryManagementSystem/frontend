import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './CouponsManagement.css';

const CouponsManagement = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [filters, setFilters] = useState({ status: '' });

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    minimum_order_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    fetchCoupons();
  }, [filters]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/seller/coupons?${params.toString()}`);
      setCoupons(response.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        code: formData.code.toUpperCase(),
        discount_value: parseFloat(formData.discount_value),
        minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : null,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      };

      if (editingCoupon) {
        await api.put(`/seller/coupons/${editingCoupon.id}`, data);
      } else {
        await api.post('/seller/coupons', data);
      }

      fetchCoupons();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert(error.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await api.delete(`/seller/coupons/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
      minimum_order_amount: coupon.minimum_order_amount || '',
      max_discount_amount: coupon.max_discount_amount || '',
      usage_limit: coupon.usage_limit || '',
      description: coupon.description || '',
      status: coupon.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      start_date: '',
      end_date: '',
      minimum_order_amount: '',
      max_discount_amount: '',
      usage_limit: '',
      description: '',
      status: 'active',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'expired': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="coupons-management">
      <div className="coupons-header">
        <h1>Coupons Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setFilters({ status: '' })}
        >
          Clear Filters
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="coupons-grid">
        {loading ? (
          <div className="loading">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="no-data">No coupons found. Create your first coupon!</div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="coupon-card">
              <div className="coupon-header">
                <div className="coupon-code">{coupon.code}</div>
                <span className={`status-badge ${getStatusColor(coupon.status)}`}>
                  {coupon.status}
                </span>
              </div>

              <div className="coupon-body">
                <div className="discount-info">
                  <span className="discount-value">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}% OFF`
                      : `${formatCurrency(coupon.discount_value)} OFF`
                    }
                  </span>
                </div>

                {coupon.description && (
                  <p className="coupon-description">{coupon.description}</p>
                )}

                <div className="coupon-details">
                  {coupon.minimum_order_amount && (
                    <div className="detail-item">
                      <span className="label">Min. Order:</span>
                      <span className="value">{formatCurrency(coupon.minimum_order_amount)}</span>
                    </div>
                  )}
                  {coupon.max_discount_amount && coupon.discount_type === 'percentage' && (
                    <div className="detail-item">
                      <span className="label">Max. Discount:</span>
                      <span className="value">{formatCurrency(coupon.max_discount_amount)}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="label">Valid From:</span>
                    <span className="value">{new Date(coupon.start_date).toLocaleDateString()}</span>
                  </div>
                  {coupon.end_date && (
                    <div className="detail-item">
                      <span className="label">Valid Until:</span>
                      <span className="value">{new Date(coupon.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {coupon.usage_limit && (
                    <div className="detail-item">
                      <span className="label">Usage:</span>
                      <span className="value">{coupon.usage_count || 0} / {coupon.usage_limit}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="coupon-actions">
                <button
                  className="btn-action btn-edit"
                  onClick={() => handleEdit(coupon)}
                >
                  Edit
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(coupon.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SAVE20"
                    maxLength="50"
                    required
                  />
                  <small>Will be converted to uppercase</small>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'}
                    required
                  />
                  <small>{formData.discount_type === 'percentage' ? 'Enter percentage (0-100)' : 'Enter amount in $'}</small>
                </div>

                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    min={formData.start_date}
                  />
                  <small>Leave empty for no expiry</small>
                </div>

                <div className="form-group">
                  <label>Minimum Order Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData({ ...formData, minimum_order_amount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                {formData.discount_type === 'percentage' && (
                  <div className="form-group">
                    <label>Maximum Discount Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.max_discount_amount}
                      onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Unlimited"
                  />
                  <small>Leave empty for unlimited uses</small>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="Enter coupon description..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCoupon ? 'Update' : 'Create'} Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManagement;

