// AI Service for handling both Gemini API and local database queries
import apiService from './api.js';

class AIService {
  constructor() {
    // Use the existing apiService instance instead of creating a new one
    this.apiService = apiService;
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  // Filter off-topic prompts
  isRelevantToBakery(prompt) {
    const bakeryKeywords = [
      'bakery', 'bread', 'cake', 'pastry', 'cookies', 'muffin', 'croissant',
      'order', 'purchase', 'buy', 'product', 'price', 'delivery', 'shop',
      'account', 'profile', 'balance', 'history', 'inventory', 'stock',
      'business', 'sales', 'revenue', 'customer', 'menu', 'ingredient',
      'baking', 'fresh', 'oven', 'sweet', 'dessert', 'flour', 'sugar'
    ];

    const prompt_lower = prompt.toLowerCase();
    return bakeryKeywords.some(keyword => prompt_lower.includes(keyword)) ||
           prompt_lower.includes('help') ||
           prompt_lower.includes('what') ||
           prompt_lower.includes('how') ||
           prompt_lower.includes('can you');
  }

  // Get context data from database
  async getContextData(isAuthenticated) {
    try {
      const context = {
        products: [],
        categories: [],
        shopInfo: null
      };

      // Get basic shop information and products (always available)
      try {
        const productsResponse = await this.apiService.request('/products');
        context.products = productsResponse.data || [];
      } catch (error) {
        console.warn('Could not fetch products:', error);
      }

      try {
        const categoriesResponse = await this.apiService.request('/categories');
        context.categories = categoriesResponse.data || [];
      } catch (error) {
        console.warn('Could not fetch categories:', error);
      }

      // If authenticated, get user-specific data
      if (isAuthenticated) {
        try {
          const userResponse = await this.apiService.request('/user/profile');
          context.user = userResponse.data || {};
        } catch (error) {
          console.warn('Could not fetch user data:', error);
        }

        try {
          const ordersResponse = await this.apiService.request('/user/orders');
          context.orders = ordersResponse.data || [];
        } catch (error) {
          console.warn('Could not fetch orders:', error);
        }

        try {
          const balanceResponse = await this.apiService.request('/user/balance');
          context.balance = balanceResponse.data || {};
        } catch (error) {
          console.warn('Could not fetch balance:', error);
        }
      }

      return context;
    } catch (error) {
      console.error('Error fetching context data:', error);
      return { products: [], categories: [] };
    }
  }

  // Generate system prompt based on user authentication status
  generateSystemPrompt(isAuthenticated, contextData) {
    let systemPrompt = `You are a helpful AI assistant for a bakery management system. 
    You should only answer questions related to bakery operations, products, orders, and general bakery information.
    If someone asks about topics unrelated to bakery business, politely redirect them to bakery-related topics.
    
    Available products: ${JSON.stringify(contextData.products?.slice(0, 10) || [])}
    Available categories: ${JSON.stringify(contextData.categories || [])}
    `;

    if (isAuthenticated && contextData.user) {
      systemPrompt += `
      The user is logged in. You can provide personalized information about their account.
      User information: ${JSON.stringify(contextData.user)}
      Recent orders: ${JSON.stringify(contextData.orders?.slice(0, 5) || [])}
      Account balance: ${JSON.stringify(contextData.balance || {})}
      
      You can help with:
      - Account information and order history
      - Product recommendations based on past orders
      - Order status and tracking
      - Account balance and payment information
      `;
    } else {
      systemPrompt += `
      The user is not logged in. You can only provide general information about:
      - Available products and their details
      - Shop information and services
      - General bakery information
      - How to place orders or create an account
      
      For account-specific questions, ask them to log in first.
      `;
    }

    return systemPrompt;
  }

  // Send message to AI and get response
  async sendMessage(userMessage) {
    // Check if the message is relevant to bakery business
    if (!this.isRelevantToBakery(userMessage)) {
      return {
        success: true,
        message: "I'm here to help you with bakery-related questions! I can assist you with information about our products, orders, account details (if you're logged in), and general bakery services. How can I help you with your bakery needs today?"
      };
    }

    try {
      const isAuthenticated = this.isAuthenticated();
      const contextData = await this.getContextData(isAuthenticated);
      const systemPrompt = this.generateSystemPrompt(isAuthenticated, contextData);

      // Try to handle simple queries with local data first
      const localResponse = this.handleLocalQueries(userMessage, contextData, isAuthenticated);
      if (localResponse) {
        return { success: true, message: localResponse };
      }

      // If no local response and Gemini API key is available, use Gemini
      if (this.geminiApiKey) {
        const geminiResponse = await this.queryGemini(systemPrompt, userMessage);
        return { success: true, message: geminiResponse };
      }

      // Fallback response
      return {
        success: true,
        message: "I'm here to help! Could you please be more specific about what you'd like to know about our bakery products or services?"
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      };
    }
  }

  // Handle simple queries with local data
  handleLocalQueries(message, contextData, isAuthenticated) {
    const message_lower = message.toLowerCase();

    // Product-related queries
    if (message_lower.includes('products') || message_lower.includes('what do you sell')) {
      const products = contextData.products || [];
      if (products.length > 0) {
        const productList = products.slice(0, 5).map(p => `${p.name} - $${p.price}`).join(', ');
        return `We have ${products.length} products available including: ${productList}. Would you like to know more about any specific product?`;
      }
    }

    // Category queries
    if (message_lower.includes('categories') || message_lower.includes('types')) {
      const categories = contextData.categories || [];
      if (categories.length > 0) {
        const categoryList = categories.map(c => c.name).join(', ');
        return `Our bakery offers products in these categories: ${categoryList}. What category interests you?`;
      }
    }

    // Account-specific queries (only for authenticated users)
    if (isAuthenticated) {
      if (message_lower.includes('my orders') || message_lower.includes('order history')) {
        const orders = contextData.orders || [];
        if (orders.length > 0) {
          const recentOrder = orders[0];
          return `Your most recent order was #${recentOrder.id} for $${recentOrder.total}. You have ${orders.length} total orders. Would you like more details about any specific order?`;
        } else {
          return "You haven't placed any orders yet. Browse our delicious products and place your first order!";
        }
      }

      if (message_lower.includes('balance') || message_lower.includes('account')) {
        const user = contextData.user || {};
        return `Hello ${user.name || 'there'}! Your account is active. How can I help you with your bakery needs today?`;
      }
    } else {
      if (message_lower.includes('my orders') || message_lower.includes('account') || message_lower.includes('balance')) {
        return "To view your account information and order history, please log in to your account first. If you don't have an account, you can easily create one!";
      }
    }

    return null; // No local response found
  }

  // Query Gemini API
  async queryGemini(systemPrompt, userMessage) {
    try {
      const response = await fetch(`${this.geminiBaseUrl}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser question: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        return generatedText.trim();
      }

      throw new Error('No response generated');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}

export default new AIService();
