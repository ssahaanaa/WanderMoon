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
        <label htmlFor="traveler-name">Full Name</label>
        <input id="traveler-name" type="text" autoComplete="name" maxLength={60} aria-invalid={Boolean(nameError)} value={traveler.name} onChange={(e) => change("name", e.target.value)} />
        {nameError && <p className="field-error" role="alert">Name must be at least 2 characters.</p>}
      </div>

      <div className="form-row">
        <label htmlFor="traveler-email">Email</label>
        <input id="traveler-email" type="email" autoComplete="email" maxLength={100} aria-invalid={Boolean(emailError)} value={traveler.email} onChange={(e) => change("email", e.target.value)} />
        {emailError && <p className="field-error" role="alert">Enter a valid email address.</p>}
      </div>

      <div className="form-row">
        <label htmlFor="traveler-phone">Phone</label>
        <input id="traveler-phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} aria-invalid={Boolean(phoneError)} value={traveler.phone} onChange={(e) => change("phone", e.target.value)} />
        {phoneError && <p className="field-error" role="alert">Enter a valid 10-digit phone number.</p>}
      </div>
    </div>
  );
}

export default TravelerForm;
