import { useBooking } from "../context/BookingContext.jsx";

function FilterPanel() {
  const { filters, setFilters } = useBooking();

  function changeFilter(field, value) {
    setFilters({ ...filters, [field]: value });
  }

  return (
    <div className="filter-panel">
      <select value={filters.type} onChange={(e) => changeFilter("type", e.target.value)}>
        <option value="">All Types</option>
        <option value="Beach">Beach</option>
        <option value="Mountain">Mountain</option>
        <option value="Heritage">Heritage</option>
        <option value="Nature">Nature</option>
      </select>

      <select value={filters.duration} onChange={(e) => changeFilter("duration", e.target.value)}>
        <option value="">Any Duration</option>
        <option value="1-3">1-3 days</option>
        <option value="4-5">4-5 days</option>
        <option value="6+">6+ days</option>
      </select>

      <select value={filters.budget} onChange={(e) => changeFilter("budget", e.target.value)}>
        <option value="">Any Budget</option>
        <option value="0-10000">Up to ₹10,000</option>
        <option value="10000-15000">₹10,000 - ₹15,000</option>
        <option value="15000+">₹15,000+</option>
      </select>

      <select value={filters.minRating} onChange={(e) => changeFilter("minRating", e.target.value)}>
        <option value="">Any Rating</option>
        <option value="4">4+ stars</option>
        <option value="4.5">4.5+ stars</option>
      </select>
    </div>
  );
}

export default FilterPanel;
