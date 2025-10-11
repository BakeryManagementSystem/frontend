import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
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
  CheckCircle
} from 'lucide-react';
import './SellerProfile.css';

const SellerProfile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    avatar: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getUserProfile();
      setProfileData({
        name: response.name || '',
        email: response.email || '',
        phone: response.phone || '',
        date_of_birth: response.date_of_birth || '',
        avatar: response.avatar || '',
        address: response.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setErrors({ general: 'Failed to load profile data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
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

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    return newErrors;
  };

  const handleProfileSubmit = async () => {
    const formErrors = validateProfile();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      // Simulate API call
      await ApiService.updateUserProfile(profileData);

      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!passwordData.current_password) {
      newErrors.current_password = 'Current password is required';
    }
    if (!passwordData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
    }
    if (!passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Please confirm your password';
    } else if (passwordData.new_password !== passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      await ApiService.updateUserPassword(passwordData);

      setShowPasswordForm(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ password: 'Failed to update password. Please try again.' });
    } finally {
      setSaving(false);
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

          {/* Personal Information Tab */}
          <div className="tab-content">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button
                  className="btn btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
            </div>

            <div className="avatar-section">
              <div className="avatar-container">
                <div className="avatar-icon">
                  <User size={48} />
                </div>
              </div>
              <div className="avatar-info">
                <h3>{profileData.name}</h3>
                <p>{profileData.email}</p>
                <span className="seller-since">
                  Seller since {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                </span>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  disabled={!isEditing}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={!isEditing}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  disabled={!isEditing}
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.street" className="form-label">Street Address</label>
              <input
                type="text"
                id="address.street"
                value={profileData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="address.city" className="form-label">City</label>
                <input
                  type="text"
                  id="address.city"
                  value={profileData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.state" className="form-label">State</label>
                <input
                  type="text"
                  id="address.state"
                  value={profileData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.zipCode" className="form-label">ZIP Code</label>
                <input
                  type="text"
                  id="address.zipCode"
                  value={profileData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                    fetchProfile();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleProfileSubmit}
                  disabled={saving}
                >
                  {saving ? (
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

          {/* Security Tab */}
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
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      className={`form-input ${errors.current_password ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.current_password && <div className="error-message">{errors.current_password}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      className={`form-input ${errors.new_password ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.new_password && <div className="error-message">{errors.new_password}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      name="new_password_confirmation"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordChange}
                      className={`form-input ${errors.new_password_confirmation ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.new_password_confirmation && <div className="error-message">{errors.new_password_confirmation}</div>}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        current_password: '',
                        new_password: '',
                        new_password_confirmation: ''
                      });
                      setErrors({});
                    }}
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
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
