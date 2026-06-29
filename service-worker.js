// ============================================================
//  Service Worker — solutionnaire Bloc-notes PWA
//  Change le numéro de version chaque fois que tu modifies un
//  des fichiers mis en cache, sinon l'ancienne version reste servie.
// ============================================================
const CACHE_NAME = 'blocnotes-v1';

// Fichiers indispensables au fonctionnement hors-ligne (le « app shell »)
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/js/install.js',
  '/js/ios-hint.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ----- INSTALL : on précache l'app shell -----
self.addEventListener('install', (evt) => {
  console.log('[SW] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pré-cache de l\'app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Active immédiatement le nouveau service worker
  self.skipWaiting();
});

// ----- ACTIVATE : on supprime les anciennes caches -----
self.addEventListener('activate', (evt) => {
  console.log('[SW] Activate');
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Suppression de l\'ancienne cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  // Prend le contrôle des pages déjà ouvertes
  self.clients.claim();
});

// ----- FETCH : on choisit une stratégie selon le type de requête -----
self.addEventListener('fetch', (evt) => {
  const { request } = evt;

  // On ne gère que les requêtes GET
  if (request.method !== 'GET') return;

  // 1) Navigation (l'usager ouvre une page) -> NETWORK FIRST
  //    On tente le réseau, et en cas d'échec on sert la cache,
  //    puis offline.html en dernier recours.
  if (request.mode === 'navigate') {
    evt.respondWith(
      fetch(request)
        .then((response) => {
          // On met à jour la cache au passage
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('/offline.html');
        })
    );
    return;
  }

  // 2) Autres ressources (CSS, JS, images) -> CACHE FIRST
  //    On sert la cache si elle existe, sinon le réseau (et on met en cache).
  evt.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
      );
    })
  );
});
