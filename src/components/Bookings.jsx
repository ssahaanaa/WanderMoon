import { Link } from "react-router-dom";
import { useBookingHistory } from "../hooks/useBookingHistory.js";
import BookingCard from "./BookingCard.jsx";
import Loader from "./Loader.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

// Booking history page (GET), with edit (PUT) and cancel (DELETE) on each booking.
function Bookings() {
  const { bookings, loading, error, retry, editBooking, removeBooking } =
    useBookingHistory();

  if (loading) return <Loader message="Loading your bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.length === 0 && (
        <>
          <p>You have no bookings yet.</p>
          <Link to="/packages"><button>Browse Packages</button></Link>
        </>
      )}

      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onEdit={editBooking}
          onCancel={removeBooking}
        />
      ))}
    </div>
  );
}

export default Bookings;
