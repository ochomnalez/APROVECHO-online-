# Handoff · landing · actualización de Economics en Inversores

- **Fecha:** 2026-11-11 (Argentina).
- **Agente:** codex-octi-landing.
- **Rama:** `codex/aprovecho-landing`.

## Qué hice

Actualicé exclusivamente el panel Inversores de la landing con videos nuevos, según el Excel adjunto: margen por pack, contribución, LTV/CAC, financiamiento, inversión total, payback, VAN/TIR, resultados, caja acumulada, inversión inicial, impuestos y sensibilidad. Mercado en cantidades según las hojas TAM/SAM/SOM. Los datos se presentan como proyecciones.

## Entregables

- `landing/src/v5/partials/inversores.html` y `landing/v5.html` generado.
- `landing/src/v5/investor-economics.json` con cifras y celdas fuente; `investor_charts.py` con dos gráficos responsive usando el diseño existente. Una llamada en `build_v5.py` aplica esos gráficos solo a la v5.
- Libro original conservado en `docs/fuente/originales/ECONOMICS-APROVECHO-actualizado-2026-11-11.xlsx`; resumen y referencias en `docs/fuente/08-economics-actualizado-2026-11-11.md`.

## Verificación y alcance

- Build y diff correctos. Solo cambian `index.html` y `v5.html` en el paquete de 141 archivos; fuera del elemento `#inversores`, el HTML es idéntico byte a byte. Otros 139 archivos (incluidos videos, imágenes, CSS y JS) conservan su SHA-256.
- Playwright: 8 pestañas, tablas y 2 gráficos visibles verificados a 390 y 1440 px; sin errores de consola, solicitudes fallidas ni respuestas HTTP erróneas. Los bloques de Modelo y los gráficos se limitan al ancho de su contenedor dentro de Inversores para evitar recortes en celular. Tablas anchas con scroll horizontal existente.
- Datos contrastados con las celdas del libro. EBITDA, FCF acumulado, VAN, TIR, payback y sensibilidad verificados.
- La v4, la app y la landing original estable no se modifican.

## Decisiones y supuestos

Excel nuevo como fuente principal autorizada. No se recalculan ni corrigen sus hipótesis comerciales. Se mantiene la advertencia de anualización de abonos en 2027; se conservan las secciones no económicas dentro de Inversores. No se cambia nada fuera de ese panel.

## Pendientes y bloqueos

Publicar en el proyecto existente `aprovecho-landing-videos` y confirmar READY y alias. Google Doc sin permiso de lectura; se trabajó con el Excel completo, según la prioridad indicada por el usuario. El entorno ha bloqueado anteriormente las URLs públicas vercel.app; diferenciar pruebas locales de la verificación por API.

## Próximo agente

Usar las cifras nuevas y su trazabilidad, no el Economics histórico. No desplegar esta actualización en el proyecto estable `aprovecho-landing` salvo pedido nuevo.

## Costo

Sin generación de imágenes, voces ni videos; sin nuevos servicios.
