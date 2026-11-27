const CACHE_NAME = 'bus-rush-party-v98';
const ASSETS = [
  '/',
  '/?play=1',
  '/index.html',
  '/styles.css',
  '/three.min.js',
  '/game.js',
  '/icon_192.png',
  '/icon_512.png',
  '/icon_3d_v4.png',
  '/loading_bg.jpg',
  '/great_job_banner.png',
  '/manifest.json',
  '/.well-known/assetlinks.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;

  // Navigation requests ALWAYS Network-First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then((c) => c.put(event.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // game.js, styles.css, index.html, manifest.json, and logo/loading art: ALWAYS Network-First so updates are instant
  if (
    url.pathname === '/game.js' ||
    url.pathname === '/styles.css' ||
    url.pathname === '/index.html' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/loading_bg.jpg' ||
    url.pathname === '/loading_logo_3d.png'
  ) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then((c) => c.put(event.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Other assets: Cache-First + Background Revalidation
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request, { ignoreSearch: true });

      const networkFetch = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            cache.put(event.request, res.clone()).catch(() => {});
          }
          return res;
        })
        .catch(() => null);

      if (cached) {
        return cached;
      }

      const fresh = await networkFetch;
      if (fresh) return fresh;

      return (
        (await cache.match('/index.html', { ignoreSearch: true })) ||
        new Response('Offline', { status: 503 })
      );
    })
  );
});




