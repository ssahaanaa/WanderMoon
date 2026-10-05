import { useEffect, useRef } from "react";
import { useBooking } from "../context/BookingContext.jsx";

function SearchBar() {
  const { search, setSearch } = useBooking();
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);

  return (
    <div className="search-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search destination (e.g. Goa, Manali)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
