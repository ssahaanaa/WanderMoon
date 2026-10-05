import { useState } from "react";

const AUTH_KEY = "WanderMoon.isLoggedIn";
const USER_KEY = "WanderMoon.currentUser";
const USERS_KEY = "WanderMoon.users";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors.
  }
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => readStorage(AUTH_KEY, false));
  const [currentUser, setCurrentUser] = useState(() => readStorage(USER_KEY, null));
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, []));

  function signUp({ name, email, phone, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((user) => user.email === normalizedEmail)) {
      return {
        success: false,
        error: "An account with this email already exists. Please login instead.",
      };
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      phone,
      password,
    };
    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    writeStorage(USERS_KEY, updatedUsers);
    return { success: true };
  }

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(
      (item) => item.email === normalizedEmail && item.password === password
    );

    if (!user) {
      return {
        success: false,
        error: "No account found with that email and password.",
      };
    }

    const loggedInUser = { name: user.name, email: user.email };
    setIsLoggedIn(true);
    setCurrentUser(loggedInUser);
    writeStorage(AUTH_KEY, true);
    writeStorage(USER_KEY, loggedInUser);
    return { success: true };
  }

  function logout() {
    setIsLoggedIn(false);
    setCurrentUser(null);
    writeStorage(AUTH_KEY, false);
    writeStorage(USER_KEY, null);
  }

  return { isLoggedIn, currentUser, signUp, login, logout };
}
