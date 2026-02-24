// This service worker immediately deactivates itself and unregisters
// Used to clean up a previously installed service worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => client.navigate(client.url));
  });
  self.registration.unregister();
});
