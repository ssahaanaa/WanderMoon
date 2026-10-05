import { useBooking } from "../context/BookingContext.jsx";

function BookingCart() {
  const { cart, totalBookingAmount, removeFromCart } = useBooking();

  return (
    <div className="booking-cart">
      <h3>Your Cart</h3>

      {cart.length === 0 && <p>Your booking cart is empty.</p>}

      {cart.map((item) => (
        <div className="cart-item" key={item.cartId}>
          <span>
            {item.title} ({item.travelers} traveler(s), {item.days} days)
          </span>
          <span>₹{item.cost}</span>
          <button onClick={() => removeFromCart(item.cartId)}>Remove</button>
        </div>
      ))}

      {cart.length > 0 && <p className="cart-total">Total: ₹{totalBookingAmount}</p>}
    </div>
  );
}

export default BookingCart;
