import { useState } from "react";
import { Link } from "react-router-dom";
import TravelerForm from "./TravelerForm.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import { createBooking } from "../api/bookingsApi.js";
import { getErrorMessage } from "../api/client.js";
import { isValidName, isValidEmail, isValidPhone } from "../utils/validate.js";

function Checkout() {
  const { cart, traveler, totalBookingAmount, clearCart } = useBooking();
  const [booking, setBooking] = useState(null); // the booking returned by the API
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // POST the booking to the API, then empty the cart
  async function confirmBooking() {
    setSaving(true);
    setError("");
    try {
      const saved = await createBooking({ traveler, items: cart, totalAmount: totalBookingAmount });
      setBooking(saved);
      clearCart();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const canConfirm =
    cart.length > 0 &&
    isValidName(traveler.name) &&
    isValidEmail(traveler.email) &&
    isValidPhone(traveler.phone);

  if (cart.length === 0 && !booking) {
    return (
      <div>
        <h2>Checkout</h2>
        <p>Your booking cart is empty.</p>
        <Link to="/packages"><button>Browse Packages</button></Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Checkout</h2>

      {cart.length > 0 && (
        <>
          <p className="cart-total">Order Total: ₹{totalBookingAmount}</p>
          <TravelerForm />
          {error && <ErrorMessage message={error} onRetry={confirmBooking} />}
          <button disabled={!canConfirm || saving} onClick={confirmBooking}>
            {saving ? "Booking..." : "Confirm Booking"}
          </button>
        </>
      )}

      {booking && (
        <div className="confirmation-box">
          <h3>Booking Confirmed!</h3>
          <p>Booking ID: {booking.id}</p>
          <p>Traveler: {booking.traveler.name}</p>
          <p>Total Paid: ₹{booking.totalAmount}</p>
          <Link to="/bookings"><button>View My Bookings</button></Link>
        </div>
      )}
    </div>
  );
}

export default Checkout;
