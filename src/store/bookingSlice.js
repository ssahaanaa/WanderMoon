import { createSlice, createSelector, nanoid } from "@reduxjs/toolkit";
import { calculatePricing, getTripDuration, getCartTotals } from "../utils/pricing.js";
import { readStorage, CART_KEY, DATES_KEY, TRAVELERS_KEY } from "./storage.js";

const emptyTraveler = { name: "", email: "", phone: "" };
const emptyDates = { start: "", end: "" };

const initialState = {
  currentPackage: null,
  travelDates: readStorage(DATES_KEY, emptyDates),
  travelers: readStorage(TRAVELERS_KEY, 1),
  traveler: emptyTraveler,
  cart: readStorage(CART_KEY, []),
  booking: null,
  bookings: [],
};

function normalizeCount(count) {
  return Math.max(1, Math.floor(Number(count) || 1));
}

function buildCartItem(pkg, travelers, days, cartId) {
  const pricing = calculatePricing(pkg.pricePerPerson, travelers);

  return {
    cartId,
    packageId: pkg.id,
    title: pkg.title,
    pricePerPerson: pkg.pricePerPerson,
    travelers,
    days,
    baseCost: pricing.packageCost,
    discount: pricing.discount,
    tax: pricing.tax,
    cost: pricing.finalCost,
  };
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    selectPackage(state, action) {
      state.currentPackage = action.payload;
    },
    setTravelDates(state, action) {
      state.travelDates = action.payload;
    },
    setTravelers(state, action) {
      state.travelers = normalizeCount(action.payload);
    },
    setTraveler(state, action) {
      state.traveler = action.payload;
    },
    resetBookingForm(state) {
      state.travelDates = emptyDates;
      state.travelers = 1;
    },
    addToCart: {
      reducer(state, action) {
        if (!state.currentPackage) return;

        const days = getTripDuration(state.travelDates, state.currentPackage);
        state.cart.push(
          buildCartItem(state.currentPackage, state.travelers, days, action.payload.cartId)
        );
      },
      prepare() {
        return { payload: { cartId: nanoid() } };
      },
    },
    removeFromCart(state, action) {
      state.cart = state.cart.filter((item) => item.cartId !== action.payload);
    },
    updateCartItem(state, action) {
      const { cartId, travelers } = action.payload;
      const index = state.cart.findIndex((item) => item.cartId === cartId);
      if (index === -1) return;

      const item = state.cart[index];
      state.cart[index] = buildCartItem(
        { id: item.packageId, title: item.title, pricePerPerson: item.pricePerPerson },
        normalizeCount(travelers),
        item.days,
        item.cartId
      );
    },
    clearCart(state) {
      state.cart = [];
    },
    confirmBooking: {
      reducer(state, action) {
        const totals = getCartTotals(state.cart);
        const newBooking = {
          id: action.payload.id,
          traveler: state.traveler,
          items: state.cart,
          totalAmount: totals.totalBookingAmount,
          totalDiscount: totals.totalDiscount,
          totalTax: totals.totalTax,
        };

        state.booking = newBooking;
        state.bookings.push(newBooking);
        state.cart = [];
      },
      prepare() {
        return { payload: { id: "BK" + Date.now() } };
      },
    },
  },
});

export const {
  selectPackage,
  setTravelDates,
  setTravelers,
  setTraveler,
  resetBookingForm,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  confirmBooking,
} = bookingSlice.actions;

const selectBooking = (state) => state.booking;

export const selectPricing = createSelector(
  [(state) => selectBooking(state).currentPackage, (state) => selectBooking(state).travelers],
  (currentPackage, travelers) =>
    calculatePricing(currentPackage ? currentPackage.pricePerPerson : 0, travelers)
);

export const selectTripDuration = createSelector(
  [(state) => selectBooking(state).travelDates, (state) => selectBooking(state).currentPackage],
  (travelDates, currentPackage) => getTripDuration(travelDates, currentPackage)
);

export const selectCartTotals = createSelector(
  [(state) => selectBooking(state).cart],
  (cart) => getCartTotals(cart)
);

export default bookingSlice.reducer;
