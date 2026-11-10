# Hero de la landing · «El ciclo de la comida» · 4 ideas

> `claude-octi-qa` (Diseño) · 2026-11-10 · Pedido de Octavio: portada con foto grande de fondo y algo de movimiento (tipo Mercury), que muestre el ciclo de la comida y su impacto ambiental, y a APROVECHO como la solución en el centro.
> Referencias que pasó: Mercury (foto panorámica con un camino que lleva la mirada), infografía «Ciclo de nutrientes» (círculo de flechas con estaciones) y fábrica en miniatura realista sobre fondo blanco.

## La historia (la misma para las 4 ideas)
**Campo** (trigo + vacas del tambo) → **camión** → **molino/fábrica** → **camión** → **súper** → **panadería** → al cierre, la comida se bifurca: **tacho de basura** ✕ o **vecinos con su pack** ✓. En el centro del círculo, **APROVECHO**.

Íconos que flotan sobre cada estación (dibujados en código, sin emojis):
| Dónde | Ícono | Qué dice |
|---|---|---|
| Vacas | **CH₄** | metano (fermentación) |
| Camiones | **CO₂** | combustible |
| Fábrica | **CO₂** + **gota** | energía y agua |
| Campo | **gota** | agua de riego |
| Tacho de basura | **CH₄** | la comida que se pudre genera metano (`fuente/02`, ODS 13) |

**Mensaje honesto (regla de la marca):** tirar comida es tirar todo lo que costó producirla: agua, campo, camión, fábrica. APROVECHO no «borra» esas emisiones (ya ocurrieron; `landing` ya aclara que la huella asociada no equivale a emisiones evitadas). Lo que hace es que esa comida **llegue a alguien** en vez de al tacho. Sin cifras en el hero; si se pone una, solo las de la fuente: **2,53 kg CO₂e** y **192 litros de agua** por kg de comida (FAO, `fuente/04`), rotuladas «huella asociada · estimado».

Texto propuesto (≤ 8 palabras): **«Cada pan viene de lejos. Que no termine acá.»** o **«Menos desperdicio, más aprovecho.»** + CTA «Sumá tu comercio».

---

## Idea A · «El camino» (estilo Mercury) — **recomendada**
Foto panorámica realista a pantalla completa, luz de amanecer. Una **ruta que serpentea** desde el fondo (campo de trigo y vacas, a lo lejos) hasta el primer plano (la panadería del barrio, de noche con luz cálida). En el medio del recorrido: el molino con su chimenea, un súper. El texto va arriba, en el cielo, como en Mercury.
- **Movimiento:** nubes que se desplazan lento (2 capas, parallax), humo de la chimenea, un camioncito que recorre la ruta en loop, íconos CH₄ / CO₂ / gota que flotan y respiran sobre cada punto, una línea punteada que se dibuja siguiendo la ruta.
- **El final:** frente a la panadería, la línea se bifurca: hacia un tacho que se apaga (✕, con CH₄) y hacia unos vecinos con bolsa, donde aparece el sello **APROVECHO** dentro del anillo de 3 flechas (Recuperá · Medí · Anticipá, que ya existe en la v2).
- **Mobile:** recorte vertical de la misma imagen centrado en la ruta (la panadería abajo, el campo arriba); se quitan el camión y una capa de nubes.
- **Por qué:** es lo que pediste («foto grande de fondo con movimiento»), tiene una sola idea clara (el camino de la comida) y el camino obliga a mirar hasta APROVECHO.
- **Riesgo:** que la imagen generada se vea «IA». Mitigación: luz y paleta naturales, sin brillos raros, y retoque manual del recorte.

## Idea B · «La isla» (diorama en miniatura sobre blanco)
Como la fábrica de referencia: una **maqueta realista vista desde arriba en diagonal**, flotando sobre el fondo blanco de la v2. Es una isla circular: el campo, el molino, el súper y la panadería están en el borde y una ruta circular los une. En el centro de la isla, el sello APROVECHO.
- **Movimiento:** humo, nubecitas que pasan por arriba de la maqueta, camioncitos que dan la vuelta, íconos flotando, la isla gira apenas (± 3°) con el mouse.
- **Mobile:** la isla entra entera, más chica; texto arriba.
- **Por qué:** combina perfecto con la v2 (blanca, anillo) y se lee como **ciclo** de verdad (círculo cerrado).
- **Riesgo:** «miniatura 3D» puede rozar el estilo 3D de stock (prohibido por la regla anti «AI slop»). Solo vale si se ve fotográfico, no de render.

