# Handoff · copia de landing con videos nuevos

- Fecha: 2026-11-11. Firma: `codex-octi-landing`.
- Rama: `codex/aprovecho-landing`.
- Pedido actual: conservar la landing que funciona y preparar otra para revisar los videos nuevos.

## Respaldo de la landing actual

- URL estable: https://aprovecho-landing.vercel.app/.
- Proyecto original: `prj_rRtFyCnM5f3LgyllPGHzyfmhh3DL`.
- Despliegue conservado: `dpl_o26rnqrqktjuQhoZ8fCewgKqrLJJ`.
- Fuente exacta ya guardada en GitHub: `54863e6ceef64d32467d671729f7d88e4cb7bd51` (rama `codex/octi-landing-enlace-app`). Se creó también la referencia local `codex/octi-landing-respaldo-20261111`; no se modifica ni se pushea esa rama.
- URL del despliegue conservado: https://aprovecho-landing-5a1767v39-octaviochomnalez-9006.vercel.app/.

## Copia para revisión

Se incorpora a la rama de videos el mismo acceso a la app de `54863e6`, sin otros cambios de código. Frente al paquete publicado solo cambian los ocho assets de publica y balanza. Los archivos de trabajo de generación bajo `src/v6-pantallas` quedan fuera del paquete público por el script existente.

Build correcto; tamaños fuente/build idénticos por SHA-256 (publica 1920: 1.668.225 bytes; balanza 1920: 2.876.541 bytes). Navegación a la app verificada en 390 y 1440 px y sin JS. Rotación real de los tres videos en escritorio verificada localmente, sin errores de consola, HTTP ni pedidos fallidos.

Pendiente: publicar la copia en un proyecto separado, conservar el dominio original y registrar la URL. El acceso HTTP desde este entorno a los dominios vercel.app devuelve bloqueo del proxy; el navegador remoto falla con «Browser Use could not read requirements». No se confunde la prueba local con una verificación de la URL real.

Sin regeneraciones ni créditos de generación.
