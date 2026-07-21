# SkinGlow - Appwrite Database Setup Guide

## 🔴 Current Issue

Your app uses **PostgreSQL + Prisma**, not Appwrite's native database. For your app to work on Appwrite, you need to:

**Option A:** Set up a PostgreSQL database (RECOMMENDED - your code is already configured for this)  
**Option B:** Migrate to Appwrite's native Database (requires code changes)

---

## ✅ OPTION A: Use PostgreSQL with Appwrite (RECOMMENDED)

### Step 1: Create a PostgreSQL Database

Choose one of these services:

#### **🆓 Free Option - Render.com**
1. Go to [https://render.com](https://render.com)
2. Sign up and create new PostgreSQL instance
3. Copy the **Internal Database URL** (ends with `?sslmode=require`)
4. This looks like: `postgresql://user:pass@dpg-xxxxx.render.internal:5432/dbname?sslmode=require`

#### **💰 Paid Option - Railway.app**
1. Go to [https://railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy the **Database URL** from Variables tab
4. This looks like: `postgresql://user:pass@containers-us-west-123.railway.app:5432/railway`

#### **🏗️ Your Own Server (Advanced)**
- Set up PostgreSQL on your own server
- Use connection string: `postgresql://user:password@host:5432/dbname`

### Step 2: Add Database URL to Appwrite

1. Go to **Appwrite Console**
2. Go to your project
3. **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `DATABASE_URL`
   - **Value:** (Paste your PostgreSQL connection URL)

Example:
```
postgresql://user:password@dpg-xxxx.render.internal:5432/skinglow?sslmode=require
```

### Step 3: Redeploy on Appwrite
1. Go to **Deployments**
2. Click **Redeploy** on latest build
3. Wait for deployment to complete
4. Check logs for any errors

### Step 4: Initialize Database Schema

After deployment succeeds, run migrations:

**Option A: Run via Appwrite CLI (if available)**
```bash
appwrite run "npm run postinstall"
```

**Option B: Connect directly and run Prisma**
```bash
# From your local machine
npx prisma migrate deploy --skip-generate
```

---

## 📋 Step-by-Step for Render.com (Easiest)

### 1. Create Account
- Go to [render.com](https://render.com)
- Sign up with GitHub (easier)

### 2. Create PostgreSQL
- Click **New** → **PostgreSQL**
- Name: `skinglow-db`
- Region: Choose closest to your users
- PostgreSQL Version: 15 (or latest)
- Click **Create Database**

### 3. Get Connection String
- Wait for database to initialize (1-2 minutes)
- Copy the **Internal Database URL** (NOT External)
- Should look like: `postgresql://user:...@dpg-xxx.render.internal:5432/dbname?sslmode=require`

### 4. Add to Appwrite
- Appwrite Console → Settings → Environment Variables
- Add `DATABASE_URL` = (paste the URL)

### 5. Redeploy & Test
- Deployments → Redeploy
- Check if tables are created

---

## 🧪 Test Database Connection

After setting DATABASE_URL, test if it works:

### From Browser Console:
```javascript
fetch('/api/db-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    action: 'getProducts',
    payload: {}
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Success:** Should return `{ documents: [], total: 0 }` (or with products if you have any)  
**Error:** Check Appwrite logs for DATABASE_URL issues

---

## 🐳 OPTION B: Use Appwrite's Native Database

If you want to use Appwrite's built-in database instead, you would need to:

1. Install Appwrite SDK
2. Replace Prisma calls with Appwrite SDK calls
3. Create Collections instead of models
4. Update all API endpoints

⚠️ **This requires significant code refactoring. Option A is easier!**

---

## ⚠️ Common Issues & Fixes

### Issue: "DATABASE_URL not found"
**Fix:**
- Verify you added DATABASE_URL in Appwrite Settings → Environment Variables
- Redeploy after adding
- Wait 5-10 minutes for env vars to propagate

### Issue: "Connection refused"
**Fix:**
- Check your DATABASE_URL is correct
- Make sure database service is running
- If using Render.com, ensure it's "Available" status
- Try the connection string in a database client first

### Issue: "ENOTFOUND" or DNS error
**Fix:**
- Use **Internal** connection string (not External) for Render
- For Railway, use the provided connection string as-is

### Issue: "SSL Certificate Error"
**Fix:**
- Add `?sslmode=require` to your PostgreSQL URL
- Already included in Render URLs

### Issue: "Unknown database"
**Fix:**
- The database might not exist yet
- Prisma creates it automatically on first migration
- Or manually create it in your database client

---

## 📊 Verify Tables Were Created

After DATABASE_URL is set and deployed:

1. Connect to your PostgreSQL database using a client (DBeaver, pgAdmin, etc)
2. Look for these tables:
   - `User`
   - `Product`
   - `Order`
   - `CustomerProfile`
   - And others from schema.prisma

If no tables exist:
1. Download the latest code locally
2. Set DATABASE_URL locally
3. Run: `npx prisma db push`
4. This creates all tables

---

## 🎯 Quick Checklist

- [ ] Choose PostgreSQL provider (Render.com recommended)
- [ ] Create PostgreSQL database
- [ ] Copy connection URL
- [ ] Add `DATABASE_URL` to Appwrite env vars
- [ ] Redeploy on Appwrite
- [ ] Wait 5-10 minutes for propagation
- [ ] Test `/api/db-proxy` endpoint
- [ ] Verify tables exist in database

---

## 📚 Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database][?sslmode=require]
```

Example breakdown:
- **user:** `postgres`
- **password:** `abc123xyz`
- **host:** `dpg-abc123.render.internal`
- **port:** `5432` (default)
- **database:** `skinglow_db`
- **sslmode:** `require` (for security)

Full: `postgresql://postgres:abc123xyz@dpg-abc123.render.internal:5432/skinglow_db?sslmode=require`

---

## 🚀 After Setup Works

Once database is connected and tables exist:

1. ✅ Sign up works
2. ✅ Login works
3. ✅ Products show (need to add them first)
4. ✅ Orders work
5. ✅ Skin scan works

To add products, use the Admin Panel:
- Login with: `skin.glow.skincare.pk@gmail.com` (will auto-upgrade to ADMIN)
- Go to `/admin/addproduct`
- Add your products

---

**Questions?** Check:
1. Appwrite deployment logs
2. Browser console (F12)
3. Database client to verify connection

Last Updated: 2026-07-21
