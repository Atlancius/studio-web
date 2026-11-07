---
name: design-animation
description: "Transforme une demande d'animation en langage simple (apparition au scroll, parallaxe, transition de page, texte qui se révèle, SVG, survol, 3D) en code web accessible avec l'outil le plus léger : CSS, GSAP, Motion, R3F, Lottie ou Rive."
---

# Animations web

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md) ; les chemins `references/…` sont relatifs à lui. Appeler un skill du pack : outil Skill (`studio-web:<nom>`) ou `$<nom>` / lecture de son SKILL.md. Les fichiers de patterns sont en anglais ; les explications à l'élève restent en français simple.

Transforme une demande comme « fais apparaître les sections quand je descends » en code complet, accessible et performant, avec l'outil le plus léger qui convient.

Priorité : [references/regles-motion.md](references/regles-motion.md) (« la règle » : niveaux, outils, durées, interdits) passe avant les exemples des patterns. Lire la règle d'abord. Le niveau d'animation choisi par l'élève (`.studio/design.json` → `reponses.animations`, ou `direction_design` de `.studio/state.json`) fixe le plafond : aucune → niveau 0, sobres → 1, marquées → 2 (3 seulement sur demande explicite et site performant).

Inspiration : pour une animation signature (hero, scroll, texte), regarder un exemple de même mécanique sur une galerie publique (scrolltide.co/templates, 21st.dev, godly.website, awwwards.com) et en reprendre les décisions en valeurs (easing, durées, déclencheurs), jamais le code ni les visuels.

## Méthode

Copier cette checklist et la cocher :

```
- [ ] 1. Classer la demande (catégorie, complexité, cible)
- [ ] 2. Choisir un seul outil avec l'arbre de décision
- [ ] 3. Lire la référence de patterns correspondante ; vérifier les API sensibles aux versions dans la doc officielle
- [ ] 4. Construire dans les règles non négociables
- [ ] 5. Boucle de validation au vert
- [ ] 6. Livrer
```

### 1. Classer

| Catégorie | Mots typiques |
|---|---|
| Scroll | au scroll, en descendant, parallaxe, révélation, barre de progression, pin |
| Déclencheur | au chargement, au clic, quand c'est visible, en cascade |
| Interaction | survol, glisser, suivre le curseur, effet aimant, geste |
| Transition de page | changement de page, élément partagé |
| Texte | texte découpé, machine à écrire, lettre par lettre, mot par mot |
| SVG | tracé qui se dessine, morphing |
| Layout | réordonner, déplier, soulignement d'onglet, grille vers liste |
| 3D | Three.js, WebGL, Spline, visionneuse produit |
| Micro | retour visuel, toast, chargement, skeleton |

Complexité : une propriété et un déclencheur = simple ; plusieurs propriétés, contrôle du timing ou cascade = moyen ; timelines, scrub, physique ou 3D = complexe.

Cible : lire `package.json` (`next`, `react` ; ni l'un ni l'autre = HTML simple) et réutiliser ce que le projet embarque déjà (GSAP, Motion, un hook maison) avant d'ajouter une bibliothèque. Un site HTML simple du pack (`site-build`) reste en CSS, avec GSAP par CDN seulement si nécessaire. Poser une seule question, et seulement si la catégorie ou la cible ne se déduit pas.

### 2. Choisir l'outil

Un choix par défaut par branche :

```
Le CSS sait faire (survol, focus, changement d'état, entrée avec @starting-style) → CSS
Scroll
  révélation, barre de progression, parallaxe légère → CSS scroll-driven (animation-timeline) sous @supports
  pin, scrub, snap, horizontal, timeline            → GSAP + ScrollTrigger
  valeur liée au scroll dans un écran React        → Motion useScroll
Transition de page
  Next.js App Router                               → React <ViewTransition>
  site multi-pages HTML                            → CSS @view-transition { navigation: auto; }
  SPA React sans view transitions                  → Motion AnimatePresence
Texte découpé                                      → GSAP SplitText
SVG                                                → tracé : CSS stroke-dashoffset ; morphing : GSAP MorphSVG
Changement de layout, élément partagé              → Motion layout / layoutId (React) ; GSAP Flip (HTML)
Geste, glisser, ressort                            → Motion (React) ; GSAP Draggable + Observer (HTML)
3D                                                 → React Three Fiber + drei (code) ou Spline (design)
Animation faite par un designer                    → Lottie .lottie (After Effects) ; Rive (machine à états)
Défilement adouci                                  → Lenis, desktop seulement (voir la règle)
Compteur de chiffres                               → requestAnimationFrame sur la valeur finale (voir la règle)
```

