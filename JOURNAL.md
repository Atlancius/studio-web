# Journal — Studio Web

## 2026-11-07 — v1.0.0, création du pack
- Pack de 46 skills (site, blog, design, marketing, rédaction, SEO, analytics) pour les élèves de Jeff, à son nom, licence propriétaire (modèle Pushup).
- Ajout de `demarrer` (cadrage interactif, 36 questions avec règles de saut, modules activés selon les réponses) et `comptes` (catalogue des comptes par module, vérification un par un).
- Pilotes `site-pilote`, `design-pilote`, `blog-pilote` réécrits : lecture de `.studio/state.json` et `.studio/cadrage.md`, questions une à une avec options, gestion nouveau / refonte / modification.
- Nettoyage : chemins machine, règles perso et licences par skill retirés ; contenus utiles rapatriés dans `references/` (WCAG, motion, règles SEO, Resend).
- Contrôles : `claude plugin validate` vert ; installation réelle dans un profil Claude Code temporaire, 46 skills chargés.
- Dépôt GitHub privé `Atlancius/studio-web`, accès élèves en lecture via `scripts/inviter-eleve.sh`.

## 2026-11-07 — v1.1.0, compatibilité Mac et Windows
- Demande de Jeff : une même commande pour Claude et Codex, sur Mac et Windows.
- Codex installe désormais le plugin nativement depuis GitHub ; ajout de `.agents/plugins/marketplace.json`.
- Toutes les commandes des skills passent par Node, npx, git (Codex sous Windows = PowerShell, sans bash, jq, grep, curl fiable, `&&`).
- `blog-theme` : règle « zéro erreur gscan » remplacée par une comparaison avec Source non modifié (Source v1.7.6 brut sort déjà 6 erreurs gscan).
- Tests : voir docs/essais (E-005 à E-007).
