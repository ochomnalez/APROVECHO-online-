#!/usr/bin/env bash
# Agrega una línea a docs/BITACORA.md: quién hizo qué, en qué rama y commit.
# Uso: scripts/bitacora.sh "<agente>" "<qué hice>" "<próximo paso>"
# Ejemplo: scripts/bitacora.sh "codex-app" "Prototipo: flujo de publicación con fotos reales" "Sumar vista de escritorio de Intelligence"
set -euo pipefail
if [ "$#" -lt 2 ]; then
  echo 'Uso: scripts/bitacora.sh "<agente>" "<qué hice>" ["<próximo paso>"]' >&2
  exit 1
fi
root="$(git rev-parse --show-toplevel)"
fecha="$(TZ=America/Argentina/Buenos_Aires date '+%Y-%m-%d %H:%M')"
rama="$(git rev-parse --abbrev-ref HEAD)"
commit="$(git rev-parse --short HEAD)"
sigue="${3:-—}"
printf '| %s | %s | `%s` | `%s` | %s | %s |\n' "$fecha" "$1" "$rama" "$commit" "$2" "$sigue" >> "$root/docs/BITACORA.md"
echo "Bitácora actualizada. Ahora: git add docs/BITACORA.md && git commit -m \"bitacora: $1\" && git push"
