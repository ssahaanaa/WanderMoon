import { Link, useNavigate } from "react-router-dom";
import { prefetchPackage } from "../api/packagesApi.js";

function PackageCard({ pkg, onSelectPackage }) {
  const navigate = useNavigate();

  function openDetails() {
    onSelectPackage(pkg);
    navigate(`/package/${pkg.id}`);
  }

  // Start loading the details when the user hovers or tabs to the card,
  // so the details page opens almost instantly.
  function warmUp() {
    prefetchPackage(pkg.id);
  }

  return (
    <div className="package-card" onMouseEnter={warmUp} onFocus={warmUp}>
      <div className="package-card-body">
        <span className="package-type-tag" data-type={pkg.type}>{pkg.type}</span>
        <h3>
          <Link to={`/package/${pkg.id}`} onClick={() => onSelectPackage(pkg)}>{pkg.title}</Link>
        </h3>
        <p>{pkg.destination} • {pkg.days} days • ⭐ {pkg.rating}</p>
        <p className="price">₹{pkg.pricePerPerson} / person</p>
        <button type="button" onClick={openDetails}>View Details</button>
      </div>
    </div>
  );
}

export default PackageCard;
