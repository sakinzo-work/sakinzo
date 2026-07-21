const CACHE_NAME = 'sakinzo-admin-shell-v1';
const APP_SHELL = [
  './admin.html',
  './admin.webmanifest',
  './admin-icon-192.png',
  './admin-icon-512.png',
  './favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('sakinzo-admin-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isAdminPage = url.pathname.endsWith('/admin.html');
  const isShellAsset = APP_SHELL.some(path => url.pathname.endsWith(path.slice(1)));
  if (!isAdminPage && !isShellAsset) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => (await caches.match(request)) || caches.match('./admin.html'))
  );
});
