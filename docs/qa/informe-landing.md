# Informe de QA · Landing (ronda 1)

> `claude-octi-qa` · 2026-11-09 · Rama auditada: `origin/claude/aprovecho-landing` @ `39502cb` (los commits posteriores solo suman `landing/propuestas/`; el sitio no cambió, repetir al cierre).
> Evidencia: `docs/qa/capturas/landing/` · Herramientas: Playwright (390 / 768 / 1440), Lighthouse mobile, axe-core 4 (WCAG 2.2 AA).

## Resultado en una línea
Sólida: **Lighthouse mobile 94 / A11y 100 / Buenas prácticas 100 / SEO 100**, sin errores de consola ni scroll horizontal en los 3 anchos, tipografía correcta (Bricolage + DM Sans), copy en voseo y Medido/Estimado bien resuelto. Hay **0 bloqueantes**, 5 importantes y varios menores.

| Medición | Resultado |
|---|---|
| Rendimiento móvil | **94** (LCP 3,0 s · CLS 0,016 · TBT 0 ms) |
| Consola / requests fallidos | 0 errores en 390, 768 y 1440 |
| Scroll horizontal de página | No |
| axe 390 px | 2 hallazgos (ver I-4, M-3) |
| axe 1440 px | 3 hallazgos (ver I-3, I-4, M-3) |
| `prefers-reduced-motion` | Videos sin autoplay, 0 animaciones activas (OK) |
| Foco visible | Sí (outline 3 px) |

## Importantes

**I-1 · 75% en el hero y en meta tags (choca con D-031).** El hero dice «Te quedás con el 75% de cada venta» (`landing/index.html:57`), y también en `<meta description>` (l.7), `og:description` (l.13) y «Lo que ganás» 01 (l.358). D-031 pide no mencionar el 75% fuera de la sección de cálculo. *Ojo:* el copy aprobado (`landing-contenido.md`) y la nota A2 de `fuente/09` sí se apoyan en el 75%; **hay una contradicción entre el copy y D-031 → decide Octavio** (ver preguntas). Mientras tanto la FAQ «¿El 75% es de qué?» aclara bien la base (cierra A7).

**I-2 · Roadmap recortado en escritorio y sin pista de scroll.** `ol.road` mide 1330 px dentro de un contenedor de 1160 px (1440) y de 350 px (390): en escritorio se ven 2027 Q1 a 2028 y 2029 a 2031 quedan fuera sin ninguna señal. Captura: `landing/roadmap-1440.png`, `roadmap-390.png`. Arreglo: ajustar columnas (o grilla de 2 filas) en escritorio; en mobile, flecha/degradé de borde.

**I-3 · Contraste AA en los pasos inactivos de «Así de simple» (1440).** axe: `li[data-layer] > div > h3` ratio **2,28** y `p` **2,45** (mín. 4,5 / 3). Son los pasos apagados del bloque sticky. Arreglo: subir la opacidad/ color de los inactivos o no bajar el texto (marcar el activo con otro recurso).

**I-4 · Regiones con scroll sin acceso por teclado.** axe `scrollable-region-focusable` (serious): `.strip` (tira de fotos), `.tablewrap` (tabla de mercado) y `.road`. Agregar `tabindex="0"` + `aria-label` (o `role="region"`).

**I-5 · Onboarding con scroll: se ve más pobre que el prototipo aprobado (concepto A).** `landing/onb-1440-*.png`, `onb-390-*.png`. (a) El escenario es un cuadro beige casi vacío en los pasos 1 a 4; (b) en el paso 5 se superponen capas translúcidas («Bolsas», «Cartel de caja») que se ven sucias y con texto de bajo contraste; (c) en mobile el CTA fijo «Sumá tu comercio» tapa el final del contenido y la ilustración queda chica. Referencia a seguir: `docs/ux/onboarding-prototipos/A-mostrador.html` (mostrador con piezas sólidas que se suman sin fantasmas). Pendiente además: video en pasos 6 y 7 y el rótulo «Ilustrativo» (ver preguntas).

