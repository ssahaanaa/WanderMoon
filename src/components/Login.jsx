import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login, sessionMessage } = useBooking();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate("/");
  }

  return (
    <div className="auth-box">
      <h2>Login</h2>

      {/* shown when the token was bad or expired */}
      {sessionMessage && <p className="field-error" role="alert">{sessionMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="email" maxLength={100} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" maxLength={100} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <p className="field-error" role="alert">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-switch">
        Demo account: demo@wandermoon.com / demo123
      </p>

      <p className="auth-switch">
        New to WanderMoon? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;
