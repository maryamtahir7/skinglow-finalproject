// db-proxy client for Auth

async function dbCall(action, payload = {}) {
  const res = await fetch('/api/db-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Auth Error [${action}]:`, errorText);
    throw new Error(JSON.parse(errorText).error || 'Auth failed');
  }
  return res.json();
}

// --------------------- SIGNUP ---------------------
export async function signup(email, password, name) {
  const data = await dbCall('signup', { email, password, name });
  localStorage.setItem('user', JSON.stringify({ ...data, $id: data.id }));
  return { success: true, email, userId: data.id };
}

// --------------------- LOGIN WITH EMAIL/PASSWORD ---------------------
export async function login(email, password) {
  const data = await dbCall('login', { email, password });
  const user = { ...data, $id: data.id };
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

// --------------------- LOGIN WITH GOOGLE OAUTH ---------------------
export async function processGoogleUser(userInfo) {
  try {
    // Try to login if user already exists
    const data = await dbCall('login', { email: userInfo.email, password: 'GOOGLE_AUTH_PLACEHOLDER' });
    const user = { ...data, $id: data.id };
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/';
  } catch (error) {
    try {
      // If not exists, signup
      const data = await dbCall('signup', { email: userInfo.email, password: 'GOOGLE_AUTH_PLACEHOLDER', name: userInfo.name });
      const user = { ...data, $id: data.id };
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } catch (e) {
      console.error(e);
      throw new Error("Failed to authenticate with Google");
    }
  }
}

// --------------------- OTP FUNCTIONS ---------------------
export async function sendOtp(userId, email) {
  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Send OTP Error:', errorText);
      throw new Error(JSON.parse(errorText).message || 'Failed to send OTP');
    }
    const data = await res.json();
    return { success: true, token: data.token };
  } catch (error) {
    console.error('Send OTP Error:', error);
    throw error;
  }
}

export async function verifyOtp(userId, otp, token) {
  try {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, token })
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Verify OTP Error:', errorText);
      throw new Error(JSON.parse(errorText).message || 'Failed to verify OTP');
    }
    const data = await res.json();
    return { success: true, email: data.email };
  } catch (error) {
    console.error('Verify OTP Error:', error);
    throw error;
  }
}

// --------------------- LOGOUT ---------------------
export async function logout() {
  localStorage.removeItem('user');
  return { success: true };
}

// --------------------- GET CURRENT USER ---------------------
export async function getCurrentUser() {
  const u = localStorage.getItem('user');
  if (u) {
     const parsed = JSON.parse(u);
     return { ...parsed, $id: parsed.id };
  }
  return null;
}

// --------------------- UPDATE PREFS ---------------------
export async function updateUserPrefs(prefs) {
  const u = localStorage.getItem('user');
  if (u) {
     const parsed = JSON.parse(u);
     const updated = { ...parsed, prefs: { ...parsed.prefs, ...prefs } };
     localStorage.setItem('user', JSON.stringify(updated));
     return updated;
  }
  return null;
}

// --------------------- PASSWORD RECOVERY (Mock) ---------------------
export async function sendPasswordReset(email) {
  console.log("Password reset requested for", email);
  return { success: true };
}

export async function confirmPasswordReset(userId, secret, password, passwordAgain) {
  console.log("Password reset confirmed");
  return { success: true };
}
