import { useBooking } from "../context/BookingContext.jsx";

function BookingCart() {
  const {
    cart,
    totalBaseCost,
    totalDiscount,
    totalTax,
    totalBookingAmount,
    removeFromCart,
    updateCartItem,
    clearCart,
  } = useBooking();

  function changeTravelers(cartId, value) {
    const count = Number(value);
    if (count >= 1) updateCartItem(cartId, count);
  }

  return (
    <div className="booking-cart">
      <h3>Your Cart</h3>

      {cart.length === 0 && <p>Your booking cart is empty.</p>}

      {cart.map((item) => (
        <div className="cart-item" key={item.cartId}>
          <span>
            {item.title} ({item.travelers} traveler(s), {item.days} days)
          </span>
          <input
            className="cart-qty"
            type="number"
            min="1"
            value={item.travelers}
            aria-label={`Travelers for ${item.title}`}
            onChange={(e) => changeTravelers(item.cartId, e.target.value)}
          />
          <span>₹{item.cost}</span>
          <button onClick={() => removeFromCart(item.cartId)}>Remove</button>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="cart-summary">
          <p>Package Cost: ₹{totalBaseCost}</p>
          {totalDiscount > 0 && <p>Discount: -₹{totalDiscount}</p>}
          <p>Taxes: ₹{totalTax}</p>
          <p className="cart-total">Total: ₹{totalBookingAmount}</p>
          <button className="secondary" onClick={clearCart}>Clear Cart</button>
        </div>
      )}
    </div>
  );
}

export default BookingCart;
