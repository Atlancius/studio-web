---
name: blog-status
description: "Affiche en lecture seule l'avancement du blog (publiés, brouillons, planifiés par pilier, prochain article) depuis cocon.json et Ghost. Déclencheurs : état du blog, où en est mon blog."
---

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Ghost : utiliser le service MCP Ghost (lecture des posts), quel que soit le nom de ses outils ; à défaut, appeler l'API Content de Ghost en lecture (`GET <URL>/ghost/api/content/posts/?key=<clé Content>&limit=all&fields=slug,published_at`, clé lue dans l'environnement ou la config, jamais affichée) ; elle ne renvoie que les posts publiés.

# État du cocon

Instantané en lecture seule, comme un `git status` du cocon. Aucun appel à un modèle, aucune image, aucune écriture (ni `cocon.json`, ni Ghost). Pas de dialogue : tu déroules les étapes puis tu affiches. Tutoiement. Si on demande une modification, rediriger : cocon à modifier avec `blog-cocon`, articles avec `blog-article`.

## Pré-requis

`cocon.json` à la racine (schéma : `../blog-cocon/references/cocon-schema.md`). Absent : « Je ne trouve pas de `cocon.json` à la racine. Cartographie d'abord le cocon avec `blog-cocon`, puis reviens. » et arrêt. JSON invalide ou clé manquante (`mere`, `filles`, `petites_filles`) : nommer la clé et renvoyer vers `blog-cocon` ou `blog-corrige`. Cocon sans petite-fille : « Ton cocon n'a encore aucune petite-fille. Ajoute-les avec `blog-cocon`. » et arrêt.

## Étapes

1. **Lire `cocon.json`** : pour chaque fille, `pilier_slug`, `title`, et pour chaque petite-fille `slug` et `status`.
2. **Croiser avec Ghost** (si le service répond) : lister les posts `published` et `draft` (toutes les pages), puis par `slug` :
   - trouvé `published` : statut effectif `published` ;
   - trouvé `draft` : `draft` ;
   - absent : `planned`.
   Posts Ghost dont le slug ne correspond à aucune petite-fille : « hors cocon ». Service indisponible : utiliser les `status` de `cocon.json` et le signaler en pied.
3. **Calculer** : total = nombre de petites-filles ; effectifs `published`, `draft`, `planned` (leur somme égale le total) ; par pilier le ratio `publiés/total` ; dernière publication = `published_at` la plus récente (`YYYY-MM-DD` et slug, sinon « aucune pour l'instant ») ; prochain à écrire = première petite-fille `planned` du pilier au plus haut ratio hors piliers terminés (égalité : ordre du JSON).
4. **Afficher** un seul bloc :

```
Cocon : <titre de la mère>
────────────────────────
<TOTAL> articles total
  ✓ <N> publiés
  ◐ <N> en draft Ghost (à relire)
  ○ <N> planifiés (à écrire)

Par pilier :
  <pilier_slug>   : <X>/<Y>   ✓ <slugs publiés>
                              ◐ <slugs en draft>
                              ○ <slugs planifiés>

Dernière publication : <YYYY-MM-DD> (<slug>)
Prochain à écrire    : "<title>" (pilier <pilier_slug>)
────────────────────────
✓ publié  ◐ draft Ghost (en attente de relecture)  ○ planifié, à écrire
```

Règles d'affichage : `pilier_slug` alignés sur une même colonne ; ne pas afficher une ligne de statut vide ; tous les piliers listés, même à `0/Y` ; slugs séparés par `, `, par paquets de 3 par ligne au-delà de 5 ; pas de couleurs ANSI.

Sections conditionnelles après la légende :

- posts hors cocon : `⚠️  <N> articles hors cocon dans Ghost :` suivi de la liste de slugs ;
- cross-référence impossible : `ℹ️  Cross-référence Ghost indisponible, état basé sur cocon.json. Branche Ghost avec blog-setup-ghost pour un état réel.`

## Contrôle avant d'afficher

- [ ] la somme publiés + drafts + planifiés égale le total
- [ ] tous les piliers sont présents
- [ ] aucun secret affiché (slugs publics uniquement)

## Clôture

Terminer par : « Prochain article : `blog-article` (prend le premier `planned`). Plusieurs d'un coup : `blog-batch`. »