## Menores
- **M-1 · Áreas táctiles < 44 px (mobile).** Links de sub-navegación «Comercios / Planes / Inversores / Preguntas» 36 px de alto; checkbox de consentimiento 24×24; slider de «Lo que te sobró vale» 36 px; «Ver cómo funciona ↓» 24 px; chips de «¿Qué te interesa?» 38 px. (Labels y radios dentro de `label` no cuentan.)
- **M-2 · Texto de pasos largo.** Paso 5 del onboarding: «Video corto, primer lote de bolsas, sticker de vidriera y cartel de caja con QR» (>8 palabras; D-038 pide poco texto).
- **M-3 · Tabla de mercado con `<th>` vacío** (`th[scope=col]:nth-child(1)`): poner texto (puede ser visualmente oculto, p. ej. «Segmento»).
- **M-4 · «Sumate en 2 minutos» y «48 h hábiles»** salen sin el aviso: en `landing-contenido.md` están marcados SUPUESTO. Confirmar o suavizar.
- **M-5 · Pie «Proyecto académico · Universidad Austral · 2026»** está publicado pero el brief lo condiciona a que el usuario lo apruebe.
- **M-6 · Lighthouse `label-content-name-mismatch`**: elementos con texto visible cuyo nombre accesible no lo contiene (no resta puntaje; revisar).
- **M-7 · LCP 3,0 s en móvil simulado.** Aceptable; si se quiere más margen: `fetchpriority="high"` + dimensiones en la foto del hero.

## Copy y marca (chequeo contra `fuente/09`, D-015, D-016, D-019, D-025)
OK ✔ voseo consistente («Sumá», «Mirá», «Vendé»); slogan «Menos desperdicio, más aprovecho» en footer; **Medido / Estimado** rotulado en «Cada pack cuenta» y en planes; no aparece «CO₂ evitado» (hay aclaración explícita: «no equivale a emisiones evitadas»); cifras de validación coinciden con la fuente (35,7 / 58,4 / 52 / 63,6 / 40,3 / 72,8 %, 77 respuestas, aviso «señales de interés»); ejemplo $12.200 → $6.100 → $4.575 coherente con D-015 y D-033; TAM/SAM/SOM coinciden con `fuente/01`; descriptores Recuperá / Medí / Anticipá (D-016); equipo con los 4 nombres de la fuente; sin umbrales Smart/Intelligence (C1) ni ingresos 2027 (C5); aviso «Proyecciones preliminares» visible.

**A decidir por Octavio (no es error de código):**
1. **Bloque «Economics» muestra «USD 112.611 de financiamiento» y «3,9 años de payback · VAN USD 17.004 · TIR 36,7 %».** D-019 (provisoria) los excluía; D-025 (validada) confirmó que C6 es intencional. Requiere decidir si se publican. Hoy están publicados.
2. 75% en hero/meta vs D-031 (I-1).
3. Precios USD 300 y 800 sin aclarar IVA/moneda (A8 sigue abierto; la landing dice «sin IVA» en el pie de planes; el CFO debe confirmarlo).

## Anti «AI slop» (CLAUDE.md §9.10 y D-027)
Aprobado. Sin destellos, sin glassmorphism, sin degradé violeta, sin emojis como íconos, sin 3D de stock; tipografía con carácter; fotos reales y variadas (facturas, empanadas, tartas, plato del día, frutas y verduras, tortas); acento corteza usado con criterio. Único reparo de diseño: el onboarding (I-5) y que las tarjetas de planes repiten el mismo patrón de lista de tildes.

## Lo que sigue
Ronda 2 cuando Landing avise cambios: re-medir Lighthouse, I-2 a I-5 y revisar el onboarding con videos.

---

# Ronda 2 · Landing **v2** · 2026-11-09 · `claude/aprovecho-landing` @ `f7a6209`
> La v1 se rehízo desde cero por pedido de Octavio; los hallazgos I-1 a I-5 de arriba aplican solo a v1 (estado de los que persisten en la tabla de abajo). Evidencia: `docs/qa/capturas/landing-v2/` (full-390/768/1440, hero y recorrido Base en 390). Herramientas: Lighthouse mobile, axe 4, Playwright.

