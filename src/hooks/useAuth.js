import { useEffect, useState } from "react";
import { signUpRequest, loginRequest, logoutRequest, getMe } from "../api/authApi.js";
import { getErrorMessage } from "../api/client.js";
import { saveSession, getToken, getSavedUser, removeSession } from "../api/token.js";

export function useAuth() {
  // Start with whatever token was saved before (so refresh keeps you logged in)
  const [token, setToken] = useState(getToken());
  const [currentUser, setCurrentUser] = useState(getSavedUser());
  const [sessionMessage, setSessionMessage] = useState("");

  // Logged in = we have a token
  const isLoggedIn = Boolean(token);

  // When the server says the token is bad or expired, client.js sends
  // a "session-expired" event. Here we log the user out of the screen.
  useEffect(() => {
    function onSessionExpired(event) {
      setToken(null);
      setCurrentUser(null);
      setSessionMessage(event.detail || "Please login again.");
    }
    window.addEventListener("session-expired", onSessionExpired);
    return () => window.removeEventListener("session-expired", onSessionExpired);
  }, []);

  // When the app opens, ask the server if the saved token still works.
  // (If not, the 401 answer triggers the event above.)
  useEffect(() => {
    if (getToken()) getMe().catch(() => {});
  }, []);

  async function signUp(form) {
    try {
      await signUpRequest(form);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function login(email, password) {
    try {
      const data = await loginRequest(email, password);
      saveSession(data.token, data.user); // store the token
      setToken(data.token);
      setCurrentUser(data.user);
      setSessionMessage("");
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function logout() {
    try {
      await logoutRequest(); // tell the server
    } catch {
      // even if this fails, we still log out here
    }
    removeSession(); // remove the token
    setToken(null);
    setCurrentUser(null);
  }

  return { isLoggedIn, currentUser, sessionMessage, signUp, login, logout };
}
