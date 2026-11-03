# Handoff · UX · Prototipo de app (alcance, flujos, wireframes, Score)

- **Fecha:** 2026-11-03 (entrega comprometida: jue 5/11 12:00; adelantada)
- **Agente / sesión:** UX · session_01YPepJKgdnbFvSwNNSb7n4e
- **Rama:** `claude/aprovecho-ux`

## Qué hice
- Definí el alcance del prototipo: qué funciona, qué se simula y qué queda afuera.
- Flujos en Mermaid de consumidor y comercio, estados (vacío/cargando/error/éxito) y los 4 casos del plan.
- 31 pantallas de wireframe en HTML estático (390×844, grises, copy provisorio) más `index.html` con el mapa de navegación. Links verificados.
- Propuesta de reglas del APROVECHO Score y de los niveles del consumidor.

## Entregables (rutas)
- `docs/ux/alcance-prototipo.md`
- `docs/ux/flujos.md`
- `docs/ux/wireframes/index.html` (abrir este; selector "Soy consumidor / Soy comercio")
- `docs/ux/score-y-niveles.md`

## Decisiones que tomé (o que propongo)
- **PROPUESTA:** Score 0–100 = cumplimiento 40 + reducción de excedente 30 + calidad 15 + transparencia 15; no premia vender más. Niveles por packs retirados: 0/3/10/25/50. Comercio del mes por mayor mejora, no por ventas.
- **PROPUESTA:** el QR no valida fuera de la franja de retiro.
- Smart muestra el destino del excedente (D-012); el consumidor ve solo CO₂e (D-013); checklist de 3 ítems (D-014); datos de ejemplo según D-015.
- No toqué `docs/decisiones.md`: el líder decide si registra las propuestas.

## Supuestos usados (no están en la fuente)
- Pack ≈ 1 kg (solo para los ejemplos del perfil y el dashboard).
- Cancelación medida contra el inicio de la ventana de retiro.
- Nombres de locales y personas ficticios.

## Pendientes y bloqueos
- **Landing (`docs/ux/landing-wireframe.md`):** falta `docs/marketing/landing-contenido.md`; en `origin/claude/aprovecho-marca` todavía no está. Lo hago cuando llegue o, si a las 18:00 del jue 5/11 no está, con la estructura de `docs/fuente/06`.
- Sin correr las skills de auditoría de diseño; el control fue manual (táctiles ≥ 44 px, contraste, etiquetas de texto).

## Preguntas para el usuario
1. ¿Se aprueban los pesos del Score (40/30/15/15) y los umbrales de niveles?
2. ¿Los niveles dan beneficios solo simbólicos o hay presupuesto de descuentos (A3)?
3. En Base el excedente real no se mide: ¿pedimos un "¿cuánto tiraste hoy?" semanal para mejorar el Score?

## Qué necesita el próximo agente
- **Identidad/UI:** estos wireframes son sin estilo; el copy es provisorio. Mantener las etiquetas Estimado/Medido y las áreas táctiles ≥ 44 px.
- **Desarrollo de app:** simular IA, mapa, pago y QR; el estado de los packs sí debe cambiar entre vistas.

## Costo aproximado de este bloque
- Generaciones externas: ninguna.
