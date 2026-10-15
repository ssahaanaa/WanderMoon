import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

function Home() {
  const { isLoggedIn } = useBooking();
  const navigate = useNavigate();

  function viewPackages() {
    if (isLoggedIn) {
      navigate("/packages");
      return;
    }
    alert("Please login to view packages");
    navigate("/login");
  }

  return (
    <div className="home-hero">
      <h1>✈️ Welcome to WanderMoon</h1>
      <p>Plan your next getaway with our handpicked travel packages.</p>
      <button className="hero-button" onClick={viewPackages}>View Packages</button>
    </div>
  );
}

export default Home;
