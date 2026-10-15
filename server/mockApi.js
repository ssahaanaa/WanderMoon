import packages from "../src/data/packages.js";
import { signup, login, logout, checkToken, getUser } from "./auth.js";

// In-memory "database" for bookings. Resets when the dev server restarts.
let bookings = [];


const travelInfo = {
  1: {
    bestTime: "November to February",
    weather: "Warm and sunny, 24-32°C",
    nearestAirport: "Dabolim Airport (GOI)",
    nearestRailway: "Madgaon Junction",
    languages: ["Konkani", "English", "Hindi"],
    tips: ["Carry sunscreen", "Rent a scooter for local travel", "Book water sports early"],
  },
  2: {
    bestTime: "March to June and December to February",
    weather: "Cool, 2-20°C, snow in winter",
    nearestAirport: "Kullu-Manali Airport (KUU)",
    nearestRailway: "Joginder Nagar",
    languages: ["Hindi", "Pahari", "English"],
    tips: ["Pack heavy woollens", "Book Rohtang permit in advance", "Carry motion sickness tablets"],
  },
  3: {
    bestTime: "October to March",
    weather: "Dry and pleasant, 8-28°C",
    nearestAirport: "Jaipur International Airport (JAI)",
    nearestRailway: "Jaipur Junction",
    languages: ["Hindi", "Rajasthani", "English"],
    tips: ["Wear comfortable shoes", "Start sightseeing early to avoid heat", "Bargain in local bazaars"],
  },
  4: {
    bestTime: "September to March",
    weather: "Humid and tropical, 22-33°C",
    nearestAirport: "Cochin International Airport (COK)",
    nearestRailway: "Ernakulam Junction",
    languages: ["Malayalam", "English", "Hindi"],
    tips: ["Carry mosquito repellent", "Try local Kerala meals", "Wear light cotton clothes"],
  },
  5: {
    bestTime: "June to September",
    weather: "Cold and dry, -10-25°C",
    nearestAirport: "Kushok Bakula Rimpochee Airport (IXL)",
    nearestRailway: "Jammu Tawi",
    languages: ["Ladakhi", "Hindi", "English"],
    tips: ["Rest for 24 hours to acclimatize", "Stay hydrated", "Carry valid photo ID for permits"],
  },
  6: {
    bestTime: "October to May",
    weather: "Tropical, 23-31°C",
    nearestAirport: "Veer Savarkar Airport (IXZ)",
    nearestRailway: "No railway, ferry from mainland",
    languages: ["Hindi", "English", "Bengali"],
    tips: ["Carry cash for islands", "Book ferries in advance", "Use reef-safe sunscreen"],
  },
};

const seatsTotal = 20;

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seatsLeftFor(packageId, date) {
  const h = hash(`${packageId}-${date}`);
  if (h % 7 === 0) return 0;
  return (h % seatsTotal) + 1;
}

function isoDate(d) {
  return d.toISOString().split("T")[0];
}

function upcomingDepartures(packageId) {
  const list = [];
  const start = new Date();
  start.setDate(start.getDate() + 7);
  for (let i = 0; i < 6; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i * 7);
    const date = isoDate(d);
    list.push({ date, seatsLeft: seatsLeftFor(packageId, date) });
  }
  return list;
}

function budgetMatch(price, budget) {
  if (!budget) return true;
  if (budget === "0-10000") return price <= 10000;
  if (budget === "10000-15000") return price > 10000 && price <= 15000;
  if (budget === "15000+") return price > 15000;
  return true;
}

function durationMatch(days, duration) {
  if (!duration) return true;
  if (duration === "1-3") return days <= 3;
  if (duration === "4-5") return days >= 4 && days <= 5;
  if (duration === "6+") return days >= 6;
  return true;
}

function listPackages(query) {
  const destination = (query.get("destination") || "").toLowerCase();
  const type = query.get("type") || "";
  const budget = query.get("budget") || "";
  const duration = query.get("duration") || "";
  const rating = Number(query.get("rating") || 0);

  return packages
    .filter((p) => p.destination.toLowerCase().includes(destination))
    .filter((p) => (type ? p.type === type : true))
    .filter((p) => budgetMatch(p.pricePerPerson, budget))
    .filter((p) => durationMatch(p.days, duration))
    .filter((p) => p.rating >= rating)
    .map(({ id, destination: dest, title, type: t, pricePerPerson, rating: r, days, description }) => ({
      id,
      destination: dest,
      title,
      type: t,
      pricePerPerson,
      rating: r,
      days,
      description,
    }));
}

// GET /api/bookings  -> booking history of the logged-in user (newest first)
function listBookings(owner) {
  return bookings.filter((b) => b.owner === owner).reverse();
}

