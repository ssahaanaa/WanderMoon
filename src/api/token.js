// Saves the login token in the browser so it survives a page refresh.
// SECURITY: we use sessionStorage (not localStorage). The token is erased when the
// tab is closed, so it does not stay on a shared computer.
const TOKEN_KEY = "WanderMoon.token";
const USER_KEY = "WanderMoon.currentUser";

// Keep the token and the user after a successful login
export function saveSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  // only keep what the header needs (never the password or phone)
  sessionStorage.setItem(USER_KEY, JSON.stringify({ name: user?.name, email: user?.email }));
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getSavedUser() {
  try {
    const text = sessionStorage.getItem(USER_KEY);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// Remove the token and the user (logout or expired token)
export function removeSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
