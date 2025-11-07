// sw.js

// Change this whenever you deploy to force an update
const CACHE_NAME = 'gavmc-cache-v1';

// Add anything you know you always want available
const PRECACHE_URLS = [
  '/',               // https://gavmc.com/
  // '/styles.css',
  // '/script.js',
  // '/images/logo.png',
];

// Install: pre-cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Activate immediately once installed
  self.skipWaiting();
});

// Activate: clear out old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: try cache first, fall back to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Serve from cache if we have it
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network and cache it for next time
      return fetch(event.request).then(networkResponse => {
        // Skip opaque or invalid responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      }).catch(() => {
        // Optional: return a fallback page/asset here
      });
    })
  );
});