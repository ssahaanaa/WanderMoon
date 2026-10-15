import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage.jsx";
import { createPayment } from "../api/bookingsApi.js";
import { getErrorMessage } from "../api/client.js";
import { useBooking } from "../context/BookingContext.jsx";

function BookingPayment() {
  const { currentPackage, finalCost, addToCart } = useBooking();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!currentPackage) {
    return <p>Please add a package to continue. Go to Packages and pick one first.</p>;
  }

  // POST the payment (needs a token), then go to checkout
  async function confirmAndPay() {
    setPaying(true);
    setError("");
    try {
      await createPayment(finalCost, paymentMethod);
      addToCart();
      navigate("/checkout");
    } catch (err) {
      setError(getErrorMessage(err));
      setPaying(false);
    }
  }

  return (
    <div className="detail-info">
      <h3>Payment</h3>
      <p className="cart-total">Amount to Pay: ₹{finalCost}</p>

      <label htmlFor="payment-method">Payment Method</label>
      <select
        id="payment-method"
        className="payment-select"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="">Select a payment method</option>
        <option value="card">Credit / Debit Card</option>
        <option value="upi">UPI</option>
        <option value="cash">Cash on Arrival</option>
      </select>

      {!paymentMethod && <p className="field-error" role="alert">Please select a payment method.</p>}

      {error && <ErrorMessage message={error} />}

      <button disabled={!paymentMethod || paying} onClick={confirmAndPay}>
        {paying ? "Paying..." : "Confirm & Pay"}
      </button>
    </div>
  );
}

export default BookingPayment;
