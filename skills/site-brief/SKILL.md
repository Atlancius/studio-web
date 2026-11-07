---
name: site-brief
description: "Dialogue guidé, une question à la fois, qui produit brief.md d'un site (landing ou multi-pages, objectif chiffré, persona, valeur, ton, direction visuelle, AIDA ou PAS). Déclencheurs : brief de site, cadrer mon site, démarrer un site."
---

# Brief d'un site web

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion`, 2 à 4 options, la recommandée en premier ; Codex : choix numérotés dans le chat) et « je ne sais pas, propose-moi » quand c'est utile. Avant chaque question, dire en une phrase simple pourquoi on la pose.

## 0. Reprendre ce qui est déjà répondu

Lire `.studio/state.json` et `.studio/cadrage.md` s'ils existent. Pour chaque point ci-dessous déjà renseigné (type de site, objectif, persona, valeur, ton, direction design, langues), l'annoncer en une ligne et demander « je garde ? ». Ne poser que les questions manquantes ou refusées. Un `brief.md` existe déjà : proposer de le compléter plutôt que de repartir de zéro.

## 1. Questions (une par une, attendre la réponse)

1. **Type de site** : landing page (une page, un seul objectif, idéale pour une offre ou une pub) ou site multi-pages (plusieurs services, référencement Google sur la durée) ? Hésitation : faire décrire le but en 2 phrases et recommander. Arbre : un seul objectif mesurable → landing ; trafic payant ou réseaux → landing ; trafic Google ou expertise à démontrer → multi-pages.
2. **Objectif mesurable** : un chiffre et une période. Proposer des exemples adaptés (« 20 demandes de devis par mois », « 50 inscrits par mois », « 10 réservations par semaine »). Refuser le flou poliment et aider à chiffrer.
3. **Persona** en 4 points, une sous-question à la fois : qui (âge, métier, situation), son problème réel, sa motivation profonde, ses objections ou freins. Proposer des exemples tirés de son activité.
4. **Proposition de valeur** en une phrase. Proposer 2 ou 3 formulations à partir des réponses, l'élève choisit ou corrige.
5. **Ton de voix** : 3 adjectifs. Test de l'opposé : un bon adjectif a un opposé crédible chez un concurrent ; refuser « professionnel » ou « qualitatif » et proposer des alternatives (chaleureux, direct, expert, audacieux, rassurant, haut de gamme, ludique…). Puis tutoiement ou vouvoiement.
6. **Direction visuelle** (si `direction_design` vide et pas de maquette) : ambiance (sobre et épurée / chaleureuse et naturelle / audacieuse et colorée / haut de gamme / technique et moderne / « propose-moi »), couleurs imposées (logo, charte existante), ce qu'il faut éviter, 1 à 3 sites qu'il aime et pourquoi.
7. **Framework de l'accroche** : AIDA (par défaut, attention-intérêt-désir-action) ou PAS (problème-agitation-solution, si la cible ressent une douleur concrète). Expliquer en une ligne et recommander.
8. **Contraintes** : langues, mentions légales particulières, secteur réglementé (santé, finance, droit), délais, ou « rien de particulier ».

## 2. Écrire brief.md

Rédiger l'accroche (3 à 4 paragraphes) avec `copywriting`. Écrire `brief.md` à la racine du projet :

```markdown
# Brief — [nom du projet]

## Type de site
[Landing page / Site multi-pages] — justification : [critères]

## Objectif mesurable
[chiffré, vérifiable]

## Persona
- **Qui :** …
- **Problème :** …
- **Motivation profonde :** …
- **Objections :** …

## Proposition de valeur
[une phrase]

## Ton de voix
Trois adjectifs : [adj1], [adj2], [adj3]
[tutoiement/vouvoiement, longueur des phrases, mots à éviter et à privilégier]

## Direction visuelle
[ambiance, couleurs imposées, à éviter, sites de référence et ce qui plaît]

## Copywriting
Framework : [AIDA / PAS]
[draft qui nomme chaque lettre du framework]

## Contraintes particulières
[…]
```

Mettre aussi à jour les champs correspondants de `.studio/state.json` (`type_site`, `objectif`, `persona`, `ton`, `direction_design`, `langues`) s'il existe.

## 3. Validation avant d'écrire

- [ ] Objectif chiffré
- [ ] Persona : 4 points renseignés
- [ ] Proposition de valeur en une phrase
- [ ] Adjectifs non génériques (test de l'opposé)
- [ ] Direction visuelle notée (ou maquette existante)
- [ ] Draft : chaque étape du framework nommée
- [ ] Choix landing ou multi-pages justifié par l'objectif

Un critère manquant : reposer la question, ne pas écrire le fichier. Montrer le brief et demander validation ou ajustements.

## Suite

Annoncer `./brief.md` prêt, puis enchaîner sur `site-architecture`.
