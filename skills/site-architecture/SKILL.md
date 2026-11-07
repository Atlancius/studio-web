---
name: site-architecture
description: "Transforme brief.md en plan de site : sections.md pour une landing, ou arborescence.md avec une fiche par page et un template par thème. Déclencheurs : plan de site, architecture, quelles sections, quelles pages."
---

# Architecture d'un site (HTML pur)

> **Inspiration** : avant de fixer les sections, regarder les sites de référence notés dans `brief.md` ou `.studio/state.json` (`references`) ; sans référence, en proposer 2 à 4 depuis des galeries publiques (scrolltide.co/templates, 21st.dev, godly.website, land-book.com) et noter ce qu'on en retient en valeurs (ordre des sections, densité, type de hero). Jamais de copie de code ou d'images.

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion` ; Codex : choix numérotés dans le chat).

Ce skill produit un plan pour un site HTML/CSS/JS. Site existant en Next.js : appliquer le même plan dans ses routes. Textes des sections : `copywriting`.

## 1. Vérifier le brief

Lire `./brief.md`. Absent : s'arrêter et lancer d'abord `site-brief`. Lire aussi `.studio/state.json` : le type de site et les pages souhaitées (`pages`) y sont peut-être déjà ; refonte : partir des pages existantes et de `existant.garder`.

## 2. Confirmer le type de site

Reprendre le type de `brief.md`. Si ambigu, poser l'arbre de décision :

1. Combien d'objectifs mesurables ? Un seul : landing. Plusieurs : site.
2. Trafic payant ou social : landing. Organique ou SEO : site.
3. Expertise à démontrer par le contenu (conseil, avocat, médecin) : site. Sinon : landing.

Deux signaux convergents tranchent. Sinon, présenter les deux options ; en cas de partage, commencer par une landing, étendre plus tard.

## 3. Produire le plan

- **Landing** : lire `${CLAUDE_SKILL_DIR}/references/landing.md` (catalogue de sections, gabarit `sections.md`, règles d'ancres). Proposer 5 à 8 sections adaptées au brief, les faire valider une par une ou en bloc, récupérer pour chacune contenu textuel et visuel, écrire `sections.md`.
- **Site multi-pages** : lire `${CLAUDE_SKILL_DIR}/references/multipages.md` (arborescence par thèmes, gabarits `arborescence.md`, `section-<page>.md`, `template.md`). Proposer une arborescence à partir du brief (pages top-level, thèmes en dossiers, nombre de pages par thème), puis la faire valider ou ajuster. Blog exclu : il est traité par `blog-pilote` si `modules.blog` est vrai ; prévoir alors seulement le lien « Blog » dans le menu.

Un seul chemin par défaut : HTML/CSS/JS pur, mobile-first, déployable sur Vercel. Les visuels à générer sont notés avec un prompt pour `site-images`.

## 4. Valider (boucle)

- [ ] Chaque section : contenu textuel ET visuel renseignés, id unique (landing)
- [ ] Landing : 8 sections maximum, menu par ancres uniquement
- [ ] Site : chaque page top-level a son `section-<page>.md`, chaque dossier son `template.md`
- [ ] Site : au plus 10 pages, un seul niveau de dossiers, pas de page creuse
- [ ] Header et footer décrits une fois, identiques partout

Un point manque : compléter avec l'utilisateur avant de clore.

## Clôture

Donner les chemins écrits, puis la suite : `site-images`, `site-build`, `site-formulaire`, `seo-audit-code`, mise en ligne (`site-pilote`, phase 6).
