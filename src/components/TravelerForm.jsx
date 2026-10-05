import { useBooking } from "../context/BookingContext.jsx";
import { isValidName, isValidEmail, isValidPhone } from "../utils/validate.js";

function TravelerForm() {
  const { traveler, updateTraveler } = useBooking();

  function change(field, value) {
    updateTraveler({ ...traveler, [field]: value });
  }

  const nameError = traveler.name && !isValidName(traveler.name);
  const emailError = traveler.email && !isValidEmail(traveler.email);
  const phoneError = traveler.phone && !isValidPhone(traveler.phone);

  return (
    <div className="traveler-form">
      <h3>Traveler Details</h3>

      <div className="form-row">
        <label>Full Name</label>
        <input type="text" value={traveler.name} onChange={(e) => change("name", e.target.value)} />
        {nameError && <p className="field-error">Name must be at least 2 characters.</p>}
      </div>

      <div className="form-row">
        <label>Email</label>
        <input type="email" value={traveler.email} onChange={(e) => change("email", e.target.value)} />
        {emailError && <p className="field-error">Enter a valid email address.</p>}
      </div>

      <div className="form-row">
        <label>Phone</label>
        <input type="tel" value={traveler.phone} onChange={(e) => change("phone", e.target.value)} />
        {phoneError && <p className="field-error">Enter a valid 10-digit phone number.</p>}
      </div>
    </div>
  );
}

export default TravelerForm;
