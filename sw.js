/* Service worker: offline-first for the study guide. Bump VERSION on every content change. */
const VERSION = 'v1.0.0';
const PRECACHE = 'bsg-precache-' + VERSION;
const RUNTIME = 'bsg-runtime-' + VERSION;

const ASSETS = [
  './',
  'index.html',
  'offline.html',
  '404.html',
  'privacy.html',
  'terms.html',
  'style.css',
  'app.js',
  'manifest.webmanifest',
  'favicon.ico',
  'apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-192.png',
  'icons/icon-maskable-512.png',
  'icons/favicon-16x16.png',
  'icons/favicon-32x32.png',
  'icons/favicon-48x48.png',
  'data/ch01.json', 'data/ch02.json', 'data/ch03.json', 'data/ch04.json',
  'data/ch05.json', 'data/ch06.json', 'data/ch07.json', 'data/ch08.json',
  'data/ch09.json', 'data/ch10.json', 'data/quiz.json', 'data/glossary.json'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    // Cache each file individually so one missing file does not block installation.
    await Promise.all(ASSETS.map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => {})));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = [PRECACHE, RUNTIME];
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith('bsg-') && !keep.includes(n)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations: network first, fall back to cached page, then offline page.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match(req, { ignoreSearch: true })) ||
               (await caches.match('index.html')) ||
               (await caches.match('offline.html'));
      }
    })());
    return;
  }

  // Static assets and data: stale-while-revalidate.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(async res => {
      if (res && res.ok) { const c = await caches.open(RUNTIME); c.put(req, res.clone()); }
      return res;
    }).catch(() => null);
    return cached || (await network) || new Response('', { status: 504, statusText: 'Offline' });
  })());
});
