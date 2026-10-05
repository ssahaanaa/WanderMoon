import { NavLink, Outlet } from "react-router-dom";

function Booking() {
  return (
    <div>
      <h2>Booking</h2>
      <nav className="booking-steps">
        <NavLink to="/booking/dates">1. Dates</NavLink>
        <NavLink to="/booking/travelers">2. Travelers</NavLink>
        <NavLink to="/booking/summary">3. Summary</NavLink>
        <NavLink to="/booking/payment">4. Payment</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

export default Booking;
