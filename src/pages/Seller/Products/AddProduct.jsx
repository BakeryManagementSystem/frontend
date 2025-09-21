import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    stock_quantity: '',
    sku: '',
    weight: '',
    dimensions: '',
    ingredients: '',
    allergens: '',
    status: 'active',
    is_featured: false,
    meta_title: '',
    meta_description: '',
    images: []
  });

  const categoryOptions = [
    { id: 1, name: 'Bread & Rolls' },
    { id: 2, name: 'Pastries' },
    { id: 3, name: 'Cakes' },
    { id: 4, name: 'Cookies' },
    { id: 5, name: 'Muffins & Cupcakes' },
    { id: 6, name: 'Specialty & Dietary' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files.slice(0, 5) // Limit to 5 images
    }));
  };

  const getApiUrl = (endpoint) => {
    let base = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    // Remove trailing slash
    base = base.replace(/\/$/, '');
    // If base already ends with /api, don't add it again
    if (base.endsWith('/api')) {
      return `${base}${endpoint}`;
    }
    return `${base}/api${endpoint}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (formData.discount_price) formDataToSend.append('discount_price', formData.discount_price);
      formDataToSend.append('category_id', formData.category_id);
      if (formData.stock_quantity) formDataToSend.append('stock_quantity', formData.stock_quantity);
      if (formData.sku) formDataToSend.append('sku', formData.sku);
      if (formData.weight) formDataToSend.append('weight', formData.weight);
      if (formData.dimensions) formDataToSend.append('dimensions', formData.dimensions);
      if (formData.ingredients) formDataToSend.append('ingredients', formData.ingredients);
      if (formData.allergens) formDataToSend.append('allergens', formData.allergens);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_featured', formData.is_featured ? '1' : '0');
      if (formData.meta_title) formDataToSend.append('meta_title', formData.meta_title);
      if (formData.meta_description) formDataToSend.append('meta_description', formData.meta_description);

      // Add images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      console.log('Submitting to:', getApiUrl('/products'));
      console.log('User:', user);
      console.log('Token:', token);
      console.log('Form data being sent:', Object.fromEntries(formDataToSend));

      const response = await fetch(getApiUrl('/products'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Product created successfully:', result);
        alert('Product created successfully!');
        // Navigate back to products page
        navigate(user?.user_type === 'owner' ? '/owner/products' : '/seller/products');
      } else {
        // Handle non-JSON error responses (like HTML error pages)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('Error creating product:', error);
          alert('Error creating product: ' + (error.message || JSON.stringify(error)));
        } else {
          const errorText = await response.text();
          console.error('Server error (HTML response):', errorText);
          alert(`Server error (${response.status}). Check console for details.`);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(user?.user_type === 'owner' ? '/owner/products' : '/seller/products');
  };

  return (
    <div className="add-product-page">
      <div className="container">
        <div className="page-header">
          <h1>Add New Product</h1>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Back to Products
          </button>
        </div>

        <div className="product-form-container">
          <form onSubmit={handleSubmit} className="product-form">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>

              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  placeholder="Enter product description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Product SKU (optional)"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="form-section">
              <h3>Pricing & Stock</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="discount_price">Discount Price</label>
                  <input
                    type="number"
                    id="discount_price"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00 (optional)"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category_id">Category *</label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="stock_quantity">Stock Quantity</label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Physical Properties */}
            <div className="form-section">
              <h3>Physical Properties</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dimensions">Dimensions</label>
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 20cm x 15cm x 5cm"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div className="form-section">
              <h3>Ingredients & Allergens</h3>

              <div className="form-group">
                <label htmlFor="ingredients">Ingredients (comma-separated)</label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="flour, sugar, eggs, butter, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="allergens">Allergens (comma-separated)</label>
                <textarea
                  id="allergens"
                  name="allergens"
                  value={formData.allergens}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="gluten, eggs, dairy, nuts, etc."
                />
              </div>
            </div>

            {/* Status & Features */}
            <div className="form-section">
              <h3>Status & Features</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="is_featured">Featured Product</label>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="form-section">
              <h3>SEO (Optional)</h3>

              <div className="form-group">
                <label htmlFor="meta_title">Meta Title</label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div className="form-group">
                <label htmlFor="meta_description">Meta Description</label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="SEO description for search engines"
                />
              </div>
            </div>

            {/* Images */}
            <div className="form-section">
              <h3>Product Images</h3>

              <div className="form-group">
                <label htmlFor="images">Product Images (Max 5)</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                />
                {formData.images.length > 0 && (
                  <div className="selected-images">
                    <p>{formData.images.length} image(s) selected</p>
                    <ul>
                      {formData.images.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
