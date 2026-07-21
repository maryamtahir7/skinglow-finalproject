<p align="center">
  <img src="https://img.shields.io/badge/SkinGlow-Premium%20Skincare-be123c?style=for-the-badge&logo=sparkles&logoColor=white" alt="SkinGlow Badge" />
</p>

<h1 align="center">✨ SkinGlow — Next-Generation AI Skincare Platform</h1>

<p align="center">
  <strong>An intelligent, full-stack e-commerce ecosystem integrating Computer Vision, Generative AI, and Conversational Commerce to revolutionize personalized skincare.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/TensorFlow.js-BlazeFace-FF6F00?style=flat-square&logo=tensorflow" />
  <img src="https://img.shields.io/badge/Groq-LLaMA%203.3-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel" />
</p>

---

## 📋 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Problem Domain & Motivation](#-problem-domain--motivation)
3. [System Architecture & Engineering](#-system-architecture--engineering)
4. [Artificial Intelligence Integration](#-artificial-intelligence-integration)
5. [Core System Modules](#-core-system-modules)
6. [Database Schema (ER Model)](#-database-schema-er-model)
7. [Security & Authentication](#-security--authentication)
8. [Application Interfaces (Screenshots)](#-application-interfaces-screenshots)
9. [Installation & Local Deployment](#-installation--local-deployment)
10. [Cloud Deployment Strategy](#-cloud-deployment-strategy)
11. [Conclusion & Future Scope](#-conclusion--future-scope)

---

## 🌟 Executive Summary

**SkinGlow** is a comprehensive, production-grade AI-powered skincare e-commerce platform designed and developed as a **Final Year Project**. The platform bridges the gap between generic e-commerce and personalized dermatological consultation by leveraging modern web technologies alongside advanced artificial intelligence.

Unlike traditional shopping platforms, SkinGlow employs a sophisticated multi-agent AI architecture. It features a **Conversational Virtual Esthetician** for natural language shopping, **Computer Vision** for real-time facial skin analysis, and an **Autonomous Business Intelligence Analyst** for platform administrators.

---

## 🔍 Problem Domain & Motivation

The skincare industry suffers from a severe **personalization deficit**. Consumers face several critical challenges:

1. **The Paradox of Choice**: Consumers are overwhelmed by thousands of complex chemical formulations, leading to decision paralysis.
2. **Inaccessible Expertise**: Professional dermatological advice is costly and not readily accessible for daily consumer queries.
3. **Generic User Experiences**: Traditional e-commerce relies on static filtering, ignoring the nuanced, multi-variable nature of human skin profiles.

**SkinGlow's Solution:** By engineering a system that intelligently extracts user context (via conversational intent detection, visual face scanning, and structured quizzes) and maps it against a dynamic product database using custom scoring algorithms, SkinGlow delivers hyper-personalized, expert-level recommendations instantly.

---

## 🏗️ System Architecture & Engineering

The application follows a modern **Serverless Monorepo** architectural pattern, ensuring high scalability and separation of concerns.

```text
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER (React)                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  State Management: Context API & Custom Hooks              │  │
│  │  Routing: React Router DOM (Protected & Admin Routes)      │  │
│  │  Styling: Tailwind CSS & Framer Motion                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│         │ RESTful API over HTTPS                                 │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  SERVERLESS TIER (Vercel Node.js)                │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  API Gateway & Middleware Routing                       │     │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │     │
│  │  │ CRUD Handlers│ │ Auth (OTP/JWT)│ │ AI Orchestrator │  │     │
│  │  └──────────────┘ └──────────────┘ └─────────────────┘  │     │
│  └─────────────────────────────────────────────────────────┘     │
│         │ TCP / SSL                                              │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  DATA TIER (Cloud PostgreSQL)                    │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  Prisma ORM Layer (Type-Safe Query Builder)             │     │
│  │  Relational Database (Neon Tech)                        │     │
│  └─────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

### Engineering Highlights:
- **Custom Algorithm Design**: Implemented a weighted heuristic scoring algorithm (`scoreProductForSkin`) that ranks products based on string matching across ingredients, benefits, and skin-type tags against detected user concerns.
- **Dynamic Import Bypassing**: Engineered custom static routing for Serverless environments to ensure Vercel's `@vercel/nft` bundler successfully compiles AI intent modules.
- **Optimized Asset Delivery**: Utilized Vite for aggressive code-splitting and chunk size optimization, ensuring rapid load times despite heavy ML dependencies.

---

## 🧠 Artificial Intelligence Integration

SkinGlow implements AI not as a gimmick, but as core infrastructure.

### 1. Conversational Commerce (NLP)
Powered by **Groq LLaMA 3.3 70B Versatile**, the chatbot acts as a state machine. It uses custom **Intent Detection** (Regex + NLP mapping) to route user messages:
- **Order Flow Engine**: Autonomously collects missing shipping details, handles cart selection, and executes orders entirely through chat.
- **Recommendation Engine**: Parses complex user queries ("I have dry skin and acne") and queries the database for mathematically optimized product matches.

### 2. Computer Vision (TensorFlow.js)
The platform performs on-device ML inference using **BlazeFace**.
- Captures real-time webcam feeds.
- Detects facial boundaries and extracts localized image crops.
- Passes extracted visual data to the backend AI heuristic engine to detect redness, dryness, or oiliness and recommend corrective products.

### 3. Voice Interactivity
Integrated the **Web Speech API** to provide bi-directional accessibility:
- Voice-to-Text command interpretation.
- Text-to-Speech response generation utilizing a custom voice-filtering algorithm to select professional female AI voices across different operating systems.

### 4. Autonomous Business Analyst
The Admin portal features an AI employee with **Tool Calling Capabilities**. The LLM can autonomously decide to execute predefined database queries (e.g., `getRevenueReport()`, `getLowStockItems()`) based on the admin's natural language questions, translating complex SQL operations into simple chat.

---

## 📦 Core System Modules

### 🛍️ Customer Experience
- **Interactive Skin Quiz**: A dynamic state-driven form that builds a persistent user profile and dynamically alters the store's default recommendations.
- **Routine Builder**: An intelligent AM/PM tracking system utilizing `localStorage` and date-diffing to monitor daily skincare adherence.
- **Comprehensive Catalog**: Advanced filtering by specific concerns (Hyperpigmentation, Acne, Aging) with real-time stock validation.
- **Checkout Flow**: Seamless cart-to-order pipeline with Cash on Delivery (COD) processing and order status tracking.

### 🛡️ Administrator Dashboard
- **Analytics & Reporting**: Auto-generated monthly financial reports calculating revenue and profit margins.
- **Inventory Management**: Real-time stock tracking with visual low-stock indicators and CRUD capabilities.
- **Order Fulfillment**: State management for the complete order lifecycle (Pending → Shipped → Delivered).
- **Review Moderation**: Centralized hub for monitoring and managing user-generated content and product reviews.

---

## 📊 Database Schema (ER Model)

The robust backend is defined using **Prisma ORM**, ensuring referential integrity across 13 tables.

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │     Product     │       │      Order      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │   ┌───│ id (PK)         │
│ email (UNIQUE)  │   │   │ name            │   │   │ userId (FK)     │
│ password        │   │   │ category        │   │   │ shippingDetails │
│ role (ENUM)     │   │   │ price           │   │   │ total           │
└─────────────────┘   │   │ stock           │   │   │ status (ENUM)   │
          │           │   │ imageUrls[]     │   │   └─────────────────┘
          ▼           │   │ attributes[]    │   │            │
┌─────────────────┐   │   └─────────────────┘   │            ▼
│ CustomerProfile │   │            │            │   ┌─────────────────┐
├─────────────────┤   │            │            └──►│    OrderItem    │
│ id (PK)         │   │            ▼                ├─────────────────┤
│ userId (FK)     │   │   ┌─────────────────┐       │ id (PK)         │
│ skinType        │   └──►│    CartItem     │       │ orderId (FK)    │
│ concerns[]      │       ├─────────────────┤       │ productId (FK)  │
└─────────────────┘       │ userId (FK)     │       │ quantity        │
                          │ productId (FK)  │       └─────────────────┘
                          └─────────────────┘
```
*(Other tables include: Categories, Reports, Stocks, Reviews, WishlistItems, AIMemory, Notifications)*

---

## 🔒 Security & Authentication

- **Multi-Factor OTP**: Implemented a highly secure registration flow. Nodemailer generates a cryptographically random 6-digit OTP sent via branded email.
- **JWT Verification**: The OTP is encapsulated within a JSON Web Token (JWT) with a strict 5-minute expiration window to prevent brute-force attacks.
- **Role-Based Access Control (RBAC)**: Custom React Higher-Order Components (`<AdminRoute>`) intercept routing attempts, verifying server-side session roles before granting dashboard access.
- **Google OAuth**: Integrated `@react-oauth/google` for seamless, secure third-party identity verification.

---

## 📸 Application Interfaces (Screenshots)

> **Note to Judges:** Since the Admin Dashboard is protected by strict authentication, screenshots of the internal management tools are provided below.

### Customer Experience
| Feature | Interface |
|---------|------------|
| **Homepage & Hero** | <img src="./public/docx/SkinGlow%20Homepage%20Hero.png" width="800"> |
| **Products Catalog** | <img src="./public/docx/SkinGlow%20Products.png" width="800"> |
| **Face Scan Analysis** | <img src="./public/docx/AI%20Skin%20Scan.png" width="800"> |
| **AI Esthetician Chat** | <img src="./public/docx/Customer%20Support%20Ai%20Chatbot.png" width="800"> |
| **Shop By Concern** | <img src="./public/docx/Shop%20By%20Concern.png" width="800"> |
| **Shop By Ritual** | <img src="./public/docx/Shop%20by%20Ritual.png" width="800"> |

### Administrator Portal
| Feature | Interface |
|---------|------------|
| **Admin AI Analyst** | <img src="./public/docx/Admin%20Ai%20Chat.png" width="800"> |
| **Admin Reports & Dashboard** | <img src="./public/docx/Admin%20Report.png" width="800"> |
| **Product Management** | <img src="./public/docx/Admin%20Product%20add.png" width="800"> |
| **Category Management** | <img src="./public/docx/Admin%20Category.png" width="800"> |

### 🎥 AI Chat Demonstration

Watch our Conversational Commerce Agent in action (Please view on GitHub to play video):

<video src="https://github.com/maryamtahir7/skinglow-finalproject/raw/main/public/docx/Add%20Video%20in%20Readme.mp4" controls="controls" muted="muted" style="max-width: 100%;"></video>

---

## ⚙️ Installation & Local Deployment

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+
- **PostgreSQL** Database 

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/maryamtahir7/skinglow-finalproject.git
   cd skinglow-finalproject
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory (Refer to `.env.example`).

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   *Frontend running on port 5173. API running concurrently on port 8085.*

---

## ☁️ Cloud Deployment Strategy

The application is architected for Edge-ready cloud deployment.

- **Hosting Platform**: Vercel (Auto-detects Vite and provisions Serverless Node.js functions for the `/api` directory).
- **Database**: Neon Tech (Serverless PostgreSQL providing connection pooling for high-concurrency API requests).
- **LLM Inference**: Groq Cloud (Utilizing their LPU architecture for sub-second token generation).

---

## 🔮 Conclusion & Future Scope

**SkinGlow** successfully demonstrates the integration of complex Artificial Intelligence into a modern web ecosystem, solving tangible problems in consumer e-commerce. 

**Future Enhancements:**
1. **Dermatological API Integration**: Upgrading the heuristic Computer Vision model to a medical-grade API (like Google Cloud Vision) for precise acne grading.
2. **Augmented Reality (AR)**: Implementing WebGL-based face mapping to show the visual effects of products on the user's skin over time.
3. **Automated Supply Chain**: Deepening the n8n webhook integration to automatically re-order inventory from suppliers when stock dips below critical thresholds.

---

<p align="center">
  <strong>Developed with engineering precision and a passion for technology.</strong><br>
  By Maryam Tahir — Final Year Project
</p>
