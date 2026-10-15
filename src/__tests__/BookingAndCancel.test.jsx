import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookingCard from "../components/BookingCard.jsx";
import Bookings from "../components/Bookings.jsx";
import Checkout from "../components/Checkout.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { useBookingHistory } from "../hooks/useBookingHistory.js";
import { createBooking } from "../api/bookingsApi.js";

jest.mock("../context/BookingContext.jsx", () => ({ useBooking: jest.fn() }));
jest.mock("../hooks/useBookingHistory.js", () => ({ useBookingHistory: jest.fn() }));
jest.mock("../api/bookingsApi.js", () => ({ createBooking: jest.fn() }));
jest.mock("../api/client.js", () => ({ getErrorMessage: (err) => err.message }));

const traveler = { name: "Asha Rao", email: "asha@example.com", phone: "9876543210" };

const booking = {
  id: "BK1",
  createdAt: "2026-10-01T10:00:00Z",
  traveler,
  items: [{ cartId: "c1", title: "Goa Beach Getaway", travelers: 2, days: 4, cost: 17850 }],
  totalAmount: 17850,
};

describe("BookingCard", () => {
  const onEdit = jest.fn();
  const onCancel = jest.fn();

  function renderCard() {
    render(<BookingCard booking={booking} onEdit={onEdit} onCancel={onCancel} />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    onEdit.mockResolvedValue();
    onCancel.mockResolvedValue();
    window.confirm = jest.fn(() => true);
  });

  test("shows the booking details", () => {
    renderCard();
    expect(screen.getByText("Booking ID: BK1")).toBeInTheDocument();
    expect(screen.getByText("Traveler: Asha Rao")).toBeInTheDocument();
    expect(screen.getByText(/Goa Beach Getaway - 2 traveler\(s\), 4 days, ₹17850/)).toBeInTheDocument();
    expect(screen.getByText("Total Paid: ₹17850")).toBeInTheDocument();
  });

  test("cancels the booking after the user confirms", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Cancel Booking" }));
    expect(window.confirm).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledWith("BK1");
  });

  test("does not cancel when the user declines the confirmation", async () => {
    window.confirm = jest.fn(() => false);
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Cancel Booking" }));
    expect(onCancel).not.toHaveBeenCalled();
  });

  test("shows an error when cancelling fails", async () => {
    onCancel.mockRejectedValue(new Error("Could not cancel"));
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Cancel Booking" }));
    expect(await screen.findByText("Could not cancel")).toBeInTheDocument();
  });

  test("edits the traveler name and saves it", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Edit Details" }));
    const nameInput = screen.getByDisplayValue("Asha Rao");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Ravi Kumar");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onEdit).toHaveBeenCalledWith("BK1", { ...traveler, name: "Ravi Kumar" });
  });

  test("disables Save when the phone number is invalid", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Edit Details" }));
    const phoneInput = screen.getByDisplayValue("9876543210");
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, "123");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});

describe("Bookings page", () => {
  const removeBooking = jest.fn();

  function setup(history) {
    useBookingHistory.mockReturnValue({
      bookings: [],
      loading: false,
      error: "",
      retry: jest.fn(),
      editBooking: jest.fn(),
      removeBooking,
      ...history,
    });
    render(
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  test("shows a loader while bookings load", () => {
    setup({ loading: true });
    expect(screen.getByText("Loading your bookings...")).toBeInTheDocument();
  });

  test("shows a message when there are no bookings", () => {
    setup({});
    expect(screen.getByText("You have no bookings yet.")).toBeInTheDocument();
  });

  test("lists bookings and cancels one", async () => {
    setup({ bookings: [booking] });
    expect(screen.getByText("Booking ID: BK1")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel Booking" }));
    expect(removeBooking).toHaveBeenCalledWith("BK1");
  });
});

describe("Checkout (confirm booking)", () => {
  const clearCart = jest.fn();
  const cart = [{ cartId: "c1", title: "Goa Beach Getaway", travelers: 2, days: 4, cost: 17850 }];

  function setup(overrides = {}) {
    useBooking.mockReturnValue({
      cart,
      traveler,
      totalBookingAmount: 17850,
      clearCart,
      updateTraveler: jest.fn(),
      ...overrides,
    });
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );
  }

  beforeEach(() => jest.clearAllMocks());

  test("shows an empty message when the cart is empty", () => {
    setup({ cart: [] });
    expect(screen.getByText("Your booking cart is empty.")).toBeInTheDocument();
  });

  test("disables Confirm Booking when traveler details are invalid", () => {
    setup({ traveler: { name: "", email: "", phone: "" } });
    expect(screen.getByRole("button", { name: "Confirm Booking" })).toBeDisabled();
  });

  test("creates the booking, clears the cart and shows the confirmation", async () => {
    createBooking.mockResolvedValue({ id: "BK9", traveler, totalAmount: 17850 });
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Confirm Booking" }));
    expect(createBooking).toHaveBeenCalledWith({ traveler, items: cart, totalAmount: 17850 });
    expect(clearCart).toHaveBeenCalled();
    expect(await screen.findByText("Booking Confirmed!")).toBeInTheDocument();
    expect(screen.getByText("Booking ID: BK9")).toBeInTheDocument();
  });

  test("shows an error and keeps the cart when booking fails", async () => {
    createBooking.mockRejectedValue(new Error("Payment server down"));
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Confirm Booking" }));
    expect(await screen.findByText("Payment server down")).toBeInTheDocument();
    expect(clearCart).not.toHaveBeenCalled();
  });
});
