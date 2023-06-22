self.addEventListener("install", (event) => {
  event.waitUntil(cacheCommonAssets());
});

async function cacheCommonAssets() {
  const cache = await caches.open("common-assets");
  return cache.addAll(["/", "/index.html", "/favicon.ico", "/manifest.json"]);
}

async function cacheAssets(customerID, assets) {
  const cache = await caches.open(customerID);
  return cache.addAll(assets);
}

// In your service worker file
self.addEventListener('message', (event) => {
    if (event.data.type === 'CACHE_ASSETS') {
      cacheAssets(event.data.customerID, event.data.assets);
    }
  });


  self.addEventListener('fetch', (event) => {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
         
          return cachedResponse;
        }
   
        return fetch(event.request);
      })()
    );
  });