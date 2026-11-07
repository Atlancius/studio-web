---
name: site-corrige
description: "Modifie une section de landing ou un template de site multi-pages, avec répercussion sur les pages concernées et le reste intact. Déclencheurs : corriger une section, changer un texte, modifier le site, ajouter une page."
---

# Correction ciblée d'une section ou d'un template

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion` ; Codex : choix numérotés dans le chat).

Si la correction touche le visuel, appliquer `../site-build/references/visual-quality.md`. Règle de fond : ne toucher qu'à ce qu'il faut.

## Étape 0 : contexte

Chercher dans le dossier courant `./sections.md` (landing, parcours A) ou `./arborescence.md` (site, parcours B). Aucun des deux (site existant non créé avec le pack) : proposer soit de reconstituer le plan avec `site-architecture` à partir des pages existantes, soit de modifier directement le fichier concerné en suivant les règles transverses ci-dessous. Les deux : demander lequel est concerné.

## Règles transverses

1. Afficher ce qui va changer AVANT d'appliquer, et la liste des fichiers touchés en cas de cascade.
2. Ne rien modifier hors périmètre.
3. Garder charte, IDs, classes, `loading`, `alt`, `<title>`, meta et Open Graph, sauf demande explicite.

## Parcours A : landing

1. Lister les sections de `sections.md` (numéro et nom), faire choisir, afficher son contenu textuel et visuel actuel.
2. Demander l'action : réécrire entièrement, modifier un élément (titre, sous-titre, CTA, visuel, layout), supprimer (décale l'ordre), ou ajouter avant ou après.
3. Appliquer : mettre à jour uniquement cette section dans `sections.md`, puis régénérer uniquement son bloc dans `index.html` (et les ancres du menu si ajout ou suppression).
4. Afficher le résumé : fichiers modifiés, changements clés.

## Parcours B : site multi-pages

1. Demander le périmètre : (1) section d'un template (toutes les pages du thème), (2) section d'une page précise (déviation), (3) page top-level, (4) structure (ajout, suppression, renommage de page ou dossier).
2. Récupérer l'existant : `<theme>/template.md` (1), le HTML de la page (2), `section-<page>.md` (3).
3. Demander l'action : modifier, ajouter (position), supprimer, réordonner.
4. Appliquer selon le cas :
   - **Template** : mettre à jour `template.md`, lister les pages du dossier, demander confirmation (oui, non, exclure certaines pages), puis répercuter en conservant le contenu propre à chaque page. `template.md` fait foi pour les pages sans déviation.
   - **Page spécifique** : ne pas toucher `template.md` ; modifier le seul HTML ; noter la déviation dans « Variantes autorisées » du `template.md`.
   - **Page top-level** : mettre à jour `section-<page>.md`, régénérer ce HTML seul, header et footer intacts.
   - **Structure** : mettre à jour `arborescence.md` et créer, renommer ou supprimer dossiers et fichiers. Nouvelle page top-level : créer son `section-<page>.md`. Nouveau thème : créer son `template.md` avec l'utilisateur. Renommage : renommer aussi `section-<page>.md` ou `template.md` ; suppression : retirer le fichier associé (et le thème du header/footer) ; dans tous les cas, mettre à jour menu, footer et liens internes de toutes les pages.
5. Afficher le résumé : fichiers modifiés, changements clés.

## Validation

- [ ] Fichiers modifiés = ceux annoncés, rien d'autre
- [ ] Cascade : toutes les pages concernées reflètent le template
- [ ] Structure changée : aucun lien interne cassé, menu et footer à jour partout
- [ ] Rendu local vérifié (desktop, mobile) avec `verif-navigateur`

Défaut trouvé : corriger puis revérifier. Si le site est déjà en ligne, proposer une preview (`npx vercel`), la faire valider, puis la production (`npx vercel --prod`) après un « oui » explicite.
