# Qualité visuelle d'un site HTML généré

Table des matières : Typographie, Couleurs et états, Accessibilité, Patterns de sections, Micro-interactions, Checklist.

Hiérarchie, espacement, contraste et responsive de base : principes de `design-review` (ne pas les redéfinir ici). Principe : le design générique vient d'une absence de choix ; chaque taille, couleur, espace doit être décidé.

## Typographie

Échelle 1,25 sur base 16 px : 12, 14, 16, 20, 25, 31, 39, 49, 61 px (h1 : 39 mobile, 49 desktop).

- Interlignes : titres 1,1 à 1,2 ; sous-titres 1,3 ; corps 1,6 à 1,75 ; boutons 1.
- 4 graisses au plus : 300 (rare), 400 corps, 600 sous-titres et boutons, 800 titres forts.
- `letter-spacing` : titres > 40 px `-0.02em` ; corps 0 ; labels en capitales `0.05em` à `0.1em`.
- Pairings par ambiance : moderne Inter seul ; luxe Playfair Display + Inter ; chaleureux Cormorant Garamond + Inter ; jeune Outfit ou Sora seul.

## Couleurs et états

60 % neutre, 30 % secondaire, 10 % principale (accents, CTA) : la couleur principale reste rare. Définir pour les boutons : normal, hover (~8 % plus sombre), active (~15 %), disabled (opacité 50 %), focus (anneau visible).

## Accessibilité visuelle

- Cibles tactiles ≥ 44 × 44 px, 8 px minimum entre boutons.
- Ne jamais retirer `outline` sans remplacer :
  ```css
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  ```
- Mouvement réduit :
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```
- Site utilisable à 200 % de zoom. Audit WCAG complet : `accessibilite`.

## Patterns de sections

**Hero**, trois layouts : split (titre, sous-titre, CTA et indice de confiance à gauche, image ~60 % à droite) ; centré (titre, sous-titre, CTA, puis image large 16:9 ou 4:3) ; asymétrique éditorial (titre XXL sur ~60 % gauche, composition hors grille).

**Cards de bénéfices ou services** : 3 colonnes desktop, 1 mobile ; icône 48 px, titre 20-24 px, description 16 px ; fond légèrement différent de la page ; `border-radius` 12 à 20 px ; hover `translateY(-4px)` avec `transition: transform 0.2s`.

**Témoignages** : un grand format ou trois en grille ; jamais de carrousel automatique ; photo ronde 80-120 px, nom, rôle, citation de 60 à 120 mots.

**Formulaires** : labels au-dessus des champs ; erreurs en rouge sous le champ, jamais en popup ; bouton aligné à gauche ou pleine largeur en mobile ; états hover, focus, erreur distincts.

## Micro-interactions

Autorisées, avec modération : hover cards et boutons (translation 2-4 px, ombre subtile), fade-in au scroll (150-300 ms), transition de couleur (150 ms), défilement fluide entre ancres.

Interdites : animations continues (pulse, bounce, shake), carrousels auto-play, popups non sollicitées, parallax fort, son ou vidéo en lecture automatique.

## Checklist avant « fini »

- [ ] 4 graisses au plus, échelle typo respectée
- [ ] Règle 60/30/10, états de boutons définis
- [ ] Cibles ≥ 44 px mobile, focus visibles
- [ ] Paragraphes de moins de 4 lignes
- [ ] Images chargées, `alt` descriptifs
- [ ] Même style et même palette entre sections
- [ ] Zoom 200 % lisible
- [ ] Rendu testé à 375, 768 et 1440 px
