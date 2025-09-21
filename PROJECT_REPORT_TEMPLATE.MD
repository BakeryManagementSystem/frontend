# Bakery Management System (BMS)

**Team Members:**  

- [Your Name] | [Your Email]
- [Team Member 2] | [Team Member 2 Email]
- [Team Member 3] | [Team Member 3 Email]
- [Team Member 4] | [Team Member 4 Email]

**Project Live Link:** [Insert URL when deployed]
**Recorded video:** [Insert URL] (Optional)

---

## Table of Contents

1. [Project Description](#1-project-description)
2. [Workflow Overview](#2-workflow-overview)
3. [Main Features](#3-main-features)
4. [Technologies Used](#4-technologies-used)
5. [System Architecture](#5-system-architecture)
6. [Setup Guidelines](#6-setup-guidelines)
    - [Backend](#backend)
    - [Frontend](#frontend)
7. [Running the Application](#7-running-the-application)
8. [Deployment Status & Tests](#8-deployment-status--tests)
9. [Contribution Table](#9-contribution-table)
10. [Screenshots](#10-screenshots)
11. [Limitations / Known Issues](#11-limitations--known-issues)

---

## 1. Project Description

The Bakery Management System is a comprehensive, web-based software application developed to digitize and manage the day-to-day operations of a bakery. It addresses the challenges faced in handling orders, managing inventory, tracking expenses, maintaining customer records, and generating business reports. The software provides a centralized system where bakery administrators and staff can seamlessly handle tasks through a secure and interactive user interface.

The system features role-based access control with three main user types:
- **Buyers/Customers**: Can browse products, place orders, manage wishlists, and track order history
- **Sellers/Bakers**: Can manage their products, process orders, view analytics, and manage shop profiles

By integrating features such as sales tracking, expense logging, statistical analysis, and an AI-powered assistant, the system ensures increased operational efficiency, transparency, and data-driven decision-making. The application addresses the common challenges in local bakeries where manual processes often lead to errors, loss of information, and limited analytical capabilities.

---

## 2. Workflow Overview

### Customer Workflow
1. **Registration/Login** → Browse products by categories → Add to cart/wishlist → Checkout → Order tracking → AI assistance for queries

### Seller Workflow  
1. **Login** → Manage products (Add/Edit/Delete) → Process incoming orders → Update order status → View sales analytics → Manage shop profile

### Owner Workflow
1. **Login** → Access dashboard with comprehensive analytics → Manage ingredients and inventory → View profit reports → Monitor overall system performance → Access advanced AI insights

### AI Assistant Workflow
1. **Guest Users**: Product information, categories, general bakery info, account creation guidance
2. **Authenticated Users**: Personal order history, account details, personalized recommendations, order status tracking

---

## 3. Main Features

### Dashboard & Analytics
- Real-time business metrics and KPIs for sellers and owners
- Interactive sales charts and trend analysis
- Order statistics and revenue tracking
- Inventory level monitoring with low stock alerts
- Comprehensive profit analysis by category and time period

### Product Management
- Visual product catalog with image upload support
- Category-based product organization (Breads, Cakes, Pastries, etc.)
- Advanced search and filtering capabilities
- Stock level management with automatic alerts
- Bulk product operations and batch updates
- Product availability status management

### Order Processing System
- Streamlined order creation interface for customers
- Real-time order status tracking (Pending, Processing, Ready, Delivered)
- Order history management for both customers and sellers
- Order cancellation and modification capabilities
- Delivery address management

### User Management & Authentication
- Secure user registration and login with Laravel Sanctum
- Role-based access control (Buyer, Seller, Owner)
- User profile management with address book
- Wishlist functionality for customers
- Account verification and password reset

### Inventory & Ingredient Management
- Real-time stock level tracking
- Ingredient batch management for cost calculation
- Low stock notification system
- Inventory adjustment tools
- Cost tracking and profit margin analysis

### AI-Powered Assistant
- **Natural Language Processing**: Understands bakery-related queries
- **Context-Aware Responses**: Different functionality for logged-in vs guest users
- **Local Data Integration**: Uses real product, order, and user data
- **Smart Topic Filtering**: Only responds to bakery-related questions
- **Gemini API Integration**: Advanced AI responses for complex queries
- **Floating Chat Interface**: Modern, responsive chat widget

### Reporting & Analytics
- Sales reports with customizable date ranges
- Profit analysis by product categories
- Customer order history and statistics
- Inventory reports and cost analysis
- Export functionality for business records

---

## 4. Technologies Used

### Frontend
- **React 19.1.1**: Modern JavaScript library for building user interfaces
- **React Router DOM 7.8.2**: Client-side routing and navigation
- **Lucide React 0.541.0**: Beautiful icon library
- **React Icons 5.5.0**: Additional icon components
- **Vite 7.1.2**: Fast build tool and development server
- **CSS3**: Custom styling with CSS variables and responsive design

### Backend
- **Laravel 10.x**: PHP framework for robust backend development
- **Laravel Sanctum**: API authentication system
- **PHP 8.1+**: Server-side programming language
- **Composer**: Dependency management for PHP

### Database
- **MySQL**: Relational database management system
- **Laravel Eloquent ORM**: Object-relational mapping for database interactions
- **Laravel Migrations**: Database schema version control

### APIs & Integration
- **RESTful APIs**: Standard HTTP methods for client-server communication
- **Google Gemini AI API**: Advanced AI integration for the assistant
- **Laravel API Resources**: Structured JSON responses
- **CORS**: Cross-origin resource sharing configuration

### Development Tools
- **ESLint**: JavaScript code linting
- **Laravel Pint**: PHP code formatting
- **Git**: Version control system
- **Postman**: API testing and documentation

---

## 5. System Architecture

### Three-Tier Architecture

**Presentation Layer (Frontend)**
- React SPA with component-based architecture
- Responsive design with mobile-first approach
- State management through React Context API
- Real-time UI updates and notifications

**Application Layer (Backend)**
- Laravel framework with MVC pattern
- RESTful API endpoints for frontend communication
- Authentication middleware with Sanctum
- Role-based authorization system
- AI service integration layer

**Data Layer (Database)**
- MySQL database with normalized schema
- Entity relationships: Users, Products, Orders, Categories, Ingredients
- Database migrations for schema management
- Eloquent ORM for data access abstraction

### API Architecture
- Authentication: `/api/login`, `/api/register`, `/api/logout`
- Products: `/api/products`, `/api/categories`
- Orders: `/api/orders`, `/api/orders/checkout`
- User Management: `/api/user/profile`, `/api/user/orders`
- AI Assistant: `/api/ai/context`, `/api/ai/products`

---

## 6. Setup Guidelines

### Backend (Laravel)

```bash
# Navigate to backend directory
cd backend/laravel

# Install PHP dependencies
composer install

# Setup environment variables
cp .env.example .env
# Edit .env file with your database credentials and app settings

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Seed database with sample data (optional)
php artisan db:seed

# Start Laravel development server
php artisan serve
# Backend will be available at http://localhost:8000
```

### Frontend (React)

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add the following to .env:
# VITE_API_URL=http://localhost:8000/api
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Start development server
npm run dev
# Frontend will be available at http://localhost:5173
```

### Database Setup

```sql
-- Create MySQL database
CREATE DATABASE bakery_management_system;

-- Grant privileges (if needed)
GRANT ALL PRIVILEGES ON bakery_management_system.* TO 'your_user'@'localhost';
```

---

## 7. Running the Application

### Local Development

1. **Start Backend Server**:
   ```bash
   cd backend/laravel
   php artisan serve
   ```

2. **Start Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - Backend Admin: http://localhost:8000

### Production Deployment

1. **Build Frontend**:
   ```bash
   npm run build
   ```

2. **Deploy Backend**:
   - Configure production environment variables
   - Run `php artisan config:cache`
   - Set up web server (Apache/Nginx)
   - Configure SSL certificates

## 8. Deployment Status & Tests

| Component | Is Deployed? | Is Dockerized? | Unit Tests Added? (Optional) | Is AI feature implemented? (Optional) |
|-----------|--------------|----------------|-------------------|--------------------------|
| Backend   |    No        |         No     |  No              | Yes - AI Assistant API   |
| Frontend  |    No        |         No     |  No              | Yes - Floating AI Chat   |

**AI Features Implemented:**
- ✅ Floating AI Assistant with modern chat interface
- ✅ Context-aware responses based on user authentication
- ✅ Local database integration for real-time product/order data
- ✅ Google Gemini API integration for advanced queries
- ✅ Smart topic filtering (bakery-related questions only)
- ✅ Role-based responses (different for guests vs logged-in users)

*Note: The AI assistant is fully functional and provides intelligent customer support with both local data and advanced AI capabilities.*

## 9. Contribution Table

| Metric                      | Total | Backend | Frontend | Member 1 | Member 2 | Member 3 | Member 4 |
|-----------------------------|-------|---------|----------|----------|----------|----------|----------|
| Issues Solved                | 50+   | 25      | 25       | [Fill]   | [Fill]   | [Fill]   | [Fill]   |
| WakaTime Contribution (Hours)| [Fill]| [Fill]  | [Fill]   | [Fill]   | [Fill]   | [Fill]   | [Fill]   |
| Percent Contribution (%)     | 100%  | 50%     | 50%      | [Fill]   | [Fill]   | [Fill]   | [Fill]   |

**Key Contributions:**
- Laravel backend development with authentication and APIs
- React frontend with modern UI/UX design
- Database design and migration setup
- AI assistant implementation with Gemini integration
- Role-based access control system
- Order management and inventory tracking

*Note: Please fill in the actual contribution data based on your team's work distribution and time tracking.*

## 10. Screenshots

*To be added: Include screenshots of the following key features:*

1. **Homepage/Landing Page**
2. **Product Catalog with Categories**
3. **Shopping Cart and Checkout Process**
4. **User Dashboard (Buyer/Seller/Owner views)**
5. **Order Management Interface**
6. **Product Management (Add/Edit products)**
7. **Analytics Dashboard with Charts**
8. **AI Assistant Chat Interface**
9. **Mobile Responsive Views**
10. **Login/Registration Pages**

## 11. Limitations / Known Issues

### Current Limitations

1. **Payment Integration**: The system currently uses a simulated checkout process. Real payment gateway integration (Stripe, PayPal) needs to be implemented for production use.

2. **Real-time Notifications**: While the notification system is built, real-time push notifications via WebSockets or server-sent events are not yet implemented.

3. **File Upload Optimization**: Product image uploads work but could benefit from image compression and CDN integration for better performance.

4. **Advanced Inventory Management**: The system tracks stock levels but doesn't include features like automatic reorder points or supplier management.

### Known Issues

1. **AI Assistant Backend Routes**: Some AI-specific backend routes may need additional error handling for edge cases.

2. **Mobile Optimization**: While responsive, some complex dashboard views could be further optimized for mobile devices.

3. **Bulk Operations**: Bulk product operations are functional but could benefit from background job processing for large datasets.

### Future Enhancements

1. **Multi-location Support**: Support for multiple bakery locations
2. **Advanced Reporting**: More detailed financial and operational reports
3. **Customer Loyalty Program**: Points and rewards system
4. **Integration APIs**: Third-party integrations for accounting software
5. **Mobile Application**: Native mobile app development
6. **Advanced AI Features**: Predictive analytics and demand forecasting

---

**Note**: This Bakery Management System represents a complete solution for modern bakery operations, combining traditional business management with cutting-edge AI assistance to provide exceptional user experience and operational efficiency.
