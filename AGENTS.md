# AGENTS.md · Instrucciones para Codex y otros agentes

Este repo lo coordina un **agente líder (Claude)**. Las reglas completas están en **`CLAUDE.md`**: leelo primero y seguilo igual que un agente de Claude.

**¿Te toca ser el líder/orquestador?** (por ejemplo, ChatGPT reemplazando a Claude): leé **`docs/ORQUESTADOR.md`** antes de hacer nada.

Resumen obligatorio:

1. **Fuente de verdad:** `docs/fuente/` (extracto del plan de negocios). No inventes datos; revisá `docs/fuente/09-inconsistencias-y-preguntas.md` antes de usar números.
2. **Tu tarea está en un brief:** `docs/briefs/<NN>-<rol>.md`. Hacé solo lo que dice el brief.
3. **Decisiones vigentes:** `docs/decisiones.md`. Tablero: `docs/ESTADO.md`.
4. **Ramas:** trabajá en `codex/aprovecho-<rol>` y abrí el PR contra `claude/gallant-planck-ps6te6` (rama de integración). Nunca contra `main`.
5. **Al terminar:** escribí un handoff en `docs/handoffs/` con la plantilla `_plantilla.md` y actualizá tu fila en `docs/ESTADO.md`.
6. **Textos públicos** en español rioplatense con voseo. Separar siempre lo **medido** de lo **estimado**.
7. **No** generes imágenes, videos ni voces pagas, **no** crees cuentas o proyectos externos y **no** publiques nada sin el OK del usuario.
8. **Bitácora:** en cada push o merge corré `scripts/bitacora.sh "<agente>" "<qué hice>" "<próximo paso>"` y commiteá `docs/BITACORA.md`. Tus commits llevan el trailer `Agente: <agente>` (por ejemplo `Agente: codex-app`).
9. **Tablero (obligatorio):** al terminar cada bloque, actualizá `docs/tablero/visual.html` (bloque `DATOS`: `pct` de los pasos, `pedidos`, `actualizado` y la entrada del día en `historial`). Detalle en `CLAUDE.md` §9.12.
