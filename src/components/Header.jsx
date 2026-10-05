import { NavLink, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

function Header() {
  const { cart, isLoggedIn, currentUser, logout } = useBooking();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => (isActive ? "active" : undefined);
  const protectedLinkClass = ({ isActive }) =>
    !isLoggedIn ? "disabled-link" : isActive ? "active" : undefined;

  function logoutUser() {
    logout();
    navigate("/");
  }

  function openProtectedPage(e) {
    if (isLoggedIn) return;
    e.preventDefault();
    alert("Please login first");
    navigate("/login");
  }

  return (
    <header>
      <h2>WanderMoon</h2>
      <nav>
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/packages" className={protectedLinkClass} onClick={openProtectedPage}>Packages</NavLink>
        <NavLink to="/cart" className={protectedLinkClass} onClick={openProtectedPage}>Cart ({cart.length})</NavLink>
        <NavLink to="/booking" className={protectedLinkClass} onClick={openProtectedPage}>Booking</NavLink>
        <NavLink to="/bookings" className={protectedLinkClass} onClick={openProtectedPage}>My Bookings</NavLink>

        {isLoggedIn ? (
          <>
            <span className="nav-greeting">Hi, {currentUser?.name?.split(" ")[0]}</span>
            <button type="button" className="nav-logout" onClick={logoutUser}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/signup" className={linkClass}>Sign Up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