## Resultado en una línea
Muy buen diseño y copy (fondo blanco, anillo Recuperá · Medí · Anticipá, recorridos por plan, fotos reales CC0, sin naranja), pero **no cumple el criterio de Lighthouse ≥ 90 en rendimiento (84)** y tiene **1 error crítico de ARIA**. **0 bloqueantes de contenido; 2 bloqueantes técnicos contra los criterios de aceptación del brief** (rendimiento < 90 y A11y 92 con un `critical`), más 4 importantes.

| Medición | v1 | **v2** |
|---|---|---|
| Lighthouse rendimiento (móvil) | 94 | **84** ✖ (FCP 2,4 s · LCP 2,4 s · **TBT 440 ms** · CLS 0) |
| Accesibilidad | 100 | **92** |
| Buenas prácticas / SEO | 100 / 100 | 100 / 100 |
| Peso total | — | 914 KiB |
| Consola / requests | 0 | 0 errores (390, 768, 1440) |
| Scroll horizontal | No | **Sí en 768 px** (772 > 768) |
| Tipografía | OK | OK (Bricolage + DM Sans) |

## Bloqueantes (contra los criterios de aceptación del brief)
**B-1 · Rendimiento 84 < 90.** El problema es hilo principal: TBT 440 ms y 2,8 s de trabajo del hilo (JS de los recorridos fijos/animaciones + 15 animaciones infinitas), y CSS/JS que bloquea el render (Lighthouse estima 1,67 s). Arreglos probables: `defer` en scripts, CSS crítico inline/`preload`, pausar animaciones fuera de pantalla (`IntersectionObserver`), usar `transform/opacity` con `will-change` solo en las visibles, `fetchpriority="high"` en la imagen del hero.
**B-2 · `aria-required-children` (critical).** `div.tabsbar__in[role=tablist]` contiene `<a>` sin `role="tab"`. O se completa el patrón (`role=tab`, `aria-selected`, `aria-controls`, flechas) o se quita `role=tablist` y quedan como navegación de anclas (`<nav>`), que es lo más simple.

## Importantes
- **I-6 · No respeta `prefers-reduced-motion`.** Hay 0 reglas `@media (prefers-reduced-motion)` y con la preferencia activada siguen corriendo **15 animaciones infinitas** (anillo, `bob` de teléfono/paneles/balanza/tablet, `scan`, `det`). El handoff lo declara como decisión; incumple WCAG 2.2.2/2.3.3 (movimiento continuo sin forma de pausarlo) y el criterio del brief. Arreglo: `@media (prefers-reduced-motion: reduce){ *{animation:none!important} }` y dejar los recorridos fijos funcionando igual.
- **I-7 · Contraste AA en los pasos inactivos de cada recorrido (1440).** axe: 14 nodos, ratios **1,85 a 2,14** (`#plan-base .sstep:nth-child(2) h4/p`…) más `span[title="Próximamente"]` 4,47 en los links del pie (390) y `em` dentro del teléfono de la tarjeta. Es el mismo problema de v1 (I-3) y la mejora anunciada no alcanza. Subir el color de los pasos inactivos a ≥ 4,5:1 (o usar opacidad en el contenedor solo con texto grande ≥ 3:1 y verificar).
- **I-8 · Roadmap sigue recortado en escritorio** (v1 I-2 sin resolver): `ol.road` 1330 px en contenedor de 1160; 2029–2031 quedan fuera («Per…», «Bra…») y en 768 sus ítems llegan a 970 y 1160 px. Probablemente es lo que además produce el **scroll horizontal de la página a 768 px** (772 > 768; también `div.pricetag--b` a 772). Captura: `landing-v2/full-1440.jpg` (sección Roadmap), `full-768.jpg`.
- **I-9 · La balanza y la tablet «arrastrables» no se operan con teclado ni lector** (`.floatstage` sin `tabindex` ni alternativa; la pista «ARRASTRÁ PARA MOVERLA» solo sirve con mouse/dedo). Es decorativo: marcarlo `aria-hidden="true"` / `role=presentation` y no esconder información ahí, o sumar flechas.

