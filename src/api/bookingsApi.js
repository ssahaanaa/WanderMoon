// All protected calls (bookings and payments) live here.
// The token is added automatically by the interceptor in client.js.
// Each function = one REST call made with Axios.
import { client } from "./client.js";
import { cleanText, cleanPhone } from "../utils/sanitize.js";

// SECURITY: clean the traveler details and only allow plain ids in the URL
function cleanTraveler(traveler = {}) {
  return {
    name: cleanText(traveler.name, 60),
    email: cleanText(traveler.email, 100),
    phone: cleanPhone(traveler.phone),
  };
}

function safeId(id) {
  return encodeURIComponent(String(id));
}

// GET  /api/bookings  -> booking history of the logged-in user
export async function getBookings() {
  const { data } = await client.get("/bookings");
  return data;
}

// POST /api/bookings  -> create a booking
export async function createBooking(booking) {
  const { data } = await client.post("/bookings", { ...booking, traveler: cleanTraveler(booking.traveler) });
  return data;
}

// PUT  /api/bookings/:id  -> update traveler details
export async function updateBooking(id, traveler) {
  const { data } = await client.put(`/bookings/${safeId(id)}`, { traveler: cleanTraveler(traveler) });
  return data;
}

// DELETE /api/bookings/:id  -> cancel a booking
export async function cancelBooking(id) {
  const { data } = await client.delete(`/bookings/${safeId(id)}`);
  return data;
}

// POST /api/payments  -> pay for a booking
export async function createPayment(amount, method) {
  const { data } = await client.post("/payments", { amount, method });
  return data;
}
