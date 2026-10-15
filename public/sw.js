// WanderMoon service worker (makes the app installable and work offline).
// Rules, kept simple:
//  1. Pages (navigation)      -> network first, offline page if there is no internet
//  2. Public package data     -> network first, saved copy if offline
//  3. JS, CSS, fonts  -> cache first (fast repeat visits)
//  4. Login, bookings, payments, and every POST/PUT/DELETE -> NEVER cached (private data)

const CACHE = "wandermoon-v2";

// The site may live at "/" (Netlify, Vercel) or at "/repo-name/" (GitHub Pages).
// BASE is the folder this file sits in, so every path below works in both cases.
const BASE = new URL("./", self.location).pathname;
const SHELL = [BASE, BASE + "offline.html", BASE + "manifest.webmanifest", BASE + "icons/icon-192.png"];

// Only these API paths hold public data that is safe to keep
const PUBLIC_API = /\/api\/packages(\/|$)/;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // delete old caches from earlier versions
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

async function networkFirst(request, fallback) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  } catch {
    return (await caches.match(request)) || fallback();
  }
}

async function cacheFirst(request) {
  const saved = await caches.match(request);
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok) {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // SECURITY: only GET requests are ever handled
  if (request.method !== "GET") return;

  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith(BASE + "api/")) {
    // SECURITY: private API calls go straight to the network, nothing is stored
    if (PUBLIC_API.test(url.pathname)) {
      event.respondWith(networkFirst(request, () => Response.error()));
    }
    return;
  }

  if (request.mode === "navigate") {
    // offline: show the saved app shell (the React app), or the offline page
    event.respondWith(
      networkFirst(request, async () => (await caches.match(BASE)) || caches.match(BASE + "offline.html"))
    );
    return;
  }

  event.respondWith(cacheFirst(request).catch(() => Response.error()));
});
