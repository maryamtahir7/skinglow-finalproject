# Vercel Environment Variables Configuration

# For Vercel deployment to work, add these environment variables:
# 
# Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
#
# Add each of these:

## Required for Build (can be dummy values during build):
DATABASE_URL=postgresql://build:build@localhost:5432/build

## Required for Runtime (MUST be set):
# DATABASE_URL=postgresql://user:password@your-db-host:5432/your-db

## Email Configuration:
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_specific_password

## Authentication:
JWT_SECRET=your_secure_random_jwt_secret_here

## Frontend API URL:
VITE_API_URL=https://your-vercel-domain.vercel.app

## AI & APIs (Optional):
GOOGLE_GENAI_API_KEY=your_google_key
STRIPE_SECRET_KEY=your_stripe_key

## Environment:
NODE_ENV=production

---
IMPORTANT NOTES:

1. DATABASE_URL at build time can be a dummy value (won't be used for building static files)
2. At runtime, Vercel will use the actual DATABASE_URL from env vars
3. For the app to work after deployment, you MUST set a real DATABASE_URL
4. See DATABASE_SETUP_APPWRITE.md for getting a PostgreSQL URL

---
HOW TO SET IN VERCEL:

1. Go to https://vercel.com/dashboard
2. Click your project name
3. Click "Settings" tab
4. Click "Environment Variables" on left
5. Add each variable from above
6. Click "Save"
7. Redeploy your project

---
WHICH VARIABLES ARE REQUIRED?

Minimum to work:
- DATABASE_URL (real one, not dummy)
- VITE_API_URL

Nice to have:
- GMAIL_USER / GMAIL_PASS (for contact form)
- JWT_SECRET (for security)
- API keys for AI features
