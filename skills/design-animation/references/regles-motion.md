# Règles de motion web (« la règle »)

Référence citée par `SKILL.md` et les fichiers de patterns. Elle prime sur les exemples des patterns en cas de conflit.

## Niveaux d'animation (plafond, pas quota)

| Niveau | Ce qu'on voit sur le site |
|---|---|
| 0 Sobre | Micro-interactions et états (survol, focus, chargement) ; aucune animation au scroll |
| 1 Vivant | Révélations CSS au scroll, entrée du hero, transitions de composants |
| 2 Expressif | Une séquence orchestrée par page (GSAP), texte découpé, parallaxe d'un calque, transition de page |
| 3 Cinématique | Pin et scrub, séquence pilotée par le scroll, shader ou 3D, curseur personnalisé ; desktop seulement, avec repli mobile |

Chaque effet a une raison liée au message de la page. Un niveau 3 se mérite par des performances mesurées sur mobile.

## Quel outil pour quoi

- CSS d'abord : survol, focus, toast, skeleton, bandeau défilant, révélation au scroll par `animation-timeline: view()` sous `@supports` (zéro JavaScript).
- GSAP + ScrollTrigger : timeline, décalages orchestrés, pin, scrub, SplitText.
- Motion (`motion/react`) : gestes, layout, sorties d'éléments dans une app React. Un projet encore sur `framer-motion` garde ses imports.
- Lenis (défilement adouci) : desktop seulement, importé dynamiquement, coupé sous 768 px et en mouvement réduit.
- 3D : React Three Fiber + drei (code) ou Spline (design), chargés côté client à la demande.
- Compteur : `requestAnimationFrame` sur une valeur finale déjà présente dans le HTML, sans bibliothèque.

## Durées et easings par défaut (si le projet n'a pas de tokens)

- Micro-interaction (survol, bouton) : 150–200 ms, `ease-out`.
- Apparition d'un élément : 400–700 ms, `cubic-bezier(0.22, 1, 0.36, 1)` (ou `power3.out` en GSAP), translation de 16 à 30 px.
- Décalage entre éléments d'une liste : 40–80 ms.
- Une seule courbe d'easing principale par site ; tout ce qui est lié au scroll en scrub utilise `ease: 'none'`.

## Faire

- `useGSAP(() => …, { scope: ref, dependencies })` de `@gsap/react`, dans un fichier `'use client'` ; `gsap.registerPlugin(useGSAP, ScrollTrigger)` une fois dans un module partagé ; tween lancé depuis un handler enveloppé dans `contextSafe`.
- Mouvement réduit : `gsap.matchMedia()` avec `(prefers-reduced-motion: reduce)` ou retour anticipé ; le contenu reste visible dans son état final.
- Animer seulement `transform` (ou `translate` / `rotate` / `scale`), `opacity`, `filter` ; `will-change` posé au début, retiré après.
- Effet lourd (canvas, 3D) derrière une garde : largeur ≥ 768 px, pointeur fin, pas de mouvement réduit, image statique de repli dans le HTML, montage après le premier affichage.
- Texte découpé : une copie `sr-only` du texte plus la version découpée en `aria-hidden`, pour que lecteurs d'écran et moteurs de recherche lisent le texte entier.
- Une seule séquence orchestrée par page.

## Ne jamais

- Défilement adouci (Lenis ou maison) sans pont vers ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) : les sections restent figées invisibles.
- Défilement adouci en JavaScript sur mobile : le défilement natif suffit et reste fluide.
- `opacity: 0` de départ sur un contenu dont l'animation peut ne pas jouer : ne masquer que sous `@supports (animation-timeline: view())` et `prefers-reduced-motion: no-preference`.
- Réécrire à la main `useEffect` + `gsap.context()` : utiliser `useGSAP`.
- Un `IntersectionObserver` JavaScript par section quand le CSS suffit.
- Animer `width`, `height`, `top`, `left`, `margin`, `padding` ; `transition: all` ; minuter avec `setTimeout` ; CSS et GSAP sur la même propriété.
- Couleur animée par GSAP en `oklch` : utiliser HEX, RGB ou HSL.
- Bibliothèque 3D sur une page publique sans mesurer le chargement mobile (LCP).

## Docs officielles

[GSAP + React](https://gsap.com/resources/React/), [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [Motion](https://motion.dev/docs/react), [MDN scroll-driven animations](https://developer.mozilla.org/docs/Web/CSS/CSS_scroll-driven_animations).
