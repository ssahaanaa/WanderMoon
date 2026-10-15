import { useEffect, useState } from "react";
import { fetchAvailabilityForDate } from "../api/packagesApi.js";
import { getErrorMessage, isCanceled } from "../api/client.js";

export function useAvailability(packageId, date) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!packageId || !date) {
      setData(null);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    async function checkAvailability() {
      setLoading(true);
      setError("");
      setData(null);

      try {
        setData(await fetchAvailabilityForDate(packageId, date, controller.signal));
      } catch (err) {
        if (!isCanceled(err)) setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    checkAvailability();
    return () => controller.abort();
  }, [packageId, date]);

  return { data, loading, error };
}
