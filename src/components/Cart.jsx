import { useNavigate } from "react-router-dom";
import BookingCart from "./BookingCart.jsx";
import { useBooking } from "../context/BookingContext.jsx";

function Cart() {
  const { cart } = useBooking();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your Cart</h2>
      <BookingCart />
      {cart.length > 0 && (
        <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
      )}
    </div>
  );
}

export default Cart;
