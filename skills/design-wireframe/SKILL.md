---
name: design-wireframe
description: "Crée un wireframe basse fidélité (structure, hiérarchie, gris) d'une page, une question à la fois, avec Frame0 si disponible ou en HTML gris sinon, et sort une section map JSON. Première phase de design, avant la maquette."
---

# Wireframe (basse fidélité)

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : Claude `AskUserQuestion`, Codex dans le chat, une à la fois.

Objectif : fixer la structure, la hiérarchie et l'ordre du contenu avant tout style. Gris uniquement, ni couleur ni image. Expliquer à l'élève en une phrase : « on décide d'abord où va chaque bloc, on s'occupera des couleurs ensuite ».

## Outil

- **Frame0** (si un serveur MCP Frame0 est connecté et l'app desktop ouverte avec son API Server activé) : lister les outils réellement exposés plutôt que supposer leurs noms.
- **Sans Frame0 (repli par défaut)** : écrire `wireframe.html`, une page HTML autonome en niveaux de gris (blocs `background:#e5e5e5`, textes factices de longueur réaliste, bouton principal en gris foncé), ouverte dans le navigateur pour que l'élève la voie. À défaut de navigateur, décrire la structure en texte.

## Procédure

Checklist :
- [ ] 1. Reprendre ce qui existe : `.studio/state.json` (type de site, pages, objectif) et `.studio/design.json` (brief). Ne demander que ce qui manque, une question à la fois : type de page ; sections clés (proposer une liste type adaptée : en-tête, hero, bénéfices, preuve sociale, offre, FAQ, contact, pied de page) ; action principale ; ordre de priorité du contenu.
- [ ] 2. Construire : boîtes grises par bloc, textes factices réalistes, sections ordonnées par priorité, éléments liés groupés, bouton d'action principal bien visible, espace généreux. Version mobile (375 px) vérifiée aussi.
- [ ] 3. Contrôler avec `design-review` (hiérarchie, rythme, alignement, visibilité de l'action principale) ; corriger puis recontrôler.
- [ ] 4. Présenter à l'élève : **valider**, **ajuster** (changements ciblés puis nouveau contrôle) ou **recommencer** (retour à 1).
- [ ] 5. Une fois validé, produire la section map.

Passer à l'étape 2 dès que le contexte suffit à un wireframe utile.

## Sortie : section map JSON

Contrat avec `design-mockup` (enregistré aussi dans `.studio/design.json` → `wireframe.section_map`) :

```json
{
  "page_type": "landing",
  "sections": [
    { "id": "hero", "type": "hero", "priority": 1,
      "content": "Titre, sous-titre, bouton principal", "layout": "centré, pleine largeur" },
    { "id": "features", "type": "feature-grid", "priority": 2,
      "content": "3 cartes : icône, titre, description", "layout": "grille 3 colonnes" }
  ]
}
```

Utilisable seul ; dans le parcours complet, voir `design-pilote`.
