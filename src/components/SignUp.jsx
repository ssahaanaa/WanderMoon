import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { isValidName, isValidEmail, isValidPhone } from "../utils/validate.js";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function SignUp() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signUp } = useBooking();

  function change(field, value) {
    setForm((oldForm) => ({ ...oldForm, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errors = [
      [!isValidName(form.name), "Please enter your full name."],
      [!isValidEmail(form.email), "Please enter a valid email address."],
      [!isValidPhone(form.phone), "Please enter a valid 10-digit phone number."],
      [form.password.length < 6, "Password must be at least 6 characters."],
      [form.password !== form.confirmPassword, "Passwords do not match."],
    ];

    const firstError = errors.find(([invalid]) => invalid);
    if (firstError) {
      setError(firstError[1]);
      return;
    }

    const result = signUp(form);
    if (!result.success) {
      setError(result.error);
      return;
    }

    alert("Account created! Please login to continue.");
    navigate("/login");
  }

  const fields = [
    ["name", "Full Name", "text"],
    ["email", "Email", "email"],
    ["phone", "Phone", "tel"],
    ["password", "Password", "password"],
    ["confirmPassword", "Confirm Password", "password"],
  ];

  return (
    <div className="auth-box">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(([name, label, type]) => (
          <div className="form-row" key={name}>
            <label>{label}</label>
            <input
              type={type}
              value={form[name]}
              onChange={(e) => change(name, e.target.value)}
            />
          </div>
        ))}

        {error && <p className="field-error">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default SignUp;
