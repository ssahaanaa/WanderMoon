# Travel Booking App

React app for the travel booking project. Experiment 1 adds REST API integration using Axios, Fetch and async/await. Experiment 2 adds global booking state management with Redux Toolkit, Zustand, middleware and caching. Experiment 3 adds full CRUD for bookings (GET, POST, PUT, DELETE). Experiment 4 adds login with tokens and protected booking, payment and booking-history requests. Testing Experiment 1 adds component tests with Jest and React Testing Library. Unit 5 Experiment 2 optimizes the app (lazy loading, code splitting, PWA, accessibility, security). Unit 5 Experiment 3 deploys the app (GitHub Pages, Netlify, Vercel). Routing is done with react-router-dom.

## Run it

```
npm install
npm run dev
```

Then open the printed localhost URL. For the deployed version see `DEPLOYMENT.md`. The REST API runs inside the Vite dev server, so no separate backend is needed.

## REST API (server/mockApi.js)

- `GET /api/packages?destination=&type=&budget=&duration=&rating=` - list and filter packages
- `GET /api/packages/:id` - single package details
- `GET /api/packages/:id/availability` - upcoming departures with seats left
- `GET /api/packages/:id/availability?date=YYYY-MM-DD` - seats left for one date
- `GET /api/packages/:id/travel-info` - best time, weather, airport, railway, tips

- `GET /api/bookings` - booking history (login needed)
- `POST /api/bookings` - create a booking (login needed)
- `PUT /api/bookings/:id` (or `PATCH`) - update traveler details (login needed)
- `DELETE /api/bookings/:id` - cancel a booking (login needed)
- `POST /api/payments` - pay for a booking (login needed)
- `POST /api/auth/signup` - create an account
- `POST /api/auth/login` - returns a token
- `POST /api/auth/logout` - the token stops working (login needed)
- `GET /api/auth/me` - checks the saved token still works (login needed)

Packages stay public. Everything marked "login needed" must send `Authorization: Bearer <token>`.
A traveler can only see, edit and cancel their own bookings.

**Demo account:** `demo@wandermoon.com` / `demo123` (the server forgets signed-up users when it restarts, the demo user is always there).

Data is kept in memory on the dev server, so it resets when the server restarts.

## Experiment 1 mapping

- a) Packages fetched with Axios in `src/api/packagesApi.js` via `usePackages`
- b) Destination, type, budget, duration and rating filters sent as query params (search is debounced)
- c) `PackageDetail` fetches `/api/packages/:id` through `usePackageDetail`
- d) Availability and travel info fetched with Fetch; the booking steps also check seats for the chosen date
- e) All requests use async/await with request cancellation on change
- f) `Loader` and `ErrorMessage` (with retry) components show loading and error states

## Experiment 2 mapping

- a) Global booking store in `src/store/index.js` (Redux Toolkit `configureStore`, provided in `main.jsx`)
- b) `src/store/bookingSlice.js` holds the selected package, travel dates, travelers and the booking cart
- c) Add, remove, update (traveler count) and clear operations: `addToCart`, `removeFromCart`, `updateCartItem`, `clearCart` (used in `BookingCart`)
- d) `src/store/middleware.js` monitors every `booking/*` action, logs it to the console and to an activity list shown on the Cart page
- e) `src/store/packageCache.js` is a Zustand store (with `persist` middleware) that caches package lists, package details and travel info for 5 minutes; hits and misses are shown on the Packages page
- f) `src/utils/pricing.js` calculates package cost, discount (10% for 4 or more travelers), tax (5%) and the final amount

## Experiment 3 mapping

- a) GET packages: `fetchPackages` in `src/api/packagesApi.js` (Packages page)
- b) POST: `createBooking` in `src/api/bookingsApi.js`, called when you click Confirm Booking in `Checkout.jsx`
- c) PUT: `updateBooking`, used by the Edit Details button in `BookingCard.jsx`
- d) DELETE: `cancelBooking`, used by the Cancel Booking button in `BookingCard.jsx`
- e) GET: `getBookings`, used by the My Bookings page through `useBookingHistory`
- f) Loading and errors: `Loader` while waiting, `ErrorMessage` (with Try Again) on failure, buttons disabled while saving. All CRUD calls are in `src/api/bookingsApi.js`.

## Experiment 4 mapping

- a) Login: `login` in `src/hooks/useAuth.js` calls `POST /api/auth/login` (`loginRequest` in `src/api/authApi.js`). The server is `server/auth.js`.
- b) Store the token: `saveSession` in `src/api/token.js` keeps the token in localStorage, so a page refresh keeps you logged in.
- c) Attach the token: the request interceptor in `src/api/client.js` adds `Authorization: Bearer <token>` to every request.
- d) Protect: the server checks the token for `/api/bookings` and `/api/payments` (`checkToken` in `server/auth.js`). On the page side, `src/components/ProtectedRoute.jsx` guards booking, payment, cart, checkout and My Bookings pages.
- e) Logout: `logout` in `useAuth.js` calls `POST /api/auth/logout`, then `removeSession` deletes the token.
- f) Invalid or expired token: the server answers 401 with a message. The response interceptor in `client.js` removes the token and the user is sent to the login page, which shows the message. A token lasts 5 minutes (`TOKEN_LIFETIME` in `server/auth.js`, set it to `20 * 1000` to see "session expired" quickly, then restart `npm run dev`).

