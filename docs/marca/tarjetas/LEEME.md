# Tarjetas APROVECHO · frente y dorso

Firma: `codex-octi-landing`.

Diseño reconstruido como documento vectorial a partir del concepto visual compartido por Octavio. El frente conserva `aprovecho.` en blanco sobre negro. El lema fue cambiado por pedido explícito a **Menos desperdicio, más aprovecho.** El dorso conserva **ESCANEÁ Y DESCUBRÍ** y `aprovecho.`, con un QR real en lugar del símbolo ilustrativo.

## Archivos para usar

- **`tarjeta-frente-dorso-imprenta.pdf`**: dos páginas, frente y dorso. Tamaño terminado **90 × 50 mm**, elegido por la proporción del concepto de referencia; sangrado de **3 mm** por lado y TrimBox explícito. Tamaño del PDF con sangrado: 96 × 56 mm. Entregar ambas páginas a la imprenta.
- **`tarjetas-a4-doble-faz.pdf`**: dos páginas A4, diez frentes y diez dorsos alineados. Imprimir a **100% / tamaño real**, doble faz con giro por **borde largo**. No usar «ajustar a página». Cortar por las guías exteriores. Cada tarjeta terminada mide 90 × 50 mm; el redondeo físico de esquinas, si se quiere, corresponde al corte de imprenta, no a un borde blanco impreso.
- **`qr-landing.svg`**: QR vectorial de 25 mm, para reutilizar en otras piezas.
- **`qr-landing.png`**: QR raster, con margen blanco incluido; no recortar ese margen.
- **`vista-previa.pdf` / `vista-previa.png`**: revisión visual, con frente y dorso juntos. No usar estas vistas como pliego de impresión.

## Destino del QR

**https://aprovecho-landing-videos.vercel.app/**

Es un enlace directo a la landing móvil actual, sin acortadores, códigos de seguimiento ni servicios de QR con vencimiento. La web y la app no se modifican en esta tarea.

## Especificaciones y control

- QR negro sobre blanco de 25 × 25 mm, incluidos cuatro módulos blancos de margen; matriz de 41 × 41 contando ese margen; corrección Q.
- Módulos cuadrados, sin logos superpuestos. El QR del PDF y del SVG es vectorial.
- Texto del arte en Liberation Sans regular/bold, incrustado en los PDF. Fondo y QR en negro K, texto del frente blanco.
- Lectura verificada con ZXing: PNG del QR, vista previa, dorso del PDF de imprenta rasterizado a 300 ppp y los **diez QR** de la hoja A4 rasterizada a **150 ppp**. Todas las lecturas devuelven exactamente el enlace indicado. Es una verificación del archivo digital; no una prueba de una tirada física.

## Regeneración

`generar.py` utiliza Python, `qrcode==8.2`, `reportlab` y las fuentes Liberation Sans del sistema. Para verificar las lecturas se usó `zxing-cpp==2.3.0`.

Desde la raíz del repo, con esas dependencias instaladas:

```sh
python3 docs/marca/tarjetas/generar.py
pdftoppm -scale-to 1600 -png -singlefile docs/marca/tarjetas/vista-previa.pdf docs/marca/tarjetas/vista-previa
```

URL, lema, medidas y disposición están en el generador; `datos-impresion.json` deja constancia del resultado. No hay generación de imágenes con IA ni QR aproximados.
