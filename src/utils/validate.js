// Small, reusable validation helpers used by controlled forms.

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

export function isValidName(name) {
  return name.trim().length >= 2;
}
