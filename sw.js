// SportTrack Pro — Service Worker v1.0
const CACHE_NAME = 'sporttrack-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Installazione: mette in cache i file principali
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('[SW] Cache install parziale:', err);
      });
    })
  );
  self.skipWaiting();
});

// Attivazione: rimuove vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: strategia Network First con fallback Cache
self.addEventListener('fetch', event => {
  // Ignora richieste non-GET e richieste cross-origin (es. Supabase API)
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Aggiorna la cache con la risposta fresca
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline: serve dalla cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Fallback finale: index.html per navigazione
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
