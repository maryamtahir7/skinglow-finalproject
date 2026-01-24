# Google OAuth Debugging Guide

## Quick Fix Steps

### Step 1: Check Your Appwrite Endpoint

Open your browser console when clicking "Continue with Google" and look for:
```
🔍 Google OAuth Debug Info:
Appwrite Endpoint: https://cloud.appwrite.io/v1
Expected Callback URL in Google Console: https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google
```

**Copy the "Expected Callback URL"** - this is what you need to add to Google Console.

### Step 2: Add to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Paste the **exact** callback URL from the console (e.g., `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`)
7. Click **SAVE**

### Step 3: Verify in Appwrite Console

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Go to **Auth** → **Settings** → **Providers**
4. Click on **Google**
5. Make sure:
   - Provider is **Enabled**
   - **Client ID** is correct (from Google Cloud Console)
   - **Client Secret** is correct (from Google Cloud Console)
6. Click **Update**

### Step 4: Common Issues

#### Issue: Still getting redirect_uri_mismatch

**Check:**
- [ ] The callback URL in Google Console matches EXACTLY (no trailing slash, correct protocol)
- [ ] You're using the URL from the browser console debug output
- [ ] You saved the changes in Google Console
- [ ] You waited 2-3 minutes for Google to propagate changes

#### Issue: Different endpoint for localhost vs production

**Solution:**
- For **localhost**: The callback URL is still `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google` (Appwrite's cloud endpoint)
- For **production**: Same callback URL - `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google`
- The `successRedirect` and `failureRedirect` in code are your app URLs, but the Google Console redirect URI is always Appwrite's callback URL

#### Issue: Using self-hosted Appwrite

**Solution:**
- If you're using self-hosted Appwrite, replace `cloud.appwrite.io` with your Appwrite domain
- Example: `https://appwrite.yourdomain.com/v1/account/sessions/oauth2/callback/google`
- Check your `VITE_APPWRITE_ENDPOINT` environment variable to see your endpoint

### Step 5: Test Again

1. Clear browser cache or use incognito mode
2. Go to your login page
3. Click "Continue with Google"
4. Check browser console for the debug output
5. Verify the callback URL matches what's in Google Console

## Still Not Working?

1. **Check browser console** - Look for the debug output showing the expected callback URL
2. **Verify Google Console** - Make sure the redirect URI is added and saved
3. **Check Appwrite Console** - Verify Google provider is enabled with correct credentials
4. **Wait a few minutes** - Google sometimes takes time to propagate OAuth changes
5. **Try incognito mode** - Rule out browser cache issues

## Need Help?

Share:
- The callback URL from browser console debug output
- Screenshot of Google Console redirect URIs
- Your Appwrite endpoint (from environment variable)



