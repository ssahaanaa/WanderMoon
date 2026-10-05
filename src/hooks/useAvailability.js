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

    setLoading(true);
    setError("");
    setData(null);

    fetchAvailabilityForDate(packageId, date, controller.signal)
      .then(setData)
      .catch((err) => {
        if (!isCanceled(err)) {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [packageId, date]);

  return { data, loading, error };
}