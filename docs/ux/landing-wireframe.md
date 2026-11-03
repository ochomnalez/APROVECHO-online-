# Landing · wireframe y estructura

> UX · 2026-11-03 · usa `docs/marketing/landing-contenido.md` (Marca, v1) y D-005. Wireframe navegable: `landing-wireframe.html` (responsive, grises).
> Objetivo: **que un comercio se sume solo** (alta Base, sin reunión) + una **sección para inversores**.

## Decisiones de estructura
1. **Una sola conversión principal:** "Sumá tu comercio". Todos los CTA primarios llevan al mismo formulario (`#alta`).
2. **Inversores en página aparte** (`/inversores`), enlazada desde la navegación y el footer. Así la home no compite con la conversión B2B y el inversor tiene su recorrido propio. (D-005 admite sección o subpágina: **PROPUESTA-ux-1**.)
3. **Vision Recognition se muestra, no se cuenta:** en "Cómo funciona" se reutiliza la detección animada de `v2/m2-deteccion.html` (foto → cajas → "Medialunas ×9" → propuesta).
4. **Formulario en 2 pasos** (en el mismo lugar, sin cambiar de página) para bajar la fricción de F-1 (8 campos obligatorios):
   - Paso 1: nombre del comercio, rubro, WhatsApp.
   - Paso 2: barrio, dirección, tu nombre, email, consentimiento. Opcionales plegados bajo "Contanos un poco más".
5. **Mostrar la cuenta** (hoy enterrada en la FAQ 2): "$12.200 → pack $6.100 → te quedan $4.575". Sección corta antes de Planes. (**PROPUESTA-ux-2**, usa el ejemplo de D-015.)

## Home (comercios): orden y jerarquía

| # | Sección (copy) | Qué se ve | CTA | Nota de UX |
|---|---|---|---|---|
| 0 | Navegación | Logo · Cómo funciona · Planes · Preguntas · Inversores · **Sumá tu comercio** | Botón en nav; **barra fija inferior en mobile** | Hamburguesa en mobile |
| 1 | **C-1 Hero** | H1 "Lo que te sobra hoy, vendelo con una foto", bajada, microcopy "Sin abono · Sin equipos · Pagás solo cuando vendés". A la derecha: celular con la tarjeta "3 packs · $6.100 · retiro 18 a 20 h" | **Sumá tu comercio** (primario) · Ver cómo funciona (link de texto, no botón) | Un solo botón. Visual real, no ilustración genérica |
| 2 | **C-2 Problema** | Título + 3 cifras grandes (35,7% · 58,4% · 52%) | — | Fuente visible abajo (encuesta propia) |
| 3 | **C-3 Cómo funciona** | 5 pasos + **demo animada de detección** | — | Es el corazón de la página; en mobile, pasos verticales y la demo arriba |
| 4 | **Nuevo: "Mirá cuánto te queda"** | Cuenta en 3 cifras: valor $12.200 → pack $6.100 → tuyo $4.575 | **Sumá tu comercio** | Ejemplo, rotulado "Ejemplo" |
| 5 | **C-4 Beneficios** | 6 tarjetas (iconos de línea) | — | Orden: plata, sin trabajo, sin riesgo primero |
| 6 | **C-5 Planes** | Tabla de 3 columnas (mobile: tarjetas apiladas, Base primero y destacada) | Base: Sumá tu comercio · Smart: Pedí una demo · Intelligence: Hablá con ventas | Smart/Intelligence abren el mismo formulario con el plan preseleccionado (F-2). Sin umbrales USD 1.150/3.100 (C1) |
| 7 | **C-6 Validación** | 3 cifras + nota "señales, no resultados" | — | Mantener la nota de muestra (A6) |
| 8 | **C-7 Impacto** | Bloque Medido / Estimado (con las mismas etiquetas de la app) + letra chica | — | Misma lógica visual que la app |
| 9 | **C-8 FAQ** | 12 preguntas en acordeón (las 4 primeras abiertas en desktop) | — | Áreas táctiles ≥ 44 px |
| 10 | **C-9 CTA final + formulario `#alta`** | Título "Esta noche, en vez de tirarlo, vendelo." + formulario F-1 en 2 pasos | **Sumá tu comercio** (envío) · "¿Preferís hablar? WhatsApp" (link) | El formulario vive acá; todos los CTA hacen scroll a este punto |
| 11 | Footer | Slogan, links, legal, "app llega pronto" | — | Sin botón de descarga (no hay app publicada) |

