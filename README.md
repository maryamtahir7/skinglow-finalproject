<p align="center">
  <img src="https://img.shields.io/badge/SkinGlow-Premium%20Skincare-be123c?style=for-the-badge&logo=sparkles&logoColor=white" alt="SkinGlow Badge" />
</p>

<h1 align="center">✨ SkinGlow — AI-Powered Skincare E-Commerce Platform</h1>

<p align="center">
  <strong>An intelligent, full-stack skincare e-commerce web application with AI-driven diagnostics, conversational commerce, real-time face scanning, and a comprehensive admin dashboard.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/TensorFlow.js-BlazeFace-FF6F00?style=flat-square&logo=tensorflow" />
  <img src="https://img.shields.io/badge/Groq-LLaMA%203.3-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel" />
</p>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Proposed Solution](#-proposed-solution)
4. [Key Features](#-key-features)
5. [System Architecture](#-system-architecture)
6. [Technology Stack](#-technology-stack)
7. [Database Schema (ER Model)](#-database-schema-er-model)
8. [AI & Machine Learning Modules](#-ai--machine-learning-modules)
9. [User Roles & Access Control](#-user-roles--access-control)
10. [Application Pages & Routes](#-application-pages--routes)
11. [API Endpoints](#-api-endpoints)
12. [Screenshots](#-screenshots)
13. [Installation & Setup](#-installation--setup)
14. [Environment Variables](#-environment-variables)
15. [Deployment](#-deployment)
16. [Testing](#-testing)
17. [Future Enhancements](#-future-enhancements)
18. [Contributors](#-contributors)
19. [License](#-license)

---

## 🌟 Project Overview

**SkinGlow** is a comprehensive, production-grade AI-powered skincare e-commerce platform built as a **Final Year Project**. It combines modern web technologies with artificial intelligence to deliver a personalized, intelligent shopping experience for skincare enthusiasts.

Unlike traditional e-commerce platforms, SkinGlow integrates **conversational AI**, **real-time face scanning using TensorFlow.js**, **voice-enabled interaction**, **personalized skincare quiz recommendations**, and **an AI-powered business intelligence system for administrators** — making it a truly next-generation skincare platform.

### 🎯 Project Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Build a fully functional skincare e-commerce platform with product management, cart, wishlist, and checkout | ✅ Complete |
| 2 | Integrate AI chatbot for personalized skincare consultation and conversational commerce | ✅ Complete |
| 3 | Implement real-time face scanning using TensorFlow.js (BlazeFace) for skin analysis | ✅ Complete |
| 4 | Create an intelligent skincare quiz that recommends products based on user responses | ✅ Complete |
| 5 | Develop a comprehensive admin dashboard with AI-powered business analytics | ✅ Complete |
| 6 | Implement secure authentication with OTP verification via email | ✅ Complete |
| 7 | Deploy to production on Vercel with a cloud-hosted PostgreSQL database | ✅ Complete |

---

## 🔍 Problem Statement

The skincare industry faces a significant **personalization gap**. Consumers often struggle with:

- **Information Overload**: Thousands of products with complex ingredient lists make it difficult for average consumers to choose the right products for their skin type.
- **Lack of Expert Access**: Professional dermatological consultations are expensive and inaccessible to many.
- **Generic Recommendations**: Traditional e-commerce platforms provide one-size-fits-all product listings without considering individual skin types, concerns, or preferences.
- **Trial-and-Error Purchasing**: Without proper guidance, consumers waste money on products that don't suit their skin, leading to frustration and potential skin damage.

---

## 💡 Proposed Solution

SkinGlow addresses these challenges by providing:

1. **AI Virtual Esthetician** — A conversational AI chatbot (powered by Groq LLaMA 3.3 70B) that acts as a personal skincare consultant, answering questions, recommending products from the real catalog, and even placing orders through natural conversation.

2. **Real-Time Face Scanning** — Using TensorFlow.js BlazeFace model, users can scan their face via webcam/camera to receive AI-generated skin analysis and personalized product recommendations.

3. **Intelligent Skin Quiz** — A multi-step interactive quiz that assesses skin type, concerns, environment, and lifestyle to generate a tailored product recommendation list.

4. **Conversational Commerce** — Users can add products to cart, search the catalog, and place complete orders entirely through the AI chatbot — with structured confirmation flows and real-time inventory checks.

5. **Admin AI Employee** — Store administrators have access to an AI-powered business analyst that queries live database analytics to report on revenue, top-selling products, and inventory alerts.

---

## 🚀 Key Features

### 🛒 E-Commerce Core
| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse, search, and filter products by category, skin type, concern, and price range |
| **Product Detail Pages** | High-quality multi-image galleries, ingredient lists, benefits, reviews, and related products |
| **Shopping Cart** | Real-time cart management with quantity adjustments and persistent storage |
| **Wishlist** | Save favorite products for future purchase |
| **Checkout System** | Multi-step checkout with Cash on Delivery (COD) and Stripe payment integration |
| **Order Tracking** | Full order history with status updates (Pending → Shipped → Delivered) |
| **Product Reviews** | Authenticated users can rate and review products with star ratings |
| **Product Search** | Real-time search across product names, categories, and descriptions |

### 🤖 AI & Intelligence
| Feature | Description |
|---------|-------------|
| **AI Virtual Esthetician** | Groq LLaMA 3.3 70B conversational AI for skincare advice and shopping assistance |
| **Voice Interface** | Speech-to-text input and text-to-speech responses with professional female voice synthesis |
| **Face Scan Analysis** | TensorFlow.js BlazeFace real-time face detection with AI skin condition assessment |
| **Skin Quiz Engine** | Multi-step diagnostic quiz with algorithmic product matching based on skin profile |
| **Conversational Commerce** | Add-to-cart, product search, and complete order placement through natural language |
| **AI Business Analyst** | Admin-facing AI employee with live database tool-calling for business intelligence |
| **Smart Recommendations** | Concern-based and skin-type-based product ranking with weighted scoring algorithm |

### 👤 User Experience
| Feature | Description |
|---------|-------------|
| **Google OAuth Login** | One-click sign-in with Google Account |
| **Email OTP Verification** | Secure 6-digit OTP sent via branded SkinGlow email with JWT-based verification |
| **User Profiles** | Personal profile management with order history |
| **Skincare Routine Builder** | AM/PM routine tracker with progress persistence and product recommendations |
| **Skin Concern Explorer** | Browse products by specific skin concerns (acne, aging, dryness, pigmentation, sensitivity, pores) |
| **Blog & Education** | Skincare education articles with detailed content pages |
| **Real-time Notifications** | In-app notification system with read/unread management |
| **Responsive Design** | Fully responsive across desktop, tablet, and mobile devices |
| **PWA Support** | Installable as a Progressive Web App on mobile devices |

### 🛡️ Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Product Management** | Full CRUD operations with multi-image upload and category tagging |
| **Category Management** | Create, edit, and delete product categories with image support |
| **Order Management** | View all orders, update status (Pending/Shipped/Delivered/Cancelled), delete orders |
| **Inventory & Stock** | Track stock levels with low-stock alerts via n8n webhook automation |
| **Financial Reports** | Monthly sales and profit reports with auto-generation from order data |
| **Review Moderation** | View, manage, and remove customer reviews |
| **AI Business Analyst** | Ask natural-language questions about revenue, trends, and inventory |
| **Role-Based Access** | Admin routes protected with role verification middleware |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    React 19 + Vite 6                       │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ Homepage │ │ Products │ │ AI Chat  │ │  Face Scan   │  │  │
│  │  │          │ │ & Detail │ │ & Voice  │ │ (TF.js)      │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │   Cart   │ │ Checkout │ │SkinQuiz  │ │Admin Dashboard│  │  │
│  │  │& Wishlist│ │& Payment │ │& Routine │ │ & AI Employee│  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│         │ Axios / Fetch API                                      │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  VERCEL SERVERLESS FUNCTIONS                      │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                    API Layer (/api/)                     │     │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐  │     │
│  │  │ db-proxy │ │ send-otp │ │ verify-otp│ │ contact  │  │     │
│  │  │(All CRUD)│ │(Nodemailer│ │  (JWT)   │ │newsletter│  │     │
│  │  └──────────┘ └──────────┘ └───────────┘ └──────────┘  │     │
│  │  ┌──────────────────────────────────────────────────┐   │     │
│  │  │              AI Module (/api/ai/)                 │   │     │
│  │  │  ┌────────┐ ┌────────────┐ ┌──────────────────┐  │   │     │
│  │  │  │  chat  │ │ admin-chat │ │   vision-scan    │  │   │     │
│  │  │  │(Groq)  │ │(Tool-Call) │ │  (Skin Analysis) │  │   │     │
│  │  │  └────────┘ └────────────┘ └──────────────────┘  │   │     │
│  │  │  ┌─────────────┐ ┌───────────┐ ┌──────────────┐  │   │     │
│  │  │  │ order-flow  │ │ shopping  │ │  recommend   │  │   │     │
│  │  │  │ (28KB logic)│ │  intent   │ │   intent     │  │   │     │
│  │  │  └─────────────┘ └───────────┘ └──────────────┘  │   │     │
│  │  └──────────────────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────────┘     │
│         │ Prisma ORM                                             │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────┐
│              NEON PostgreSQL (Cloud Database)                     │
│  ┌────────┐ ┌─────────┐ ┌───────┐ ┌──────┐ ┌────────────────┐  │
│  │  User  │ │ Product │ │ Order │ │Review│ │  Notification  │  │
│  │Profile │ │Category │ │ Item  │ │Stock │ │CartItem/Wishlist│  │
│  └────────┘ └─────────┘ └───────┘ └──────┘ └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0 | UI component library with hooks-based architecture |
| **Vite** | 6.4 | Next-generation build tool with HMR (Hot Module Replacement) |
| **TailwindCSS** | 4.0 | Utility-first CSS framework for responsive design |
| **Framer Motion** | 12.x | Production-ready animation library for React |
| **React Router DOM** | 7.8 | Client-side routing with nested layouts |
| **Lucide React** | 0.542 | Beautiful, consistent icon library |
| **React Hook Form** | 7.62 | Performant form handling with validation |
| **Zod** | 4.1 | TypeScript-first schema validation |
| **React Markdown** | 10.1 | Render markdown content (AI responses, blog posts) |
| **Radix UI** | Latest | Accessible, unstyled UI primitives (Dialog, Select, Tabs, etc.) |

### AI & Machine Learning
| Technology | Purpose |
|------------|---------|
| **Groq SDK** (LLaMA 3.3 70B Versatile) | High-speed LLM inference for conversational AI |
| **TensorFlow.js** | Client-side machine learning runtime |
| **BlazeFace Model** | Real-time face detection in the browser |
| **Web Speech API** | Browser-native speech recognition and synthesis |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Node.js** (Vercel Serverless Functions) | API endpoints as serverless functions |
| **Prisma ORM** (v5.22) | Type-safe database client with migrations |
| **PostgreSQL** (Neon Cloud) | Production-grade relational database |
| **JWT** (jsonwebtoken) | Stateless authentication tokens |
| **Nodemailer** | Transactional email delivery for OTP verification |

### Payments & Third-Party
| Technology | Purpose |
|------------|---------|
| **Stripe** | Secure payment processing (card payments) |
| **Google OAuth 2.0** | Social authentication via Google accounts |
| **n8n Webhooks** | Workflow automation for order confirmations and stock alerts |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Vercel** | Production deployment with serverless functions and edge CDN |
| **GitHub** | Version control and CI/CD pipeline trigger |
| **ESLint** | Code quality and linting enforcement |
| **Vitest** | Unit testing framework compatible with Vite |
| **Playwright** | End-to-end browser testing |

---

## 📊 Database Schema (ER Model)

The database is managed through **Prisma ORM** with **13 interconnected models** in a PostgreSQL database:

```
┌───────────────┐       ┌─────────────────┐       ┌──────────────┐
│     User      │       │     Product     │       │   Category   │
├───────────────┤       ├─────────────────┤       ├──────────────┤
│ id (PK)       │──┐    │ id (PK)         │       │ id (PK)      │
│ email (UNIQUE)│  │    │ name            │       │ name         │
│ password      │  │    │ description     │       │ description  │
│ name          │  │    │ category        │       │ image        │
│ role (ENUM)   │  │    │ ingredients[]   │       │ createdAt    │
│ createdAt     │  │    │ skinTypes[]     │       └──────────────┘
│ updatedAt     │  │    │ benefits[]      │
└───────────────┘  │    │ price           │       ┌──────────────┐
                   │    │ stock           │       │    Report    │
┌───────────────┐  │    │ imageUrl (x3)   │       ├──────────────┤
│CustomerProfile│  │    │ concerns        │       │ id (PK)      │
├───────────────┤  │    └─────────────────┘       │ type         │
│ id (PK)       │  │           │                  │ month        │
│ userId (FK)───┤──┘           │                  │ year         │
│ skinType      │              │                  │ totalSales   │
│ concerns[]    │    ┌─────────┼───────┐          │ profit       │
│ allergies[]   │    │         │       │          └──────────────┘
└───────────────┘    ▼         ▼       ▼
               ┌─────────┐ ┌──────┐ ┌──────────┐
               │CartItem │ │Review│ │WishlistItem│
               ├─────────┤ ├──────┤ ├──────────┤
               │userId(FK)│ │userId│ │userId(FK)│
               │productId │ │prodId│ │productId │
               │quantity  │ │rating│ │createdAt │
               └─────────┘ │comment│ └──────────┘
                            └──────┘
┌───────────────┐     ┌──────────────┐     ┌──────────────┐
│     Order     │     │  OrderItem   │     │    Stock     │
├───────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)       │◄────│ orderId (FK) │     │ id (PK)      │
│ userId (FK)   │     │ productId(FK)│     │ productId(FK)│
│ name, phone   │     │ quantity     │     │ quantity     │
│ address, city │     │ price        │     │ status       │
│ total         │     └──────────────┘     └──────────────┘
│ status (ENUM) │
│ paymentMethod │     ┌──────────────┐
└───────────────┘     │ Notification │
                      ├──────────────┤
┌───────────────┐     │ id (PK)      │
│   AIMemory    │     │ userId (FK)  │
├───────────────┤     │ message      │
│ id (PK)       │     │ type         │
│ userId (FK)   │     │ read         │
│ conversation  │     └──────────────┘
│ recommendations│
│ preferences   │
└───────────────┘
```

### Enums
- **Role**: `ADMIN` | `CUSTOMER`
- **OrderStatus**: `PENDING` | `PAID` | `SHIPPED` | `DELIVERED` | `CANCELLED`

---

## 🧠 AI & Machine Learning Modules

### 1. AI Virtual Esthetician (Conversational AI)

The core AI system is powered by **Groq's LLaMA 3.3 70B Versatile** model and consists of multiple specialized intent handlers:

| Module | File | Responsibility |
|--------|------|---------------|
| **Chat Controller** | `api/ai/chat.js` | Main orchestrator — routes user messages through intent detection pipeline |
| **Order Flow Engine** | `api/ai/_order-flow.js` | Multi-step order placement with shipping detail collection (28KB of logic) |
| **Shopping Intent** | `api/ai/_shopping-intent.js` | Add-to-cart detection, product search, and confirmation card generation |
| **Recommend Intent** | `api/ai/_recommend-intent.js` | Concern-based and skin-type-based product recommendations with scoring |
| **Response Utils** | `api/ai/_response-utils.js` | Sanitization of AI responses to prevent leaking tool calls or code blocks |
| **Tool Functions** | `api/ai/_tools.js` | Database query tools — searchProducts, getCartItems, placeOrder, etc. |

**Conversational Commerce Flow:**
```
User Message → Intent Detection → Route to Handler
  ├── "place my order" → Order Flow Engine → Collect Details → Confirm → Place
  ├── "add X to cart"  → Shopping Intent → Search DB → Show Card → Confirm → Add
  ├── "recommend moisturizer" → Recommend Intent → Score Products → Show Cards
  └── General skincare Q → Groq LLaMA 3.3 → Natural Language Response
```

### 2. AI Business Analyst (Admin)

| Module | File | Responsibility |
|--------|------|---------------|
| **Admin Chat** | `api/ai/admin-chat.js` | Groq-powered chat with function-calling for live DB analytics |
| **Admin Tools** | `api/ai/_admin-tools.js` | Tool declarations for revenue queries, top products, and stock alerts |

The admin AI uses Groq's **tool-calling** capability to query the live database and return formatted reports with markdown tables.

### 3. Face Scan (TensorFlow.js)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **BlazeFace Model** | `@tensorflow-models/blazeface` | Real-time face detection via webcam |
| **TensorFlow.js** | `@tensorflow/tfjs` | ML runtime in the browser (no server needed) |
| **Vision Scan API** | `api/ai/vision-scan.js` | Server-side skin analysis with product recommendations |

**Face Scan Pipeline:**
```
Camera Feed → TF.js BlazeFace Detection → Face Crop → Base64 Encode
  → Send to Vision API → Skin Analysis → Product Recommendations
```

### 4. Voice Interface

The platform features a **bi-directional voice interface** using the Web Speech API:
- **Speech-to-Text**: Users speak their queries, which are transcribed and sent to the AI
- **Text-to-Speech**: AI responses are read aloud with a professional female voice
- **Voice Selection**: Intelligent voice matching algorithm that prefers natural female voices

---

## 👥 User Roles & Access Control

| Role | Access Level | Capabilities |
|------|-------------|-------------|
| **Guest** | Public pages only | Browse products, read blogs, take skin quiz |
| **Customer** | Authenticated user | All guest features + cart, wishlist, checkout, orders, AI chat, face scan, profile |
| **Admin** | Full system access | All customer features + admin dashboard, product/order/stock management, AI employee, reports |

Admin access is enforced via the `AdminRoute` component which checks `user.role === 'ADMIN'` before rendering admin pages.

---

## 📄 Application Pages & Routes

### Public Routes (No Authentication Required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero carousel, featured products, brand pillars, categories |
| `/products` | Products Catalog | Grid view with search, category, skin type, and price filters |
| `/products/:id` | Product Detail | Multi-image gallery, reviews, add-to-cart, related products |
| `/about` | About Us | Brand story, mission, and values |
| `/blog` | Blog Listing | Skincare education articles |
| `/blog/:id` | Blog Detail | Full article with reading time and share options |
| `/concerns` | Skin Concerns | Browse by concern (acne, aging, dryness, pigmentation, etc.) |
| `/contact` | Contact | Contact form with email submission |
| `/login` | Login | Email/password + Google OAuth login |
| `/signup` | Signup | Registration with 6-digit OTP email verification |
| `/forgot-password` | Forgot Password | OTP-based password reset flow |
| `/privacy-policy` | Privacy Policy | Legal privacy documentation |
| `/terms` | Terms of Service | Terms and conditions |
| `/support` | Support | Customer support information |
| `/shipping` | Shipping Info | Delivery and shipping policy |
| `/returns` | Returns | Return and refund policy |

### Authenticated Routes (Login Required)

| Route | Page | Description |
|-------|------|-------------|
| `/cart` | Shopping Cart | Manage cart items, quantities, and proceed to checkout |
| `/wishlist` | Wishlist | Saved products for future purchase |
| `/checkout` | Checkout | Shipping details, payment method, order confirmation |
| `/orders` | My Orders | Order history with status tracking |
| `/profile` | User Profile | Personal information management |
| `/ai-chat` | AI Chat (Full Page) | Dedicated AI skincare consultation page |
| `/face-scan` | Face Scan | TensorFlow.js face detection and AI skin analysis |
| `/skin-quiz` | Skin Quiz | Multi-step quiz with personalized recommendations |
| `/routine` | Routine Builder | AM/PM skincare routine tracker with progress persistence |

### Admin Routes (Admin Role Required)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Admin overview with navigation sidebar |
| `/admin/products` | Manage Products | View, edit, delete all products |
| `/admin/add-product` | Add Product | Create new product with multi-image upload |
| `/admin/categories` | Categories | Manage product categories |
| `/admin/orders` | Orders | View and update all customer orders |
| `/admin/stock` | Inventory | Stock level tracking and management |
| `/admin/reports` | Reports | Sales and profit analytics with auto-generation |
| `/admin/reviews` | Reviews | Moderate customer reviews |
| `/admin/ai-employee` | AI Analyst | AI-powered business intelligence chat |

---

## 🔌 API Endpoints

### Core Database Proxy
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/db-proxy` | Unified database proxy handling 30+ actions via `action` field |

The `db-proxy` handles all CRUD operations for: Users, Products, Orders, Cart, Wishlist, Reviews, Categories, Reports, Stocks, and Notifications.

### AI Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | Customer-facing AI chatbot with multi-intent handling |
| `POST` | `/api/ai/admin-chat` | Admin AI business analyst with tool-calling |
| `POST` | `/api/ai/vision-scan` | Face scan image analysis and product recommendations |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/send-otp` | Send 6-digit OTP to user email via Nodemailer |
| `POST` | `/api/verify-otp` | Verify OTP using JWT token validation |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Submit contact form messages |
| `POST` | `/api/newsletter` | Newsletter subscription |
| `POST` | `/api/orders/create` | Direct order creation with n8n webhook trigger |
| `POST` | `/api/products/update-stock` | Stock update with low-stock alert automation |

---

## 📸 Screenshots

> Screenshots of the live application can be viewed by visiting the deployed URL or running the project locally.

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** v18+ installed
- **npm** v9+ installed
- **PostgreSQL** database (local or cloud — we recommend [Neon](https://neon.tech))
- **Git** installed

### Step 1: Clone the Repository

```bash
git clone https://github.com/maryamtahir7/skinglow-finalproject.git
cd skinglow-finalproject
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root (see [Environment Variables](#-environment-variables) section below).

### Step 4: Set Up the Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### Step 5: Start the Development Server

```bash
npm run dev
```

This runs both the **Vite frontend** (port 5173) and the **API server** (port 8085) concurrently.

### Step 6: Access the Application

- **Frontend**: `http://localhost:5173`
- **API Server**: `http://localhost:8085`

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# 🔐 Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 🤖 AI - Groq (LLaMA 3.3)
GROQ_API_KEY=your_groq_api_key
VITE_GROQ_API_KEY=your_groq_api_key

# 📧 Email OTP (Gmail)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password

# 🔒 JWT Secret
JWT_SECRET=your_jwt_secret_key

# 💳 Stripe Payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_STRIPE_SECRET_KEY=sk_test_xxxxx

# 🗄️ Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# 🔄 n8n Webhooks (Optional)
N8N_WEBHOOK_URL=http://localhost:5678
```

> **Note**: For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833) (not your regular password). Enable 2FA on your Google account first.

---

## 🚀 Deployment

The application is deployed on **Vercel** with the following configuration:

### Vercel Deployment Steps

1. **Connect GitHub Repository** to Vercel
2. **Set Environment Variables** in Vercel Dashboard → Settings → Environment Variables
3. **Deploy** — Vercel auto-detects the Vite framework and builds automatically

### Production Architecture on Vercel

| Component | Vercel Feature |
|-----------|---------------|
| Frontend (React + Vite) | Static Assets + CDN |
| API Routes (`/api/*`) | Serverless Functions |
| Database | External (Neon PostgreSQL) |
| AI Inference | External (Groq Cloud) |

### Key Deployment Files

| File | Purpose |
|------|---------|
| `vercel.json` | Build configuration, rewrites for SPA routing |
| `.vercelignore` | Files excluded from deployment |
| `.npmrc` | NPM configuration for legacy peer dependencies |

---

## 🧪 Testing

### Testing Framework

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing (compatible with Vite's module system) |
| **Testing Library** | React component testing utilities |
| **Playwright** | End-to-end browser automation testing |

### Running Tests

```bash
# Unit Tests
npm run test:unit

# End-to-End Tests
npm run test:e2e
```

---

## 🔮 Future Enhancements

| Enhancement | Description | Priority |
|------------|-------------|----------|
| **AI Image Analysis** | Integrate Google Gemini Vision for actual dermatological-grade skin analysis from photos | High |
| **Subscription Boxes** | Monthly curated skincare boxes based on user profile | Medium |
| **AR Try-On** | Augmented reality product try-on using face mesh | Medium |
| **Multi-Language** | Support for Urdu, Arabic, and other languages | Medium |
| **Mobile App** | React Native companion app with push notifications | Low |
| **Loyalty Program** | Points-based rewards system for repeat customers | Low |
| **Ingredient Checker** | AI-powered ingredient safety and compatibility analysis | High |

---

## 👩‍💻 Contributors

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Maryam Tahir** | Full-Stack Developer & Project Lead | Frontend development, AI integration, database design, deployment |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with 💖 for skincare enthusiasts everywhere</strong>
  <br/>
  <sub>SkinGlow — Where AI Meets Beautiful Skin</sub>
</p>
