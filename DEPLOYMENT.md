# Deployment Guide for Vercel

## Prerequisites
1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your project pushed to GitHub, GitLab, or Bitbucket
3. All environment variables ready

## Step 1: Push to Git Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect Vite settings
5. Configure environment variables (see Step 3)
6. Click **"Deploy"**

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Environment Variables

Add these environment variables in your Vercel project settings:

### Appwrite Configuration
- `VITE_APPWRITE_ENDPOINT` - Your Appwrite endpoint (e.g., `https://cloud.appwrite.io/v1`)
- `VITE_APPWRITE_PROJECT_ID` - Your Appwrite project ID
- `VITE_APPWRITE_DATABASE_ID` - Your Appwrite database ID
- `VITE_APPWRITE_TABLE_ID` - Your products collection ID
- `VITE_APPWRITE_CATEGORIES_ID` - Your categories collection ID
- `VITE_APPWRITE_CART_ID` - Your cart collection ID
- `VITE_APPWRITE_WISHLIST_ID` - Your wishlist collection ID
- `VITE_APPWRITE_ORDERS_ID` - Your orders collection ID
- `VITE_APPWRITE_STOCK_ID` - Your stock collection ID
- `VITE_APPWRITE_REPORTS_ID` - Your reports collection ID
- `VITE_APPWRITE_LAB_ID` - Your lab tests collection ID
- `VITE_APPWRITE_PRESCRIPTION_ID` - Your prescriptions collection ID
- `VITE_APPWRITE_REVIEWS_ID` - Your reviews collection ID
- `VITE_APPWRITE_STORAGE_ID` - Your storage bucket ID (if using file uploads)

### API Configuration (for OTP functions)
- `GMAIL_USER` - Your Gmail address for sending OTP emails
- `GMAIL_PASS` - Your Gmail app password
- `JWT_SECRET` - A secret key for JWT token generation (use a strong random string)

### How to Add Environment Variables in Vercel:
1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select the environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your project for changes to take effect

## Step 4: Verify Deployment

After deployment:
1. Check the deployment URL provided by Vercel
2. Test all features:
   - Product listing
   - User authentication
   - Cart functionality
   - API endpoints

## Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### Environment Variables Not Working
- Make sure variables start with `VITE_` for client-side access
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

### API Routes Not Working
- Verify API functions are in the `api/` folder
- Check function exports are correct
- Review serverless function logs in Vercel dashboard

### Images Not Loading
- Ensure image URLs are absolute (not relative)
- Check CORS settings in Appwrite
- Verify storage bucket permissions

## Notes

- Vercel automatically builds and deploys on every push to main branch
- Preview deployments are created for pull requests
- The `vercel.json` file configures routing and build settings
- API routes in `api/` folder are automatically deployed as serverless functions

