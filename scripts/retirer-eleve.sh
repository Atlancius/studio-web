#!/usr/bin/env bash
# Retire l'accès d'un élève au dépôt privé Studio Web.
# Usage : scripts/retirer-eleve.sh pseudo-github
set -euo pipefail
REPO="${STUDIO_WEB_REPO:-Atlancius/studio-web}"
[ $# -eq 1 ] || { echo "Usage : $0 pseudo-github"; exit 1; }
gh api -X DELETE "repos/$REPO/collaborators/$1" >/dev/null && echo "Accès retiré pour $1."
