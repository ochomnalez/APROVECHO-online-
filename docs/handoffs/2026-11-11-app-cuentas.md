# Handoff · App · Cuentas y administración

- **Agente:** codex-octi-app
- **Fecha:** 2026-11-11
- **Rama:** `codex/octi-app-cuentas` (desde la demo publicada).
- **PR:** https://github.com/ochomnalez/APROVECHO-online-/pull/6 (borrador, sin merge).
- **Deployment final:** `dpl_EE9Wugv7E4nim9gqDhkNLNF4cotG`, código `6f15445`, READY y preflight aprobado.
- **URL inmutable:** https://aprovecho-app-demo-erpz9o7x5-octaviochomnalez-9006.vercel.app

## Resultado final

**Activado y publicado** en https://aprovecho-app-demo.vercel.app. Proyecto Supabase `cggqyfzqmfzkjjitirco` (APROVECHO), migración `20261111182935_cuentas_y_comercios` aplicada. Los cuatro fundadores están en la lista privada; deben registrarse y confirmar su correo para recibir administración. Aún no se crearon cuentas de personas: 0 perfiles y 0 comercios, 4 direcciones habilitadas.

El usuario autorizó pausar «ropa» después de que fallara la pausa de MVP. La pausa de ropa sí se completó; no se borraron sus datos. La creación del proyecto APROVECHO se completó. Los bloqueos que se describen más abajo son el historial de la resolución.

El usuario confirmó guardados Site URL y redirect allowlist para la app en Auth. La configuración cliente solo incluye URL y publishable key.

### Verificación real y límites

