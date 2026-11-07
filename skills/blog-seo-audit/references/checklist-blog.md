# Checklist SEO du blog (cocon Ghost)

## Table des matières
1. Spécificités d'un blog
2. Les 8 critères en détail
3. Sitemap
4. Search Console
5. Opportunités de requêtes (optionnel, manuel)
6. Événements GA4 utiles

## 1. Spécificités d'un blog

- Volume : 30 à 100 articles, la cohérence prime sur l'optimisation d'une page.
- Structure : chaque article est un mini-cluster ; un seul `<h1>`, des H2 qui font avancer la promesse.
- Fraîcheur : `updated_at` compte ; une mise à jour substantielle peut relancer un vieil article. Ne changer la date visible et `dateModified` qu'après une vraie modification.
- Maillage : cœur du cocon (mère, sœurs, CTA). Voir `blog-cocon` et `blog-link-validation`.

## 2. Les 8 critères

1. **`meta_title`** : ≤ 60 car., keyword principal une fois, de préférence en début, différent du `<h1>`. Le seuil de 60 est un repère d'affichage : Google tronque selon la largeur disponible et n'impose pas de limite ([source](https://developers.google.com/search/docs/appearance/title-link)). Contre-exemple : bourrage du keyword.
2. **`meta_description`** : ≤ 155 car. (repère d'affichage), verbe d'action + bénéfice (+ chiffre vérifié si possible), keyword naturel.
3. **`<h1>` unique** : Ghost génère le H1 depuis `title` ; un `<h1>` dans le corps est une erreur de rédaction (à convertir en H2).
4. **Structure** : 5 à 8 H2 (moins : article court ou mal structuré), H2 factuels (lus comme un sommaire), H3 seulement sous un H2, pas de « Partie 1 / Partie 2 ».
5. **4 à 6 liens internes** : 1 vers la mère (pilier), 2-3 sœurs, 1 CTA final, 0-2 outils.
6. **Image hero** : `alt` de 8 à 15 mots décrivant le contenu (« Capture d'écran d'un terminal montrant … »), pas le rôle.
7. **Bloc de profondeur** : `<pre><code>` (article technique), `<table>` (comparaison) ou `<blockquote>` (source citée).
8. **JSON-LD** : `BlogPosting` (champs : `headline`, `datePublished`, `dateModified`, `author`, `image`, `mainEntityOfPage`) et `BreadcrumbList` Accueil → Blog → Pilier → Article. Le JSON-LD doit décrire le contenu visible. Ne pas ajouter `FAQPage` ni `HowTo` comme levier : Google ne les affiche plus pour la plupart des sites.

## 3. Sitemap

Ghost génère `/sitemap.xml` et ses sous-sitemaps (posts, pages, tags, authors) : rien à coder en scénarios A et B. À vérifier : HTTP 200, seuls les articles publiés y figurent, `<lastmod>` = `updated_at` réel. Scénario C : le sitemap est `app/sitemap.ts` du site Next (`blog-integrate-headless`).

## 4. Search Console

1. Ajouter la propriété du blog (vérification par balise dans l'en-tête du thème ou par fichier).
2. Search Console → Sitemaps → ajouter `sitemap.xml`. Le crawl suit en quelques jours.
3. Inspection d'URL → demander l'indexation d'un article fraîchement publié.

## 5. Opportunités de requêtes (optionnel, manuel)

Aucune commande ne l'automatise. Si Search Console est branchée : requêtes en position 8 à 20 avec plus de 50 impressions sur 28 jours (seuils de départ à ajuster). Pour chacune, croiser avec `cocon.json` : article existant → le mettre à jour (contenu, maillage) ; sinon proposer un nouvel article dans le pilier le plus proche. Sortie : tableau `requête | position | impressions | CTR | article | action`, trié par impressions.

API : `POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query` (`siteUrl` encodé, `sc-domain:exemple.com` pour une propriété de domaine), corps `{ startDate, endDate, dimensions: ["query","page"], rowLimit }` (max 25 000), scope OAuth `webmasters.readonly` ([doc](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)). Jeton OAuth fourni par l'élève, jamais écrit dans un fichier.

## 6. Événements GA4 utiles

Via le thème (`blog-theme`) : `page_view` avec dimension personnalisée `pilier`, clic sur le CTA final, lecture complète (scroll 90 %), clic sur un lien interne du cocon. Ils complètent Search Console : trafic entrant vers conversion.
