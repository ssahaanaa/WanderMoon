// Simple helpers that clean what the user types before we send it to the API.
// (React already escapes text when it shows it, so scripts typed into a field cannot run.
//  The server must still validate everything - this is only the first layer.)

// Remove < and > and control characters, trim spaces, and cut to a safe length
export function cleanText(value, maxLength = 100) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

// Phone numbers: digits only
export function cleanPhone(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 10);
}

// Never print passwords, tokens or personal details in the console
const SECRET_WORDS = ["password", "token", "email", "phone", "name"];
export function redact(object) {
  if (!object || typeof object !== "object") return object;
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      SECRET_WORDS.some((word) => key.toLowerCase().includes(word)) ? "[hidden]" : value,
    ])
  );
}
