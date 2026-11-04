# Brief · Prototipo final de la app

- **Rol:** desarrollador/a front-end + diseñador/a de producto senior.
- **Rama:** `codex/aprovecho-app` (Codex) o `claude/aprovecho-app` (Claude) · PR contra `claude/gallant-planck-ps6te6`.
- **Carpeta:** `app/`.
- **Entrega:** martes 10/11, 18:00 (hora de Argentina).
- **Requisito previo:** el usuario aprobó continuar el código de la v3.2.1. Si no lo aprobó, preguntale al líder antes de empezar.

## Objetivo

Un **prototipo navegable, muy profesional y fiel al plan de negocios**: app del consumidor y app del comercio en sus **3 planes (Base, Smart e Intelligence)**, con datos simulados. No es un MVP: la IA, los pagos y el backend se simulan.

## Punto de partida (no empezar de cero)

- Código base: **app v3.2.1 del usuario**, `https://github.com/ochomnalez/aprovecho-app` (público). Es una PWA en HTML, CSS y JavaScript sin framework (`index.html`, `js/*.js`, `css/app.css`), demo en `ochomnalez.github.io/aprovecho-app`.
  - Copiá el código a `app/`, sin `.git`, y anotá el commit de origen (`3ed4bb8`) en `app/README.md`.
- Referencia visual de cada pantalla: `docs/ux/referencias-app-v3/` (`INDICE.md` + capturas).
- Lo que el usuario **aprobó** de nuestra v2: fotos reales de comida y la detección de la IA mostrando **cuántas unidades hay de cada producto** (`docs/ux/v2/`).

## Leer primero

`AGENTS.md` / `CLAUDE.md` (sección 9: preferencias y **cero "AI slop"**) · `docs/decisiones.md` · `docs/fuente/04-producto-y-planes.md` y `docs/fuente/07-operaciones-y-tecnologia.md` (**completos**: el usuario pidió que la app refleje el plan de operaciones y la sección de productos y servicios) · `docs/fuente/09` (sección B) · `docs/marca/plataforma-de-marca.md` (voz) · `docs/marca/tokens.css` · `docs/ux/flujo-v2.md` · `docs/ux/score-y-niveles.md`.

## Qué se mantiene de la v3.2.1

- Barra de navegación inferior flotante con botón circular (cliente: Inicio · Mapa · Reservas · Perfil; local: Hoy · Retiros · Impacto o Intelligence · Cuenta).
- Deslizar entre pestañas, hojas inferiores, mapa real con OpenStreetMap, selector de demo (cliente ↔ local y plan).
- Flujo de publicación: foto → análisis → duda → revisar y publicar → publicado.
- Retiros con QR y código de 4 letras, estación con "Para vender" y "A la basura" con motivo, reportes en Excel y PDF.
- Intelligence con las pestañas Resumen, Sugerencias, Datos y Sucursales, y el detalle de cada sugerencia.

## Qué hay que cambiar (para alinearlo al plan y a la marca)

1. **Marca:**
   - Logo oficial = **sello original** (`docs/marca/logo-oficial/`, D-026). Slogan del plan: **"Menos desperdicio, más aprovecho"**, no "Nada se pierde, todo vale".
   - Colores y tipografía desde `docs/marca/tokens.css`. Si Identidad todavía no cerró la tipografía (brief 03b), dejá variables para cambiarla después.
2. **Fotos reales y variadas** en lugar de ilustraciones: panadería, facturas, tortas, empanadas, tartas, platos del día, ensaladas, frutas y verduras.
   - Solo fotos de Unsplash o Pexels (licencia libre), con un `app/img/CREDITOS.md`.
   - Optimizadas: WebP de menos de 150 KB cada una.
3. **Precios y reglas del plan** (`docs/fuente/04`):
   - Smart USD 300/mes; Intelligence USD 800/mes por sucursal; Base sin abono. Comisión del 25%: el comercio se queda con el 75%.
   - **Descuento siempre del 50%**: sacar "Hasta 70% off", el "51% off" y el slider de descuento.
4. **Impacto honesto:**
   - Nunca "CO₂ evitado"; usar "huella asociada (estimada)", factor 2,53 kg CO₂e/kg (D-013).
   - Etiquetas **Medido** y **Estimado** en cada cifra.
   - La huella hídrica (192 l/kg) aparece solo en Intelligence.
5. **Planes según el plan (sección 11):**
   - **Smart = estación** (balanza Systel + tablet Samsung que **saca la foto**): peso real + foto.
   - **Intelligence** = la misma estación + **inventario de envasados con vencimientos** (CSV → "packs sugeridos") + patrones, predicción y comparación entre sucursales + **informes validados por analistas**.
   - Sumar una **vista de la estación en tablet horizontal** para Smart y una **vista de escritorio** del panel de Intelligence.
6. **Checklist antes de publicar** (D-014): producto del día + cadena de frío + alérgenos. Si el usuario aprobó PROPUESTA-ux-3, va como confirmación dentro del botón "Publicar"; los alérgenos vienen precargados desde la carta.
7. **Funciones del plan que faltan:**
   - APROVECHO Score y ranking de la zona; "Comercio del mes" (reglas en `docs/ux/score-y-niveles.md`).
   - Niveles del consumidor; referidos (10% para los dos); 10 packs → 1 gratis.
   - Cancelación gratis hasta 2 h antes; reportar un pack en mal estado con foto.
   - Destino de lo no vendido: donado, reutilizado o descartado, con motivo.
   - Valor no recuperado y tasa de recuperación en Smart.
8. **Detección de la IA:** varios productos a la vez con su cantidad (ej. "Medialunas ×9 · Budín ×2 · Tarta ×1"), cajas sobre una foto real y total en kg [Estimado].
   - **Sacar el brillo de colores "estilo asistente"** y los íconos de destellos (✨) de Intelligence: es "AI slop" (CLAUDE.md §9.10). El escaneo tiene que ser sobrio.

## A confirmar con el usuario (el líder pregunta)

- ¿Se mantiene el "límite para publicar" con cuenta regresiva? No está en el plan.
- ¿Se mantienen el visor 3D de equipos y la pantalla de instalar la PWA?
- El usuario avisó que en la v3 hay cosas que "no tienen que estar": antes de borrar, el líder confirma cuáles.

## Criterios de aceptación

- Recorre sin errores los dos lados y los 3 planes; el estado se mantiene entre vistas.
- Mobile 390 × 844 impecable, tablet horizontal (estación) y escritorio (Intelligence).
- Accesibilidad AA (contraste y áreas táctiles de 44 px).
- Cero "AI slop": ni tipografías genéricas, ni degradés violetas, ni emojis como íconos.
- Todas las cifras son coherentes con D-015 (pack USD 3,99 ≈ ARS 6.100; valor original ≈ ARS 12.200).
- Capturas de las pantallas principales en `app/capturas/` para que el líder revise.
- Handoff en `docs/handoffs/` y línea en `docs/BITACORA.md`.

## Prohibido sin OK del usuario

Publicar o desplegar (Vercel, GitHub Pages), conectar Supabase, generar imágenes con IA paga.
