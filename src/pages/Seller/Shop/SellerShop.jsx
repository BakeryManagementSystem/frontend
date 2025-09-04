import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
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
  TrendingUp
} from 'lucide-react';
import './SellerShop.css';

const SellerShop = () => {
  const { user } = useAuth();
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b'
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

  const [shopStats, setShopStats] = useState({
    totalProducts: 32,
    totalViews: 8750,
    totalFollowers: 892,
    averageRating: 4.8,
    totalSales: 1245,
    monthlyRevenue: 18650.00
  });

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    // Simulate API call with mock data
    setTimeout(() => {
      setShopData({
        name: 'Sweet Dreams Bakery',
        description: 'Artisan bakery specializing in fresh-baked breads, pastries, and custom cakes. We use only the finest ingredients and traditional baking methods to create delicious treats for every occasion.',
        logo: '/placeholder-bakery-logo.jpg',
        banner: '/placeholder-bakery-banner.jpg',
        theme: {
          primaryColor: '#6639a6',
          secondaryColor: '#7f4fc3',
          accentColor: '#9b75d0'
        },
        policies: {
          shipping: 'Free delivery for orders over $30 within 5 miles. Fresh items delivered same day. Custom cakes require 48-hour advance notice.',
          returns: 'Fresh bakery items must be returned within 24 hours if unsatisfactory. Custom orders are non-refundable unless there is a quality issue.',
          exchange: 'We accept exchanges for packaged goods within 3 days. Fresh items can only be exchanged if there is a quality concern.'
        },
        social: {
          website: 'https://sweetdreamsbakery.com',
          facebook: 'sweetdreamsbakery',
          twitter: '@sweetdreams_bakery',
          instagram: 'sweetdreamsbakery'
        },
        settings: {
          showContactInfo: true,
          showReviews: true,
          allowMessages: true,
          featuredProducts: [1, 2, 3]
        }
      });
    }, 500);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsEditing(false);
      setSuccess('Shop updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ general: 'Failed to update shop. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Open shop preview in new tab
    window.open(`/shop/${user?.id}`, '_blank');
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
              <div className="stat-value">{shopStats.totalProducts}</div>
              <div className="stat-label">Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Eye />
            </div>
            <div className="stat-content">
              <div className="stat-value">{shopStats.totalViews.toLocaleString()}</div>
              <div className="stat-label">Shop Views</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-content">
              <div className="stat-value">{shopStats.totalFollowers.toLocaleString()}</div>
              <div className="stat-label">Followers</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Star />
            </div>
            <div className="stat-content">
              <div className="stat-value">{shopStats.averageRating}</div>
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
                  <div className="upload-group">
                    <h3>Shop Logo</h3>
                    <div className="image-upload">
                      <img src={shopData.logo} alt="Shop Logo" className="upload-preview logo" />
                      {isEditing && (
                        <button className="upload-btn">
                          <Camera size={16} />
                          Change Logo
                        </button>
                      )}
                    </div>
                    <p className="upload-hint">Recommended: 200x200px, PNG or JPG</p>
                  </div>

                  <div className="upload-group">
                    <h3>Shop Banner</h3>
                    <div className="image-upload">
                      <img src={shopData.banner} alt="Shop Banner" className="upload-preview banner" />
                      {isEditing && (
                        <button className="upload-btn">
                          <Image size={16} />
                          Change Banner
                        </button>
                      )}
                    </div>
                    <p className="upload-hint">Recommended: 1200x400px, PNG or JPG</p>
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
