# Informe de QA · App (ronda 1)

> `claude-octi-qa` · 2026-11-09 · Rama auditada: `origin/claude/aprovecho-app` @ `75572e7` (handoff `docs/handoffs/2026-11-09-app-final.md`).
> Evidencia: `docs/qa/capturas/app/` · Playwright: celular 390×844, tablet 1180×820, escritorio 1440×900 · axe-core 4 (WCAG 2.2 AA) en cada pestaña de los 4 perfiles.

## Resultado en una línea
Muy buen nivel: 0 errores de consola, sin scroll horizontal, tipografía correcta (Bricolage + DM Sans), **contraste AA sin violaciones**, áreas táctiles ≥ 44 px en la estación, checklist D-036 y Medido/Estimado bien. **0 bloqueantes**, 3 importantes, varios menores.

| Recorrido probado | Resultado |
|---|---|
| Cliente: Inicio, Mapa, Reservas, Perfil | OK. Perfil con Score, niveles «de ejemplo», 10 packs → 1 gratis |
| Comercio Base: carta por foto → publicar → confirmación → cliente → reservar → pagar → QR | OK de punta a punta |
| Smart (1180×820): Hoy, Retiros, Impacto, Cuenta, Estación | OK |
| Intelligence (1440×900): Hoy, Retiros, Intelligence, Cuenta | OK |
| Consola / requests fallidos | 0 |

## Importantes

**I-1 · Incoherencia entre lo que publica el comercio y lo que reserva el cliente.** El comercio publica «2 packs: 1 × Pack chico $1.000 c/u (facturas surtidas) …· te quedan $2.625 si se venden todos» (`flujo-3-publicar-m.png`, `flujo-4-confirma-m.png`). Al ir a «Ver cómo lo ve el cliente» aparece **«Pack sorpresa de panificados · $2.500»** con foto de pan de campo (`flujo-5-cliente-m.png`, `flujo-7-reservar-m.png`). El recorrido de demo no cierra el círculo (producto, precio y foto distintos). Además el pack de referencia D-015 ($6.100 / valor $12.200) solo aparece en el mapa y listado, no en este recorrido (es la PREGUNTA 1 del handoff → decide Octavio, ver abajo).

**I-2 · El mapa viola AA: elementos interactivos anidados (axe `nested-interactive`, serious).** `div[title="Panadería La Espiga"]`, `div[title="Café Plaza"]`… (8 nodos, `app/js/mapa.js`). Los marcadores del mapa no son operables bien por teclado/lector de pantalla. Arreglo: marcador = un único `<button>` con `aria-label`, sin hijos interactivos.

**I-3 · Dependencia de CDN en la primera visita.** Mapa, QR y PDF cargan librerías externas; el propio handoff lo reconoce. Si en la presentación no hay conexión, esas pantallas fallan. Arreglo: vendorizar los scripts/estilos en `app/vendor/` y precachearlos en `sw.js`. (Verificar también con el celular en modo avión tras instalar la PWA.)

## Menores
- **M-1 · Estación Smart en tablet con la mitad inferior vacía** (`smart-estacion-t.png`): panel «En la balanza» y balance arriba, ~50% de pantalla sin uso en 1180×820. Rellenar con el registro del día o centrar verticalmente.
- **M-2 · «Smart» y «Intelligence» en pantallas grandes usan la columna de celular en Hoy/Retiros** (`smart-1-Hoy.png`, `intel-2-Retiros.png`): columna de ~390 px centrada en 1180/1440. Es coherente con «app de celular», pero en escritorio se ve vacío a los lados; considerar fondo o ancho máximo más intencional.
- **M-3 · La barra de pestañas flotante tapa contenido al final de cada pantalla** (por ejemplo «Fuentes de datos» en Intelligence, 1440): agregar `padding-bottom` equivalente a la altura de la barra.
- **M-4 · El botón «Falta 1 precio» (carta) no explica qué hacer**: el comercio tiene que tocar la fila marcada «$ ?». Cambiar el rótulo a «Completá el precio de Tarta de ricota» o resaltar la fila.
- **M-5 · «Descartado / Costo evitado $26.400» en Intelligence**: «evitado» aplica a costo, no a CO₂, y está bien; solo confirmar con Octavio que el término no se confunda con «CO₂ evitado».
- **M-6 · Fotos de categorías:** «Viandas» muestra coliflor y uvas (no una vianda) y «Sándwiches» una imagen con una cruz de pan (parece un error visual). Cambiar por fotos más claras.
- **M-7 · Detección de foto:** el texto dice «Medialuna de manteca ×5 · Factura surtida ×2» sobre una foto que muestra más variedad (medialunas y facturas con chocolate). OK para demo; si se puede, que la foto coincida.

