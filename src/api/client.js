import axios from "axios";
import { getToken, removeSession } from "./token.js";

export const API_BASE = "/api";

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  withCredentials: false, // never send cookies to other sites
  maxContentLength: 1024 * 1024, // refuse huge responses (1 MB)
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

// Before EVERY request: if we have a token, attach it.
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// After EVERY response: if the server says 401 (bad or expired token),
// remove the token and tell the app so it can send the user to the login page.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      removeSession();
      window.dispatchEvent(
        new CustomEvent("session-expired", { detail: error.response.data?.message })
      );
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  if (error?.code === "ERR_CANCELED") return "";
  if (error?.response) {
    return error.response.data?.message || `Request failed (${error.response.status})`;
  }
  if (error?.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (error?.request) return "Cannot reach the server. Check your connection and try again.";
  return error?.message || "Something went wrong.";
}

export function isCanceled(error) {
  return error?.code === "ERR_CANCELED" || error?.name === "AbortError";
}
