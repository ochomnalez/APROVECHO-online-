# Handoff · App · Fotos reales y marcas de referencia

- **Agente:** codex-octi-app
- **Fecha:** 2026-11-11
- **Rama:** `codex/octi-app-fotos`, desde la versión con cuentas.
- **PR:** https://github.com/ochomnalez/APROVECHO-online-/pull/7 (borrador).
- **Deployment final:** `dpl_Dk59GZeDHYvZdWGdnJcS22whRBbe`, código `9b796d1`, READY.
- **Publicado:** https://aprovecho-app-demo.vercel.app
- **URL inmutable:** https://aprovecho-app-demo-xx9tzmjor-octaviochomnalez-9006.vercel.app

## Qué cambió

Pedido del usuario: fotos reales y tentadoras en consumidor y comercio; referencias de marcas conocidas para dar realismo a la demo.

- Reemplazados dibujos de comida en categorías, filtros y promociones por fotos de panadería, pastelería, platos, ensaladas, pizza, verduras y sándwiches. Las muestras de cámara/revisión siguen usando fotos reales con cajas de detección simuladas.
- Agregadas hamburguesa (Jonathan Borba/Pexels) y pollo crocante (Gabriela Sakita/Pexels). La comida de stock se presenta como referencia, no como producto oficial de las marcas.
- Comercios de muestra: Havanna, KFC, Starbucks, McDonald's, Jumbo, Burger King, Coto y Carrefour, con fotos reales de esos establecimientos en Argentina. Las marcas se muestran como referencias, no como comercios adheridos ni con oferta real. Las distancias, puntuaciones y horarios siguen simulados; hay aviso y badges Demo.
- Los perfiles comerciales reales conservan su nombre; no se les asigna una marca de ejemplo. Se migran las referencias de demo guardadas para que el cambio también llegue a navegadores usados antes.
- Fotografías de local en tarjetas, búsqueda, cabecera, detalle, reservas y pago; comida adecuada a categoría/producto. Iconos de navegación y estados vacíos se conservan.
- Página pública `/imagenes.html` con fotografías, autoría, fuente y licencia. Manifiesto reproducible `app/img/fuentes-medios.json`; créditos también en `app/img/CREDITOS.md`.

## Preparación y publicación

La red de ejecución bloquea Pexels/Wikimedia, así que la preparación normal de assets se ejecuta durante el build de Vercel. `app/build/medios.cjs` descarga las fuentes acreditadas y convierte diez fotos a WebP 4:3, máximo 150 KB. Los archivos se sirven desde el propio dominio de APROVECHO; no se carga la fuente externa en cada celular. Las adaptaciones conservan la licencia de origen, incluida CC BY-SA para McDonald's y Coto.

Sharp fijado en 0.35.5, con lockfile. La auditoría de la versión final informa cero vulnerabilidades. PWA actualizada para guardar los nuevos assets y créditos.

## Verificación

- Primer build Vercel: diez imágenes descargadas y decodificadas correctamente; tamaños entre 52.300 y 101.012 bytes, deployment READY y preflight Auth aprobado. La dependencia de optimización se actualizó después a la versión corregida 0.35.5; build final con Sharp 0.35.5 aprobado: diez FOTO_REAL_OK, MEDIOS_OK 10, preflight Auth OK, cero vulnerabilidades y deployment READY.
- Regresión de cuentas con SDK real/API simulada: aprobada después del cambio. Incluye comprobar las ocho marcas, foto de fachada de McDonald's, seis categorías con fotografía y ausencia de SVG de comida en categorías/promociones/identificaciones de comercio.
- Sintaxis y git diff --check: correctos.
- Las fuentes de locales se revisaron en Wikimedia Commons y las nuevas comidas en Pexels; no se generaron fotos con IA.
- No se afirma revisión visual de imágenes de fachadas en el navegador local: los assets se generan en el build y las redes de fotos están bloqueadas aquí. El build verifica descargas y decodificación; corresponde la revisión final del usuario en su celular.

## Límites

No se crearon adhesiones comerciales reales ni se añadieron registros falsos a Supabase. Se cambiaron los datos de muestra de la app. Los packs y pagos continúan simulados; las cuentas y administración mantienen la conexión real ya implementada.
