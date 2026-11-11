# Handoff · App · Cuentas y administración

- **Agente:** codex-octi-app
- **Fecha:** 2026-11-11
- **Rama:** `codex/octi-app-cuentas` (desde la demo publicada).

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

## Bloqueo real de Supabase

La cuenta conectada solo tiene los proyectos «ropa» (`czkmnkfuodznccfhibpv`) y «MVP nativa digital» (`oxcgtzknqwkigynrvllq`), organización «Cursala simple» (`uxiywfurodyqxfxiqwjt`).

1. get_cost informó USD 0/mes para crear proyecto.
2. create_project APROVECHO, sa-east-1: rechazado por límite de dos proyectos gratuitos activos del propietario.
3. El usuario autorizó pausar MVP nativa digital.
4. pause_project (dos intentos separados): rechazados con `Cannot pause project while it is currently hibernating. Please reach out to support.`
5. get_project lo sigue mostrando ACTIVE_HEALTHY. Consulta de conexión devuelve `28P01: password authentication failed for user postgres`. restore_project informa que ya está ACTIVE_HEALTHY y sugiere soporte si persiste.

No se pausó ni se borró ningún proyecto y no se escribió en bases ajenas. Se consultó al usuario si autoriza pausar «ropa» o si resuelve la pausa de MVP desde su panel. No repetir el circuito fallido sin una nueva señal o decisión.

## Para activar y publicar

`supabase/README.md` contiene los pasos. Resolver el cupo; crear proyecto; inspeccionar esquema y aplicar migración remota; cargar lista privada de cuatro fundadores; configurar Auth Site URL y allowlist de redirecciones; obtener URL y publishable key; completar auth-config.js; verificar Auth, RLS y correo reales; ejecutar advisors; publicar en Vercel. Las direcciones aportadas se conservaron en SQL de preparación local bajo work/, no versionado. Si ese scratch no sobrevive, recuperar la imagen del usuario.

El CLI 3.1.0 instalado en work no pudo crear el archivo de migración porque intenta escribir configuración en /home/agent/.supabase. Se conserva schema.sql sin inventar nombre con timestamp; usar apply_migration de MCP para la migración remota.

La demo anterior **sigue publicada** en https://aprovecho-app-demo.vercel.app. No se reemplazó por un ingreso deshabilitado. IA, pagos, balanza y operaciones de packs siguen simulados; esta ampliación cubre cuentas, datos de comercio y administración.
