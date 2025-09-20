// API service for backend communication
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle different types of errors
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 422) {
          // Validation errors from Laravel
          const validationErrors = errorData.errors || {};
          const firstError = Object.values(validationErrors)[0];
          throw new Error(firstError ? firstError[0] : 'Validation failed');
        }

        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication API
  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  async getUser() {
    return this.request('/user');
  }

  // Products API
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Categories API
  async getCategories() {
    return this.request('/categories');
  }

  // Bakery Shops API
  async getBakeryShops(params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/bakery-shops${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  // Shop/User profiles API
  async getShopProfile(ownerId) {
    return this.request(`/shops/${ownerId}`);
  }

  // Wishlist API
  async getWishlist() {
    return this.request('/buyer/wishlist');
  }

  async addToWishlist(productId) {
    return this.request('/buyer/wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/buyer/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  async checkWishlist(productId) {
    return this.request(`/buyer/wishlist/check/${productId}`);
  }

  // Orders API
  async createOrder(orderData) {
    return this.request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Buyer-specific APIs
  async getBuyerDashboard() {
    return this.request('/buyer/dashboard');
  }

  async getBuyerOrders(params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/buyer/orders${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getBuyerOrder(orderId) {
    return this.request(`/buyer/orders/${orderId}`);
  }

  async cancelBuyerOrder(orderId) {
    return this.request(`/buyer/orders/${orderId}/cancel`, {
      method: 'PATCH',
    });
  }

  async getBuyerOrderStats() {
    return this.request('/buyer/orders/stats');
  }

  // User Profile APIs
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateUserPassword(passwordData) {
    return this.request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getUserAddresses() {
    return this.request('/user/addresses');
  }

  async updateUserAddress(addressId, addressData) {
    return this.request(`/user/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  // Seller/Owner Orders API
  async getSellerOrders(params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/seller/orders${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async updateSellerOrderStatus(orderId, status) {
    return this.request(`/seller/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getSellerOrderStats() {
    return this.request('/seller/orders/stats');
  }

  // Seller Dashboard API
  async getSellerDashboard() {
    return this.request('/seller/dashboard');
  }

  async getSellerStats() {
    return this.request('/seller/stats');
  }

  // Seller Products API
  async getSellerProducts(params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/seller/products${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async createSellerProduct(productData) {
    // Handle FormData for file uploads
    const headers = productData instanceof FormData ? {} : { 'Content-Type': 'application/json' };
    const body = productData instanceof FormData ? productData : JSON.stringify(productData);

    return this.request('/seller/products', {
      method: 'POST',
      headers,
      body,
    });
  }

  async getSellerProduct(id) {
    return this.request(`/seller/products/${id}`);
  }

  async updateSellerProduct(id, productData) {
    // Handle FormData for file uploads
    const headers = productData instanceof FormData ? {} : { 'Content-Type': 'application/json' };
    const body = productData instanceof FormData ? productData : JSON.stringify(productData);

    return this.request(`/seller/products/${id}`, {
      method: 'POST', // Laravel handles PUT with FormData via POST with _method
      headers: {
        ...headers,
        ...(productData instanceof FormData && { 'X-HTTP-Method-Override': 'PUT' })
      },
      body,
    });
  }

  async updateProduct(id, productData) {
    // Generic product update method for EditProduct component
    return this.updateSellerProduct(id, productData);
  }

  // Shop Management API
  async getSellerShop() {
    return this.request('/owner/shop');
  }

  async updateSellerShop(shopData) {
    return this.request('/owner/shop', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });
  }

  async getSellerShopStats() {
    return this.request('/owner/shop/stats');
  }

  async uploadShopImage(imageData) {
    return this.request('/owner/shop/upload', {
      method: 'POST',
      body: imageData, // FormData for file upload
      headers: {
        // Remove Content-Type to let browser set it for FormData
        'Accept': 'application/json',
      },
    });
  }

  // Notifications API
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }

  async deleteNotification(notificationId) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  // Payment API
  async processPayment(paymentData) {
    return this.request('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }
}

export default new ApiService();
