import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { usePackageDetail } from "../hooks/usePackageDetail.js";
import Loader from "./Loader.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCurrentPackage, resetBookingForm, addToCart } = useBooking();
  const {
    pkg,
    loading,
    error,
    availability,
    travelInfo,
    extrasLoading,
    extrasError,
    reload,
  } = usePackageDetail(id);

  useEffect(() => {
    if (pkg) setCurrentPackage(pkg);
  }, [pkg, setCurrentPackage]);

  if (loading) return <Loader message="Loading package details..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!pkg) return <p>Package not found.</p>;

  function addPackageToCart() {
    addToCart();
    alert(`${pkg.title} added to cart!`);
  }

  function startBooking() {
    resetBookingForm();
    navigate("/booking/dates");
  }

  return (
    <div className="package-detail">
      <div className="detail-info">
        <span className="package-type-tag" data-type={pkg.type}>{pkg.type}</span>
        <h2>{pkg.title}</h2>
        <p>{pkg.description}</p>
        <p>Duration: {pkg.days} days</p>
        <p>Rating: {pkg.rating} / 5</p>
        <p className="price">₹{pkg.pricePerPerson} / person</p>

        <h3>Itinerary</h3>
        <List items={pkg.itinerary} />
        <h3>Inclusions</h3>
        <List items={pkg.inclusions} />
        <h3>Exclusions</h3>
        <List items={pkg.exclusions} />

        <div className="detail-actions">
          <button onClick={addPackageToCart}>Add to Cart</button>
          <button className="secondary" onClick={startBooking}>Book This Trip</button>
        </div>
      </div>

      <div className="detail-info">
        <h3>Availability</h3>
        {extrasLoading && <Loader message="Checking availability..." />}
        {!extrasLoading && extrasError && (
          <ErrorMessage message={extrasError} onRetry={reload} />
        )}
        {!extrasLoading && !extrasError && availability && (
          <ul className="departure-list">
            {availability.departures.map((departure) => (
              <li key={departure.date}>
                <span>{departure.date}</span>
                <span className={getSeatClass(departure.seatsLeft)}>
                  {departure.seatsLeft === 0 ? "Sold out" : `${departure.seatsLeft} seats left`}
                </span>
              </li>
            ))}
          </ul>
        )}

        <h3>Travel Information</h3>
        {extrasLoading && <Loader message="Loading travel information..." />}
        {!extrasLoading && !extrasError && travelInfo && (
          <div className="travel-info">
            <p><strong>Best time to visit:</strong> {travelInfo.bestTime}</p>
            <p><strong>Weather:</strong> {travelInfo.weather}</p>
            <p><strong>Nearest airport:</strong> {travelInfo.nearestAirport}</p>
            <p><strong>Nearest railway:</strong> {travelInfo.nearestRailway}</p>
            <p><strong>Languages:</strong> {travelInfo.languages.join(", ")}</p>
            <p><strong>Tips:</strong></p>
            <List items={travelInfo.tips} />
          </div>
        )}
      </div>
    </div>
  );
}

function List({ items }) {
  return (
    <ul>
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
}

function getSeatClass(seatsLeft) {
  if (seatsLeft === 0) return "seats sold-out";
  return seatsLeft <= 5 ? "seats low" : "seats";
}

export default PackageDetail;
