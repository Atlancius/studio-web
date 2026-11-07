# Recettes

## Tester une installation sans toucher sa propre config Claude Code
1. `export CLAUDE_CONFIG_DIR="$(mktemp -d)/cfg"`
2. `claude plugin marketplace add <dossier ou owner/repo>`
3. `claude plugin install studio-web@studio-web`
4. `claude plugin list` : statut `enabled` ; compter les SKILL.md sous `$CLAUDE_CONFIG_DIR`.

## Contrôle de propreté avant une version
aucun chemin propre à une machine (`/Users/`, `C:\\`) ni variable d'environnement personnelle dans les fichiers suivis ; chaque `name:` égal au nom de son dossier ; descriptions ≤ 250 caractères ; `claude plugin validate .` vert.
