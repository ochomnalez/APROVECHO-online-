# Landing v5 · Contrato de construcción (leer antes de tocar nada)

Dirección de diseño: `landing/propuestas/v5/DIRECCION.md`. Storyboard (referencia visual y CSS de partida):
`landing/propuestas/v5/storyboard.html` y `v5-1.png` … `v5-5.png`. Reglas del proyecto: `CLAUDE.md`.

## Cómo está armado

- Página final: `landing/v5.html` (se genera; **no editar a mano**). La v4 (`index.html`) no se toca.
- Armar: `cd landing && python3 src/build_v5.py` → `v5.html`, `css/v5.min.css`, `js/v5.js`.
- Cada escena tiene **tres archivos propios** y solo esos se editan:
  - `src/v5/partials/<escena>.html`
  - `src/v5/css/<nn>-<escena>.css`
  - `src/v5/js/<nn>-<escena>.js`
- Escenas y números: `10-nav`, `20-hero`, `30-problema`, `40-recupera`, `50-medi`, `60-anticipa`, `70-quienes`.
- El CSS de la v4 (`css/styles.css`) ya viene incluido: usar sus variables (`--ink`, `--forest`, `--mint`,
  `--soft`, `--line`, `--r-lg`, `--ease-out`, `--nav-h`, `--gutter`…) y clases (`.wrap`, `.btn`, `.btn--lg`,
  `.btn--ghost`, `.eyebrow`, `.sec`, `.sec__title`, `.num`, `.sr`). **No editar `css/styles.css`** ni
  `js/main.js`, `js/forms.js`, `src/build.py`, `src/v5/index.tpl.html`, `src/v5/js/00-core.js`.
- Piezas compartidas ya hechas en `src/v5/css/05-compartido.css` (**usarlas, no redefinirlas ni editarlas**): bloque de texto del capítulo `.ch` (`.ch__title`, `.ch__for`, `ol.ch__steps` con `li.is-on`, `.ch__price`, `.ch__more`), rótulos `.callout` / `.callout--l`, dato flotante `.datum`, y la sección `.chap` (`.chap--soft`, `.chap--flip`, `.chap__in`).
- Prefijo de clases propio por escena para no chocar: `nv-`, `hr-`, `pb-`, `rc-`, `md-`, `an-`.

## Movimiento

- GSAP 3.13 + ScrollTrigger ya están cargados (`js/vendor/`). No agregar otras librerías.
- Registrar la escena así (el núcleo decide si corre):

```js
APV5.scene('recupera', function (ctx) {
  // ctx = { gsap, ScrollTrigger, mm, desktop, mobile }
  ctx.mm.add(ctx.desktop, function () { /* timeline con scrollTrigger: { trigger, start, end, scrub, pin } */ });
  ctx.mm.add(ctx.mobile, function () { /* versión simple */ });
});
```

- El núcleo agrega `html.motion` **solo** cuando hay movimiento. Todo estilo que esconda o fije algo para animarlo
  va bajo `.motion …`. Sin esa clase (movimiento reducido, sin JS, GSAP caído) la escena tiene que verse
  **completa, ordenada y legible** como una sección normal.
- Animar solo `transform` y `opacity`. `scrub` entre 0.4 y 1. Una escena fija dura como máximo `+=250%`.
- Nada de `scroll-jacking`: el scroll siempre es el del navegador.
- En celular (≤ 899 px): versión simplificada, sin 3D pesado, que rinda a 60 fps.

## Contenido

- Solo textos y cifras que ya están en la v4 (`landing/src/index.tpl.html`) o en el storyboard. **No inventar
  datos, precios ni funciones.** Sin 75% ni 25%. Voseo rioplatense. Lo ilustrativo se rotula («Ejemplo», «ilustrativo»).
- Fondo siempre claro, texto negro, verdes de marca; sin naranja, sin violeta, sin vidrio esmerilado, sin emojis.
- Tipografías ya cargadas: Bricolage Grotesque (solo peso 700) para títulos y cifras; DM Sans (400–700) para el resto.
- Imágenes disponibles: `img/` (sello, anillo `ring3.svg`, arcos, app, producto) y `video/hero/` (4 clips + pósters).
  No descargar ni generar imágenes nuevas.

## IDs y clases que el resto de la página necesita (no cambiar)

- Portada (orientada a comercios): `<section class="hero" id="inicio">` y los botones dentro de `<div class="hero__actions">`.
- Quiénes somos (sección aparte, después de «Mirá cuánto te queda»): `id="quienes-somos"`; ahí va el fondo con los videos.
- Problema: `id="problema"`.
- Capítulos: `id="plan-base"` (con `<a id="como-funciona"></a>` como primer hijo), `id="plan-smart"`, `id="plan-intelligence"`.
- Botones de cada plan: `<a class="btn btn--lg" href="#alta" data-plan="base|smart|intelligence">` (preselecciona el plan en el formulario).
- Menú: si hay botón hamburguesa, `class="nav__burger"` con `aria-controls="menu"` y los enlaces en `<nav id="menu" class="nav__links">` (lo maneja `main.js`). «Descargar app»: `<a href="https://aprovecho-app-demo.vercel.app/" data-app>`.
- Secciones existentes para enlazar: `#suma`, `#senales`, `#preguntas`, `#alta`, `#inversores`, `#equipo`, `#consumidores`.

## Accesibilidad y calidad

- AA: contraste, foco visible, todo operable con teclado, `alt` en imágenes con contenido, `aria-hidden` en lo decorativo.
- Un solo `<h1>` (portada). Capítulos con `<h2>`.
- Videos de fondo: `muted loop playsinline`, sin sonido, con póster; se pausan fuera de pantalla; con movimiento
  reducido o ahorro de datos se muestra solo el póster.
