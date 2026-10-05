import { useBooking } from "../context/BookingContext.jsx";

function Bookings() {
  const { bookings } = useBooking();

  if (bookings.length === 0) return <p>You have no past bookings yet.</p>;

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map((booking) => (
        <div className="confirmation-box" key={booking.id}>
          <h3>Booking ID: {booking.id}</h3>
          <p>Traveler: {booking.traveler.name}</p>
          <p>Email: {booking.traveler.email}</p>
          <p>Phone: {booking.traveler.phone}</p>

          {booking.items.map((item) => (
            <p key={item.cartId}>
              {item.title} - {item.travelers} traveler(s), {item.days} days, ₹{item.cost}
            </p>
          ))}

          <p className="cart-total">Total Paid: ₹{booking.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}

export default Bookings;
