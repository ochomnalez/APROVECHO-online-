# Handoff · Identidad visual / UI · sistema visual v1

- **Fecha:** 2026-11-05
- **Agente / sesión:** Identidad visual / UI · `session_01YPepJKRPFvh2fx4pRYrdnC`
- **Rama y commits:** `claude/aprovecho-identidad`

## Qué hice

- Logo redibujado en vector (medialuna + flecha circular, D-018), todo en código; texto convertido a curvas (no depende de fuentes).
- Tokens (CSS y JSON) con 14 pares de contraste verificados por script (todos AA).
- Componentes base, guía de marca navegable, 4 aplicaciones y PNG exportados.
- Los scripts que generan todo están en `docs/marca/herramientas/` (regenerar = correr `build_*.py`).

## Entregables (rutas)

- Logo: `docs/marca/logo/*.svg` (badge, isotipo, horizontal, wordmark × color/mono/negativo/mono-negativo; `app-icon-1024`, `app-icon-corteza-1024`, `favicon.svg`/`.ico`, `og-image.svg`) y `docs/marca/logo/png/` (25 PNG: favicon 16/32/48/180, app icon, og 1200×630)
- Tokens: `docs/marca/tokens.css`, `docs/marca/tokens.json`
- Componentes: `docs/marca/componentes.html` + `docs/marca/componentes.css` (reutilizable, prefijo `.ap-`)
- Guía: `docs/marca/guia/index.html`
- Aplicaciones: `docs/marca/aplicaciones/index.html` y `aplicaciones/png/` (sticker, cartel de caja, bolsa, post IG 4:5)

## Propuestas (sin número; el líder asigna D-NNN)

- **PROPUESTA-identidad-1 · Tipografía:** Bricolage Grotesque 800 (títulos y wordmark) + Inter (texto, cifras tabulares). Reemplaza a Montserrat/Open Sans.
- **PROPUESTA-identidad-2 · Acento:** corteza `#E07A2E`. Elegido sobre "dorado medialuna" porque sale del producto y contrasta con el verde de la categoría. **CTA = fondo corteza + texto ink `#14281F` (5,17:1)**; texto blanco sobre corteza no cumple AA (3,0:1). Para texto de acento sobre claro: `#A9490B` (5,22:1).
- **PROPUESTA-identidad-3 · Crema:** `#FBF3E4` en lugar de `#F5F5DC` (menos amarillo). Menta `#DFFFD6` se mantiene, uso moderado.
- **PROPUESTA-identidad-4 · Etiquetas:** Medido = sólida verde con sello; Estimado = contorno punteado + palabra (no usa el durazno del plan).
- **PROPUESTA-identidad-5 · Favicon/ícono:** favicon con isotipo simplificado de 3 gajos; ícono de app verde (alternativa corteza incluida). Legible a 48 px.

## Supuestos usados (no están en la fuente)

- QR de ejemplo apunta a `https://aprovecho.example/app` (dominio sin definir).
- Texto de desecho de la bolsa ("al cesto de orgánicos o a tu compost") a validar con el proveedor.
- Precios/cifras de las tarjetas son datos de ejemplo (D-015).

## Pendientes y bloqueos

- Fotos reales de stock (Unsplash/Pexels) no incluidas: la guía da criterios y búsquedas.
- Set de ilustración de personajes-alimento: no hecho (aprox. para cuando arranquen landing/video).
- Plantillas de redes (stories 9:16, avatar) y lower thirds de video: prioridad 2, no hechas.
- Sticker PNG tiene esquinas con fondo crema (no transparente); el SVG/HTML es la fuente.

## Qué necesita el próximo agente

- **UX / App:** reemplazar la paleta provisoria por `tokens.css` (`--color-primary`, `--color-accent`, `--color-estimado`…) y reusar `componentes.css`. Etiquetas Medido/Estimado: usar `.ap-tag--medido` / `.ap-tag--estimado`.
- **Landing:** `tokens.css`, `componentes.css`, `logo/favicon.svg`, `logo/png/og-image.png`.
- **Video:** `logo/logo-badge-*`, `logo-isotipo-*` (SVG animables), Bricolage Grotesque para subtítulos.

## Costo aproximado de este bloque

- Generaciones externas (imágenes, video, voz): ninguna (todo en código).
- Observaciones: fuentes y libs (fonttools, qrcode) gratis; Google Fonts por URL.
