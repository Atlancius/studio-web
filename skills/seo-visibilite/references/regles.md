# Règles SEO, AEO, GEO (référence du skill)

Pages publiques indexables (site vitrine, blog, docs publiques), toute stack. Aucun levier ne garantit un classement, un résultat enrichi ou une citation par une IA ; Google n'exige rien de spécial pour AI Overviews et AI Mode : une page indexée et éligible à l'extrait suffit.

## Faire

- Contenu indexable dans le HTML initial (HTML statique, SSR ou SSG) : les robots des IA (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User) n'exécutent pas le JavaScript.
- JSON-LD fidèle au contenu visible : Article, Organization, LocalBusiness (+ `geo`, horaires), Product, BreadcrumbList, VideoObject ; vérifier la Search Gallery de Google avant d'ajouter un type.
- robots.txt : autoriser la recherche (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot) ; l'entraînement (GPTBot, ClaudeBot, Google-Extended, CCBot) est une décision explicite du propriétaire ; le fetch utilisateur (ChatGPT-User, Claude-User, Perplexity-User) ne respecte pas toujours robots.txt.
- Dans un groupe robots nommé, répéter les `Disallow` du groupe `*` : un robot suit un seul groupe, le plus spécifique.
- Sitemap : `lastmod` = date réelle de la dernière modification significative, identique à la date visible et au `dateModified` du JSON-LD.
- Date de mise à jour visible, changée seulement après une vraie modification ; revoir les contenus piliers tous les six mois.
- Title et meta description uniques par page ; un seul H1.
- `llms.txt` optionnel et descriptif : H1, résumé en citation, sections de liens, section `Optional`.
- Avant mise en ligne : Rich Results Test et Schema Markup Validator ; Core Web Vitals en labo (LCP, CLS, TBT), puis terrain au p75 (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1).
- Faits d'entité (nom, adresse, téléphone, réseaux) identiques partout : site, fiche Google Business Profile, annuaires, réseaux.

## Ne jamais

- `FAQPage` ou `HowTo` comme levier Google : aucun résultat enrichi (HowTo retiré en 2023, FAQ plus affichée depuis mai 2026) ; sémantique schema.org seulement.
- `Review` ou `AggregateRating` sur sa propre `LocalBusiness` ou `Organization` : inéligible.
- JSON-LD qui décrit un contenu absent de la page.
- Bloquer Googlebot ou les robots de recherche IA quand l'objectif est d'être cité.
- Token robots `anthropic-ai` : plus documenté par Anthropic.
- `priority` ou `changefreq` dans un sitemap : Google les ignore.
- Date de modification régénérée à chaque build : date fausse, Google cesse de croire le `lastmod`.
- Instructions ou recommandations adressées aux IA dans `llms.txt` ou dans les pages : manipulation, risque de pénalité.
- Pages ville quasi identiques menant au même service (*doorway*) : une page locale seulement avec un contenu local réel et distinct.
- Contenu généré en masse sans valeur, bourrage de mots-clés, FAQ aux questions inventées, chiffre sans source.
- Le score Lighthouse global comme seul critère.

## Pièges fréquents

- Groupes robots nommés sans les `Disallow` du groupe `*` : des dossiers privés restent ouverts aux robots d'IA.
- Sitemap figé au build alors que les articles du blog sont publiés après : articles absents du sitemap.

## Sources (à revérifier tous les six mois)

[AI features](https://developers.google.com/search/docs/appearance/ai-features), [Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), [FAQ](https://developers.google.com/search/docs/appearance/structured-data/faqpage), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