## Testing Experiment 1 mapping (Jest and React Testing Library)

Run all tests with `npm test`. Test files are in `src/__tests__/`; setup is in `jest.config.cjs`, `babel.config.cjs` and `jest.setup.js`.

- a) Package cards and details: `PackageCard.test.jsx`, `PackageDetail.test.jsx`
- b) Destination and budget filtering: `Filters.test.jsx` (`FilterPanel`, `SearchBar`, `PackageList`, and `usePackages` sending filters to the API)
- c) Traveler and date selection: `TravelerAndDates.test.jsx` (`BookingDates`, `BookingTravelers`, `TravelerForm` validation, seat limits)
- d) Booking and cancellation: `BookingAndCancel.test.jsx` (`Checkout` confirm booking, `BookingCard` edit and cancel, `Bookings` page)
- e) Total cost: `TotalCost.test.jsx` (`calculatePricing`, cart store totals, `BookingSummary`, `BookingCart`)
- f) Tools: Jest with `jest-environment-jsdom`, React Testing Library, `jest-dom` matchers and `user-event`. Context hooks and API calls are mocked with `jest.mock`.

## Unit 5 Experiment 2 mapping (Optimize the app)

Run `npm run build` then `npm run preview` to see the optimized app (the service worker and security policy only work in the built app).

- a) Lazy loading: pages are loaded with `React.lazy` + `Suspense` in `src/App.jsx` (package details, cart, checkout and all booking steps).
- b) Code splitting: every route is its own chunk (see `dist/assets` after build). `vite.config.js` also puts React, state libraries and Axios in separate cached files.
- c) API data: hovering or tabbing to a card calls `prefetchPackage` so the details are already cached. Package data is loaded first and availability/travel info after it, in parallel, with the 5-minute cache.
- d) PWA: `public/manifest.webmanifest`, icons in `public/icons`, `public/sw.js` (service worker) and `public/offline.html`, registered by `src/registerSW.js`. Pages and public package data are network-first, static files cache-first. Login, bookings and payments are never cached.
- e) Keyboard and accessibility: "Skip to main content" link, focus moves to the page after navigation, visible focus outline, labels linked to inputs (`htmlFor`/`id`), `aria-label` on navs and search, `role="alert"` on errors, `aria-live` seat availability, `aria-invalid` on wrong fields, cards use one link plus one button (no button inside a link), reduced-motion support.
- f) Security: token kept in `sessionStorage` (erased when the tab closes); user input cleaned in `src/utils/sanitize.js` before booking requests; ids are checked/encoded before going into URLs; personal data is hidden from console logs (`middleware.js`); `maxLength` and `autocomplete` on inputs; Axios sends no cookies and limits response size; security headers and a Content Security Policy in `vite.config.js`.

Tests: `src/__tests__/Optimize.test.jsx` (sanitize helpers).

## Unit 5 Experiment 3 mapping (Deployment)

Full steps, the verification checklist and the platform comparison are in `DEPLOYMENT.md`.

- a) Production build: `npm run build` (output in `dist/`), check it with `npm run preview`
- b) GitHub Pages: `.github/workflows/deploy.yml` (builds with `--base=/<repo-name>/`); `scripts/copy-404.js` makes refresh work on deep links
- c) Netlify: `netlify.toml` (build command, redirect rule, security headers)
- d) Vercel: `vercel.json` (rewrite rule, security headers)
- e) Verify: checklist in `DEPLOYMENT.md`, plus `src/__tests__/Deploy.test.js` for search and booking
- f) Compare: table in `DEPLOYMENT.md`

Deployed sites have no server, so in the production build the API runs inside the browser (`src/api/browserApi.js` calls `handleRequest` from `server/mockApi.js`). Bookings and accounts are cleared on refresh.

## Structure

- `scripts/` - `copy-404.js` (runs after the build)
- `server/` - mock REST API (`mockApi.js`) and login/token code (`auth.js`)
- `src/api/` - Axios client (with token interceptors), token storage, auth and booking API functions
- `src/hooks/` - usePackages, usePackageDetail, useAvailability, useBookingCart, useBookingHistory, useAuth
- `src/components/` - UI components and booking steps
- `src/context/` - BookingContext
- `src/store/` - Redux Toolkit store, booking and activity slices, monitoring middleware, Zustand package cache
- `src/utils/` - validation, pricing and sanitize helpers
- `public/` - PWA manifest, icons, service worker, offline page
- `src/__tests__/` - Jest and React Testing Library tests
