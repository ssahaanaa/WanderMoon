import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useBooking();

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate("/");
  }

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <p className="field-error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      <p className="auth-switch">
        New to WanderMoon? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;
