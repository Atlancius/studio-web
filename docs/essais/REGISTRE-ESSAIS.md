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


## E-005 — 2026-11-07 — Scripts Node multiplateformes
- `node --check` sur les 10 scripts `.mjs` ; zip du thème Ghost vérifié avec `unzip -t` (package.json à la racine, mêmes fichiers que `zip` système sur Source v1.7.6) ; inventaire légal identique à l'ancien script bash ; captures Playwright détectant erreur console, 404 et débordement mobile.
- Limite : exécutés sur macOS seulement, pas encore sur une vraie machine Windows. Verdict : retenu, à confirmer sous Windows.

## E-006 — 2026-11-07 — Installation Codex depuis le dossier local
- `CODEX_HOME` temporaire, `codex plugin marketplace add <dossier>`, `codex plugin add studio-web@studio-web` : 46 skills. Verdict : retenu.
## À faire
- Parcours complet `demarrer` avec un vrai élève (nouveau site, puis refonte) ; noter le retour mot pour mot.
