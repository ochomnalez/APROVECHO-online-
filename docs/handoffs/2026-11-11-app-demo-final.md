# Handoff · App · Demo para la entrega

- **Fecha:** 2026-11-11
- **Agente:** codex-octi-app
- **Rama:** `codex/octi-app-entrega`, desde la integración `7e160f7`.
- **PR de revisión:** https://github.com/ochomnalez/APROVECHO-online-/pull/5 (borrador; sin merge).

## Qué hice

El usuario confirmó «Cerrar la demo para la entrega», manteniendo D-006. Recuperé la app ya desarrollada desde la base común `8d89b27` (disponible en `codex/aprovecho-landing`) y cerré sus pendientes. La integración todavía no tenía `app/`; esta rama agrega la app completa sin arrastrar los cambios de landing ni video.

- Consumidor, Base, Smart e Intelligence conservados con sus datos locales.
- D-007: corregido el texto de comisión sin definir; se comunica 25%.
- D-036: una confirmación al tocar Publicar reúne comida del día, cadena de frío y alérgenos de la carta. Cancelar no publica; doble toque no duplica el lote.
- Se aplica D-039 de la base común del 9/11: quitados cuenta regresiva, bloqueo de publicación dos horas antes y visor 3D. La PWA se conserva. Publicación habilitada hasta el cierre; las opciones de retiro no empiezan antes de la hora actual.
- Tipografías aprobadas en D-037 (base del 9/11): Bricolage Grotesque + DM Sans, incluidas localmente. Tokens copiados a `app/css/tokens.css`; la app se puede servir sola.
- QR, escáner, Leaflet y PDF con versiones locales y sus licencias. Sin depender de CDN. Solo las calles nuevas del mapa necesitan internet.
- Enlace para compartir apunta a la ubicación actual, sin enviar a la demo vieja.
- Guía de presentación y prueba reproducible, capturas actualizadas.

## Entregables

- `app/README.md`: apertura, recorrido de presentación, reinicio y límites.
- `app/tests/demo.cjs`: recorrido de regresión en Chromium/Playwright.
- `app/capturas/`: ocho capturas revisadas, incluyendo confirmación y QR sin conexión.

## Verificación

Historia: el comercio publica → el consumidor reserva → se descuenta stock → el comercio valida la entrega → se actualizan reserva y perfil. Todas las operaciones se persisten en localStorage; no hay una API ni un backend real.

| Límite del recorrido | Evidencia |
|---|---|
| Alta y revisión | Lectura de carta, corrección de precio y configuración del local por UI |
| Publicación | Cancelar confirmación mantiene la cantidad de packs; confirmar agrega packs con checklist y 50% de descuento |
| Pago fallido | No crea reserva ni cambia stock |
| Compra y persistencia | Descuenta una unidad; código conservado tras recarga |
| Entrega | Cambia a retirada; rechaza validar el código otra vez |
| Cancelación | Reserva cancelada y una unidad de stock restaurada |
| Smart | Pesaje simulado y publicación con origen estación y peso medido demo |
| Intelligence | CSV cargado y publicación consumiendo inventario |
| Reportes | Descarga de Excel y PDF; ZIP de Excel íntegro (14 entradas) y cabecera PDF válida |
| PWA sin conexión | Instalación y recarga offline, QR renderizado y PDF descargado |
| Reclamo | Foto comprimida adjunta y persistida en reserva retirada |
| Horarios | Publica a las 20:15 con cierre 21:00; bloquea después del cierre |

Resultado: recorrido completo aprobado, sin errores de JavaScript. Capturas revisadas a 390×844, estación a 1180×820 y panel a 1440×900. Sintaxis de todos los módulos y `git diff --check` correctos. Se probaron entradas reales de UI en los pasos transaccionales; las transiciones de rol/vista en la prueba se preparan mediante el estado y el router de la propia app.

## Límites y siguiente paso

- IA, balanza, pagos, históricos y usuarios simulados; los teléfonos no comparten inventario.
- Se validó retiro por código y generación de QR. No se probó una cámara física ni se realizó una auditoría completa WCAG o una prueba en Safari/iOS.
- El mapa usa Leaflet local; las teselas nuevas de OpenStreetMap requieren red. No se afirma una prueba de carga de teselas en este entorno.
- Score y beneficios conservan el carácter demostrativo definido por UX, sin prometer reglas comerciales definitivas.
- Revisión visual final de Octavio e integración por PR. No mergear automáticamente ni publicar: no se pidió un despliegue en este turno.
- La base de integración tiene documentación anterior al 9/11. Las decisiones D-037/D-039 y el estado de landing se consultan en la base común y su rama correspondiente; no se reemplazan aquí los documentos de otros frentes.

## Costo

Sin generaciones, cuentas nuevas ni servicios pagos.
