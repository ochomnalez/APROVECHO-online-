# Brief · Identidad visual y UI

- **Rol:** diseñador de marca e interfaces senior.
- **Rama:** `claude/aprovecho-identidad` · **Entrega:** viernes 6/11, 18:00 (hora de Argentina).
- **Objetivo:** convertir la marca en un **sistema visual profesional y listo para usar** en la app, la landing y los videos.

## Leer primero

`CLAUDE.md` · `docs/decisiones.md` (D-011, D-016 a D-018, D-021) · `docs/marca/brief-identidad-visual.md` (**tu brief detallado**, escrito por Marca) · `docs/marca/plataforma-de-marca.md` · `docs/marca/marca-actual.md` · logo actual en `docs/marca/referencias-plan/`.

## Ya validado

- Profesionalizar el logo actual (D-011).
- **Medialuna como ícono**, integrada a la flecha circular (D-018).
- **Acento cálido "corteza"** sobre la base verde bosque (D-017).
- Slogan: "Menos desperdicio, más aprovecho".

## Entregables (todo en código: SVG, CSS y HTML; nada generado con IA)

1. **Logo en SVG** en `docs/marca/logo/`:
   - Badge completo, **isotipo** (medialuna + flecha) y **wordmark horizontal**.
   - Versiones a color, monocromo y en negativo.
   - **Ícono de app** (1024 px, también legible a 48 px) y **favicon**.
   - PNG exportados para uso rápido.
2. **Design tokens** en `docs/marca/tokens.css` (variables CSS) y `docs/marca/tokens.json`:
   - Colores con usos y contraste AA verificado, incluido el código de las etiquetas **Estimado** y **Medido**.
   - Tipografías (Google Fonts), escala tipográfica, espaciado, radios y sombras.
3. **Componentes base** en `docs/marca/componentes.html`: botón principal y secundario, tarjeta de pack, etiquetas Estimado/Medido, inputs, barra de navegación, chips de filtro, tarjeta de métrica y QR.
4. **Guía de marca** navegable en `docs/marca/guia/index.html`:
   - Logo y área de resguardo, color, tipografía, tono (resumen de la plataforma) e iconografía.
   - Estilo de fotografía: reales, cálidas, de barrio; Unsplash o Pexels.
   - **Usos incorrectos.**
5. **Aplicaciones** (mockups simples en HTML o SVG): sticker de vidriera, cartel de caja, bolsa y un posteo para Instagram.

## Coordinación

- La sesión de **UX** está haciendo la **app v2** con la paleta provisoria. Tus tokens la van a reemplazar: usá nombres de variables claros (por ejemplo `--color-primary`, `--color-accent`, `--color-estimado`).
- Nada de grises genéricos: el usuario pidió explícitamente que todo se vea **alineado a la marca y profesional**.

## Skills sugeridas (si están disponibles)

`frontend-design`, `design:design-system`, `design:accessibility-review`.

## Cierre (obligatorio)

1. Handoff en `docs/handoffs/` con la plantilla.
2. Actualizar tu fila en `docs/ESTADO.md`.
3. Commit y push a tu rama.
4. Avisarle al líder con `send_message` (sesión `session_01YPepJMjFrZcHDJuSPfzuD7`) en 3 a 5 líneas.
5. Las decisiones que propongas van sin número (`PROPUESTA-identidad-N`). Respuestas cortas.
