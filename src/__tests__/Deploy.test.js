/**
 * @jest-environment node
 */
// Checks the package search and booking features through the same handleRequest()
// function that runs inside the deployed site (see src/api/browserApi.js).
import { handleRequest } from "../../server/mockApi.js";

const traveler = { name: "Asha", email: "asha@example.com", phone: "9876543210" };

function loginHeaders() {
  const [, data] = handleRequest({
    method: "POST",
    url: "/api/auth/login",
    body: { email: "demo@wandermoon.com", password: "demo123" },
  });
  return { authorization: `Bearer ${data.token}` };
}

describe("package search", () => {
  test("lists packages without logging in", () => {
    const [status, list] = handleRequest({ method: "GET", url: "/api/packages" });
    expect(status).toBe(200);
    expect(list.length).toBeGreaterThan(0);
  });

  test("filters by destination", () => {
    const [, list] = handleRequest({ method: "GET", url: "/api/packages?destination=goa" });
    expect(list.length).toBeGreaterThan(0);
    list.forEach((p) => expect(p.destination.toLowerCase()).toContain("goa"));
  });

  test("returns an empty list when nothing matches", () => {
    const [status, list] = handleRequest({ method: "GET", url: "/api/packages?destination=nowhere" });
    expect(status).toBe(200);
    expect(list).toEqual([]);
  });
});

describe("booking", () => {
  test("bookings need a login", () => {
    const [status] = handleRequest({ method: "GET", url: "/api/bookings" });
    expect(status).toBe(401);
  });

  test("create, list and cancel a booking", () => {
    const headers = loginHeaders();

    const [createdStatus, booking] = handleRequest({
      method: "POST",
      url: "/api/bookings",
      headers,
      body: { traveler, items: [{ id: 1 }], totalAmount: 12000 },
    });
    expect(createdStatus).toBe(201);

    const [, mine] = handleRequest({ method: "GET", url: "/api/bookings", headers });
    expect(mine.some((b) => b.id === booking.id)).toBe(true);

    const [cancelStatus] = handleRequest({ method: "DELETE", url: `/api/bookings/${booking.id}`, headers });
    expect(cancelStatus).toBe(200);

    const [, after] = handleRequest({ method: "GET", url: "/api/bookings", headers });
    expect(after.some((b) => b.id === booking.id)).toBe(false);
  });

  test("a booking without traveler details is rejected", () => {
    const [status] = handleRequest({
      method: "POST",
      url: "/api/bookings",
      headers: loginHeaders(),
      body: { traveler: {}, items: [{ id: 1 }], totalAmount: 1 },
    });
    expect(status).toBe(400);
  });
});
