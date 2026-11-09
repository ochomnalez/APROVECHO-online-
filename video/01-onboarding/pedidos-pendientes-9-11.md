# Pedidos de Octavio (9/11, tarde) · estado

| Pedido | Estado |
|---|---|
| Escena nueva: sacarle foto al menú y que la app lo reconozca | Escena armada con las pantallas reales. **Falta el clip con persona** (foto a generar en Gemini, prompt abajo); cuando esté, `CLIPS.menu = true` en `src/Onboarding2.jsx` y copiar `tomas/menu.mp4` |
| El horario de retiro lo elige el comercio, no la IA | Hecho: la voz dice "Vos elegís el horario de retiro" y la pantalla lo resalta ("Lo elegís vos") |
| Condiciones y alérgenos los elige el local, "fácil" | Hecho: "Marcás con un toque las condiciones… y confirmás los alérgenos", con resaltados |
| Dashboard Base: indicadores de CO₂ y huella hídrica | CO₂e: hecho (resaltado "Estimado"). **Huella hídrica**: en la app de Base solo hay CO₂e (D-013: el agua es de Intelligence), se menciona en el capítulo de Intelligence |
| Voz robótica | Mismo locutor (`es-419-training-6`), guion reescrito en lenguaje hablado (frases cortas) |
| Frase final | Nueva: "Ya sabés cómo funciona. Sumá tu comercio y empezá a aprovechar lo que sobra." (3 alternativas en el chat) |
| Capítulo de Intelligence | Hecho: clip B2 + animación de sucursales que se conectan a un panel + panel real (ranking, huella, sugerencias) |
| Toma de gerente en escritorio (opcional) | Foto a generar en Gemini (prompt abajo) |

## Prompts de fotos (Gemini)
**1. Menú (para la escena nueva)** · referencia: D o A2
> *Same bakery, same warm light and same worker as the reference photo (curly hair, dark green apron). He holds his smartphone up toward a chalkboard menu mounted on the wall behind the counter and takes a photo of it. The chalkboard shows six handwritten items with prices, for example "Medialuna $1.000", "Factura surtida $1.000", "Pan de campo $4.500", "Sándwich de miga $1.200", "Torta de chocolate $4.000", "Pan francés $3.200". The phone screen shows a plain green camera viewfinder framing the chalkboard. Photorealistic, realistic hands, no logos.*

**2. Gerente en el escritorio (opcional, para Intelligence)** · referencia: B2
> *A store-chain manager, a woman in her 40s, sits at a desk in a small back office of a supermarket, looking at a laptop that shows a clean dashboard with a bar chart and a list of three branch names. Warm natural light, over-the-shoulder shot, realistic hands, plain background details, photorealistic, no logos, no extra text.*
