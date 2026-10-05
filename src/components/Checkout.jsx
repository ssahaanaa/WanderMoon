import { Link } from "react-router-dom";
import TravelerForm from "./TravelerForm.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { isValidName, isValidEmail, isValidPhone } from "../utils/validate.js";

function Checkout() {
  const { cart, traveler, totalBookingAmount, confirmBooking, booking } = useBooking();

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
          <button disabled={!canConfirm} onClick={confirmBooking}>
            Confirm Booking
          </button>
        </>
      )}

      {booking && (
        <div className="confirmation-box">
          <h3>Booking Confirmed!</h3>
          <p>Booking ID: {booking.id}</p>
          <p>Traveler: {booking.traveler.name}</p>
          <p>Total Paid: ₹{booking.totalAmount}</p>
        </div>
      )}
    </div>
  );
}

export default Checkout;
