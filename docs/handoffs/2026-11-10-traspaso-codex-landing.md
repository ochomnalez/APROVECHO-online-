# Traspaso a Codex · Landing (seguir desde acá)

- **De:** `claude-octi-qa` (QA y Diseño) · 2026-11-10 · **Para:** Codex (firma sugerida `codex-octi-landing`)
- **Motivo:** Claude se queda sin créditos; Codex sigue con la landing.

## 0. Antes de tocar nada (5 minutos)
1. Leé `AGENTS.md` y `CLAUDE.md` (reglas: tablero + bitácora + commit con trailer `Agente: codex-octi-landing` + push **a tu rama**, nunca a `main` ni a la integración).
2. Ramas:
   - **Código de la landing (lo último):** `origin/claude/aprovecho-landing` (v4, commit `477d6a1` o posterior).
   - **Este traspaso, el prototipo del hero e informes de QA:** `origin/claude/aprovecho-qa`.
   - **Tu rama:** `git fetch origin && git checkout -b codex/octi-landing origin/claude/aprovecho-landing` y traé lo de QA:
     `git checkout origin/claude/aprovecho-qa -- docs/ux/hero-prototipo docs/ux/landing-hero-ciclo-propuestas.md docs/handoffs/2026-11-10-traspaso-codex-landing.md docs/qa`
3. Leé en este orden: `docs/handoffs/2026-11-10-landing-v4.md` (cómo está armada la v4), este archivo, `docs/ux/landing-hero-ciclo-propuestas.md` (idea elegida) y `docs/qa/informe-landing.md` (sección final).

## 1. Cómo está armada la landing v4 (rama `claude/aprovecho-landing`)
- La página **se genera**: fuente `landing/src/index.tpl.html` + `landing/src/partials/` → `cd landing && python3 src/build.py` → `landing/index.html`. **No edites `index.html` a mano.**
- Estilos: `landing/css/styles.css` → `python3 build-css.py` → `styles.min.css`.
- JS: `landing/js/main.js` (pestañas, video, barra fija, calculadora, balanza/tablet) y `landing/js/forms.js` (formularios simulados; `enviarLead` es el único punto para conectar Supabase después).
- Video «Así funciona» hecho con HyperFrames: `landing/src/motion/como-funciona/` (README con comandos).
- Tipografías propias (Bricolage Grotesque + DM Sans), sin Google Fonts. Fondo blanco, verde como acento, **sin naranja**.
- Correr local: `cd landing && python3 -m http.server 8080`.

## 2. LA TAREA QUE SIGUE: nueva portada «El camino de la comida»
**Octavio eligió la idea A + una toma cinematográfica de la idea D** (`docs/ux/landing-hero-ciclo-propuestas.md`).
- **Qué es:** portada con **foto panorámica realista a pantalla completa** (estilo Mercury): una ruta desde un campo de trigo con vacas → molino con chimenea → súper → panadería del barrio. Encima, en código: nubes que se mueven, humo, un camioncito que recorre la ruta, íconos flotantes **CH₄** (vacas, tacho), **CO₂** (fábrica, camiones) y **Agua** (campo, fábrica), y la ruta punteada que se dibuja.
- **Al scrollear (toma de la D):** la cámara avanza por la ruta hasta la panadería → foto de la calle al cierre → foto del mostrador con lo que sobró y la bifurcación «Al tacho (CH₄)» ✕ / «A un vecino» ✓ → foto de un vecino retirando su bolsa + sello APROVECHO con el anillo de 3 flechas + CTA «Sumá tu comercio».
- **Prototipo funcional ya hecho:** `docs/ux/hero-prototipo/index.html` (JS/CSS puro, sin librerías). Probado en 1440 y 390 sin errores. Hoy muestra un **boceto** porque faltan las fotos.
- **Las fotos las genera Octavio** en Gemini con `docs/ux/hero-prototipo/PROMPTS.md` y las pasa por chat: `panorama.jpg` (21:9), `panorama-celu.jpg` (9:16), `calle.jpg`, `mostrador.jpg`, `vecinos.jpg` (16:9). Van en `docs/ux/hero-prototipo/img/` (y después en `landing/img/hero/`, en WebP ≤ 250 KB c/u con `srcset`). **No generes imágenes vos** sin OK de Octavio.

