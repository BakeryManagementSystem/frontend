import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import ApiService from '../../../services/api';
import {
  Store,
  Edit,
  Save,
  Camera,
  Eye,
  Palette,
  Image,
  Settings,
  Globe,
  Star,
  Package,
  Users,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';
import './SellerShop.css';

const SellerShop = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [shopData, setShopData] = useState({
    id: null,
    owner_id: null,
    name: '',
    description: '',
    logo: '',
    banner: '',
    theme: {
      primaryColor: '#6639a6',
      secondaryColor: '#7f4fc3',
      accentColor: '#9b75d0'
    },
    policies: {
      shipping: '',
      returns: '',
      exchange: ''
    },
    social: {
      website: '',
      facebook: '',
      twitter: '',
      instagram: ''
    },
    settings: {
      showContactInfo: true,
      showReviews: true,
      allowMessages: true,
      featuredProducts: []
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  // Image URL input states
  const [imageInputType, setImageInputType] = useState({
    logo: 'file', // 'file' or 'url'
    banner: 'file'
  });
  const [imageUrl, setImageUrl] = useState({
    logo: '',
    banner: ''
  });
  const [urlLoading, setUrlLoading] = useState({
    logo: false,
    banner: false
  });

  const [shopStats, setShopStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalFollowers: 0,
    averageRating: 0,
    totalSales: 0,
    monthlyRevenue: 0
  });

  const [imageUploading, setImageUploading] = useState({
    logo: false,
    banner: false
  });

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      console.log('Fetching shop data...');

      // Check if we have authentication token
      const token = localStorage.getItem('auth_token');
      console.log('Auth token present:', !!token);

      // Fetch real shop data and stats from API
      const [shopResponse, statsResponse] = await Promise.all([
        ApiService.getSellerShop(),
        ApiService.getSellerShopStats()
      ]);

      console.log('Shop response:', shopResponse);
      console.log('Stats response:', statsResponse);

      if (shopResponse && shopResponse.data) {
        const shop = shopResponse.data;

        // Ensure theme has valid color values
        const defaultTheme = {
          primaryColor: '#6639a6',
          secondaryColor: '#7f4fc3',
          accentColor: '#9b75d0'
        };

        const theme = {
          primaryColor: shop.theme?.primaryColor || defaultTheme.primaryColor,
          secondaryColor: shop.theme?.secondaryColor || defaultTheme.secondaryColor,
          accentColor: shop.theme?.accentColor || defaultTheme.accentColor
        };

        // Validate hex color format
        const isValidHex = (color) => /^#[0-9A-F]{6}$/i.test(color);
        if (!isValidHex(theme.primaryColor)) theme.primaryColor = defaultTheme.primaryColor;
        if (!isValidHex(theme.secondaryColor)) theme.secondaryColor = defaultTheme.secondaryColor;
        if (!isValidHex(theme.accentColor)) theme.accentColor = defaultTheme.accentColor;

        setShopData({
          id: shop.id || null,
          owner_id: shop.owner_id || null,
          name: shop.name || '',
          description: shop.description || '',
          logo: shop.logo || '',
          banner: shop.banner || '',
          theme: theme,
          policies: shop.policies || {
            shipping: '',
            returns: '',
            exchange: ''
          },
          social: shop.social || {
            website: '',
            facebook: '',
            twitter: '',
            instagram: ''
          },
          settings: shop.settings || {
            showContactInfo: true,
            showReviews: true,
            allowMessages: true,
            featuredProducts: []
          }
        });

        console.log('Shop data loaded successfully from backend');
      }

      if (statsResponse && (statsResponse.success || statsResponse.data)) {
        const stats = statsResponse.data || statsResponse;
        setShopStats({
          totalProducts: stats.total_products || stats.totalProducts || 0,
          totalViews: stats.total_views || stats.totalViews || 0,
          totalFollowers: stats.total_followers || stats.totalFollowers || 0,
          averageRating: stats.average_rating || stats.averageRating || 0,
          totalSales: stats.total_sales || stats.totalSales || 0,
          monthlyRevenue: stats.monthly_revenue || stats.monthlyRevenue || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch shop data:', error);
      addNotification('Failed to load shop data. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'theme' || section === 'policies' || section === 'social' || section === 'settings') {
      setShopData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setShopData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateShop = () => {
    const newErrors = {};

    if (!shopData.name.trim()) {
      newErrors.name = 'Shop name is required';
    }

    if (!shopData.description.trim()) {
      newErrors.description = 'Shop description is required';
    } else if (shopData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    return newErrors;
  };

  const handleSave = async () => {
    const formErrors = validateShop();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare shop data for API
      const shopDataToSend = {
        name: shopData.name,
        description: shopData.description,
        logo: shopData.logo,
        banner: shopData.banner,
        primary_color: shopData.theme.primaryColor,
        secondary_color: shopData.theme.secondaryColor,
        accent_color: shopData.theme.accentColor,
        shipping_policy: shopData.policies.shipping,
        return_policy: shopData.policies.returns,
        exchange_policy: shopData.policies.exchange,
        website: shopData.social.website,
        facebook: shopData.social.facebook,
        twitter: shopData.social.twitter,
        instagram: shopData.social.instagram,
        show_contact_info: shopData.settings.showContactInfo,
        show_reviews: shopData.settings.showReviews,
        allow_messages: shopData.settings.allowMessages,
        featured_products: shopData.settings.featuredProducts
      };

      console.log('Sending shop data:', shopDataToSend);

      // Send data to API
      const response = await ApiService.updateSellerShop(shopDataToSend);

      console.log('Update response:', response);

      if (response.success) {
        setIsEditing(false);
        setSuccess('Shop updated successfully!');
        addNotification('Shop updated successfully!', 'success');
        setTimeout(() => setSuccess(''), 3000);

        // Refresh shop data to get any server-side changes
        await fetchShopData();
      } else {
        setErrors({ general: response.message || 'Failed to update shop. Please try again.' });
        addNotification('Failed to update shop. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Failed to update shop:', error);
      setErrors({ general: 'Failed to update shop. Please try again.' });
      addNotification('Failed to update shop. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Use the owner_id from shopData, fallback to user.id if not available
    const ownerId = shopData.owner_id || user?.id;
    if (ownerId) {
      window.open(`/bakery/${ownerId}`, '_blank');
    } else {
      addNotification('Unable to preview shop. Please try again.', 'error');
    }
  };

  const handleImageUpload = async (imageType, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addNotification('Please upload a valid image file (JPG, PNG, or WebP)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      addNotification('Image size must be less than 5MB', 'error');
      return;
    }

    setImageUploading(prev => ({ ...prev, [imageType]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', imageType);

      const response = await ApiService.uploadShopImage(formData);

      if (response.success) {
        // Update the shop data with the new image URL
        setShopData(prev => ({
          ...prev,
          [imageType]: response.data.url
        }));
        addNotification(`${imageType === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`, 'success');
      } else {
        addNotification(response.message || 'Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      addNotification('Failed to upload image. Please try again.', 'error');
    } finally {
      setImageUploading(prev => ({ ...prev, [imageType]: false }));
    }
  };

  const handleImageClick = (imageType) => {
    if (!isEditing) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(imageType, file);
      }
    };
    input.click();
  };

  const handleImageRemove = async (imageType) => {
    if (!isEditing || !shopData[imageType]) return;

    if (window.confirm('Are you sure you want to remove this image?')) {
      setLoading(true);

      try {
        // Call API to remove image
        const response = await ApiService.removeShopImage(imageType);

        if (response.success) {
          // Update shop data to remove image
          setShopData(prev => ({
            ...prev,
            [imageType]: ''
          }));
          addNotification(`${imageType === 'logo' ? 'Logo' : 'Banner'} removed successfully!`, 'success');
        } else {
          addNotification(response.message || 'Failed to remove image', 'error');
        }
      } catch (error) {
        console.error('Image remove failed:', error);
        addNotification('Failed to remove image. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // New handler for URL input change
  const handleImageUrlChange = (imageType, url) => {
    setImageUrl(prev => ({ ...prev, [imageType]: url }));

    // Clear errors
    if (errors[imageType]) {
      setErrors(prev => ({ ...prev, [imageType]: '' }));
    }
  };

  // New handler for URL input submit
  const handleImageUrlSubmit = async (imageType) => {
    const url = imageUrl[imageType]?.trim();
    if (!url) return;

    // Basic URL validation
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(url)) {
      addNotification('Please enter a valid URL', 'error');
      return;
    }

    setUrlLoading(prev => ({ ...prev, [imageType]: true }));

    try {
      // Update shop data with the new image URL
      setShopData(prev => ({
        ...prev,
        [imageType]: url
      }));
      addNotification(`${imageType === 'logo' ? 'Logo' : 'Banner'} URL updated successfully!`, 'success');
    } catch (error) {
      console.error('Failed to update image URL:', error);
      addNotification('Failed to update image URL. Please try again.', 'error');
    } finally {
      setUrlLoading(prev => ({ ...prev, [imageType]: false }));
    }
  };

  return (
    <div className="seller-shop">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Manage Your Shop</h1>
            <p>Customize your shop appearance and settings</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handlePreview}>
              <Eye size={18} />
              Preview Shop
            </button>
            {!isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <Edit size={18} />
                Edit Shop
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                    fetchShopData();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        {/* Shop Stats */}
        <div className="shop-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Package />
            </div>
            <div className="stat-content">
              <div className="stat-value">{shopStats.totalProducts || 0}</div>
              <div className="stat-label">Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Eye />
            </div>
            <div className="stat-content">
              <div className="stat-value">{(shopStats.totalViews || 0).toLocaleString()}</div>
              <div className="stat-label">Shop Views</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-content">
              <div className="stat-value">{(shopStats.totalFollowers || 0).toLocaleString()}</div>
              <div className="stat-label">Followers</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Star />
            </div>
            <div className="stat-content">
              <div className="stat-value">{shopStats.averageRating || 0}</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>

        <div className="shop-content">
          {/* Section Navigation */}
          <div className="section-nav">
            <button
              className={`nav-btn ${activeSection === 'general' ? 'active' : ''}`}
              onClick={() => setActiveSection('general')}
            >
              <Store size={16} />
              General
            </button>
            <button
              className={`nav-btn ${activeSection === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveSection('appearance')}
            >
              <Palette size={16} />
              Appearance
            </button>
            <button
              className={`nav-btn ${activeSection === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveSection('policies')}
            >
              <Settings size={16} />
              Policies
            </button>
            <button
              className={`nav-btn ${activeSection === 'social' ? 'active' : ''}`}
              onClick={() => setActiveSection('social')}
            >
              <Globe size={16} />
              Social Links
            </button>
          </div>

          {/* Section Content */}
          <div className="section-content">
            {/* General Section */}
            {activeSection === 'general' && (
              <div className="section">
                <h2>General Information</h2>

                <div className="form-group">
                  <label htmlFor="shopName" className="form-label">Shop Name</label>
                  <input
                    type="text"
                    id="shopName"
                    value={shopData.name}
                    onChange={(e) => handleInputChange('general', 'name', e.target.value)}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    disabled={!isEditing}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="shopDescription" className="form-label">Shop Description</label>
                  <textarea
                    id="shopDescription"
                    value={shopData.description}
                    onChange={(e) => handleInputChange('general', 'description', e.target.value)}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Describe your shop, products, and what makes you unique..."
                  />
                  <div className="character-count">
                    {shopData.description.length}/500 characters
                  </div>
                  {errors.description && <div className="error-message">{errors.description}</div>}
                </div>

                <div className="shop-settings">
                  <h3>Shop Settings</h3>
                  <div className="settings-grid">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={shopData.settings.showContactInfo}
                        onChange={(e) => handleInputChange('settings', 'showContactInfo', e.target.checked)}
                        disabled={!isEditing}
                      />
                      <span>Show contact information</span>
                    </label>
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={shopData.settings.showReviews}
                        onChange={(e) => handleInputChange('settings', 'showReviews', e.target.checked)}
                        disabled={!isEditing}
                      />
                      <span>Display customer reviews</span>
                    </label>
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={shopData.settings.allowMessages}
                        onChange={(e) => handleInputChange('settings', 'allowMessages', e.target.checked)}
                        disabled={!isEditing}
                      />
                      <span>Allow customer messages</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="section">
                <h2>Shop Appearance</h2>

                <div className="image-uploads">
                  {/* Logo Upload/URL Section */}
                  <div className="upload-group">
                    <h3>Shop Logo</h3>

                    {/* Image Input Type Toggle */}
                    {isEditing && (
                      <div className="image-input-toggle">
                        <button
                          className={`toggle-btn ${imageInputType.logo === 'file' ? 'active' : ''}`}
                          onClick={() => setImageInputType(prev => ({ ...prev, logo: 'file' }))}
                        >
                          <Camera size={16} />
                          Upload File
                        </button>
                        <button
                          className={`toggle-btn ${imageInputType.logo === 'url' ? 'active' : ''}`}
                          onClick={() => setImageInputType(prev => ({ ...prev, logo: 'url' }))}
                        >
                          <LinkIcon size={16} />
                          Image URL
                        </button>
                      </div>
                    )}

                    {/* Image Preview */}
                    <div className="image-upload">
                      <div className="image-container">
                        {shopData.logo ? (
                          <img src={shopData.logo} alt="Shop Logo" className="upload-preview logo" />
                        ) : (
                          <div className="placeholder-image logo">
                            <Image size={48} />
                            <p>No logo uploaded</p>
                          </div>
                        )}
                        {isEditing && imageInputType.logo === 'file' && (
                          <div className="upload-overlay">
                            <button className="upload-btn" onClick={() => handleImageClick('logo')} disabled={imageUploading.logo}>
                              <Camera size={16} />
                              {imageUploading.logo ? 'Uploading...' : (shopData.logo ? 'Change Logo' : 'Upload Logo')}
                            </button>
                            {shopData.logo && (
                              <button className="remove-btn" onClick={() => handleImageRemove('logo')}>
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* URL Input Field */}
                    {isEditing && imageInputType.logo === 'url' && (
                      <div className="url-input-section">
                        <div className="url-input-group">
                          <input
                            type="url"
                            className="form-input url-input"
                            placeholder="https://example.com/logo.jpg"
                            value={imageUrl.logo}
                            onChange={(e) => handleImageUrlChange('logo', e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleImageUrlSubmit('logo');
                              }
                            }}
                          />
                          <button
                            className="btn btn-primary url-submit-btn"
                            onClick={() => handleImageUrlSubmit('logo')}
                            disabled={urlLoading.logo || !imageUrl.logo.trim()}
                          >
                            {urlLoading.logo ? (
                              <>
                                <div className="loading-small"></div>
                                Loading...
                              </>
                            ) : (
                              <>
                                <LinkIcon size={16} />
                                Add URL
                              </>
                            )}
                          </button>
                        </div>
                        {shopData.logo && (
                          <button className="btn btn-secondary remove-url-btn" onClick={() => handleImageRemove('logo')}>
                            Remove Current Logo
                          </button>
                        )}
                      </div>
                    )}

                    <p className="upload-hint">Recommended: 200x200px, PNG or JPG (Max 5MB)</p>
                  </div>

                  {/* Banner Upload/URL Section */}
                  <div className="upload-group">
                    <h3>Shop Banner</h3>

                    {/* Image Input Type Toggle */}
                    {isEditing && (
                      <div className="image-input-toggle">
                        <button
                          className={`toggle-btn ${imageInputType.banner === 'file' ? 'active' : ''}`}
                          onClick={() => setImageInputType(prev => ({ ...prev, banner: 'file' }))}
                        >
                          <Camera size={16} />
                          Upload File
                        </button>
                        <button
                          className={`toggle-btn ${imageInputType.banner === 'url' ? 'active' : ''}`}
                          onClick={() => setImageInputType(prev => ({ ...prev, banner: 'url' }))}
                        >
                          <LinkIcon size={16} />
                          Image URL
                        </button>
                      </div>
                    )}

                    {/* Image Preview */}
                    <div className="image-upload">
                      <div className="image-container">
                        {shopData.banner ? (
                          <img src={shopData.banner} alt="Shop Banner" className="upload-preview banner" />
                        ) : (
                          <div className="placeholder-image banner">
                            <Image size={48} />
                            <p>No banner uploaded</p>
                          </div>
                        )}
                        {isEditing && imageInputType.banner === 'file' && (
                          <div className="upload-overlay">
                            <button className="upload-btn" onClick={() => handleImageClick('banner')} disabled={imageUploading.banner}>
                              <Image size={16} />
                              {imageUploading.banner ? 'Uploading...' : (shopData.banner ? 'Change Banner' : 'Upload Banner')}
                            </button>
                            {shopData.banner && (
                              <button className="remove-btn" onClick={() => handleImageRemove('banner')}>
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* URL Input Field */}
                    {isEditing && imageInputType.banner === 'url' && (
                      <div className="url-input-section">
                        <div className="url-input-group">
                          <input
                            type="url"
                            className="form-input url-input"
                            placeholder="https://example.com/banner.jpg"
                            value={imageUrl.banner}
                            onChange={(e) => handleImageUrlChange('banner', e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleImageUrlSubmit('banner');
                              }
                            }}
                          />
                          <button
                            className="btn btn-primary url-submit-btn"
                            onClick={() => handleImageUrlSubmit('banner')}
                            disabled={urlLoading.banner || !imageUrl.banner.trim()}
                          >
                            {urlLoading.banner ? (
                              <>
                                <div className="loading-small"></div>
                                Loading...
                              </>
                            ) : (
                              <>
                                <LinkIcon size={16} />
                                Add URL
                              </>
                            )}
                          </button>
                        </div>
                        {shopData.banner && (
                          <button className="btn btn-secondary remove-url-btn" onClick={() => handleImageRemove('banner')}>
                            Remove Current Banner
                          </button>
                        )}
                      </div>
                    )}

                    <p className="upload-hint">Recommended: 1200x400px, PNG or JPG (Max 5MB)</p>
                  </div>
                </div>

                <div className="theme-colors">
                  <h3>Theme Colors</h3>
                  <div className="color-grid">
                    <div className="color-input">
                      <label>Primary Color</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={shopData.theme.primaryColor}
                          onChange={(e) => handleInputChange('theme', 'primaryColor', e.target.value)}
                          disabled={!isEditing}
                        />
                        <span>{shopData.theme.primaryColor}</span>
                      </div>
                    </div>
                    <div className="color-input">
                      <label>Secondary Color</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={shopData.theme.secondaryColor}
                          onChange={(e) => handleInputChange('theme', 'secondaryColor', e.target.value)}
                          disabled={!isEditing}
                        />
                        <span>{shopData.theme.secondaryColor}</span>
                      </div>
                    </div>
                    <div className="color-input">
                      <label>Accent Color</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={shopData.theme.accentColor}
                          onChange={(e) => handleInputChange('theme', 'accentColor', e.target.value)}
                          disabled={!isEditing}
                        />
                        <span>{shopData.theme.accentColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Policies Section */}
            {activeSection === 'policies' && (
              <div className="section">
                <h2>Shop Policies</h2>

                <div className="form-group">
                  <label htmlFor="shippingPolicy" className="form-label">Shipping Policy</label>
                  <textarea
                    id="shippingPolicy"
                    value={shopData.policies.shipping}
                    onChange={(e) => handleInputChange('policies', 'shipping', e.target.value)}
                    className="form-textarea"
                    disabled={!isEditing}
                    rows="3"
                    placeholder="Describe your shipping methods, costs, and delivery times..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="returnPolicy" className="form-label">Return Policy</label>
                  <textarea
                    id="returnPolicy"
                    value={shopData.policies.returns}
                    onChange={(e) => handleInputChange('policies', 'returns', e.target.value)}
                    className="form-textarea"
                    disabled={!isEditing}
                    rows="3"
                    placeholder="Explain your return process, timeframes, and conditions..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="exchangePolicy" className="form-label">Exchange Policy</label>
                  <textarea
                    id="exchangePolicy"
                    value={shopData.policies.exchange}
                    onChange={(e) => handleInputChange('policies', 'exchange', e.target.value)}
                    className="form-textarea"
                    disabled={!isEditing}
                    rows="3"
                    placeholder="Detail your exchange procedures and requirements..."
                  />
                </div>
              </div>
            )}

            {/* Social Links Section */}
            {activeSection === 'social' && (
              <div className="section">
                <h2>Social Media & Links</h2>

                <div className="form-group">
                  <label htmlFor="website" className="form-label">Website</label>
                  <input
                    type="url"
                    id="website"
                    value={shopData.social.website}
                    onChange={(e) => handleInputChange('social', 'website', e.target.value)}
                    className="form-input"
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="facebook" className="form-label">Facebook</label>
                  <input
                    type="text"
                    id="facebook"
                    value={shopData.social.facebook}
                    onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                    className="form-input"
                    disabled={!isEditing}
                    placeholder="your-page-name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="twitter" className="form-label">Twitter</label>
                  <input
                    type="text"
                    id="twitter"
                    value={shopData.social.twitter}
                    onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                    className="form-input"
                    disabled={!isEditing}
                    placeholder="@yourusername"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="instagram" className="form-label">Instagram</label>
                  <input
                    type="text"
                    id="instagram"
                    value={shopData.social.instagram}
                    onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                    className="form-input"
                    disabled={!isEditing}
                    placeholder="yourusername"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerShop;
