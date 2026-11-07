# Site multi-pages : arborescence, section-<page>.md, template.md

Table des matières : Arborescence, Trois niveaux de documents, Gabarits, Header et footer, Pièges.

## Arborescence

Organisation par thèmes de contenu :
- Pages transverses (accueil, contact, équipe, mentions légales) : racine.
- Un thème = un dossier ; chaque page du thème = un fichier HTML frère dans ce dossier.
- Pas de sous-dossiers au-delà d'un niveau. Blog hors périmètre.

```
/mon-site
├── accueil.html, contact.html, equipe.html
├── arborescence.md
├── section-accueil.md, section-contact.md, section-equipe.md
├── /[theme-1]   (template.md, page-1.html, page-2.html)
├── /[theme-2]   (template.md, page-1.html)
├── /assets
└── /api         (fonction du formulaire, site-formulaire)
```

## Trois niveaux de documents (cascade maîtrisée)

1. `arborescence.md` (racine) : plan global, arbre, navigation. Stable sauf ajout, suppression ou renommage de page ou thème.
2. `section-<page>.md` (racine, un par page top-level) : sections de cette page. Le modifier régénère cette page seule.
3. `<theme>/template.md` : sections communes aux pages du dossier. Le modifier se répercute sur toutes les pages du dossier (voir `site-corrige`).

Par défaut toutes les pages d'un thème suivent le même template ; une page peut dévier, la déviation est notée dans « Variantes autorisées ».

Les sections utilisent le catalogue de `landing.md` à l'échelle de la page.

## Gabarits

`arborescence.md` :
```markdown
# Arborescence — [nom du site]

## Arbre du site
[arbre ci-dessus avec les vrais noms]

## Pages top-level
- `section-accueil.md` — sections de `accueil.html`

## Thèmes (dossiers)
- `/[theme-1]/template.md` — appliqué à toutes les pages de `/[theme-1]/`

## Header (commun, sticky)
- Logo à gauche (vers accueil.html)
- Menu : pages top-level + un dropdown par thème listant ses sous-pages
- CTA fixe à droite (« Contact », « Devis »…)
- Mobile : burger, thèmes en accordéon

## Footer (commun)
- Une colonne par thème, colonnes Entreprise, Légal (mentions, confidentialité, CGV, cookies), Social
- Copyright

## CTA principal du site
[verbe d'action + promesse concrète]
```

`section-<page>.md` :
```markdown
# Sections — [page]
## Ordre des sections
1. Hero [page]
2. …
## Détail par section
### Section 1 — Hero
- **Contenu textuel :** titre, sous-titre, CTA
- **Contenu visuel :** image [dimensions, prompt si à générer]
## SEO spécifique
- `<title>`, `<meta description>`, `<h1>`, URL canonique
```

`template.md` :
```markdown
# Template — [thème]
## Sections (dans l'ordre)
1. Hero [thème]
2. …
5. CTA « [Action] »
## Détail par section
[même format que section-<page>.md]
## Variantes autorisées
- [page-1.html] : ajoute une section « Témoignages » après « Tarif ».
## Règles techniques
- Header et footer communs ; title, description et h1 propres à chaque page ; mobile-first.
```

## Header et footer

Identiques sur toutes les pages. Toute page ajoutée, supprimée ou renommée : mettre à jour menu ET footer partout.

## Pièges

Plus de 10 pages ; pages creuses (3 items = pas de page) ; profondeur excessive ; templates qui dérivent (si chaque page du thème devient unique, redéfinir) ; menu différent d'une page à l'autre.