## Menores
- **M-1 · Áreas táctiles < 44 px:** chips del anillo «Recuperá / Medí / Anticipá» 40 px de alto; sub-navegación «Comercios / Planes / Inversores / Preguntas» 36 px; checkbox de consentimiento 24×24; slider 36 px; chips «¿Qué te interesa?» 38 px. (Persisten de v1.)
- **M-2 · `th` vacío** en la tabla de mercado (persiste de v1).
- **M-3 · Frase de entrada y hero.** El H1 pasó a ser el slogan «Menos desperdicio, más aprovecho.» con la etiqueta «QUIÉNES SOMOS»; ya no está la promesa B2B «Vendé lo que te sobra con una foto» (queda solo en `<title>`). D-005 pide que el objetivo principal sea que se sumen comercios: el CTA «Sumá tu comercio» está, pero el titular ya no dice qué hacemos por el comercio. Decisión de diseño de Octavio (mockups G1/G2): solo señalarlo.
- **M-4 · Mobile:** el CTA fijo «Sumá tu comercio» tapa el borde inferior del contenido en todas las pantallas (`hero-390.png`, `planbase-390-*.png`); sumar `padding-bottom` o ocultarlo cuando el formulario esté en pantalla.
- **M-5 · Páginas largas en blanco en las capturas completas** (recorridos fijos de 3 planes): es esperable por el `position: sticky`; verificar a mano que no haya «huecos» en tablet (768).

## Estado de los hallazgos de la ronda 1 (v1) en v2
| v1 | En v2 |
|---|---|
| I-1 75% en hero/meta | ✅ Resuelto: queda solo en «Mirá cuánto te queda», nota de la cuenta y FAQ (permitido por D-031) |
| I-2 Roadmap recortado | ❌ Persiste (I-8) |
| I-3 Contraste pasos inactivos | ❌ Persiste (I-7) |
| I-4 Regiones con scroll sin teclado | ✅ `.road` con `tabindex` (axe ya no lo marca); revisar si el roadmap se puede desplazar con flechas |
| I-5 Onboarding débil | ➖ No aplica: se sacó el onboarding de v1; **el onboarding de QA (prototipo A) no está** en v2. Los recorridos por plan lo reemplazan en parte; el paso a paso de alta (los 7 pasos de `fuente/07`) hoy no aparece en la landing |
| M-1 áreas táctiles | ❌ Persiste |
| M-3 `th` vacío | ❌ Persiste |
| M-4 «2 minutos» (SUPUESTO) | ❌ Persiste (sigue «Sumate en 2 minutos») |
| M-5 pie «Proyecto académico» | ❌ Persiste (pendiente de OK) |

## Copy, marca y números (re-chequeo)
OK ✔ voseo; Medido/Estimado rotulado; sin «CO₂ evitado» (aclaración «no equivale…»); cifras de validación e inversores coinciden con la fuente; $12.200 → $6.100 → $4.575 coherente (D-015, D-033); descriptores Recuperá / Medí / Anticipá (D-016); sin umbrales Smart/Intelligence ni ingresos 2027. **Siguen pendientes de Octavio** (sin cambios): el bloque financiero con USD 112.611 / 3,9 años / VAN / TIR (D-019 vs D-025); IVA y moneda de los precios (A8); T&C y política de privacidad que el formulario cita pero no existen todavía.
**Nueva pregunta:** la balanza y la tablet de los recorridos son **recortes de una imagen generada con IA** (la que pasó Octavio; `img/CREDITOS.md`). El handoff los marca provisorios. Confirmar que es aceptable mostrarlos así (con rótulo «Ilustrativo») hasta tener fotos reales.

## Anti «AI slop»
Aprobado: sin destellos, glassmorphism, degradé violeta, emojis ni 3D de stock; tipografía de marca; fotos reales CC0 y variadas; composición con arcos y anillo propia de APROVECHO. Reparo: el producto recortado de una imagen generada se ve «de render» frente a las fotos reales (contraste de estilos) — ver pregunta anterior.

