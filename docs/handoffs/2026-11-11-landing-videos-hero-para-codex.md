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
