import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import {
  Store,
  Edit3,
  Save,
  Camera,
  MapPin,
  Clock,
  Star,
  Users,
  Package,
  TrendingUp
} from 'lucide-react';

const ShopManagement = () => {
  const { user } = useAuth();
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    banner: '',
    openingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: false }
    },
    categories: [],
    features: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shopStats, setShopStats] = useState({});

  // Mock data - replace with API call
  useEffect(() => {
    const fetchShopData = async () => {
      setTimeout(() => {
        setShopData({
          name: 'Golden Grain Bakery',
          description: 'A family-owned bakery specializing in artisan breads and traditional pastries. We use only the finest ingredients and time-honored techniques to create exceptional baked goods.',
          address: '123 Bakery Street, Downtown Dhaka, 1215',
          phone: '+880 1234-567890',
          email: 'info@goldengrainbakery.com',
          website: 'www.goldengrainbakery.com',
          logo: '/api/placeholder/150/150',
          banner: '/api/placeholder/800/300',
          openingHours: {
            monday: { open: '08:00', close: '18:00', closed: false },
            tuesday: { open: '08:00', close: '18:00', closed: false },
            wednesday: { open: '08:00', close: '18:00', closed: false },
            thursday: { open: '08:00', close: '18:00', closed: false },
            friday: { open: '08:00', close: '18:00', closed: false },
            saturday: { open: '09:00', close: '17:00', closed: false },
            sunday: { open: '10:00', close: '16:00', closed: false }
          },
          categories: ['Bread', 'Pastries', 'Cakes', 'Cookies'],
          features: ['Organic Ingredients', 'Custom Orders', 'Same Day Delivery', 'Gluten-Free Options']
        });

        setShopStats({
          rating: 4.8,
          totalReviews: 156,
          totalOrders: 1247,
          customers: 89,
          responseTime: '2 hours'
        });

        setLoading(false);
      }, 1000);
    };

    fetchShopData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save shop data
    setIsEditing(false);
  };

  const handleImageUpload = (type) => {
    // Handle image upload logic
    console.log(`Upload ${type} image`);
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3">Loading shop data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Management</h1>
          <p className="text-gray-600">Manage your shop information and settings</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-primary"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Shop
            </>
          )}
        </button>
      </div>

      {/* Shop Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{shopStats.rating}</p>
          <p className="text-sm text-gray-500">Rating</p>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{shopStats.totalReviews}</p>
          <p className="text-sm text-gray-500">Reviews</p>
        </div>
        <div className="card text-center">
          <Package className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{shopStats.totalOrders}</p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{shopStats.customers}</p>
          <p className="text-sm text-gray-500">Customers</p>
        </div>
        <div className="card text-center">
          <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{shopStats.responseTime}</p>
          <p className="text-sm text-gray-500">Response Time</p>
        </div>
      </div>

      {/* Shop Information Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

          {/* Banner Image */}
          <div className="mb-6">
            <label className="form-label">Shop Banner</label>
            <div className="relative">
              <img
                src={shopData.banner}
                alt="Shop Banner"
                className="w-full h-48 object-cover rounded-lg"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleImageUpload('banner')}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-60 transition-colors rounded-lg"
                >
                  <Camera className="w-8 h-8" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <label className="form-label">Shop Logo</label>
              <div className="flex items-center space-x-4">
                <img
                  src={shopData.logo}
                  alt="Shop Logo"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleImageUpload('logo')}
                    className="btn btn-secondary"
                  >
                    <Camera className="w-4 h-4" />
                    Change Logo
                  </button>
                )}
              </div>
            </div>

            {/* Shop Name */}
            <div className="form-group">
              <label className="form-label">Shop Name</label>
              <input
                type="text"
                value={shopData.name}
                onChange={(e) => setShopData(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={shopData.description}
              onChange={(e) => setShopData(prev => ({ ...prev, description: e.target.value }))}
              className="form-textarea"
              rows="4"
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={shopData.phone}
                onChange={(e) => setShopData(prev => ({ ...prev, phone: e.target.value }))}
                className="form-input"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={shopData.email}
                onChange={(e) => setShopData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="url"
                value={shopData.website}
                onChange={(e) => setShopData(prev => ({ ...prev, website: e.target.value }))}
                className="form-input"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                value={shopData.address}
                onChange={(e) => setShopData(prev => ({ ...prev, address: e.target.value }))}
                className="form-input"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Opening Hours</h2>
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="font-medium text-gray-900 capitalize">{day}</span>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shopData.openingHours[day].closed}
                    onChange={(e) => setShopData(prev => ({
                      ...prev,
                      openingHours: {
                        ...prev.openingHours,
                        [day]: { ...prev.openingHours[day], closed: e.target.checked }
                      }
                    }))}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Closed</span>
                </label>
                {!shopData.openingHours[day].closed && (
                  <>
                    <input
                      type="time"
                      value={shopData.openingHours[day].open}
                      onChange={(e) => setShopData(prev => ({
                        ...prev,
                        openingHours: {
                          ...prev.openingHours,
                          [day]: { ...prev.openingHours[day], open: e.target.value }
                        }
                      }))}
                      disabled={!isEditing}
                      className="form-input w-auto"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={shopData.openingHours[day].close}
                      onChange={(e) => setShopData(prev => ({
                        ...prev,
                        openingHours: {
                          ...prev.openingHours,
                          [day]: { ...prev.openingHours[day], close: e.target.value }
                        }
                      }))}
                      disabled={!isEditing}
                      className="form-input w-auto"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Categories & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {shopData.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-color text-white rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
            {isEditing && (
              <button
                type="button"
                className="mt-4 btn btn-secondary btn-sm"
              >
                Manage Categories
              </button>
            )}
          </div>

          {/* Features */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop Features</h2>
            <div className="flex flex-wrap gap-2">
              {shopData.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
            {isEditing && (
              <button
                type="button"
                className="mt-4 btn btn-secondary btn-sm"
              >
                Manage Features
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ShopManagement;
