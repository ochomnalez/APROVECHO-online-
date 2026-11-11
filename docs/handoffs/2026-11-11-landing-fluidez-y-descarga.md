# Handoff · Landing · Fluidez, Instagram y botón de app

- **Fecha:** 2026-11-11
- **Firma:** `codex-octi-landing`
- **Rama:** `codex/aprovecho-landing`
- **Sitio:** https://aprovecho-landing.vercel.app/

## Cambios

- Acciones persistentes en la barra: «Descargá la app» y «Sumá tu comercio», mismo estilo, altura táctil mínima de 44 px. Navegación en dos filas hasta 1199 px para evitar solapamiento de botones y enlaces; probada desde 320 px. Se retiró el código que ocultaba la CTA del comercio en la portada.
- Instagram con silueta cuadrada redondeada, colores de la app y cámara blanca de 30 px con trazos redondeados. CSS propio en `15-social.css`, sin mezclarlo con los planes.
- Indicador lateral con referencias y pin cacheados; lee geometría únicamente al desplazarse/cambiar el layout y escribe solo valores modificados. El ticker sigue el scrub sin búsquedas DOM ni mediciones continuas. Se conserva el progreso por plan y su finalización sin repetir al subir.
- Giro 360: solo se solicita el primer cuadro al acercarse. Los 48 cuadros originales se cargan progresivamente al usar mouse, teclado o arrastre horizontal táctil, no al desplazar verticalmente sobre la imagen. No se altera resolución ni calidad.
- Barras de los videos de portada: no reescriben las transformaciones de segmentos que no cambiaron.
- Reproductor de onboarding: controles independientes de GSAP y de la preferencia de movimiento reducido; pausa al salir de pantalla o cambiar de pestaña. Carga completa únicamente al reproducir.
- Cambios solo en fuentes de v5; salidas reconstruidas con el script oficial, sin edición manual de generados. Caché de CSS/JS actualizada a v8.

## Descarga de la app: destino pendiente

No hay URL oficial de descarga configurada (`APP_URL` sigue vacío). Se consultó al usuario; mientras no indique una URL, el nuevo botón conserva el flujo existente de `data-app`: abre la vista para compradores y avisa que la app llega pronto. No se inventó un enlace a una tienda ni se presentó el prototipo como app publicada.

## Validación

- Chromium: cabecera y acciones a 320, 390, 768, 1024 y 1440 px; sin botones superpuestos ni desborde horizontal. La acción de app abre la vista y el aviso existentes.
- Indicador en reposo, misma medición local de 1,5 s: antes 90 mutaciones DOM; después 0. Es una medición del indicador, no una puntuación global ni una promesa de FPS.
- Giro: como máximo un cuadro solicitado antes de interactuar; los 48 siguen disponibles con foco/teclado.
- Movimiento reducido: play del video funciona, conserva el onboarding 1080p y pausa fuera de pantalla.
- Regresión de los tres planes, vuelta sin repetir, pestañas, cambios de tamaño y estructura final: correcta.
- Pruebas funcionales de scroll a 1440×900, 1024×768, 768×1024 y 390×844, más movimiento reducido a 390×844: sin errores JS ni respuestas HTTP fallidas en las pruebas.
- Pruebas repetidas sobre `landing-dist/` servido en su raíz, no solo sobre los fuentes.
- Los 30 assets de video públicos fueron comparados por SHA-256 con los originales: idénticos. No hubo compresión, reducción de resolución ni generaciones externas.
- Capturas revisadas en `/tmp/instagram-after.png`, `/tmp/nav-fluid-320.png` y `/tmp/nav-fluid-1440.png`.

Tests reutilizables (con Playwright instalado fuera del repo y el paquete servido en 8770):

```sh
LANDING_TEST_URL=http://127.0.0.1:8770/ NODE_PATH=/workspace/aprovecho-cloud-setup/browser/node_modules node landing/src/v5/tests/ui-fluidity.cjs
LANDING_TEST_URL=http://127.0.0.1:8770/ NODE_PATH=/workspace/aprovecho-cloud-setup/browser/node_modules node landing/src/v5/tests/plan-scroll.cjs
```

## Publicación

Preparada para actualizar el mismo proyecto de Vercel desde esta rama después del push. La confirmación de estado READY y del alias se registrará tras el despliegue. Este entorno permite la API de Vercel pero no abrir directamente el dominio público; las verificaciones locales y el estado remoto se distinguen.
