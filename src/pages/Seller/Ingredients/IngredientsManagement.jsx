import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../../services/api';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  DollarSign,
  Package,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import './IngredientsManagement.css';

const IngredientsManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientBatches, setIngredientBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [stats, setStats] = useState({
    totalIngredients: 0,
    totalInvestment: 0,
    monthlySpent: 0,
    averageCostPerUnit: 0
  });

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    unit: 'gram',
    current_unit_price: ''
  });

  const [newBatch, setNewBatch] = useState({
    category: '',
    period_start: '',
    period_end: '',
    notes: '',
    items: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ingredientsRes, batchesRes] = await Promise.all([
        ApiService.getIngredients(),
        ApiService.getIngredientBatches()
      ]);

      setIngredients(ingredientsRes.data || []);
      setIngredientBatches(batchesRes.data || []);

      // Calculate stats
      const totalIngredients = ingredientsRes.data?.length || 0;
      const totalInvestment = batchesRes.data?.reduce((sum, batch) => sum + (batch.total_cost || 0), 0) || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlySpent = batchesRes.data?.filter(batch => {
        const batchDate = new Date(batch.created_at);
        return batchDate.getMonth() === currentMonth && batchDate.getFullYear() === currentYear;
      }).reduce((sum, batch) => sum + (batch.total_cost || 0), 0) || 0;

      const avgCost = totalIngredients > 0 ? (ingredientsRes.data?.reduce((sum, ing) => sum + (ing.current_unit_price || 0), 0) / totalIngredients) : 0;

      setStats({
        totalIngredients,
        totalInvestment,
        monthlySpent,
        averageCostPerUnit: avgCost
      });

    } catch (error) {
      console.error('Failed to fetch ingredients data:', error);
      setError('Failed to load ingredients data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createIngredient({
        ...newIngredient,
        current_unit_price: parseFloat(newIngredient.current_unit_price)
      });

      setNewIngredient({ name: '', unit: 'gram', current_unit_price: '' });
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add ingredient:', error);
      setError('Failed to add ingredient. Please try again.');
    }
  };

  const handleUpdateIngredient = async (e) => {
    e.preventDefault();
    try {
      await ApiService.updateIngredient(editingIngredient.id, {
        unit: editingIngredient.unit,
        current_unit_price: parseFloat(editingIngredient.current_unit_price)
      });

      setEditingIngredient(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update ingredient:', error);
      setError('Failed to update ingredient. Please try again.');
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;

    try {
      await ApiService.deleteIngredient(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
      setError('Failed to delete ingredient. Please try again.');
    }
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unitOptions = [
    'gram', 'kg', 'pound', 'ounce', 'liter', 'ml', 'cup', 'tablespoon', 'teaspoon', 'piece'
  ];

  return (
    <div className="ingredients-management">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Ingredients Management</h1>
            <p>Manage your ingredients and track your investment costs</p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-outline"
              onClick={() => setShowBatchModal(true)}
            >
              <Package size={18} />
              Add Batch
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} />
              Add Ingredient
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Package />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalIngredients}</div>
              <div className="stat-label">Total Ingredients</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <DollarSign />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalInvestment.toFixed(2)}</div>
              <div className="stat-label">Total Investment</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.monthlySpent.toFixed(2)}</div>
              <div className="stat-label">This Month</div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <DollarSign />
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.averageCostPerUnit.toFixed(2)}</div>
              <div className="stat-label">Avg Cost/Unit</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="ingredients-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="ingredients-table">
          <div className="table-header">
            <div>Name</div>
            <div>Unit</div>
            <div>Price per Unit</div>
            <div>Last Updated</div>
            <div>Actions</div>
          </div>

          {filteredIngredients.map(ingredient => (
            <div key={ingredient.id} className="table-row">
              <div className="ingredient-name">{ingredient.name}</div>
              <div className="ingredient-unit">{ingredient.unit}</div>
              <div className="ingredient-price">${ingredient.current_unit_price}</div>
              <div className="ingredient-updated">
                {new Date(ingredient.updated_at).toLocaleDateString()}
              </div>
              <div className="ingredient-actions">
                <button
                  className="action-btn edit"
                  onClick={() => setEditingIngredient(ingredient)}
                >
                  <Edit size={14} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteIngredient(ingredient.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Ingredient Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Ingredient</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >×</button>
              </div>

              <form onSubmit={handleAddIngredient} className="modal-body">
                <div className="form-group">
                  <label>Ingredient Name</label>
                  <input
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                    placeholder="e.g., Flour, Sugar, Eggs"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                    required
                  >
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIngredient.current_unit_price}
                    onChange={(e) => setNewIngredient({...newIngredient, current_unit_price: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Ingredient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Ingredient Modal */}
        {editingIngredient && (
          <div className="modal-overlay" onClick={() => setEditingIngredient(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit {editingIngredient.name}</h3>
                <button
                  className="modal-close"
                  onClick={() => setEditingIngredient(null)}
                >×</button>
              </div>

              <form onSubmit={handleUpdateIngredient} className="modal-body">
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={editingIngredient.unit}
                    onChange={(e) => setEditingIngredient({...editingIngredient, unit: e.target.value})}
                    required
                  >
                    {unitOptions.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingIngredient.current_unit_price}
                    onChange={(e) => setEditingIngredient({...editingIngredient, current_unit_price: e.target.value})}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setEditingIngredient(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Ingredient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientsManagement;
