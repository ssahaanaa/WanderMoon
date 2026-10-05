import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Trips from "./components/Trips.jsx";
import PackageDetail from "./components/PackageDetail.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Booking from "./components/Booking.jsx";
import BookingDates from "./components/BookingDates.jsx";
import BookingTravelers from "./components/BookingTravelers.jsx";
import BookingSummary from "./components/BookingSummary.jsx";
import BookingPayment from "./components/BookingPayment.jsx";
import Bookings from "./components/Bookings.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";

function App() {
  return (
    <BookingProvider>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Trips />} />
            <Route path="/package/:id" element={<PackageDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/booking" element={<Booking />}>
              <Route index element={<Navigate to="dates" replace />} />
              <Route path="dates" element={<BookingDates />} />
              <Route path="travelers" element={<BookingTravelers />} />
              <Route path="summary" element={<BookingSummary />} />
              <Route path="payment" element={<BookingPayment />} />
            </Route>

            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}

export default App;
