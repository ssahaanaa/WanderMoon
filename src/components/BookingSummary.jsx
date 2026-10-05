import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

function BookingSummary() {
  const {
    currentPackage,
    travelDates,
    travelers,
    traveler,
    tripDuration,
    packageCost,
    discount,
    tax,
    finalCost,
  } = useBooking();
  const navigate = useNavigate();

  if (!currentPackage) {
    return <p>Please add a package to continue. Go to Packages and pick one first.</p>;
  }

  return (
    <div className="detail-info">
      <h3>Booking Summary</h3>
      <p>Package: {currentPackage.title}</p>
      <p>Destination: {currentPackage.destination}</p>
      <p>Dates: {travelDates.start || "—"} to {travelDates.end || "—"}</p>
      <p>Duration: {tripDuration} days</p>
      <p>Travelers: {travelers}</p>
      <p>Traveler Name: {traveler.name}</p>
      <p>Package Cost: ₹{packageCost}</p>
      {discount > 0 && <p>Discount: -₹{discount}</p>}
      <p>Taxes: ₹{tax}</p>
      <p className="cart-total">Total: ₹{finalCost}</p>

      <button onClick={() => navigate("/booking/payment")}>Next: Payment</button>
    </div>
  );
}

export default BookingSummary;
