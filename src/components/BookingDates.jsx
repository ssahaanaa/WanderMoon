import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { useAvailability } from "../hooks/useAvailability.js";
import AvailabilityStatus from "./AvailabilityStatus.jsx";

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function BookingDates() {
  const { currentPackage, travelDates, updateTravelDates } = useBooking();
  const navigate = useNavigate();
  const availability = useAvailability(currentPackage?.id, travelDates.start);

  if (!currentPackage) {
    return <p>Please add a package to continue. Go to Packages and pick one first.</p>;
  }

  const datesMissing = !travelDates.start || !travelDates.end;
  const dateUnavailable = !availability.data || !availability.data.available;

  function handleStartDateChange(e) {
    const start = e.target.value;
    const end = start ? addDays(start, currentPackage.days - 1) : "";
    updateTravelDates({ start, end });
  }

  return (
    <div className="detail-info">
      <h3>Select Travel Dates for {currentPackage.title}</h3>

      <label>Start Date</label>
      <input type="date" value={travelDates.start} onChange={handleStartDateChange} />

      <label>End Date</label>
      <input type="date" value={travelDates.end} readOnly disabled />

      {datesMissing && <p className="field-error">Please select a start date.</p>}

      {!datesMissing && (
        <AvailabilityStatus
          loading={availability.loading}
          error={availability.error}
          data={availability.data}
        />
      )}

      <button
        disabled={datesMissing || availability.loading || dateUnavailable}
        onClick={() => navigate("/booking/travelers")}
      >
        Next: Traveler Details
      </button>
    </div>
  );
}

export default BookingDates;
