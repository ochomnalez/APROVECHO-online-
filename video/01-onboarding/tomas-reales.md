# Tomas reales con personas · Onboarding

> Pedido de Octavio (9/11): donde aparecen personas, que sea **una toma real en movimiento**, no una foto con zoom.
> Son **2 clips** (más 1 opcional). Se generan con una app externa de video con IA (ver "Herramientas"). Sin texto, sin logos, sin subtítulos dentro del clip.

## Formato común
16:9, 1080p, 24–30 fps, 6–8 s por clip, sin audio (el montaje pone voz y música), cámara estable, luz natural cálida, color realista (sin filtro "de IA": sin piel de plástico, sin manos deformes).

## PENDIENTE DE VALIDACIÓN: fotos de partida (video/01-onboarding/referencias-tomas.png)
Octavio pidió (9/11) **partir de las fotos del entregable final** (no inventar escenas) y que en **Smart e Intelligence se vea bien la balanza con la cámara/tablet**. Antes de generar nada, él valida cuáles:
| Foto | Origen | Uso propuesto |
|---|---|---|
| A · Smart, estación de pesaje | `docs/fuente/imagenes/11-1-2-smart-estacion-pesaje.jpg` | Escena Smart: toma real usando balanza + tablet |
| B · Intelligence, estación en supermercado | `docs/fuente/imagenes/11-1-3-intelligence-estacion-supermercado.jpg` | Escena Intelligence |
| D · Base, propuesta en celular | `docs/fuente/imagenes/11-1-1-base-propuesta-en-celular.jpg` | Escena Base: publicar desde el celular |
| F · celular sobre caja | `docs/marca/imagenes-aprobadas/foto-celu-caja.jpg` | Apertura y foto del excedente |
| E · balanza + tablet | `docs/marca/imagenes-aprobadas/estacion-balanza-tablet.jpg` | Alternativa para Smart |
| C · Smart con dashboard | `docs/fuente/imagenes/11-1-2-smart-estacion-dashboard.jpg` | Alternativa (pantalla con informe) |
Método: **imagen a video** (se anima la foto validada: la persona, la balanza y la tablet son los mismos), no escenas nuevas.

## Toma A · Apertura (escena 1, 0–6 s)
**Prompt:** Cinematic shot inside a small neighborhood bakery in Buenos Aires at closing time, warm late-afternoon light through the window. A baker in his mid-30s, dark green apron, stands behind the counter looking at a wooden tray of leftover croissants and facturas. Calm, neutral expression, a quiet end-of-day mood. Slow gentle dolly-in, shallow depth of field, natural color grade, realistic hands and skin, no text, no logos.
**Uso:** a la izquierda queda un degradé verde oscuro para el texto, así que el sujeto tiene que estar hacia la **derecha** del cuadro.

## Toma B · Foto del excedente (escena 4, 0–2,4 s)
**Prompt:** Over-the-shoulder shot of a bakery worker in a dark green apron holding a smartphone above a cardboard box with croissants and a sandwich on a marble counter, taking a photo from above. The phone screen glows slightly. Natural hand movement, shallow depth of field, warm light, realistic hands, no text, no logos.
**Uso:** el clip tiene que terminar con el celular **centrado y de frente**, porque ahí empalma con la pantalla de la app.

## Toma C (opcional) · Retiro (escena 6)
**Prompt:** A neighbor in casual clothes picks up a small paper bag at a bakery counter while the baker scans a QR code on the customer's phone. Friendly, calm, natural movement, warm light, realistic hands, no text, no logos.

## Herramientas (a validar con Octavio: costo y créditos)
Estado al 9/11: ElevenLabs necesita **plan pago** para video y Higgsfield tiene **0 créditos**; hay que conectar otra app o cargar créditos.
| Opción | Por qué | Costo |
|---|---|---|
| Veo 3.1 (Google Flow / Gemini) | El más realista para manos, celulares y gente | Plan de Google AI o créditos |
| Kling 3 / Kling 4 | Muy bueno en movimiento humano y clips de hasta 15 s | Créditos propios o vía Higgsfield |
| Runway Gen-4.5 | Control de cámara, salida sin audio | Plan mensual |
Recomendación: **Veo 3.1** para A y B (2–3 intentos por toma).

## Cómo se enchufan
Guardar los clips en `video/public/tomas/` y completar `TOMAS` en `src/Onboarding.jsx` (`apertura: 'tomas/apertura.mp4'`, `foto: 'tomas/foto.mp4'`). Hasta entonces el video usa la foto aprobada.
