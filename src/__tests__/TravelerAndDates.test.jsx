import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BookingDates from "../components/BookingDates.jsx";
import BookingTravelers from "../components/BookingTravelers.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { useAvailability } from "../hooks/useAvailability.js";

jest.mock("../context/BookingContext.jsx", () => ({ useBooking: jest.fn() }));
jest.mock("../hooks/useAvailability.js", () => ({ useAvailability: jest.fn() }));

const pkg = { id: 1, title: "Goa Beach Getaway", days: 4, pricePerPerson: 8500 };
const validTraveler = { name: "Asha Rao", email: "asha@example.com", phone: "9876543210" };
const emptyTraveler = { name: "", email: "", phone: "" };

function availabilityResult(data) {
  return { data, loading: false, error: "" };
}

function renderAt(path, element) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={element} />
        <Route path="/booking/travelers" element={<p>Travelers page</p>} />
        <Route path="/booking/summary" element={<p>Summary page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("BookingDates", () => {
  const updateTravelDates = jest.fn();

  function setup(travelDates, availability = availabilityResult(null)) {
    useBooking.mockReturnValue({ currentPackage: pkg, travelDates, updateTravelDates });
    useAvailability.mockReturnValue(availability);
    renderAt("/booking/dates", <BookingDates />);
  }

  beforeEach(() => jest.clearAllMocks());

  test("asks the user to pick a package first when none is selected", () => {
    useBooking.mockReturnValue({ currentPackage: null, travelDates: { start: "", end: "" } });
    useAvailability.mockReturnValue(availabilityResult(null));
    renderAt("/booking/dates", <BookingDates />);
    expect(screen.getByText(/Please add a package to continue/)).toBeInTheDocument();
  });

  test("asks for a start date and disables Next until one is chosen", () => {
    setup({ start: "", end: "" });
    expect(screen.getByText("Please select a start date.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next: Traveler Details/ })).toBeDisabled();
  });

  test("choosing a start date sets the end date from the package length", () => {
    setup({ start: "", end: "" });
    const startInput = document.querySelector('input[type="date"]');
    fireEvent.change(startInput, { target: { value: "2026-12-01" } });
    expect(updateTravelDates).toHaveBeenCalledWith({ start: "2026-12-01", end: "2026-12-04" });
  });

  test("shows seats and enables Next when the date is available", async () => {
    setup(
      { start: "2026-12-01", end: "2026-12-04" },
      availabilityResult({ available: true, seatsLeft: 8, date: "2026-12-01" })
    );
    expect(screen.getByText("8 seat(s) available on 2026-12-01.")).toBeInTheDocument();
    const next = screen.getByRole("button", { name: /Next: Traveler Details/ });
    expect(next).toBeEnabled();
    await userEvent.click(next);
    expect(screen.getByText("Travelers page")).toBeInTheDocument();
  });

  test("blocks the next step when the date is sold out", () => {
    setup(
      { start: "2026-12-01", end: "2026-12-04" },
      availabilityResult({ available: false, seatsLeft: 0, date: "2026-12-01" })
    );
    expect(screen.getByText(/Sold out on 2026-12-01/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next: Traveler Details/ })).toBeDisabled();
  });
});

describe("BookingTravelers", () => {
  const updateTravelers = jest.fn();
  const updateTraveler = jest.fn();

  function setup({ travelers = 2, traveler = validTraveler, travelDates = { start: "", end: "" }, availability = availabilityResult(null) } = {}) {
    useBooking.mockReturnValue({
      currentPackage: pkg,
      travelDates,
      travelers,
      traveler,
      updateTravelers,
      updateTraveler,
    });
    useAvailability.mockReturnValue(availability);
    renderAt("/booking/travelers", <BookingTravelers />);
  }

  beforeEach(() => jest.clearAllMocks());

  test("changing the number of travelers calls updateTravelers", () => {
    setup();
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "3" } });
    expect(updateTravelers).toHaveBeenCalledWith(3);
  });

  test("typing a name updates the traveler details", () => {
    setup({ traveler: emptyTraveler });
    fireEvent.change(document.querySelector('input[type="text"]'), { target: { value: "Asha" } });
    expect(updateTraveler).toHaveBeenCalledWith({ ...emptyTraveler, name: "Asha" });
  });

  test("Next is disabled while the traveler details are empty", () => {
    setup({ traveler: emptyTraveler });
    expect(screen.getByRole("button", { name: /Next: Booking Summary/ })).toBeDisabled();
  });

  test("shows validation messages for a bad email and phone", () => {
    setup({ traveler: { name: "Asha Rao", email: "bad-email", phone: "123" } });
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid 10-digit phone number.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next: Booking Summary/ })).toBeDisabled();
  });

  test("Next opens the summary when the details are valid", async () => {
    setup();
    const next = screen.getByRole("button", { name: /Next: Booking Summary/ });
    expect(next).toBeEnabled();
    await userEvent.click(next);
    expect(screen.getByText("Summary page")).toBeInTheDocument();
  });

  test("blocks the next step when there are more travelers than seats left", () => {
    setup({
      travelers: 3,
      travelDates: { start: "2026-12-01", end: "2026-12-04" },
      availability: availabilityResult({ available: true, seatsLeft: 2, date: "2026-12-01" }),
    });
    expect(screen.getByText(/Only 2 seat\(s\) left on 2026-12-01/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next: Booking Summary/ })).toBeDisabled();
  });
});
