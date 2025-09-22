// API service for backend communication
const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isOnline = true;
    this.mockData = this.initializeMockData();
    this.forceRealAPI = true; // Force real API calls for debugging
  }

  // Initialize mock data for offline mode
  initializeMockData() {
    return {
      products: [
        {
          id: 1,
          name: "Fresh Croissant",
          price: "3.50",
          image: "/images/croissant.jpg",
          category: "Pastries",
          description: "Buttery, flaky croissant baked fresh daily",
          availability: true,
          ingredients: ["Flour", "Butter", "Yeast", "Salt"]
        },
        {
          id: 2,
          name: "Chocolate Cake",
          price: "25.99",
          image: "/images/chocolate-cake.jpg",
          category: "Cakes",
          description: "Rich chocolate cake with dark chocolate frosting",
          availability: true,
          ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Butter"]
        },
        {
          id: 3,
          name: "Sourdough Bread",
          price: "4.75",
          image: "/images/sourdough.jpg",
          category: "Breads",
          description: "Artisan sourdough bread with crispy crust",
          availability: true,
          ingredients: ["Flour", "Water", "Salt", "Sourdough starter"]
        },
        {
          id: 4,
          name: "Blueberry Muffin",
          price: "2.25",
          image: "/images/blueberry-muffin.jpg",
          category: "Pastries",
          description: "Fluffy muffin loaded with fresh blueberries",
          availability: true,
          ingredients: ["Flour", "Blueberries", "Sugar", "Eggs", "Milk"]
        }
      ],
      categories: [
        { id: 1, name: "Breads", description: "Fresh baked breads" },
        { id: 2, name: "Cakes", description: "Custom and ready-made cakes" },
        { id: 3, name: "Pastries", description: "Delicious pastries and croissants" },
        { id: 4, name: "Cookies", description: "Homemade cookies" }
      ],
      user: {
        id: 1,
        name: "Demo User",
        email: "demo@bakery.com",
        user_type: "buyer"
      },
      orders: [
        {
          id: 1,
          total_amount: "15.75",
          status: "completed",
          created_at: "2024-01-15T10:30:00Z",
          items: [
            { product_name: "Croissant", quantity: 2, price: "3.50" },
            { product_name: "Coffee", quantity: 1, price: "8.75" }
          ]
        }
      ]
    };
  }

  // Check if backend is available
  async checkConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);
      this.isOnline = response.ok;
      return this.isOnline;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  async request(endpoint, options = {}) {
    // Check connection first
    if (!this.isOnline) {
      await this.checkConnection();
    }

    // If still offline, return mock data for GET requests
    if (!this.isOnline && (!options.method || options.method === 'GET')) {
      console.warn('Backend offline, using mock data for:', endpoint);
      return this.getMockResponse(endpoint);
    }

    // If offline and trying to POST/PUT/DELETE, throw meaningful error
    if (!this.isOnline) {
      throw new Error('Unable to connect to server. Please check your connection and try again.');
    }

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

      // If network error, switch to offline mode
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        this.isOnline = false;
        if (!options.method || options.method === 'GET') {
          console.warn('Network error, falling back to mock data for:', endpoint);
          return this.getMockResponse(endpoint);
        }
      }

      throw error;
    }
  }

  // Get mock response based on endpoint
  getMockResponse(endpoint) {
    if (endpoint.includes('/products')) {
      if (endpoint.includes('/products/') && !endpoint.includes('?')) {
        // Single product request
        const id = parseInt(endpoint.split('/products/')[1]);
        const product = this.mockData.products.find(p => p.id === id);
        return product ? { data: product } : { error: 'Product not found' };
      }
      // Products list
      return { data: this.mockData.products };
    }

    if (endpoint.includes('/categories')) {
      return { data: this.mockData.categories };
    }

    if (endpoint.includes('/user')) {
      return { user: this.mockData.user };
    }

    if (endpoint.includes('/orders')) {
      return { data: this.mockData.orders };
    }

    // Handle shop-related endpoints
    if (endpoint.includes('/owner/shop/stats')) {
      return {
        success: true,
        data: {
          total_products: 5,
          total_views: 1250,
          total_followers: 45,
          average_rating: 4.8,
          total_sales: 23,
          monthly_revenue: 485.75
        }
      };
    }

    if (endpoint.includes('/owner/shop')) {
      return {
        success: true,
        data: {
          name: "My Bakery Shop",
          description: "Welcome to my artisan bakery where we create fresh, delicious baked goods daily using traditional methods and the finest ingredients.",
          logo: null,
          banner: null,
          theme: {
            primaryColor: '#2563eb',
            secondaryColor: '#64748b',
            accentColor: '#f59e0b'
          },
          policies: {
            shipping: 'We offer local delivery within 10 miles for orders over $25.',
            returns: 'Returns accepted within 24 hours for non-perishable items only.',
            exchange: 'Exchanges available for damaged items with receipt.'
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
        }
      };
    }

    // Default empty response
    return { data: [], message: 'Offline mode - limited functionality' };
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
        // Remove Content-Type to let browser set it for FormData with boundary
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
  }

  async removeShopImage(imageType) {
    return this.request(`/owner/shop/remove/${imageType}`, {
      method: 'DELETE',
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
