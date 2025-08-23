# 🍞 Bakery Management System - Frontend

A modern React.js frontend application for the Bakery Management System, providing an intuitive interface for managing bakery operations, inventory, orders, and analytics.

## 📌 Project Overview

This is the client-side application of the Bakery Management System, built with React.js and JavaScript. It provides a responsive, user-friendly interface for bakery staff and administrators to manage daily operations efficiently.

## 👥 Team Members

<div align="center">

| Member | Student ID | Role | WakaTime Stats |
|--------|------------|------|----------------|
| **Adel Mohammad Zahid** | 20220204057 | Project Setup & Dashboard | [![wakatime](https://wakatime.com/badge/user/arany-hasan-uuid.svg)](https://wakatime.com/@arany-hasan) |
| **Saleh Mahmud Sami** | 20220204061 | Product & Inventory UI | [![wakatime](https://wakatime.com/badge/user/adel-zahid-uuid.svg)](https://wakatime.com/@adel-zahid) |
| **Md. Rubayet Islam** | 20220204069 | Orders & Analytics UI | [![wakatime](https://wakatime.com/badge/user/rehnuma-tarannum-uuid.svg)](https://wakatime.com/@rehnuma-tarannum) |
| **Abhishek Sarker** | 20220204104 | Expense & AI Interface | [![wakatime](https://wakatime.com/badge/user/rubayet-islam-uuid.svg)](https://wakatime.com/@rubayet-islam) |

</div>

### Team Contributions Dashboard
[![Team WakaTime Stats](https://github-readme-stats.vercel.app/api/wakatime?username=your-team-username&layout=compact&theme=radical)](https://wakatime.com/@your-team-username)

## 🎯 Features

### 🏠 Dashboard
- Real-time business metrics and KPIs
- Sales overview and trend charts
- Low stock alerts and notifications
- Quick action buttons for common tasks

### 🧁 Product Management
- Visual product catalog with image support
- Advanced search and filtering
- Category-based organization
- Bulk operations and batch updates

### 📦 Inventory Management
- Real-time stock level indicators
- Interactive stock adjustment tools
- Low stock alert notifications
- Inventory reports and analytics

### 🛒 Order Processing
- Streamlined order creation interface
- Point-of-Sale (POS) system
- Order status tracking
- Customer management integration

### 📊 Analytics & Reporting
- Interactive charts and graphs
- Customizable date range selection
- Export functionality (PDF, Excel)
- Real-time data visualization

### 🤖 AI Assistant
- Natural language query interface
- Business insights and recommendations
- Interactive chat with conversation history

## 🛠 Technology Stack

- **Framework**: React 18 with JavaScript
- **Build Tool**: Vite
- **State Management**: React Context API / Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Material-UI (MUI) / Tailwind CSS
- **Charts**: Chart.js / Recharts
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **Icons**: Lucide React / Material Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bakery-frontend.git
   cd bakery-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_APP_NAME="Bakery Management System"
   VITE_OPENAI_API_KEY=your-openai-key
   VITE_APP_VERSION=1.0.0
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── Dashboard/
│   ├── Products/
│   ├── Inventory/
│   ├── Orders/
│   ├── Analytics/
│   └── Auth/
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── store/              # State management
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests

## 🎨 UI/UX Design

### Design System
- **Colors**: Primary bakery-themed color palette
- **Typography**: Clean, readable fonts optimized for business use
- **Layout**: Responsive design supporting desktop, tablet, and mobile
- **Components**: Consistent component library following design system

### Figma Design
➡️ [View Complete Design System](https://www.figma.com/proto/t0QP8QQegDLzJzYW0S0gW6/Dhaka-Bakery-SMS?page-id=0%3A1&node-id=17-844&p=f&viewport=809%2C536%2C0.13&t=MtiRfGsSFikNUlqZ-1&scaling=min-zoom&content-scaling=fixed)

## 🔌 API Integration

The frontend communicates with the backend API using Axios for HTTP requests. Authentication is handled through JWT tokens with automatic token refresh and secure storage.

### Key Service Areas
- **Authentication**: Login, logout, and token management
- **Products**: CRUD operations for product management
- **Inventory**: Stock level tracking and adjustments
- **Orders**: Order creation and management
- **Analytics**: Dashboard metrics and reporting data

## 🧪 Testing

### Testing Stack
- **Framework**: Vitest
- **Testing Library**: React Testing Library

### Running Tests
```bash
npm run test
npm run test:coverage
```

## 📊 Performance Optimization

- Code splitting with React.lazy()
- Route-based code splitting
- Component lazy loading
- Image optimization and lazy loading
- API response caching

## 🌐 Deployment

### Build Process
```bash
npm run build
npm run preview
```

### Recommended Platforms
- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**

## 🔒 Security

### Authentication & Security Features
- JWT token-based authentication
- Automatic token refresh
- Role-based route protection
- Input sanitization and XSS protection
- Secure API communication

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Optimizations
- Touch-friendly interface
- Responsive navigation
- Optimized forms
- Fast loading performance

## 📋 Development Checkpoints

### Checkpoint 1: Foundation ✅
- [x] Project setup with React + JavaScript + Vite
- [ ] Authentication system and protected routes
- [ ] Basic dashboard layout and navigation
- [ ] Responsive design foundation

### Checkpoint 2: Core Features 🔄
- [ ] Product management interface
- [ ] Inventory management dashboard
- [ ] Order processing system
- [ ] Analytics and reporting interface

### Checkpoint 3: Advanced Features ⏳
- [ ] Expense management interface
- [ ] AI assistant chat interface
- [ ] Performance optimization
- [ ] Final testing and deployment

## 🔗 Related Repositories

- **Backend API**: [bakery-backend](https://github.com/BakeryManagementSystem/backend)

## 📄 License

This project is developed for **CSE 3104 Database Lab** at Ahsanullah University of Science and Technology and is intended for academic purposes.

---

**Course**: CSE 3104 Database Lab  
**Institution**: Ahsanullah University of Science and Technology  
**Semester**: Fall 2024
