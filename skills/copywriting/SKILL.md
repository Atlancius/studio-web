---
name: copywriting
description: "Écrit, réécrit et audite des textes qui convertissent : accroches, titres, landing et pages de vente, emails, newsletters, pubs, scripts de reels, boutons d'action. Garde la voix de l'auteur et n'invente aucun fait."
user-invocable: true
---

Convention de chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Les références s'ouvrent depuis ce dossier.

# Copywriting

## Avant d'écrire

Lire `.studio/state.json` et `.studio/cadrage.md` s'ils existent (projet, objectif, persona, ton, langues), puis `brief.md` du site. Reprendre ces informations sans les redemander. S'il manque un élément indispensable (l'action unique attendue du lecteur, le persona, l'offre réelle), poser UNE question à la fois avec des choix, en expliquant en une phrase pourquoi elle compte.

## Méthode

Classer la demande avant de toucher au texte : **audit**, **polish** (retouche), **réécriture** ou **création**.

- Audit : une note sur 10, ce qui marche, les problèmes critiques cités avec leur impact, les corrections ; aucun texte modifié.
- Polish : on garde le sens, les affirmations, la structure et la voix.
- Réécriture : on garde les faits et l'offre.
- Création : on construit l'argument à partir du produit, du prospect, des preuves et de l'offre.

Signaler les faits commerciaux manquants ; ne jamais inventer de preuve, d'urgence, de rareté ni de témoignage.

Diagnostiquer l'action unique voulue, la matière disponible, le niveau de conscience du prospect et le concept unique qui fait du produit le pont crédible. Ordre de fiabilité des sources : `mots exacts des clients → comportement observé → faits produit → preuves → conditions de l'offre → frameworks → invention`.

1. Une promesse dominante, reliée à un désir qui existe déjà.
2. Vendre le concept avant le produit : `ancienne croyance → coût caché → nouvelle croyance → produit comme pont`.
3. Chaque bloc répond à la question que le lecteur se pose à ce moment-là.
4. Fonctionnalité → mécanisme → bénéfice → preuve → expérience vécue → identité.
5. Placer objections, prix et appel à l'action quand le lecteur les attend.

Écrire dans la langue de l'utilisateur. Rendre un texte utilisable, pas des conseils. Variantes demandées : changer une seule variable stratégique et nommer l'hypothèse testée. Finir par un passage `redaction-naturelle` pour retirer les tics d'IA ; tester un texte important avec `marketing-panel-audit`.

## Références (en anglais, à ouvrir selon le besoin)

[copy-frameworks.md](references/copy-frameworks.md) pour AIDA, PAS, 4U ; [email-landing-ads.md](references/email-landing-ads.md) pour les formats par canal ; [message-strategy-research.md](references/message-strategy-research.md) pour la recherche d'angles ; [consumer-psychology.md](references/consumer-psychology.md) pour le désir ; [sugarman-writing-process.md](references/sugarman-writing-process.md) pour partir d'une page blanche ; [slippery-slide-playbook.md](references/slippery-slide-playbook.md) pour les textes longs ; [reel-copywriting.md](references/reel-copywriting.md) pour la vidéo courte.
