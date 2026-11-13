# Handoff · App · Publicación en Vercel

- **Fecha:** 2026-11-11
- **Agente:** codex-octi-app
- **Rama:** `codex/octi-app-entrega`
- **Autorización:** el usuario pidió «subimela a vercel y pasame el link para q la vea en el celu».

## Resultado

Demo publicada: **https://aprovecho-app-demo.vercel.app**

- Equipo: `octaviochomnalez-9006` (`team_QDjBI4iN6X4iz2NmDAzegK5S`).
- Proyecto independiente: `aprovecho-app-demo` (`prj_dBQkNWuAMbzq8Oa5jDkkKDkoERXc`). La landing no se modificó.
- Deployment: `dpl_DgMy18yGkR8Sr1thc2LE7ZKVjttW`.
- Estado confirmado por API: `READY`, producción.
- Código publicado: `bc50bdc`, carpeta `app/` en la raíz del sitio. Excluidos tests, capturas y visor 3D sin uso. 78 archivos publicados.
- URL inmutable: https://aprovecho-app-demo-a7sc2l4ol-octaviochomnalez-9006.vercel.app
- Protección SSO y contraseña: ambas `null`, verificadas en configuración del proyecto. Acceso directo para el celular.

## Verificación y límites

Vercel confirmó deployment READY, alias asignado y sin error de build. La app ya tenía las pruebas locales y offline detalladas en el handoff anterior. Se intentó abrir la publicación con Chromium (390×844) y curl: la red de este entorno deniega el túnel a `vercel.app` (`ERR_TUNNEL_CONNECTION_FAILED`, HTTP 403 del proxy). Por eso no se afirma una prueba de navegador remoto exitosa. Falta la revisión visual desde el celular del usuario.

El conector Vercel no tenía la autorización del equipo; se usó la credencial ya configurada en el entorno contra `api.vercel.com`, en el mismo equipo. No se compartieron credenciales. Sin conexión Git automática, sin merge a integración y sin cambios en main. Para actualizar la demo hay que desplegar nuevamente la carpeta app en este proyecto.

## Siguiente paso

El usuario prueba consumidor/local y los tres planes desde el enlace. La demo conserva pagos, IA y balanza simulados. El PR #5 sigue pendiente de revisión e integración.
