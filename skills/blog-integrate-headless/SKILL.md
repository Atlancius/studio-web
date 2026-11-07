---
name: blog-integrate-headless
description: "Intègre le blog Ghost dans un site Next.js (App Router) en mode headless : client Content API, pages /blog, sitemap, revalidation par webhook. Déclencheurs : blog dans mon site Next.js, /blog headless."
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Les fichiers à générer sont dans `${CLAUDE_SKILL_DIR}/assets/`. Question à l'utilisateur : Claude `AskUserQuestion`, Codex question dans le chat. Skills voisins : `blog-setup-ghost`, `blog-theme`, `blog-cocon`, `blog-article` (Claude : outil Skill ; Codex : `$nom` ou lecture du `SKILL.md`).

# Blog headless Ghost dans Next.js 16

Génère dans le projet de l'élève le code qui lit la Ghost Content API et rend `<site>/blog` et `<site>/blog/<slug>`. Aucun appel modèle. Scénario C uniquement ; Next.js 16 App Router uniquement (Astro, SvelteKit, Nuxt, Pages Router : non supportés).

Repères : rester sur l'App Router (Server Components par défaut, `fetch` côté serveur, pas de clé dans un composant client) ; chaque page article expose `generateMetadata` (title, description, canonical, Open Graph) et des données structurées `Article` en JSON-LD ; les clés Ghost vivent dans `.env.local` (non commité) et dans les variables du projet Vercel, `.env.example` liste les noms sans valeurs. Pour une API Next.js incertaine, lire la doc embarquée `node_modules/next/dist/docs/` ou la documentation officielle nextjs.org.

## Checklist

- [ ] Pré-requis vérifiés
- [ ] Paramètres demandés (une question à la fois)
- [ ] 7 fichiers écrits (ou sitemap patché)
- [ ] `.env.example` complété
- [ ] Variables posées dans Vercel, redeploy
- [ ] 4 webhooks Ghost créés
- [ ] Test final passé

## 1. Pré-requis

1. `ghost-config.md` existe à la racine du projet et indique le scénario C (headless API). Absent : renvoyer à `blog-setup-ghost`. Scénario A ou B : Ghost rend lui-même le blog, arrêter et renvoyer à `blog-theme`.
2. Lire dans `ghost-config.md` l'URL de l'instance Ghost (backend, sans slash final) = `<GHOST_URL>`. Introuvable : la demander.
3. Le projet est un Next.js 16 : `package.json` (dépendance `next`) et dossier `app/` présents dans `<PROJECT_ROOT>` (défaut `.`). Dossier `pages/` ou autre framework : arrêter, ne rien générer (le code serait à réécrire), expliquer qu'il faut migrer vers l'App Router ou adapter à la main.

## 2. Paramètres

Demander, une question à la fois : couleur d'accent `<ACCENT_COLOR>` (défaut `#7C4DFF`), police du corps `<FONT_FAMILY>` (défaut `system-ui, sans-serif`). Le design est une base neutre à personnaliser ensuite dans les deux CSS.

## 3. Génération

Copier depuis `assets/` vers `<PROJECT_ROOT>`, même chemin relatif. Annoncer chaque fichier, confirmer après écriture. Fichier déjà présent : demander remplacer ou ignorer.

| Fichier | Rôle |
|---|---|
| `lib/ghost.ts` | client Content API en lecture, cache tag `blog`, repli ISR 1 h |
| `app/blog/page.tsx` | liste, JSON-LD `ItemList` |
| `app/blog/[slug]/page.tsx` | article, metadata, JSON-LD `BlogPosting` + `BreadcrumbList` |
| `app/blog/styles.css`, `app/blog/list-styles.css` | styles : remplacer `<ACCENT_COLOR>` et `<FONT_FAMILY>` |
| `app/sitemap.ts` | sitemap statique + articles Ghost |
| `app/api/revalidate-blog/route.ts` | revalidation déclenchée par webhook |

- `params` est une `Promise` à `await` en Next 16 : ne jamais le retirer.
- `app/sitemap.ts` existe déjà : ne pas l'écraser. Montrer le fichier, proposer le patch (fonction `async`, import de `getAllPosts`, `blogEntries` mappés `{ url, lastModified: new Date(p.updated_at) }`, `export const revalidate = 3600`), l'appliquer sur accord. Pas de `priority` ni `changeFrequency`, pas de `lastModified: new Date()` au build (une date fixe au build ferait croire à Google que tout change à chaque déploiement).
- Images : `unoptimized` évite de configurer `remotePatterns`. Beaucoup d'images : déclarer `images.remotePatterns` pour le domaine Ghost et retirer `unoptimized`. Image LCP : `loading="eager"` (`priority` est déprécié en Next 16).
- JSON-LD : `<` échappé en `\u003c` (déjà fait dans les pages).
- Pages pilier (`/blog/pilier/<slug>`, données de `cocon.json`) et table des matières : hors scaffold, à ajouter à la main.

## 4. Variables d'environnement

Ajouter à `.env.example` (valeurs vides ou factices, jamais de vraie valeur : ce fichier est commité) :

```dotenv
GHOST_URL=https://<ton-instance>.pikapod.net
GHOST_CONTENT_API_KEY=
REVALIDATE_SECRET=
NEXT_PUBLIC_SITE_URL=https://<ton-site>.vercel.app
```

- `GHOST_CONTENT_API_KEY` : clé Content API (lecture seule, publique) de l'intégration Ghost.
- `REVALIDATE_SECRET` : l'élève le génère dans son propre terminal avec `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` (même commande sur Mac et Windows), jamais affiché dans le chat ni commité.
- Vraies valeurs : `.env.local` (ignoré par git) et Vercel → Settings → Environment Variables (Production, Preview, Development), puis redeploy. Attendre la confirmation de l'utilisateur.

## 5. Webhooks Ghost

Ghost admin → Settings → Integrations → l'intégration créée par `blog-setup-ghost` → Add webhook, un webhook par événement, cible `https://<site>/api/revalidate-blog?token=<REVALIDATE_SECRET>` :

- `post.published`
- `post.published.edited` (libellé admin : article publié modifié)
- `post.unpublished`
- `post.deleted`

Ghost ne permet pas d'en-tête personnalisé : le secret passe en paramètre d'URL, la route le compare en temps constant. Ne jamais le coller dans un message, un log ou un dépôt. Attendre la confirmation.

## 6. Validation (boucle)

Un point qui échoue : retourner à l'étape concernée, recommencer.

1. `node "${CLAUDE_SKILL_DIR}/scripts/blog-outils.mjs" http <SITE_URL>/blog` renvoie `HTTP 200` (`${CLAUDE_SKILL_DIR}` = dossier de ce skill, Codex : dossier du SKILL.md) ; la page affiche les articles (ou « Aucun article publié » si Ghost est vide).
2. `node "${CLAUDE_SKILL_DIR}/scripts/blog-outils.mjs" compte <SITE_URL>/sitemap.xml "<loc>"` donne plus de 0 occurrences, et contient les `/blog/<slug>`.
3. Un article s'ouvre avec le style attendu.
4. Éditer un article dans Ghost : les logs Vercel de `revalidate-blog` montrent un `200`.

Clôture : suggérer `blog-cocon` si pas de cocon, sinon `blog-article`.
