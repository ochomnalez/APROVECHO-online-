# Brief de identidad visual · APROVECHO

> Marca y marketing → Identidad visual / UI · v1 · 2026-11-04. Entrega de Identidad: vie 6/11.
> Leer antes: `docs/marca/plataforma-de-marca.md` y `docs/marca/marca-actual.md`. Imágenes de referencia del plan: `docs/marca/referencias-plan/` y `docs/fuente/imagenes/13-*.jpg`.

## 1. Objetivo

Profesionalizar la marca actual (D-011) para que funcione en una landing, una app, tres videos y piezas físicas. Que se vea **muy profesional**, de barrio y cercana, y que **no se confunda con el resto de la categoría** (todos verdes con hoja).

Personalidad a traducir en lo visual: **pícara, práctica, honesta, de barrio, optimista** (arquetipo Vecino + Sabio en B2B).

## 2. Logo: qué se mantiene y qué se corrige

| Se mantiene (D-011) | Se corrige |
|---|---|
| Badge **circular** | Redibujar en **vector** (hoy es raster IA de ~340 px) |
| Paleta de **verdes** como base | **Ícono central ambiguo** (¿pan? ¿bollo?): reemplazar por un símbolo que se lea en 1 segundo. Recomendación: **medialuna** (rubro n.º 1, ícono de campaña, muy argentino) integrada a la **flecha circular** de reaprovechamiento. Alternativa: pack/bolsa con flecha |
| Slogan **"Menos desperdicio, más aprovecho"** en el badge | Texto en arco ilegible chico: el arco va **solo** en la versión badge (≥ 64 px); el isotipo no lleva texto |
| Nombre en mayúsculas | **Una sola tipografía** en el wordmark (sans redondeada con carácter). Se descarta la serif de la portada |
| Marcas "brillo" a los costados | Simplificar o sacar si ensucian en tamaño chico |
| | **Una sola marca**: se eliminan la hoja suelta y los otros símbolos que conviven en el plan |
| | Corregir errores del mockup: "PROVECHO" y "2024" |

**Sistema de versiones a entregar:** badge completo · isotipo (símbolo solo) · wordmark horizontal (isotipo + APROVECHO) · wordmark solo · monocromo (positivo y negativo) · ícono de app · favicon. Con área de resguardo y tamaño mínimo de cada una.

## 3. Color

**Diagnóstico:** el verde solo no diferencia (Cheaf, Buen Provecho y Too Good To Go usan verdes; observación 5 de `marca-actual.md`).

**Recomendación (PROPUESTA): verde bosque como base + un acento cálido propio, "corteza".** El acento viene del producto (medialuna, pan tostado, caja kraft) y es lo que nos hace reconocibles en la categoría.

| Rol | Color de partida | Uso |
|---|---|---|
| Primario | Verde Bosque `#1A4D3A` (se mantiene) | Logo, títulos, fondos de marca |
| Acento propio | **Corteza**: naranja tostado, partir de ~`#E07A2E` y ajustar | CTAs, highlights, ilustración, stickers. Es el color "pícaro" |
| Fondo claro | Crema Natural `#F5F5DC` → revisar hacia un crema más cálido y menos amarillo | Fondos de landing y app |
| Apoyo | Verde Menta `#DFFFD6` (se mantiene, uso moderado) | Fondos de tarjetas, badge |
| Texto | Gris Carbón `#333333` | Texto corrido |
| Estados | Verde medio (éxito) y rojo (error) | UI |

- **Contraste:** todo texto AA mínimo; los CTAs naranja con texto oscuro o blanco según el contraste real.
- **Código "medido / estimado" (transparencia):** hoy los mockups usan durazno para "Estimado". Para no confundirlo con el acento de marca, el código **no depende solo del color**: "Medido" = etiqueta sólida verde con ícono de balanza; "Estimado" = etiqueta con contorno punteado y la palabra "Estimado". Es un elemento de marca en sí mismo (pilar Honestidad).
- Alternativa a evaluar por Identidad: acento amarillo "dorado medialuna". Elegir uno solo y justificarlo.

## 4. Tipografía

**Diagnóstico:** Montserrat + Open Sans es genérica (observación 7).

