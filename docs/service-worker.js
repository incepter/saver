const CACHE_NAME = 'saver-sw-cache-v0-1-6'; // Update version to force refresh on app update

// Service worker install event: Pre-cache assets (optional; could skip this)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Skip manual asset definition; just enable service worker lifecycle
      console.log('Service Worker installed!');
    })
  );
  self.skipWaiting(); // Activate service worker immediately
});

// Intercept fetch requests and cache dynamically
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available, fetch otherwise
      return (
        cachedResponse ||
        fetch(event.request).then((networkResponse) => {
          // Dynamically cache the newly fetched resource
          return caches.open(CACHE_NAME).then((cache) => {
            // Exclude non-GET requests and certain URLs (like API calls)
            if (event.request.method === 'GET' && !event.request.url.includes('/api/')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
      );
    })
  );
});

// Remove old caches during service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Ensure active immediately without page reloads
});
