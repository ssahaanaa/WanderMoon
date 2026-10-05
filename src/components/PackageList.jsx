import PackageCard from "./PackageCard.jsx";
import { useBooking } from "../context/BookingContext.jsx";

function PackageList() {
  const { packages, hasActiveFilters, selectPackage } = useBooking();

  if (packages.length === 0) {
    return <p>{hasActiveFilters ? "No travel packages found. Try changing your search or filters." : "No packages available."}</p>;
  }

  return (
    <div className="package-list">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} onSelectPackage={selectPackage} />
      ))}
    </div>
  );
}

export default PackageList;
