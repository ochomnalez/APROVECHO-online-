# APROVECHO · prototipo navegable

*Menos desperdicio, más aprovecho.*

Adaptado desde [Aprovecho v3.2.1](https://github.com/ochomnalez/aprovecho-app/tree/3ed4bb8), commit `3ed4bb8`.

## Abrir la demo

Desde la raíz de este repositorio, ejecutá `python -m http.server 8765 --bind 127.0.0.1` y abrí [la app local](http://127.0.0.1:8765/app/). La raíz del servidor permite cargar los tokens compartidos. Los módulos de la app necesitan HTTP.

- **Consumidor y Base:** elegí un lado desde **Demo**. En comercio, simulá una foto, revisá productos, cantidades y checklist, y publicá. Cambiá a consumidor, reservá el pack y copiá su código de retiro. Volvé a comercio y validalo en **Retiros**.
- **Smart:** cambiá el plan desde **Demo** y entrá a **Estación**. La vista se amplía en tablet horizontal.
- **Intelligence:** elegí ese plan y abrí **Intelligence**. En escritorio vas a ver el panel con navegación lateral. En **Inventario**, podés cargar un CSV local y revisar packs sugeridos.

Los datos se guardan en este navegador. IA, balanza, pagos, inventario inicial y análisis histórico son simulados. La opción **Reiniciar demo** restablece el estado. Para cargar el mapa real y las librerías de QR, PDF y visor 3D en una primera visita hace falta conexión.

## Cambios de la versión final (claude-octi-app, 9/11)

Sin límite de publicación ni visor 3D (D-039). Checklist como confirmación al tocar «Publicar» (D-036). Comisión 25% (D-007). Capturas en `capturas/`. Detalle en `docs/handoffs/2026-11-09-app-final.md`.
