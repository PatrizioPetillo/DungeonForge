const CACHE_NAME = "dungeonforge-cache-v2";
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
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// ✅ Fetch: network first, fallback cache, aggiorna in background
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (
    event.request.method !== 'GET' ||
    url.origin !== location.origin // solo file locali, niente Google/Firebase
  ) {
    return; // ignora POST o richieste esterne
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => {
          return cache.match(event.request);
        });
    })
  );
});


