const CACHE_NAME = "occupant-users-v1";
const PWA_ROUTES = [
  "/master/user/occupant-users",
  "/master/user/occupant-users/view",
];

// Check if the request is for a PWA route
const isPWARoute = (url) => {
  return PWA_ROUTES.some((route) => url.pathname.includes(route));
};

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache
        .addAll([
          "/master/user/occupant-users",
          "/index.html",
          "/manifest.json",
        ])
        .catch((err) => {
          console.log("Cache addAll error:", err);
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

// Fetch event - serve from cache for PWA routes, network otherwise
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only apply PWA caching for specific routes
  if (isPWARoute(url)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // Return a custom offline page if available
            return caches.match("/index.html");
          });
      })
    );
  } else {
    // For non-PWA routes, just fetch from network
    event.respondWith(fetch(event.request));
  }
});
