# Handoff · Landing · Publicación en Vercel

- **Fecha:** 2026-11-11
- **Firma:** `codex-octi-landing`
- **Rama:** `codex/aprovecho-landing`
- **Autorización:** Octavio pidió crear un enlace web en Vercel o un servicio equivalente.

## Preparado y probado

- `vercel.json` en la raíz: framework Other, comando `python3 landing/src/v5/deploy.py`, salida `landing-dist`.
- El empaquetador reconstruye las fuentes y publica la v5 como `index.html`. La v4 no se modifica como página de respaldo.
- Paquete estático de 141 archivos / 32,9 MiB con CSS, JS, fuentes, fotos y videos. Excluye código fuente, documentos, propuestas y originales de video sin uso.
- `landing-dist/` y `.vercel/` se ignoran en Git.
- Validación del paquete servido localmente en su raíz: assets referenciados presentes, v5 correcta y prueba completa de los tres planes / vuelta sin repetir / cambio de ancho superada. No es una publicación externa.

## Bloqueo comprobado

- No hay VERCEL_TOKEN ni sesión local de Vercel o Netlify, ni herramientas de despliegue conectadas.
- `https://api.vercel.com/v2/user` fue rechazado por el proxy del entorno (CONNECT HTTP 403).
- La API de GitHub también devuelve Forbidden desde esta máquina; el acceso Git por proxy sigue funcionando, pero no demuestra acceso para configurar GitHub Pages.
- Las herramientas de configuración del entorno fallaron al leer el borrador y no pudieron confirmar el guardado de una solicitud aditiva de VERCEL_TOKEN para api.vercel.com. No se afirma que ese requisito haya quedado guardado.

## Paso pendiente para obtener el enlace

En la cuenta de Vercel de Octavio:

1. Abrir https://vercel.com/new e importar `ochomnalez/APROVECHO-online-`.
2. Elegir la rama **`codex/aprovecho-landing`**, manteniendo **Root Directory en la raíz del repositorio**, no en `landing/`.
3. El archivo `vercel.json` define el build y la carpeta pública. Publicar con Deploy y usar la URL que Vercel genere.

Si se quiere que el agente haga la publicación por API, primero hace falta habilitar `api.vercel.com` y agregar `VERCEL_TOKEN` de forma segura en la configuración del entorno. Nunca pegar el token en el chat. Una vez disponible, verificar el acceso antes de desplegar y probar la URL real antes de comunicarla.

No se creó una cuenta, un proyecto externo, un deployment ni una URL pública. No se gastaron créditos de generación.

## Límites existentes del prototipo

Los formularios de `landing/js/forms.js` siguen siendo simulados y guardan datos en el navegador; publicar el HTML no conecta un backend de captación. Los enlaces reales de contacto/app y los textos legales siguen pendientes del handoff previo. La autorización de publicar la vista no se interpretó como un pedido de implementar esos servicios.
