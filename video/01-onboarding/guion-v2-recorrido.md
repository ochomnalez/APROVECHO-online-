# Onboarding v2 · Recorrido completo de la app (propuesta, 9/11)

> Cambio de enfoque pedido por Octavio: **no es una publicidad, es un onboarding**: muestra cómo el comercio empieza, cómo funciona y el recorrido de la app con **pantallas reales** (prototipo nuevo, basado en las 61 pantallas de `docs/ux/referencias-app-v3/`). Primero Base, después Smart y al final Intelligence.
> Duración propuesta: **~3 min** (recortable). Voz seria y sobria; música sobria. Sin mencionar 75% ni 25% (D-031).

## Capítulos y pantallas
| # | Seg. | Qué pasa | Pantallas reales (ruta del prototipo) | Toma con personas |
|---|---|---|---|---|
| 0 | 0:00–0:10 | Apertura: el comercio abre la app por primera vez | `bienvenida` ("Entrar como local") | **Clip 1** (foto nueva): empleado abre la app en el celular |
| 1 | 0:10–0:35 | **Primeros pasos**: elegir plan, cargar la carta con una foto, datos del local, pantalla Hoy | `b/plan` · `b/carta` (foto de la lista de precios) · `b/local` · `b/hoy` | — |
| 2 | 0:35–1:20 | **Base · publicar con una foto**: sacar la foto, la IA reconoce y cuenta, (duda), revisar y publicar con la confirmación | `b/camara` · `b/analizando` · detección con cajas · `b/duda` · `b/revisar` (checklist en "Publicar", D-036) · `b/publicado` | **Clip F** (saca la foto) y **Clip D** (toca Publicar) |
| 3 | 1:20–1:50 | **Base · vender y cobrar**: el vecino ve el pack, reserva, paga y retira con QR; el comercio escanea | `c/pack` · `c/pago` · `c/reserva` (QR) · `b/retiros` · `b/escanear` · retiro validado | **Clip 2** (foto nueva): retiro con QR en el mostrador |
| 4 | 1:50–2:05 | **Base · tus números**: impacto, medido vs estimado, descargar informe | `b/impacto` · `b/reporte` | — |
| 5 | 2:05–2:30 | **Smart · la estación**: enchufar la balanza con cámara, pesar, "para vender" o "a la basura" con motivo | `b/estacion` (vacía y pesando) · `b/merma` · `b/hoy` con la tarjeta de balanza · `b/equipos` | **Clip 3** (foto nueva apagada → A2): enchufa, se prende y pesa |
| 6 | 2:30–3:00 | **Intelligence · varias sucursales**: animación de sucursales que se conectan a un panel central; resumen, sugerencias, detalle de una sugerencia, ranking por sucursal | `b/intel` (Resumen · Sugerencias · Datos · Sucursales) · `b/sugerencia` | **Clip B2** (tomates, 0,76 kg) + **animación mía** de sucursales |
| 7 | 3:00–3:08 | Cierre con el sello oficial y "Sumá tu comercio" | logo oficial | — |

## Huecos a resolver (honestos)
- El prototipo **no tiene pantalla de crear cuenta / iniciar sesión** ni de verificación de habilitación (el plan las menciona). Opciones: (a) mostrar solo la bienvenida y "Entrar como local" (lo que existe) o (b) pedirle a Codex que las agregue. Recomendación: (a), y decirlo en la voz.
- La voz actual (66 s) **no sirve**: hay que escribir y grabar una nueva de ~3 min en tono serio. ElevenLabs no tiene créditos.
- Pantallas de Smart (tablet) e Intelligence (escritorio) son las del prototipo (D-029), no las de celular de la app vieja.

## Fotos nuevas (prompts para Gemini; adjuntar la foto de referencia indicada)
Todas: foto realista, luz cálida, sin texto ni logos inventados, manos y piel realistas, 16:9.
1. **Estación apagada (OBLIGATORIA)** · referencia: A2.
   > *Same bakery, same worker (curly hair, dark green apron), same marble counter, same scale with the tablet on the support arm, same camera angle as the reference photo. Now the scale display and the tablet screen are OFF (black), the tray is empty, and the worker holds the power cable plug in his hand, about to insert it into the scale. A cardboard box with croissants waits on the counter next to the scale. Photorealistic, warm light, no text.*
2. **Apertura: abre la app (RECOMENDADA)** · referencia: D.
   > *Same bakery counter and warm morning light as the reference photo, same worker (curly hair, dark green apron). Over-the-shoulder shot: he looks at his smartphone, which shows a plain bright green welcome screen with a white round seal in the center and one wide button at the bottom, no other text. Tidy counter with a few cardboard boxes. Photorealistic, realistic hands, no extra text or logos.*
3. **Retiro con QR (RECOMENDADA)** · referencia: A2 o D.
   > *Same bakery counter and warm light as the reference photo. A female customer in her 30s in casual clothes holds out her smartphone showing a large black-and-white QR code to the same worker (curly hair, dark green apron), who scans it with his own phone; on the counter a plain kraft paper bag. Calm, friendly, natural. Photorealistic, realistic hands, no text or logos.*
4. **Tercera sucursal (OPCIONAL, para la animación de sucursales)** · referencia: B2.
   > *A different food business: a small rotisserie counter with warm prepared dishes in trays, a worker in a dark green apron at a scale station with a tablet on an arm, warm light, photorealistic, no text or logos.*
