import { Navigate, Outlet } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

// Wraps the pages that need a login.
// Not logged in? Go to the login page. Logged in? Show the page.
function ProtectedRoute() {
  const { isLoggedIn } = useBooking();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