Poids (gzip) : CSS 0 ; composant `motion` de Motion environ 34 Ko, `m` + `LazyMotion` environ 4,6 Ko au premier rendu ; GSAP core environ 27 Ko plus chaque plugin ; Lenis environ 5,5 Ko ; dotLottie React environ 34 Ko plus son moteur WASM ; une scène three.js est la plus lourde.

### 3. Patterns

- CSS : animations liées au scroll, view transitions, `@starting-style`, motion path, effets (verre, grain, aurora, bordure en dégradé, halo), mouvement réduit : [css-patterns.md](references/css-patterns.md)
- GSAP : installation, `useGSAP`, timelines, ScrollTrigger, SplitText, Flip, SVG, effet aimant, pont Lenis : [gsap-patterns.md](references/gsap-patterns.md)
- React : Motion, view transitions dans Next.js, React Three Fiber, Spline, Lottie, Rive : [react-patterns.md](references/react-patterns.md)

Pour un détail d'API ou une version non couverte, consulter la doc officielle (liens en bas de la règle) plutôt que des extraits de mémoire.

### 4. Règles non négociables

- Propriétés gérées par le compositeur uniquement : `transform` ou `translate` / `rotate` / `scale`, `opacity`, `filter`. La liste complète des interdits est dans la règle.
- Mouvement réduit ([WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)) : sous `prefers-reduced-motion: reduce`, chaque élément arrive visible dans son état final (media query CSS, `gsap.matchMedia()`, `<MotionConfig reducedMotion="user">` de Motion). Jamais d'information portée par le mouvement seul.
- Un mouvement qui démarre seul, dure plus de 5 secondes et tourne à côté d'autre contenu a un bouton pause ou stop ([WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)).
- Un contenu ne démarre jamais masqué si son animation n'est pas garantie (garde `@supports` + `no-preference` de la règle).
- Nettoyage au démontage : `useGSAP` avec un `scope` ; Motion nettoie seul ; ne jamais tuer tous les ScrollTrigger globalement.
- Bibliothèques lourdes (3D, Lottie, Rive, Spline) chargées à la demande (`next/dynamic` dans un Client Component, ou import dynamique), derrière la garde de la règle.
- Une seule séquence orchestrée par page ; durées et easings tirés des tokens du projet, sinon des valeurs par défaut de la règle.

### 5. Boucle de validation

Répéter jusqu'à ce que tout passe :

1. Projet avec build : `tsc --noEmit` puis les scripts lint et build du projet, zéro erreur. Site HTML simple : aucune erreur dans la console.
2. Ouvrir la page en desktop et à 375 px (navigateur intégré de la session, `verif-navigateur`, sinon demander à l'élève de regarder) : l'animation joue comme prévu, pas de saut de mise en page, rien ne reste invisible, aucune erreur console.
3. Forcer le mouvement réduit (panneau Rendering de Chrome DevTools, ou Playwright `page.emulateMedia({ reducedMotion: 'reduce' })`) : chaque élément est visible dans son état final.
4. CSS lié au scroll : un navigateur sans `animation-timeline` (Firefox stable) affiche quand même tout le contenu.
5. Corriger ce qui a échoué et revenir en 1.

### 6. Livrer

Une ligne `Catégorie | Complexité | Outil`, puis le code complet prêt à coller (pas de pseudo-code, pas de trou), puis les fichiers touchés et les contrôles passés. Expliquer à l'élève en une phrase ce que fait l'animation et comment la désactiver.

## Exemple

Demande : « Fais apparaître les sections quand je descends » → `Scroll | Simple | CSS scroll-driven`

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .section {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}

@keyframes reveal {
  from { opacity: 0; translate: 0 30px; }
  to { opacity: 1; translate: 0 0; }
}
```

Les navigateurs sans animations liées au scroll et les visiteurs en mouvement réduit voient la section statique et visible ; aucun JavaScript n'est chargé.
