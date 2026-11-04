# Handoff · App · prototipo navegable

- **Fecha:** 2026-11-04
- **Agente / sesión:** codex-app · Codex
- **Rama y commits:** `codex/aprovecho-app` · base de integración `9ad0e33` y código de origen `3ed4bb8`.

## Qué hice

- Importé la v3.2.1 y adapté la marca, el precio del pack, la comisión y los planes al brief 04.
- Vinculé publicación con foto y detección de cantidades, checklist, reserva, pago simulado y retiro. Agregué cancelación con reintegro, reporte con foto, fidelización y Score de muestra.
- Sumé estación Smart horizontal y panel Intelligence de escritorio. El CSV se valida localmente, marca vencimientos y abre propuestas que pasan por el mismo checklist.
- Incorporé 11 fotos reales con crédito y tomé capturas del prototipo. Verifiqué en Edge las cuatro vistas, la publicación, el pago fallido y el retiro, el pesaje y la importación de CSV válido e inválido.

## Entregables (rutas)

- `app/README.md` · Arranque y recorrido.
- `app/` · Prototipo.
- `app/capturas/` · Pantallas principales.
- `app/img/CREDITOS.md` · Origen de las fotos.

## Decisiones que tomé (o que propongo)

- Seguí el punto de partida v3.2.1 del brief con la autorización general del usuario. Conservé los flujos opcionales de la v3.2.1 que Claude dejó por definir.
- Apliqué D-012 a D-015 como reglas de la demo. Usé DM Sans como variable temporal de interfaz, en línea con el PR de Identidad.

## Supuestos usados (no están en la fuente)

- Historial, sucursales, inventario, precios de carta de ejemplo y detección son datos de demo. El pronóstico ilustrativo usa cuatro semanas simuladas. La alerta de inventario se activa a tres días en esta demo.
- Score y niveles son las propuestas de UX. El referido se simula desde un solo perfil, y el informe de analistas es de muestra.

## Pendientes y bloqueos

- Revisión de producto e integración en la rama líder. Para la versión pública, quedan por definir las funciones opcionales de v3.2.1, la fórmula definitiva de Score y las propuestas de UX.
- Las pruebas del recorrido usaron el código alternativo de cuatro letras. Mapa, QR visual y PDF dependen de los recursos CDN de la v3.2.1.

## Qué necesita el próximo agente

- Usar `app/capturas/` como referencia para los videos. El recorrido se abre según `app/README.md`.

## Costo aproximado de este bloque

- Generaciones externas (imágenes, video, voz): ninguna.
- Observaciones: fotografías de stock y entorno local.
