const CACHE_NAME = "dungeonforge-cache-v3";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// ✅ Install: cache static assets e attiva subito
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("✅ Caching static assets...");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Attiva subito la nuova versione
});

// ✅ Activate: elimina vecchie cache e prendi il controllo
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim(); // Controlla subito le schede aperte
});

// ✅ Fetch: network first, fallback cache, aggiorna in background
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
