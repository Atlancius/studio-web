# Décisions (ADR)

## ADR-001 — Un seul plugin avec un orchestrateur de cadrage (2026-11-07)
- Contexte : les élèves débutants ne savent pas quel skill lancer ni quels comptes créer.
- Décision : un plugin unique `studio-web`, point d'entrée `demarrer` qui active ou saute les modules (blog, réseaux, formulaire, analytics) selon les réponses, puis `comptes`.
- Écarté : plusieurs plugins séparés (site, blog, marketing) — l'élève devrait choisir seul l'ordre et refaire le cadrage dans chacun.

## ADR-002 — État partagé dans `.studio/` (2026-11-07)
- Décision : `.studio/state.json` et `.studio/cadrage.md` écrits une fois, lus par chaque pilote ; chaque pilote garde son propre état (`site.json`, `blog.json`, `design.json`). `.studio/` exclu de Git.
- Écarté : un fichier d'état par skill sans cadrage commun — questions reposées à chaque module.

## ADR-003 — Ne garder que des skills dont l'auteur peut céder les droits (2026-11-07)
- Décision : skills de la collection d'origine (accord de l'ayant droit) et skills écrits par Jeff ; skills d'Anthropic, Vercel ou d'autres auteurs exclus. Mention MIT de BMAD-METHOD conservée (`THIRD-PARTY-NOTICES.md`).
- Écarté : intégrer les skills Apache ou MIT tiers sous le nom de Jeff — contraire à leurs licences.

## ADR-004 — Images indépendantes de l'outil (2026-11-07)
- Décision : outil d'image disponible dans la session, sinon photos de l'élève ou banque libre ; service payant seulement au choix de l'élève, coût annoncé avant chaque lot. Jamais de texte ou de logo collé sur une image générée.
- Écarté : imposer un service payant précis.

## ADR-005 — Distribution par dépôt GitHub privé (2026-11-07)
- Décision : dépôt privé `Atlancius/studio-web`, élèves invités en lecture seule ; installation Claude Code par `/plugin marketplace add Atlancius/studio-web`, Codex par clone + `scripts/installer-codex.sh`.
- Écarté : zip en pièce jointe (pas de mise à jour, copies non contrôlées) ; dépôt public (contenu visible de tous).
- Conséquence : chaque élève a besoin d'un compte GitHub et de `gh auth login` avant l'installation.

## ADR-006 — Commandes multiplateformes en Node (2026-11-07)
- Décision : seules les commandes Node (≥ 20), npx, git et gh dans les skills ; scripts `.mjs` sans dépendance ; installation via les marketplaces natives de Claude Code et Codex.
- Écarté : imposer Git Bash à tous (Codex sous Windows n'y passe pas) ; doubler chaque commande en bash et PowerShell (deux versions à maintenir).