## Página `/inversores`

| # | Sección | Qué se ve |
|---|---|---|
| 1 | I-1 Oportunidad | Título + 3 datos con fuente (PNUMA, MAGyP) |
| 2 | I-2 Mercado | Tabla TAM/SAM/SOM, **B2B y B2C en columnas separadas, nunca sumadas** (C4), con nota |
| 3 | I-3 Modelo | Comisión 25% + abonos + escalera Base → Smart → Intelligence |
| 4 | I-4 Validación | 3 señales y próximos pasos |
| 5 | I-5 Roadmap | Línea de tiempo 2027 → 2031 (con aviso "hipótesis") |
| 6 | I-6 Economics | **Aviso "Proyecciones preliminares" arriba** y 5 tarjetas (solo las permitidas, D-019). Sin VAN/TIR/payback/financiamiento ni ingresos 2027 |
| 7 | I-7 Equipo | 4 tarjetas (foto y línea de background pendientes) |
| 8 | I-8 CTA + F-3 | "Pedí información" con el formulario de contacto de inversores |

## Formularios (UX)
- **Etiquetas visibles** sobre cada campo (el placeholder no reemplaza la etiqueta). Errores en línea, junto al campo, con el texto de Marca.
- **Autocompletado** de email, teléfono y dirección; teclado numérico/teléfono en mobile.
- "¿Cuántos locales tenés?" > 1: mensaje en línea "Te puede servir Intelligence. Te contactamos." sin cortar el envío.
- Éxito: reemplaza el formulario en el lugar (no redirige) y repite la promesa de las 48 h.
- **Prototipo (D-006): no envía a ningún lado.** Muestra el estado de éxito. El backend se decide después.

## Mobile
Una columna, 16 px de gutter, barra fija inferior con "Sumá tu comercio" (se oculta cuando el formulario está visible), planes como tarjetas apiladas, tabla de mercado con scroll interno, FAQ en acordeón. Objetivos táctiles ≥ 44 px.

## Accesibilidad
Contraste AA (el texto verde bosque sobre crema cumple; "Estimado" en naranja sobre durazno debe verificarse en el diseño final), foco visible, formularios con `label`, animación de la demo respeta `prefers-reduced-motion`, orden de lectura = orden visual.

## Medición propuesta (sin implementar)
Eventos: clic en "Sumá tu comercio" (por posición), paso 1 completado, envío exitoso, clic en "Pedí una demo", envío de F-3. Métrica principal: **% de visitas que envían F-1**.

## Observaciones sobre el copy de Marca (para devolver)
1. **C-3 paso 3** dice "completás el checklist". La v2 de la app lo reemplaza por la confirmación en el botón "Publicar" (**PROPUESTA-ux-3**, pendiente de OK). Si se aprueba, ajustar el paso a "Revisás y publicás". Mientras tanto, la FAQ 7 describe el checklist y es coherente con D-014.
2. **C-9** promete "2 minutos": válido con el formulario en 2 pasos; hay que cronometrarlo con el prototipo final.
3. **I-6**: dice "equilibrio en 2029" con aviso; correcto según D-019, pero depende de que el usuario valide D-019.
4. La nota de IVA de Planes sigue abierta (supuesto de Marca).

## Pendientes y bloqueos
- Fotos del equipo y background de cada fundador (I-7).
- Decisiones de marca D-016 a D-020 (paleta con acento "corteza", ícono): el wireframe va en grises a propósito.
- Foto y og:image: a cargo de Identidad visual.
