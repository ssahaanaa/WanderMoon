import { useEffect, useState } from "react";
import { fetchPackages } from "../api/packagesApi.js";
import { getErrorMessage, isCanceled } from "../api/client.js";

const emptyFilters = { type: "", duration: "", budget: "", minRating: "" };

export function usePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPackages() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchPackages(
          {
            destination: debouncedSearch,
            type: filters.type,
            duration: filters.duration,
            budget: filters.budget,
            rating: filters.minRating,
          },
          controller.signal
        );
        setPackages(data);
      } catch (err) {
        if (isCanceled(err)) return;
        setPackages([]);
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadPackages();
    return () => controller.abort();
  }, [debouncedSearch, filters, reloadKey]);

  function retry() {
    setReloadKey((key) => key + 1);
  }

  const hasActiveFilters =
    Boolean(debouncedSearch) || Object.values(filters).some(Boolean);

  return {
    packages,
    loading,
    error,
    retry,
    search,
    setSearch,
    filters,
    setFilters,
    hasActiveFilters,
  };
}
