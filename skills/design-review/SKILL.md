---
name: design-review
description: Contrôle rapide d'une UI (capture, maquette, URL ou code) sur 6 principes, tableau OK/WARN/FAIL et 3 corrections prioritaires. Porte qualité du design (wireframe, maquette, code) ou pour « améliore ce design ».
---

# Revue de design en 6 principes

Rôle : porte qualité courte des étapes wireframe, maquette et code (`design-wireframe`, `design-mockup`, `design-code`). Pour un audit WCAG complet : `accessibilite` ; pour relever le graphisme d'un site existant avec une note détaillée : `design-repasse`.

## Procédure

1. Prendre l'entrée (capture, image, URL ou code). Si l'entrée est du code ou une URL, regarder le rendu réel quand c'est possible.
2. Évaluer les 6 principes ci-dessous.
3. Sortir le tableau, puis les 3 corrections prioritaires.

## Les 6 principes

1. **Hiérarchie visuelle**
   - Un seul élément dominant par écran.
   - Rapport de taille ≥ 1,25 entre niveaux de titres consécutifs.
   - Le CTA principal a le plus fort poids visuel ; les actions secondaires sont plus discrètes ; le décor ne le concurrence pas.
   - Test : l'action n°1 se repère en 2 secondes.
2. **Espacement et rythme**
   - Échelle de base 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96).
   - Écart égal entre frères ; proximité : l'écart entre groupes dépasse l'écart dans un groupe.
   - Padding d'un conteneur ≥ écart entre ses enfants.
   - Test : sans le texte, les groupes se lisent encore.
3. **Couleur**
   - Au plus 3 familles de teinte (neutres exclus) et 2-3 nuances de neutre.
   - Contraste WCAG 2.2 AA : 4,5:1 pour le texte normal, 3:1 pour le grand texte (≥ 24 px, ou ≥ 18,66 px en gras).
   - Une couleur = un sens. Calques de fond par nuances subtiles.
   - Test : en niveaux de gris, la hiérarchie tient.
4. **Typographie**
   - Au plus 2 familles ; échelle modulaire (14, 16, 20, 24, 32, 40, 48 px).
   - Corps ≥ 16 px, interligne 1,4-1,6 ; titres 1,1-1,3 ; 65-75 caractères par ligne.
   - Graisses : 600-700 titres, 400 corps, 500 labels.
   - Test : pas plus de 4 tailles distinctes.
5. **Mise en page et alignement**
   - Grille 8 px ou 12 colonnes ; alignement à gauche par défaut.
   - Pas d'élément orphelin ; une seule largeur max de contenu ; gouttières égales.
   - Test : les bords tombent sur peu de lignes verticales.
6. **Responsive**
   - Mobile d'abord (375 px) ; breakpoints 640 / 768 / 1024 / 1280.
   - Les layouts horizontaux s'empilent ; navigation repliée en mobile ; médias fluides, aucun scroll horizontal.
   - Cibles tactiles ≥ 44×44 px (recommandation Apple HIG ; le minimum AA de WCAG 2.2 est 24×24 px).
   - Corps jamais sous 14 px.

## Format de sortie

| Principe | Score | Problème | Correction |
|---|---|---|---|
| Hiérarchie visuelle | OK / WARN / FAIL | … ou « Aucun » | correction concrète |
| … (une ligne par principe) | | | |

- **OK** : respecté. **WARN** : violation mineure à améliorer. **FAIL** : nuit à l'usage, l'accessibilité ou la cohérence ; à corriger.

Puis **3 corrections prioritaires**, dans l'ordre : `[Principe]` — quoi changer et pourquoi. Priorité : FAIL avant WARN, accessibilité avant esthétique, corrections qui en entraînent d'autres.

Appelé par un autre skill, rendre tableau et corrections pour qu'il décide (corriger, demander, bloquer). Lancé seul par l'élève, expliquer chaque FAIL en une phrase simple et proposer d'appliquer les 3 corrections.
