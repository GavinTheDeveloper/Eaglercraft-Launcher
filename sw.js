    const ASSETS_TO_CACHE = [
      '/',
      '/index.html',
      '/styles/main.css',
      '/scripts/app.js',
      '/images/logo.png'
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open('my-cache-v1')
          .then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
          })
          .catch((error) => {
            console.error('Service Worker installation failed:', error);
          })
      );
    });
    