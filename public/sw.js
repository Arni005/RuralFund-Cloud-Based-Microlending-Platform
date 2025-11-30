/* public/sw.js
   Workbox runtime + backgroundSync approach (served from root)
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (!workbox) {
  console.log('Workbox failed to load');
} else {
  // Precaching (optional): use manifest injected by build tools, but fallback to nothing
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // NetworkFirst for navigation (so app shell updates when online)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 })
      ]
    })
  );

  // Runtime cache for JS/CSS assets - StaleWhileRevalidate
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'assets-cache-v1'
    })
  );

  // Images cache - CacheFirst with expiration
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })
      ]
    })
  );

  // API GET responses - NetworkFirst (try network, fallback to cache)
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 100 })
      ]
    })
  );

  // Background sync plugin: queue POST to createLoan endpoint
  const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('loanQueue', {
    maxRetentionTime: 24 * 60 // minutes
  });

  workbox.routing.registerRoute(
    ({ url, request }) => url.pathname.endsWith('/createLoan') && request.method === 'POST',
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
  );

  // Optional: listen to sync events and notify client
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-loans') {
      console.log('Background sync triggered for loans');
      event.waitUntil(
        // We'll handle this from the client side
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_PENDING_LOANS'
            });
          });
        })
      );
    }
  });
}
