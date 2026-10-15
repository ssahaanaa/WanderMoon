import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PackageDetail from "../components/PackageDetail.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { usePackageDetail } from "../hooks/usePackageDetail.js";

jest.mock("../context/BookingContext.jsx", () => ({ useBooking: jest.fn() }));
jest.mock("../hooks/usePackageDetail.js", () => ({ usePackageDetail: jest.fn() }));

const pkg = {
  id: 1,
  title: "Goa Beach Getaway",
  type: "Beach",
  description: "Relax on sandy beaches.",
  days: 4,
  rating: 4.5,
  pricePerPerson: 8500,
  itinerary: ["Day 1: Arrival", "Day 2: Water sports"],
  inclusions: ["Hotel stay"],
  exclusions: ["Flights"],
};

const availability = {
  departures: [
    { date: "2026-12-01", seatsLeft: 10 },
    { date: "2026-12-08", seatsLeft: 0 },
  ],
};

const travelInfo = {
  bestTime: "November to February",
  weather: "Warm and humid",
  nearestAirport: "Dabolim",
  nearestRailway: "Madgaon",
  languages: ["Konkani", "English"],
  tips: ["Carry sunscreen"],
};

const detail = {
  pkg,
  loading: false,
  error: "",
  availability,
  travelInfo,
  extrasLoading: false,
  extrasError: "",
  reload: jest.fn(),
};

const booking = {
  setCurrentPackage: jest.fn(),
  resetBookingForm: jest.fn(),
  addToCart: jest.fn(),
};

function renderDetail() {
  render(
    <MemoryRouter initialEntries={["/package/1"]}>
      <Routes>
        <Route path="/package/:id" element={<PackageDetail />} />
        <Route path="/booking/dates" element={<p>Dates page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
  useBooking.mockReturnValue(booking);
  usePackageDetail.mockReturnValue(detail);
});

test("shows package information, itinerary, inclusions and exclusions", () => {
  renderDetail();
  expect(screen.getByRole("heading", { name: "Goa Beach Getaway" })).toBeInTheDocument();
  expect(screen.getByText("Relax on sandy beaches.")).toBeInTheDocument();
  expect(screen.getByText("Duration: 4 days")).toBeInTheDocument();
  expect(screen.getByText("₹8500 / person")).toBeInTheDocument();
  expect(screen.getByText("Day 2: Water sports")).toBeInTheDocument();
  expect(screen.getByText("Hotel stay")).toBeInTheDocument();
  expect(screen.getByText("Flights")).toBeInTheDocument();
});

test("shows availability and travel information", () => {
  renderDetail();
  expect(screen.getByText("10 seats left")).toBeInTheDocument();
  expect(screen.getByText("Sold out")).toBeInTheDocument();
  expect(screen.getByText("November to February")).toBeInTheDocument();
  expect(screen.getByText("Konkani, English")).toBeInTheDocument();
});

test("shows a loader while the package is loading", () => {
  usePackageDetail.mockReturnValue({ ...detail, pkg: null, loading: true });
  renderDetail();
  expect(screen.getByText("Loading package details...")).toBeInTheDocument();
});

test("shows an error with a retry button", async () => {
  usePackageDetail.mockReturnValue({ ...detail, pkg: null, error: "Server down" });
  renderDetail();
  expect(screen.getByText("Server down")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Try Again" }));
  expect(detail.reload).toHaveBeenCalled();
});

test("shows a message when the package is not found", () => {
  usePackageDetail.mockReturnValue({ ...detail, pkg: null });
  renderDetail();
  expect(screen.getByText("Package not found.")).toBeInTheDocument();
});

test("Add to Cart adds the package and shows a confirmation", async () => {
  renderDetail();
  await userEvent.click(screen.getByRole("button", { name: "Add to Cart" }));
  expect(booking.addToCart).toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith("Goa Beach Getaway added to cart!");
});

test("Book This Trip resets the form and opens the dates step", async () => {
  renderDetail();
  await userEvent.click(screen.getByRole("button", { name: "Book This Trip" }));
  expect(booking.resetBookingForm).toHaveBeenCalled();
  expect(screen.getByText("Dates page")).toBeInTheDocument();
});
