import axios from "axios";

export const API_BASE = "/api";

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

export function getErrorMessage(error) {
  if (isCanceled(error)) return "";

  if (error.response) {
    return (
      error.response.data?.message ||
      `Request failed (${error.response.status})`
    );
  }

  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (error.request) {
    return "Cannot reach the server. Check your connection and try again.";
  }

  return error.message || "Something went wrong.";
}

export function isCanceled(error) {
  return (
    error?.code === "ERR_CANCELED" ||
    error?.name === "AbortError"
  );
}
