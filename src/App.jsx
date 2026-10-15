import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Loader from "./components/Loader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";

// Code splitting: each page below becomes its own small file (chunk).
// The browser downloads a chunk only when the user opens that page.
const Privacy = lazy(() => import("./components/Privacy.jsx"));
const Terms = lazy(() => import("./components/Terms.jsx"));
const Trips = lazy(() => import("./components/Trips.jsx"));
const PackageDetail = lazy(() => import("./components/PackageDetail.jsx"));
const Cart = lazy(() => import("./components/Cart.jsx"));
const Checkout = lazy(() => import("./components/Checkout.jsx"));
const Bookings = lazy(() => import("./components/Bookings.jsx"));
const Booking = lazy(() => import("./components/Booking.jsx"));
const BookingDates = lazy(() => import("./components/BookingDates.jsx"));
const BookingTravelers = lazy(() => import("./components/BookingTravelers.jsx"));
const BookingSummary = lazy(() => import("./components/BookingSummary.jsx"));
const BookingPayment = lazy(() => import("./components/BookingPayment.jsx"));

function App() {
  const mainRef = useRef(null);
  const firstRender = useRef(true);
  const { pathname } = useLocation();

  // Keyboard / screen reader users: after opening a new page, move focus
  // to the page content (skip the very first load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <BookingProvider>
      <div>
        <a className="skip-link" href="#main">Skip to main content</a>
        <Header />
        <main id="main" tabIndex={-1} ref={mainRef}>
          {/* Suspense shows the Loader while a lazy page is downloading */}
          <Suspense fallback={<Loader message="Loading page..." />}>
            <Routes>
              {/* Anyone can open these */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Only logged-in travelers can open these */}
              <Route element={<ProtectedRoute />}>
                <Route path="/packages" element={<Trips />} />
                <Route path="/package/:id" element={<PackageDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/booking" element={<Booking />}>
                  <Route index element={<Navigate to="dates" replace />} />
                  <Route path="dates" element={<BookingDates />} />
                  <Route path="travelers" element={<BookingTravelers />} />
                  <Route path="summary" element={<BookingSummary />} />
                  <Route path="payment" element={<BookingPayment />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}

export default App;
