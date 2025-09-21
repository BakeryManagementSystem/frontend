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

    // Common conversational responses that should be allowed
    const conversationalKeywords = [
      'yes', 'no', 'okay', 'ok', 'sure', 'please', 'thanks', 'thank you',
      'tell me more', 'more info', 'details', 'information', 'explain',
      'how much', 'when', 'where', 'who', 'what time', 'available'
    ];

    const prompt_lower = prompt.toLowerCase();

    // Check for bakery keywords
    const hasBakeryKeyword = bakeryKeywords.some(keyword => prompt_lower.includes(keyword));

    // Check for conversational keywords
    const hasConversationalKeyword = conversationalKeywords.some(keyword => prompt_lower.includes(keyword));

    // Check for general help keywords
    const hasHelpKeyword = prompt_lower.includes('help') ||
                          prompt_lower.includes('what') ||
                          prompt_lower.includes('how') ||
                          prompt_lower.includes('can you');

    return hasBakeryKeyword || hasConversationalKeyword || hasHelpKeyword;
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
        const productsResponse = await this.apiService.getProducts();
        context.products = productsResponse.data || [];
      } catch (error) {
        console.warn('Could not fetch products:', error);
        // Use fallback data for offline mode
        context.products = [
          { id: 1, name: "Fresh Croissant", price: "3.50", category: "Pastries" },
          { id: 2, name: "Chocolate Cake", price: "25.99", category: "Cakes" },
          { id: 3, name: "Sourdough Bread", price: "4.75", category: "Breads" }
        ];
      }

      try {
        const categoriesResponse = await this.apiService.getCategories();
        context.categories = categoriesResponse.data || [];
      } catch (error) {
        console.warn('Could not fetch categories:', error);
        // Use fallback data for offline mode
        context.categories = [
          { id: 1, name: "Breads" },
          { id: 2, name: "Cakes" },
          { id: 3, name: "Pastries" },
          { id: 4, name: "Cookies" }
        ];
      }

      // If authenticated, get user-specific data using existing endpoints
      if (isAuthenticated) {
        try {
          const userResponse = await this.apiService.getUser();
          context.user = userResponse.user || userResponse;
        } catch (error) {
          console.warn('Could not fetch user data:', error);
          // Use cached user data if available
          const cachedUser = localStorage.getItem('cached_user');
          if (cachedUser) {
            try {
              context.user = JSON.parse(cachedUser);
            } catch (e) {
              console.warn('Failed to parse cached user data');
            }
          }
        }

        try {
          const ordersResponse = await this.apiService.getOrders();
          context.orders = ordersResponse.data || ordersResponse || [];
        } catch (error) {
          console.warn('Could not fetch orders:', error);
          // Use fallback data for demonstration
          context.orders = [];
        }

        // Calculate balance info from available data - different for buyers vs sellers
        const orders = Array.isArray(context.orders) ? context.orders : [];
        if (orders.length > 0) {
          if (context.user?.user_type === 'buyer') {
            // Buyer stats: total orders placed and money spent
            context.balance = {
              total_orders: orders.length,
              total_spent: orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0),
              last_order_date: orders[0]?.created_at || null
            };
          } else if (context.user?.user_type === 'seller' || context.user?.user_type === 'owner') {
            // Seller/Owner stats: total sales and revenue
            context.balance = {
              total_sales: orders.length,
              total_revenue: orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0),
              last_sale_date: orders[0]?.created_at || null,
              pending_orders: orders.filter(order => order.status === 'pending').length
            };
          }
        } else {
          context.balance = {
            total_orders: 0,
            total_spent: 0,
            total_sales: 0,
            total_revenue: 0,
            last_order_date: null,
            last_sale_date: null,
            pending_orders: 0
          };
        }
      }

      return context;
    } catch (error) {
      console.error('Error fetching context data:', error);
      // Return minimal fallback data even if everything fails
      return {
        products: [
          { id: 1, name: "Fresh Croissant", price: "3.50", category: "Pastries" },
          { id: 2, name: "Chocolate Cake", price: "25.99", category: "Cakes" }
        ],
        categories: [
          { id: 1, name: "Breads" },
          { id: 2, name: "Cakes" },
          { id: 3, name: "Pastries" }
        ]
      };
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
      // Ensure orders is always an array before using slice
      const orders = Array.isArray(contextData.orders) ? contextData.orders : [];
      const userType = contextData.user.user_type;

      if (userType === 'buyer') {
        systemPrompt += `
        The user is logged in as a BUYER. Provide customer-focused assistance.
        User information: ${JSON.stringify(contextData.user)}
        Recent orders: ${JSON.stringify(orders.slice(0, 5))}
        Account stats: ${JSON.stringify(contextData.balance || {})}
        
        As a buyer, you can help with:
        - Browsing and purchasing products
        - Order history and tracking
        - Account balance and spending summary
        - Product recommendations based on past purchases
        - Delivery and pickup information
        - Customer support and complaints
        - Account management (profile, password, etc.)
        
        Focus on shopping experience, order management, and customer service.
        `;
      } else if (userType === 'seller' || userType === 'owner') {
        const roleTitle = userType === 'owner' ? 'OWNER' : 'SELLER';
        systemPrompt += `
        The user is logged in as a ${roleTitle}. Provide business management assistance.
        User information: ${JSON.stringify(contextData.user)}
        Recent sales: ${JSON.stringify(orders.slice(0, 5))}
        Business stats: ${JSON.stringify(contextData.balance || {})}
        
        As a ${roleTitle.toLowerCase()}, you can help with:
        - Sales analytics and revenue tracking
        - Order management and fulfillment
        - Product inventory and stock levels
        - Customer order history and patterns
        - Business performance metrics
        - Pending orders that need attention
        ${userType === 'owner' ? '- Overall business management and strategy' : '- Daily sales operations'}
        
        Focus on business operations, sales management, and performance analytics.
        `;
      }
    } else {
      systemPrompt += `
      The user is NOT logged in (GUEST). Provide general information only.
      
      You can help with:
      - Viewing available products and their details
      - Browse product categories
      - General bakery information and services
      - How to create an account or place orders
      - Store hours, location, and contact information
      - General inquiries about the bakery
      
      For account-specific features like order history, account balance, or personalized recommendations, 
      politely ask them to log in or create an account first.
      
      Do NOT provide any personal account information or order details.
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

      // Get context data with better error handling
      let contextData;
      try {
        contextData = await this.getContextData(isAuthenticated);
      } catch (contextError) {
        console.warn('Context data fetch failed, using fallback:', contextError);
        // Use minimal fallback data
        contextData = {
          products: [
            { id: 1, name: "Fresh Croissant", price: "3.50", category: "Pastries" },
            { id: 2, name: "Chocolate Cake", price: "25.99", category: "Cakes" }
          ],
          categories: [
            { id: 1, name: "Breads" },
            { id: 2, name: "Cakes" },
            { id: 3, name: "Pastries" }
          ]
        };
      }

      // Try to handle simple queries with local data first
      try {
        const localResponse = this.handleLocalQueries(userMessage, contextData, isAuthenticated);
        if (localResponse) {
          return { success: true, message: localResponse };
        }
      } catch (localError) {
        console.warn('Local query handling failed:', localError);
        // Continue to try other methods
      }

      // If no local response and Gemini API key is available, use Gemini
      if (this.geminiApiKey) {
        try {
          const systemPrompt = this.generateSystemPrompt(isAuthenticated, contextData);
          const geminiResponse = await this.queryGemini(systemPrompt, userMessage);
          return { success: true, message: geminiResponse };
        } catch (geminiError) {
          console.warn('Gemini API failed:', geminiError);
          // Fall through to fallback response
        }
      }

      // Enhanced fallback response based on the user's message
      const message_lower = userMessage.toLowerCase();

      // Provide specific responses for common bakery keywords
      if (message_lower.includes('bread')) {
        return {
          success: true,
          message: "We offer a variety of fresh breads including sourdough, whole wheat, and artisan loaves. Our breads are baked fresh daily. Would you like to know more about our bread selection?"
        };
      }

      if (message_lower.includes('cake')) {
        return {
          success: true,
          message: "Our bakery specializes in custom cakes for all occasions! We offer chocolate, vanilla, red velvet, and many other flavors. Would you like information about ordering a custom cake?"
        };
      }

      if (message_lower.includes('pastry') || message_lower.includes('pastries')) {
        return {
          success: true,
          message: "We have a delicious selection of pastries including croissants, danishes, muffins, and seasonal specialties. All our pastries are made fresh daily. What type of pastry interests you?"
        };
      }

      if (message_lower.includes('order') || message_lower.includes('buy') || message_lower.includes('purchase')) {
        return {
          success: true,
          message: "You can browse our products and place orders through our website. We offer both pickup and delivery options. Would you like to see our product catalog or learn about our ordering process?"
        };
      }

      if (message_lower.includes('price') || message_lower.includes('cost')) {
        return {
          success: true,
          message: "Our prices vary by product. Breads typically range from $3-6, pastries from $2-5, and custom cakes start at $25. Would you like specific pricing for any particular items?"
        };
      }

      // General fallback response
      return {
        success: true,
        message: "I'm here to help with your bakery needs! I can provide information about our products, help with orders, answer questions about our services, and assist with account-related inquiries. What would you like to know?"
      };

    } catch (error) {
      console.error('AI Service Error:', error);

      // Even in error cases, try to provide a helpful response based on keywords
      const message_lower = userMessage.toLowerCase();
      if (message_lower.includes('bread') || message_lower.includes('cake') || message_lower.includes('pastry')) {
        return {
          success: true,
          message: "I'd love to help you with our bakery products! While I'm experiencing some technical issues, I can tell you we offer fresh breads, custom cakes, and delicious pastries. Please try asking your question again or contact us directly for immediate assistance."
        };
      }

      return {
        success: false,
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our bakery directly for assistance."
      };
    }
  }

  // Handle simple queries with local data
  handleLocalQueries(message, contextData, isAuthenticated) {
    const message_lower = message.toLowerCase();

    // Handle conversational responses about cakes
    if ((message_lower.includes('yes') || message_lower.includes('sure') || message_lower.includes('okay') || message_lower.includes('ok')) &&
        (message_lower.includes('cake') || message_lower.includes('order') || message_lower.includes('custom'))) {
      return "Perfect! Here's how to order a custom cake:\n\n" +
             "🎂 **Cake Ordering Process:**\n" +
             "• Choose your flavor: Chocolate, Vanilla, Red Velvet, Strawberry, Lemon, or Carrot\n" +
             "• Select size: 6-inch (serves 6-8), 8-inch (serves 12-15), or 10-inch (serves 20-25)\n" +
             "• Custom decorations and messages available\n" +
             "• Prices start at $25 for a 6-inch cake\n" +
             "• We need 48-72 hours advance notice for custom orders\n\n" +
             (isAuthenticated ?
               "You can place your order through our website or call us directly. Would you like to see our cake gallery or start an order?" :
               "To place an order, please create an account or call us at (555) 123-CAKE. Would you like to know more about our flavors or pricing?");
    }

    // Handle "yes" responses when context suggests cake interest
    if ((message_lower === 'yes' || message_lower === 'sure' || message_lower === 'okay' || message_lower === 'ok') &&
        !message_lower.includes('cake')) {
      return "Great! Here's detailed information about ordering custom cakes:\n\n" +
             "🎂 **Our Custom Cake Services:**\n" +
             "• **Flavors Available:** Chocolate, Vanilla, Red Velvet, Strawberry, Lemon, Carrot Cake\n" +
             "• **Sizes:** 6\" ($25-35), 8\" ($35-50), 10\" ($50-75)\n" +
             "• **Special Features:** Custom decorations, fondant work, edible images, themed designs\n" +
             "• **Occasions:** Birthdays, weddings, anniversaries, graduations, corporate events\n" +
             "• **Lead Time:** 48-72 hours for custom orders, 1 week for elaborate designs\n\n" +
             (isAuthenticated ?
               "Ready to place an order? I can help you get started or you can browse our cake gallery!" :
               "To place an order, please create an account or call us at (555) 123-CAKE. Would you like to see examples of our work?");
    }

    // Product-related queries
    if (message_lower.includes('products') || message_lower.includes('what do you sell')) {
      const products = contextData.products || [];
      if (products.length > 0) {
        const productList = products.slice(0, 5).map(p => `${p.name} - $${p.price}`).join(', ');

        if (isAuthenticated && contextData.user) {
          const userType = contextData.user.user_type;
          if (userType === 'buyer') {
            return `We have ${products.length} delicious products available including: ${productList}. Based on your order history, I can recommend products you might enjoy. Would you like personalized recommendations?`;
          } else if (userType === 'seller' || userType === 'owner') {
            return `Your bakery currently offers ${products.length} products including: ${productList}. Would you like to see inventory levels, sales performance, or add new products?`;
          }
        }

        return `We have ${products.length} products available including: ${productList}. Would you like to know more about any specific product?`;
      }
    }

    // Category queries
    if (message_lower.includes('categories') || message_lower.includes('types')) {
      const categories = contextData.categories || [];
      if (categories.length > 0) {
        const categoryList = categories.map(c => c.name).join(', ');

        if (isAuthenticated && contextData.user) {
          const userType = contextData.user.user_type;
          if (userType === 'buyer') {
            return `Our bakery offers products in these categories: ${categoryList}. Which category would you like to explore for your next order?`;
          } else if (userType === 'seller' || userType === 'owner') {
            return `Your bakery has products organized in these categories: ${categoryList}. Would you like to see sales performance by category or manage category inventory?`;
          }
        }

        return `Our bakery offers products in these categories: ${categoryList}. What category interests you?`;
      }
    }

    // Account-specific queries (only for authenticated users)
    if (isAuthenticated && contextData.user) {
      const userType = contextData.user.user_type;
      const user = contextData.user;

      // Order/Sales history queries
      if (message_lower.includes('my orders') || message_lower.includes('order history') ||
          message_lower.includes('sales') || message_lower.includes('revenue')) {

        const orders = Array.isArray(contextData.orders) ? contextData.orders : [];

        if (userType === 'buyer') {
          if (orders.length > 0) {
            const recentOrder = orders[0];
            const totalSpent = contextData.balance?.total_spent || 0;
            return `Your most recent order was #${recentOrder.id} for $${recentOrder.total_amount}. You have ${orders.length} total orders with a total spending of $${totalSpent.toFixed(2)}. Would you like details about any specific order?`;
          } else {
            return "You haven't placed any orders yet. Browse our delicious products and place your first order to start enjoying our fresh bakery items!";
          }
        } else if (userType === 'seller' || userType === 'owner') {
          if (orders.length > 0) {
            const totalRevenue = contextData.balance?.total_revenue || 0;
            const pendingOrders = contextData.balance?.pending_orders || 0;
            return `You have ${orders.length} total sales generating $${totalRevenue.toFixed(2)} in revenue. Currently, ${pendingOrders} orders are pending fulfillment. Would you like to see detailed sales analytics or manage pending orders?`;
          } else {
            return "No sales recorded yet. Once customers start placing orders, you'll be able to track sales performance and revenue here.";
          }
        }
      }

      // Balance/Account queries
      if (message_lower.includes('balance') || message_lower.includes('account') || message_lower.includes('profile')) {
        if (userType === 'buyer') {
          const totalSpent = contextData.balance?.total_spent || 0;
          const totalOrders = contextData.balance?.total_orders || 0;
          return `Hello ${user.name}! Your buyer account shows ${totalOrders} orders with total spending of $${totalSpent.toFixed(2)}. How can I help you with your shopping today?`;
        } else if (userType === 'seller') {
          const totalRevenue = contextData.balance?.total_revenue || 0;
          const totalSales = contextData.balance?.total_sales || 0;
          return `Hello ${user.name}! Your seller account shows ${totalSales} sales generating $${totalRevenue.toFixed(2)} in revenue. How can I assist with your bakery operations?`;
        } else if (userType === 'owner') {
          const totalRevenue = contextData.balance?.total_revenue || 0;
          const totalSales = contextData.balance?.total_sales || 0;
          const pendingOrders = contextData.balance?.pending_orders || 0;
          return `Hello ${user.name}! As the owner, your bakery has ${totalSales} total sales with $${totalRevenue.toFixed(2)} revenue. ${pendingOrders} orders need attention. How can I help with business management?`;
        }
      }

      // Business-specific queries for sellers/owners
      if ((userType === 'seller' || userType === 'owner') &&
          (message_lower.includes('business') || message_lower.includes('management') ||
           message_lower.includes('analytics') || message_lower.includes('performance'))) {
        const totalRevenue = contextData.balance?.total_revenue || 0;
        const totalSales = contextData.balance?.total_sales || 0;
        const pendingOrders = contextData.balance?.pending_orders || 0;

        return `Business Overview: ${totalSales} total sales, $${totalRevenue.toFixed(2)} revenue, ${pendingOrders} pending orders. I can help with sales analytics, inventory management, order fulfillment, and business insights. What would you like to focus on?`;
      }
    } else {
      // Guest user trying to access account features
      if (message_lower.includes('my orders') || message_lower.includes('account') ||
          message_lower.includes('balance') || message_lower.includes('profile') ||
          message_lower.includes('history')) {
        return "To view your account information, order history, and personalized features, please log in to your account first. If you don't have an account, you can easily create one to start enjoying our bakery services!";
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
