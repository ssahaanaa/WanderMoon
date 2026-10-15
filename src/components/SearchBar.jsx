import { useBooking } from "../context/BookingContext.jsx";

function SearchBar() {
  const { search, setSearch } = useBooking();

  return (
    <div className="search-bar">
      <input
        type="search"
        aria-label="Search destination"
        maxLength={50}
        placeholder="Search destination (e.g. Goa, Manali)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
