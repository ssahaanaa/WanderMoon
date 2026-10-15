import { useEffect, useState } from "react";
import { getBookings, updateBooking, cancelBooking } from "../api/bookingsApi.js";
import { getErrorMessage } from "../api/client.js";

// Loads the booking history and gives edit / cancel functions.
export function useBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // GET the history when the page opens, or when retry() is called
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        setBookings(await getBookings());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reloadKey]);

  function retry() {
    setReloadKey((key) => key + 1);
  }

  // PUT: update one booking, then replace it in the list
  async function editBooking(id, traveler) {
    const updated = await updateBooking(id, traveler);
    setBookings((list) => list.map((b) => (b.id === id ? updated : b)));
  }

  // DELETE: cancel one booking, then remove it from the list
  async function removeBooking(id) {
    await cancelBooking(id);
    setBookings((list) => list.filter((b) => b.id !== id));
  }

  return { bookings, loading, error, retry, editBooking, removeBooking };
}
