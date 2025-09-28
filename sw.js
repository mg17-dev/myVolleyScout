const CACHE_NAME = 'myscout-v1';
const PRECACHE = [
  './',
  './index.html',
  './partita.html',
  './libs/bootstrap/css/bootstrap.min.css',
  './libs/xlsx/xlsx.full.min.js',
  './libs/html2canvas.min.js',          // aggiorna il path se diverso
  './app.js',
  './scoutPartita.js',
  './statistiche.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// INSTALL: precache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ACTIVATE: pulizia vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// FETCH: cache-first per asset locali
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method === 'GET' && url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) =>
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, res.clone());
              return res;
            })
          )
          .catch(() => cached);
      })
    );
  }
});
