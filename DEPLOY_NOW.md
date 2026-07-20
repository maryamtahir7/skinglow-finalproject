# Quick Deploy to Vercel - CLI Method

## Install Vercel CLI
```bash
npm i -g vercel
```

## Login to Vercel
```bash
vercel login
```

## Deploy (First Time)
```bash
vercel
```
Follow the prompts:
- Link to existing project? **No** (first time)
- Project name: **skinglow** (or your preferred name)
- Directory: **./** (current directory)
- Override settings? **No**

## Deploy to Production
```bash
vercel --prod
```

## Set Environment Variables via CLI
```bash
# Add each variable one by one
vercel env add VITE_APPWRITE_ENDPOINT
vercel env add VITE_APPWRITE_PROJECT_ID
# ... (repeat for all variables)
```

Or add them via Dashboard: **Settings → Environment Variables**




