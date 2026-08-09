// This site does not register push notifications yet.
// Keep the worker endpoint valid for browsers that probe it automatically.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
