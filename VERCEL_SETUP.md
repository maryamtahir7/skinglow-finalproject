# Quick Vercel Deployment Guide

## 🚀 Quick Start

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your repository**

5. **Configure the project:**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)
   - Install Command: `npm install` (auto-filled)

6. **Add Environment Variables** (see below)

7. **Click "Deploy"**

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# Deploy to production
vercel --prod
```

## 📋 Required Environment Variables

Add these in **Vercel Dashboard → Settings → Environment Variables**:

### Appwrite (Required)
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_TABLE_ID=your_products_collection_id
VITE_APPWRITE_CATEGORIES_ID=your_categories_collection_id
VITE_APPWRITE_CART_ID=your_cart_collection_id
VITE_APPWRITE_WISHLIST_ID=your_wishlist_collection_id
VITE_APPWRITE_ORDERS_ID=your_orders_collection_id
VITE_APPWRITE_STOCK_ID=your_stock_collection_id
VITE_APPWRITE_REPORTS_ID=your_reports_collection_id
VITE_APPWRITE_LAB_ID=your_lab_collection_id
VITE_APPWRITE_PRESCRIPTION_ID=your_prescription_collection_id
VITE_APPWRITE_REVIEWS_ID=your_reviews_collection_id
VITE_APPWRITE_STORAGE_ID=your_storage_bucket_id
```

### API Functions (Required for OTP)
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
JWT_SECRET=your-secret-key-here
```

**Important:** 
- All client-side variables must start with `VITE_`
- Redeploy after adding environment variables
- Use the same values as your local `.env` file

## ✅ Post-Deployment Checklist

- [ ] Test homepage loads
- [ ] Test product listing page
- [ ] Test product detail page
- [ ] Test user signup/login
- [ ] Test cart functionality
- [ ] Test API endpoints (`/api/send-otp`, `/api/verify-otp`)
- [ ] Check browser console for errors
- [ ] Verify images load correctly

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+)

### Environment Variables Not Working
- Variables must start with `VITE_` for client-side
- Redeploy after adding variables
- Check variable names are exact (case-sensitive)

### API Routes Return 404
- Verify API files are in `/api` folder
- Check function exports are correct
- Review serverless function logs

### Images Not Loading
- Use absolute URLs (not relative paths)
- Check Appwrite storage bucket permissions
- Verify CORS settings in Appwrite

## 📝 Notes

- Vercel auto-deploys on every push to `main` branch
- Preview deployments created for pull requests
- Custom domains can be added in Settings → Domains
- SSL certificates are automatically provisioned

## 🎉 You're Done!

Your site will be live at: `https://your-project.vercel.app`

For detailed information, see `DEPLOYMENT.md`



