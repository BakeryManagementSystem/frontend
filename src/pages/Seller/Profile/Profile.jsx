import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Shield,
  Camera,
  Building,
  Globe,
  Calendar,
  Star,
  Award
} from 'lucide-react';

const SellerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    businessName: '',
    businessType: '',
    businessAddress: '',
    website: '',
    taxId: '',
    licenseNumber: '',
    avatar: ''
  });
  const [businessStats, setBusinessStats] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchProfile = async () => {
      setTimeout(() => {
        setProfile({
          name: user?.name || 'Golden Grain Bakery Owner',
          email: user?.email || 'owner@goldengrainbakery.com',
          phone: '+880 1234-567890',
          dateOfBirth: '1985-03-20',
          gender: 'male',
          businessName: 'Golden Grain Bakery',
          businessType: 'Bakery & Confectionery',
          businessAddress: '123 Bakery Street, Downtown Dhaka, 1215',
          website: 'www.goldengrainbakery.com',
          taxId: 'TAX-123456789',
          licenseNumber: 'BKY-LIC-456789',
          avatar: '/api/placeholder/150/150'
        });

        setBusinessStats({
          memberSince: '2022-01-15',
          totalOrders: 1247,
          rating: 4.8,
          totalReviews: 156,
          completionRate: 98.5,
          responseTime: '2 hours',
          verificationStatus: 'verified'
        });

        setLoading(false);
      }, 1000);
    };

    fetchProfile();
  }, [user]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Save profile changes
    setIsEditingProfile(false);
  };

  const handleAvatarUpload = () => {
    // Handle avatar upload logic
    console.log('Upload avatar');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Profile</h1>
          <p className="text-gray-600">Manage your personal and business information</p>
        </div>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="btn btn-primary"
        >
          {isEditingProfile ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditingProfile && (
              <button
                onClick={handleAvatarUpload}
                className="absolute bottom-0 right-0 p-2 bg-primary-color text-white rounded-full hover:bg-primary-dark transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              {businessStats.verificationStatus === 'verified' && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-1">{profile.businessName}</p>
            <p className="text-sm text-gray-500">{profile.businessType}</p>

            {/* Quick Stats */}
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{businessStats.rating}</span>
                <span className="text-gray-500 text-sm">({businessStats.totalReviews} reviews)</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{businessStats.totalOrders}</span> orders completed
              </div>
              <div className="text-sm text-gray-600">
                Member since {new Date(businessStats.memberSince).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Award className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{businessStats.completionRate}%</p>
          <p className="text-sm text-gray-500">Order Completion Rate</p>
        </div>
        <div className="card text-center">
          <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{businessStats.rating}</p>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>
        <div className="card text-center">
          <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{businessStats.responseTime}</p>
          <p className="text-sm text-gray-500">Avg Response Time</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {new Date(profile.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
        </div>

        {isEditingProfile ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Business Type</label>
                <select
                  value={profile.businessType}
                  onChange={(e) => setProfile(prev => ({ ...prev, businessType: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select Business Type</option>
                  <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                  <option value="Cafe & Bakery">Cafe & Bakery</option>
                  <option value="Pastry Shop">Pastry Shop</option>
                  <option value="Cake Shop">Cake Shop</option>
                  <option value="Artisan Bakery">Artisan Bakery</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  className="form-input"
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tax ID</label>
                <input
                  type="text"
                  value={profile.taxId}
                  onChange={(e) => setProfile(prev => ({ ...prev, taxId: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">Business Address</label>
                <textarea
                  value={profile.businessAddress}
                  onChange={(e) => setProfile(prev => ({ ...prev, businessAddress: e.target.value }))}
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="font-medium text-gray-900">{profile.businessName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Business Type</p>
                <p className="font-medium text-gray-900">{profile.businessType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a
                  href={`https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-color hover:text-primary-dark"
                >
                  {profile.website}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tax ID</p>
                <p className="font-medium text-gray-900">{profile.taxId}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 md:col-span-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Business Address</p>
                <p className="font-medium text-gray-900">{profile.businessAddress}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Security */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
          <Shield className="w-5 h-5 text-green-600" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Last changed 45 days ago</p>
            </div>
            <button className="btn btn-secondary">Change Password</button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="btn btn-outline">Enable 2FA</button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Business Verification</p>
              <p className="text-sm text-gray-500">Verify your business documents</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Order Notifications</p>
              <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Low Stock Alerts</p>
              <p className="text-sm text-gray-500">Get alerts when products are running low</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-500">Receive tips and promotional content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-500">Receive weekly business performance reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-color/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-color"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
