# Registre des essais

## E-001 — 2026-11-07 — Validation du manifeste
- Commande : `claude plugin validate .` et `claude plugin validate --strict .claude-plugin/plugin.json`
- Résultat : validation passée. Verdict : retenu.

## E-002 — 2026-11-07 — Installation locale depuis le zip
- Recette : profil isolé `CLAUDE_CONFIG_DIR=$(mktemp -d)/cfg`, puis `claude plugin marketplace add <dossier>` et `claude plugin install studio-web@studio-web`.
- Résultat : plugin activé, 46 SKILL.md chargés. Verdict : retenu.

## E-003 — 2026-11-07 — Installation depuis le dépôt GitHub privé
- Recette : profil isolé, `claude plugin marketplace add Atlancius/studio-web`, `claude plugin install studio-web@studio-web`.
- Résultat : marketplace ajoutée, plugin activé, 46 skills chargés (copie marketplace + cache d'installation). Verdict : retenu.

## E-004 — 2026-11-07 — Installation Codex depuis le dépôt
- Recette : `gh repo clone Atlancius/studio-web` puis `scripts/installer-codex.sh` avec un HOME temporaire.
- Résultat : 46 skills dans `~/.agents/skills`. Verdict : retenu.

## À faire
- Parcours complet `demarrer` avec un vrai élève (nouveau site, puis refonte) ; noter le retour mot pour mot.
