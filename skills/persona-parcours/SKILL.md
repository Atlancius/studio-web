---
name: persona-parcours
description: "Définit la cible du site en texte : persona, parcours du visiteur, écrans clés en wireframe texte, heuristiques de Nielsen, accessibilité. Déclencheurs : persona, cible, parcours utilisateur, UX, avant le design visuel."
argument-hint: "<brief, cadrage ou idée>"
---

# Personas, parcours et wireframes textuels

Chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Pas de script. Questions et validations : `AskUserQuestion` (Claude) ou question dans le chat (Codex).

Périmètre : la conception UX d'un site ou d'une fonctionnalité, en texte, avant tout design visuel. Utile surtout quand la cible est floue (« tout le monde », pas de problème précis). Wireframes graphiques → `design-wireframe` ; direction visuelle → `design-pilote` ; audit WCAG d'un code existant → `accessibilite`.

Public débutant : expliquer en une phrase ce qu'est un persona (« un portrait précis de ton visiteur idéal, pour que chaque choix du site lui parle ») et poser les questions **une à la fois**, avec des exemples de réponses.

## Principes

- Partir du besoin utilisateur : pas de wireframe avant des personas validés.
- Personas fondés sur des données (recherche, support, analytics) ; sans donnée, les marquer "hypothèse" et le dire.
- Accessibilité dès la conception, jamais en fin de parcours.
- Chaque décision UX est justifiée (raison et alternatives écartées).

## Workflow

```
- [ ] 1. Contexte et profondeur
- [ ] 2. Personas validés
- [ ] 3. Parcours validés
- [ ] 4. Wireframes textuels validés
- [ ] 5. Heuristiques et accessibilité
- [ ] 6. Document UX enregistré
```

### 1. Contexte et profondeur

Lire `.studio/state.json` (`persona`, `objectif`, `type_site`) et `.studio/cadrage.md` s'ils existent, puis le brief (`brief.md`) ou la source donnée ; repérer ce qui est déjà répondu (l'annoncer et demander « je garde ? ») et ne pas le redemander. Choisir la profondeur et l'annoncer en une ligne : léger (1-2 écrans : un persona, un parcours), standard (3-5 écrans), complet (6 écrans ou plus, ou branches). L'utilisateur peut la changer.

### 2. Personas

Un persona principal, un secondaire si nécessaire : profil, objectif, frustrations, motivations, objections avant d'acheter ou de contacter, contexte d'usage (appareil, moment, lieu), niveau technique. Questions guidées, une à la fois : « Qui est ton client idéal (âge, métier, situation) ? », « Quel problème a-t-il qui l'amène sur ton site ? », « Qu'est-ce qui le ferait hésiter ? », « Il te découvre sur téléphone ou sur ordinateur ? ». Faire valider avant de continuer, puis reporter le persona dans `persona` de `.studio/state.json` s'il existe.

### 3. Parcours

Pour chaque parcours clé : persona, objectif, contexte de départ, puis un tableau par étape (action, pensée, émotion, friction, opportunité). Terminer par les moments critiques (friction majeure et solution, moment de réussite) et les métriques à suivre (conversion par étape, abandon, temps par tâche). Faire valider.

### 4. Wireframes textuels

Un écran = un objectif, sa provenance, sa destination, un schéma en caractères, la table des éléments (zone, contenu, priorité, interactions) et les quatre états : vide, chargement, erreur, succès. Gabarit et exemple : [references/ux-template.md](references/ux-template.md). Les écrans clés suffisent. Faire valider.

### 5. Heuristiques et accessibilité

Évaluer les dix heuristiques de Nielsen (visibilité du statut, correspondance avec le monde réel, contrôle et liberté, cohérence et standards, prévention des erreurs, reconnaissance plutôt que rappel, flexibilité et efficacité, design minimaliste, aide à reconnaître et corriger les erreurs, aide et documentation) : statut ok / à surveiller / à corriger, avec la correction.

Accessibilité, cible WCAG 2.2 niveau AA : contraste texte 4,5:1 (3:1 pour le grand texte), navigation clavier complète avec focus visible, alternatives textuelles, cibles tactiles d'au moins 24 x 24 px CSS (critère 2.5.8 ; 44 x 44 px est le niveau AAA et reste la bonne taille pour le tactile), libellés explicites, messages d'erreur utiles. Liste complète dans [references/ux-template.md](references/ux-template.md).

### 6. Document

Enregistrer le document UX avec le plan de [references/ux-template.md](references/ux-template.md) dans le projet (par défaut `docs/ux/UX-<slug>.md`) : personas, parcours, wireframes, évaluation, décisions UX (décision, justification, alternatives écartées), questions ouvertes.

Contrôle de sortie avant de conclure : au moins un persona, le parcours principal, les écrans clés avec leurs quatre états, heuristiques évaluées, checklist accessibilité remplie, décisions justifiées. Sinon compléter.

Suite possible, à proposer sans l'enchaîner : passer au design visuel (`design-pilote`, `design-wireframe`) ou au brief du site (`site-brief`). Dans le parcours complet, rendre la main au skill qui a appelé celui-ci.
