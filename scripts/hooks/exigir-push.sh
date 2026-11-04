#!/usr/bin/env bash
# Hook "Stop" de Claude Code: no deja terminar una respuesta si quedaron cambios sin commitear o sin pushear.
# Así cualquier sesión (por ejemplo, la de Lola) actualiza el repo sí o sí, aunque el usuario no lo pida.
entrada="$(cat)"
# Evitar bucles: si Claude ya está respondiendo a este mismo aviso, no volver a bloquear.
if printf '%s' "$entrada" | grep -q '"stop_hook_active":[[:space:]]*true'; then exit 0; fi
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
sucio="$(git status --porcelain 2>/dev/null | grep -v '^??' | head -1)"
nuevos="$(git status --porcelain 2>/dev/null | grep '^??' | grep -v -E '(^\?\? node_modules|\.tmp$)' | head -1)"
adelante=0
if git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
  adelante="$(git rev-list --count '@{u}..HEAD' 2>/dev/null || echo 0)"
elif [ -n "$(git log -1 --format=%h 2>/dev/null)" ]; then
  adelante=1
fi
if [ -n "$sucio$nuevos" ] || [ "${adelante:-0}" -gt 0 ]; then
  echo "OBLIGATORIO (CLAUDE.md §0): quedaron cambios sin guardar en el repo. Antes de terminar: 1) actualizá docs/tablero/visual.html y corré scripts/bitacora.sh con tu firma; 2) git add -A y commit con el trailer 'Agente: <tu firma>'; 3) git push a TU rama propia. No le preguntes al usuario: hacelo vos." >&2
  exit 2
fi
exit 0
