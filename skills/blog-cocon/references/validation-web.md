# Validation de pertinence par recherche web (étape 5)

Évite le « cocon LLM-only » : un arbre plausible qui cible des requêtes sans recherche ou saturées. Faire cette étape pour chaque petite-fille, avant la consolidation.

## Outils (par ordre de préférence)

1. **Recherche web du runtime** (WebSearch dans Claude Code ; recherche web de Codex) sur le keyword cible. Noter les domaines du top 10 :
   - Saturation extrême : top 10 dominé par wikipedia.org, `.gov`, grands médias, youtube.com, reddit.com : drop ou repositionner sur une variante longue traîne.
   - Pertinence : moins de 3 résultats vraiment liés : niche faible ou intention floue, drop ou requalifier.
   - Format dominant : featured snippet (paragraphe, liste, tableau) ou « Autres questions posées » : cibler ce format dans l'article.
2. **Suggestions Google** (endpoint non documenté, peut changer ou être bloqué) : `https://suggestqueries.google.com/complete/search?client=firefox&q=<keyword>&hl=fr`. Renvoie des suggestions JSON, utiles pour des variantes longue traîne réelles.
3. **Wikipedia FR** (API MediaWiki `opensearch`, documentée sur https://www.mediawiki.org/wiki/API:Opensearch) : `https://fr.wikipedia.org/w/api.php?action=opensearch&search=<keyword>&limit=5&namespace=0&format=json`. Réponse : tableau `[requête, titres, descriptions, urls]`. Aucun article proche : keyword probablement inventé ou trop niche pour un pilier.

## Bascule manuelle (aucun outil web)

> « Je n'ai pas d'accès web. Ouvre Google Trends et AlsoAsked avec ton mot-clé pilier, colle ici le graphe d'intérêt sur 12 mois et la liste des questions associées ; je réajuste pilier par pilier. »

## Mini-rapport par petite-fille

```
- "<keyword>"
  - SERP top 10 : [3 mots sur qui se positionne]
  - Saturation : faible / moyenne / extrême
  - Variantes longue traîne : [liste si disponible]
  - Verdict : garder / repositionner sur "<variante>" / drop
```

Intégrer les verdicts (drops, repositionnements, ajouts issus des suggestions) dans l'arbre de l'étape 6.
