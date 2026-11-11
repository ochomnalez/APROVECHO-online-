# Cuentas de APROVECHO

`schema.sql` prepara perfiles, comercios, revisión administrativa e historial. Es independiente de los datos de packs simulados del navegador. Se diseñó para un proyecto dedicado; no aplicar a proyectos ajenos sin verificar su esquema.

## Activación

1. Crear o seleccionar el proyecto autorizado por el usuario. El intento de crear **APROVECHO** en la organización conectada fue rechazado por el límite de dos proyectos gratuitos activos. No se pausó, borró ni modificó ninguno.
2. Inspeccionar tablas y migraciones existentes. Aplicar `schema.sql` con una migración remota `cuentas_y_comercios` mediante Supabase MCP.
3. Configurar Auth: Site URL `https://aprovecho-app-demo.vercel.app`; permitir redirecciones a esa raíz y a `https://aprovecho-app-demo.vercel.app/?auth=recovery`. Mantener confirmación de correo. Verificar envío/entrega de correo y recuperación antes de publicar como funcional.
4. Cargar en `private.ap_founders` las cuatro direcciones exactas suministradas por el usuario. No registrar el dominio entero ni poner la lista de fundadores en el cliente público. Los usuarios existentes deben tener correo confirmado para recibir el rol admin.
5. Obtener URL y clave **publicable** con el conector y completar `app/js/auth-config.js`. Nunca distribuir una clave `service_role`.
6. Ejecutar advisors y verificar en el proyecto real: consumidor, comercio, fundador verificado, aislamiento por RLS, recuperación, cierre de sesión y registro.
7. Desplegar la carpeta app en el proyecto Vercel existente `aprovecho-app-demo`. Actualizar la versión de la PWA si se cambian recursos.

## Permisos

- Alta pública: consumer o merchant. `account_type=admin` enviado por el cliente termina como consumer.
- Admin: coincidencia exacta en una lista privada + correo confirmado. El perfil en la base es la autoridad; `user_metadata` no concede permisos.
- Perfiles: cada usuario lee el propio; solo puede editar su nombre. Admin puede listar perfiles.
- Comercios: titular y admin pueden leer. Titular edita datos comerciales. Solo admin cambia el estado; el trigger deja un evento de auditoría.
- Sin permisos anónimos sobre tablas. RLS activada. Funciones privilegiadas en esquema privado, con search_path fijo y ejecución revocada salvo el predicado de administración.
- No hay asignación de administradores desde la app ni invitaciones enviadas automáticamente.

## Pruebas

`app/tests/permisos.cjs` ejecuta el SQL con PostgreSQL/PGlite, incluyendo RLS y ataques de autoasignación de rol. Requiere `@electric-sql/pglite@0.3.14`; puede indicarse con `PGLITE_MODULE`.

`app/tests/cuentas.cjs` recorre las pantallas con Playwright, el SDK real y una API simulada. Estas pruebas no sustituyen la verificación contra Supabase real ni la entrega de emails.

El CLI instalado en work fue 3.1.0. `supabase migration new` no pudo ejecutarse por intentar crear su configuración fuera del workspace (`/home/agent/.supabase`). Se conserva `schema.sql` sin inventar un timestamp de migración. El MCP permite aplicar una migración remota cuando el proyecto esté disponible.
