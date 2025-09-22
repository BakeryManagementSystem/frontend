import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import ApiService from '../../../services/api';
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import './EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    category: '',
    stock_quantity: '',
    sku: '',
    weight: '',
    status: 'active',
    is_featured: false,
    image_path: '',
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const categories = [
    'Bread & Bakery',
    'Cakes & Pastries',
    'Cookies & Biscuits',
    'Donuts & Muffins',
    'Pies & Tarts',
    'Specialty Items',
    'Seasonal Items',
    'Custom Orders'
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ApiService.getSellerProduct(id);

      if (response.success && response.product) {
        const product = response.product;

        // Verify the product belongs to the current user
        if (product.owner_id !== user.id) {
          setError('You do not have permission to edit this product.');
          return;
        }

        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          discount_price: product.discount_price || '',
          category: product.category || '',
          stock_quantity: product.stock_quantity || '',
          sku: product.sku || '',
          weight: product.weight || '',
          status: product.status || 'active',
          is_featured: product.is_featured || false,
          image_path: product.image_path || '',
          images: product.images || []
        });

        // Set preview images from existing product images
        if (product.image_urls && product.image_urls.length > 0) {
          setPreviewImages(product.image_urls.map(url => ({ url, isExisting: true })));
        } else if (product.image_url) {
          setPreviewImages([{ url: product.image_url, isExisting: true }]);
        }
      } else {
        setError('Product not found or access denied.');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    // Create preview URLs for new images
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImages(prev => [...prev, { url: event.target.result, isExisting: false, file }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const imageToRemove = previewImages[index];

    if (imageToRemove.isExisting) {
      // Remove from existing images
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      // Remove from new image files
      setImageFiles(prev => prev.filter(file => file !== imageToRemove.file));
    }

    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      // Add form fields with proper validation
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          // Handle existing images separately
          formDataToSend.append('existing_images', JSON.stringify(formData.images));
        } else if (key === 'is_featured') {
          // Convert boolean to string that Laravel expects
          formDataToSend.append(key, formData[key] ? '1' : '0');
        } else {
          // Ensure we don't send undefined or null values
          const value = formData[key];
          if (value !== undefined && value !== null) {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // Add new image files
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images[${index}]`, file);
      });

      // Debug: Log what we're sending
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key + ':', value);
      }

      const response = await ApiService.updateProduct(id, formDataToSend);

      if (response.success) {
        addNotification('Product updated successfully!', 'success');
        navigate('/seller/products');
      } else {
        setError(response.message || 'Failed to update product.');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!formData.name && !loading) {
    return (
      <div className="edit-product error">
        <div className="container">
          <div className="error-container">
            <AlertCircle size={48} className="error-icon" />
            <h2>Error</h2>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/seller/products')}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <button
            className="back-btn"
            onClick={() => navigate('/seller/products')}
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <h1>Edit Product</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
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
                  required
                  rows="4"
                  placeholder="Describe your product"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sku">SKU</label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Product SKU"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="form-section">
              <h3>Pricing & Inventory</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
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
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock_quantity">Stock Quantity *</label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="form-section full-width">
              <h3>Product Images</h3>

              <div className="image-upload-section">
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <label htmlFor="images" className="upload-label">
                    <Upload size={24} />
                    <span>Upload Images</span>
                    <small>Click to browse or drag and drop</small>
                  </label>
                </div>

                {previewImages.length > 0 && (
                  <div className="image-preview-grid">
                    {previewImages.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image.url} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          <X size={16} />
                        </button>
                        {image.isExisting && (
                          <span className="existing-image-badge">Existing</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status & Settings */}
            <div className="form-section">
              <h3>Status & Settings</h3>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Featured Product
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/seller/products')}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="btn-icon spinning" size={16} />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="btn-icon" size={16} />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
