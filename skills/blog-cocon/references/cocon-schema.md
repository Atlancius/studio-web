# Schéma de cocon.json (contrat partagé)

Fichier écrit par `blog-cocon`, lu et mis à jour par `blog-article`, `blog-batch`, `blog-status`, `blog-seo-audit`, `blog-corrige`, `blog-integrate-admin`. Ne le dupliquer nulle part ailleurs.

```json
{
  "site": "https://exemple.com",
  "mere": {
    "slug": "apprendre-claude",
    "title": "Apprendre Claude : le guide complet pour francophones",
    "keyword_principal": "apprendre claude",
    "keywords_secondaires": ["formation claude", "claude ia français"]
  },
  "filles": [
    {
      "slug": "claude-blog",
      "pilier_slug": "pipeline-blog",
      "title": "Construire un pipeline de blog SEO avec Claude",
      "description": "160 caractères max, sert de meta description",
      "keyword": "blog claude seo",
      "persona": "entrepreneur",
      "cta_principal": "/mon-offre",
      "petites_filles": [
        {
          "slug": "cocon-semantique-ia",
          "title": "Cocon sémantique avec l'IA : la méthode pas à pas",
          "keyword": "cocon sémantique ia",
          "intent": "informational",
          "status": "planned"
        }
      ],
      "status": "planned"
    }
  ]
}
```

## Champs

| Niveau | Champ | Règle |
|---|---|---|
| racine | `site` | URL du site, `"TBD"` si inconnue |
| mère | `slug`, `title`, `keyword_principal`, `keywords_secondaires[]` | 1 seule mère ; 2-3 variantes secondaires |
| fille | `slug` | identifiant interne, peut porter un préfixe thématique (`claude-blog`) |
| fille | `pilier_slug` | court, propre, unique : URL publique `/blog/pilier/<pilier_slug>` |
| fille | `description` | 160 caractères max |
| fille | `keyword` | 1-3 mots, intention informationnelle |
| fille | `persona` | `entrepreneur`, `opérationnel` ou `dirigeant` (fixe le ton) |
| fille | `cta_principal` | un seul par fille, URL relative de l'offre |
| fille | `linked_outils[]` | optionnel : URLs de pages outils à mailler |
| petite-fille | `slug`, `title`, `keyword` | keyword de 3-5 mots, différent de celui de la fille |
| petite-fille | `intent` | `informational`, `transactional`, `navigational` |
| petite-fille | `keywords_secondaires[]` | optionnel |
| fille et petite-fille | `status` | `planned` (à écrire), `draft` (rédigé non publié), `published` |

Ajoutés par `blog-article` et `blog-batch` sur la petite-fille : `ghost_id` (ID du post Ghost), `drafted_at` (date ISO). Optionnel : `ghost_slug`.

## Propagation des statuts

Une fille `planned` n'a que des petites-filles `planned` ou `draft` ; elle passe `published` quand au moins une petite-fille est publiée. Tous les statuts sont `planned` à la création.

## Lecture rapide

Script Node du skill `blog-cocon` (identique sur Mac, Linux et Windows) :

```bash
node "${CLAUDE_SKILL_DIR}/scripts/blog-outils.mjs" cocon-stats cocon.json
```

Il affiche le nombre de petites-filles par statut et le nombre de non publiées.
