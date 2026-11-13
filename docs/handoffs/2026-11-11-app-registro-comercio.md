# Handoff · App · Registro de comercio y cupo de correo

- **Agente:** codex-octi-app
- **Fecha:** 2026-11-11
- **Rama:** `codex/octi-app-acceso-comercio`
- **PR:** https://github.com/ochomnalez/APROVECHO-online-/pull/8 (borrador).
- **Publicado:** https://aprovecho-app-demo.vercel.app · `dpl_4GUxZyxBpJETMKGvzjK9mxo5UvYx`, READY; código `4e01cd6`.

## Diagnóstico

La captura del usuario muestra el formulario de **registro**, con `over_email_send_rate_limit`. Los logs Auth del proyecto confirmaron respuestas HTTP 429 al solicitar correo de confirmación. La consulta del correo que intentaba registrar devolvió cero cuentas: el bloqueo ocurre antes de completar el alta, no al abrir el menú del comercio.

Los últimos correos enviados fueron a las 19:04:10 y 19:06:00 UTC (16:04 y 16:06 de Argentina). A las 16:20 se informó al usuario una estimación de reintento alrededor de las 17:06, sin prometer un minuto exacto. La documentación indica cupo horario compartido del servicio incluido y recomienda SMTP propio para quitar esa limitación. Referencia: https://supabase.com/docs/guides/auth/testing-auth-flows .

También se observó un `bad_code_verifier` después de confirmar otro registro. El usuario pudo iniciar sesión con contraseña después. El formulario anterior permitía enviar el alta de nuevo después de mostrar éxito, lo que podía generar un nuevo verificador PKCE; se elimina ese reenvío accidental. No se atribuye el error observado a esa causa de manera concluyente.

## Cambios

- Mensaje específico de cupo de correos, separado del de demasiadas solicitudes. No se atribuye el bloqueo a una contraseña o al rol comercio.
- Tras un registro o solicitud de recuperación exitosos, se cierra el formulario de envío, se elimina la contraseña de los campos y se ofrece Ir a Ingresar con el correo ya completado.
- Se ignoran envíos adicionales del formulario completado. Después de HTTP 429 se bloquean reintentos rápidos durante 60 segundos. Este contador solo evita clics repetidos: no representa el desbloqueo del cupo horario.
- Mensaje accionable para enlace/PKCE vencido; se limpian los parámetros de un enlace que ya falló para no repetirlo al recargar.
- PWA actualizada.

## Verificación

Regresión Chromium/Playwright con SDK real y API simulada aprobada: reproduce el 429 en registro de comercio, conserva sus datos, impide reenvíos durante la espera, vuelve a enviar después del contador simulado, impide repetir un registro exitoso y ofrece ingreso con correo recordado. Continúan aprobados login, roles y administración. Sintaxis y diff correctos.

No se usó ni almacenó la contraseña visible en la captura. No se creó ninguna cuenta ni se modificaron cuentas del usuario.

## Pendiente externo

La aplicación no puede ampliar el cupo SMTP de Supabase desde JavaScript. El usuario puede reintentar cuando se libere el cupo; para evitarlo en nuevos registros hace falta conectar un proveedor de correo. Se preguntó si ya tiene uno; no se configuró un servicio pago ni se desactivó confirmación de correo. No se declara resuelto el límite del proveedor.
