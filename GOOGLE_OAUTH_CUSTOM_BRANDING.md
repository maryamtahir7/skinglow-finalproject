# Change Google OAuth Screen to Show "SkinGlow"

## The Issue

When users click "Continue with Google", they see:
- "to continue to **appwrite.io**"

You want it to show:
- "to continue to **SkinGlow**" (or your app name)

## Solution: Configure OAuth Consent Screen

### Step 1: Go to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **OAuth consent screen**

### Step 2: Configure App Information

1. **User Type**: Choose:
   - **External** (if you want anyone to sign in)
   - **Internal** (if only users in your Google Workspace can sign in)

2. **App information**:
   - **App name**: Enter `SkinGlow` (or your preferred name)
   - **User support email**: Your email address
   - **App logo** (optional): Upload your SkinGlow logo
   - **App domain** (optional): Your website domain
   - **Application home page**: Your website URL (e.g., `https://skinglow.vercel.app`)
   - **Privacy policy link**: Your privacy policy URL
   - **Terms of service link**: Your terms of service URL

3. **Authorized domains** (if needed):
   - Add your domain (e.g., `vercel.app` or your custom domain)

4. **Developer contact information**:
   - Enter your email address

### Step 3: Configure Scopes

1. Click **Add or Remove Scopes**
2. Add these scopes (if not already added):
   - `email`
   - `profile`
   - `openid`
3. Click **Update**

### Step 4: Add Test Users (if App is in Testing)

If your app is in "Testing" mode:
1. Go to **Test users**
2. Click **+ ADD USERS**
3. Add email addresses of users who can test the OAuth flow
4. Click **ADD**

### Step 5: Submit for Verification (if needed)

- If your app is **External** and uses sensitive scopes, you may need to submit for verification
- For basic email/profile scopes, you can usually skip this

### Step 6: Save and Test

1. Click **SAVE AND CONTINUE** through all steps
2. Go back to your app
3. Click "Continue with Google"
4. You should now see "to continue to **SkinGlow**" instead of "appwrite.io"

## Important Notes

- **App Name**: This is what Google will show to users
- **Testing Mode**: If your app is in testing, only test users can sign in
- **Verification**: For production use with many users, you may need Google's verification
- **Changes**: Changes to the consent screen may take a few minutes to propagate

## Quick Checklist

- [ ] OAuth consent screen configured
- [ ] App name set to "SkinGlow"
- [ ] Support email added
- [ ] Scopes configured (email, profile, openid)
- [ ] Test users added (if in testing mode)
- [ ] Saved all changes
- [ ] Tested the OAuth flow

## Still Shows "appwrite.io"?

If it still shows "appwrite.io" after configuration:

1. **Wait 5-10 minutes** - Google needs time to update
2. **Clear browser cache** or use incognito mode
3. **Check the OAuth consent screen** - Make sure "App name" is saved correctly
4. **Verify you're using the correct Google Cloud project** - The one with your OAuth credentials

## Alternative: Publish Your App

If you want to make it available to all users (not just test users):

1. In OAuth consent screen, go to **Publishing status**
2. Click **PUBLISH APP**
3. Confirm the publishing

Note: Publishing may require verification if you use sensitive scopes.


