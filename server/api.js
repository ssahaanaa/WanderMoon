
import packages from "../src/data/packages.js";

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

const TOTAL_SEATS = 20;

function getNumber(text) {
  let number = 0;

  for (let i = 0; i < text.length; i++) {
    number = (number * 31 + text.charCodeAt(i)) >>> 0;
  }

  return number;
}

function getSeats(packageId, date) {
  const number = getNumber(`${packageId}-${date}`);

  if (number % 7 === 0) return 0;

  return (number % TOTAL_SEATS) + 1;
}

function getDate(date) {
  return date.toISOString().split("T")[0];
}

function getDepartures(packageId) {
  const departures = [];
  const startDate = new Date();

  startDate.setDate(startDate.getDate() + 7);

  for (let i = 0; i < 6; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i * 7);

    const dateText = getDate(date);

    departures.push({
      date: dateText,
      seatsLeft: getSeats(packageId, dateText),
    });
  }

  return departures;
}

function matchesBudget(price, budget) {
  if (!budget) return true;

  if (budget === "0-10000") return price <= 10000;
  if (budget === "10000-15000") return price > 10000 && price <= 15000;
  if (budget === "15000+") return price > 15000;

  return true;
}

function matchesDuration(days, duration) {
  if (!duration) return true;

  if (duration === "1-3") return days <= 3;
  if (duration === "4-5") return days >= 4 && days <= 5;
  if (duration === "6+") return days >= 6;

  return true;
}

function getPackages(query) {
  const destination = (query.get("destination") || "").toLowerCase();
  const type = query.get("type") || "";
  const budget = query.get("budget") || "";
  const duration = query.get("duration") || "";
  const rating = Number(query.get("rating") || 0);

  return packages
    .filter((p) => p.destination.toLowerCase().includes(destination))
    .filter((p) => !type || p.type === type)
    .filter((p) => matchesBudget(p.pricePerPerson, budget))
    .filter((p) => matchesDuration(p.days, duration))
    .filter((p) => p.rating >= rating);
}

function sendResponse(res, status, data, delay = 500) {
  setTimeout(() => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  }, delay);
}

export function mockApiMiddleware(req, res, next) {
  if (!req.url.startsWith("/api/")) return next();

  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);

  if (req.method !== "GET") {
    return sendResponse(res, 405, {
      message: "Method not allowed",
    }, 0);
  }

  if (parts[1] !== "packages") {
    return sendResponse(res, 404, {
      message: "Endpoint not found",
    });
  }

  if (parts.length === 2) {
    return sendResponse(res, 200, getPackages(url.searchParams));
  }

  const id = Number(parts[2]);
  const packageData = packages.find((p) => p.id === id);

  if (!packageData) {
    return sendResponse(res, 404, {
      message: `Package ${parts[2]} was not found`,
    });
  }

  if (parts.length === 3) {
    return sendResponse(res, 200, packageData);
  }

  if (parts[3] === "availability") {
    const date = url.searchParams.get("date");

    if (date) {
      if (Number.isNaN(new Date(date).getTime())) {
        return sendResponse(res, 400, {
          message: "Invalid date",
        });
      }

      const seatsLeft = getSeats(id, date);

      return sendResponse(res, 200, {
        packageId: id,
        date,
        seatsTotal: TOTAL_SEATS,
        seatsLeft,
        available: seatsLeft > 0,
      });
    }

    return sendResponse(res, 200, {
      packageId: id,
      seatsTotal: TOTAL_SEATS,
      departures: getDepartures(id),
    });
  }

  if (parts[3] === "travel-info") {
    return sendResponse(res, 200, {
      packageId: id,
      ...travelInfo[id],
    });
  }

  return sendResponse(res, 404, {
    message: "Endpoint not found",
  });
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
