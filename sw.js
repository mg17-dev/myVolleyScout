const CACHE_NAME = 'myvolleyscout-v4';

// Elenco dei file che DEVONO essere disponibili offline.
// TUTTI path RELATIVI (senza slash iniziale) perché il sito è servito da /myVolleyScout/.
const PRECACHE = [
  './',
  'index.html',
  'partita.html',
  'manifest.json',
  'sw.js',
  // CSS
  'libs/bootstrap/css/bootstrap.min.css',
  // JS app (aggiorna i nomi se diversi)
  'app.js',
  'scoutPartita.js',
  'statistiche.js',
  // Librerie (usa i tuoi path reali)
  'libs/xlsx/xlsx.full.min.js',
  'libs/html2canvas.min.js'
  // Icone
  //'icons/icon-192.png',
  //'icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Se anche un solo file 404a, l'install fallisce e la cache resta vuota.
      await cache.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Navigazioni -> fallback a index.html quando offline
// Asset -> cache-first con runtime cache
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Navigazioni (click link, refresh)
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, net.clone());
        return net;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const shell = await cache.match('index.html', { ignoreSearch: true });
        return shell || Response.error();
      }
    })());
    return;
  }

  // Asset statici same-origin
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const net = await fetch(req);
      cache.put(req, net.clone());
      return net;
    } catch {
      // Offline e non in cache
      return Response.error();
    }
  })());
});
