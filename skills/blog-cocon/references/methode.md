# Méthode du cocon sémantique

Table des matières : [Principe](#principe) · [Anatomie](#anatomie) · [Maillage](#maillage) · [Choisir mère, filles, petites-filles](#choisir) · [Pièges](#pièges)

## Principe

Un cocon est un arbre de pages convergeant vers une page racine, avec un maillage interne strict. Au lieu de 50 articles isolés, 50 articles organisés qui se renforcent par des liens internes : Google reconnaît le site comme expert d'un sujet entier (autorité thématique). Règle d'or : le cocon est un silo étanche, sans raccourcis, sans page orpheline. Méthode attribuée à Laurent Bourrelly.

## Anatomie

- **Mère (1)** : page racine, requête commerciale la plus large visée. Exemple : `/apprendre-claude` pour `apprendre claude`.
- **Filles (3 à 7)** : piliers, sous-thèmes orthogonaux de la mère ; chacune est une page (long article ou page-pilier), pas une simple catégorie.
- **Petites-filles (3 à 5 par fille)** : articles longue traîne répondant à une question précise, intention claire.

## Maillage

À faire **dans le contenu** des articles, pas seulement dans le menu :

1. Une fille remonte vers sa mère (au moins un lien dans le corps).
2. Les filles pointent vers 2-3 sœurs (latéral).
3. Une petite-fille remonte vers sa mère ET sa fille parente.

Étanchéité : pas de lien direct d'une petite-fille vers une autre branche ; pour bouger latéralement, remonter vers la fille parente, qui pointe vers sa sœur.

## Choisir

- **Mère** : depuis `brief.md`, la phrase la plus large que l'audience taperait avec le problème que résout l'offre. Critères entre 3 candidates : volume suffisant, intention commerciale, concurrence accessible (SERP verrouillée par de gros médias : descendre d'un cran). L'IA propose au moins 3 candidates, l'élève tranche.
- **Filles** : test d'orthogonalité (un article entier sans empiéter), fusion si recouvrement > 30 %. Fixer par fille `pilier_slug`, `keyword`, `description`, `persona`, `cta_principal`.
- **Petites-filles** : forme de vraie question (« comment faire X », « X vs Y », « guide complet de X »), mot-clé spécifique et peu disputé, intention identifiable.

## Pièges

- Filles qui se recouvrent (> 30 %) : fusionner ou redécouper.
- Plus de 7 filles : mieux vaut 4 piliers solides que 10 vides ; on en ajoute plus tard.
- Petite-fille qui reprend le keyword de sa fille : cannibalisation SEO.
- Maillage uniquement dans le menu : un menu n'est pas un maillage.
- Fille sans `cta_principal` : le cocon devient un blog sans débouché ; chaque branche pousse vers une offre.
