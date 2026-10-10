const CACHE = "streaky-todo-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

const store = async (request, response) => {
    if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response);
    }
};

// Pages: network first so new deploys show up immediately, cache as the offline fallback.
// Other same-origin assets: cache first, refreshed in the background.
self.addEventListener("fetch", (event) => {
    const {request} = event;
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
        return;
    }
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    event.waitUntil(store(request, response.clone()));
                    return response;
                })
                .catch(async () => (await caches.match(request, {ignoreSearch: true})) || Response.error())
        );
        return;
    }
    event.respondWith(
        caches.match(request, {ignoreSearch: true}).then((cached) => {
            const refresh = fetch(request).then((response) => {
                event.waitUntil(store(request, response.clone()));
                return response;
            });
            return cached || refresh.catch(() => Response.error());
        })
    );
});
