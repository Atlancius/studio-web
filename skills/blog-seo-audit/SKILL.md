---
name: blog-seo-audit
description: "Audite le SEO d'un article Ghost ou de tout le cocon : score sur 8 critères, corrections concrètes, rapport daté. Déclencheurs : audit SEO du blog, score d'article, contrôle mensuel."
argument-hint: "[slug | cocon]"
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Question à l'utilisateur : Claude `AskUserQuestion`, Codex question dans le chat. Skills voisins : `blog-setup-ghost`, `blog-theme`, `blog-link-validation`, `blog-article` (Claude : outil Skill ; Codex : `$nom` ou lecture du `SKILL.md`).

# Audit SEO d'un article ou du cocon

Pré-requis : une instance Ghost avec au moins un article (publié ou draft) et un accès à l'API Ghost (service MCP Ghost, ou Admin/Content API avec les clés de `ghost-config.md`). Tests et règles du blog : seuils et pièges des 8 critères dans [references/checklist-blog.md](references/checklist-blog.md) (à lire avant le premier audit). Audit d'un site hors blog : `seo-audit-code` (code source) et `seo-visibilite` (site en ligne, moteurs et IA).

## Checklist

- [ ] Scope choisi (un slug ou `cocon`)
- [ ] Posts récupérés
- [ ] 8 critères scorés par article
- [ ] Rapport `seo-audit-{AAAA-MM-JJ}.md` écrit à la racine
- [ ] Vérifications finales passées

## 1. Scope

Demander : un article (slug) ou tout le cocon (posts `published` + `draft`). Slug inconnu dans Ghost : redemander.

## 2. Récupération

Via l'API Ghost : un post par slug, ou tous les posts `status:[published,draft]` avec `include=tags,authors`. Champs utiles : `slug`, `title`, `meta_title`, `meta_description`, `custom_excerpt`, `html`, `feature_image`, `feature_image_alt`, `primary_tag`, `published_at`, `updated_at`. Erreur d'authentification ou instance hors ligne : le dire et renvoyer à `blog-setup-ghost`.

## 3. Score (0 ou 1 par critère, total /8)

| # | Critère | Réussi si |
|---|---|---|
| 1 | `meta_title` | présent, ≤ 60 car., keyword principal une seule fois |
| 2 | `meta_description` | présente, ≤ 155 car., verbe d'action + bénéfice |
| 3 | `<h1>` | 0 `<h1>` dans le `html` du corps (le H1 vient du `title`, rendu par le thème ou la page Next) |
| 4 | Structure | 5 à 8 `<h2>`, aucun `<h3>` avant le premier `<h2>` |
| 5 | Liens internes | 4 à 6 liens vers le même domaine (1 mère, 2-3 sœurs, 1 CTA, 0-2 outils) |
| 6 | Image hero | `feature_image` présente, `feature_image_alt` descriptif de 8 mots ou plus (ni `image`, ni `hero`) |
| 7 | Bloc de profondeur | au moins un `<pre><code>`, `<table>` ou, à défaut, `<blockquote>` |
| 8 | JSON-LD | le rendu public contient `BlogPosting` (headline, datePublished, dateModified, author, image, mainEntityOfPage) et `BreadcrumbList` |

Critère 8 : tester le HTML rendu de l'URL publique : `node "${CLAUDE_SKILL_DIR}/scripts/blog-outils.mjs" compte <url-article> application/ld+json` (au moins 1 occurrence attendue ; `${CLAUDE_SKILL_DIR}` = dossier de ce skill, Codex : dossier du SKILL.md). Article en draft : `n/a`, ne compte pas dans le total (score sur 7). Thème Ghost par défaut (Casper) : critère 8 échoue partout, le signaler en tête et renvoyer à `blog-theme`. Scénario C (headless) : le JSON-LD vient de `app/blog/[slug]/page.tsx` (voir `blog-integrate-headless`).

Chaque critère échoué reçoit une correction précise et chiffrée (ex. « raccourcir à `…` (52 car.) », « ajouter 2 liens vers `/blog/pilier/x` »), jamais « améliorer le SEO ». Slugs et piliers cités : à croiser avec `cocon.json` (et `blog-link-validation` pour la whitelist).

Scope cocon, en plus : score moyen, liste des articles 8/8, 3 articles à corriger en premier (score le plus bas ; à égalité, impressions Search Console si disponibles, sinon `published_at` le plus ancien).

## 4. Rapport

Écrire `seo-audit-{AAAA-MM-JJ}.md` à la racine du projet :

```markdown
# SEO Audit, {date}
Scope : {slug | cocon entier}

## Résumé            (scope cocon seulement)
- Articles audités : X · Score moyen : Y / 8
- Articles 8/8 : slug1, slug2
- Top 3 à corriger : slug-a (3/8), slug-b (4/8), slug-c (4/8)

## Article : {slug} {(draft) si draft}
**URL** : … · **Pilier** : {primary_tag} · **Score** : 6 / 8
### Réussis
- ✅ meta_title, 52 car.
### À corriger
- ⚠️ Critère 5, liens internes : 2 trouvés (4-6 attendus)
  → Suggestion : …
```

Mono-article : une seule section `## Article`, pas de résumé, ligne `**Score** : N / 8`.

## 5. Vérifications finales (boucle)

Compléter avant de clôturer si un point manque :

- [ ] Rapport écrit à la racine, score sur 8 pour chaque article
- [ ] Chaque critère échoué a une suggestion actionnable
- [ ] Piliers et URLs cités existent
- [ ] Scope cocon : top 3 dans le résumé

Clôture : indiquer le chemin du rapport, demander de corriger d'abord les 3 pires articles (méta, alt : champs SEO de Ghost ; liens, blocs : le draft), puis de relancer l'audit. Cadence : une fois par mois et après chaque lot de 5 articles publiés. Aucun article trouvé : le dire, renvoyer à `blog-article`.
