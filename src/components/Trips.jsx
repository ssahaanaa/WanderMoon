import SearchBar from "./SearchBar.jsx";
import FilterPanel from "./FilterPanel.jsx";
import PackageList from "./PackageList.jsx";
import Loader from "./Loader.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import CacheStatus from "./CacheStatus.jsx";
import { useBooking } from "../context/BookingContext.jsx";

function Trips() {
  const { loading, error, retry } = useBooking();

  return (
    <div>
      <h2>Find Your Next Trip</h2>
      <SearchBar />
      <FilterPanel />
      {loading && <Loader message="Loading packages..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={retry} />}
      {!loading && !error && <PackageList />}
      <CacheStatus />
    </div>
  );
}

export default Trips;
