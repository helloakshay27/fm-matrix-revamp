const CACHE_NAME = "fm-admin-specific-v1";
const PWA_ROUTES = [
  "/login-page",
  "/ops-console/settings/account/user-list-otp",
  "/ops-console/settings/account/user-list-otp/detail",
];

// Assets to never cache (avoid cache issues)
const NEVER_CACHE = ["/api/", ".json", "/pms/", "/get_otps/", "logout"];

// Check if the request is for a PWA route
const isPWARoute = (url) => {
  return PWA_ROUTES.some((route) => url.pathname.includes(route));
};

// Check if URL should never be cached
const shouldNeverCache = (url) => {
  return NEVER_CACHE.some((pattern) => url.href.includes(pattern));
};

// Install event - clear old caches and cache only specific assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        // Delete all old caches
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        // Only cache the manifest
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(["/manifest.json"]).catch((err) => {
            console.log("Cache addAll error:", err);
          });
        });
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - network-first strategy, minimal caching
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache API calls and sensitive data
  if (shouldNeverCache(url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Only apply PWA behavior for specific routes
  if (isPWARoute(url)) {
    event.respondWith(
      // Always try network first
      fetch(event.request)
        .then((response) => {
          // Don't cache if not successful
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Only cache GET requests for static assets
          if (
            event.request.method === "GET" &&
            (url.pathname.endsWith(".js") ||
              url.pathname.endsWith(".css") ||
              url.pathname.endsWith(".png") ||
              url.pathname.endsWith(".jpg") ||
              url.pathname.endsWith(".svg"))
          ) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Only return cached response for static assets
          return caches.match(event.request);
        })
    );
  } else {
    // For non-PWA routes, always use network
    event.respondWith(fetch(event.request));
  }
});
