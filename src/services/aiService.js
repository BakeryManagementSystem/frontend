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

        // Fetch ingredient data for sellers/owners
        if (context.user?.user_type === 'seller' || context.user?.user_type === 'owner') {
          try {
            const ingredientsResponse = await this.apiService.getIngredients();
            context.ingredients = ingredientsResponse.data || [];
            console.log('Fetched ingredients:', context.ingredients); // Debug log
          } catch (error) {
            console.warn('Could not fetch ingredients:', error);
            context.ingredients = [];
          }

          try {
            const batchesResponse = await this.apiService.getIngredientBatches();
            context.ingredientBatches = batchesResponse.data || [];
            console.log('Fetched ingredient batches:', context.ingredientBatches); // Debug log
          } catch (error) {
            console.warn('Could not fetch ingredient batches:', error);
            context.ingredientBatches = [];
          }

          // Try to fetch ingredient stats
          try {
            const statsResponse = await this.apiService.request('/ingredients/stats');
            context.ingredientStats = statsResponse.data || null;
            console.log('Fetched ingredient stats:', context.ingredientStats); // Debug log
          } catch (error) {
            console.warn('Could not fetch ingredient stats:', error);
            context.ingredientStats = null;
          }
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
    let systemPrompt = `You are a helpful AI assistant for Bakerbari, a bakery management platform. 
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
        `;

        // Add ingredient information for sellers/owners
        if (contextData.ingredients && contextData.ingredients.length > 0) {
          systemPrompt += `
        Ingredients inventory: ${JSON.stringify(contextData.ingredients.slice(0, 10))}
        `;
        }

        if (contextData.ingredientBatches && contextData.ingredientBatches.length > 0) {
          systemPrompt += `
        Ingredient batches: ${JSON.stringify(contextData.ingredientBatches.slice(0, 5))}
        `;
        }

        if (contextData.ingredientStats) {
          systemPrompt += `
        Ingredient statistics: ${JSON.stringify(contextData.ingredientStats)}
        `;
        }

        systemPrompt += `
        As a ${roleTitle.toLowerCase()}, you can help with:
        - Sales analytics and revenue tracking
        - Order management and fulfillment
        - Product inventory and stock levels
        - Ingredient inventory management and tracking
        - Ingredient batch tracking and expiry monitoring
        - Ingredient cost analysis and usage statistics
        - Low stock alerts and reorder recommendations
        - Customer order history and patterns
        - Business performance metrics
        - Pending orders that need attention
        ${userType === 'owner' ? '- Overall business management and strategy' : '- Daily sales operations'}
        
        Focus on business operations, sales management, inventory control, and performance analytics.
        When discussing ingredients, provide specific information about stock levels, costs, suppliers, and usage patterns.
        `;
      }
    } else {
      systemPrompt += `
      The user is NOT logged in (GUEST). Provide general information and encourage account creation.
      
      IMPORTANT GUIDELINES FOR GUEST USERS:
      - When they ask about "orders", "order history", or "my orders": Explain that they need an account to place and track orders. Encourage them to register.
      - When they ask about "stats", "statistics", or "analytics": Explain these features are for sellers/business owners. If they want to buy, direct them to register as a buyer. If they want to sell, direct them to register as a seller.
      - When they ask about "account", "profile", or "balance": Encourage them to create an account to access personalized features.
      - Always be friendly and guide them to the registration page when appropriate.
      
      You can help with:
      - Viewing available products and their details (show specific products from the list)
      - Browse product categories (list the categories available)
      - General bakery information and services
      - How to create an account or place orders (provide clear steps)
      - Store hours, location, and contact information
      - General inquiries about the bakery
      - Product recommendations and popular items
      
      RESPONSE STYLE FOR GUESTS:
      - Be welcoming and encouraging
      - Provide specific product information when asked about products
      - Guide them to create an account for order-related queries
      - Explain the benefits of having an account (order tracking, history, personalized recommendations)
      - For seller/business queries, explain that they need a seller account
      
      When they ask about orders/purchases: Say "To place orders and track your purchases, you'll need to create an account! Once registered, you can browse our products, add items to your cart, and place orders with ease. Would you like me to guide you through the registration process?"
      
      When they ask about stats/analytics: Say "Analytics and statistics are available for sellers and business owners. If you're interested in selling your bakery products on our platform, you can register as a seller! Would you like to know more about becoming a seller?"
      
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

      // PRIORITY 1: Try backend API first (authenticated users only)
      if (isAuthenticated) {
        try {
          console.log('Calling backend AI API with message:', userMessage);
          const backendResponse = await this.apiService.request('/ai/chat', {
            method: 'POST',
            data: {
              message: userMessage,
              context: {
                user_type: contextData.user?.user_type,
                user_id: contextData.user?.id
              }
            }
          });

          if (backendResponse.success && backendResponse.data?.message) {
            console.log('Backend API response received:', backendResponse.data);
            return {
              success: true,
              message: backendResponse.data.message,
              data: backendResponse.data.data,
              suggestions: backendResponse.data.suggestions,
              actions: backendResponse.data.actions
            };
          }
        } catch (backendError) {
          console.warn('Backend AI API failed, falling back to other methods:', backendError);
          // Continue to fallback methods
        }
      }

      // PRIORITY 2: Try to handle simple queries with local data
      try {
        const localResponse = this.handleLocalQueries(userMessage, contextData, isAuthenticated);
        if (localResponse) {
          return { success: true, message: localResponse };
        }
      } catch (localError) {
        console.warn('Local query handling failed:', localError);
        // Continue to try other methods
      }

      // PRIORITY 3: If Gemini API key is available, use Gemini
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

      // PRIORITY 4: Enhanced fallback response based on the user's message
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

    // ===== ROLE-BASED QUERY VALIDATION =====
    // Check if user is asking for features outside their role

    // Define seller/owner specific keywords
    const sellerKeywords = [
      'sales', 'revenue', 'income', 'earnings', 'profit', 'money made',
      'ingredient', 'ingredients', 'inventory', 'stock', 'supplies',
      'batch', 'batches', 'supplier', 'reorder', 'low stock',
      'business', 'management', 'analytics', 'performance', 'metrics',
      'pending orders', 'customer orders', 'orders received',
      'add product', 'manage product', 'edit product', 'delete product',
      'expiry', 'expired', 'cost analysis', 'usage'
    ];

    // Define buyer specific keywords
    const buyerKeywords = [
      'my orders', 'order history', 'purchase history', 'what did i order',
      'my purchases', 'bought', 'total spent', 'spending', 'my balance',
      'recommend', 'what should i buy', 'cart', 'checkout',
      'delivery', 'track order', 'order status'
    ];

    // Define authentication required keywords
    const authRequiredKeywords = [
      'my orders', 'order history', 'account', 'balance', 'profile',
      'my purchases', 'purchase history', 'dashboard', 'stats',
      'sales', 'revenue', 'ingredients', 'business'
    ];

    // Check if guest user is asking for authenticated features
    if (!isAuthenticated) {
      const isAskingAuthFeature = authRequiredKeywords.some(keyword => message_lower.includes(keyword));

      if (isAskingAuthFeature) {
        // Check if asking for seller features
        const isAskingSellerFeature = sellerKeywords.some(keyword => message_lower.includes(keyword));

        if (isAskingSellerFeature) {
          return "🔐 **Seller/Owner Features Require Login**\n\n" +
                 "The features you're asking about (sales, revenue, inventory, ingredients, business management) are available for **Seller** and **Owner** accounts.\n\n" +
                 "**To access these features:**\n" +
                 "1. If you already have a seller account, please log in\n" +
                 "2. If you want to become a seller, please contact us to register as a seller\n\n" +
                 "**Seller Account Benefits:**\n" +
                 "• Track sales and revenue\n" +
                 "• Manage ingredient inventory\n" +
                 "• Monitor low stock and expiry dates\n" +
                 "• View business analytics and performance\n" +
                 "• Manage product catalog\n\n" +
                 "Would you like to know more about becoming a seller or need help logging in?";
        }

        // Asking for buyer features
        return "🔐 **Account Features Require Login**\n\n" +
               "To access your order history, account balance, and personalized features, please log in to your account.\n\n" +
               "**Don't have an account yet?**\n" +
               "Create a free buyer account to:\n" +
               "• Place and track orders\n" +
               "• View purchase history\n" +
               "• Get personalized recommendations\n" +
               "• Manage your profile\n" +
               "• Save favorite products\n\n" +
               "Would you like help with registration or login?";
      }
    }

    // Check if authenticated user is asking for features outside their role
    if (isAuthenticated && contextData.user) {
      const userType = contextData.user.user_type;

      // BUYER asking for SELLER features
      if (userType === 'buyer') {
        const isAskingSellerFeature = sellerKeywords.some(keyword => message_lower.includes(keyword));

        if (isAskingSellerFeature) {
          // Check if it's about purchasing/ordering (allowed for buyers)
          const isOrderingRelated = message_lower.includes('buy') ||
                                   message_lower.includes('order') ||
                                   message_lower.includes('purchase') ||
                                   message_lower.includes('cart') ||
                                   message_lower.includes('checkout');

          if (!isOrderingRelated) {
            return "🛍️ **Buyer Account - Seller Features Not Available**\n\n" +
                   "Hi! I noticed you're asking about features like sales tracking, inventory management, or business analytics. These features are only available for **Seller** and **Owner** accounts.\n\n" +
                   "**Your current account type:** Buyer (Customer)\n\n" +
                   "**As a buyer, you can:**\n" +
                   "• Browse and purchase products\n" +
                   "• View your order history and spending\n" +
                   "• Track your orders\n" +
                   "• Get product recommendations\n" +
                   "• Manage your account profile\n\n" +
                   "**Interested in selling?**\n" +
                   "If you want to sell bakery products, please contact our support team to upgrade to a seller account.\n\n" +
                   "How can I help you with your shopping today?";
          }
        }
      }

      // SELLER/OWNER asking for BUYER-specific features
      if (userType === 'seller' || userType === 'owner') {
        const isAskingBuyerFeature = message_lower.includes('what should i buy') ||
                                     message_lower.includes('recommend products for me') ||
                                     message_lower.includes('my cart') ||
                                     message_lower.includes('checkout') ||
                                     (message_lower.includes('my purchases') && !message_lower.includes('customer')) ||
                                     (message_lower.includes('my spending') && !message_lower.includes('customer'));

        if (isAskingBuyerFeature) {
          return "💼 **Seller/Owner Account - Limited Buyer Features**\n\n" +
                 `Hi ${contextData.user.name}! I noticed you're asking about buyer-specific features like personal shopping, cart, or recommendations.\n\n` +
                 `**Your current account type:** ${userType === 'owner' ? 'Business Owner' : 'Seller'}\n\n` +
                 "**Your account is designed for business management:**\n" +
                 "• Track sales and revenue\n" +
                 "• Manage ingredient inventory and batches\n" +
                 "• Monitor customer orders\n" +
                 "• View business analytics\n" +
                 "• Manage product catalog\n\n" +
                 "**Need to purchase items?**\n" +
                 "If you want to shop as a customer, you would need a separate buyer account.\n\n" +
                 "Can I help you with your business operations instead? Try asking about:\n" +
                 "• 'Show my sales data'\n" +
                 "• 'What ingredients are low in stock?'\n" +
                 "• 'Business overview'\n" +
                 "• 'Pending orders'";
        }
      }
    }

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

    // Product-related queries with expanded variations
    if (message_lower.includes('products') || message_lower.includes('what do you sell') ||
        message_lower.includes('items') || message_lower.includes('menu') ||
        message_lower.includes('catalog') || message_lower.includes('available') ||
        message_lower.includes('what can i buy') || message_lower.includes('show me') ||
        message_lower.includes('list') || message_lower.includes('browse')) {
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

    // Category queries with expanded variations
    if (message_lower.includes('categories') || message_lower.includes('types') ||
        message_lower.includes('sections') || message_lower.includes('groups') ||
        message_lower.includes('kind of') || message_lower.includes('variety')) {
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

      // ===== BUYER-SPECIFIC QUERIES WITH EXTENSIVE VARIATIONS =====
      if (userType === 'buyer') {
        // Order history queries - extensive keyword variations
        if (message_lower.includes('my orders') || message_lower.includes('order history') ||
            message_lower.includes('orders') || message_lower.includes('purchases') ||
            message_lower.includes('bought') || message_lower.includes('purchase history') ||
            message_lower.includes('what did i order') || message_lower.includes('what have i bought') ||
            message_lower.includes('previous orders') || message_lower.includes('past orders') ||
            message_lower.includes('recent orders') || message_lower.includes('last order') ||
            message_lower.includes('order list') || message_lower.includes('transaction') ||
            message_lower.includes('buying history') || message_lower.includes('shopping history')) {

          const orders = Array.isArray(contextData.orders) ? contextData.orders : [];
          if (orders.length > 0) {
            const recentOrder = orders[0];
            const totalSpent = contextData.balance?.total_spent || 0;
            return `Your most recent order was #${recentOrder.id} for $${recentOrder.total_amount} on ${recentOrder.created_at}. You have ${orders.length} total orders with a total spending of $${totalSpent.toFixed(2)}. Would you like details about any specific order?`;
          } else {
            return "You haven't placed any orders yet. Browse our delicious products and place your first order to start enjoying our fresh bakery items!";
          }
        }

        // Balance/Spending queries - extensive keyword variations
        if (message_lower.includes('balance') || message_lower.includes('account') ||
            message_lower.includes('profile') || message_lower.includes('spending') ||
            message_lower.includes('spent') || message_lower.includes('how much') ||
            message_lower.includes('total cost') || message_lower.includes('expense') ||
            message_lower.includes('money') || message_lower.includes('budget') ||
            message_lower.includes('summary') || message_lower.includes('overview') ||
            message_lower.includes('stats') || message_lower.includes('statistics') ||
            message_lower.includes('my info') || message_lower.includes('my details') ||
            message_lower.includes('account info') || message_lower.includes('user info')) {
          const totalSpent = contextData.balance?.total_spent || 0;
          const totalOrders = contextData.balance?.total_orders || 0;
          const lastOrderDate = contextData.balance?.last_order_date || 'N/A';
          return `Hello ${user.name}! 👋\n\n` +
                 `**Your Account Summary:**\n` +
                 `• Total Orders: ${totalOrders}\n` +
                 `• Total Spent: $${totalSpent.toFixed(2)}\n` +
                 `• Last Order: ${lastOrderDate}\n` +
                 `• Member Since: ${user.created_at || 'N/A'}\n\n` +
                 `How can I help you with your shopping today? Would you like to browse products or check your order history?`;
        }

        // Recommendations queries
        if (message_lower.includes('recommend') || message_lower.includes('suggestion') ||
            message_lower.includes('what should i buy') || message_lower.includes('best seller') ||
            message_lower.includes('popular') || message_lower.includes('favorite') ||
            message_lower.includes('top products') || message_lower.includes('most ordered')) {
          const products = contextData.products || [];
          const topProducts = products.slice(0, 3);
          return `Based on your preferences, here are our top recommendations:\n\n` +
                 `${topProducts.map((p, i) => `${i + 1}. **${p.name}** - $${p.price}\n   ${p.description || 'A customer favorite!'}`).join('\n\n')}\n\n` +
                 `Would you like to add any of these to your cart?`;
        }
      }

      // ===== SELLER/OWNER-SPECIFIC QUERIES WITH EXTENSIVE VARIATIONS =====
      if (userType === 'seller' || userType === 'owner') {
        // Sales/Revenue queries - extensive keyword variations
        if (message_lower.includes('sales') || message_lower.includes('revenue') ||
            message_lower.includes('income') || message_lower.includes('earnings') ||
            message_lower.includes('profit') || message_lower.includes('money made') ||
            message_lower.includes('total sales') || message_lower.includes('sales data') ||
            message_lower.includes('sales report') || message_lower.includes('sales history') ||
            message_lower.includes('how much sold') || message_lower.includes('sold') ||
            message_lower.includes('orders received') || message_lower.includes('customer orders') ||
            message_lower.includes('transactions') || message_lower.includes('completed orders')) {

          const orders = Array.isArray(contextData.orders) ? contextData.orders : [];
          if (orders.length > 0) {
            const totalRevenue = contextData.balance?.total_revenue || 0;
            const pendingOrders = contextData.balance?.pending_orders || 0;
            const lastSaleDate = contextData.balance?.last_sale_date || 'N/A';
            return `📊 **Sales Overview:**\n\n` +
                   `• Total Sales: ${orders.length}\n` +
                   `• Total Revenue: $${totalRevenue.toFixed(2)}\n` +
                   `• Pending Orders: ${pendingOrders}\n` +
                   `• Last Sale: ${lastSaleDate}\n\n` +
                   `Would you like to see detailed sales analytics or manage pending orders?`;
          } else {
            return "No sales recorded yet. Once customers start placing orders, you'll be able to track sales performance and revenue here.";
          }
        }

        // Business/Account queries - extensive keyword variations
        if (message_lower.includes('business') || message_lower.includes('management') ||
            message_lower.includes('dashboard') || message_lower.includes('overview') ||
            message_lower.includes('summary') || message_lower.includes('stats') ||
            message_lower.includes('statistics') || message_lower.includes('analytics') ||
            message_lower.includes('performance') || message_lower.includes('metrics') ||
            message_lower.includes('my account') || message_lower.includes('account info') ||
            message_lower.includes('profile') || message_lower.includes('balance') ||
            message_lower.includes('how is business') || message_lower.includes('business doing')) {
          const totalRevenue = contextData.balance?.total_revenue || 0;
          const totalSales = contextData.balance?.total_sales || 0;
          const pendingOrders = contextData.balance?.pending_orders || 0;

          return `Hello ${user.name}! 👋\n\n` +
                 `**Business Overview:**\n` +
                 `• Total Sales: ${totalSales}\n` +
                 `• Total Revenue: $${totalRevenue.toFixed(2)}\n` +
                 `• Pending Orders: ${pendingOrders}\n` +
                 `• Account Type: ${userType === 'owner' ? 'Business Owner' : 'Seller'}\n\n` +
                 `I can help with sales analytics, inventory management, order fulfillment, and business insights. What would you like to focus on?`;
        }

        // Pending orders queries - extensive keyword variations
        if (message_lower.includes('pending') || message_lower.includes('waiting') ||
            message_lower.includes('needs attention') || message_lower.includes('to fulfill') ||
            message_lower.includes('unfulfilled') || message_lower.includes('active orders') ||
            message_lower.includes('current orders') || message_lower.includes('in progress') ||
            message_lower.includes('processing') || message_lower.includes('need to process')) {
          const orders = Array.isArray(contextData.orders) ? contextData.orders : [];
          const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing');

          if (pendingOrders.length > 0) {
            return `⏳ **Pending Orders (${pendingOrders.length}):**\n\n` +
                   `${pendingOrders.slice(0, 5).map(order => 
                     `• Order #${order.id} - $${order.total_amount}\n` +
                     `  Status: ${order.status}\n` +
                     `  Date: ${order.created_at}`
                   ).join('\n\n')}\n\n` +
                   `${pendingOrders.length > 5 ? `And ${pendingOrders.length - 5} more pending orders...` : ''}\n\n` +
                   `These orders need your attention for processing and fulfillment.`;
          } else {
            return "✅ Great! You have no pending orders at the moment. All orders are processed.";
          }
        }

        // Ingredient-related queries - EXTENSIVE keyword variations
        if (message_lower.includes('ingredient') || message_lower.includes('ingredients') ||
            message_lower.includes('inventory') || message_lower.includes('stock') ||
            message_lower.includes('supplies') || message_lower.includes('materials') ||
            message_lower.includes('raw materials') || message_lower.includes('flour') ||
            message_lower.includes('butter') || message_lower.includes('sugar') ||
            message_lower.includes('chocolate') || message_lower.includes('milk') ||
            message_lower.includes('eggs') || message_lower.includes('cream') ||
            message_lower.includes('batch') || message_lower.includes('batches') ||
            message_lower.includes('supplier') || message_lower.includes('suppliers') ||
            message_lower.includes('reorder') || message_lower.includes('purchase') ||
            message_lower.includes('what do i have') || message_lower.includes('stock level') ||
            message_lower.includes('running low') || message_lower.includes('need to buy') ||
            message_lower.includes('expiry') || message_lower.includes('expired') ||
            message_lower.includes('cost') || message_lower.includes('usage') ||
            message_lower.includes('consumption') || message_lower.includes('how much left')) {

          const ingredients = contextData.ingredients || [];
          const batches = contextData.ingredientBatches || [];
          const stats = contextData.ingredientStats;

          // Ingredient statistics queries
          if (message_lower.includes('stats') || message_lower.includes('statistics') ||
              message_lower.includes('overview') || message_lower.includes('summary') ||
              message_lower.includes('analytics') || message_lower.includes('report')) {
            if (stats) {
              return `📊 **Ingredient Statistics Overview:**\n\n` +
                     `• Total Ingredients: ${stats.total_ingredients}\n` +
                     `• Total Inventory Value: $${stats.total_value}\n` +
                     `• Low Stock Items: ${stats.low_stock_count}\n` +
                     `• Expired Items: ${stats.expired_count}\n` +
                     `• Monthly Usage: $${stats.monthly_usage}\n\n` +
                     `**Top Used Ingredients:**\n` +
                     `${stats.top_used_ingredients?.map(ing => `• ${ing.name}: ${ing.usage} (${ing.percentage}%)`).join('\n') || 'No usage data available'}\n\n` +
                     `**Cost Breakdown:**\n` +
                     `• Flour Products: $${stats.cost_breakdown?.flour_products || '0'}\n` +
                     `• Dairy Products: $${stats.cost_breakdown?.dairy_products || '0'}\n` +
                     `• Chocolates: $${stats.cost_breakdown?.chocolates || '0'}\n` +
                     `• Fruits: $${stats.cost_breakdown?.fruits || '0'}`;
            } else {
              return "I don't have access to ingredient statistics at the moment. Please check your ingredient management dashboard or try again later.";
            }
          }

          // Low stock and reorder queries
          if (message_lower.includes('low stock') || message_lower.includes('running low') ||
              message_lower.includes('reorder') || message_lower.includes('need to buy') ||
              message_lower.includes('shortage') || message_lower.includes('almost out') ||
              message_lower.includes('need more') || message_lower.includes('purchase') ||
              message_lower.includes('order more')) {
            const lowStockItems = ingredients.filter(ing => ing.current_stock <= ing.minimum_stock);
            if (lowStockItems.length > 0) {
              return `⚠️ **Low Stock Alert! (${lowStockItems.length} items)**\n\n` +
                     `The following ingredients need to be reordered:\n\n` +
                     `${lowStockItems.map(ing => 
                       `• **${ing.name}**: ${ing.current_stock} ${ing.unit} (Min: ${ing.minimum_stock} ${ing.unit})\n` +
                       `  Supplier: ${ing.supplier}\n` +
                       `  Cost per unit: $${ing.cost_per_unit}`
                     ).join('\n\n')}\n\n` +
                     `Consider placing orders soon to avoid running out of these essential ingredients.`;
            } else {
              return "✅ Great news! All ingredients are currently above minimum stock levels. Your inventory is well-stocked.";
            }
          }

          // Batch tracking queries
          if (message_lower.includes('batch') || message_lower.includes('batches') ||
              message_lower.includes('recent purchase') || message_lower.includes('deliveries') ||
              message_lower.includes('received') || message_lower.includes('incoming')) {
            if (batches.length > 0) {
              const recentBatches = batches.slice(0, 5);
              return `📦 **Recent Ingredient Batches (${batches.length} total):**\n\n` +
                     `${recentBatches.map(batch => 
                       `• **${batch.ingredient_name}** (Batch: ${batch.batch_number})\n` +
                       `  Quantity: ${batch.quantity} ${batch.unit}\n` +
                       `  Cost: $${batch.total_cost}\n` +
                       `  Received: ${batch.received_date || 'N/A'}\n` +
                       `  Expiry: ${batch.expiry_date}\n` +
                       `  Status: ${batch.status}`
                     ).join('\n\n')}\n\n` +
                     `${batches.length > 5 ? `And ${batches.length - 5} more batches...` : ''}`;
            } else {
              return "No ingredient batches found. Add ingredient batches to track your inventory purchases and expiry dates.";
            }
          }

          // Expiry tracking queries
          if (message_lower.includes('expiry') || message_lower.includes('expired') ||
              message_lower.includes('expiring') || message_lower.includes('expire soon') ||
              message_lower.includes('bad') || message_lower.includes('spoiled') ||
              message_lower.includes('old') || message_lower.includes('date')) {
            const expiredBatches = batches.filter(batch => {
              const expiryDate = new Date(batch.expiry_date);
              return expiryDate < new Date();
            });
            const expiringBatches = batches.filter(batch => {
              const expiryDate = new Date(batch.expiry_date);
              const thirtyDaysFromNow = new Date();
              thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
              return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
            });

            let response = '';
            if (expiredBatches.length > 0) {
              response += `❌ **Expired Items (${expiredBatches.length}):**\n\n` +
                         `${expiredBatches.map(batch => 
                           `• ${batch.ingredient_name} (Batch: ${batch.batch_number}) - Expired: ${batch.expiry_date}`
                         ).join('\n')}\n\n`;
            }
            if (expiringBatches.length > 0) {
              response += `⚠️ **Expiring Soon (${expiringBatches.length}):**\n\n` +
                         `${expiringBatches.map(batch => 
                           `• ${batch.ingredient_name} (Batch: ${batch.batch_number}) - Expires: ${batch.expiry_date}`
                         ).join('\n')}\n\n`;
            }
            if (response === '') {
              response = "✅ Good news! No expired ingredients and no items expiring in the next 30 days.";
            }
            return response;
          }

          // Cost and usage queries
          if (message_lower.includes('cost') || message_lower.includes('price') ||
              message_lower.includes('expense') || message_lower.includes('spending') ||
              message_lower.includes('usage') || message_lower.includes('consumption') ||
              message_lower.includes('how much') || message_lower.includes('value')) {
            if (stats) {
              return `💰 **Ingredient Cost Analysis:**\n\n` +
                     `• Total Inventory Value: $${stats.total_value}\n` +
                     `• Monthly Usage Cost: $${stats.monthly_usage}\n` +
                     `• Average Cost per Item: $${(stats.total_value / stats.total_ingredients).toFixed(2)}\n\n` +
                     `**Cost Breakdown by Category:**\n` +
                     `• Flour Products: $${stats.cost_breakdown?.flour_products || '0'}\n` +
                     `• Dairy Products: $${stats.cost_breakdown?.dairy_products || '0'}\n` +
                     `• Chocolates: $${stats.cost_breakdown?.chocolates || '0'}\n` +
                     `• Fruits: $${stats.cost_breakdown?.fruits || '0'}\n` +
                     `• Other: $${stats.cost_breakdown?.other || '0'}\n\n` +
                     `This helps you track ingredient expenses and optimize purchasing decisions.`;
            }
          }

          // Supplier queries
          if (message_lower.includes('supplier') || message_lower.includes('vendors') ||
              message_lower.includes('where to buy') || message_lower.includes('purchase from') ||
              message_lower.includes('who supplies')) {
            const uniqueSuppliers = [...new Set(ingredients.map(ing => ing.supplier))];
            if (uniqueSuppliers.length > 0) {
              return `🏢 **Your Suppliers (${uniqueSuppliers.length}):**\n\n` +
                     `${uniqueSuppliers.map(supplier => {
                       const supplierIngredients = ingredients.filter(ing => ing.supplier === supplier);
                       return `• **${supplier}**\n` +
                              `  Supplies: ${supplierIngredients.length} ingredients\n` +
                              `  Items: ${supplierIngredients.slice(0, 3).map(i => i.name).join(', ')}${supplierIngredients.length > 3 ? '...' : ''}`;
                     }).join('\n\n')}`;
            }
          }

          // General ingredient inventory display
          if (ingredients.length > 0) {
            const ingredientList = ingredients.slice(0, 5);
            return `🥣 **Current Ingredient Inventory (${ingredients.length} total):**\n\n` +
                   `${ingredientList.map(ing => 
                     `• **${ing.name}**: ${ing.current_stock} ${ing.unit}\n` +
                     `  Cost: $${ing.cost_per_unit}/${ing.unit} | Supplier: ${ing.supplier}\n` +
                     `  ${ing.current_stock <= ing.minimum_stock ? '⚠️ LOW STOCK' : '✅ In Stock'}`
                   ).join('\n\n')}\n\n` +
                   `${ingredients.length > 5 ? `And ${ingredients.length - 5} more ingredients...\n\n` : ''}` +
                   `Ask me about low stock, batches, costs, or specific ingredients!`;
          } else {
            return "No ingredients found in your inventory. Start by adding ingredients to track your bakery's raw materials and supplies.";
          }
        }

        // Product management queries
        if (message_lower.includes('add product') || message_lower.includes('new product') ||
            message_lower.includes('create product') || message_lower.includes('manage product') ||
            message_lower.includes('update product') || message_lower.includes('edit product') ||
            message_lower.includes('delete product') || message_lower.includes('remove product')) {
          return `📦 **Product Management:**\n\n` +
                 `You can manage your products through the dashboard. Here's what you can do:\n` +
                 `• Add new products with pricing and descriptions\n` +
                 `• Update existing product information\n` +
                 `• Set product availability and stock levels\n` +
                 `• Organize products by categories\n` +
                 `• Upload product images\n` +
                 `• Set special offers and discounts\n\n` +
                 `Would you like guidance on any specific product management task?`;
        }
      }
    } else {
      // Guest user trying to access account features
      if (message_lower.includes('my orders') || message_lower.includes('account') ||
          message_lower.includes('balance') || message_lower.includes('profile') ||
          message_lower.includes('history') || message_lower.includes('stats') ||
          message_lower.includes('dashboard') || message_lower.includes('sales') ||
          message_lower.includes('revenue') || message_lower.includes('purchases')) {
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
