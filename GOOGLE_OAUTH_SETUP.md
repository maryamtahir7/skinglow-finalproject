# Google OAuth Setup Guide for Appwrite

## The Error You're Seeing

**Error 400: redirect_uri_mismatch** means the redirect URI in your Google OAuth app doesn't match what Appwrite is sending.

## Solution: Configure Google Console Correctly

### Step 1: Get Your Appwrite Endpoint

Check your `VITE_APPWRITE_ENDPOINT` environment variable:
- **Cloud Appwrite**: `https://cloud.appwrite.io/v1`
- **Self-hosted**: Your custom Appwrite endpoint

### Step 2: Configure Google OAuth Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure:

#### Authorized JavaScript origins:
```
https://cloud.appwrite.io
```
(Or your self-hosted Appwrite domain)

#### Authorized redirect URIs:
```
https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google
```
(Or your self-hosted endpoint: `your-appwrite-endpoint/v1/account/sessions/oauth2/callback/google`)

**Important:** 
- Use `https://cloud.appwrite.io` (or your Appwrite endpoint) - NOT your app's URL
- The redirect URI must end with `/v1/account/sessions/oauth2/callback/google`
- Do NOT use `localhost` or your Vercel domain here

### Step 3: Configure Appwrite Console

1. Go to your [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Go to **Auth** → **Settings** → **Providers**
4. Enable **Google** provider
5. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
6. Click **Update**

### Step 4: Test

1. Go to your app's login page
2. Click "Continue with Google"
3. You should be redirected to Google for authentication
4. After authorizing, you'll be redirected back to your app

## Common Issues

### Issue: Still getting redirect_uri_mismatch

**Solution:** 
- Double-check the redirect URI in Google Console matches exactly: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
- Make sure there are no trailing slashes or typos
- Wait a few minutes after saving - Google sometimes takes time to propagate changes

### Issue: OAuth works locally but not in production

**Solution:**
- The redirect URI is the same for both (Appwrite's callback URL)
- Make sure your Appwrite project allows your production domain in CORS settings
- Check that environment variables are set correctly in Vercel

### Issue: User is redirected but not logged in

**Solution:**
- Check browser console for errors
- Verify Appwrite session is being created
- Make sure the homepage is refreshing user context (already implemented)

## Notes

- The `successRedirect` and `failureRedirect` in the code are where Appwrite sends users AFTER processing OAuth
- These should be your app's URLs (localhost:5173 or your Vercel domain)
- The redirect URI in Google Console is where Google sends users BACK - this must be Appwrite's callback URL

## Quick Checklist

- [ ] Google OAuth app created in Google Cloud Console
- [ ] Authorized redirect URI set to: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
- [ ] Client ID and Secret copied from Google Console
- [ ] Google provider enabled in Appwrite Console
- [ ] Client ID and Secret entered in Appwrite Console
- [ ] Tested the OAuth flow