**PROPUESTA (solo Google Fonts, gratis para web y app):**
- **Títulos:** una grotesca con carácter y terminaciones amables, p. ej. **Bricolage Grotesque** o **Outfit**. Debe convivir con el wordmark.
- **Texto e interfaz:** **Inter** o **DM Sans** (legibilidad en celular, cifras tabulares para los dashboards).
- Si Identidad prefiere mantener Montserrat por continuidad, justificarlo y elevar con pesos y espaciado.
- Números grandes en dashboards: cifras tabulares, peso bold, en verde bosque (como en los mockups).

## 5. Fotografía

- **Real, cálida, de barrio:** mostradores, bandejas, cajas kraft, manos de comerciantes, luz de atardecer (17–21 h, la franja clave).
- Comida **apetitosa y del día**, nunca con aspecto de resto o sobra.
- Personas reales y diversas, sin pose de banco de imágenes. Comerciantes de 40–55, consumidores de 20–35.
- **Evitar:** tachos de basura protagonistas, comida en mal estado, planetas, manos sosteniendo el mundo, hojas verdes decorativas.
- Si se genera con IA: pedir validación antes (CLAUDE.md, sección 6) y cuidar manos, texto y logos falsos.

## 6. Ilustración

- Sistema de **personajes-alimento** simples (medialuna, porción de torta, empanada) para el humor B2C: stickers, estados vacíos de la app, redes. La medialuna es la protagonista.
- Trazo y forma coherentes con el isotipo. Paleta limitada (verde bosque, corteza, crema).
- En B2B, ilustración mínima: diagramas limpios de la escalera Base → Smart → Intelligence.

## 7. Iconografía

- Íconos de línea, trazo redondeado, grosor consistente; derivados de una librería abierta (Lucide o Phosphor) para ganar tiempo.
- Set mínimo: foto/cámara, pack, QR, balanza, reloj/horario, mapa/ubicación, panel, tienda, alérgenos, sin TACC, cadena de frío, check, medido, estimado.
- Indicador de plan: 1, 2 o 3 marcas (Base, Smart, Intelligence), en lugar de un color por plan.

## 8. Aplicaciones prioritarias

| Prioridad | Pieza | Notas |
|---|---|---|
| 1 | **Ícono de app** | Isotipo sobre verde bosque o corteza; probar a 48 px |
| 1 | **Favicon** | 16, 32 px y SVG; isotipo simplificado |
| 1 | **Landing** | Tokens de color y tipo, botones, tarjetas de planes, etiquetas medido/estimado, og:image 1200 × 630 |
| 1 | **App (prototipo)** | Componentes base para UX y desarrollo |
| 2 | **Video** | Cierre de marca (logo animado simple + slogan), tipografía de subtítulos, lower thirds |
| 2 | **Redes** | Plantilla de post 1:1 y 4:5, historia/reel 9:16, avatar |
| 3 | **Sticker de vidriera** | Círculo con logo + QR + "Escaneá y bajate la app"; legible a 2 m |
| 3 | **Bolsa** | Logo + "Bolsa biodegradable y compostable" + cómo desecharla (51% no sabe, 5.2) |
| 3 | Cartel de caja, flyer | Si sobra tiempo |

## 9. Referencias

- **Para diferenciarse (no copiar):** Too Good To Go, Cheaf, Buen Provecho — mirarlas para ver qué hace toda la categoría y **no** hacerlo (verde + hoja).
- **Tono visual buscado:** marcas de comida de barrio con identidad cálida y tipográfica (panaderías de especialidad, cafeterías de autor); fintechs simples y claras para la parte de datos.
- **Del plan:** `docs/fuente/imagenes/13-1-sticker-vidriera.jpg`, `13-1-bolsa-biodegradable.jpg`, `13-3-manual-de-marca-basico.jpg`, `11-1-1-dashboard-base.jpg`, `11-2-app-consumidor-tu-impacto.jpg`.

## 10. Entregables esperados de Identidad

1. Logo vectorial (SVG) en todas sus versiones + mini guía de uso.
2. Paleta con tokens (HEX + nombres) y contraste verificado.
3. Tipografías y escala tipográfica.
4. Componentes UI base (botón, tarjeta, etiqueta medido/estimado, input, navegación).
5. Ícono de app, favicon y og:image.
6. Dos opciones de dirección (badge con medialuna vs. alternativa) si hay dudas, para que el usuario elija.

**Restricción:** no generar imágenes con servicios pagos sin OK del usuario (CLAUDE.md, sección 6).