## Idea C · «Infografía viva» (círculo de flechas)
Fondo blanco, **6 objetos realistas recortados** (vaca y trigo, camión, molino, góndola, panadería, bolsa con vecino) en un **anillo de flechas** como la infografía de nutrientes; en el centro, APROVECHO. Chips CH₄ / CO₂ / agua junto a cada uno.
- **Movimiento:** las flechas se dibujan en orden, cada objeto aparece con un rebote corto, el humo y los chips se mueven.
- **Por qué:** es la más **clara** y la más barata (6 recortes chicos).
- **Riesgo:** es la que más se parece a una plantilla escolar; menos «wow» que A o B.

## Idea D · «Del tacho al campo» (zoom con el scroll)
El hero arranca en **primer plano de una panadería al cierre**, con una bandeja de facturas camino al tacho. Al scrollear, la cámara **se aleja** y aparece todo lo que hubo detrás: súper, camión, fábrica, campo. Cuando se ve el ciclo entero, la bandeja cambia de rumbo hacia los vecinos y aparece APROVECHO.
- **Por qué:** la más cinematográfica; la historia se cuenta sola.
- **Riesgo:** la más cara y compleja (varias imágenes que encajen en el zoom) y la más difícil de hacer rápida en mobile. No llega bien al jueves 12/11.

---

## Cómo se produciría (para A o B)
1. **Una imagen base** generada (panorámica 21:9 + recorte vertical 9:16 para mobile). Sin texto en la imagen: los íconos, el sello y las flechas van **en código** (SVG/CSS), así se ven nítidos y se pueden animar.
2. **Capas en código:** nubes (2 PNG transparentes o SVG difuminado), humo (partículas CSS), camión (recorte PNG que sigue una ruta SVG), íconos CH₄ / CO₂ / gota, línea punteada que se dibuja, sello APROVECHO.
3. **Rendimiento:** imagen WebP de unos 200 KB, animaciones solo con `transform`/`opacity` y pausadas fuera de pantalla; con `prefers-reduced-motion`, todo quieto. Objetivo: Lighthouse ≥ 90 (hoy la v2 da 99).
4. **Costo estimado:** con Gemini (la API ya está conectada en este entorno) ~USD 0,04 por imagen; 4 variantes de la idea elegida ≈ **USD 0,20**. Alternativa sin costo: la generás vos en la app de Gemini con los prompts de abajo y me la pasás.

### Prompt base (idea A, en inglés para el generador)
> Photorealistic wide panoramic landscape at golden hour, Argentine pampas. A winding country road leads the eye from a distant golden wheat field with a few grazing dairy cows on the horizon, past a small flour mill with a brick chimney releasing light smoke, then a small town supermarket, ending in the foreground at a cozy neighborhood bakery with warm window light at dusk. Soft clouds, natural colors, documentary photography style, 35mm, no text, no logos, no people in close-up, large empty sky in the upper third for headline text. 21:9.

### Prompt base (idea B)
> Photorealistic tilt-shift miniature diorama of a circular island seen from a 30-degree aerial angle on a pure white background: a wheat field with tiny dairy cows, a flour mill with a chimney, a small supermarket and a neighborhood bakery placed around the edge, connected by a ring road with tiny trucks; the center of the island is an empty small plaza. Natural daylight, soft shadows, realistic materials (brick, metal, grass), no text, no logos. 1:1.

## A decidir por Octavio
1. ¿Idea A, B, C o D (o una mezcla, p. ej. A con el anillo de B en el final)?
2. ¿OK para generar 4 variantes de la elegida (~USD 0,20 con la API de Gemini) o las generás vos?
3. ¿Texto del hero: el slogan o «Cada pan viene de lejos. Que no termine acá.»?

Después de tu elección: armo el prototipo animado con la imagen y se lo paso a la sesión Landing para que lo integre (la carpeta `landing/` es de esa sesión).
