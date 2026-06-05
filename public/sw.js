const CACHE_NAME = 'cardapio-cache-v5';
const STATIC_ASSETS = [];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    // Don't cache any HTML at install time
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only cache static assets (build files, storage)
    // Never cache HTML pages
    if (url.pathname.startsWith('/build/') || url.pathname.startsWith('/storage/')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        if (fetchResponse.status === 200) {
                            cache.put(event.request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    });
                });
            })
        );
        return;
    }

    // Everything else (HTML, manifest, etc.) goes straight to network
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
