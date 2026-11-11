# Cuentas de APROVECHO

`schema.sql` prepara perfiles, comercios, revisión administrativa e historial. Es independiente de los datos de packs simulados del navegador. Se diseñó para un proyecto dedicado; no aplicar a proyectos ajenos sin verificar su esquema.

## Proyecto conectado

- **APROVECHO:** `cggqyfzqmfzkjjitirco`, región sa-east-1, organización Cursala simple.
- Migración remota aplicada: `20261111182935_cuentas_y_comercios`, copia en `migrations/`.
- URL y clave publicable configuradas en `app/js/auth-config.js`. No hay claves de servicio en el cliente.
- Cuatro correos exactos de fundadores cargados en lista privada. No se habilitó un dominio completo.
- El usuario confirmó Site URL `https://aprovecho-app-demo.vercel.app` y redirect allowlist `https://aprovecho-app-demo.vercel.app/**`.
- «ropa» se pausó con autorización para liberar el cupo gratuito. «MVP nativa digital» rechazó la pausa por hibernación y no se modificó.

Para una actualización, aplicar la nueva migración autorizada, ejecutar pruebas/advisors, y publicar solo la carpeta app en el proyecto Vercel existente `aprovecho-app-demo`. La publicación actual es una carga de archivos, sin conexión Git automática.

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
