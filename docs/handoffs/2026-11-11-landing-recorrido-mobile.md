# Handoff · landing · recorrido de entrega en teléfono

- **Fecha:** 2026-11-11 (Argentina).
- **Firma:** codex-octi-landing.
- **Rama:** `codex/aprovecho-landing`, desde `65c0f91`.

## Qué hice

Optimicé el recorrido móvil de la landing con videos nuevos e Inversores actualizado, por pedido de Octavio para la entrega a profesores.

- Smart e Intelligence: título e introducción antes del producto; estación grande y siempre visible, sin depender de una posición exacta del scroll. Controles táctiles para estación armada y seis componentes con fotos, nombres y descripciones legibles. Giro 360° con gesto horizontal, preservando el scroll vertical y la carga de cuadros a demanda.
- Panel Smart reutilizando la imagen existente de la tablet; tablero Intelligence visible completo. Visor con zoom 100–400%, desplazamiento, cierre y foco restaurado. Usa imágenes originales; disponible también con movimiento reducido y sin GSAP.
- Base: diez pantallas accesibles con anterior/siguiente, contador y ampliación de la pantalla actual con su imagen de mayor resolución. Se conserva el recorrido por scroll. Se corrigió el salto a la última pantalla y la falsa finalización al cambiar pestañas: se valida la geometría real del paso, y las escenas se inician desde la posición final de navegación.
- Se muestran los nombres Base, Smart e Intelligence en las pestañas de teléfono. Botones táctiles, tablas desplazables, formularios a 16 px y video contenido en teléfono horizontal. La barra inferior redundante se retira en móvil; el acceso al alta y a la app permanece en la cabecera. Contacto flotante oculto durante lectura de planes, video, inversores y formularios.
- Pósters siguientes de portada con selección responsive y prioridad al póster inicial antes del video; giro/zoom de fondo automático retirado solo en móvil. Videos sin recomprimir ni reemplazar. Parámetros de versión CSS/JS incrementados para evitar caché antiguo.

## Entregables

- Estilos y controles móviles en `landing/src/v5/css/99-mobile.css` y `landing/src/v5/js/99-mobile.js`.
- Generador de estación y sus partials; ajustes a ramas móviles de las escenas y al inicio del recorrido.
- `landing/src/v5/tests/mobile-journey.cjs`; prueba anterior `ui-fluidity.cjs` actualizada al enlace real de la app (su aviso viejo ya no aplica).
- HTML, CSS y JS generados con el script existente de publicación.

## Pruebas

- Recorrido completo automatizado: 320×568, 360×740, 390×844, 430×932, 768×1024 y 844×390, con emulación táctil de Chromium. Tres planes, diez pantallas de Base, seis piezas por estación, zoom/desplazamiento, video inline, alta con selección de plan, FAQ, ocho pestañas de inversores y acceso a la app. Sin excepciones JS ni HTTP erróneos.
- Recorrido vertical revisado por secciones. Alta de comercio probada en dos pasos: campos vacíos, avanzar, validación, volver y fuente 16 px, sin enviar datos; consola limpia.
- Fallback: movimiento reducido y GSAP bloqueado; producto y visor siguen disponibles.
- Gesto táctil real mediante CDP: giro descarga cuadros solo tras interactuar y no desplaza la página; cambio teléfono → horizontal → escritorio correcto.
- Regresiones `plan-scroll.cjs` y `ui-fluidity.cjs`: completadas. Desktop conserva animaciones, finalización y navegación, video y carga progresiva del giro.
- Verificación de integridad: 181 archivos de imagen/video conservan SHA-256; partial Inversores y snapshot Economics idénticos al inicio.
- Lighthouse móvil local durante la optimización: rendimiento 81, accesibilidad 100, buenas prácticas 100, SEO 100; CLS 0, TBT 30 ms. La portada con video sigue siendo la carga principal (LCP simulado 5,1 s). Son mediciones locales con red/CPU simuladas y servidor estático sin compresión CDN; no medición de producción ni de un iPhone físico.
- Navegación a la app interceptada en la prueba exclusivamente para verificar el destino; no se modifica ni se prueba su backend. Los formularios conservan su simulación existente, sin cambios de backend.

## Decisiones y alcance

El teléfono usa exploración táctil explícita para las piezas, sin intentar comprimir el pin de escritorio a una pantalla pequeña. Se mantienen los activos originales, contenido comercial y Economics; escritorio conserva su experiencia. No se tocaron la app, Supabase ni la landing estable original.

## Pendientes y próximo agente

Publicado en https://aprovecho-landing-videos.vercel.app/ (proyecto existente `prj_tVrLvxLlcRpCf2HdVDxnSFans3eA`). Vercel confirmó READY y alias para `dpl_2PiqSyE7PgQsgxAUWsAxPaoKQetg`, fuente `34552c6e8862f6f1f359e4d5f7cab2e684be15a1`. Se verificó además que el dominio estable sigue apuntando a `dpl_o26rnqrqktjuQhoZ8fCewgKqrLJJ`. El entorno ha bloqueado la URL pública; distinguir pruebas locales y confirmación por API de una revisión en teléfono físico. La versión estable `aprovecho-landing.vercel.app` se conserva.

## Costo

Sin nuevos proyectos ni generaciones de imágenes, videos o voces.
