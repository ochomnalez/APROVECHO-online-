# Handoff · Landing v5 · Scroll y estructura

- **Fecha:** 2026-11-11
- **Firma:** `codex-octi-landing`
- **Rama:** `codex/aprovecho-landing`, desde `6f8d698` de `claude/aprovecho-landing`.

## Qué hice

- Una sola escena de plan activa: destruir su contexto GSAP al ocultarla y reconstruir el plan visible. Antes se creaban pins para paneles ocultos, medidos con altura cero.
- Encerrar el z-index de las pestañas: sus textos ya no flotan encima de las escenas fijadas. Corregir también el espacio superior del teléfono frente a la navegación.
- Smart e Intelligence marcan los pasos con el avance real de la animación suavizada, no con un scroll que se adelanta. En Base móvil, las pantallas cambian con el avance del paso, sin temporizadores que cambien la imagen estando quieto. Smart e Intelligence resaltan el texto según su lectura en móvil.
- Progreso lateral exclusivamente para el plan visible: 0–100 % por recorrido; oculto en portada, beneficios, video, Quiénes somos, alta y FAQ. Sin contaminación de los planes ocultos. Se muestra el porcentaje también en móvil, con espacio para no pisar los pasos.
- El primer video de portada arranca sin esperar `window.load`; el siguiente se precarga al comenzar el primero. Los 48 cuadros de la estación no se descargan para los planes ocultos al entrar en la portada. Sin cambiar resolución ni generar nuevos videos.
- Orden: portada → beneficios → planes → video de la app → Quiénes somos (incluye datos de Argentina e inversores) → Esta noche, en vez de tirarlo, vendelo / alta → FAQ → pie.
- Retirar calculadora y sus enlaces. Conservar el fragmento sin incluirlo en `partials/cuenta-pendiente.html` para reubicarlo más adelante.
- Ícono flotante de Instagram con sus colores y trazo blanco.

## Fuentes y reconstrucción

Editar únicamente `landing/src/v5/` para la landing. Ejecutar desde la raíz:

```sh
python3 landing/src/build_v5.py
```

Los cambios en `landing/v5.html`, `landing/css/v5.min.css` y `landing/js/v5.js` son salidas del generador. No se editaron a mano. La v4 no cambió. Se actualizaron además estado, tablero y bitácora conforme a las reglas generales del repo.

## Validación

- Chromium / Playwright: 1440×900, 1024×768, 768×1024, 390×844 y 390×844 con movimiento reducido.
- Sin errores JS, respuestas HTTP fallidas ni desborde horizontal en esas pruebas.
- Ida y vuelta por los tres planes: solo un pin en escritorio, correspondiente al panel visible. Indicador numérico de Base coincide con la captura de mayor opacidad; Smart e Intelligence coinciden con el tiempo real del timeline.
- Enlaces directos a los tres planes, cambio de pestaña con teclado y cambio a comprar packs / volver al inicio.
- Progreso lateral comprobado al 5 % y 90 % en cada plan y oculto en las secciones sin recorrido animado.
- Comprobado que `#datos` queda dentro de `#quienes-somos`, que no quedan enlaces a la calculadora, y que el orden termina en alta → FAQ.
- Capturas locales de esta sesión en `/tmp/v5-*.png`; scripts de comprobación en `/workspace/aprovecho-cloud-setup/browser/`. No son publicaciones.

## Pendientes

- **Recordatorio del usuario:** reubicar «Cuánto te queda» dentro de otra sección. Está retirada por ahora; no reincorporarla sin definir ubicación.
- Revisión visual de Octavio. No se publicó ni se actualizó el artifact externo de Claude.
- Siguen pendientes los enlaces reales de contacto/app y requisitos legales del handoff anterior. No se usaron servicios pagos.
- Las pruebas de navegador fueron en Chromium; no se afirma validación en Safari/WebKit ni una puntuación Lighthouse nueva.

## Costo externo

USD 0: sin generaciones ni servicios pagos.
