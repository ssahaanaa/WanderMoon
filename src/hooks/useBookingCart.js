import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
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
  selectPricing,
  selectTripDuration,
  selectCartTotals,
} from "../store/bookingSlice.js";

export function useBookingCart() {
  const dispatch = useDispatch();
  const { currentPackage, travelDates, travelers, traveler, cart, booking, bookings } =
    useSelector((state) => state.booking);
  const { packageCost, discount, tax, finalCost } = useSelector(selectPricing);
  const tripDuration = useSelector(selectTripDuration);
  const { totalTravelers, totalBaseCost, totalDiscount, totalTax, totalBookingAmount } =
    useSelector(selectCartTotals);

  const actions = useMemo(
    () => ({
      setCurrentPackage: (pkg) => dispatch(selectPackage(pkg)),
      updateTravelDates: (dates) => dispatch(setTravelDates(dates)),
      updateTravelers: (count) => dispatch(setTravelers(count)),
      updateTraveler: (details) => dispatch(setTraveler(details)),
      resetBookingForm: () => dispatch(resetBookingForm()),
      addToCart: () => dispatch(addToCart()),
      removeFromCart: (cartId) => dispatch(removeFromCart(cartId)),
      updateCartItem: (cartId, count) => dispatch(updateCartItem({ cartId, travelers: count })),
      clearCart: () => dispatch(clearCart()),
      confirmBooking: () => dispatch(confirmBooking()),
    }),
    [dispatch]
  );

  return {
    currentPackage,
    travelDates,
    travelers,
    cart,
    traveler,
    booking,
    bookings,
    tripDuration,
    numberOfTravelers: travelers,
    packageCost,
    discount,
    tax,
    finalCost,
    totalTravelers,
    totalBaseCost,
    totalDiscount,
    totalTax,
    totalBookingAmount,
    ...actions,
  };
}
