import { actionLogged } from "./activitySlice.js";
import { redact } from "../utils/sanitize.js";

const describers = {
  "booking/selectPackage": (action) =>
    action.payload ? `Selected package: ${action.payload.title}` : "Cleared selected package",
  "booking/setTravelDates": (action) =>
    `Travel dates set: ${action.payload.start || "-"} to ${action.payload.end || "-"}`,
  "booking/setTravelers": (action, before, after) =>
    `Travelers changed: ${before.travelers} to ${after.travelers}`,
  "booking/setTraveler": (action) => "Traveler details updated",
  "booking/resetBookingForm": () => "Booking form reset",
  "booking/addToCart": (action, before, after) => {
    const item = after.cart[after.cart.length - 1];
    return item
      ? `Added to cart: ${item.title}, ${item.travelers} traveler(s), ₹${item.cost}`
      : "Add to cart ignored, no package selected";
  },
  "booking/removeFromCart": (action, before) => {
    const item = before.cart.find((entry) => entry.cartId === action.payload);
    return `Removed from cart: ${item ? item.title : action.payload}`;
  },
  "booking/updateCartItem": (action, before, after) => {
    const item = after.cart.find((entry) => entry.cartId === action.payload.cartId);
    return item
      ? `Updated ${item.title}: ${item.travelers} traveler(s), ₹${item.cost}`
      : "Update ignored, item not found";
  },
  "booking/clearCart": (action, before) => `Cart cleared (${before.cart.length} item(s) removed)`,
  "booking/confirmBooking": (action, before, after) =>
    `Booking confirmed: ${action.payload.id}, ₹${after.booking ? after.booking.totalAmount : 0}`,
};

export const bookingMonitor = (store) => (next) => (action) => {
  if (typeof action.type !== "string" || !action.type.startsWith("booking/")) {
    return next(action);
  }

  const before = store.getState().booking;
  const result = next(action);
  const after = store.getState().booking;

  const describe = describers[action.type];
  const summary = describe ? describe(action, before, after) : action.type;

  console.groupCollapsed(`[booking] ${action.type}`);
  console.log("summary:", summary);
  // SECURITY: personal details are hidden before logging
  console.log("payload:", redact(action.payload));
  console.log("cart items:", before.cart.length, "->", after.cart.length);
  console.groupEnd();

  store.dispatch(actionLogged(action.type, summary));

  return result;
};
