---
name: site-build
description: "Génère le site en HTML/CSS/JS depuis sections.md (landing) ou arborescence.md (multi-pages) : charte appliquée, header et footer communs, SEO de base, formulaire en attente. Déclencheurs : générer le site, coder le site."
---

# Génération du site (HTML/CSS/JS pur)

> **Inspiration** : avant d'écrire le code, relire les références retenues (`brief.md`, `.studio/state.json` → `references`, `.studio/design.json`) ; sans référence, en proposer 2 à 4 depuis des galeries publiques (scrolltide.co/templates, 21st.dev, godly.website, land-book.com) et reprendre leurs décisions en valeurs (tailles, espacements, couleurs, mouvements). Jamais de copie de code ou d'images.

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion` ; Codex : choix numérotés dans le chat).

Site existant en Next.js ou React : appliquer les mêmes règles dans son code au lieu de générer du HTML. Revue visuelle : `design-review` ; animations : `design-animation` ; accessibilité : `accessibilite`. Maquette validée (`design-spec.json` ou `.studio/design.json`) : la suivre, ou passer par `design-code`.

## Étape 0 : contexte

Dans le dossier courant :
- `./sections.md` : landing, produire `index.html`.
- `./arborescence.md` : site multi-pages.
- Les deux : demander lequel. Aucun : s'arrêter et lancer `site-architecture`.

Lire aussi `brief.md` (ton, audience, copy), `charte.md` si présent (palette, typos), `./assets/`. Aucune charte : s'arrêter et proposer de compléter le brief ou de générer une charte à partir de la description du projet ; ne pas produire un site neutre.

Confirmer le choix technique en une phrase simple : HTML/CSS/JS pur, pensé d'abord pour le mobile, déployable sur Vercel, SEO de base, formulaires en attente (branchés ensuite par `site-formulaire`).

## Étape 1 : qualité visuelle

Avant d'écrire une ligne, lire `${CLAUDE_SKILL_DIR}/references/visual-quality.md` (typographie, patterns de sections, micro-interactions, checklist). Le même fichier sert à `site-corrige`.

## Parcours A : landing

1. `index.html` unique : `<head>` avec `title`, `meta description`, `canonical`, Open Graph (`og:title`, `og:description`, `og:image` = `./assets/og-image.webp`, `og:type`), viewport ; header sticky à ancres ; une `<section id="…">` par entrée de `sections.md` ; formulaire placeholder dans la section CTA (`<form id="cta-form" data-placeholder="true">`, champs email et prénom) ; footer léger avec mentions légales et confidentialité (pages remplies par `pages-legales`) ; lien « Blog » si `modules.blog` est vrai.
2. `style.css` : charte appliquée strictement ; `html { scroll-behavior: smooth }` ; `header { position: sticky; top: 0; z-index: 100 }` ; `section { scroll-margin-top: <hauteur du header> }` ; mobile-first (menu burger, colonnes empilées, boutons ≥ 44 px).
3. Images de `./assets/` : hero `loading="eager"` avec `width`/`height`, les autres `loading="lazy"`, `alt` descriptif de 8 à 15 mots tiré de la section. Image absente : placeholder propre et liste des images à produire avec `site-images`.

## Parcours B : multi-pages

1. Créer les dossiers et pages de `arborescence.md` (top-level, thèmes, `assets/`, `css/style.css`, `mentions-legales.html`, `confidentialite.html`).
2. Header et footer **dupliqués dans chaque page** (SEO complet au premier chargement, pas de JS ; l'inclusion par `fetch` laisse header et footer vides pour Google). Dropdowns en CSS au hover, `<details>` ou JS léger en mobile ; burger et accordéons par thème.
3. Page top-level : lire son `section-<page>.md` ; sections dans l'ordre, SEO (title, description, h1, Open Graph) tiré du fichier.
4. Page thématique : lire le `template.md` du dossier ; appliquer strictement ses sections et variantes ; contenu spécifique propre à chaque page.
5. `css/style.css` commun ; `sitemap.xml` (toutes les pages) et `robots.txt` (référence au sitemap) à la racine.

## Règles

- Une seule couleur hors palette casse la cohérence.
- `alt` sur les images, `aria-label` sur les boutons sans texte.
- Pas de CDN inutile : Google Fonts accepté, pas de jQuery, Bootstrap ni Tailwind CDN.
- Header et footer identiques sur toutes les pages.

## Validation (boucle)

1. Servir en local (`npx --yes serve . -l 3000`, identique sur Mac et Windows, dans un terminal à part ou en tâche de fond) et ouvrir chaque page (`verif-navigateur` pour les captures en 4 tailles d'écran et les erreurs console).
2. Cocher la checklist de `references/visual-quality.md` ; vérifier desktop, mobile, navigation (menu, dropdowns, ancres), liens internes, images en place.
3. Défaut trouvé : corriger puis refaire l'étape 1. Cas ciblé : `site-corrige`.

Clôture : lister les fichiers créés (landing : index.html, style.css, assets ; site : N pages, css, sitemap, robots), puis montrer le rendu à l'élève (captures) et demander validation ou retouches. Suite : `site-formulaire`, `pages-legales`, `seo-audit-code`, mise en ligne, `analytics-setup`.
