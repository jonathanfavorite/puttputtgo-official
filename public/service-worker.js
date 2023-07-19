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
        // Get the URL of the request
        const requestURL = new URL(event.request.url);
  
        // If the request is for a JavaScript file...
        if (requestURL.pathname.endsWith('.js')) {
          // ...try fetching from the network first.
          try {
            return await fetch(event.request);
          } catch (err) {
            // If the network request fails, try to serve from cache.
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
              return cachedResponse;
            }
            // If there is no cached response, throw the original error.
            throw err;
          }
        }
  
        // If the request is not for a JavaScript file...
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          // ...return the cached response if there is one.
          return cachedResponse;
        }
  
        // If there is no cached response, fetch from the network.
        return fetch(event.request);
      })()
    );
  });