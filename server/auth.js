// Very simple login system for the mock server.
// (A real app would hash passwords and use a database. This is just for learning.)

// How long a token works. After this time the token is "expired".
// Tip: change to 20 * 1000 (20 seconds) to quickly see the expired-token message.
const TOKEN_LIFETIME = 5 * 60 * 1000; // 5 minutes

// All registered users (one demo user is ready to use)
const users = [
  { name: "Demo Traveler", email: "demo@wandermoon.com", phone: "9876543210", password: "demo123" },
];

// All tokens that were given out:  token -> { email, expiresAt }
const tokens = {};

// Send back the user without the password
function publicUser(user) {
  return { name: user.name, email: user.email };
}

// POST /api/auth/signup  -> create an account
export function signup(body) {
  const { name, email, phone, password } = body;

  if (!name || !email || !phone || !password) {
    return [400, { message: "Name, email, phone and password are required" }];
  }
  if (password.length < 6) {
    return [400, { message: "Password must be at least 6 characters" }];
  }

  const emailLower = email.trim().toLowerCase();
  if (users.some((u) => u.email === emailLower)) {
    return [409, { message: "An account with this email already exists. Please login instead." }];
  }

  users.push({ name: name.trim(), email: emailLower, phone, password });
  return [201, { message: "Account created" }];
}

// POST /api/auth/login  -> check email + password, give back a token
export function login(body) {
  const emailLower = (body.email || "").trim().toLowerCase();
  const user = users.find((u) => u.email === emailLower && u.password === body.password);

  if (!user) return [401, { message: "Wrong email or password" }];

  const token = globalThis.crypto.randomUUID(); // works in Node 20+ and in browsers
  const expiresAt = Date.now() + TOKEN_LIFETIME;
  tokens[token] = { email: user.email, expiresAt };

  return [200, { token, expiresAt, user: publicUser(user) }];
}

// POST /api/auth/logout  -> the token stops working
export function logout(token) {
  delete tokens[token];
  return [200, { message: "Logged out" }];
}

// Look at the request headers and decide: is the token good?
// Returns { email, token } when good, or { error } when not.
export function checkToken(headers) {
  const header = headers.authorization || headers.Authorization || "";
  const token = header.replace("Bearer ", "");

  if (!token) {
    return { error: "Please login to continue" };
  }

  const saved = tokens[token];
  if (!saved) {
    return { error: "Invalid token. Please login again." };
  }

  if (Date.now() > saved.expiresAt) {
    delete tokens[token];
    return { error: "Your session has expired. Please login again." };
  }

  return { email: saved.email, token };
}

// GET /api/auth/me  -> who is logged in?
export function getUser(email) {
  return publicUser(users.find((u) => u.email === email));
}
