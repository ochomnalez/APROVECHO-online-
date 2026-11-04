# Brief · Guion y video

- **Rol:** guionista + director/a de video + editor/a de motion graphics.
- **Rama:** `codex/aprovecho-video` o `claude/aprovecho-video` · PR contra `claude/gallant-planck-ps6te6`.
- **Carpeta:** `video/`.
- **Entregas:** guiones y storyboard el viernes 6/11 (para validar); videos finales el martes 10/11.

## Videos (D-009, D-020)

| # | Video | Formato | Concepto aprobado |
|---|---|---|---|
| 1 | Presentación de APROVECHO | 60–90 s, 16:9 | 1A "La vida de una medialuna" |
| 2 | Publicidad para comercios | 15–30 s, 9:16 | 2A "Una foto" |
| 3 | Publicidad para consumidores | 15–30 s, 9:16 | 3A "¿Qué me tocó hoy?" |
| 4 | Onboarding para comercios | ~60 s, 16:9 o 9:16 | Cómo se usa: alta → foto → publicar → retiro con QR. Con las **pantallas reales del prototipo** |

Conceptos completos en `docs/marketing/conceptos-videos.md`. Voz y tono en `docs/marca/plataforma-de-marca.md`.

## Proceso (con validación intermedia, CLAUDE.md §9.3)

1. **Fase 1, sin costo:** guion escena por escena (texto en off, imagen, duración, música y SFX), storyboard (cuadros simples en HTML o imágenes de referencia) y **plan de producción con el costo estimado** por video. → El líder lo valida con el usuario.
2. **Fase 2, después del OK:**
   - Montaje y motion graphics con **Remotion** (código, gratis).
   - Imágenes: aprobadas (`docs/marca/imagenes-aprobadas/`), stock real y capturas del prototipo (`app/capturas/`).
   - Voz en off rioplatense con **ElevenLabs**. Free alcanza para uso académico; Starter (~USD 6) si se necesita licencia comercial, decisión del usuario.
   - Música: ElevenLabs o una biblioteca libre.
   - **No** generar video con IA de personas actuando sin OK explícito: es caro y se ve inconsistente.

## Reglas

- Cero "AI slop" (CLAUDE.md §9.10): nada de brillos ni partículas "mágicas" ni tipografías genéricas.
- Logo oficial: el sello (`docs/marca/logo-oficial/`).
- Claims: solo los permitidos en la plataforma de marca §8. El CO₂ siempre como "huella asociada estimada".
- Entregables en `video/` (fuentes de Remotion y MP4 finales; los archivos pesados, en GitHub Releases o Drive con su link), más handoff y línea en `docs/BITACORA.md`.
