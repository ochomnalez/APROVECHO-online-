# Landing v5 · Dirección de diseño («El anillo se abre»)

Firma: `claude-octi-landing` (dirección) · 2026-11-10 · **PROPUESTA: falta el OK de Octavio para construir.**
Storyboard: `storyboard.html` y `v5-1.png` … `v5-5.png` (cuadros clave, no es la página final).

## Idea

El logo es el guion. El anillo de tres flechas (Recuperá · Medí · Anticipá) deja de ser un adorno de la
portada y pasa a ser **la estructura y la navegación de toda la página**: gira en la portada, al bajar
«se abre» y cada flecha se convierte en un capítulo. Cada capítulo es un plan y se cuenta con un producto
que **se desarma al hacer scroll**. Un mini anillo fijo arriba a la derecha muestra en qué capítulo estás
y funciona de menú.

## Estructura (reemplaza Cómo funciona + Planes por tres capítulos)

| # | Pantalla | Qué pasa al bajar | Contenido (todo de la fuente) |
|---|---|---|---|
| 1 | **Portada: el anillo vivo** | Fondo con movimiento lento (zoom y paralaje sobre la foto del pasillo). Anillo gigante girando con el sello al centro y tres fotos en órbita. Al bajar, el anillo se agranda y se abre. | Idea de marca, bajada, 2 botones |
| 2 | **El problema** | La cifra 58,4% gigante, «hecha de comida» (la foto se ve dentro de los números) y cuenta hacia arriba. | 58,4%, 35,7%, 52% (encuesta propia) |
| 3 | **01 Recuperá · Base** | Escena fija: las 5 capas de la app se separan una por una (foto → lo que reconoce → packs → QR → la plata). La lista de pasos de la izquierda acompaña. | 5 pasos, precio Base, botón |
| 4 | **02 Medí · Smart** | Escena fija: la estación se desarma pieza por pieza (tablet, soporte, balanza) con rótulos; después aparecen los datos que mide. | Lista Smart, USD 300/mes, botón |
| 5 | **03 Anticipá · Intelligence** | Las piezas del tablero llegan desde los costados y se arman en uno solo; se dibuja la línea medido → anticipado (ilustrativa, rotulada). | Lista Intelligence, USD 800/mes, botón |
| 6 | Mirá cuánto te queda | Como hoy, con la cuenta como «ticket». | Sin 75% ni 25% |
| 7 | Señales + medido/estimado · Preguntas · Alta · Inversores (pestañas) · Lista de espera · Pie | Se mantienen de la v4, con el estilo nuevo. | Igual que v4 |

## Reglas que no cambian

Fondo siempre claro, texto negro, verdes de marca, sin naranja, sello oficial, Bricolage Grotesque + DM Sans,
voseo, sin inventar datos, sin 75%/25%, medido ≠ estimado, sin fotos ni videos generados con IA.

## Reglas técnicas para quien construya

- Se construye en `landing/v5/` (la v4 queda intacta como respaldo en `landing/`).
- Movimiento con **GSAP + ScrollTrigger** alojados en el sitio (licencia libre), solo `transform` y `opacity`.
- Cada escena fija dura como máximo ~250vh de scroll; nunca se «secuestra» el scroll.
- **Celular**: mismas escenas, simplificadas (menos capas en 3D), 60 fps.
- **Movimiento reducido o sin JavaScript**: todo se ve como secciones normales, completas y legibles.
- Accesibilidad AA, foco visible, navegación por teclado, textos reales (no imágenes de texto).
- Lighthouse: ≥ 90 en celular y ≥ 95 en escritorio; sin scroll horizontal en 390/768/1024/1440.

## Reparto de trabajo (modelos más chicos construyen; el director revisa)

1. **Base y portada**: armazón, mini anillo de navegación, portada con anillo vivo y apertura.
2. **Problema + Recuperá**: cifra con foto y escena de capas de la app.
3. **Medí + Anticipá**: estación desarmada y tablero que se arma.
4. **Resto e integración**: secciones heredadas con el estilo nuevo, formularios, SEO.
5. **Pruebas**: capturas, Lighthouse, accesibilidad, funcionamiento.

El director revisa cada entrega contra este documento y el storyboard, con capturas, antes de integrarla.

## Riesgos

- **Plazo**: la entrega es el jueves 12/11. La v4 queda lista como respaldo si la v5 no llega pulida.
- **Fotos de producto**: balanza y tablet siguen siendo de catálogo (provisorias); la escena 4 las usa mucho.
- **Fondo en movimiento**: con la foto actual es un movimiento sutil. Un video real de un comercio se vería
  mejor, pero hay que conseguirlo (propio o de stock con licencia libre).
