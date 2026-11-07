---
name: design-code
description: "Transforme une maquette validée ou une design spec en page HTML ou React prête pour la production, en réutilisant les composants du registre quand ils existent. Dernière étape du design, avant le site complet."
---

# De la maquette au code

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : Claude `AskUserQuestion`, Codex dans le chat. Appeler un skill du pack : outil Skill (`studio-web:<nom>`) ou `$<nom>` / lecture de son SKILL.md.

Périmètre : maquette (spec JSON, capture, `maquette.html` ou description) → page autonome. Le site complet (plusieurs pages, formulaire, déploiement) se construit ensuite avec `site-pilote`, qui reprend ce code et `DESIGN.md`.

## 1. Charger le registre de composants (avant tout code)

1. Lire `../design-components/registry/registry.json` (skill frère `design-components`), puis le `manifest.json` de chaque collection listée.
2. Le registre est livré vide. S'il ne liste aucune collection, le dire en une phrase et coder chaque section à partir de zéro (sauter l'étape 3). Ne jamais inventer un composant ni un chemin.

## 2. Identifier les sections

Prendre le tableau `sections` de la spec (`.studio/design.json` → `mockup` ou `wireframe.section_map`), sinon demander une description ou une capture. Types : `hero`, `features`, `pricing`, `cta`, `footer`, `header`, `testimonials`, `faq`, `stats`, `process`, `team`, `gallery`, `contact`, `background`. Montrer la liste numérotée et attendre la confirmation.

Puis, une question à la fois :
- **Format** : HTML seul (recommandé pour débuter, aucun outil à installer) / React seul / les deux.
- **Largeur** : pleine largeur, ou contenu centré dans un cadre (le fond des sections reste pleine largeur).

## 3. Associer des composants

- `refinement.component_map` présent dans `.studio/design.json` : l'utiliser tel quel (`use_registry`, `keep_custom` = coder de zéro, `skip` = exclu), le confirmer dans un tableau récapitulatif.
- Sinon : pour chaque section, chercher dans les manifests, montrer les 3 meilleurs candidats avec une note d'adéquation (excellente / partielle / faible) plus « aucun = coder de zéro », et laisser l'élève choisir.

## 4. Adapter et assembler

Pour chaque composant choisi, lire sa source (chemin du manifest) puis :

- remplacer les couleurs par celles de la spec (garder opacités et structure des dégradés), caler polices, tailles et interlignes sur l'échelle typographique, remplacer le contenu factice par le vrai texte ;
- appliquer l'échelle d'espacement (base 4 px : 4, 8, 12, 16, 24, 32, 48, 64, 96) ;
- garder les animations existantes sauf si la spec les change ; la gestion du mouvement réduit reste. Nouvelles animations : `design-animation`.

Les sections codées de zéro suivent la spec seule. Textes manquants ou à améliorer : `copywriting`.

Images : densité selon `mockup.image_density` (0 aucune, 1 hero seul, 2 hero + bénéfices + 1-2 sections, 3 partout sauf pied de page ; demander si absent), source selon `mockup.image_source`. Préférer les fichiers du projet (`./images/`, `./assets/`) ou ceux validés par l'élève, enregistrés dans le projet plutôt que liés à distance. Chaque `<img>` a un vrai `alt`, `loading="lazy"` (sauf le hero), des dimensions responsives. Jamais d'URL inventée ni de service d'images factices : sans image adaptée, un dégradé ou un aplat.

Sortie :

- HTML : un `index.html` autonome (`lang` = langue du contenu), Tailwind CDN ou CSS dans `<style>`, polices de la spec.
- React : `page.tsx` qui assemble `sections/<Nom>.tsx`, un fichier par section.
- Les deux : sous-dossiers `html/` et `react/`. Demander le dossier cible (par défaut : le dossier courant).

## 5. Vérifier (boucle)

1. Ouvrir la page dans le navigateur (`verif-navigateur`, ou le navigateur intégré de la session) en mobile (375 px) et desktop.
2. Comparer avec la maquette : couleurs, espacements, typo, mise en page. Corriger chaque écart.
3. Passer `design-review` puis `accessibilite` sur le résultat ; corriger les FAIL et CRITICAL, recontrôler jusqu'à ce qu'il n'en reste aucun (les WARN sont signalés).
4. Donner la liste des fichiers créés avec leurs chemins, et mettre `code.approved` dans `.studio/design.json` après validation de l'élève.

## Place dans le parcours

`design-mockup` fournit la spec, `design-components` le registre, `design-pilote` orchestre. Lancé seul, le skill demande ce qui manque.
