---
name: design-pilote
description: "Pilote le design d'un site, du choix de la direction visuelle au code raffiné : questions guidées (ambiance, couleurs, typo, animations, références), 2-3 directions à choisir, design system, wireframe, maquette, code. Reprise possible."
---

# Pilote design

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Appeler un autre skill du pack : outil Skill dans Claude Code (`studio-web:<nom>`), `$<nom>` ou lecture de son SKILL.md dans Codex. Questions : Claude `AskUserQuestion` (2 à 4 options, la recommandée en premier) ; Codex : choix numérotés dans le chat. **Une seule question à la fois**, avec une phrase simple qui dit pourquoi on la pose.

Ce skill mène l'élève de « je ne sais pas à quoi ça doit ressembler » à une page codée qui lui plaît. Chaque étape produit un livrable que l'élève valide avant la suivante.

## Skills utilisés

`persona-parcours` (cible floue), `design-branding` (partir d'un logo), `design-wireframe` (étape 5), `design-mockup` (étape 7), `design-code` (étape 8), `design-components` (étape 9), `design-animation` (animations), `design-review` (porte qualité aux étapes 5, 7, 8, 9), `accessibilite` (contrôle final). Site existant à relever plutôt qu'à créer : proposer `design-repasse`.

## 0. Reprise et contexte

1. `.studio/design.json` existe : annoncer l'étape atteinte, proposer **reprendre**, **recommencer** ou **aller à une étape précise**.
2. Lire `.studio/state.json` et `.studio/cadrage.md` s'ils existent (écrits par `demarrer`). Tout ce qui y est déjà répondu (objectif, persona, type de site, références, `direction_design`, outils) est repris : l'annoncer en une ligne (« Tu m'as dit … , je garde ? ») et ne poser que ce qui manque.
3. Lire les fichiers du projet : site existant, logo (`logo.*`, `assets/`), charte (`DESIGN.md`, `brand*`, CSS avec couleurs). Ce qui existe déjà se propose comme point de départ.
4. Lister les outils disponibles dans la session (MCP Frame0, Pencil.dev, Figma, navigateur) et les noter dans `meta.outils`. Aucun outil n'est obligatoire : chaque étape a un repli sans outil.
5. Lire `../design-components/registry/registry.json` et les manifests listés. Registre vide : le dire une fois et sauter l'étape 9 ; ne jamais inventer de composant.

## 1. Brief express (seulement ce qui manque)

- Objectif de la page en une phrase, cible, action principale attendue du visiteur.
- Si la cible reste floue (« tout le monde », pas de problème précis), proposer `persona-parcours` avant de continuer : un persona clair change les choix de design.

## 2. Direction visuelle : questions guidées

Poser dans cet ordre, une par une, en sautant celles déjà répondues. Chaque option est décrite en mots simples et concrets (ce qu'on verrait à l'écran) ; toujours une option « je ne sais pas, propose-moi ».

1. **Éléments à garder** : « Tu as déjà un logo, des couleurs ou une charte à respecter ? » Oui, avec un logo → proposer `design-branding` pour en tirer couleurs, typo et ton ; oui, une charte → la lire et la respecter ; non → on part de zéro.
2. **Références** : « Donne-moi 1 à 3 sites que tu aimes, et dis-moi ce qui te plaît (couleurs, ambiance, mise en page, animations). » Puis : « Un site que tu n'aimes pas, et pourquoi ? » Les deux sont précieux ; « aucune » est une réponse valide.
3. **Ambiance** : proposer 3 à 4 univers nommés, adaptés au sujet, décrits en une ligne chacun. Exemples à adapter :
   - **Épuré** : beaucoup de blanc, peu de couleurs, typo nette, sensation calme et professionnelle.
   - **Chaleureux** : tons crème et terre, formes arrondies, photos humaines, sensation proche et rassurante.
   - **Audacieux** : couleurs franches, grands titres, contrastes forts, sensation énergique et moderne.
   - **Premium sombre** : fond foncé, accent lumineux, typo fine, sensation haut de gamme et technique.
4. **Couleurs** : garder les couleurs existantes / les tirer du logo (`design-branding`) / « propose-moi une palette » (3 propositions de 3 à 5 couleurs avec leur HEX et l'émotion de chacune).
5. **Typographie** : élégante (serif raffinée) / moderne (sans-serif géométrique) / chaleureuse (sans-serif arrondie, humaniste) / technique (grotesque + monospace). Montrer un exemple de titre pour chaque si un rendu HTML est possible.
6. **Densité** : aérée (beaucoup d'espace, peu d'éléments par écran) / équilibrée / dense (beaucoup d'infos visibles).
7. **Animations** : aucune (seulement survols et focus) / sobres (apparitions douces au scroll) / marquées (séquences, texte qui se révèle, effets au scroll). Rappeler simplement que plus d'animation = plus de travail et un site parfois plus lent sur mobile.
8. **Clair ou sombre** : clair / sombre / les deux.

Inspiration : à partir des réponses, consulter les sites de référence donnés par l'élève et des galeries publiques (scrolltide.co/templates, 21st.dev, godly.website, land-book.com, awwwards.com). Retenir 2 à 4 références et noter leurs décisions en valeurs (couleurs HEX, tailles de titres, espacements, durées et types d'animation). Ne jamais copier le code ou les visuels d'un site ; un composant repris d'une galerie respecte sa licence et garde son lien d'origine.

## 3. Proposer 2 à 3 directions et faire choisir

Avant toute maquette, présenter 2 ou 3 directions vraiment différentes (mise en page et mouvement, pas seulement la couleur), chacune en 5 lignes :

```
Direction A — <nom évocateur>
Ressenti : <ce que ressent le visiteur, et pourquoi c'est juste pour sa cible>
Couleurs : <fond HEX>, <texte HEX>, <accent HEX>
Typo : <titres> + <texte>
Mise en page et animation : <rythme des sections, élément marquant, niveau d'animation>
```

Terminer par la direction recommandée et sa raison en une phrase. L'élève choisit une direction, ou un mélange explicite (« A avec les couleurs de B »). Rien n'avance sans ce choix.

Enregistrer le choix dans `.studio/design.json` (`direction`) et compléter `direction_design` de `.studio/state.json` (`ambiance`, `couleurs`, `typo`, `a_eviter`) s'il existe.

## 4. Design system

À partir de la direction choisie : couleurs (primaire, secondaire, accent, fond, texte), typographie (titres, corps, échelle 14/16/20/24/32/48), espacement (base 8 px), rayon des angles, ombres, ambiance en mots-clés. Vérifier les contrastes (texte 4,5:1 minimum) par calcul, pas à l'œil. L'élève valide, ajuste ou recommence.

Une fois validé, générer `./design-system.html` depuis `${CLAUDE_SKILL_DIR}/templates/design-system.html` et `./DESIGN.md` depuis `${CLAUDE_SKILL_DIR}/templates/DESIGN.md` en remplaçant chaque `{{PLACEHOLDER}}`. Ouvrir `design-system.html` dans le navigateur pour que l'élève voie sa palette et ses typos. `DESIGN.md` est la charte du projet, complétée aux étapes suivantes.

## 5. Wireframe

Lancer `design-wireframe` avec le brief et le design system. Sortie : section map validée. Sans Frame0, le wireframe est fait en texte ou en HTML gris.

## 6. Réglages de la maquette

Une question à la fois :
- **Outil** : Pencil.dev ou Figma si disponibles, sinon maquette directement en HTML (aucun outil à installer). Noter `mockup.tool` (`pencil`, `figma` ou `html`).
- **Liberté créative** : 0 fidèle au wireframe, 1 améliorations section par section (recommandé), 2 libre.
- **Images** : aucune, peu (1 à 3), moyenne (jusqu'à 5), beaucoup. Source : photos de l'élève (dossier `./images/`), banques libres (Unsplash, Pexels), illustrations libres (unDraw, Storyset), ou images générées via `site-images`. Vérifier la licence de chaque image retenue.

## 7. Maquette

Lancer `design-mockup` avec outil, design system, section map, liberté créative et images. Valider, ajuster ou recommencer.

## 8. Code

Demander le format (HTML seul, React seul, les deux ; HTML recommandé pour un débutant) puis lancer `design-code`. Prévenir que les retouches se font désormais sur le code et que la maquette reste la référence visuelle. Animations souhaitées : `design-animation`, au niveau choisi à l'étape 2. Passer `design-review`.

## 9. Raffinage

Si le registre contient des collections : pour chaque section, comparer le code au composant le plus proche (correspondance, différences) ; l'élève choisit utiliser le composant, garder son code ou modifier. Puis `design-review` final et `accessibilite`. Terminer, continuer ou cibler une section.

Boucle à chaque étape : produire, montrer, corriger selon le retour, passer à la suite seulement après validation. Sauver `.studio/design.json` après chaque étape.

## État (`.studio/design.json`)

```json
{
  "brief": { "objectif": "", "cible": "", "action": "" },
  "reponses": { "a_garder": "", "references_aimees": [], "references_detestees": [], "ambiance": "",
                "couleurs": "", "typo": "", "densite": "", "animations": "", "theme": "" },
  "inspirations": { "urls": [], "analyse": { "couleurs": [], "typos": [], "patterns": [] } },
  "directions_proposees": [], "direction": null,
  "design_system": { "colors": {}, "typography": { "heading": "", "body": "", "scale": [14,16,20,24,32,48] },
                     "spacing_base": 8, "border_radius": "", "mood": [], "approved": false },
  "wireframe": { "section_map": {}, "approved": false },
  "mockup": { "tool": "html", "creativity_level": 1, "image_density": 2, "image_type": "", "image_source": "",
              "pen_file": null, "figma_file_url": null, "approved": false },
  "code": { "format": "html", "output_dir": "./", "approved": false },
  "refinement": { "component_map": {}, "iterations": 0, "completed": false },
  "meta": { "current_step": 0, "outils": { "frame0": false, "pencil": false, "figma": false, "navigateur": false },
            "started_at": "", "updated_at": "" }
}
```

## Raccourcis

- Pressé : étapes 1 à 4 puis 8.
- Sans wireframe : sauter l'étape 5. Sans maquette : sauter 6 et 7.
- Entrée directe : appeler seul `design-wireframe`, `design-mockup`, `design-code`, `design-components` ou `design-review`.

## Suite

Dans le parcours complet (`demarrer`), annoncer la fin du design et rendre la main : la construction du site se fait avec `site-pilote`, qui reprend `DESIGN.md` et `.studio/design.json`.
