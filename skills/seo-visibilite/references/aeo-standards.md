# AEO Standards — Answer Engine Optimization

## Contents

- [Cadre](#cadre)
- [Structure Answer-First (Non-Négociable)](#structure-answer-first-non-négociable)
- [Questions Fréquentes](#questions-fréquentes)
- [Schema AEO](#schema-aeo)
- [Robots.txt — Crawlers IA](#robotstxt--crawlers-ia)
- [Prérequis par plateforme](#prérequis-par-plateforme)
- [Métriques AEO à Tracker](#métriques-aeo-à-tracker)
- [Checklist AEO Complète (47 points)](#checklist-aeo-complète-47-points)
- [Sources](#sources)


## Cadre

- Google : « no additional requirements to appear in AI Overviews or AI Mode ». Ni fichier IA, ni schema spécial : page indexée et éligible au snippet. Trafic inclus dans Search Console > Performance, type « Web », sans filtre dédié.
- ChatGPT search, Perplexity, Claude : une citation suppose que leur bot de recherche accède à la page (voir robots.txt).
- Chiffres de marché (trafic IA, zero-click, parts de citations, gains « x fois » par schema ou format) : ne les citer dans un rapport qu'avec source primaire, date et périmètre de l'étude ; sinon ne pas les citer.

## Structure Answer-First (Non-Négociable)

### Template à appliquer sur chaque page clé

```
H1 = [Question exacte matchant l'intent utilisateur]
     ↓
[Paragraphe 40–60 mots : réponse directe, standalone]
     ↓
H2 : [Aspect 1 — s'ouvre sur la réponse directe]
H2 : [Aspect 2 — s'ouvre sur la réponse directe]
     ↓
## Questions Fréquentes
Q: ...
R: [40–60 mots, sans promo]

Q: ...
R: [40–60 mots, sans promo]
```

### Règles de contenu

Conventions éditoriales internes : aucun gain de citation chiffré n'est attesté par les plateformes.

| Règle | Standard |
|-------|----------|
| Paragraphes | < 4 phrases |
| Réponse d'ouverture | 40–60 mots, standalone |
| Format préféré | Listes > Tableaux > Blocs texte |
| Langage promo | INTERDIT dans les blocs réponse |
| Terminologie | 1 terme = 1 concept, cohérence totale |
| Callout boxes | Isoler les faits clés citables |

### Exemple de callout box HTML
```html
<div class="callout-key-fact">
  <strong>Résultat clé :</strong> [fait chiffré réel, avec source et date]
</div>
```

## Schema AEO

### Statut des types (Google, septembre 2026)

| Schema Type | Statut Google Search | Usage AEO |
|-------------|----------------------|-----------|
| FAQPage | Rich result plus affiché (annonce de mai 2026) | Optionnel, seulement si la FAQ est visible |
| HowTo | Rich result retiré (2023) | Optionnel, sémantique seulement |
| QAPage | Actif pour forums et support où les utilisateurs soumettent des réponses ; pas pour une FAQ rédigée par le site | Si format forum |
| Article + datePublished/dateModified | Actif (titre, image, dates) | Dates cohérentes avec la date visible |
| Review/AggregateRating | Actif ; étoiles inéligibles si l'entité (`LocalBusiness`/`Organization`) contrôle les avis sur elle-même | Intent commercial |

**Règle** : baliser uniquement du contenu visible ; un balisage valide ne garantit ni rich result ni citation.

**Technique** : JSON-LD est le format recommandé par Google, en `<head>` ou `<body>`. Le servir dans le HTML initial : les principaux crawlers IA n'exécutent pas le JavaScript (Vercel, décembre 2024).

### FAQPage Schema complet
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Qu'est-ce que l'AEO ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "L'AEO (Answer Engine Optimization) est l'optimisation du contenu pour que les moteurs de réponse (Google AI Overviews, ChatGPT search, Perplexity) extraient ou citent votre page dans leurs réponses. Là où le SEO vise une position parmi les résultats, l'AEO vise à figurer parmi les sources citées."
      }
    },
    {
      "@type": "Question",
      "name": "Comment l'AEO diffère du SEO traditionnel ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le SEO mesure les positions et les clics. L'AEO mesure la présence dans les réponses : taux de citation sur un panel de requêtes, part de voix face aux concurrents et trafic référé par les moteurs IA."
      }
    }
  ]
}
```

## Robots.txt — Crawlers IA

### Rôles des bots

| Rôle | Tokens | Effet d'un blocage |
|------|--------|--------------------|
| Recherche / citation | `Googlebot` (Search, AI Overviews, AI Mode), `Bingbot`, `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Amzn-SearchBot`, `meta-webindexer` | Plus de résultats ni de citations sur le moteur concerné |
| Entraînement | `GPTBot`, `ClaudeBot`, `Google-Extended` (Gemini ; sans effet sur Google Search), `meta-externalagent`, `Amazonbot` | Aucun effet sur la recherche documenté par les éditeurs |
| Fetch demandé par un utilisateur | `ChatGPT-User`, `Claude-User`, `Perplexity-User`, `meta-externalfetcher`, `Amzn-User` | Non fiable : OpenAI, Perplexity, Meta et Amazon indiquent que robots.txt peut ne pas s'appliquer ; Anthropic dit le respecter |

### Configuration recommandée
```
# Recherche IA : autoriser pour être cité
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
Allow: /

# Entraînement : Allow ou Disallow selon la décision du site
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: meta-externalagent
User-agent: Amazonbot
Allow: /
```

robots.txt est déclaratif : il n'arrête pas un scraper malveillant.

**Cloudflare** : depuis le 1er juillet 2025, les nouveaux domaines démarrent avec les crawlers IA bloqués. Depuis le 1er juillet 2026, la politique se règle par catégorie (Search, Agent, Training) ; pour les domaines ajoutés après le 15 septembre 2026, Training et Agent sont bloqués sur les pages avec publicité, Search reste autorisé. Si le site est derrière Cloudflare : vérifier Security Settings > AI bot policies et le robots.txt réellement servi.

## Prérequis par plateforme

| Plateforme | Condition documentée | Mesure / contrôle |
|------------|----------------------|-------------------|
| ChatGPT search | `OAI-SearchBot` autorisé, plages IP OpenAI publiées non bloquées | Referrer chatgpt.com, `utm_source=chatgpt.com` ajouté aux liens |
| Perplexity | `PerplexityBot` autorisé | Referrer perplexity.ai |
| Google AI Overviews / AI Mode | Page indexée et éligible au snippet, aucun schema spécial | Limiter via `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex` |
| Claude | `Claude-SearchBot` autorisé (visibilité dans les résultats de recherche) | `Claude-User` pour les fetchs demandés par l'utilisateur |

Aucun éditeur ne documente de préférence de longueur, de ton ou de format : appliquer la structure answer-first commune.

## Métriques AEO à Tracker

| Métrique | Définition | Fréquence |
|----------|-----------|-----------|
| **AI Share of Voice (SOV)** | Vos citations / total citations sur vos keywords | Mensuel |
| **Citation Rate** | % réponses IA vous citant sur 100 prompts testés | Mensuel |
| **Brand Visibility** | Nb mentions marque dans réponses IA | Hebdomadaire |
| **Featured Snippets** | Nb featured snippets Google | Mensuel |
| **AI-Referred Traffic** | Sessions référées par les domaines IA dans l'outil d'analytics (ex. GA4) ; Search Console ne fournit pas les referrers | Mensuel |

### Méthode de test manuelle (gratuite)
1. Créer liste de 20–30 prompts liés au secteur
2. Tester sur ChatGPT search, Perplexity, Google AI Overviews / AI Mode
3. Logger les sources citées, avec date et outil
4. Calculer % de présence = Citation Rate

### Outils AEO

Offres constatées en septembre 2026 ; vérifier offre et tarif au moment du choix.

| Outil | Modèle | Usage |
|-------|--------|-------|
| **HubSpot AI Search Grader** (ex-AEO Grader) | Gratuit, ponctuel | Visibilité de marque sur ChatGPT, Perplexity, Gemini |
| **FastAEOCheck** | Gratuit | Audit rapide de readiness (score propriétaire) |
| **Otterly.AI** | Payant, essai gratuit | Suivi de citations : ChatGPT, AI Overviews, Perplexity, Copilot ; autres en option |
| **SE Ranking** | Add-on payant « AI Search », essai 14 j | SEO + suivi AI Overviews, AI Mode, ChatGPT, Perplexity |
| **Profound** | Essai 7 j, puis Enterprise | Citation monitoring |

## Checklist AEO Complète (47 points)

### Content Structure (8)
- [ ] H1 = question matchant l'intent
- [ ] 40–60 mots dans les 200 premiers mots
- [ ] FAQ visible avec de vraies questions, sans quota
- [ ] Paragraphes < 4 phrases
- [ ] Listes/tableaux préférés aux paragraphes
- [ ] 0 langage promotionnel dans réponses
- [ ] Terminologie cohérente
- [ ] H2 s'ouvrent sur réponse directe

### Schema Markup (6)
- [ ] JSON-LD dans le HTML initial
- [ ] Balisage fidèle au contenu visible
- [ ] FAQPage / HowTo optionnels (aucun rich result Google)
- [ ] Article : datePublished + dateModified
- [ ] QAPage seulement si réponses soumises par les utilisateurs
- [ ] 0 erreurs Rich Results Test / Schema Markup Validator

### Authority & E-E-A-T (8)
- [ ] Author byline + credentials
- [ ] datePublished + dateModified
- [ ] Sources externes liées
- [ ] Contact visible
- [ ] Bio auteur vers page complète
- [ ] Affiliation organisation claire
- [ ] Claims avec chiffres/études
- [ ] HTTPS + privacy policy

### Content Quality (7)
- [ ] Ouverture avec données spécifiques
- [ ] Callout boxes highlights
- [ ] Ton conversationnel
- [ ] Contenu expert reviewed
- [ ] Date de mise à jour visible et exacte
- [ ] Tableaux comparatifs
- [ ] Exemples réels / case studies

### Technical AEO (8)
- [ ] TTFB ≤ 800 ms (web.dev ; hors Core Web Vitals)
- [ ] Responsive mobile
- [ ] Contenu clé dans le HTML initial (SSR/SSG)
- [ ] OAI-SearchBot / Claude-SearchBot / PerplexityBot autorisés (robots.txt + Cloudflare/WAF)
- [ ] Sitemap soumis
- [ ] Core Web Vitals GOOD
- [ ] 0 ressources render-blocking
- [ ] Alt text images

### Citation Preparation (10)
- [ ] Callout boxes présents
- [ ] Stats en bullet points
- [ ] Pull quotes standout
- [ ] Attribution correcte
- [ ] Claims fact-checked
- [ ] 0 informations contradictoires
- [ ] Définitions claires
- [ ] Long-form sans jargon
- [ ] Format Q&A naturel
- [ ] Tuning plateforme-spécifique

## Sources

Vérifiées le 2026-09-27 :

- Google Search Central : [AI features](https://developers.google.com/search/docs/appearance/ai-features), [structured data intro](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), [FAQ](https://developers.google.com/search/docs/appearance/structured-data/faqpage), [QAPage](https://developers.google.com/search/docs/appearance/structured-data/qapage), [HowTo/FAQ 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes), [crawlers Google](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- Bots : [OpenAI](https://developers.openai.com/api/docs/bots), [OpenAI publishers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity](https://docs.perplexity.ai/guides/bots), [Meta](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/), [Amazon](https://developer.amazon.com/amazonbot)
- Cloudflare : [press release 2025-07-01](https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/), [changelog 2026-07-01](https://developers.cloudflare.com/changelog/post/2026-07-01-ai-traffic-options/), [Block AI bots](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)
- Performance et JS : [web.dev TTFB](https://web.dev/articles/ttfb), [Vercel — AI crawlers (2024-12-17)](https://vercel.com/blog/the-rise-of-the-ai-crawler)
- Outils : [HubSpot](https://www.hubspot.com/aeo-grader), [FastAEOCheck](https://fastaeocheck.com/), [Otterly.AI](https://otterly.ai/pricing), [SE Ranking](https://seranking.com/pricing.html), [Profound](https://www.tryprofound.com/pricing)
