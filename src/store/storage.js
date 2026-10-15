export const CART_KEY = "WanderMoon.cart";
export const DATES_KEY = "WanderMoon.travelDates";
export const TRAVELERS_KEY = "WanderMoon.travelers";

export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}
