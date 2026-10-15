import { useEffect, useState } from "react";
import {
  fetchPackageById,
  fetchAvailability,
  fetchTravelInfo,
} from "../api/packagesApi.js";
import { getErrorMessage, isCanceled } from "../api/client.js";

export function usePackageDetail(id) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState(null);
  const [travelInfo, setTravelInfo] = useState(null);
  const [extrasLoading, setExtrasLoading] = useState(true);
  const [extrasError, setExtrasError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      setExtrasLoading(true);
      setExtrasError("");
      setAvailability(null);
      setTravelInfo(null);

      try {
        const packageData = await fetchPackageById(id, controller.signal);
        setPkg(packageData);
        setLoading(false);
      } catch (err) {
        if (isCanceled(err)) return;
        setPkg(null);
        setError(getErrorMessage(err));
        setLoading(false);
        setExtrasLoading(false);
        return;
      }

      try {
        const [availabilityData, travelData] = await Promise.all([
          fetchAvailability(id, controller.signal),
          fetchTravelInfo(id, controller.signal),
        ]);
        setAvailability(availabilityData);
        setTravelInfo(travelData);
      } catch (err) {
        if (isCanceled(err)) return;
        setExtrasError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setExtrasLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id, reloadKey]);

  function reload() {
    setReloadKey((key) => key + 1);
  }

  return {
    pkg,
    loading,
    error,
    availability,
    travelInfo,
    extrasLoading,
    extrasError,
    reload,
  };
}
