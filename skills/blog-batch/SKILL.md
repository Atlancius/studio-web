---
name: blog-batch
description: "Écrit jusqu'à 5 articles du cocon à la suite, avec relecture entre chaque, envoyés dans Ghost en brouillon. Déclencheurs : plusieurs articles, lot d'articles, série d'articles."
---

Chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : dossier de ce SKILL.md). Équivalences : skill cité = outil Skill (Claude) ou lecture de son SKILL.md / `$nom` (Codex) ; question à la personne = message dans le chat ; MCP Ghost = les outils du service Ghost, quel que soit leur nom ; images : outil choisi au cadrage, mêmes règles que `blog-article`. Coût d'un lot (images d'un service payant) annoncé avant de lancer, accord de l'élève requis.

# Lot d'articles du cocon

Variante en boucle de `blog-article` : lire ce skill d'abord et appliquer son pipeline (contexte, linking_context, whitelist, P1, P2, sanitizer, validation des liens, image, post Ghost draft, mise à jour de `cocon.json`) pour chaque article. Rien de P1/P2, du sanitizer ni de la validation de liens n'est redéfini ici ; liés aussi : `blog-knowledge-base`, `blog-link-validation`.

## Garde-fous (jamais contournés)

- Statut Ghost toujours `draft`.
- Relecture humaine à chaque article : brief validé, puis article validé, avant le push. Aucune validation automatique, aucun délai qui vaut accord.
- N entre 1 et 5, défaut 3. Au-delà : refuser et proposer deux lots espacés d'au moins 24 h (budget de relecture, signal SEO d'un dump de contenu).
- Arrêt du lot après 2 erreurs de pipeline consécutives (un `skip` volontaire ou une image en échec ne comptent pas). Une erreur isolée passe à l'article suivant.
- Génération dans la session, sans clé API ni nom de modèle codé en dur ; la boucle est bornée par N et ne se relance jamais seule.
- `knowledge.json` obligatoire : absent, le lot ne démarre pas (renvoyer vers `blog-article` qui en propose le squelette).

## Pré-requis

Ceux de `blog-article` (cocon, Ghost + MCP, thème, outil d'image optionnel) plus `knowledge.json`. Aucun article encore généré seul sur ce projet : proposer d'abord un essai avec `blog-article`.

## Procédure

1. **N** : lire l'argument ; sinon demander (défaut 3). Hors 1 à 5 : refuser.
2. **Sélection** : petites-filles `planned` uniquement, pilier le plus avancé d'abord (nombre de `published` + `draft` décroissant, égalité par `pilier_slug`, puis ordre du fichier), N premières. Moins de N disponibles : proposer le lot réduit ou annuler. Afficher la liste (pilier, slug, titre, keyword, persona, CTA) et demander `confirmer` / `modifier` (échanger contre un autre `planned`) / `annuler`.
3. **Compteurs** : `succeeded`, `skipped`, `errors` (slug, phase, message), `consecutiveErrors = 0`.
4. **Pour chaque article i de 1 à N** :
   1. Annoncer « Article i/N : titre, slug, pilier ».
   2. Brief P1 puis validation : `accepter` / `modifier` / `regenerer` / `skip`.
   3. Article P2 puis résumé compact (meta, longueur des champs, plan H2, premier paragraphe, nombre de liens, tables, blocs de code) et validation : `accepter` / `voir` (HTML complet) / `modifier` (si `html` change, rejouer sanitizer et liens) / `regenerer` / `skip`.
   4. Après `accepter` : sanitizer, validation des liens, image, post Ghost draft, mise à jour de `cocon.json`, sans autre question.
   5. Succès : `consecutiveErrors = 0`. `skip` : noter `skipped` (l'article reste `planned`), `consecutiveErrors = 0`. Erreur de phase : noter dans `errors`, `consecutiveErrors += 1`.
   6. `consecutiveErrors` à 2 : arrêter, annoncer les deux dernières erreurs, ce qui est déjà en draft et ce qui reste à relancer.
   Entre deux articles, laisser la personne reprendre la main (pas d'enchaînement automatique tant que la relecture n'est pas faite).
5. **Rapport** : succès (slug, lien admin Ghost, liens validés et réécrits, image), skippés, erreurs, total des liens réécrits (plus de 5 au total : compléter la whitelist). Écrire `batch-<date ISO>-report.md` à la racine du projet avec les mêmes sections.

## Vérification finale

- [ ] chaque succès est `draft` dans Ghost et `draft` + `ghost_id` + `drafted_at` dans `cocon.json`
- [ ] sanitizer et validation des liens appliqués à chaque article poussé
- [ ] rapport écrit ; en cas d'arrêt, cause et reste à faire indiqués

Clôture : demander de relire chaque draft dans l'admin Ghost (intro, chiffres contre la KB, liens cliqués, image, H2 final vers le CTA) avant de publier à la main. Relancer après un arrêt : la sélection ne prend que les `planned`, donc aucun doublon. Suites : `blog-status`, `blog-seo-audit`.
