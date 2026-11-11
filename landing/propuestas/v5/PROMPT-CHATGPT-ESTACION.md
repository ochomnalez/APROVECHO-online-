# Prompts para ChatGPT: fotos de la estación (giro 360° y despiece)

Cómo usarlos: abrí un chat nuevo en ChatGPT, adjuntá la foto de la estación armada (la de la balanza con la tablet en el brazo, el hub y el cable) y pegá el prompt. Pedí **una imagen por mensaje** y guardá cada una con el nombre que se indica. Si una sale distinta a la referencia (otra balanza, otro brazo, otras letras), repetí ese ángulo con «Igual que la referencia, no cambies el diseño».

## Reglas comunes (van en todos los pedidos)

- Es la **misma estación real**: balanza Systel con columna blanca, bandeja de acero, panel azul con teclado y pantalla verde, tablet negra en brazo articulado negro, hub de carga negro con cable negro. No cambiar diseño, proporciones ni colores.
- Fondo **blanco puro (#FFFFFF), liso**, sin piso, sin sombra proyectada, sin reflejos, sin texto extra.
- **Misma altura de cámara, mismo encuadre y mismo tamaño del objeto en todas las imágenes** (objeto centrado, ocupando ~80% del alto, con aire alrededor).
- Iluminación suave de estudio, igual en todas. Imagen **4:3 horizontal, la mayor resolución posible**.
- La pantalla de la tablet **apagada (negra)** y el display de la balanza en **0.000 kg**. El cable sigue el mismo recorrido en todas las vistas.

## Prompt A · giro 360° de la estación ARMADA (8 imágenes)

> Usá la foto adjunta como referencia exacta del producto. Quiero una **toma de producto de catálogo**, girando la estación sobre una plataforma: misma estación, mismo encuadre, misma altura de cámara (ligeramente elevada, ~20°), fondo blanco puro, sin sombra de piso, sin texto adicional. En cada imagen la estación gira un ángulo distinto respecto de la foto de referencia (que es el ángulo 0°).
> Generá **solo una imagen por mensaje**. Empezá por **0°** (igual a la referencia, pero con el encuadre y el fondo de estas reglas). Después te voy pidiendo: **45°, 90°, 135°, 180°, 225°, 270°, 315°** (giro hacia la derecha, vista desde arriba en sentido horario). Mantené idénticos el tamaño del objeto en el cuadro, la luz y el diseño en todos los ángulos. Si un ángulo deja ver el costado o la parte de atrás, mostrá una versión coherente y simple del producto (sin inventar logos ni textos nuevos).

Archivos: `giro-000.png`, `giro-045.png`, `giro-090.png`, `giro-135.png`, `giro-180.png`, `giro-225.png`, `giro-270.png`, `giro-315.png`.
(Con 8 imágenes alcanza: yo genero los cuadros intermedios para que el giro sea fluido. Si salen bien y ChatGPT aguanta, 16 ángulos cada 22,5° quedan todavía mejor.)

## Prompt B · etapas del DESARMADO (4 imágenes, mismo ángulo que la referencia)

> Misma estación, mismo ángulo de cámara y mismo encuadre que la foto de referencia (vista 3/4 desde adelante a la derecha), fondo blanco puro, sin sombras de piso. Las piezas son: **balanza con columna**, **tablet con sus agarres**, **brazo articulado**, **hub de carga**, **cable USB-C** y **cable de corriente**. Quiero cuatro etapas de un despiece por pasos, siempre con las piezas **flotando** y **en el mismo tamaño** que en la referencia:
> **Etapa 1 (25%)**: todo casi armado; la tablet se despega apenas del brazo y el hub se separa unos centímetros de la balanza.
> **Etapa 2 (50%)**: la tablet con sus agarres queda arriba separada del brazo; el brazo se separa de la balanza hacia la derecha; el hub y los cables salen hacia la izquierda.
> **Etapa 3 (75%)**: todas las piezas claramente separadas y ordenadas, aún cerca de su posición armada.
> **Etapa 4 (100%)**: despiece completo, con cada pieza bien separada y visible (balanza al centro, tablet y brazo a la derecha, hub y cables a la izquierda).
> Generá **una imagen por mensaje**, empezando por la Etapa 1.

Archivos: `despiece-1.png`, `despiece-2.png`, `despiece-3.png`, `despiece-4.png`.

## Cuando las tengas

Pasámelas por acá (hasta 5 por mensaje). Yo recorto los fondos, las alineo, genero los cuadros intermedios y armo el giro y el despiece fluidos. Las fotos actuales quedan de respaldo.
