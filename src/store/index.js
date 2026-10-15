import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./bookingSlice.js";
import activityReducer from "./activitySlice.js";
import { bookingMonitor } from "./middleware.js";
import { saveStorage, CART_KEY, DATES_KEY, TRAVELERS_KEY } from "./storage.js";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(bookingMonitor),
});

let previous = store.getState().booking;

store.subscribe(() => {
  const current = store.getState().booking;

  if (current.cart !== previous.cart) saveStorage(CART_KEY, current.cart);
  if (current.travelDates !== previous.travelDates) saveStorage(DATES_KEY, current.travelDates);
  if (current.travelers !== previous.travelers) saveStorage(TRAVELERS_KEY, current.travelers);

  previous = current;
});
