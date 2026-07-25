// Minimal service worker — required by Chrome/Android for the
// "Install app" prompt to appear (instead of just "Add shortcut").
// It doesn't cache anything; the app always loads fresh from the
// network so your Google Sheet data stays live.
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
