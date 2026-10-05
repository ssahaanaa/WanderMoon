import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

function BookingPayment() {
  const { currentPackage, finalCost, addToCart } = useBooking();
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  if (!currentPackage) {
    return <p>Please add a package to continue. Go to Packages and pick one first.</p>;
  }

  function confirmAndPay() {
    addToCart();
    navigate("/checkout");
  }

  return (
    <div className="detail-info">
      <h3>Payment</h3>
      <p className="cart-total">Amount to Pay: ₹{finalCost}</p>

      <label>Payment Method</label>
      <select
        className="payment-select"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="">Select a payment method</option>
        <option value="card">Credit / Debit Card</option>
        <option value="upi">UPI</option>
        <option value="cash">Cash on Arrival</option>
      </select>

      {!paymentMethod && <p className="field-error">Please select a payment method.</p>}

      <button disabled={!paymentMethod} onClick={confirmAndPay}>
        Confirm & Pay
      </button>
    </div>
  );
}

export default BookingPayment;
