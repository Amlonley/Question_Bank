const SW_VERSION = "v1.3.0";
const STATIC_CACHE = `mqb-static-${SW_VERSION}`;
const RUNTIME_CACHE = `mqb-runtime-${SW_VERSION}`;
const RUNTIME_CACHE_MAX_ENTRIES = 36;
const CDN_ALLOWLIST = new Set(["cdn.jsdelivr.net"]);

const APP_SHELL_FILES = [
  "./",
  "./?source=pwa",
  "./index.html",
  "./styles.css",
  "./chapterTreeRenderer.js",
  "./questionPdfAssetPlugin.js",
  "./app.js",
  "./appExperienceEnhancer.js",
  "./data/subjects.json",
  "./manifest.webmanifest",
  "./manifest.webmanifest?v=20260228-premium-brand-v8",
  "./favicon.ico",
  "./favicon.ico?v=20260228-premium-brand-v8",
  "./icons/icon-192.png",
  "./icons/icon-192.png?v=20260228-premium-brand-v8",
  "./icons/icon-256.png?v=20260228-premium-brand-v8",
  "./icons/icon-384.png?v=20260228-premium-brand-v8",
  "./icons/icon-512.png",
  "./icons/icon-512.png?v=20260228-premium-brand-v8",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-192.png?v=20260228-premium-brand-v8",
  "./icons/icon-maskable-512.png",
  "./icons/icon-maskable-512.png?v=20260228-premium-brand-v8",
  "./icons/apple-touch-icon.png",
  "./icons/apple-touch-icon.png?v=20260228-premium-brand-v8",
  "./icons/favicon-32.png",
  "./icons/favicon-32.png?v=20260228-premium-brand-v8",
  "./icons/favicon-16.png",
  "./icons/favicon-16.png?v=20260228-premium-brand-v8"
];

const EXTERNAL_OFFLINE_FILES = [
  "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
  "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
  "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(precacheAppShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      );
      await runServiceWorkerMaintenance();
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event?.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (event?.data?.type === "RUN_MAINTENANCE") {
    event.waitUntil(runServiceWorkerMaintenance());
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (!request || request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isAllowedExternal = !isSameOrigin && isAllowedExternalAsset(url);

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (isSameOrigin) {
    if (isStaticAsset(url.pathname)) {
      event.respondWith(staleWhileRevalidate(request));
      return;
    }

    event.respondWith(networkFirstRuntime(request));
    return;
  }

  if (isAllowedExternal) {
    event.respondWith(staleWhileRevalidateExternal(request));
  }
});

async function precacheAppShell() {
  const cache = await caches.open(STATIC_CACHE);
  await Promise.allSettled(
    APP_SHELL_FILES.concat(EXTERNAL_OFFLINE_FILES).map(async (url) => {
      try {
        const isExternal = /^https?:\/\//i.test(url);
        const request = isExternal
          ? new Request(url, { mode: "no-cors", cache: "reload" })
          : new Request(url, { cache: "reload" });
        const response = await fetch(request);
        if (isResponseCacheable(response)) {
          await cache.put(request, response.clone());
        }
      } catch {
        // Ignore unavailable files during precache.
      }
    })
  );
}

async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, networkResponse.clone());
    void trimRuntimeCache(cache).catch(() => {});
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request, { ignoreSearch: true });
    if (cachedResponse) {
      return cachedResponse;
    }
    const appShell = await caches.match("./index.html", { ignoreSearch: true });
    if (appShell) {
      return appShell;
    }
    return new Response("Offline", {
      status: 503,
      statusText: "Offline"
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = (await cache.match(request, { ignoreSearch: false })) || (await cache.match(request, { ignoreSearch: true }));

  const networkPromise = fetch(request)
    .then((response) => {
      if (isResponseCacheable(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    void networkPromise;
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  const runtimeCached = await caches.match(request, { ignoreSearch: true });
  if (runtimeCached) {
    return runtimeCached;
  }

  return new Response("Not available", {
    status: 504,
    statusText: "Gateway Timeout"
  });
}

async function staleWhileRevalidateExternal(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request, { ignoreSearch: false });

  const networkPromise = fetch(request)
    .then((response) => {
      if (isResponseCacheable(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    void networkPromise;
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  return new Response("", {
    status: 504,
    statusText: "Gateway Timeout"
  });
}

async function networkFirstRuntime(request) {
  try {
    const response = await fetch(request);
    if (isResponseCacheable(response)) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
      void trimRuntimeCache(cache).catch(() => {});
    }
    return response;
  } catch {
    const runtimeCached = await caches.match(request, { ignoreSearch: true });
    if (runtimeCached) {
      return runtimeCached;
    }
    const staticCached = await caches.match(request, { ignoreSearch: true });
    if (staticCached) {
      return staticCached;
    }
    return new Response("Offline", {
      status: 503,
      statusText: "Offline"
    });
  }
}

function isStaticAsset(pathname) {
  return /\.(?:css|js|json|png|svg|ico|webmanifest|woff2?)$/i.test(pathname);
}

function isAllowedExternalAsset(url) {
  if (!url) {
    return false;
  }
  if (!CDN_ALLOWLIST.has(url.hostname)) {
    return false;
  }
  return /\.(?:js|css|woff2?|ttf|otf)$/i.test(url.pathname);
}

function isResponseCacheable(response) {
  return !!(response && (response.ok || response.type === "opaque"));
}

async function runServiceWorkerMaintenance() {
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
        .map((key) => caches.delete(key))
    );

    const runtimeCache = await caches.open(RUNTIME_CACHE);
    await trimRuntimeCache(runtimeCache);
  } catch {
    // ignore maintenance failures to keep fetch pipeline stable
  }
}

async function trimRuntimeCache(cache) {
  if (!cache) {
    return;
  }

  const requests = await cache.keys();
  const overflowCount = requests.length - RUNTIME_CACHE_MAX_ENTRIES;
  if (overflowCount <= 0) {
    return;
  }

  const toDelete = requests.slice(0, overflowCount);
  await Promise.allSettled(toDelete.map((request) => cache.delete(request)));
}
