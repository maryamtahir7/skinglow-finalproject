import { account } from "./appwrite";

// --------------------- SIGNUP ---------------------
export async function signup(email, password, name) {
  // Check if user is already logged in and logout first
  try {
    await account.get();
    // If we get here, user is logged in - delete current session
    await account.deleteSession("current");
  } catch {
    // No active session, continue
  }

  // Create user account (without creating a session)
  await account.create("unique()", email, password, name);

  // Return success - don't create session, user will login separately
  return { success: true, email };
}

// --------------------- LOGIN WITH EMAIL/PASSWORD ---------------------
export async function login(email, password) {
  await account.createEmailPasswordSession(email, password);
  return await account.get();
}

// --------------------- LOGIN WITH GOOGLE OAUTH ---------------------
export async function loginWithGoogle() {
  try {
    // Get current origin (localhost:5173 or your production domain)
    const origin = window.location.origin;

    // Success redirect - Appwrite will redirect here after successful OAuth
    // This is where the user lands after Google authentication
    const successRedirect = `${origin}/`;
    
    // Failure redirect - go back to login page if OAuth fails
    const failureRedirect = `${origin}/login`;

    // Get Appwrite endpoint to show in console for debugging
    const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const expectedCallbackUrl = `${appwriteEndpoint.replace('/v1', '')}/v1/account/sessions/oauth2/callback/google`;
    
    console.log('🔍 Google OAuth Debug Info:');
    console.log('Appwrite Endpoint:', appwriteEndpoint);
    console.log('Expected Callback URL in Google Console:', expectedCallbackUrl);
    console.log('Success Redirect:', successRedirect);
    console.log('Failure Redirect:', failureRedirect);
    console.log('⚠️ Make sure this callback URL is added to Google Cloud Console:');
    console.log('   ', expectedCallbackUrl);

    // Appwrite will handle the OAuth flow
    // The redirect URI configured in Google Console should be Appwrite's callback URL
    await account.createOAuth2Session("google", successRedirect, failureRedirect);
  } catch (error) {
    console.error('❌ Google OAuth Error:', error);
    throw error;
  }
}

// --------------------- LOGOUT ---------------------
export async function logout() {
  return await account.deleteSession("current");
}

// --------------------- GET CURRENT USER ---------------------
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}
