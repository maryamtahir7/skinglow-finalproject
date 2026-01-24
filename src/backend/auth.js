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
  const user = await account.create("unique()", email, password, name);

  // Return success - don't create session, user will login separately
  // Returning user ID is crucial for OTP generation
  return { success: true, email, userId: user.$id };
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

// --------------------- OTP FUNCTIONS ---------------------

// Generate OTP (Email Token)
export async function sendOtp(userId, email) {
  try {
    // createEmailToken sends an email with a code/link
    // userId: The user ID to create the token for
    // email: The email to send it to (must match user's email)
    // true: Set 'phrase' to true to get a generic "login" style email, 
    // or we might depend on Appwrite's templates. 
    // For manual entry, we need the secret.
    return await account.createEmailToken(userId, email);
  } catch (error) {
    console.error("STUPID createEmailToken Error:", error);
    throw error;
  }
}

// Verify OTP
export async function verifyOtp(userId, secret) {
  try {
    // createSession completes the login using the userId and secret code
    return await account.createSession(userId, secret);
  } catch (error) {
    console.error("Verify OTP Error:", error);
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

// --------------------- UPDATE PREFS ---------------------
export async function updateUserPrefs(prefs) {
  try {
    return await account.updatePrefs(prefs);
  } catch (error) {
    console.error("Update Prefs Error:", error);
    throw error;
  }
}
