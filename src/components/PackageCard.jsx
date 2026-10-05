import { Link } from "react-router-dom";

function PackageCard({ pkg, onSelectPackage }) {
  return (
    <div className="package-card">
      <div className="package-card-body">
        <span className="package-type-tag" data-type={pkg.type}>{pkg.type}</span>
        <h3>{pkg.title}</h3>
        <p>{pkg.destination} • {pkg.days} days • ⭐ {pkg.rating}</p>
        <p className="price">₹{pkg.pricePerPerson} / person</p>
        <Link to={`/package/${pkg.id}`}>
          <button onClick={() => onSelectPackage(pkg)}>View Details</button>
        </Link>
      </div>
    </div>
  );
}

export default PackageCard;
