import { createContext, useContext } from "react";
import { usePackages } from "../hooks/usePackages.js";
import { useBookingCart } from "../hooks/useBookingCart.js";
import { useAuth } from "../hooks/useAuth.js";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const packages = usePackages();
  const booking = useBookingCart();
  const auth = useAuth();

  const value = {
    ...packages,
    ...booking,
    ...auth,
    selectPackage: booking.setCurrentPackage,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
