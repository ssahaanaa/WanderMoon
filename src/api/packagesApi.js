import { client } from "./client.js";
import { usePackageCache } from "../store/packageCache.js";

async function withCache(key, load) {
  const cached = usePackageCache.getState().getCached(key);
  if (cached) return cached;

  const data = await load();
  usePackageCache.getState().setCached(key, data);
  return data;
}

export function fetchPackages(params, signal) {
  return withCache(`list:${JSON.stringify(params)}`, async () => {
    const { data } = await client.get("/packages", { params, signal });
    return data;
  });
}

// Only plain numbers are allowed in the URL (stops odd characters reaching the server)
function safeId(id) {
  const text = String(id);
  if (!/^\d+$/.test(text)) throw new Error("Invalid package id.");
  return text;
}

export function fetchPackageById(id, signal) {
  id = safeId(id);
  return withCache(`package:${id}`, async () => {
    const { data } = await client.get(`/packages/${id}`, { signal });
    return data;
  });
}

async function getJson(path, signal) {
  const { data } = await client.get(path, { signal });
  return data;
}

// Load a package in the background and keep it in the cache (errors are ignored)
export function prefetchPackage(id) {
  fetchPackageById(id).catch(() => {});
}

export function fetchAvailability(id, signal) {
  id = safeId(id);
  return getJson(`/packages/${id}/availability`, signal);
}

export function fetchAvailabilityForDate(id, date, signal) {
  id = safeId(id);
  return getJson(`/packages/${id}/availability?date=${encodeURIComponent(date)}`, signal);
}

export function fetchTravelInfo(id, signal) {
  id = safeId(id);
  return withCache(`travel-info:${id}`, () => getJson(`/packages/${id}/travel-info`, signal));
}
