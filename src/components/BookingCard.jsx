import { useState } from "react";
import ErrorMessage from "./ErrorMessage.jsx";
import { getErrorMessage } from "../api/client.js";
import { isValidName, isValidEmail, isValidPhone } from "../utils/validate.js";

// Shows one booking with Edit (PUT) and Cancel (DELETE) buttons.
function BookingCard({ booking, onEdit, onCancel }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(booking.traveler);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    isValidName(form.name) && isValidEmail(form.email) && isValidPhone(form.phone);

  function change(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      await onEdit(booking.id, form);
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function cancel() {
    if (!window.confirm("Cancel this booking?")) return;
    setSaving(true);
    setError("");
    try {
      await onCancel(booking.id);
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  }

  return (
    <div className="confirmation-box">
      <h3>Booking ID: {booking.id}</h3>
      <p>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>

      {editing ? (
        <div className="traveler-form">
          <div className="form-row">
            <label>Full Name</label>
            <input value={form.name} onChange={(e) => change("name", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input value={form.email} onChange={(e) => change("email", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => change("phone", e.target.value)} />
          </div>
          {!isValid && <p className="field-error">Enter a valid name, email and 10-digit phone.</p>}
        </div>
      ) : (
        <>
          <p>Traveler: {booking.traveler.name}</p>
          <p>Email: {booking.traveler.email}</p>
          <p>Phone: {booking.traveler.phone}</p>
        </>
      )}

      {booking.items.map((item) => (
        <p key={item.cartId}>
          {item.title} - {item.travelers} traveler(s), {item.days} days, ₹{item.cost}
        </p>
      ))}

      <p className="cart-total">Total Paid: ₹{booking.totalAmount}</p>

      {error && <ErrorMessage message={error} />}

      <div className="detail-actions">
        {editing ? (
          <>
            <button disabled={!isValid || saving} onClick={save}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="secondary" disabled={saving} onClick={() => setEditing(false)}>
              Close
            </button>
          </>
        ) : (
          <>
            <button disabled={saving} onClick={() => setEditing(true)}>Edit Details</button>
            <button className="secondary" disabled={saving} onClick={cancel}>
              {saving ? "Cancelling..." : "Cancel Booking"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingCard;
