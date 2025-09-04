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
  AlertCircle
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    dateOfBirth: '',
    avatar: ''
  });
  const [isEditing, setIsEditing] = useState(false);
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
        name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        dateOfBirth: '1990-05-15',
        avatar: '/placeholder-avatar.jpg'
      });
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
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
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
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

  const validatePassword = () => {
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

    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateProfile();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validatePassword();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
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
    <div className="profile-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
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
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-container">
              <img
                src={profileData.avatar || '/placeholder-avatar.jpg'}
                alt="Profile Avatar"
                className="avatar-image"
              />
              <button className="avatar-edit-btn">
                <Camera size={16} />
              </button>
            </div>
            <div className="avatar-info">
              <h3>{profileData.name}</h3>
              <p>{profileData.email}</p>
              <span className="member-since">Member since January 2024</span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button
                  className="btn btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={!isEditing}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    disabled={!isEditing}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address.street" className="form-label">Street Address</label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={profileData.address.street}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.city" className="form-label">City</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={profileData.address.city}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.state" className="form-label">State</label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={profileData.address.state}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.zipCode" className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={profileData.address.zipCode}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address.country" className="form-label">Country</label>
                <select
                  id="address.country"
                  name="address.country"
                  value={profileData.address.country}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={!isEditing}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                      fetchProfile(); // Reset form
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
            </form>
          </div>

          {/* Password Section */}
          <div className="password-section">
            <div className="section-header">
              <h2>Security</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
