# SEO Standards

## Contents

- [Core Web Vitals — Seuils Officiels Google](#core-web-vitals--seuils-officiels-google)
- [On-Page SEO Checklist](#on-page-seo-checklist)
- [E-E-A-T (Experience · Expertise · Authoritativeness · Trustworthiness)](#e-e-a-t-experience--expertise--authoritativeness--trustworthiness)
- [Mobile-First Indexing (généralisé depuis le 5 juillet 2024)](#mobile-first-indexing-généralisé-depuis-le-5-juillet-2024)
- [Schema.org — Types Prioritaires](#schemaorg--types-prioritaires)
- [Google Search Console KPIs](#google-search-console-kpis)
- [Outils de Validation](#outils-de-validation)


> Seuls les seuils et consignes sourcés (liens) viennent de Google / web.dev. Les nombres marqués « heuristique » sont des repères d'audit internes, pas des signaux de ranking.

## Core Web Vitals — Seuils Officiels Google

Données terrain, 75e percentile des chargements, mobile et desktop séparés ([web.dev/vitals](https://web.dev/articles/vitals), [seuils](https://web.dev/articles/defining-core-web-vitals-thresholds)).

| Métrique | GOOD | NEEDS IMPROVEMENT | POOR | Note |
|----------|------|------------------|------|------|
| **LCP** | ≤ 2.5s | 2.5–4s | > 4s | Core Web Vital |
| **INP** | ≤ 200ms | 200–500ms | > 500ms | Core Web Vital, remplace FID (12 mars 2024) |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 | Core Web Vital |
| **FCP** | ≤ 1.8s | 1.8–3s | > 3s | Diagnostic ([web.dev/fcp](https://web.dev/articles/fcp)) |
| **TTFB** | ≤ 800ms | 800–1800ms | > 1800ms | Diagnostic, « rough guide » ([web.dev/ttfb](https://web.dev/articles/ttfb)) |
| **Score Lighthouse Performance** | 90–100 | 50–89 | 0–49 | Lab, pas un Core Web Vital ([scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)) |

**Règle** : les 3 Core Web Vitals (LCP, INP, CLS) doivent tous être en GOOD au 75e percentile. Ils sont utilisés par le ranking sans garantir de position ([page experience](https://developers.google.com/search/docs/appearance/page-experience)).

## On-Page SEO Checklist

### Title & Meta
- Title : unique par page, descriptif, keyword principal. Pas de limite Google, troncature selon la largeur d'écran ([title links](https://developers.google.com/search/docs/appearance/title-link)) ; heuristique 50–60 chars
- Meta description : unique par page, points clés, CTA. Pas de limite Google ([snippets](https://developers.google.com/search/docs/appearance/snippet)) ; heuristique 150–160 chars
- Open Graph tags : og:title, og:description, og:image

### Structure
- 1 seul H1 par page, contient keyword (heuristique : Google n'impose ni nombre ni ordre de titres, [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide))
- Hiérarchie : H1 → H2 → H3 (pas de saut, pour l'accessibilité)
- H2 incluent des variantes sémantiques du keyword

### URL
- Lowercase, tirets (pas underscores) ([URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure))
- Keyword dans le slug
- Pas de paramètres de tracking ni d'ID de session dans l'URL canonique
- Stable (éviter les redirects inutiles)

### Contenu
- Couvre l'intent : Google n'a aucun minimum de mots ([SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)) ; heuristique 300+ mots, 1500+ pour pages evergreen
- Contenu original (0 duplication)
- Freshness : mise à jour < 6 mois pour pages clés (heuristique)
- Variantes sémantiques et entités liées
- Framing par intent (FAQ, how-to, comparison, list)

### Media
- Alt text descriptif sur 100% des images informatives, sans keyword stuffing
- Noms de fichiers courts et descriptifs (pas img001.jpg)
- Formats supportés par Google : BMP, GIF, JPEG, PNG, WebP, SVG, AVIF ; WebP/AVIF recommandés ; < 100KB (heuristique, pas de limite Google)
- Responsive images (srcset) avec `src` de repli ([Google Images](https://developers.google.com/search/docs/appearance/google-images))

### Links
- Internal links : min 2 par page (heuristique), anchor descriptif
- 0 orphan pages
- 0 broken links
- Pas de "click here" comme anchor text
- External links qualifiés : `rel="sponsored"` (payant), `rel="ugc"` (contenu utilisateur), `rel="nofollow"` sinon ([qualifier les liens](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links))

## E-E-A-T (Experience · Expertise · Authoritativeness · Trustworthiness)

Pas un facteur de ranking en soi ; Trust est le plus important ([helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).

### Experience
- Preuve d'utilisation réelle (photos, cas d'usage, témoignages)
- First-hand evidence dans le contenu

### Expertise
- Author bio visible avec credentials et certifications
- Historique de publication sur le sujet
- Deepest knowledge (contenu complet sur le topic)

### Authoritativeness
- Backlinks de domaines pertinents et de qualité
- Mentions externes (brand mentions, citations)
- Présence sur répertoires professionnels

### Trustworthiness
- HTTPS obligatoire (pas de contenu mixte)
- Contact clair : adresse physique, email, formulaire
- Privacy policy + CGU visibles
- 0 interstitiel intrusif ([page experience](https://developers.google.com/search/docs/appearance/page-experience))
- Aucun contenu obsolète
- Déclaration de conflits d'intérêts si applicable

**Sujets YMYL (santé, finance, sécurité, bien-être de la société)** → Google pondère davantage un E-E-A-T fort.

## Mobile-First Indexing (généralisé depuis le 5 juillet 2024)

Google indexe et classe la version MOBILE. Depuis le 5 juillet 2024, tous les sites sont crawlés par Googlebot Smartphone ; un site inaccessible sur mobile n'est plus indexé ([best practices](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing), [annonce](https://developers.google.com/search/blog/2024/06/mobile-indexing-vlast-final-final.doc)).

**Checklist :**
- Content parity 100% mobile = desktop
- Tap targets ≥ 48×48px, ~8px d'espacement ([web.dev](https://web.dev/articles/accessible-tap-targets))
- Responsive design (recommandé par Google) ou separate URLs avec annotations
- Mêmes balises meta robots mobile/desktop
- Metadata identiques (titles, descriptions, H1)
- Structured data identique sur version mobile
- Contenu principal non lazy-loadé sur interaction
- Ressources non bloquées dans robots.txt

## Schema.org — Types Prioritaires

### Format recommandé : JSON-LD

Google supporte JSON-LD, Microdata et RDFa, et recommande JSON-LD ([intro](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)). Baliser uniquement le contenu visible ; aucun rich result garanti. Vérifier la [Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) avant d'ajouter un type.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TypeIci",
  ...
}
</script>
```

### Types essentiels

**Article / BlogPosting** (aucune propriété requise ; recommandées : author, dates ISO 8601 avec fuseau, headline, image en URL absolue crawlable — [Article](https://developers.google.com/search/docs/appearance/structured-data/article))
```json
{
  "@type": "BlogPosting",
  "headline": "Titre",
  "datePublished": "2026-02-20T10:00:00Z",
  "dateModified": "2026-02-20T14:30:00Z",
  "author": { "@type": "Person", "name": "Nom", "url": "https://example.com/auteur/nom" },
  "publisher": {
    "@type": "Organization",
    "name": "Marque",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  },
  "image": "https://example.com/image.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://example.com/url" }
}
```

**FAQPage** (optionnel : aucun rich result Google depuis le 7 mai 2026 — [FAQ](https://developers.google.com/search/docs/appearance/structured-data/faqpage) ; aucun schema spécial requis pour AI Overviews / AI Mode — [AI features](https://developers.google.com/search/docs/appearance/ai-features))
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question exacte ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Réponse directe en 40–60 mots..."
      }
    }
  ]
}
```

**HowTo** (optionnel : rich result retiré par Google en 2023 — [annonce](https://developers.google.com/search/blog/2023/08/howto-faq-changes))
```json
{
  "@type": "HowTo",
  "name": "Comment faire X",
  "step": [
    { "@type": "HowToStep", "name": "Étape 1", "text": "Description..." }
  ]
}
```

**Organization** (logo ≥ 112×112px, crawlable — [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization))
```json
{
  "@type": "Organization",
  "name": "Nom entreprise",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://linkedin.com/company/...", "https://twitter.com/..."],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@example.com"
  }
}
```

**BreadcrumbList**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 3, "name": "Article", "item": "https://example.com/blog/article" }
  ]
}
```

## Google Search Console KPIs

Google ne publie aucun seuil de CTR, d'impressions ou de position : comparer chaque page à la baseline du site sur des périodes comparables (rapport Performance, [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)).

| Signal (heuristique) | Alerte |
|----------|--------|
| Impressions/page/mois | < 10 = retravailler |
| CTR nettement sous la médiane du site à position égale | problème title/meta |
| Average position | > 50 = invisible |
| Pages indexées | toute URL canonique destinée à l'index non indexée (rapport Indexation) |

**Opportunités** : Keywords en position 10–20 = quick wins à cibler.

## Outils de Validation

- **PageSpeed Insights** : https://pagespeed.web.dev
- **Rich Results Test** : https://search.google.com/test/rich-results
- **Lighthouse** (remplace le Mobile-Friendly Test, retiré le 1er décembre 2023) : https://developer.chrome.com/docs/lighthouse/overview
- **Google Search Console** : https://search.google.com/search-console
- **Schema Markup Validator** : https://validator.schema.org
