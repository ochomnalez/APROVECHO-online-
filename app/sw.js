/* Service worker de APROVECHO v2.
   - La app, las librerías y las tipografías se guardan al instalar: abre sin internet.
   - Las calles del mapa que ya viste quedan guardadas (hasta 500 teselas).
   Al cambiar cualquier archivo, subí VERSION: invalida el cache viejo en los celus. */

const VERSION = 'aprovecho-prototipo-plan-acceso-v8';
const TESELAS = 'aprovecho-prototipo-plan-teselas';
const FUENTES = 'aprovecho-prototipo-plan-fuentes';

const LOCALES = [
  './', './index.html', './manifest.webmanifest', './css/app.css', './css/plan.css', './css/cliente-plan.css', './css/comercio-plan.css', './css/tokens.css',
  './css/cuentas.css', './js/auth.js', './js/auth-config.js', './js/cuentas-ui.js', './vendor/supabase.js',
  './js/main.js', './js/nav.js', './js/util.js', './js/icons.js', './js/store.js', './js/data.js',
  './js/fotos.js', './js/intel.js', './js/ui.js', './js/mapa.js', './js/qr.js', './js/export.js',
  './js/pwa.js', './js/cliente.js', './js/comercio.js', './js/intelui.js', './js/inventario.js', './js/ilus.js',
  './img/aprovecho-isotipo.svg', './img/aprovecho-isotipo-blanco.svg', './img/aprovecho-logo.svg', './img/sello-aprovecho.webp',
  './img/fotos/empanadas.webp', './img/fotos/ensalada.webp', './img/fotos/facturas.webp', './img/fotos/medialunas.webp',
  './img/fotos/hamburguesa.webp','./img/fotos/pollo-crocante.webp',
  './img/comercios/havanna.webp','./img/comercios/kfc.webp','./img/comercios/starbucks.webp','./img/comercios/mcdonalds.webp',
  './img/comercios/jumbo.webp','./img/comercios/burger-king.webp','./img/comercios/coto.webp','./img/comercios/carrefour.webp',
  './imagenes.html','./img/fuentes-medios.json',
  './img/fotos/pan.webp', './img/fotos/pizza.webp', './img/fotos/plato-del-dia.webp', './img/fotos/sandwiches.webp',
  './img/fotos/tarta.webp', './img/fotos/torta.webp', './img/fotos/verduleria.webp',
  './fonts/dm-sans-400-700.woff2', './fonts/bricolage-grotesque-700.woff2',
  './vendor/qrcode.js', './vendor/jsQR.js', './vendor/jspdf.umd.min.js',
  './vendor/leaflet/leaflet.js', './vendor/leaflet/leaflet.css',
  './vendor/leaflet/images/layers.png', './vendor/leaflet/images/layers-2x.png',
  './vendor/leaflet/images/marker-icon.png', './vendor/leaflet/images/marker-icon-2x.png', './vendor/leaflet/images/marker-shadow.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png', './icons/favicon-64.png', './icons/favicon.svg',
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(LOCALES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const claves = await caches.keys();
    const propia = k => k.startsWith('aprovecho-prototipo-plan-');
    await Promise.all(claves.filter(k => propia(k) && k !== VERSION && k !== TESELAS && k !== FUENTES).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function recortar(nombre, max) {
  const c = await caches.open(nombre);
  const k = await c.keys();
  if (k.length > max) await Promise.all(k.slice(0, k.length - max).map(r => c.delete(r)));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // navegación: la app de la cache, así abre sin señal
  if (req.mode === 'navigate' && url.origin === location.origin) {
    // solo se guarda como index lo que es la raíz de esta app (nunca otra página del mismo dominio)
    const raiz = new URL('./', self.registration.scope).pathname;
    const esLaApp = url.pathname === raiz || url.pathname === raiz + 'index.html';
    if (!esLaApp) return;
    e.respondWith(fetch(req).then(r => { if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', copia)); } return r; })
      .catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }

  // teselas del mapa: cache primero
  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith(caches.open(TESELAS).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try {
        const r = await fetch(req);
        if (r.ok || r.type === 'opaque') { c.put(req, r.clone()); recortar(TESELAS, 500); }
        return r;
      } catch (err) { return new Response('', { status: 504 }); }
    }));
    return;
  }

  // tipografías: la de la cache y se actualiza de fondo
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FUENTES).then(async c => {
      const hit = await c.match(req);
      const red = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || red;
    }));
    return;
  }

  // archivos propios y librerías: cache primero, se refresca de fondo
  if (url.origin === location.origin || url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(req, { ignoreSearch: url.origin === location.origin }).then(hit => {
      const red = fetch(req).then(r => {
        if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(req, copia)); }
        return r;
      }).catch(() => hit);
      return hit || red;
    }));
  }
});
