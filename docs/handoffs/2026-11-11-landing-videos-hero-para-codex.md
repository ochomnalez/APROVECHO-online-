# Handoff · Videos nuevos del inicio (para que Codex publique en Vercel)

Firma: `claude-octi-landing`

## Qué cambió
Solo los clips 1 y 2 del hero (clip 3 sin cambios), con pantallas reales de la app:
- `landing/video/hero-ia/1-publica-1920.mp4`, `1-publica-1280.mp4`, `1-publica.webp`, `1-publica-640.webp`
- `landing/video/hero-ia/2-balanza-1920.mp4`, `2-balanza-1280.mp4`, `2-balanza.webp`, `2-balanza-640.webp`
Mismos nombres y mismo código que antes; no hay que tocar HTML/JS. Commit `921fcbe` (en `claude/aprovecho-landing` y `codex/aprovecho-landing`).

## Qué falta (solo Codex, que tiene el token de Vercel)
1. Verificar que Vercel despliegue la rama `codex/aprovecho-landing` (el push de `921fcbe` no actualizó https://aprovecho-landing.vercel.app: el mp4 servido seguía pesando 1.702.693 bytes; el nuevo pesa 1.668.225).
2. Redeploy a producción (`python3 landing/src/v5/deploy.py` → `landing-dist`).
3. Comprobar en la URL real: `video/hero-ia/1-publica-1920.mp4` = 1.668.225 bytes y el inicio rota publica → balanza → entrega.

## Candidatos y fuentes
`landing/video/hero-ia/src/v6-pantallas/`: cuadros de inicio/final, pantallas usadas, scripts y clips originales 1080p. Limitación conocida: el texto chico de las pantallas sale algo deformado en movimiento (p. ej. "Publicaste 3 packs"); quedan USD 1,74 de presupuesto Gemini para regenerar, con OK de Octavio.

## Revisión de publicación · codex-octi-landing · 2026-11-11

- Fetch explícito de la rama y avance rápido a `10868ce`; los dos MP4 1920 pesan 1.668.225 y 2.876.541 bytes en el repo y en `landing-dist`. Build completado sin modificar código.
- API Vercel: proyecto `aprovecho-landing` (`prj_rRtFyCnM5f3LgyllPGHzyfmhh3DL`), equipo `team_QDjBI4iN6X4iz2NmDAzegK5S`, conexión Git `link: null`. No hay vínculo que dispare deploys por push. Producción READY: `dpl_o26rnqrqktjuQhoZ8fCewgKqrLJJ`, repo `ochomnalez/APROVECHO-online-`, rama `codex/octi-landing-enlace-app`, commit `54863e6`.
- **Diferencia que obliga a detenerse:** la rama de videos no incluye `54863e6`; al compararla con producción, además de los assets cambia el HTML y JS de los botones de descarga: vuelve `APP_URL` a vacío y los enlaces a `#consumidores`. Desplegar tal cual quitaría el acceso directo a la app solicitado y ya publicado.
- Se frenó antes del deploy según la regla explícita del usuario. Sin cambios en HTML/CSS/JS ni assets. No se verificaron los nuevos tamaños, rotación ni consola en la URL real, dado que esta versión no se publicó.
- Próximo paso propuesto: autorizar incorporar el cambio ya publicado `54863e6` a la rama de videos y luego desplegar; no se aplicó esa corrección por cuenta propia. Solo se registra el bloqueo en documentación. Sin gastos de generación.
