# Diagnostic noté et grille de revue

Ouvrir aux étapes 1 (upgrade), 6 et 7. Barème Awwwards (Design 40 %, Usability 30 %, Creativity 20 %, Content 10 % ; mention honorable dès 6,5/10) : [awwwards.com/about-evaluation](https://www.awwwards.com/about-evaluation/).

## Volets (un sous-agent par volet si disponible), lecture seule

| Volet | Outil | Sortie |
|---|---|---|
| Santé du site (si URL) | `seo-visibilite` | score et problèmes par sévérité |
| Design system | tokens (`@theme`), composants et charte lus | cohérent / partiel / absent, écarts à la charte |
| Motion existant | grep `gsap`, `motion`, `framer-motion`, `@keyframes`, `animation-timeline`, `transition`, `three`, `lenis`, `animate(` | niveau 0-3 atteint, techniques, nombre de courbes d'easing |
| Accessibilité | `accessibilite`, puis `design-review` | violations WCAG 2.2 AA et principes visuels par sévérité |
| Rendu réel | navigateur intégré de la session, sinon `verif-navigateur` | captures 320, 768, 1024, 1440 px ; erreurs console |
| Performance | PageSpeed Insights (URL publique), sinon Lighthouse mobile | LCP, INP (terrain ; TBT en labo), CLS |

## Grille

| Dimension | Note /10 | Cible | Preuve |
|---|---|---|---|
| Design (direction, typo, couleur, mise en page) | | 8 | |
| Usability (navigation, mobile, accessibilité) | | 8 | |
| Creativity (interactions, récit, moment mémorable) | | 8 | |
| Content (textes, cohérence de marque) | | 8 | |
| Motion et micro-interactions | | 7 | |
| Responsive | | 9 | |
| Performance | | 9 | |
| SEO | | 8 | |

Note Awwwards estimée = 0,4 × Design + 0,3 × Usability + 0,2 × Creativity + 0,1 × Content ; les quatre dernières lignes sont des planchers techniques. Chaque note cite sa preuve (sortie d'audit, capture, mesure). Puis les écarts majeurs avec leur impact et les pages à transformer : page, priorité, complexité, technique principale.

Repères d'étalonnage :

| Note | Ce qu'on voit |
|---|---|
| 4 | Thème par défaut du framework, contenu provisoire, rien de propre au sujet |
| 6 | Propre et cohérent, mais interchangeable avec un autre site du secteur |
| 8 | Direction identifiable, un moment mémorable, finitions tenues sur toutes les largeurs |
| 10 | Niveau Site of the Day : idée forte et exécution sans défaut mesurable |

Motion : noter le niveau atteint sur l'échelle 0-3 de `design-animation` (sobre, vivant, expressif, cinématique ; voir sa référence `regles-motion.md`), quelle que soit la technique (CSS, WAAPI, GSAP, Motion, Lenis, three.js), puis sa qualité.

Sans URL déployée : démarrer le serveur de développement du projet (commande `dev` du `package.json`, ou `python3 -m http.server 3000` pour un site HTML simple) et mesurer en local, en le précisant ; impossible de démarrer → « non mesuré ».

## Signes d'un graphisme générique, à corriger en priorité

- Palette et typographie par défaut du framework ; dégradé violet, texte en dégradé, panneaux en verre sans raison.
- Hero « titre centré + deux boutons + capture » sans élément propre au sujet.
- Tout apparaît en fondu au scroll ; même durée et même easing partout.
- Cartes identiques en grille pour chaque section ; aucune variation de rythme.
- Icônes décoratives à la place de vrais visuels ; fausses captures ; chiffres inventés.
