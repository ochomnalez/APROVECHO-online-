# Handoff · Landing v5 publicada en Vercel

- **Fecha:** 2026-11-11
- **Firma:** `codex-octi-landing`
- **Rama:** `codex/aprovecho-landing`
- **URL pública:** https://aprovecho-landing.vercel.app/
- **Proyecto de Vercel:** `aprovecho-landing` (`prj_rRtFyCnM5f3LgyllPGHzyfmhh3DL`).
- **Deployment:** `dpl_Bg8MAER4xTVP1F3d1p4ByJosmdLf`.
- **Commit publicado:** `22bb1f6896ff350e0b623e546b8c177955361fc5`, rama `codex/aprovecho-landing`.

## Publicación realizada

Octavio autorizó publicar la landing y luego habilitó el acceso a Vercel en el nuevo entorno. Se verificó la autenticación sin mostrar ni guardar valores del token.

Se creó el proyecto y se publicó directamente desde GitHub mediante la API de Vercel, con el build `python3 landing/src/v5/deploy.py` y salida `landing-dist`. No se modificaron los otros proyectos de la cuenta.

La API de Vercel confirmó `readyState: READY`, `aliasAssigned: true`, sin error de build ni de alias. El dominio principal `aprovecho-landing.vercel.app` figura verificado y asignado. El log remoto confirma la generación de v5.html, v5.min.css y v5.js, el paquete de 141 archivos / 32,9 MiB y `Deployment completed`.

El proyecto se desplegó por Git source; no se afirmó ni configuró una conexión automática para publicar cada push. Para publicar futuras modificaciones, reconstruir y desplegar explícitamente la rama actual, o configurar después la integración continua en Vercel. El vercel.json de la raíz conserva las instrucciones de build.

## Calidad de videos: requisito explícito de Octavio

- Todos los videos se conservan originales: sin recomprimir, reescalar ni cambiar codecs.
- El empaquetador copia los archivos con `shutil.copy2`, sin usar FFmpeg ni ninguna transformación.
- Se compararon por SHA-256 los 30 archivos públicos de `landing-dist/video` con sus originales: todos idénticos byte por byte (28.288.230 bytes en total).
- SHA-256 del onboarding original: `bc3dadbaf2f83c20370f2c2273255f8e53a1f0db2d6ef0b96de73c1b6b24d1b2`.
- Solo se excluyen originales de producción sin uso dentro de `video/hero-ia/src`; los videos y pósters utilizados por la landing están incluidos.

## Evidencia y límites de verificación

- Build remoto y dominio asignado: confirmados por Vercel API.
- La salida estática y la prueba de regresión de los tres planes habían sido verificadas sobre el mismo commit antes de publicar.
- La comprobación HTTPS del dominio público desde esta máquina fue bloqueada por el proxy del entorno: solo está habilitado `api.vercel.com`. Ese CONNECT 403 pertenece al proxy y no demuestra un error de la web publicada. No se afirma haber abierto el sitio remoto en un navegador desde esta sesión.
- Se evitó reducir la calidad para resolver el rechazo del proxy al subir el archivo de video largo: la publicación desde GitHub lo conserva completo.

## Pendientes existentes

Los formularios siguen siendo demostraciones que guardan datos en el navegador; esta publicación no implementa un backend de captación. Siguen pendientes los enlaces definitivos de contacto/app, legales y la futura ubicación de «Cuánto te queda». El artifact anterior de Claude permanece desactualizado; usar ahora la URL de Vercel.
