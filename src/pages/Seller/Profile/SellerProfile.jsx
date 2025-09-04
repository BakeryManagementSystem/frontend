import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Edit,
  Eye,
  EyeOff,
  AlertCircle,
  Store,
  DollarSign,
  FileText,
  CreditCard
} from 'lucide-react';
import './SellerProfile.css';

const SellerProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      avatar: ''
    },
    business: {
      businessName: '',
      businessType: '',
      taxId: '',
      website: '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    banking: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      routingNumber: ''
    }
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState({ personal: false, business: false, banking: false });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    // Simulate API call with mock data
    setTimeout(() => {
      setProfileData({
        personal: {
          name: user?.name || 'Maria Rodriguez',
          email: user?.email || 'maria@sweetdreamsbakery.com',
          phone: '+1 (555) 234-5678',
          avatar: '/placeholder-baker-avatar.jpg'
        },
        business: {
          businessName: 'Sweet Dreams Bakery',
          businessType: 'LLC',
          taxId: '12-3456789',
          website: 'https://sweetdreamsbakery.com',
          description: 'Family-owned artisan bakery specializing in traditional European breads, custom wedding cakes, and seasonal pastries. We pride ourselves on using organic ingredients and time-honored baking techniques.',
          address: {
            street: '456 Main Street',
            city: 'Downtown',
            state: 'CA',
            zipCode: '90210',
            country: 'United States'
          }
        },
        banking: {
          accountHolderName: 'Sweet Dreams Bakery LLC',
          bankName: 'Community First Bank',
          accountNumber: '****1234',
          routingNumber: '****5678'
        }
      });
    }, 500);
  };

  const handleInputChange = (section, field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          address: {
            ...prev[section].address,
            [addressField]: value
          }
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateSection = (section) => {
    const newErrors = {};

    if (section === 'personal') {
      if (!profileData.personal.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!profileData.personal.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(profileData.personal.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!profileData.personal.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    } else if (section === 'business') {
      if (!profileData.business.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!profileData.business.businessType.trim()) {
        newErrors.businessType = 'Business type is required';
      }
      if (!profileData.business.taxId.trim()) {
        newErrors.taxId = 'Tax ID is required';
      }
    } else if (section === 'banking') {
      if (!profileData.banking.accountHolderName.trim()) {
        newErrors.accountHolderName = 'Account holder name is required';
      }
      if (!profileData.banking.bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }
    }

    return newErrors;
  };

  const handleSectionSubmit = async (section) => {
    const formErrors = validateSection(section);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsEditing(prev => ({ ...prev, [section]: false }));
      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ general: `Failed to update ${section} information. Please try again.` });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ password: 'Failed to update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="seller-profile">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Seller Profile</h1>
          <p>Manage your seller account and business information</p>
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
            <AlertCircle size={16} />
            {errors.general}
          </div>
        )}

        <div className="profile-content">
          {/* Profile Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={16} />
              Personal Info
            </button>
            <button
              className={`tab-btn ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              <Store size={16} />
              Business Info
            </button>
            <button
              className={`tab-btn ${activeTab === 'banking' ? 'active' : ''}`}
              onClick={() => setActiveTab('banking')}
            >
              <CreditCard size={16} />
              Banking Info
            </button>
            <button
              className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <AlertCircle size={16} />
              Security
            </button>
          </div>

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing.personal && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsEditing(prev => ({ ...prev, personal: true }))}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                )}
              </div>

              <div className="avatar-section">
                <div className="avatar-container">
                  <img
                    src={profileData.personal.avatar || '/placeholder-avatar.jpg'}
                    alt="Profile Avatar"
                    className="avatar-image"
                  />
                  <button className="avatar-edit-btn">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="avatar-info">
                  <h3>{profileData.personal.name}</h3>
                  <p>{profileData.personal.email}</p>
                  <span className="seller-since">Seller since January 2024</span>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.personal.name}
                    onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    disabled={!isEditing.personal}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={!isEditing.personal}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    disabled={!isEditing.personal}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>

              {isEditing.personal && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(prev => ({ ...prev, personal: false }));
                      setErrors({});
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSectionSubmit('personal')}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Business Information Tab */}
          {activeTab === 'business' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Business Information</h2>
                {!isEditing.business && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsEditing(prev => ({ ...prev, business: true }))}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="businessName" className="form-label">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    value={profileData.business.businessName}
                    onChange={(e) => handleInputChange('business', 'businessName', e.target.value)}
                    className={`form-input ${errors.businessName ? 'error' : ''}`}
                    disabled={!isEditing.business}
                  />
                  {errors.businessName && <div className="error-message">{errors.businessName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="businessType" className="form-label">Business Type</label>
                  <select
                    id="businessType"
                    value={profileData.business.businessType}
                    onChange={(e) => handleInputChange('business', 'businessType', e.target.value)}
                    className={`form-select ${errors.businessType ? 'error' : ''}`}
                    disabled={!isEditing.business}
                  >
                    <option value="">Select Type</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                  </select>
                  {errors.businessType && <div className="error-message">{errors.businessType}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="taxId" className="form-label">Tax ID / EIN</label>
                  <input
                    type="text"
                    id="taxId"
                    value={profileData.business.taxId}
                    onChange={(e) => handleInputChange('business', 'taxId', e.target.value)}
                    className={`form-input ${errors.taxId ? 'error' : ''}`}
                    disabled={!isEditing.business}
                  />
                  {errors.taxId && <div className="error-message">{errors.taxId}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="website" className="form-label">Website (Optional)</label>
                  <input
                    type="url"
                    id="website"
                    value={profileData.business.website}
                    onChange={(e) => handleInputChange('business', 'website', e.target.value)}
                    className="form-input"
                    disabled={!isEditing.business}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Business Description</label>
                <textarea
                  id="description"
                  value={profileData.business.description}
                  onChange={(e) => handleInputChange('business', 'description', e.target.value)}
                  className="form-textarea"
                  disabled={!isEditing.business}
                  rows="4"
                />
              </div>

              <h3>Business Address</h3>
              <div className="form-group">
                <label htmlFor="address.street" className="form-label">Street Address</label>
                <input
                  type="text"
                  id="address.street"
                  value={profileData.business.address.street}
                  onChange={(e) => handleInputChange('business', 'address.street', e.target.value)}
                  className="form-input"
                  disabled={!isEditing.business}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="address.city" className="form-label">City</label>
                  <input
                    type="text"
                    id="address.city"
                    value={profileData.business.address.city}
                    onChange={(e) => handleInputChange('business', 'address.city', e.target.value)}
                    className="form-input"
                    disabled={!isEditing.business}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.state" className="form-label">State</label>
                  <input
                    type="text"
                    id="address.state"
                    value={profileData.business.address.state}
                    onChange={(e) => handleInputChange('business', 'address.state', e.target.value)}
                    className="form-input"
                    disabled={!isEditing.business}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.zipCode" className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    value={profileData.business.address.zipCode}
                    onChange={(e) => handleInputChange('business', 'address.zipCode', e.target.value)}
                    className="form-input"
                    disabled={!isEditing.business}
                  />
                </div>
              </div>

              {isEditing.business && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(prev => ({ ...prev, business: false }));
                      setErrors({});
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSectionSubmit('business')}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Banking Information Tab */}
          {activeTab === 'banking' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Banking Information</h2>
                {!isEditing.banking && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsEditing(prev => ({ ...prev, banking: true }))}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                )}
              </div>

              <div className="banking-notice">
                <AlertCircle size={16} />
                <span>Banking information is encrypted and secure. This is used for payment processing.</span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="accountHolderName" className="form-label">Account Holder Name</label>
                  <input
                    type="text"
                    id="accountHolderName"
                    value={profileData.banking.accountHolderName}
                    onChange={(e) => handleInputChange('banking', 'accountHolderName', e.target.value)}
                    className={`form-input ${errors.accountHolderName ? 'error' : ''}`}
                    disabled={!isEditing.banking}
                  />
                  {errors.accountHolderName && <div className="error-message">{errors.accountHolderName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="bankName" className="form-label">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    value={profileData.banking.bankName}
                    onChange={(e) => handleInputChange('banking', 'bankName', e.target.value)}
                    className={`form-input ${errors.bankName ? 'error' : ''}`}
                    disabled={!isEditing.banking}
                  />
                  {errors.bankName && <div className="error-message">{errors.bankName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="accountNumber" className="form-label">Account Number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={profileData.banking.accountNumber}
                    onChange={(e) => handleInputChange('banking', 'accountNumber', e.target.value)}
                    className="form-input"
                    disabled={!isEditing.banking}
                    placeholder={!isEditing.banking ? profileData.banking.accountNumber : 'Enter account number'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="routingNumber" className="form-label">Routing Number</label>
                  <input
                    type="text"
                    id="routingNumber"
                    value={profileData.banking.routingNumber}
                    onChange={(e) => handleInputChange('banking', 'routingNumber', e.target.value)}
                    className="form-input"
                    disabled={!isEditing.banking}
                    placeholder={!isEditing.banking ? profileData.banking.routingNumber : 'Enter routing number'}
                  />
                </div>
              </div>

              {isEditing.banking && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(prev => ({ ...prev, banking: false }));
                      setErrors({});
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSectionSubmit('banking')}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Security Settings</h2>
                <button
                  className="btn btn-outline"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  Change Password
                </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  {errors.password && (
                    <div className="alert alert-error">
                      <AlertCircle size={16} />
                      {errors.password}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`form-input ${errors.newPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setErrors({});
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="loading"></div>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="security-info">
                <h3>Account Security</h3>
                <div className="security-item">
                  <span>Two-Factor Authentication</span>
                  <button className="btn btn-outline btn-sm">Enable</button>
                </div>
                <div className="security-item">
                  <span>Login Activity</span>
                  <button className="btn btn-outline btn-sm">View History</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
