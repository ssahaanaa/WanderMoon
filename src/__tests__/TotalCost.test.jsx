import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { calculatePricing, getCartTotals, getTripDuration } from "../utils/pricing.js";
import bookingReducer, {
  selectPackage,
  setTravelers,
  setTraveler,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  confirmBooking,
  selectPricing,
  selectCartTotals,
} from "../store/bookingSlice.js";
import BookingSummary from "../components/BookingSummary.jsx";
import BookingCart from "../components/BookingCart.jsx";
import { useBooking } from "../context/BookingContext.jsx";

jest.mock("../context/BookingContext.jsx", () => ({ useBooking: jest.fn() }));

const goa = { id: 1, title: "Goa Beach Getaway", destination: "Goa", days: 4, pricePerPerson: 8500 };
const manali = { id: 2, title: "Manali Mountain Escape", destination: "Manali", days: 5, pricePerPerson: 12000 };

describe("calculatePricing", () => {
  test("one traveler pays price plus 5% tax and gets no discount", () => {
    expect(calculatePricing(8500, 1)).toEqual({
      packageCost: 8500,
      discount: 0,
      tax: 425,
      finalCost: 8925,
    });
  });

  test("three travelers get no discount", () => {
    expect(calculatePricing(8500, 3)).toEqual({
      packageCost: 25500,
      discount: 0,
      tax: 1275,
      finalCost: 26775,
    });
  });

  test("four or more travelers get a 10% discount before tax", () => {
    expect(calculatePricing(8500, 4)).toEqual({
      packageCost: 34000,
      discount: 3400,
      tax: 1530,
      finalCost: 32130,
    });
  });

  test("zero or invalid travelers cost nothing", () => {
    const zero = { packageCost: 0, discount: 0, tax: 0, finalCost: 0 };
    expect(calculatePricing(8500, 0)).toEqual(zero);
    expect(calculatePricing(8500, "abc")).toEqual(zero);
    expect(calculatePricing(8500, -2)).toEqual(zero);
  });
});

describe("getTripDuration and getCartTotals", () => {
  test("uses the package length when no dates are chosen", () => {
    expect(getTripDuration({ start: "", end: "" }, goa)).toBe(4);
  });

  test("is 0 when there are no dates and no package", () => {
    expect(getTripDuration({ start: "", end: "" }, null)).toBe(0);
  });

  test("adds up every cart item", () => {
    const cart = [
      { travelers: 1, baseCost: 8500, discount: 0, tax: 425, cost: 8925 },
      { travelers: 4, baseCost: 48000, discount: 4800, tax: 2160, cost: 45360 },
    ];
    expect(getCartTotals(cart)).toEqual({
      totalTravelers: 5,
      totalBaseCost: 56500,
      totalDiscount: 4800,
      totalTax: 2585,
      totalBookingAmount: 54285,
    });
  });
});

describe("booking store totals", () => {
  function createStore() {
    return configureStore({ reducer: { booking: bookingReducer } });
  }

  function addPackage(store, pkg, travelers) {
    store.dispatch(selectPackage(pkg));
    store.dispatch(setTravelers(travelers));
    store.dispatch(addToCart());
  }

  test("selected package and traveler count give the live price", () => {
    const store = createStore();
    store.dispatch(selectPackage(goa));
    store.dispatch(setTravelers(4));
    expect(selectPricing(store.getState()).finalCost).toBe(32130);
  });

  test("price is 0 when no package is selected", () => {
    const store = createStore();
    expect(selectPricing(store.getState()).finalCost).toBe(0);
  });

  test("adding to the cart stores the calculated cost", () => {
    const store = createStore();
    addPackage(store, goa, 2);
    const [item] = store.getState().booking.cart;
    expect(item).toMatchObject({ title: "Goa Beach Getaway", travelers: 2, baseCost: 17000, cost: 17850 });
  });

  test("adding to the cart does nothing without a selected package", () => {
    const store = createStore();
    store.dispatch(addToCart());
    expect(store.getState().booking.cart).toHaveLength(0);
  });

  test("cart totals add up several packages", () => {
    const store = createStore();
    addPackage(store, goa, 1);
    addPackage(store, manali, 2);
    expect(selectCartTotals(store.getState())).toMatchObject({
      totalTravelers: 3,
      totalBaseCost: 32500,
      totalTax: 1625,
      totalBookingAmount: 34125,
    });
  });

  test("changing the travelers of a cart item recalculates its cost", () => {
    const store = createStore();
    addPackage(store, goa, 2);
    const { cartId } = store.getState().booking.cart[0];
    store.dispatch(updateCartItem({ cartId, travelers: 4 }));
    expect(store.getState().booking.cart[0]).toMatchObject({ travelers: 4, discount: 3400, cost: 32130 });
  });

  test("removing an item and clearing the cart update the total", () => {
    const store = createStore();
    addPackage(store, goa, 1);
    addPackage(store, manali, 2);
    const { cartId } = store.getState().booking.cart[0];
    store.dispatch(removeFromCart(cartId));
    expect(selectCartTotals(store.getState()).totalBookingAmount).toBe(25200);
    store.dispatch(clearCart());
    expect(selectCartTotals(store.getState()).totalBookingAmount).toBe(0);
  });

  test("confirming a booking saves the total and empties the cart", () => {
    const store = createStore();
    const traveler = { name: "Asha Rao", email: "asha@example.com", phone: "9876543210" };
    store.dispatch(setTraveler(traveler));
    addPackage(store, goa, 2);
    store.dispatch(confirmBooking());
    const state = store.getState().booking;
    expect(state.cart).toHaveLength(0);
    expect(state.booking).toMatchObject({ traveler, totalAmount: 17850 });
    expect(state.bookings).toHaveLength(1);
  });
});

