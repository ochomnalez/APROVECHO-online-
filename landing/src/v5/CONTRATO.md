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
- Menú: si hay botón hamburguesa, `class="nav__burger"` con `aria-controls="menu"` y los enlaces en `<nav id="menu" class="nav__links">` (lo maneja `main.js`). «Descargar app»: `<a href="#consumidores" data-app>`.
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