## Veredicto ronda 2 (landing v2)
**No cerrar todavía.** Corregir B-1, B-2, I-6, I-7, I-8 (y de paso el scroll horizontal a 768) y avisar para una última pasada (ronda 3 = límite acordado de 2 rondas; la ronda 1 fue sobre v1, esta es la 1.ª sobre v2).

---

# Ronda 3 (pasada final) · Landing v2 · 2026-11-09 · `claude/aprovecho-landing` @ `88f3b09`
Evidencia: `docs/qa/capturas/landing-v2b/` (full 390/768/1440, roadmap en los 3 anchos, recorrido Base).

| Medición | Ronda 2 | **Final** |
|---|---|---|
| Lighthouse móvil: rendimiento | 84 | **99** (FCP 1,6 s · LCP 1,6 s · TBT 0 ms · CLS 0) |
| Accesibilidad / Buenas prácticas / SEO | 92 / 100 / 100 | **100 / 100 / 100** |
| axe 390 · 768 · 1440 (WCAG 2.2 AA) | 3 violaciones (1 crítica) | **0 · 0 · 0** |
| Consola / requests fallidos | 0 | 0 |
| Scroll horizontal de página (390 / 768 / 1440) | sí en 768 | **no en ninguno** |
| `prefers-reduced-motion` | 15 animaciones corriendo | **0 corriendo** (regla `@media` presente) |

## Verificación de lo corregido
- **B-1 rendimiento** ✅ (84 → 99). **B-2 ARIA** ✅ (axe 0; las pestañas ya no declaran `tablist`).
- **I-6 reduced-motion** ✅. **I-7 contraste** ✅ (axe `color-contrast` 0).
- **I-8 roadmap** ✅: en 1440 las 7 etapas entran completas (hasta «2030–31»); en 768 y 390 es una tira con scroll horizontal accesible por teclado (`tabindex=0`); ya no hay scroll horizontal de página.
- **I-9 arrastrables** ✅: los objetos arrastrables reciben foco con teclado (la pista «ARRASTRÁ PARA MOVERLA» es focusable).
- **M-1 áreas táctiles** ◐ Mejoraron los chips del anillo y los filtros; **quedan** los links de la sub-navegación del pie «Comercios / Planes / Inversores / Preguntas» a 36 px de alto y el checkbox de consentimiento a 28×28. **M-2 `th` vacío** ✅. **M-4 CTA fijo** ✅ (no tapa contenido relevante en las capturas).

## Bloqueantes
**Ninguno.** Landing v2 cumple los criterios de aceptación del brief en lo técnico: Lighthouse ≥ 90, AA, 390/768/1440 sin errores ni desbordes, copy en voseo, Medido/Estimado, anti «AI slop».

## Menores que quedan (no bloquean)
1. Links de sub-navegación del pie a 36 px y checkbox de 28 px (< 44 px).
2. El H1 es el slogan; la promesa B2B está en el subtítulo y el `<title>` (decisión de diseño de Octavio).
3. «Sumate en 2 minutos» / «48 h hábiles» (SUPUESTO) siguen sin confirmar.

## Decisiones de Octavio que siguen abiertas
1. **Bloque financiero de Inversores** publicado (USD 112.611 · 3,9 años · VAN USD 17.004 · TIR 36,7 %): D-025 (válida) vs D-019 (provisoria).
2. **Balanza y tablet** de los recorridos: recortes de una imagen generada con IA; ¿se aceptan con rótulo «Ilustrativo» hasta tener fotos reales?
3. **Pie «Proyecto académico · Universidad Austral · 2026»** y **«2 minutos / 48 h»**: ¿se aprueban o se sacan?
4. **IVA y moneda de los precios USD 300 / 800** (A8), **T&C y política de privacidad** (el formulario las cita y no existen), email/WhatsApp de contacto y `og:image` absoluta al publicar.
5. **Onboarding paso a paso de 7 pasos** (`fuente/07`, concepto A elegido en la Fase 1): en la v2 no está; los recorridos por plan lo reemplazan en parte. ¿Se agrega o queda así?

## Veredicto
✅ **Aprobada para integrar** (landing v2 @ `88f3b09`), salvo las decisiones de Octavio de arriba. Nada se publicó ni se conectó.
