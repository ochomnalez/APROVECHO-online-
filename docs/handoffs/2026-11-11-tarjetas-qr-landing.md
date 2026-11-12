# Handoff · tarjetas con QR real a la landing

- **Fecha:** 2026-11-11 (contexto del cliente).
- **Agente:** codex-octi-landing.
- **Rama:** `codex/aprovecho-landing`.

## Qué hice

Preparé la tarjeta de la referencia como PDF vectorial, con QR real al enlace móvil actual `https://aprovecho-landing-videos.vercel.app/`. Frente `aprovecho.` y lema nuevo autorizado por Octavio: «Menos desperdicio, más aprovecho.» Dorso «ESCANEÁ Y DESCUBRÍ», QR y `aprovecho.`. Se reconstruye el documento; no se imprime la captura conceptual ni su QR ilustrativo.

## Entregables

Todo en `docs/marca/tarjetas/`: PDF de imprenta (dos páginas, tamaño final 90 × 50 mm, sangrado 3 mm), A4 de diez tarjetas a doble faz con guías de corte, QR SVG y PNG, vista previa, generador y especificaciones.

## Decisiones y supuestos

90 × 50 mm por la proporción del concepto recibido, con QR de 25 mm para su lectura al imprimir. El enlace corresponde a la landing actual de la entrega, no a la app ni a la versión estable anterior. La frase nueva es instrucción explícita del usuario, no una propuesta pendiente.

## Pruebas

ZXing lee la URL exacta en el PNG, en el PDF de imprenta rasterizado a 300 ppp, en la vista previa y en los diez QR de la hoja A4 a 150 ppp. Se revisó la composición y la geometría/TrimBox; textos del arte con fuentes incrustadas. No se probó una impresión física.

## Pendientes / próximo agente

Para impresora A4: tamaño real/100%, doble faz por borde largo; luego cortar con las guías. Para imprenta: PDF de frente y dorso con sangrado. El sitio, sus medios, el Economics y la app permanecen sin cambios; no se necesita despliegue.

## Costo

Sin generaciones ni servicios externos nuevos. El QR se codifica localmente, sin servicio con vencimiento.

## Ajuste posterior · QR con estilo redondeado

Octavio pidió que el QR se pareciera al símbolo suave de la referencia. Se redondearon los tres ojos y las esquinas exteriores de los módulos, con puntos y trazos conectados. No se cambian la matriz, la URL, el margen blanco ni el tamaño de 25 mm. El frente y su lema quedaron idénticos píxel a píxel respecto de la versión previa.

Se actualizaron todos los PDF y las vistas previas, el SVG y el PNG; se agregó un PDF vectorial del QR solo y `verificar.py` para repetir la lectura. Regeneración y prueba con ZXing correctas: un QR en PNG/vista previa/imprenta a 300 ppp y diez en A4 a 150 ppp, todos con la URL exacta de la landing. Sin cambios en el sitio ni nuevos servicios o generaciones pagas.
