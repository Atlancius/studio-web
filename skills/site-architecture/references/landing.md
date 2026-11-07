# Landing page : sections et sections.md

Table des matières : Principe, Catalogue, Header et footer, Ancres, Gabarit sections.md, Fichiers, Règles.

## Principe

Une landing est un seul fichier HTML qui empile des sections. Une section est un bloc autonome avec un contenu textuel (titre, sous-titre, corps, CTA) et un contenu visuel (image, icônes, layout), pensée et modifiée indépendamment des autres. Pas de « rôle pédagogique » : la section se définit par ce qu'elle contient.

## Catalogue (5 à 8 sections)

| Section | Textuel | Visuel |
|---|---|---|
| Hero (obligatoire) | titre fort, sous-titre, CTA primaire | image ou illustration pleine largeur |
| Problème | 3-4 phrases : le problème et ses conséquences | icônes ou illustration sobre |
| Solution | 3-4 phrases : la transformation promise | photo ou illustration qui humanise |
| Bénéfices | 3 à 5, titre court + description courte | icônes en grille |
| Preuve sociale | 3 à 5 témoignages (nom, rôle, citation), logos, chiffres | photos, logos, graphiques simples |
| Tarifs (si pertinent) | 1 à 3 cartes (nom, prix, inclus, CTA) | cartes en grille, option recommandée en avant |
| FAQ | 5 à 8 questions/réponses | texte sobre, accordéon possible |
| CTA final | appel direct + bouton | bandeau contrasté |

Secondaires : comparatif (vs concurrents ou vs ne rien faire), équipe, étapes, ressources/presse.

## Header et footer

- Header sticky : logo à gauche (lien `#hero`), menu d'ancres vers les sections, CTA mini optionnel vers `#cta`.
- Footer : mentions légales (obligatoire), politique de confidentialité, réseaux sociaux, copyright. Pas de navigation inter-pages.

## Ancres

- Chaque section : `id` HTML unique (`<section id="probleme">`), liens `href="#probleme"`.
- CSS : `scroll-behavior: smooth;` et `scroll-margin-top` égal à la hauteur du header sticky, sinon la section se cache derrière.

## Gabarit sections.md

```markdown
# Sections — [nom du projet]

## Ordre des sections
1. Hero (id #hero)
2. Problème (id #probleme)
…

## Header (sticky)
- Logo à gauche (lien vers #hero)
- Menu : ancres vers chaque section
- CTA mini à droite (optionnel, vers #cta)

## Section 1 — Hero (id: #hero)
- **Contenu textuel :**
  - Titre principal : « … »
  - Sous-titre : « … »
  - CTA : « [verbe d'action + promesse] »
- **Contenu visuel :**
  - Image hero : [dimensions, prompt si à générer]
  - Layout : [titre à gauche / image à droite, centré…]

## Section 2 — … (id: #…)
…

## Footer
- Mentions légales, confidentialité, réseaux, copyright
```

## Fichiers

```
/ma-landing
├── index.html
├── sections.md
├── /assets
└── /api        (fonction du formulaire, branchée par site-formulaire)
```

## Règles

- Une section = une idée.
- Ordre : hero, problème, solution, preuves, action.
- Zéro lien vers d'autres pages ; deux CTA identiques au plus (hero et fin).
- Mobile-first.
