# APROVECHO — Instrucciones para Gemini (CLI, Code Assist o Jules)

Este archivo lo lee Gemini al arrancar en este repo. La fuente completa de reglas es **`CLAUDE.md`** (válida para todos los agentes): leelo entero. Acá van las reglas que más importan.

## Si te dicen "seguí el trabajo de Octi" (o "seguí el trabajo")
La persona del equipo **no sabe usar git**: hacé todo vos, sin pedirle nada técnico.

1. Tu firma es **`gemini-<persona>-<rol>`** (ej. `gemini-nico-landing`). Si no sabés el nombre de la persona o el rol, preguntalo una sola vez.
2. Traé lo último y creá **tu propia rama** desde la integración:
   `git fetch origin && git checkout -b gemini/<persona>-<rol> origin/claude/gallant-planck-ps6te6`
   (si ya existe: `git checkout gemini/<persona>-<rol> && git pull`).
3. Activá los controles del repo (una sola vez): `git config core.hooksPath scripts/hooks` (bloquea pushes a `main` y a la rama de integración).
4. Leé en este orden: `CLAUDE.md`, `docs/BITACORA.md` (últimas 20 líneas), `docs/ORQUESTADOR.md` (§0 y §6, cola de trabajo), `docs/decisiones.md`, y el bloque `DATOS` de `docs/tablero/visual.html`.
5. El video de Octi está en la rama `claude/aprovecho-video` (`video/src/Onboarding.jsx`). Leelo desde ahí, pero **trabajá en tu rama**.
6. Contale a la persona en 3 líneas qué vas a hacer y arrancá. Pedile OK solo para lo caro o largo (créditos, generar imágenes/video/voz, publicar).

## Reglas obligatorias (aunque nadie te lo pida)
- **Después de cada cambio:** actualizá el tablero (`docs/tablero/visual.html`, bloque `DATOS`), corré `scripts/bitacora.sh "<tu firma>" "<qué hiciste>" "<qué sigue>"`, hacé `git add -A`, commit con el trailer `Agente: <tu firma>` y `git push -u origin gemini/<persona>-<rol>`. Contale a la persona en una línea qué subiste. (Los hooks automáticos son de Claude Code: acá lo tenés que hacer vos, siempre.)
- **Nunca** pushees a `main`, a `claude/gallant-planck-ps6te6` ni a ramas de otras personas. Lo tuyo entra por **Pull Request**, que revisa Octavio.
- Textos para el público en español rioplatense con voseo. **No inventes datos**: la fuente es `docs/fuente/`. Evitá el "AI slop" (CLAUDE.md §9.10).
- Usá el **logo oficial** (`docs/marca/logo-oficial/`), no el de la propuesta v1 (D-026). No menciones el 75% (D-031).
- Respetá las decisiones de `docs/decisiones.md`.
