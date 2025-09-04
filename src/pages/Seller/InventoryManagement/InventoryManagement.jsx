import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  TrendingDown,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState('');

  // Mock data - replace with API call
  useEffect(() => {
    const fetchInventory = async () => {
      setTimeout(() => {
        const mockInventory = [
          {
            id: 1,
            name: 'Artisan Sourdough Bread',
            category: 'Bread',
            currentStock: 25,
            minThreshold: 10,
            maxCapacity: 50,
            unit: 'loaves',
            costPerUnit: 3.50,
            sellingPrice: 8.99,
            lastRestocked: '2024-01-15',
            supplier: 'Local Flour Mill',
            status: 'in_stock'
          },
          {
            id: 2,
            name: 'Chocolate Croissants',
            category: 'Pastries',
            currentStock: 3,
            minThreshold: 15,
            maxCapacity: 40,
            unit: 'pieces',
            costPerUnit: 1.20,
            sellingPrice: 3.50,
            lastRestocked: '2024-01-10',
            supplier: 'Pastry Ingredients Co.',
            status: 'low_stock'
          },
          {
            id: 3,
            name: 'Red Velvet Cake',
            category: 'Cakes',
            currentStock: 0,
            minThreshold: 5,
            maxCapacity: 15,
            unit: 'cakes',
            costPerUnit: 8.00,
            sellingPrice: 24.99,
            lastRestocked: '2024-01-08',
            supplier: 'Premium Cake Supplies',
            status: 'out_of_stock'
          },
          {
            id: 4,
            name: 'Blueberry Muffins',
            category: 'Muffins',
            currentStock: 18,
            minThreshold: 12,
            maxCapacity: 30,
            unit: 'pieces',
            costPerUnit: 1.80,
            sellingPrice: 2.99,
            lastRestocked: '2024-01-12',
            supplier: 'Berry Fresh Supplies',
            status: 'in_stock'
          },
          {
            id: 5,
            name: 'Vanilla Cupcakes',
            category: 'Cupcakes',
            currentStock: 35,
            minThreshold: 20,
            maxCapacity: 60,
            unit: 'pieces',
            costPerUnit: 0.90,
            sellingPrice: 2.50,
            lastRestocked: '2024-01-14',
            supplier: 'Sweet Ingredients Ltd',
            status: 'in_stock'
          }
        ];
        setInventory(mockInventory);
        setFilteredInventory(mockInventory);
        setLoading(false);
      }, 1000);
    };

    fetchInventory();
  }, []);

  // Filter inventory
  useEffect(() => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase() === categoryFilter);
    }

    if (stockFilter !== 'all') {
      filtered = filtered.filter(item => item.status === stockFilter);
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, categoryFilter, stockFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'text-green-600 bg-green-100';
      case 'low_stock':
        return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStockPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  const handleStockUpdate = (itemId, adjustment) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = Math.max(0, Math.min(item.currentStock + adjustment, item.maxCapacity));
        let status = 'in_stock';
        if (newStock === 0) status = 'out_of_stock';
        else if (newStock <= item.minThreshold) status = 'low_stock';

        return { ...item, currentStock: newStock, status };
      }
      return item;
    }));
  };

  const handleEditStock = (item) => {
    setEditingItem(item.id);
    setNewStock(item.currentStock.toString());
  };

  const saveStockEdit = () => {
    const stockValue = parseInt(newStock);
    if (!isNaN(stockValue) && stockValue >= 0) {
      setInventory(prev => prev.map(item => {
        if (item.id === editingItem) {
          const newStockAmount = Math.min(stockValue, item.maxCapacity);
          let status = 'in_stock';
          if (newStockAmount === 0) status = 'out_of_stock';
          else if (newStockAmount <= item.minThreshold) status = 'low_stock';

          return { ...item, currentStock: newStockAmount, status };
        }
        return item;
      }));
    }
    setEditingItem(null);
    setNewStock('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewStock('');
  };

  // Calculate summary stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3">Loading inventory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory levels</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn btn-primary">
            <Upload className="w-4 h-4" />
            Import
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Categories</option>
            <option value="bread">Bread</option>
            <option value="pastries">Pastries</option>
            <option value="cakes">Cakes</option>
            <option value="muffins">Muffins</option>
            <option value="cupcakes">Cupcakes</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.category} • {item.supplier}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {editingItem === item.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            min="0"
                            max={item.maxCapacity}
                          />
                          <button
                            onClick={saveStockEdit}
                            className="text-green-600 hover:text-green-800"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStockUpdate(item.id, -1)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              disabled={item.currentStock === 0}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-medium text-gray-900">
                              {item.currentStock} {item.unit}
                            </span>
                            <button
                              onClick={() => handleStockUpdate(item.id, 1)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              disabled={item.currentStock >= item.maxCapacity}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleEditStock(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === 'out_of_stock' ? 'bg-red-500' :
                            item.status === 'low_stock' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${getStockPercentage(item.currentStock, item.maxCapacity)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Min: {item.minThreshold} • Max: {item.maxCapacity}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${item.costPerUnit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${(item.currentStock * item.costPerUnit).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="btn btn-sm btn-primary">
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Restock Alerts</h3>
          <p className="text-sm text-gray-500 mb-4">View items that need restocking</p>
          <div className="text-2xl font-bold text-red-600 mb-2">{lowStockItems + outOfStockItems}</div>
          <button className="btn btn-secondary btn-sm">View Alerts</button>
        </div>

        <div className="card text-center">
          <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Inventory Report</h3>
          <p className="text-sm text-gray-500 mb-4">Generate detailed inventory reports</p>
          <button className="btn btn-secondary btn-sm">Generate Report</button>
        </div>

        <div className="card text-center">
          <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Bulk Update</h3>
          <p className="text-sm text-gray-500 mb-4">Update multiple items at once</p>
          <button className="btn btn-secondary btn-sm">Bulk Import</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
