import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import aiService from '../../services/aiService';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Maximize } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi ${user?.name || 'there'}! 👋 I'm your Bakerbari AI Assistant powered by Google Gemini. I can help you with:\n\n${
        user?.role === 'seller' || user?.user_type === 'seller' || user?.user_type === 'owner'
          ? '• Sales and revenue tracking\n• Order management\n• Product inventory\n• Ingredient management\n• Analytics and insights\n• Customer data'
          : user?.role === 'buyer' || user?.user_type === 'buyer'
          ? '• Finding products\n• Tracking orders\n• Order history\n• Product recommendations\n• Shop information'
          : '• Browse products\n• View categories\n• Learn about our bakery\n• Create an account to place orders'
      }\n\nWhat would you like to know?`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Define role-based quick prompts
  const getQuickPrompts = () => {
    const userType = user?.user_type || user?.role;

    if (userType === 'seller' || userType === 'owner') {
      return [
        { text: '📊 Business Overview', prompt: 'business overview' },
        { text: '💰 Sales Report', prompt: 'show my sales and revenue' },
        { text: '⏳ Pending Orders', prompt: 'pending orders' },
        { text: '🥣 Low Stock Items', prompt: 'low stock ingredients' },
        { text: '⚠️ Expiring Items', prompt: 'expired ingredients' },
        { text: '📈 Ingredient Stats', prompt: 'ingredient statistics' },
      ];
    } else if (userType === 'buyer') {
      return [
        { text: '📦 My Orders', prompt: 'my order history' },
        { text: '💳 My Spending', prompt: 'how much have i spent' },
        { text: '🎂 Recommendations', prompt: 'recommend products' },
        { text: '🛍️ Browse Products', prompt: 'show products' },
        { text: '⭐ Best Sellers', prompt: 'popular products' },
        { text: '📋 Categories', prompt: 'show categories' },
      ];
    } else {
      // Guest user
      return [
        { text: '🛍️ View Products', prompt: 'what products do you sell' },
        { text: '📋 Categories', prompt: 'show categories' },
        { text: '🎂 Custom Cakes', prompt: 'custom cakes' },
        { text: '📝 Create Account', prompt: 'how to create account' },
        { text: '🏪 About Us', prompt: 'about bakery' },
        { text: '❓ Help', prompt: 'help' },
      ];
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFullscreen]);

  const handleSend = async (message = null) => {
    const messageToSend = message || input.trim();
    if (!messageToSend || loading) return;

    const userMessage = {
      id: Date.now(),
      text: messageToSend,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    // Don't hide quick prompts - keep them visible

    try {
      // Use the existing aiService which connects to Google Gemini with local data
      const response = await aiService.sendMessage(messageToSend);

      const assistantMessage = {
        id: Date.now() + 1,
        text: response.message,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPromptClick = (prompt) => {
    handleSend(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsMinimized(false); // Exit minimized state when entering fullscreen
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="ai-assistant-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          title="AI Assistant - Ask me anything!"
        >
          <div className="button-icon">
            <Sparkles size={24} />
          </div>
          <span className="ai-pulse"></span>
          <span className="ai-pulse-secondary"></span>
          <span className="button-label">AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`ai-assistant-window ${isMinimized ? 'minimized' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
          {/* Header */}
          <div className="ai-assistant-header">
            <div className="header-left">
              <div className="header-icon">
                <Bot size={20} />
              </div>
              <div className="header-text">
                <h3>AI Assistant</h3>
                <span className="status">
                  <span className="status-dot"></span>
                  Powered by Gemini
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={toggleFullscreen}
                className="header-btn"
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Fullscreen'}
              >
                <Maximize />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="header-btn"
                aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 /> : <Minimize2 />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFullscreen(false);
                  setIsMinimized(false);
                }}
                className="header-btn close-btn"
                aria-label="Close"
                title="Close"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="ai-assistant-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.isBot ? 'assistant' : 'user'}`}>
                    <div className="message-avatar">
                      {message.isBot ? (
                        <Bot size={20} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message assistant">
                    <div className="message-avatar">
                      <Bot size={20} />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Prompts - Always visible */}
                {showQuickPrompts && (
                  <div className="quick-prompts-container">
                    <div className="quick-prompts-label">Quick Actions:</div>
                    <div className="quick-prompts">
                      {getQuickPrompts().map((promptItem, index) => (
                        <button
                          key={index}
                          className="quick-prompt-btn"
                          onClick={() => handleQuickPromptClick(promptItem.prompt)}
                          disabled={loading}
                        >
                          {promptItem.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="ai-assistant-input">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about products, orders, or your account..."
                  rows="1"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="send-button"
                  aria-label="Send message"
                  title="Send message (Enter)"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="ai-footer-text">
                AI Assistant • Powered by Google Gemini & your bakery data
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
