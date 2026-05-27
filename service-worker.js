/* ═══════════════════════════════════════════════
   Acerto Motorista — Service Worker v1
   Cache offline + suporte a armazenamento de fotos
═══════════════════════════════════════════════ */

const CACHE_NAME = 'acerto-motorista-v2';

/* Arquivos que ficam em cache para funcionar offline */
const ARQUIVOS_CACHE = [
  './app_motorista.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap'
];

/* ── Instalação: pré-carrega os arquivos no cache ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_CACHE).catch((err) => {
        console.warn('[SW] Alguns arquivos não foram cacheados:', err);
      });
    })
  );
  self.skipWaiting();
});

/* ── Ativação: limpa caches antigos ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: cache-first para arquivos locais, network-first para Google Fonts ── */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  /* Ignora requisições não-GET e chamadas externas que não são fonts */
  if (event.request.method !== 'GET') return;
  if (url.origin !== location.origin &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        /* Guarda no cache se for resposta válida */
        if (response && response.status === 200 && response.type !== 'opaque') {
          const cacheClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheClone));
        }
        return response;
      }).catch(() => {
        /* Offline e sem cache: retorna o HTML principal como fallback */
        if (event.request.destination === 'document') {
          return caches.match('./app_motorista.html');
        }
      });
    })
  );
});
