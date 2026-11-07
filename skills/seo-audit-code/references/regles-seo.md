# Règles SEO, AEO, GEO (pages publiques)

Aucun levier ne garantit un classement, un résultat enrichi ou une citation par une IA. Google n'exige rien de spécial pour ses réponses IA : une page indexée et éligible à l'extrait suffit.

## Faire

- Contenu indexable dans le HTML initial (HTML statique, SSR ou SSG) : les robots des IA (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User) n'exécutent pas le JavaScript.
- JSON-LD fidèle au contenu visible : Organization, LocalBusiness (+ adresse, `geo`, horaires), Article, Product, BreadcrumbList, VideoObject ; vérifier la Search Gallery de Google avant d'ajouter un type.
- robots.txt : autoriser les robots de recherche (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot). Autoriser ou non l'entraînement des IA (GPTBot, ClaudeBot, Google-Extended, CCBot) est une décision explicite à demander à l'élève.
- Dans un groupe robots nommé (`User-agent: GPTBot`), répéter les `Disallow` du groupe `*` : un robot ne suit qu'un seul groupe, le plus spécifique.
- Sitemap : `lastmod` = date réelle de la dernière modification significative, identique à la date visible et au `dateModified` du JSON-LD.
- Title et meta description uniques ; un seul H1 par page.
- Coordonnées de l'entreprise (nom, adresse, téléphone, réseaux) identiques partout sur le site et sur la fiche Google Business Profile.
- `llms.txt` optionnel et descriptif : titre H1, résumé, sections de liens.
- Avant mise en ligne : Rich Results Test et Schema Markup Validator ; Core Web Vitals visés : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.

## Ne jamais

- `FAQPage` ou `HowTo` comme levier Google : plus de résultat enrichi (sémantique seulement).
- `Review` ou `AggregateRating` sur sa propre entreprise : non éligible.
- JSON-LD qui décrit un contenu absent de la page.
- Bloquer Googlebot ou les robots de recherche IA quand on veut être cité.
- `priority` ou `changefreq` dans un sitemap : Google les ignore.
- Date du jour mise automatiquement à chaque build dans `lastmod` : date fausse, Google cesse d'y croire.
- Instructions adressées aux IA dans `llms.txt` : manipulation, risque de pénalité.
- Pages ville quasi identiques pour le même service (pages satellites) ; contenu généré en masse sans valeur ; bourrage de mots-clés ; FAQ aux questions inventées ; chiffre sans source.
- Utiliser le score Lighthouse global comme seul critère.

## Sources

Documentation Google Search Central : AI features, Search Gallery, sitemaps, robots.txt, spam policies. Vérifier les points datés avant de les affirmer à l'élève.
