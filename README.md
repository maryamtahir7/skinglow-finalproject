# 🌟 SkinGlow - AI-Powered Skincare E-Commerce Platform

A comprehensive, intelligent skincare e-commerce platform that combines advanced AI technology with modern web development to deliver personalized skincare recommendations and seamless shopping experiences.

![SkinGlow](https://img.shields.io/badge/SkinGlow-AI%20Skincare-teal) ![React](https://img.shields.io/badge/React-19.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Latest-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)

---

## 🎯 Project Overview

SkinGlow is a feature-rich e-commerce platform specifically designed for skincare products. It leverages cutting-edge AI technologies including Google Gemini, TensorFlow.js for face scanning, and advanced recommendation algorithms to provide users with personalized skincare solutions. The platform includes comprehensive admin management, secure authentication, and modern UI/UX design.

---

## ✨ Key Features

### 🤖 AI-Powered Features
- **AI Chat Assistant**: Intelligent conversational AI using Google Gemini API for personalized skincare advice
- **Face Analysis**: TensorFlow.js-powered face scanning for skin type detection and concern identification
- **Smart Recommendations**: AI-driven product recommendations based on skin concerns, preferences, and purchase history
- **Skin Quiz**: Interactive assessment to understand user skin types and concerns
- **Routine Generator**: Automated skincare routine suggestions based on AI analysis

### 🛒 E-Commerce Functionality
- **Product Catalog**: Comprehensive skincare product management with categories, ingredients, and benefits
- **Shopping Cart**: Persistent cart functionality with quantity management
- **Wishlist**: Save favorite products for later purchase
- **Checkout Process**: Secure checkout with multiple payment options (Stripe integration)
- **Order Management**: Complete order tracking and history
- **Product Reviews**: Customer review and rating system

### 👤 User Features
- **Secure Authentication**: Email/password signup with OTP verification
- **Google OAuth**: Seamless Google account integration
- **User Profiles**: Comprehensive profile management with skin preferences
- **Order History**: Track past orders and current order status
- **Personalized Recommendations**: AI-powered suggestions based on user data
- **Concern-Based Navigation**: Browse products by specific skin concerns

### 🔧 Admin Dashboard
- **Product Management**: Add, edit, and delete products with image uploads
- **Order Management**: View, update, and manage customer orders
- **Stock Management**: Real-time inventory tracking and alerts
- **Category Management**: Organize products into categories
- **Review Management**: Moderate and manage customer reviews
- **AI Employee**: Admin-specific AI tools for business insights
- **Reports & Analytics**: Sales reports, profit tracking, and business analytics
- **User Management**: View and manage customer accounts

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with beautiful desktop experience
- **Glassmorphism UI**: Modern glass-effect design with smooth animations
- **Dark Theme**: Elegant dark color scheme with excellent contrast
- **Smooth Animations**: Framer Motion-powered transitions and interactions
- **Voice Interface**: Voice commands for hands-free navigation
- **Floating AI Assistant**: Always-accessible AI chat interface
- **Progressive Web App**: PWA capabilities for mobile installation

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 19.0 with Vite 6.1.0
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 4.0.14 with custom animations
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React, React Icons
- **Animations**: Framer Motion 12.23.12
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **AI Integration**: Google Generative AI, Groq SDK

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL via Neon (serverless Postgres)
- **ORM**: Prisma 5.22.0
- **Authentication**: JWT tokens with email verification
- **Email Service**: Nodemailer with Gmail SMTP
- **Payment**: Stripe integration
- **AI Services**: Google Gemini API, TensorFlow.js

### Database Schema
- **Users**: Customer profiles with skin preferences and concerns
- **Products**: Comprehensive product data with ingredients and benefits
- **Orders**: Complete order management with status tracking
- **Cart & Wishlist**: User-specific shopping data
- **Reviews**: Customer feedback system
- **AI Memory**: Conversation history and recommendation data
- **Notifications**: User notification system

---

## 📁 Project Structure

```
SkinGlow-Final-Project/
├── api/                          # Backend API endpoints
│   ├── ai/                      # AI-related endpoints
│   │   ├── chat.js             # AI chat functionality
│   │   ├── vision-scan.js      # Face scanning API
│   │   ├── order-flow.js       # AI order processing
│   │   └── tools.js            # AI utility functions
│   ├── db-proxy.js             # Database proxy with Prisma
│   ├── send-otp.js             # OTP email sending
│   ├── verify-otp.js           # OTP verification
│   ├── contact.js              # Contact form handling
│   └── newsletter.js           # Newsletter subscription
├── prisma/
│   └── schema.prisma           # Database schema definition
├── src/
│   ├── components/             # Reusable React components
│   │   ├── ui/                # UI component library
│   │   ├── navbar.jsx         # Navigation bar
│   │   ├── footer.jsx         # Footer component
│   │   ├── FloatingAI.jsx     # AI chat interface
│   │   └── VoiceInterface.jsx # Voice command system
│   ├── pages/                 # Page components
│   │   ├── homepage.jsx       # Landing page
│   │   ├── products.jsx       # Product catalog
│   │   ├── productdetail.jsx  # Product details
│   │   ├── CartPage.jsx       # Shopping cart
│   │   ├── CheckoutPage.jsx   # Checkout process
│   │   ├── signup.jsx         # User registration
│   │   ├── login.jsx          # User login
│   │   ├── FaceScanPage.jsx   # Face analysis
│   │   ├── SkinQuiz.jsx       # Skin assessment
│   │   ├── AIChat/            # AI chat interface
│   │   └── admin/             # Admin dashboard pages
│   ├── backend/               # Backend client functions
│   │   └── auth.js            # Authentication logic
│   ├── context/               # React context providers
│   └── lib/                   # Utility functions
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Google Cloud Project with Gemini API key
- Gmail account for email services
- Stripe account for payments

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/maryamtahir7/skinglow-finalproject.git
cd skinglow-finalproject
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Email Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-app-specific-password"

# Google AI
GOOGLE_AI_API_KEY="your-google-gemini-api-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Admin Email
ADMIN_EMAIL="skin.glow.skincare.pk@gmail.com"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🎯 Usage Guide

### For Users

1. **Sign Up**: Create an account with email verification
2. **Skin Analysis**: Take the skin quiz or use face scanning for personalized recommendations
3. **Browse Products**: Explore products by category or concern
4. **AI Assistant**: Use the floating AI chat for skincare advice
5. **Shop**: Add products to cart and checkout securely
6. **Track Orders**: View order history and status in profile

### For Admins

1. **Access Admin Panel**: Login with admin credentials
2. **Manage Products**: Add new products with images and details
3. **Process Orders**: View and update order statuses
4. **Monitor Stock**: Track inventory levels
5. **View Analytics**: Check sales reports and business insights
6. **AI Tools**: Use AI employee for business recommendations

---

## 🔧 API Endpoints

### Authentication
- `POST /api/db-proxy` - Signup, login, and user management
- `POST /api/send-otp` - Send OTP verification email
- `POST /api/verify-otp` - Verify OTP code

### Products
- `POST /api/db-proxy` - Get products, add products, update products
- `GET /api/products/*` - Product-specific endpoints

### AI Services
- `POST /api/ai/chat` - AI chat conversation
- `POST /api/ai/vision-scan` - Face analysis
- `POST /api/ai/order-flow` - AI-powered order processing

### Orders
- `POST /api/orders/create` - Create new order
- `POST /api/db-proxy` - Order management

---

## 🎨 Key Technologies Explained

### AI Integration
- **Google Gemini API**: Advanced natural language processing for conversational AI
- **TensorFlow.js**: Client-side machine learning for face scanning and analysis
- **Groq SDK**: High-performance AI inference for real-time recommendations

### Modern Frontend
- **React 19**: Latest React features with improved performance
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS 4**: Latest utility-first CSS framework
- **Framer Motion**: Production-ready motion library for React

### Backend & Database
- **Prisma ORM**: Type-safe database access with excellent DX
- **PostgreSQL (Neon)**: Serverless PostgreSQL with automatic scaling
- **JWT Authentication**: Secure token-based authentication
- **Nodemailer**: Email sending with SMTP support

---

## 📊 Database Models

### Core Models
- **User**: Customer accounts with authentication and profiles
- **Product**: Skincare products with comprehensive details
- **Order**: Customer orders with items and status tracking
- **CartItem**: User shopping cart data
- **WishlistItem**: User saved products
- **Review**: Product reviews and ratings
- **AIMemory**: AI conversation history and preferences
- **Notification**: User notifications and alerts

### Relationships
- Users have many orders, cart items, wishlist items, and reviews
- Products belong to many orders, cart items, and wishlist items
- Orders contain many order items
- AI memory is tied to user conversations

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: OTP verification for signup
- **Password Hashing**: Secure password storage
- **Admin Role Protection**: Protected admin routes
- **Environment Variables**: Sensitive data in environment files
- **SQL Injection Prevention**: Prisma ORM protection
- **CORS Configuration**: Controlled cross-origin requests

---

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Push code to GitHub**
2. **Import project in Vercel**
3. **Configure environment variables**
4. **Deploy**

The project includes Vercel configuration in `vercel.json`.

### Manual Deployment

1. **Build the project**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

---

## 📱 PWA Features

- **Installable**: Can be installed on mobile devices
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Future capability for user engagement
- **App-like Experience**: Native mobile app feel

---

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🤝 Contributing

This is a final year project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**Developer**: Maryam Tahir
**Project**: SkinGlow - AI-Powered Skincare Platform
**Year**: 2026

---

## 🙏 Acknowledgments

- Google for Gemini AI API
- TensorFlow.js for machine learning capabilities
- Neon for PostgreSQL hosting
- Vercel for deployment platform
- Open source community for amazing libraries

---

## 📞 Support

For support or questions:
- Email: skin.glow.skincare.pk@gmail.com
- Project Repository: [GitHub](https://github.com/maryamtahir7/skinglow-finalproject)

---

## 🗺️ Roadmap

### Future Enhancements
- [ ] Advanced AR try-on features
- [ ] Subscription box service
- [ ] Mobile app development (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Loyalty program integration
- [ ] Live chat support
- [ ] Video consultations
- [ ] Integration with dermatologists

---

## 📸 Screenshots

*(Add screenshots of your application here)*

---

**Built with ❤️ for skincare enthusiasts**
