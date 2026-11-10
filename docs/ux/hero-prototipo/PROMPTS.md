# Imágenes para el hero (idea A + toma cinematográfica de la D)

> **ACTUALIZACIÓN 2026-11-10 (pedido de Octavio): estilo MIXTO.**
> Solo el **paisaje** es foto realista (cielo, campo, trigo, camino, alambrado, árboles). **Todo lo de la cadena va dibujado en código como ilustración animada** (estilo dibujito): vacas, camión, molino/fábrica con chimenea, súper, panadería, tacho y vecinos.
> Referencia aprobada del paisaje: `img/referencia-paisaje-v1.webp` (le gustó el paisaje; los edificios reales sobran).
>
> **Cómo conseguir el fondo (recomendado, mantiene el mismo paisaje):** en Gemini, adjuntá `referencia-paisaje-v1.webp` y pedí:
> *«Edit this photo: remove all buildings, the chimney and its smoke, the car, the cows, the bicycles, the benches and the electric poles. Keep the sky, the light, the wheat fields, the dirt road, the fence and the trees exactly the same. Fill the removed areas with matching grass and field. No text.»*
> Pedí también la versión vertical 9:16 con la misma edición. Guardalas como `panorama.jpg` y `panorama-celu.jpg`.
>
> Si preferís generarla de cero: *«Photorealistic wide panoramic landscape at golden hour in the Argentine pampas: a dirt country road winds from the far horizon to the foreground through golden wheat fields and green pasture with a wire fence and a few trees. NO buildings, NO vehicles, NO animals, NO people. Keep flat empty grass areas next to the road on the far left, at the middle bend and on the right foreground. Large sky with soft clouds. 21:9.»*
>
> **Tomas del zoom (3 a 5):** la calle puede ser la panadería dibujada (la cámara entra en el dibujo); el **mostrador y el vecino conviene que sean fotos reales** (la comida tiene que verse real, regla de la marca). Los prompts 3, 4 y 5 de abajo siguen sirviendo para el interior. **Los prompts 1 y 2 de abajo quedan reemplazados por esta nota.**


> Para Octavio. Generalas en la app de Gemini en este orden, **sin texto ni logos en la imagen** (los íconos, flechas y el sello los pongo yo en código). Pasámelas por el chat con estos nombres.

## Cómo se usan
Al entrar: la **panorámica** (estilo Mercury) con nubes, humo, camión e íconos CH₄ / CO₂ / agua en movimiento.
Al bajar: la cámara **avanza por la ruta hasta la panadería** (tomas 3 y 4, como un zoom de cine) y ahí la comida se bifurca: el tacho o los vecinos (toma 5). Cierra con el sello APROVECHO.

## Consejo para que todas parezcan el mismo lugar
Generá primero la **1**. Para la 2 a la 5, **adjuntá la 1 como imagen de referencia** y empezá el pedido con: *«Same place, same bakery and same light as the reference image.»*

| # | Archivo | Formato | Para qué |
|---|---|---|---|
| 1 | `panorama.jpg` | 21:9 horizontal (o 16:9 si no deja) | Fondo del hero en computadora |
| 2 | `panorama-celu.jpg` | 9:16 vertical | Fondo del hero en celular |
| 3 | `calle.jpg` | 16:9 | Primer paso del zoom: la fachada de la panadería |
| 4 | `mostrador.jpg` | 16:9 | Segundo paso: la bandeja que sobró al cierre |
| 5 | `vecinos.jpg` | 16:9 | Final: alguien retira su bolsa en la panadería |

## Prompts (copiar y pegar)

**1 · panorama.jpg**
> Photorealistic wide panoramic landscape at golden hour in the Argentine pampas. A winding country road leads the eye from far away to the foreground: on the distant horizon, a golden wheat field and a few grazing dairy cows; in the middle distance, a small flour mill with a brick chimney releasing a thin trail of smoke and a small-town supermarket; in the foreground at the end of the road, a cozy neighborhood bakery with warm light in its window, early evening. Soft scattered clouds, natural colors, documentary photography, 35 mm lens, no text, no signs, no logos. Keep the upper third mostly sky, with no important elements there. 21:9.

**2 · panorama-celu.jpg** (con la 1 de referencia)
> Same place, same bakery and same light as the reference image, recomposed as a vertical 9:16 photo: the road climbs from the bakery at the bottom of the frame toward the mill in the middle and the wheat field with cows near the top. Leave the top quarter mostly sky. No text, no logos.

**3 · calle.jpg** (con la 1 de referencia)
> Same bakery and same light as the reference image, now seen from the street at eye level, about 8 meters away, at closing time: warm light inside, a glass shop window with a few trays of pastries, a quiet sidewalk. Cinematic, shallow depth of field, 35 mm, documentary style. No text on the windows, no logos. 16:9.

**4 · mostrador.jpg** (con la 3 de referencia)
> Inside the same bakery at closing time, close-up of the counter: a metal tray with leftover medialunas, facturas and a few slices of bread, still fresh. Warm evening light, shallow depth of field, cinematic, documentary photography. Keep the right third of the frame calm and uncluttered. No people's faces, no text, no logos. 16:9.

**5 · vecinos.jpg** (con la 3 de referencia)
> Inside the same bakery at closing time, a neighbor in casual clothes picks up a brown kraft paper bag from the counter while the baker (green apron, seen from behind or in profile) hands it over. Warm, natural, candid moment, documentary photography, 35 mm. No visible logos or text, faces not in sharp focus. 16:9.

## Qué evitar (para que no se vea «hecho por IA»)
- Colores saturados, brillos, cielo «de póster», gente sonriendo a cámara, manos raras.
- Textos o carteles inventados (si aparecen, pedí otra o decime y los tapo).
- Si alguna sale rara, mejor generá 2 o 3 y elegí; me podés pasar varias.
