import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { useAvailability } from "../hooks/useAvailability.js";
import TravelerForm from "./TravelerForm.jsx";
import AvailabilityStatus from "./AvailabilityStatus.jsx";
import { isValidName, isValidEmail, isValidPhone } from "../utils/validate.js";

function BookingTravelers() {
  const { currentPackage, travelDates, travelers, updateTravelers, traveler } = useBooking();
  const navigate = useNavigate();
  const availability = useAvailability(currentPackage?.id, travelDates.start);

  if (!currentPackage) {
    return <p>Please add a package to continue. Go to Packages and pick one first.</p>;
  }

  const seatsOk =
    !travelDates.start ||
    (availability.data?.available && travelers <= availability.data.seatsLeft);

  const formValid =
    isValidName(traveler.name) &&
    isValidEmail(traveler.email) &&
    isValidPhone(traveler.phone) &&
    travelers >= 1 &&
    Boolean(seatsOk);

  return (
    <div className="detail-info">
      <h3>Traveler Information</h3>

      <label>Number of Travelers</label>
      <input
        type="number"
        min="1"
        value={travelers}
        onChange={(e) => updateTravelers(Number(e.target.value))}
      />

      {travelDates.start && (
        <AvailabilityStatus
          loading={availability.loading}
          error={availability.error}
          data={availability.data}
          requested={travelers}
        />
      )}

      <TravelerForm />

      <button disabled={!formValid} onClick={() => navigate("/booking/summary")}>
        Next: Booking Summary
      </button>
    </div>
  );
}

export default BookingTravelers;
