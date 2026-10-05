import { useEffect, useState } from "react";

const CART_KEY = "WanderMoon.cart";
const DATES_KEY = "WanderMoon.travelDates";
const TRAVELERS_KEY = "WanderMoon.travelers";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors.
  }
}

export function useBookingCart() {
  const [currentPackage, setCurrentPackage] = useState(null);
  const [travelDates, setTravelDates] = useState(() =>
    readStorage(DATES_KEY, { start: "", end: "" })
  );
  const [travelers, setTravelers] = useState(() => readStorage(TRAVELERS_KEY, 1));
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [traveler, setTraveler] = useState({ name: "", email: "", phone: "" });
  const [booking, setBooking] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => saveStorage(CART_KEY, cart), [cart]);
  useEffect(() => saveStorage(DATES_KEY, travelDates), [travelDates]);
  useEffect(() => saveStorage(TRAVELERS_KEY, travelers), [travelers]);

  const tripDuration = getTripDuration(travelDates, currentPackage);
  const numberOfTravelers = travelers;
  const packageCost = currentPackage ? currentPackage.pricePerPerson * travelers : 0;
  const discount = travelers >= 4 ? packageCost * 0.1 : 0;
  const tax = Math.round((packageCost - discount) * 0.05);
  const finalCost = packageCost - discount + tax;

  const totalTravelers = cart.reduce((sum, item) => sum + item.travelers, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
  const totalTax = cart.reduce((sum, item) => sum + item.tax, 0);
  const totalBookingAmount = cart.reduce((sum, item) => sum + item.cost, 0);

  function addToCart() {
    if (!currentPackage) return;

    const item = {
      cartId: Date.now(),
      packageId: currentPackage.id,
      title: currentPackage.title,
      travelers,
      days: tripDuration,
      baseCost: packageCost,
      discount,
      tax,
      cost: finalCost,
    };

    setCart((oldCart) => [...oldCart, item]);
  }

  function removeFromCart(cartId) {
    setCart((oldCart) => oldCart.filter((item) => item.cartId !== cartId));
  }

  function updateTravelDates(dates) {
    setTravelDates(dates);
  }

  function updateTravelers(count) {
    setTravelers(count);
  }

  function clearCart() {
    setCart([]);
  }

  function resetBookingForm() {
    setTravelDates({ start: "", end: "" });
    setTravelers(1);
  }

  function updateTraveler(details) {
    setTraveler(details);
  }

  function confirmBooking() {
    const newBooking = {
      id: "BK" + Date.now(),
      traveler,
      items: cart,
      totalAmount: totalBookingAmount,
      totalDiscount,
      totalTax,
    };

    setBooking(newBooking);
    setBookings((oldBookings) => [...oldBookings, newBooking]);
    clearCart();
  }

  return {
    currentPackage,
    setCurrentPackage,
    travelDates,
    travelers,
    cart,
    traveler,
    booking,
    bookings,
    tripDuration,
    numberOfTravelers,
    packageCost,
    discount,
    tax,
    finalCost,
    totalTravelers,
    totalDiscount,
    totalTax,
    totalBookingAmount,
    addToCart,
    removeFromCart,
    updateTravelDates,
    updateTravelers,
    clearCart,
    resetBookingForm,
    updateTraveler,
    confirmBooking,
  };
}

function getTripDuration(dates, pkg) {
  if (!dates.start || !dates.end) return pkg ? pkg.days : 0;

  const start = new Date(dates.start);
  const end = new Date(dates.end);
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24));

  return days > 0 ? days : pkg ? pkg.days : 0;
}
