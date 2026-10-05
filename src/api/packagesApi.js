import { client, API_BASE } from "./client.js";

export async function fetchPackages(params, signal) {
  const { data } = await client.get("/packages", { params, signal });
  return data;
}

export async function fetchPackageById(id, signal) {
  const { data } = await client.get(`/packages/${id}`, { signal });
  return data;
}

async function fetchData(url, signal) {
  const response = await fetch(url, { signal });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function fetchAvailability(id, signal) {
  return fetchData(`${API_BASE}/packages/${id}/availability`, signal);
}

export function fetchAvailabilityForDate(id, date, signal) {
  return fetchData(
    `${API_BASE}/packages/${id}/availability?date=${encodeURIComponent(date)}`,
    signal
  );
}

export function fetchTravelInfo(id, signal) {
  return fetchData(`${API_BASE}/packages/${id}/travel-info`, signal);
}