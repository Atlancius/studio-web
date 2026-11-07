# GEO Standards 2025-2026 — Generative Engine Optimization

## Contents

- [Différence SEO / AEO / GEO / LLMO](#différence-seo--aeo--geo--llmo)
- [Signaux de Contenu LLM (Hiérarchie)](#signaux-de-contenu-llm-hiérarchie)
- [Format Contenu LLM-Ready](#format-contenu-llm-ready)
- [Entity Optimization](#entity-optimization)
- [Crawlers IA — Configuration robots.txt](#crawlers-ia--configuration-robotstxt)
- [llms.txt — Statut Officiel](#llmstxt--statut-officiel)
- [Pages importantes](#pages-importantes)
- [Optional](#optional)
- [Métriques GEO à Tracker](#métriques-geo-à-tracker)
- [Outils GEO 2026](#outils-geo-2026)
- [Unlinked Mentions — Stratégie](#unlinked-mentions--stratégie)


## Différence SEO / AEO / GEO / LLMO

| Aspect | SEO | AEO | GEO | LLMO |
|--------|-----|-----|-----|------|
| **Cible** | Rankings Google | Featured snippets | Réponses IA synthétisées | Apps LLM |
| **Signal clé** | Backlinks | Structure Q&A | Trustworthiness | Relevance |
| **Métrique principale** | Position | CTR | Share of Voice | Citation Rate |
| **Priorité 2026** | Fondation | Haute | Très haute | Très haute |

## Signaux de Contenu LLM (Hiérarchie)

### Niveau 1 : Trustworthiness (CRITIQUE)
- Cohérence des informations sur toutes les propriétés numériques
- Citations et sources vérifiables dans le contenu
- Métadonnées de licence et d'attribution
- Absence de contenu obsolète ou de mauvaise qualité
- Transparence des auteurs et affiliations

### Niveau 2 : Expertise & Authority
- Credentials vérifiables du créateur
- Profondeur de couverture thématique (topic authority)
- Cohérence de l'auteur sur son domaine
- Ancienneté du domaine sur le sujet

### Niveau 3 : Experience
- Indication que l'auteur a **fait** ce qu'il décrit
- Études de cas, données empiriques
- Résultats mesurables avec chiffres
- Approbation par des pairs experts

### Niveau 4 : Authority Recognition
- Unlinked mentions (mentions sans lien) sur domaines tiers
- Citations par sources réputées
- Présence dans des publications de référence

## Format Contenu LLM-Ready

### Checklist structure par page

| Élément | Standard | Impact |
|---------|---------|--------|
| Paragraphes courts | 2–4 phrases max | Extractabilité |
| Définitions | Au 1er usage du terme | Désambiguation |
| TL;DR | En haut ou bas de page | Sommaire extractable |
| Tableaux comparatifs | Sur pages features/services | Synthèse citable |
| FAQ Q&A | Format direct extractable | Citation directe |
| Code blocks | Exemples techniques | Précision |
| Statistiques et citations | Chiffres sourcés, citations d'experts | Jusqu'à +40 % de visibilité IA (étude GEO) |
| Citations sources | Hyperlinks dans le texte | Vérifiabilité |

### Statistiques clés
- **Citations d'experts, statistiques et sources ajoutées : jusqu'à +40 % de visibilité** dans les réponses génératives ; le bourrage de mots-clés ne marche pas (Aggarwal et al., « GEO: Generative Engine Optimization », KDD 2024, [arXiv:2311.09735](https://arxiv.org/abs/2311.09735) — Princeton, IIT Delhi).
- Mesurer chaque moteur séparément (ChatGPT, Perplexity, Gemini, Claude) : ne pas extrapoler les citations d'un moteur à l'autre.

## Entity Optimization

### Organization Schema Complet

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Nom exact de la marque]",
  "url": "https://example.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://example.com/logo.png",
    "width": 300,
    "height": 100
  },
  "description": "[Description 2–3 phrases, factuelle, sans jargon]",
  "foundingDate": "2024",
  "areaServed": "FR",
  "sameAs": [
    "https://linkedin.com/company/nom",
    "https://twitter.com/nom",
    "https://facebook.com/nom"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@example.com",
    "availableLanguage": "French"
  }
}
```

### Person Schema (Auteur)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Nom Prénom]",
  "url": "https://example.com/auteur/nom",
  "image": "https://example.com/photo-auteur.jpg",
  "jobTitle": "[Titre exact]",
  "description": "[Bio 1–2 phrases avec credentials]",
  "knowsAbout": ["Sujet 1", "Sujet 2", "Sujet 3"],
  "worksFor": {
    "@type": "Organization",
    "name": "[Organisation]"
  },
  "sameAs": [
    "https://linkedin.com/in/nom",
    "https://twitter.com/nom"
  ]
}
```

### Règle de cohérence entités
- Nom exact identique sur : site web, LinkedIn, Google Business Profile, réseaux sociaux, Wikipedia si dispo
- Logo identique sur toutes les propriétés
- Description cohérente (pas contradictoire entre pages)
- Vérifier avec : WebSearch "[nom marque]" pour voir toutes les occurrences publiques

## Crawlers IA — Configuration robots.txt

### Tokens officiels (docs éditeurs, vérifiés le 2026-09-27)

| Token | Éditeur | Usage | Respect robots.txt |
|-------|---------|-------|-------------------|
| **OAI-SearchBot** | OpenAI | Recherche ChatGPT — bloqué = absent des réponses ChatGPT search | Oui |
| **GPTBot** | OpenAI | Entraînement des modèles | Oui |
| **ChatGPT-User** | OpenAI | Visite à la demande d'un utilisateur | **Peut ne pas s'appliquer** |
| **Claude-SearchBot** | Anthropic | Qualité de la recherche Claude | Oui |
| **ClaudeBot** | Anthropic | Entraînement des modèles | Oui |
| **Claude-User** | Anthropic | Visite à la demande d'un utilisateur | Oui |
| **PerplexityBot** | Perplexity | Résultats de recherche Perplexity | Oui |
| **Perplexity-User** | Perplexity | Visite à la demande d'un utilisateur | **NON** (en général) |
| **Google-Extended** | Google | Jeton de contrôle, pas un crawler : entraînement et grounding Gemini. Sans effet sur Google Search ni AI Overviews / AI Mode (régis par Googlebot, `nosnippet`, `max-snippet`, `noindex`) | — |
| **meta-externalagent** | Meta | Entraînement IA, indexation produit | Oui |
| **Amazonbot** / **Amzn-SearchBot** | Amazon | Entraînement IA / recherche (Alexa) | Oui |

Sources : [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity](https://docs.perplexity.ai/guides/bots), [Google crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [Meta](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/), [Amazon](https://developer.amazon.com/amazonbot).

**Cloudflare** : vérifier Security Settings > Configure AI bot policies (catégories Search / Agent / Training ; Block, Block on pages with ads ou Allow). Défaut annoncé pour les nouveaux domaines à partir du 15/09/2026 : Training et Agent bloqués sur les pages avec publicité, Search autorisé ([doc](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)).

### robots.txt optimal pour GEO
```
# Moteurs de recherche traditionnels
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Crawlers IA de recherche — visibilité dans les réponses
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Entraînement et jetons de contrôle — choix métier
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: Amazonbot
Allow: /

# Optionnel — crawlers d'outils SEO (choix métier, sans lien avec les moteurs IA)
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

## llms.txt — Statut Officiel

Format [llmstxt.org](https://llmstxt.org/) : seul le H1 est obligatoire ; puis résumé en blockquote, sections H2 de listes `nom: note`, section `## Optional` pour le secondaire.

```markdown
# [Nom du Site]

> [Description en 1–2 phrases]

## Pages importantes
- [Accueil](https://example.com): présentation
- [Services](https://example.com/services): offres
- [Contact](https://example.com/contact): coordonnées

## Optional
- [Blog](https://example.com/blog)
```

**Google** : aucun fichier texte IA, markup ni schema spécifique requis pour AI Overviews / AI Mode ([Search Central](https://developers.google.com/search/docs/appearance/ai-features)).
**OpenAI, Anthropic, Perplexity** : leurs pages crawlers ne documentent pas la lecture du llms.txt des sites (ils en publient un pour leur propre doc développeur).
**Recommandation** : Créer le fichier si < 1h de travail, sinon ne pas prioriser.

## Métriques GEO à Tracker

| Métrique | Définition | Comment Mesurer |
|----------|-----------|-----------------|
| **Citation Count** | Nb fois votre domaine est cité en réponse IA | 20–30 prompts/jour, logging manuel |
| **Share of Voice** | Vos citations / total citations categorie | Otterly, Conductor, Averi |
| **Visibility Score** | Score composite GEO | Averi, GenRank |
| **Sentiment** | Ton de votre mention (pos/neg/neutre) | NLP, Brandwatch |
| **AI-Referred Traffic** | Sessions depuis assistants IA | Analytics : référents (chatgpt.com, perplexity.ai…). GSC n'isole pas AI Overviews / AI Mode (inclus dans Performance > Web) |
| **Passage Extraction Rate** | % passages extraits de votre contenu | LLM queries + citation source track |

### Fréquence d'audit recommandée
- Citation monitoring : quotidien (20–30 prompts)
- Analyse compétitive : hebdomadaire
- Full GEO audit : trimestriel
- Review technique : mensuel

## Outils GEO 2026

Tarifs et disponibilité à vérifier sur le site de l'éditeur au moment de l'audit.

| Outil | Force |
|-------|-------|
| **Google Search Console** (gratuit) | Trafic Search, AI Overviews / AI Mode inclus sans ventilation |
| **Averi.ai** | Citation tracking + dashboard |
| **Conductor** | GEO/AEO benchmarking compétitif |
| **GenRank** | GEO audit & optimization |
| **Evertune.ai** | Brand visibility in AI |
| **Brand24** | Unlinked mentions monitoring |

## Unlinked Mentions — Stratégie

### Monitoring
```
WebSearch: "[nom marque]" -site:example.com
WebSearch: "[nom fondateur]" -site:example.com
WebSearch: "[produit/service]" "[marque]" -site:example.com
```

### Earning unlinked mentions
1. Publier original research & whitepapers citables
2. Guest posts sur publications sectorielles
3. Interviews d'experts (podcasts, articles tiers)
4. Créer outils/ressources gratuits référençables
5. Communiqués de presse sur données originales

### Impact
- Hypothèse de travail, sans documentation officielle des moteurs : les mentions d'entité sans lien renforcent l'association marque–sujet dans les réponses IA
- Objectif trimestriel de domaines d'autorité à fixer selon le secteur et la concurrence