### Pasos
1. Cuando lleguen las fotos: convertí a WebP y **calibrá las coordenadas** del objeto `ESCENAS` en el `<script>` del prototipo (en píxeles de la imagen: `ruta`, `chimenea`, `panaderia`, `chips`). Hoy están puestas para el boceto, por eso algunos chips se pisan con el título: ubicá los chips **fuera del área del texto** (tercio superior izquierdo) y cerca de lo que señalan (vacas, chimenea, ruta, campo).
2. Mostralo a Octavio (capturas 1440 y 390) y ajustá.
3. Integralo en la v4 como **primera sección** (reemplaza la portada actual «Quiénes somos»; lo de Quiénes somos queda en la sección siguiente). Pasalo a un partial en `landing/src/partials/`, CSS a `styles.css` y JS a un módulo propio que **solo** se active en esa sección.
4. Textos (≤ 8 palabras por pantalla; Octavio todavía no eligió el titular):
   - H1: «Menos desperdicio, más aprovecho.» · bajada: «Cada pan viene de lejos: campo, agua, camión y fábrica. Que no termine en el tacho.»
   - «Al cierre, siempre sobra algo.» → «¿Al tacho o a un vecino?» → «Con APROVECHO, a un vecino.»
   - Alternativa de titular para preguntarle: «Cada pan viene de lejos. Que no termine acá.»

### Criterios de aceptación (los mismos que aprobó QA en la v2/v4)
- Lighthouse **mobile ≥ 90** (la v4 da 93; no la bajes: imágenes WebP con `srcset`, solo la panorámica con `fetchpriority="high"`, las tomas 3–5 con carga diferida, animaciones solo con `transform`/`opacity` y pausadas fuera de pantalla).
- axe **0 violaciones** (WCAG 2.2 AA) en 390, 768 y 1440; foco visible; botones ≥ 44 px.
- `prefers-reduced-motion`: todo quieto, sin sticky; las tomas se ven en una grilla (el prototipo ya lo hace).
- Sin scroll horizontal; sin errores de consola.
- Cómo medir (lo usó QA): `npx lighthouse http://127.0.0.1:8080/ --form-factor=mobile --chrome-flags="--headless --no-sandbox"` con `CHROME_PATH=/opt/pw-browsers/chromium`, y axe-core inyectado con Playwright (Chromium preinstalado en `/opt/pw-browsers/chromium`).

### Reglas de contenido (no negociables)
- **Nada de «CO₂ evitado»** ni cifras inventadas. Los íconos dicen qué gas y dónde, sin números. Si hace falta una cifra: **2,53 kg CO₂e y 192 litros de agua por kg** (FAO, `docs/fuente/04`), rotuladas «huella asociada · estimado».
- El mensaje es: tirar comida es tirar todo lo que costó producirla; APROVECHO hace que llegue a un vecino. No decir que APROVECHO «elimina» emisiones.
- **Sin 75% ni 25%** en la página pública (pedido de Octavio, PROPUESTA-landing-2).
- Voseo; cero «AI slop» (sin destellos, glassmorphism, degradé violeta, emojis como íconos, 3D de stock). Si una foto generada se ve artificial, decíselo a Octavio antes de usarla.

## 3. Decisiones de Octavio que siguen abiertas
1. Titular del hero (ver arriba).
2. Bloque financiero de Inversores (financiamiento, payback, VAN, TIR): D-025 vs D-019.
3. Balanza y tablet de la sección Planes: son recortes de una imagen generada con IA → ¿rótulo «Ilustrativo» o reemplazar por fotos reales?
4. Pie «Proyecto académico · Universidad Austral» y supuestos «2 minutos / 48 h».
5. IVA y moneda de precios, T&C, política de privacidad, contacto, `og:image` absoluta al publicar.
6. ¿A inversores se les muestra la comisión (25%)?

## 4. Al terminar cada bloque
- Handoff `docs/handoffs/AAAA-MM-DD-landing-<tema>.md`, `scripts/bitacora.sh "codex-octi-landing" "<qué>" "<sigue>"`, bloque `DATOS` de `docs/tablero/visual.html`, commit con `Agente: codex-octi-landing`, push a `codex/octi-landing`. PR contra `claude/gallant-planck-ps6te6` solo cuando Octavio lo pida.
- **No publicar** (Vercel, dominio, etc.) ni conectar servicios sin OK de Octavio.
