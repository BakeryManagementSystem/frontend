import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
import { X, Upload, Link as LinkIcon, Plus, Trash2, Calculator } from 'lucide-react';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageInputType, setImageInputType] = useState('file'); // 'file' or 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [addUrlLoading, setAddUrlLoading] = useState(false); // loading state for Add URL button

  // Ingredient management state
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [totalIngredientCost, setTotalIngredientCost] = useState(0);
  const [loadingIngredients, setLoadingIngredients] = useState(false);

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
    images: [],
    image_urls: []
  });

  const categoryOptions = [
    { id: 1, name: 'Bread & Rolls' },
    { id: 2, name: 'Pastries' },
    { id: 3, name: 'Cakes' },
    { id: 4, name: 'Cookies' },
    { id: 5, name: 'Muffins & Cupcakes' },
    { id: 6, name: 'Specialty & Dietary' }
  ];

  // Fetch ingredients on component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  // Calculate total ingredient cost whenever selected ingredients change
  useEffect(() => {
    const total = selectedIngredients.reduce((sum, ingredient) => {
      const ingredientData = availableIngredients.find(ing => ing.id === parseInt(ingredient.id));
      if (ingredientData) {
        return sum + (parseFloat(ingredientData.current_unit_price) * ingredient.quantity);
      }
      return sum;
    }, 0);
    setTotalIngredientCost(total);
  }, [selectedIngredients, availableIngredients]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      // Check file size (max 5MB per file)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    const totalImages = formData.images.length + formData.image_urls.length + validFiles.length;
    if (totalImages > 5) {
      alert('Maximum 5 images allowed. Please remove some images first.');
      return;
    }

    const newImages = [...formData.images, ...validFiles.slice(0, 5 - formData.images.length - formData.image_urls.length)];

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));

    // Update previews to match the new state
    const newPreviews = [];

    // Add existing URL previews
    formData.image_urls.forEach(url => {
      newPreviews.push({ type: 'url', url, name: 'Image URL' });
    });

    // Add existing file previews
    formData.images.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => {
          const updated = [...prev];
          const fileIndex = newPreviews.length + updated.filter(p => p.type === 'file').length;
          if (fileIndex < newImages.length + formData.image_urls.length) {
            updated.push({ type: 'file', url: e.target.result, name: file.name });
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    // Add new file previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, { type: 'file', url: e.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUrlAdd = () => {
    if (!imageUrl.trim()) {
      alert('Please enter a valid image URL');
      return;
    }

    const totalImages = formData.images.length + formData.image_urls.length;
    if (totalImages >= 5) {
      alert('Maximum 5 images allowed. Please remove some images first.');
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    // Show loading spinner on the Add URL button until image is verified/loaded
    setAddUrlLoading(true);

    // Preload the image to ensure the URL is valid and reachable (avoids submitting broken links)
    const img = new Image();
    const urlToTest = imageUrl.trim();
    img.onload = () => {
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, urlToTest]
      }));

      setImagePreview(prev => [...prev, { type: 'url', url: urlToTest, name: 'Image URL' }]);
      setImageUrl('');
      setAddUrlLoading(false);
    };
    img.onerror = () => {
      alert('Failed to load image from the provided URL. Please check the link and try again.');
      setAddUrlLoading(false);
    };
    // Trigger load
    img.src = urlToTest;
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreview[index];

    if (imageToRemove.type === 'file') {
      // Find the file index in the images array
      const filePreviewsBeforeThis = imagePreview.slice(0, index).filter(p => p.type === 'file').length;
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== filePreviewsBeforeThis)
      }));
    } else {
      // Find the URL index in the image_urls array
      const urlPreviewsBeforeThis = imagePreview.slice(0, index).filter(p => p.type === 'url').length;
      setFormData(prev => ({
        ...prev,
        image_urls: prev.image_urls.filter((_, i) => i !== urlPreviewsBeforeThis)
      }));
    }

    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const getApiUrl = (endpoint) => {
    let base = import.meta.env.VITE_API_URL || 'https://backend-production-cc2c.up.railway.app/api';
    // Remove trailing slash
    base = base.replace(/\/$/, '');
    // If base already ends with /api, don't add it again
    if (base.endsWith('/api')) {
      return `${base}${endpoint}`;
    }
    return `${base}${endpoint}`;
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

      // Add uploaded images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      // Add image URLs
      formData.image_urls.forEach((url, index) => {
        formDataToSend.append(`image_urls[${index}]`, url);
      });

      // Add selected ingredients data
      if (selectedIngredients.length > 0) {
        formDataToSend.append('selected_ingredients', JSON.stringify(selectedIngredients));
        formDataToSend.append('ingredient_cost', totalIngredientCost.toFixed(2));
      }

      console.log('Submitting to:', getApiUrl('/products'));
      console.log('User:', user);
      console.log('Token:', token);

      // Create an AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      const response = await fetch(getApiUrl('/products'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Product created successfully:', result);
        alert('Product created successfully!');
        navigate(user?.user_type === 'owner' ? '/owner/products' : '/seller/products');
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('Error creating product:', error);

          // Handle validation errors
          if (error.errors) {
            const errorMessages = Object.values(error.errors).flat();
            alert('Validation errors:\n' + errorMessages.join('\n'));
          } else {
            alert('Error creating product: ' + (error.message || JSON.stringify(error)));
          }
        } else {
          const errorText = await response.text();
          console.error('Server error (HTML response):', errorText);
          alert(`Server error (${response.status}). Please check your internet connection and try again.`);
        }
      }
    } catch (error) {
      console.error('Request error:', error);

      if (error.name === 'AbortError') {
        alert('Request timed out. Please check your internet connection and try again with smaller images.');
      } else if (error.message.includes('Failed to fetch')) {
        alert('Network error: Please check your internet connection and try again.');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(user?.user_type === 'owner' ? '/owner/products' : '/seller/products');
  };

  const fetchIngredients = async () => {
    setLoadingIngredients(true);
    try {
      const response = await ApiService.getIngredients();
      setAvailableIngredients(response.data || []);
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
      alert('Failed to load ingredients. Please try again.');
    } finally {
      setLoadingIngredients(false);
    }
  };

  const addIngredient = (ingredientId) => {
    const ingredient = availableIngredients.find(ing => ing.id === parseInt(ingredientId));
    if (ingredient && !selectedIngredients.find(ing => ing.id === ingredientId)) {
      setSelectedIngredients(prev => [...prev, {
        id: ingredientId,
        name: ingredient.name,
        unit: ingredient.unit,
        price: parseFloat(ingredient.current_unit_price),
        quantity: 1
      }]);
    }
  };

  const removeIngredient = (index) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredientQuantity = (index, quantity) => {
    if (quantity > 0) {
      setSelectedIngredients(prev =>
        prev.map((ing, i) => i === index ? { ...ing, quantity: parseFloat(quantity) } : ing)
      );
    }
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
              <h3>Ingredients Management</h3>

              {loadingIngredients ? (
                <div className="loading-ingredients">
                  <p>Loading ingredients...</p>
                </div>
              ) : (
                <>
                  {/* Add Ingredient Dropdown */}
                  <div className="form-group">
                    <label>Add Ingredients to Product</label>
                    <div className="add-ingredient-row">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addIngredient(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="ingredient-select"
                      >
                        <option value="">Select an ingredient to add...</option>
                        {availableIngredients
                          .filter(ing => !selectedIngredients.find(sel => sel.id === ing.id.toString()))
                          .map(ingredient => (
                            <option key={ingredient.id} value={ingredient.id}>
                              {ingredient.name} - ${parseFloat(ingredient.current_unit_price).toFixed(2)}/{ingredient.unit}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => navigate('/seller/ingredients')}
                      >
                        <Plus size={16} />
                        Manage Ingredients
                      </button>
                    </div>
                  </div>

                  {/* Selected Ingredients List */}
                  {selectedIngredients.length > 0 && (
                    <div className="form-group">
                      <label>Selected Ingredients</label>
                      <div className="selected-ingredients-list">
                        {selectedIngredients.map((ingredient, index) => (
                          <div key={index} className="selected-ingredient-item">
                            <div className="ingredient-info">
                              <span className="ingredient-name">{ingredient.name}</span>
                              <span className="ingredient-price">${ingredient.price.toFixed(2)}/{ingredient.unit}</span>
                            </div>
                            <div className="ingredient-controls">
                              <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={ingredient.quantity}
                                onChange={(e) => updateIngredientQuantity(index, parseFloat(e.target.value))}
                                className="ingredient-quantity-input"
                                placeholder="Qty"
                              />
                              <span className="ingredient-unit">{ingredient.unit}</span>
                              <span className="ingredient-line-cost">
                                ${(ingredient.price * ingredient.quantity).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                className="remove-ingredient-btn"
                                onClick={() => removeIngredient(index)}
                                title="Remove ingredient"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cost Summary */}
                  {selectedIngredients.length > 0 && (
                    <div className="form-group">
                      <div className="ingredient-cost-summary">
                        <div className="cost-row">
                          <span className="cost-label">Total Ingredient Cost:</span>
                          <span className="cost-value">${totalIngredientCost.toFixed(2)}</span>
                        </div>
                        {formData.price && (
                          <div className="cost-row">
                            <span className="cost-label">Product Price:</span>
                            <span className="cost-value">${parseFloat(formData.price || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {formData.price && totalIngredientCost > 0 && (
                          <div className="cost-row profit-margin">
                            <span className="cost-label">Estimated Profit:</span>
                            <span className="cost-value">
                              ${(parseFloat(formData.price || 0) - totalIngredientCost).toFixed(2)}
                              {formData.price && (
                                <small className="profit-percentage">
                                  ({(((parseFloat(formData.price) - totalIngredientCost) / parseFloat(formData.price)) * 100).toFixed(1)}%)
                                </small>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Traditional Text Fields for Additional Info */}
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

              {/* Image Input Type Toggle */}
              <div className="image-input-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${imageInputType === 'file' ? 'active' : ''}`}
                  onClick={() => setImageInputType('file')}
                >
                  <Upload size={16} />
                  Upload Files
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${imageInputType === 'url' ? 'active' : ''}`}
                  onClick={() => setImageInputType('url')}
                >
                  <LinkIcon size={16} />
                  Add URLs
                </button>
              </div>

              {/* File Upload Section */}
              {imageInputType === 'file' && (
                <div className="form-group">
                  <label htmlFor="images">Upload Images (Max 5MB each, Max 5 total)</label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="file-input"
                  />
                  <div className="file-input-info">
                    <small>Supported formats: JPG, PNG, GIF, WebP</small>
                  </div>
                </div>
              )}

              {/* URL Input Section */}
              {imageInputType === 'url' && (
                <div className="form-group">
                  <label>Add Image URL</label>
                  <div className="image-url-input">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="url-input"
                    />
                    <button
                      type="button"
                      className={`btn btn-primary add-url-btn ${addUrlLoading ? 'loading' : ''}`}
                      onClick={handleImageUrlAdd}
                      disabled={addUrlLoading || !imageUrl.trim() || (formData.images.length + formData.image_urls.length) >= 5}
                    >
                      <LinkIcon size={16} />
                      Add URL
                    </button>
                  </div>
                  <div className="url-input-info">
                    <small>Enter a direct link to an image (saves local storage)</small>
                  </div>
                </div>
              )}

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="image-previews">
                  <h4>Selected Images ({imagePreview.length}/5)</h4>
                  <div className="preview-grid">
                    {imagePreview.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="preview-error" style={{ display: 'none' }}>
                          <span>Failed to load image</span>
                        </div>
                        <div className="preview-overlay">
                          <span className="preview-type">
                            {image.type === 'file' ? 'FILE' : 'URL'}
                          </span>
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="preview-name">
                          {image.type === 'file' ? image.name : 'Image URL'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Images Summary */}
              <div className="images-summary">
                <div className="summary-item">
                  <span>Uploaded Files: {formData.images.length}</span>
                </div>
                <div className="summary-item">
                  <span>Image URLs: {formData.image_urls.length}</span>
                </div>
                <div className="summary-item">
                  <span>Total: {formData.images.length + formData.image_urls.length}/5</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
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