- RLS, rol de usuario y auditoría: verificados contra el PostgreSQL real en una transacción revertida, sin dejar usuarios ni comercios de prueba.
- Desde un build Vercel se verificó Auth real: settings accesibles, email auth habilitado, confirmación de correo activa, contraseña incorrecta rechazada y acceso anónimo a perfiles rechazado. Log: `APROVECHO_PREFLIGHT_OK: Auth reachable; invalid password rejected; anonymous profiles denied; email confirmation=true`.
- Prueba de UI con SDK real/API simulada: aprobada, incluyendo cambio de contraseña y conservación de la ruta al actualizar la sesión. SQL/PGlite: aprobado.
- Advisor de seguridad: ningún error ni advertencia, solo INFO de RLS sin políticas en private.ap_founders, intencional para impedir acceso directo. [Referencia de ese aviso](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- La revisión automática rechazó crear cuentas de prueba persistentes con contraseñas generadas por falta de autorización específica para guardarlas. Esa acción no se ejecutó ni se buscó eludirla. Se completaron las verificaciones alternativas anteriores. No se afirma que se haya probado un ingreso exitoso real ni la entrega de correo; el primer registro/confirmación lo hace el usuario con su correo.
- La red del entorno impide abrir supabase.co y vercel.app; el navegador de escritorio tampoco pudo iniciar la revisión web. Pruebas de UI locales y preflight remoto separan esta limitación del funcionamiento del deployment.

## Alcance pedido

El usuario amplió el alcance: registro e inicio de sesión reales, usuarios consumidores y de comercios, navegación automática según cuenta, administración privada para los cuatro fundadores y logo de entrada circular sin fondo cuadrado. Autorizó crear un Supabase separado y pausar «MVP nativa digital» para liberar el cupo gratuito. Proporcionó las cuatro direcciones exactas; no se publica la lista en el frontend ni en el repositorio.

## Implementación preparada

- Formularios de ingreso, registro consumidor/comercio y recuperación/nueva contraseña; sesión con Supabase Auth, validación por getUser y permisos leídos desde el perfil en la base.
- SDK supabase-js 2.119.0 fijado y distribuido localmente, licencia incluida.
- Guardas del router: consumidor abre su app, comercio su menú y administrador su panel. Se quitaron los controles para saltar de un rol a otro con una cuenta real.
- Partición local por ID para datos de demostración: al cambiar o cerrar cuenta se cambia el estado activo.
- Datos de cuenta y comercio editables; nombre, dirección, CUIT y rubro guardados en la base cuando se active.
- Panel responsive con totales reales de comercios, pendientes, aprobados, consumidores y altas en siete días; filtros, búsqueda, paginación, aprobación/rechazo y auditoría de cambios en la base.
- `supabase/schema.sql`: perfiles, comercios, lista privada de fundadores, RLS, triggers y eventos de administración. La autorización no depende de user_metadata: solo se toma consumer/merchant al alta. Rol admin requiere correo exacto en lista privada y verificación de email.
- Logo enmascarado como círculo en ingreso y marca del consumidor.

## Pruebas

- `app/tests/cuentas.cjs`: aprobado con Chromium, SDK real y API simulada. Ingreso/error, registro de comercio, recuperación, persistencia, salida, roles, bloqueo de rutas cruzadas, aislamiento del estado y aprobación por admin. Sin errores JS. Capturas de muestra (API simulada) en `app/capturas/cuentas/`.
- `app/tests/permisos.cjs`: aprobado ejecutando el SQL en PostgreSQL/PGlite 0.3.14. RLS entre usuarios, bloqueo de autoasignación admin, ausencia de lectura anónima, aprobación restringida, auditoría, fundador solo después de confirmar correo. Repetido después del ajuste de privilegios de la tabla privada.
- Sintaxis de todos los módulos y git diff --check: aprobados.
- La prueba del prototipo sin cuentas se conserva en `app/tests/legacy/demo.cjs`, aplicable al commit bc50bdc.
- No se afirma una prueba con Auth real, emails ni advisors remotos: todavía no hay proyecto APROVECHO.

## Bloqueo de Supabase · historial resuelto

La cuenta conectada solo tiene los proyectos «ropa» (`czkmnkfuodznccfhibpv`) y «MVP nativa digital» (`oxcgtzknqwkigynrvllq`), organización «Cursala simple» (`uxiywfurodyqxfxiqwjt`).

1. get_cost informó USD 0/mes para crear proyecto.
2. create_project APROVECHO, sa-east-1: rechazado por límite de dos proyectos gratuitos activos del propietario.
3. El usuario autorizó pausar MVP nativa digital.
4. pause_project (dos intentos separados): rechazados con `Cannot pause project while it is currently hibernating. Please reach out to support.`
5. get_project lo sigue mostrando ACTIVE_HEALTHY. Consulta de conexión devuelve `28P01: password authentication failed for user postgres`. restore_project informa que ya está ACTIVE_HEALTHY y sugiere soporte si persiste.

No se pausó ni se borró ningún proyecto y no se escribió en bases ajenas. Se consultó al usuario si autoriza pausar «ropa» o si resuelve la pausa de MVP desde su panel. No repetir el circuito fallido sin una nueva señal o decisión.

## Activación inicial · historial resuelto

`supabase/README.md` contiene los pasos. Resolver el cupo; crear proyecto; inspeccionar esquema y aplicar migración remota; cargar lista privada de cuatro fundadores; configurar Auth Site URL y allowlist de redirecciones; obtener URL y publishable key; completar auth-config.js; verificar Auth, RLS y correo reales; ejecutar advisors; publicar en Vercel. Las direcciones aportadas se conservaron en SQL de preparación local bajo work/, no versionado. Si ese scratch no sobrevive, recuperar la imagen del usuario.

El CLI 3.1.0 instalado en work no pudo crear el archivo de migración porque intenta escribir configuración en /home/agent/.supabase. Se conserva schema.sql sin inventar nombre con timestamp; usar apply_migration de MCP para la migración remota.

La versión con cuentas reemplazó la demo anterior en el mismo enlace después de configurar el proyecto. IA, pagos, balanza y operaciones de packs siguen simulados; esta ampliación cubre cuentas, datos de comercio y administración.
