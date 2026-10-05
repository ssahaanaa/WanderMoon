# Travel Booking App

React app for the travel booking project. Experiment 1 adds REST API integration using Axios, Fetch and async/await. Routing is done with react-router-dom.

## Run it

```
npm install
npm run dev
```

Then open the printed localhost URL. The REST API runs inside the Vite dev server, so no separate backend is needed.

## REST API (server/mockApi.js)

- `GET /api/packages?destination=&type=&budget=&duration=&rating=` - list and filter packages
- `GET /api/packages/:id` - single package details
- `GET /api/packages/:id/availability` - upcoming departures with seats left
- `GET /api/packages/:id/availability?date=YYYY-MM-DD` - seats left for one date
- `GET /api/packages/:id/travel-info` - best time, weather, airport, railway, tips

## Experiment 1 mapping

- a) Packages fetched with Axios in `src/api/packagesApi.js` via `usePackages`
- b) Destination, type, budget, duration and rating filters sent as query params (search is debounced)
- c) `PackageDetail` fetches `/api/packages/:id` through `usePackageDetail`
- d) Availability and travel info fetched with Fetch; the booking steps also check seats for the chosen date
- e) All requests use async/await with request cancellation on change
- f) `Loader` and `ErrorMessage` (with retry) components show loading and error states

## Structure

- `server/` - mock REST API middleware
- `src/api/` - Axios client and API functions
- `src/hooks/` - usePackages, usePackageDetail, useAvailability, useBookingCart, useAuth
- `src/components/` - UI components and booking steps
- `src/context/` - BookingContext