## Copy y marca (contra `fuente/09`, D-013, D-015, D-016, D-028, D-029, D-036, D-039)
OK ✔ voseo («Mostrame lo que hay cerca», «Cargá tu carta»); huella «asociada (estimada)» con 2,53 kg CO₂e/kg (12,5 kg → 31,7 kg ✔; 7,8 kg → 19,7 kg ✔); huella hídrica solo en Intelligence (D-013); no aparece «CO₂ evitado»; comisión 25% y neto $45.000 de $60.000 coherentes; checklist al tocar Publicar con las 3 confirmaciones (D-036) y alérgenos precargados (D-034); sin límite de publicación ni visor 3D (D-039); «Registro simulado / Datos simulados / Modo demo» rotulados; valores del Score como «niveles de ejemplo» (siguen siendo PROPUESTA). Sin «75%» expuesto en la UI del comercio fuera de la comisión; precios de planes USD 300 / 800 (IVA pendiente, A8).

## Anti «AI slop» (CLAUDE.md §9.10)
Aprobado en lo revisado en capturas: sin destellos ni degradé violeta visibles, sin emojis como íconos, tipografías de marca, fotos reales. Detalle de diseño a pulir: la barra flotante con botón circular se parece a apps de delivery conocidas (es una elección del handoff «estilo Rappi»; está bien si es intencional).

## Preguntas para Octavio (vienen del handoff de App)
1. ¿Todos los packs de ejemplo deben rondar los ARS 6.100 (D-015)? Hoy los de la carta son ~ARS 2.500.
2. ¿Vista «kiosco» a pantalla completa para la tablet Smart?

## Lo que sigue
Ronda 2: reverificar I-1 a I-3 cuando App avise; probar la PWA instalada en un celular real (no se puede desde este entorno).

---

# Ronda 2 · 2026-11-09 · `claude/aprovecho-app` @ `0fd1e93`
Evidencia: `docs/qa/capturas/app-r2/`. Se repitió el recorrido completo en 390×844 **con toda la red externa bloqueada** y axe en Mapa, Inicio, Reservas y Perfil.

| Hallazgo ronda 1 | Estado | Verificación |
|---|---|---|
| **I-1** pack publicado ≠ pack reservado | ✅ Resuelto | El comercio publica «1 × Pack chico $2.500 (5 u de medialuna de manteca)»; el cliente ve, reserva y paga exactamente «5 u de medialuna de manteca $2.500» con foto de medialunas y el QR repite «Pack chico · Panificados · $2.500» (`r2-5-cliente-m.png`, `r2-7-reservar-m.png`, `r2-9-qr-m.png`) |
| **I-2** mapa con interactivos anidados | ✅ Resuelto | axe en Mapa: **0 violaciones**; marcador = un solo `role=button tabindex=0` sin hijos interactivos |
| **I-3** dependencia de CDN | ✅ Resuelto | Con red externa bloqueada: fuente Bricolage Grotesque OK, flujo completo sin errores, **0 hosts externos pedidos** salvo las teselas del mapa (`tile.openstreetmap.org`, esperado). `app/vendor/` + `sw.js` v4 |
| axe en Inicio, Reservas, Perfil | ✅ 0 violaciones | — |

**Nuevos / menores (no bloquean):**
- **M-8 · El mapa y el listado siguen mostrando packs de $6.100** («Panadería La Espiga · Pack mediano · $6.100») mientras el recorrido del comercio publica $2.500. Es la PREGUNTA 1 (¿packs de ejemplo ~ARS 6.100?). Si Octavio dice que sí, subir también el pack publicado por la demo.
- **M-9 · Los marcadores del mapa no tienen nombre accesible explícito** (`aria-label` ausente; axe no lo marca porque el contenido es el precio). Sumar «Panadería La Espiga, $6.100, a 350 m».
- Siguen abiertos de la ronda 1: M-1 a M-7 (no se re-verificaron; son de diseño).

**Veredicto:** sin bloqueantes ni importantes pendientes. App lista para integrar salvo las decisiones de Octavio y la prueba de la PWA instalada en un celular real (no se puede hacer desde este entorno).

> **Nota 2026-11-09 (landing v2):** la app no tuvo commits nuevos desde `0fd1e93`; el veredicto de la ronda 2 se mantiene.

> **Aprobación final 2026-11-09:** `claude/aprovecho-app` @ `0fd1e93` sin cambios desde la ronda 2 → ✅ **aprobada para integrar**. Pendientes fuera de QA: packs de ejemplo ~ARS 6.100 (M-8), vista «kiosco» en tablet y prueba de la PWA instalada en un celular real.