- Sin scroll horizontal en 390, 768, 1024 y 1440. Sin errores en consola.

## Cómo probar

```bash
cd landing && python3 src/build_v5.py && (python3 -m http.server 8777 >/dev/null 2>&1 &)
# capturas con Playwright (ya instalado): NODE_PATH=$(npm root -g) node tu-script.js  → http://localhost:8777/v5.html
```

Sacar capturas de tu escena en 1440×900 y 390×844, a distintos puntos del scroll, **mirarlas** y corregir.
Probar también con `reducedMotion: 'reduce'` (debe verse como sección normal).

## Git

**No usar git** (ni add, ni commit, ni push, ni checkout): el director integra y sube. No tocar `docs/`.
Al terminar, informar: archivos tocados, qué se probó, capturas (rutas), dudas y lo que quedó sin hacer.

---
# RONDA 2 (11/11): cambios pedidos por Octavio (referencias: Cheaf, Buen Provecho, Too Good To Go)

Orden nuevo de la página (ya aplicado en `index.tpl.html`): **Portada con video** → **Contadores** → **El problema** → **Por qué sumar tu comercio** → **Planes (01 Recuperá · 02 Medí · 03 Anticipá)** → Mirá cuánto te queda → **Sumate en 3 pasos + formulario** (alta) → Señales → Preguntas → **Quiénes somos (con Inversores adentro)** → Lista de espera → pie.

Escenas nuevas y sus archivos (prefijo de clases entre paréntesis):
- `20-hero` rehecha (`hr-`): portada con 3 videos en loop. Constructor A.
- `10-nav` ajuste del menú. Constructor A.
- `contadores` (`ct-`): `partials/contadores.html`, `css/25-contadores.css`, `js/25-contadores.js`. Constructor B.
- `valor` (`vl-`): `partials/valor.html`, `css/35-valor.css`, `js/35-valor.js`. Constructor B.
- `pasos` (`ps-`): `partials/pasos.html`, `css/80-pasos.css`, `js/80-pasos.js`. Constructor B.
- `70-quienes` + `partials/inversores.html`: los hace el director (no tocar).
Las reglas de arriba siguen valiendo (tokens, `.motion`, accesibilidad, sin git, sin 75%/25%, voseo, contenido solo de la fuente).
Videos de la portada: `video/hero-ia/<n>-<nombre>-1280.mp4` (escritorio), `-640.mp4` (celular ≤899px) y `.webp` (póster): `1-publica`, `2-balanza`, `3-entrega`. Duran 6 s, sin audio, 16:9. Son **generados con IA** (Gemini Omni a partir de imágenes validadas por Octavio); hay que decirlo en el pie.

---
# RONDA 3 (11/11): estación nueva, Recuperá con pantallas reales y video de onboarding

REGLAS NUEVAS DE OCTAVIO (valen para todo): **máxima nitidez** (imágenes y videos a resolución completa o 2×, nunca desenfocados ni estirados) y **scroll lo más fluido posible**: solo `transform` y `opacity`, sin `filter`/`blur`/`box-shadow` animados, `will-change` solo mientras anima, nada de layout thrash (leer medidas una vez), imágenes con `decoding="async"`, pins cortos, `scrub` 0.4–0.8, `contain: layout paint` en los escenarios, y en celular versiones simples. Se mide con Lighthouse y con capturas; el director rechaza lo que trabe.

Materiales nuevos:
- **Estación** (fotos que pasó Octavio, ya recortadas con fondo transparente) en `landing/img/estacion/`: `armada.webp` (balanza + tablet en brazo + hub + cable, 1296×1055), `desarmada-a.webp` y `desarmada-b.webp` (todo separado), y las **6 piezas sueltas** de `desarmada-a`: `pieza-balanza.webp`, `pieza-tablet.webp`, `pieza-brazo.webp`, `pieza-hub.webp`, `pieza-cable-usbc.webp`, `pieza-cable-corriente.webp`. `img/estacion/piezas.json` trae el cuadro de referencia (1774×887) y la posición x, y, w, h de cada pieza en la composición desarmada (usalo para armar el despiece en % del cuadro). **Las fotos son provisorias**: Octavio va a pasar más fotos (armada y desarmada en varias etapas, y para girar 360°); el código tiene que aceptar reemplazar archivos con el mismo nombre y sumar etapas sin reescribir.
- **Pantallas reales de la app** (capturas del prototipo, 390×844 aprox., en JPG): `video/public/onboarding/` (desde la raíz del repo): `08-camara`, `09-analizando`, `10-analizando-b`, `11-tras-analisis`, `12-revisar-checklist`, `13-publicado`, `14-cliente-ve-pack`, `15-reservar`, `16-reserva-qr`, `17-retiros`, `18-retiro-validado`, `19-hoy-final`, `20-impacto`, entre otras. Copiá las que uses a `landing/img/app/pantallas/` convertidas a WebP calidad 90 (sin reducir resolución).
- **Video de onboarding** (91,6 s, 1920×1080, con voz y música): `landing/video/onboarding/onboarding-1080.mp4` (13,7 MB) y póster `onboarding-poster.webp`. Se carga SOLO al hacer clic (preload="none").

Escenas y archivos:
- `recupera` (`rc-`) REHECHA y `onboarding` (`ob-`: `partials/onboarding.html`, `css/45-onboarding.css`, `js/45-onboarding.js`): **Constructor X**.
- `medi` (`md-`) y `anticipa` (`an-`) REHECHAS: **Constructor Y**.
- Portada y Quiénes somos: las hace el director.
Siguen valiendo todas las reglas anteriores (sin git, accesibilidad, `.motion`, voseo, sin 75%/25%, contenido de la v4/fuente, sin scroll horizontal en 390/768/1024/1440, sin errores de consola, build OK).
