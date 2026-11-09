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
