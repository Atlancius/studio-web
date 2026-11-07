# Trois directions à faire choisir

Ouvrir à l'étape 3. Trois directions diffèrent par la mise en page, le mouvement et la matière ; trois palettes sur la même maquette ne sont pas trois directions.

## Format d'une direction

```markdown
### Direction A — <nom évocateur>

<Une phrase : ce que ressent le visiteur et pourquoi c'est juste pour ce produit.>

- Références : <URL d'origine (galerie ou site)> — on prend <mécanique, valeurs> ; on laisse <...>
- Palette : <fond HEX>, <texte HEX>, <accent HEX> (accent sur 4 éléments par écran au plus)
- Typographie : <display> + <texte> (+ <mono> si utile), échelle en clamp()
- Mise en page : <grille, mesure, rythme des sections, ce qui casse la grille>
- Moment mémorable : <l'élément propre au sujet et comment il bouge>
- Motion : niveau <0-3>, une courbe d'easing, durées types, déclencheurs ; repli en mouvement réduit
- Coût : <poids JS, 3D ou vidéo, risque LCP mobile> ; <ce qui est désactivé sous 768 px>
- Pages concernées : <toutes, ou lesquelles et dans quel ordre>
- Risque : <ce qui peut mal tourner et comment le vérifier>
- Écarté : <ce que cette direction refuse volontairement, et pourquoi>
```

Une référence trouvée sur une page de catalogue se cite avec l'URL exacte de la fiche, pas celle du catalogue.

## Recommandation

Terminer par la direction recommandée et sa raison en deux lignes, rattachée à la fiche essence (public, promesse, ton). Une direction qui contredit la charte existante est écartée avant d'être présentée.

## Valeurs à reprendre d'une référence

Une référence se reprend par ses décisions en valeurs, pas par son apparence : HEX, familles et échelle de polices, interlignage et mesure (≈ 62 caractères), courbe d'easing unique, décalages et durées (exemple : entrée en translation de 16 px sur 750 ms, décalage 60 ms), déclencheurs liés au scroll plutôt qu'à un minuteur, interdits explicites, grain ou texture et leur intensité.
