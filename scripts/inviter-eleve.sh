#!/usr/bin/env bash
# Donne l'accès en lecture au dépôt privé Studio Web à un ou plusieurs élèves.
# Usage : scripts/inviter-eleve.sh pseudo-github [autre-pseudo ...]
# Prérequis : gh connecté avec un compte administrateur du dépôt.
set -euo pipefail
REPO="${STUDIO_WEB_REPO:-Atlancius/studio-web}"
[ $# -ge 1 ] || { echo "Usage : $0 pseudo-github [autre-pseudo ...]"; exit 1; }
for u in "$@"; do
  gh api -X PUT "repos/$REPO/collaborators/$u" -f permission=pull >/dev/null
  echo "Invitation envoyée à $u (lecture seule). L'élève doit l'accepter : https://github.com/$REPO/invitations"
done