describe("BookingSummary", () => {
  function renderSummary(travelers) {
    useBooking.mockReturnValue({
      currentPackage: goa,
      travelDates: { start: "2026-12-01", end: "2026-12-04" },
      travelers,
      traveler: { name: "Asha Rao" },
      tripDuration: 4,
      ...calculatePricing(goa.pricePerPerson, travelers),
    });
    render(
      <MemoryRouter>
        <BookingSummary />
      </MemoryRouter>
    );
  }

  test("shows the discount, tax and final total for 4 travelers", () => {
    renderSummary(4);
    expect(screen.getByText("Package Cost: ₹34000")).toBeInTheDocument();
    expect(screen.getByText("Discount: -₹3400")).toBeInTheDocument();
    expect(screen.getByText("Taxes: ₹1530")).toBeInTheDocument();
    expect(screen.getByText("Total: ₹32130")).toBeInTheDocument();
  });

  test("hides the discount line for fewer than 4 travelers", () => {
    renderSummary(2);
    expect(screen.queryByText(/Discount/)).not.toBeInTheDocument();
    expect(screen.getByText("Total: ₹17850")).toBeInTheDocument();
  });
});

describe("BookingCart", () => {
  const removeFromCartFn = jest.fn();
  const updateCartItemFn = jest.fn();
  const clearCartFn = jest.fn();

  const cart = [
    { cartId: "c1", title: "Goa Beach Getaway", travelers: 2, days: 4, cost: 17850 },
    { cartId: "c2", title: "Manali Mountain Escape", travelers: 1, days: 5, cost: 12600 },
  ];

  function setup(items) {
    useBooking.mockReturnValue({
      cart: items,
      totalBaseCost: 29000,
      totalDiscount: 0,
      totalTax: 1450,
      totalBookingAmount: 30450,
      removeFromCart: removeFromCartFn,
      updateCartItem: updateCartItemFn,
      clearCart: clearCartFn,
    });
    render(<BookingCart />);
  }

  beforeEach(() => jest.clearAllMocks());

  test("shows a message when the cart is empty", () => {
    setup([]);
    expect(screen.getByText("Your booking cart is empty.")).toBeInTheDocument();
  });

  test("shows each item and the cart total", () => {
    setup(cart);
    expect(screen.getByText(/Goa Beach Getaway \(2 traveler\(s\), 4 days\)/)).toBeInTheDocument();
    expect(screen.getByText("₹17850")).toBeInTheDocument();
    expect(screen.getByText("Package Cost: ₹29000")).toBeInTheDocument();
    expect(screen.getByText("Taxes: ₹1450")).toBeInTheDocument();
    expect(screen.getByText("Total: ₹30450")).toBeInTheDocument();
  });

  test("changing travelers updates the cart item", () => {
    setup(cart);
    fireEvent.change(screen.getByLabelText("Travelers for Goa Beach Getaway"), { target: { value: "3" } });
    expect(updateCartItemFn).toHaveBeenCalledWith("c1", 3);
  });

  test("ignores a traveler count below 1", () => {
    setup(cart);
    fireEvent.change(screen.getByLabelText("Travelers for Goa Beach Getaway"), { target: { value: "0" } });
    expect(updateCartItemFn).not.toHaveBeenCalled();
  });

  test("Remove and Clear Cart call the cart actions", async () => {
    setup(cart);
    await userEvent.click(screen.getAllByRole("button", { name: "Remove" })[1]);
    expect(removeFromCartFn).toHaveBeenCalledWith("c2");
    await userEvent.click(screen.getByRole("button", { name: "Clear Cart" }));
    expect(clearCartFn).toHaveBeenCalled();
  });
});
