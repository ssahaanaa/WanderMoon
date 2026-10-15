// Calls for signing up, logging in and logging out.
import { client } from "./client.js";

// POST /api/auth/signup  -> create an account
export async function signUpRequest(form) {
  const { data } = await client.post("/auth/signup", form);
  return data;
}

// POST /api/auth/login  -> returns { token, user }
export async function loginRequest(email, password) {
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

// POST /api/auth/logout  -> the server forgets the token
export async function logoutRequest() {
  const { data } = await client.post("/auth/logout");
  return data;
}

// GET /api/auth/me  -> checks that the saved token still works
export async function getMe() {
  const { data } = await client.get("/auth/me");
  return data;
}
