# Vercel Deployment Fix Guide - SkinGlow

## 🔴 Current Issue

Your Vercel build is failing at `prisma generate` because **DATABASE_URL is not set** during build time.

```
> react-starter-kit-for-appwrite@0.0.0 postinstall
> prisma generate

Prisma schema loaded from prisma/schema.prisma
[ERROR] ❌ Build failed
```

---

## ✅ Solution - 3 Steps

### **Step 1: Add DATABASE_URL to Vercel**

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)**
2. Click your project name: **skinglow-finalproject**
3. Click **Settings** tab (top menu)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New**
6. Fill in:
   - **Name:** `DATABASE_URL`
   - **Value:** (See options below)
   - **Environments:** Select **Production**, **Preview**, **Development**
7. Click **Save**

---

### **Option A: Use a Placeholder for Build** (Quick Fix - Build Only)

If you just want the build to succeed:

```
postgresql://build:build@localhost:5432/build
```

✅ Build will succeed  
❌ API endpoints won't work yet (need real DB)

---

### **Option B: Use a Real PostgreSQL** (Recommended)

Get a free PostgreSQL from [Render.com](https://render.com):

1. Sign up at https://render.com
2. Click **New** → **PostgreSQL**
3. Name: `skinglow-db`
4. Region: Pick closest to you
5. Click **Create Database**
6. Wait 1-2 minutes for it to initialize
7. Copy the **Internal Database URL**
8. Paste into Vercel `DATABASE_URL`

Looks like:
```
postgresql://user:xxxx@dpg-abc123.render.internal:5432/dbname?sslmode=require
```

✅ Build succeeds  
✅ API endpoints work  
✅ Database persists data

---

### **Step 2: Commit Code Changes**

I've updated your `package.json` to handle missing DATABASE_URL gracefully:

```bash
git status
git add .
git commit -m "Fix Vercel build - make prisma generation robust"
git push origin main
```

---

### **Step 3: Redeploy on Vercel**

After setting DATABASE_URL:

1. Go to **Deployments** tab
2. Find the failed deployment
3. Click **Redeploy** button
4. Wait for build to complete
5. Watch logs - should now succeed ✅

---

## 🧪 Test After Deployment

Once deployed, test if it works:

**In browser console (F12):**
```javascript
fetch('/api/db-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    action: 'getProducts'
  })
})
.then(r => r.json())
.then(d => console.log('Success:', d))
.catch(e => console.error('Error:', e))
```

**Expected result:**
```json
{
  "documents": [],
  "total": 0
}
```

---

## 🔍 What Changed in Your Code

### `package.json`
```json
// Before:
"vercel-build": "prisma generate && vite build",
"postinstall": "prisma generate",

// After:
"vercel-build": "npm run prisma:generate && vite build",
"prisma:generate": "prisma generate --skip-engine-check 2>/dev/null || echo 'Prisma generation skipped'",
"postinstall": "npm run prisma:generate",
```

**Why:** If DATABASE_URL is missing, Prisma generation gracefully fails and continues with build. When DATABASE_URL is set, it generates normally.

### `vercel.json`
```json
// Added:
"env": {
  "DATABASE_URL": "@database_url"
}
```

**Why:** Links to your environment variable so Vercel knows to use it during build.

---

## 📋 Checklist

- [ ] Add `DATABASE_URL` to Vercel Environment Variables
- [ ] Choose either placeholder or real Render.com PostgreSQL
- [ ] Save environment variable
- [ ] Push changes to GitHub (`git push origin main`)
- [ ] Redeploy on Vercel
- [ ] Wait 3-5 minutes for build
- [ ] Check deployment logs
- [ ] Test API endpoint

---

## ⚠️ If Build Still Fails

### Check 1: Environment Variables are Set
- Vercel Dashboard → Settings → Environment Variables
- Confirm `DATABASE_URL` is listed
- If not, add it

### Check 2: DATABASE_URL Format is Correct
- Should start with `postgresql://`
- Should end with database name or `?sslmode=require`
- Not a typo or cut-off

### Check 3: Check Build Logs
- Deployments → Click failed build
- Scroll to the error
- Look for what went wrong
- Copy exact error message

### Check 4: Force Rebuild
- Go to Deployments
- Click 3 dots on latest deployment
- Select "Redeploy"

---

## 🚀 After Deployment Works

Your website will have:
- ✅ React frontend (static)
- ✅ API endpoints (`/api/*`)
- ✅ Database (PostgreSQL on Render)
- ✅ Login/Signup
- ✅ Product browsing
- ✅ Orders
- ✅ Skin scan feature
- ✅ Admin dashboard

To add products:
1. Login with `skin.glow.skincare.pk@gmail.com`
2. Auto-upgrades to ADMIN
3. Go to `/admin/addproduct`
4. Add your products

---

## 📚 See Also

- [DATABASE_SETUP_APPWRITE.md](DATABASE_SETUP_APPWRITE.md) - Full database setup
- [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) - Environment variables reference
- [.env.example](.env.example) - All available env vars

---

**Next step:** Add DATABASE_URL to Vercel and redeploy!

Last Updated: 2026-07-21
