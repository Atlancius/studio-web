#!/usr/bin/env bash
# Installe ou met à jour les skills Studio Web pour Codex (dans ~/.agents/skills).
# Usage : bash installer-codex.sh   (depuis un clone du dépôt, ou après gh repo clone)
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)/skills"
DEST="${HOME}/.agents/skills"
mkdir -p "$DEST"
for d in "$SRC"/*/; do
  n="$(basename "$d")"
  if [ -e "$DEST/$n" ] && [ ! -e "$DEST/$n/.studio-web" ]; then
    echo "Ignoré : $DEST/$n existe déjà et ne vient pas de Studio Web."; continue
  fi
  mkdir -p "$DEST/$n"
  cp -R "$d". "$DEST/$n/"
  touch "$DEST/$n/.studio-web"
done
echo "Skills Studio Web installés dans $DEST. Relance Codex."
