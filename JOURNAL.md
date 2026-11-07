# Journal — Studio Web

## 2026-11-07 — v1.0.0, création du pack
- Pack de 46 skills (site, blog, design, marketing, rédaction, SEO, analytics) pour les élèves de Jeff, à son nom, licence propriétaire (modèle Pushup).
- Ajout de `demarrer` (cadrage interactif, 36 questions avec règles de saut, modules activés selon les réponses) et `comptes` (catalogue des comptes par module, vérification un par un).
- Pilotes `site-pilote`, `design-pilote`, `blog-pilote` réécrits : lecture de `.studio/state.json` et `.studio/cadrage.md`, questions une à une avec options, gestion nouveau / refonte / modification.
- Nettoyage : chemins machine, règles perso et licences par skill retirés ; contenus utiles rapatriés dans `references/` (WCAG, motion, règles SEO, Resend).
- Contrôles : `claude plugin validate` vert ; installation réelle dans un profil Claude Code temporaire, 46 skills chargés.
- Dépôt GitHub privé `Atlancius/studio-web`, accès élèves en lecture via `scripts/inviter-eleve.sh`.
