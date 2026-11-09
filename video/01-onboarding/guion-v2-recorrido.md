# Onboarding v2 · Recorrido completo de la app (propuesta, 9/11)

> Cambio de enfoque pedido por Octavio: **no es una publicidad, es un onboarding**: muestra cómo el comercio empieza, cómo funciona y el recorrido de la app con **pantallas reales** (prototipo nuevo, basado en las 61 pantallas de `docs/ux/referencias-app-v3/`). Primero Base, después Smart y al final Intelligence.
> Duración: **máximo 2:00** (pedido de Octavio, 9/11). Cada pantalla dura 2–4 s; el ritmo es ágil. Voz seria y sobria; música sobria. Sin mencionar 75% ni 25% (D-031).

## Capítulos y pantallas
| # | Seg. | Qué pasa | Pantallas reales (ruta del prototipo) | Toma con personas |
|---|---|---|---|---|
| 0 | 0:00–0:06 | Apertura: el comercio abre la app por primera vez | `bienvenida` ("Entrar como local") | **Clip 1** (foto nueva): empleado abre la app en el celular |
| 1 | 0:06–0:22 | **Primeros pasos**: elegir plan, cargar la carta con una foto, datos del local, pantalla Hoy | `b/plan` · `b/carta` (foto de la lista de precios) · `b/local` · `b/hoy` | — |
| 2 | 0:22–0:50 | **Base · publicar con una foto**: sacar la foto, la IA reconoce y cuenta, (duda), revisar y publicar con la confirmación | `b/camara` · `b/analizando` · detección con cajas · `b/duda` · `b/revisar` (checklist en "Publicar", D-036) · `b/publicado` | **Clip F** (saca la foto) y **Clip D** (toca Publicar) |
| 3 | 0:50–1:08 | **Base · vender y cobrar**: el vecino ve el pack, reserva, paga y retira con QR; el comercio escanea | `c/pack` · `c/pago` · `c/reserva` (QR) · `b/retiros` · `b/escanear` · retiro validado | **Clip 2** (foto nueva): retiro con QR en el mostrador |
| 4 | 1:08–1:16 | **Base · tus números**: impacto, medido vs estimado, descargar informe | `b/impacto` · `b/reporte` | — |
| 5 | 1:16–1:34 | **Smart · la estación**: enchufar la balanza con cámara, pesar, "para vender" o "a la basura" con motivo | `b/estacion` (vacía y pesando) · `b/merma` · `b/hoy` con la tarjeta de balanza · `b/equipos` | **Clip 3** (foto nueva apagada → A2): enchufa, se prende y pesa |
| 6 | 1:34–1:56 | **Intelligence · varias sucursales**: animación de sucursales que se conectan a un panel central; resumen, sugerencias, detalle de una sugerencia, ranking por sucursal | `b/intel` (Resumen · Sugerencias · Datos · Sucursales) · `b/sugerencia` | **Clip B2** (tomates, 0,76 kg) + **animación mía** de sucursales |
| 7 | 1:56–2:00 | Cierre con el sello oficial y "Sumá tu comercio" | logo oficial | — |

## Huecos a resolver (honestos)
- El prototipo **no tiene pantalla de crear cuenta / iniciar sesión** ni de verificación de habilitación (el plan las menciona). Opciones: (a) mostrar solo la bienvenida y "Entrar como local" (lo que existe) o (b) pedirle a Codex que las agregue. Recomendación: (a), y decirlo en la voz.
- La voz actual (66 s) **no sirve**: hay que escribir y grabar una nueva de ~2 min (unas 270 palabras) en tono serio. ElevenLabs no tiene créditos.
- Pantallas de Smart (tablet) e Intelligence (escritorio) son las del prototipo (D-029), no las de celular de la app vieja.

## Fotos nuevas (prompts para Gemini; adjuntar la foto de referencia indicada)
Todas: foto realista, luz cálida, sin texto ni logos inventados, manos y piel realistas, 16:9.
1. **Estación apagada (OBLIGATORIA)** · referencia: A2.
   > *Same bakery, same worker (curly hair, dark green apron), same marble counter, same scale with the tablet on the support arm, same camera angle as the reference photo. Now the scale display and the tablet screen are OFF (black), the tray is empty, and the worker holds the power cable plug in his hand, about to insert it into the scale. A cardboard box with croissants waits on the counter next to the scale. Photorealistic, warm light, no text.*
2. **Apertura: abre la app (RECOMENDADA, 5 s)** · referencia: D.
   > *Same bakery counter and warm morning light as the reference photo, same worker (curly hair, dark green apron). Over-the-shoulder shot: he looks at his smartphone, which shows a plain bright green welcome screen with a white round seal in the center and one wide button at the bottom, no other text. Tidy counter with a few cardboard boxes. Photorealistic, realistic hands, no extra text or logos.*
3. **Retiro con QR (OPCIONAL: solo si entra en los 2 min; si no, queda con las pantallas)** · referencia: A2 o D.
   > *Same bakery counter and warm light as the reference photo. A female customer in her 30s in casual clothes holds out her smartphone showing a large black-and-white QR code to the same worker (curly hair, dark green apron), who scans it with his own phone; on the counter a plain kraft paper bag. Calm, friendly, natural. Photorealistic, realistic hands, no text or logos.*
4. **Tercera sucursal (OPCIONAL, para la animación de sucursales)** · referencia: B2.
   > *A different food business: a small rotisserie counter with warm prepared dishes in trays, a worker in a dark green apron at a scale station with a tablet on an arm, warm light, photorealistic, no text or logos.*

## Recortes para llegar a 2:00
- Sin pantalla de plan ni de datos del local en detalle: pasan rápido (2 s) dentro de "primeros pasos".
- Del lado del cliente solo 3 pantallas (pack, pago, QR).
- Smart: enchufar, pesar y "a la basura" con motivo; sin la pantalla de equipos.
- Intelligence: animación de sucursales + resumen + una sugerencia + ranking.
