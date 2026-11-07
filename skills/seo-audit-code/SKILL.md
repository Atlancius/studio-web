---
name: seo-audit-code
description: "Audite le SEO dans le code du site (HTML, Next.js) : title, meta, canonical, Open Graph, titres, alt, JSON-LD, sitemap, robots ; rapport par gravité, corrections sur accord. Déclencheurs : audit SEO, vérifier le SEO, sitemap."
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion` ; Codex : choix numérotés dans le chat).

# Audit SEO — code source frontend

Règles et seuils : [references/regles-seo.md](references/regles-seo.md) (à lire avant l'audit) ; ce skill les vérifie dans le code. Site déjà en ligne (visibilité Google et IA, Core Web Vitals terrain, plan 90 jours) : `seo-visibilite`.

## Workflow

```
- [ ] Stack et pages identifiées
- [ ] Phase 1 : checklist passée page par page
- [ ] Phase 2 : Lighthouse (ou "non mesuré")
- [ ] Phase 3 : rapport avant
- [ ] Phase 4 : corrections sur accord, rapport après
```

### Phase 1 — Analyse du code source

Lister les pages (HTML/JSX/TSX) puis lire selon la stack :
- **Next.js (App Router)** : `layout.tsx` ET `page.tsx`. Les `metadata` sont fusionnés superficiellement : un `openGraph` ou `robots` défini dans `page` remplace entièrement celui du layout (og:image perdue si absente).
- **TanStack Start** : `head()` de la route et de ses parents (le dernier `title`/`meta` de même `name`/`property` gagne) ; `<HeadContent />` rendu dans le `<head>` du root.
- **HTML statique** (ni Next ni TanStack) : le `<head>` de chaque fichier `.html` ; chercher aussi `sitemap.xml` et `robots.txt` à la racine du site (ou dans `public/`).

#### Meta Tags (CRITICAL)
- [ ] `<title>` présent, unique, descriptif et concis (Google n'impose aucune longueur, il tronque à l'affichage)
- [ ] `<meta name="description">` présente et unique par page (même règle de longueur)
- [ ] `<meta name="viewport">` présent (ajouté par défaut par Next.js)
- [ ] `<link rel="canonical">` sur toute page indexable
- [ ] `<html lang="xx">` défini

#### Open Graph (HIGH)
- [ ] `og:title`, `og:description`, `og:url`, `og:type`, `twitter:card` présents (X retombe sur les `og:*` pour titre, description, image)
- [ ] `og:image` en URL absolue, au moins 1200x630, ratio 1.91:1 (recommandation Meta)

#### Structure (HIGH)
- [ ] Un seul `<h1>` par page (en MDX, le `title` du frontmatter tient lieu de H1)
- [ ] Hiérarchie h1 > h2 > h3 respectée (pas de saut)
- [ ] `alt` descriptif sur toutes les images ; `alt=""` seulement si purement décorative
- [ ] Liens internes avec texte descriptif (pas "cliquez ici")

#### Crawl (HIGH)
- [ ] `robots.txt` présent, référence le sitemap, aucun blocage accidentel ; groupes nommés : voir `references/regles-seo.md`
- [ ] `sitemap.xml` présent, URLs absolues valides, `lastmod` = vraie date de dernière modification, ni `priority` ni `changefreq`

#### Performance SEO (MEDIUM)
- [ ] Images avec `width` et `height` (éviter CLS)
- [ ] Images `loading="lazy"` sauf above-the-fold ; image LCP préchargée (`next/image` : lazy par défaut, prop `preload` depuis Next.js 16, `priority` dépréciée)
- [ ] `next/image` utilisé si Next.js
- [ ] Fonts preloaded ou `next/font`
- [ ] CSS critique inline ou preloaded

#### Schema.org (LOW — bonus)
- [ ] JSON-LD fidèle au contenu visible, type présent dans la Search Gallery Google courante (Organization, LocalBusiness, Article, Product, BreadcrumbList...) ; `FAQPage`/`HowTo` n'ont plus de rich result Google

### Phase 2 — Audit live (si dev server disponible)

Lancer le serveur local (`npx --yes serve . -l 3000` pour un site HTML, `npm run dev` pour un projet Node), puis, une seule ligne identique sur Mac, Linux et Windows (Chrome ou Edge installé requis) :
```
npx --yes lighthouse http://localhost:3000 --only-categories=seo --output json --output-path .studio/lighthouse-seo.json --chrome-flags="--headless"
```
Lire le fichier JSON produit (le score est `categories.seo.score`, sur 1). Toujours `--output-path` plutôt qu'une redirection `>` : sous Windows PowerShell 5.1, `>` écrit en UTF-16 et casse le JSON.

### Phase 3 — Rapport

```
## SEO Audit Report — {page/component}

### Score Lighthouse SEO: {X}/100 | non mesuré

### CRITICAL (must fix)
| Issue | File:Line | Fix |
|-------|-----------|-----|
| Missing <title> | layout.tsx:5 | Add <title>Page Title</title> |

### HIGH (should fix) / MEDIUM (nice to have) / LOW (bonus)
(même tableau)
```

Plus de 3 pages : tableau consolidé, une ligne par page et par point (OK / À corriger / Absent).

### Phase 4 — Corrections

Lister les corrections par priorité (CRITICAL, HIGH, MEDIUM, LOW), demander lesquelles appliquer, appliquer celles-là, re-auditer et donner le rapport avant/après (score Lighthouse inclus).

- Domaine canonique : le lire dans la config du projet, sinon le demander ; ne jamais inventer d'URL dans canonical, `og:url` ou sitemap.
- `sitemap.xml` ou `robots.txt` absent : le générer (Next.js : `app/sitemap.ts` et `app/robots.ts` ; HTML statique : fichiers à la racine ou dans `public/`). `robots.txt` minimal : `User-agent: *`, `Allow: /`, `Sitemap: https://<domaine>/sitemap.xml`, plus un `Disallow:` par page à exclure (admin, merci, test). `lastmod` = date du dernier commit du fichier de la page.
- Après mise en ligne : soumettre le sitemap dans Search Console ; l'indexation d'un nouveau site prend des semaines.

## Contraintes

- Ne jamais écrire une meta description générique : toujours la tirer du contenu réel de la page.
- Toujours donner le score Lighthouse SEO avant et après corrections ; sans phase 2, écrire « non mesuré », ne jamais estimer.

## Skills liés

- `accessibilite` : qualité d'accès en complément.
- `verif-navigateur` : captures et erreurs console.
- `seo-visibilite` : audit SEO + moteurs de réponse + IA d'un site en ligne.
- `blog-seo-audit` : SEO des articles du blog.
