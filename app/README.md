# APROVECHO · demo para la entrega

*Menos desperdicio, más aprovecho.*

**Demo publicada:** https://aprovecho-app-demo.vercel.app (autorizada el 11/11/2026).

Adaptado desde [Aprovecho v3.2.1](https://github.com/ochomnalez/aprovecho-app/tree/3ed4bb8), commit `3ed4bb8`. Alcance confirmado el 11/11/2026: demo navegable para la entrega, con IA, pagos y balanza simulados.

## Versión con cuentas · rama de trabajo

Se agregaron ingreso, registro de consumidor/comercio, sesión persistente, recuperación, permisos por rol y panel de fundadores. Esta rama necesita activar el proyecto Supabase antes de reemplazar la demo publicada. `app/js/auth-config.js` permanece sin configurar hasta resolver el límite de proyectos y la pausa rechazada por Supabase. No hay cuentas reales activadas todavía.

El registro público no ofrece administración: las cuatro direcciones exactas de los fundadores se habilitan en una lista privada, con correo confirmado. Los datos comerciales se guardan en Supabase; packs, pagos, IA y balanza siguen siendo ejemplos de la demo.

Ver `supabase/README.md` para conexión y permisos. Pruebas actuales: `app/tests/cuentas.cjs` (SDK real y API simulada) y `app/tests/permisos.cjs` (PostgreSQL/PGlite). Capturas en `app/capturas/cuentas/`. El recorrido anterior se conserva en `app/tests/legacy/demo.cjs`, para el commit bc50bdc sin autenticación.

## Abrir

Desde la raíz del repositorio: `python3 -m http.server 8765 --bind 127.0.0.1`. Abrí `http://127.0.0.1:8765/app/`. No requiere instalar paquetes, cuentas ni claves. También se puede servir la carpeta `app/` sola; no la abras como archivo porque usa módulos de JavaScript.

## Presentación en 5 minutos

1. **Base:** Entrar como local → Base → Usar la carta de ejemplo. La lectura deja un precio sin reconocer: tocá Tarta de ricota, cargá su precio y guardá. Guardá la carta y terminá los datos del local.
2. **Publicar:** Sacar foto → foto de muestra → revisá productos, cantidades, alérgenos y horario → Publicar → Confirmar y publicar. La confirmación cubre alimento del día, frío y alérgenos. Volver a revisar no publica nada.
3. **Consumidor:** Demo → Pasar al modo cliente. Buscá La Espiga, reservá uno de los packs publicados y probá el pago simulado. El QR y el código quedan en Reservas.
4. **Retiro:** Demo → Pasar al modo local → Retiros. Escribí el código y confirmá la entrega. Volver a validarlo muestra que ya se entregó. Desde el consumidor podés calificar o reportar con foto.
5. **Smart:** Demo → Smart → Abrir estación → Simular pesaje y foto. Publicá o registrá donación, reutilización o descarte con motivo. Mirá el balance y descargá un reporte.
6. **Intelligence:** Demo → Intelligence → pestaña Intelligence. Recorré sucursales, sugerencias e inventario. El inventario de ejemplo permite revisar y publicar packs sin preparar archivos. Para probar un CSV, usá los encabezados y los IDs de sucursal que muestra la pantalla; la fecha de vencimiento debe ser de hoy a tres días desde hoy.

Para empezar de nuevo: Demo → Reiniciar la demo. El reloj arranca a las 17:10; dejá desactivado Usar la hora real durante la presentación. Los datos se guardan en este navegador; dos celulares tienen estados independientes. El QR puede transportar datos de una reserva de demostración, pero no sincroniza inventario entre dispositivos.

## Sin conexión y límites

En HTTPS se instala como PWA y guarda recursos locales, fotos, fuentes y librerías. Abrila una vez con conexión antes de presentar; el mapa necesita internet para calles nuevas. En localhost, usá `?sw` para habilitar el service worker. Se verificaron recarga, QR y PDF sin conexión después de instalarlo.

Sin cobros, reconocimiento de imágenes, balanza, cuentas ni verificación comercial reales. Los datos históricos y las propuestas de Score/niveles son ejemplos. Publicada en Vercel; sin backend conectado.

## Verificación reproducible

Con el servidor anterior activo y Playwright disponible:

```sh
node app/tests/cuentas.cjs
```

Si Playwright está en otra carpeta, indicá `PLAYWRIGHT_MODULE=/ruta/a/node_modules/playwright`. `CHROMIUM_PATH` permite elegir Chromium; por defecto `/usr/bin/chromium`. `APP_URL` cambia la URL y `CAPTURE_DIR` la carpeta de capturas (por defecto `work/app-qa`).

La prueba recorre alta, publicación y confirmación, pago fallido, reserva, persistencia, entrega y duplicado, cancelación, Smart, CSV Intelligence, Excel/PDF, funcionamiento sin conexión, reporte con foto y publicación cerca del cierre. Capturas revisadas en `app/capturas/`. Resultado y límites en `docs/handoffs/2026-11-11-app-demo-final.md`.

`css/tokens.css` es una copia local de `docs/marca/tokens.css`, con las mismas variables y fuentes locales en lugar de Google Fonts. Al cambiar el sistema visual, sincronizá esta copia y subí la versión de `sw.js`.
