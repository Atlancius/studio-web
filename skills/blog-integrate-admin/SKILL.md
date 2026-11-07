---
name: blog-integrate-admin
description: "Ajoute à un site Next.js un back-office /cocon/admin protégé par mot de passe (brief, article, image, envoi Ghost en brouillon). Headless uniquement. Déclencheurs : back-office du blog, interface articles."
---

# Back-office du cocon (Next.js 16)

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Question à l'utilisateur : outil `AskUserQuestion` (Claude) ou question dans le chat (Codex). Une question à la fois.

Copie dans le site de l'élève un back-office qui pilote le pipeline P1 brief, P2 article, image hero (fal.ai, optionnel et payant : coût annoncé et accord de l'élève avant d'ajouter `FAL_KEY`), push Ghost **en draft** depuis le navigateur. C'est le pendant graphique de `blog-article` (CLI), qui garde les prompts de référence.

## Pré-requis (vérifier, sinon renvoyer et s'arrêter)

- [ ] `ghost-config.md` existe et indique le scénario C (headless API). Sinon : `blog-setup-ghost`, ou `blog-article` en scénario A ou B (Ghost fournit déjà son admin).
- [ ] `cocon.json` existe avec `mere` et `filles[].petites_filles[]` (sinon `blog-cocon`).
- [ ] `package.json` liste `next` >= 16 et `react` >= 19 ; `app/` (App Router) existe.
- [ ] `lib/ghost.ts` existe (sinon `blog-integrate-headless`) : l'admin y lit les slugs publiés pour la liste blanche de liens.

## Questions

1. Dossier de l'admin : défaut `app/cocon/admin` (URL `/cocon/admin`). Si autre, déplacer `page.tsx`, `AdminClient.tsx`, `styles.css` et adapter les redirections de `page.tsx`.
2. Couleur d'accent hex : défaut `#5C3BFF`.
3. Les clés `ANTHROPIC_API_KEY`, `FAL_KEY` (optionnelle : sans elle, pas d'image), `GHOST_ADMIN_API_KEY` (format `<id>:<secret>`, pas la Content API Key) sont-elles à portée ? Sinon, indiquer où les créer (console Anthropic, fal.ai, Ghost admin > Settings > Integrations).

Mot de passe admin : l'élève le choisit (12 caractères minimum, refusé sinon) ou le génère dans son propre terminal avec `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"` (même commande sur Mac et Windows), et le met **lui-même** dans `.env.local` puis dans Vercel. Ne jamais afficher ni écrire une clé ou un mot de passe.

## Copie

1. Copier `${CLAUDE_SKILL_DIR}/assets/lib/*` dans `lib/` et `${CLAUDE_SKILL_DIR}/assets/app/*` dans `app/`. Si `lib/ghost-admin.ts` ou `lib/fal.ts` existe déjà, demander remplacer ou garder.
2. Remplacer le placeholder `<ACCENT_COLOR>` par l'accent choisi dans `app/cocon/admin/styles.css` et `AdminClient.tsx`.
3. Installer `@anthropic-ai/sdk` et `zod` avec le gestionnaire du projet (lockfile).
4. `.env.example` : ajouter `ANTHROPIC_API_KEY=`, `FAL_KEY=`, `GHOST_ADMIN_API_KEY=`, `COCON_ADMIN_PASSWORD=` (valeurs vides, fichier commité). `GHOST_URL` doit déjà exister (venu de `blog-integrate-headless`).
5. `.gitignore` : ajouter `data/` (briefs et articles générés).
6. Dans `getStaticAllowedUrls()` de `lib/cocon.ts`, ajouter les pages structurelles du site ; remplir `KNOWLEDGE_BASE` (faits vérifiés : prix, versions, chiffres) avant le premier article, sinon le modèle n'a aucun fait autorisé.

Contenu des fichiers (rôle) :

| Fichier | Rôle |
|---|---|
| `lib/cocon.ts` | types, chargement de `cocon.json`, maillage, IDs de modèles, knowledge base, sanitizer |
| `lib/prompts.ts` | prompts P1/P2 et schémas JSON ; à aligner sur `blog-article` |
| `lib/pipeline.ts` | appels Anthropic (sortie JSON par schéma), validation Zod, erreurs publiques génériques |
| `lib/admin-auth.ts` | mot de passe, session signée HMAC 8 h, `requireAdmin()` |
| `lib/cocon-storage.ts` | persistance JSON sous `data/cocon/` |
| `lib/ghost-admin.ts` | JWT Admin API, upsert en draft forcé, upload d'image |
| `lib/fal.ts`, `lib/link-validator.ts` | image hero ; réécriture des liens internes hors liste |
| `app/api/cocon/{brief,article,publish}/route.ts` | routes, chacune commence par `requireAdmin()` |
| `app/cocon/admin/{page.tsx,AdminClient.tsx,styles.css}` | UI ; aperçu dans un iframe sandboxé |

## Garde-fous à ne pas défaire

- Authentification sur la page et sur **chaque** route API (`requireAdmin()`), échec fermé. Usage recommandé : en local uniquement ; en production publique, ne pas laisser l'admin déployée sans nécessité (Vercel Authentication protège tout le déploiement, blog public compris). Aucun secret dans le code ni dans le dépôt, mot de passe comparé en temps constant, routes API refusées sans session valide.
- Entrées validées par Zod, erreurs sans détail interne (détail dans les logs serveur).
- Publication : statut Ghost **toujours** `draft` ; l'article publié est celui stocké côté serveur, jamais un HTML venu du client.
- Clés uniquement en variables d'environnement (`.env.local`, Vercel), jamais dans le code ni dans `.env.example`.
- IDs de modèles dans `lib/cocon.ts` (`MODEL_BRIEF`, `MODEL_ARTICLE`) : vérifier la liste courante sur https://platform.claude.com/docs/en/about-claude/models/overview avant de les changer.

## Variables Vercel

Ajouter les 4 variables (Production, Preview, Development) puis redéployer ; `GHOST_URL` et `GHOST_CONTENT_API_KEY` y sont déjà. Le système de fichiers Vercel est en lecture seule : `data/cocon/` n'est inscriptible qu'en local ou sur un hôte à disque persistant. Usage recommandé : générer en `dev` local, pousser les drafts dans Ghost ; en prod Vercel, remplacer `lib/cocon-storage.ts` par un stockage externe (Vercel Blob, base).

## Validation (boucle : corriger puis relancer)

- [ ] `tsc --noEmit` et le build du site passent.
- [ ] `node "${CLAUDE_SKILL_DIR}/scripts/blog-outils.mjs" http http://localhost:3000/cocon/admin` répond 200 (`${CLAUDE_SKILL_DIR}` = dossier de ce skill, Codex : dossier du SKILL.md) (formulaire de login) ; adapter le port.
- [ ] Sans cookie, `POST /api/cocon/brief` répond 401 (test d'auth obligatoire).
- [ ] Connecté : bouton « Brief seul » sur un article planifié renvoie un brief ; « Générer l'article » affiche l'aperçu ; « Publier en draft » crée le post dans Ghost (lien vers l'éditeur).
- [ ] Variables présentes dans `.env.local` : `grep -c '^NOM=' .env.local` vaut 1 pour chacune (ne jamais afficher la valeur).

## Limites connues

- L'admin ne modifie pas `cocon.json` : après un push, mettre `status: "draft"` sur la petite-fille à la main (ou via `blog-article`) pour que `blog-status` reste juste.
- Le mot de passe unique ne vaut pas une authentification par compte ; pour une équipe, héberger l'admin dans un déploiement séparé protégé par Vercel Authentication.