// POST /api/bookings  -> create a booking for the logged-in user
function addBooking(body, owner) {
  const { traveler, items, totalAmount } = body;

  if (!traveler || !traveler.name || !traveler.email || !traveler.phone) {
    return [400, { message: "Traveler name, email and phone are required" }];
  }
  if (!Array.isArray(items) || items.length === 0) {
    return [400, { message: "A booking needs at least one package" }];
  }

  const newBooking = {
    id: "BK" + Date.now(),
    owner, // who made this booking
    traveler,
    items,
    totalAmount,
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return [201, newBooking];
}

// PUT or PATCH /api/bookings/:id  -> update traveler details (own bookings only)
function updateBooking(id, body, owner) {
  const booking = bookings.find((b) => b.id === id && b.owner === owner);
  if (!booking) return [404, { message: `Booking ${id} was not found` }];

  const traveler = { ...booking.traveler, ...body.traveler };
  if (!traveler.name || !traveler.email || !traveler.phone) {
    return [400, { message: "Traveler name, email and phone are required" }];
  }

  booking.traveler = traveler;
  return [200, booking];
}

// DELETE /api/bookings/:id  -> cancel a booking (own bookings only)
function cancelBooking(id, owner) {
  const booking = bookings.find((b) => b.id === id && b.owner === owner);
  if (!booking) return [404, { message: `Booking ${id} was not found` }];

  bookings = bookings.filter((b) => b.id !== id);
  return [200, { message: "Booking cancelled", id }];
}

// POST /api/payments  -> pay for a booking
function makePayment(body) {
  const { amount, method } = body;

  if (!(Number(amount) > 0)) return [400, { message: "Amount must be greater than 0" }];
  if (!["card", "upi", "cash"].includes(method)) {
    return [400, { message: "Please choose a payment method" }];
  }

  return [201, { paymentId: "PAY" + Date.now(), status: "paid", amount, method }];
}

// Handles everything under /api/bookings (owner = email of the logged-in user)
function handleBookings(method, body, parts, owner) {
  const id = parts[2];

  if (method === "GET" && !id) return [200, listBookings(owner)];
  if (method === "POST" && !id) return body ? addBooking(body, owner) : [400, { message: "Invalid JSON" }];
  if ((method === "PUT" || method === "PATCH") && id) {
    return body ? updateBooking(id, body, owner) : [400, { message: "Invalid JSON" }];
  }
  if (method === "DELETE" && id) return cancelBooking(id, owner);

  return [405, { message: "Method not allowed" }];
}

// Handles everything under /api/auth  (these are the only routes that need no token,
// except logout and me, which need one)
function handleAuth(method, body, headers, parts) {
  const action = parts[2];

  if (method === "POST" && (action === "signup" || action === "login")) {
    if (!body) return [400, { message: "Invalid JSON" }];
    return action === "signup" ? signup(body) : login(body);
  }

  if (action === "logout" || action === "me") {
    const { email, token, error } = checkToken(headers);
    if (error) return [401, { message: error }];
    return action === "logout" ? logout(token) : [200, { user: getUser(email) }];
  }

  return [404, { message: "Endpoint not found" }];
}

// The whole API in one plain function, so it can run in two places:
//   1. inside the Vite server (npm run dev / npm run preview)
//   2. inside the browser (the deployed site, see src/api/browserApi.js)
// Input:  method ("GET"), url ("/api/packages?type=Beach"), body (object or null), headers (object)
// Output: [status, data]
export function handleRequest({ method, url, body, headers = {} }) {
  const parsed = new URL(url, "http://localhost");
  const parts = parsed.pathname.split("/").filter(Boolean);

  // ----- login, signup, logout -----
  if (parts[1] === "auth") return handleAuth(method, body, headers, parts);

  // ----- protected routes: a good token is needed -----
  if (parts[1] === "bookings" || parts[1] === "payments") {
    const { email, error } = checkToken(headers);
    if (error) return [401, { message: error }];

    if (parts[1] === "payments") {
      return method === "POST" && body ? makePayment(body) : [400, { message: "Send a POST with JSON" }];
    }
    return handleBookings(method, body, parts, email);
  }

  if (parts[1] !== "packages") return [404, { message: "Endpoint not found" }];

  // packages are read-only
  if (method !== "GET") return [405, { message: "Method not allowed" }];

  if (parts.length === 2) return [200, listPackages(parsed.searchParams)];

  const id = Number(parts[2]);
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return [404, { message: `Package ${parts[2]} was not found` }];

  if (parts.length === 3) return [200, pkg];

  if (parts[3] === "availability") {
    const date = parsed.searchParams.get("date");
    if (date) {
      if (Number.isNaN(new Date(date).getTime())) return [400, { message: "Invalid date" }];
      const seatsLeft = seatsLeftFor(id, date);
      return [200, { packageId: id, date, seatsTotal, seatsLeft, available: seatsLeft > 0 }];
    }
    return [200, { packageId: id, seatsTotal, departures: upcomingDepartures(id) }];
  }

  if (parts[3] === "travel-info") return [200, { packageId: id, ...travelInfo[id] }];

  return [404, { message: "Endpoint not found" }];
}

// Read the JSON body of a Node request. Returns null when the JSON is invalid.
function readBody(req) {
  return new Promise((resolve) => {
    let text = "";
    req.on("data", (chunk) => (text += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(text || "{}"));
      } catch {
        resolve(null);
      }
    });
  });
}

// Vite server wrapper: turns a real HTTP request into handleRequest() and back.
export async function mockApiMiddleware(req, res, next) {
  if (!req.url.startsWith("/api/")) return next();

  const body = ["POST", "PUT", "PATCH"].includes(req.method) ? await readBody(req) : null;
  const [status, data] = handleRequest({ method: req.method, url: req.url, body, headers: req.headers });

  // small delay so the loaders are visible
  setTimeout(() => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  }, 500);
}

export function mockApiPlugin() {
  return {
    name: "wandermoon-mock-api",
    configureServer(server) {
      server.middlewares.use(mockApiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(mockApiMiddleware);
    },
  };
}
