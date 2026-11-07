---
name: blog-setup-ghost
description: "Installe Ghost sur PikaPods (URL PikaPods, sous-domaine ou headless), crée les clés API, branche le service Ghost et écrit ghost-config.md. Déclencheurs : installer le blog, setup Ghost, PikaPods, clés Ghost."
---

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Questions à la personne : outil `AskUserQuestion` (Claude) ou message dans le chat (Codex). Le serveur MCP Ghost est décrit comme un service (outils d'administration et de lecture de posts Ghost), quel que soit le nom de ses outils.

# Installation de Ghost (PikaPods)

Objectif : un blog Ghost accessible, un accès API pour l'agent, et `ghost-config.md` sans secret à la racine du projet. Tutoiement, **une question à la fois**, attendre la réponse avant la suivante. Détails de procédure : `references/procedure.md` ; modèle du fichier final : `references/ghost-config-template.md`.

## Règles non négociables

- **Aucune clé Ghost** (Admin ou Content) dans le chat, dans git, dans `ghost-config.md` ou dans un fichier versionné. Elles vont seulement dans la configuration du service MCP (ou dans les variables d'environnement du projet pour le scénario C). Ne jamais demander à la personne de les coller dans la conversation. La personne tape elle-même ses clés dans la configuration ou le terminal.
- **Pas de sous-chemin `<site>/blog` par réécriture (rewrite) Vercel vers PikaPods** : le modèle Ghost de PikaPods n'expose pas la variable `url` de niveau supérieur, Ghost générerait donc des liens canoniques, un sitemap et des liens de thème pointant vers son URL native. Ne jamais proposer cette option. Pour `<site>/blog` proprement : scénario C.

## Pré-requis (valider avant tout, sinon pause)

- [ ] Un site déployé sur Vercel (`<SITE_URL>`, URL `vercel.app` acceptée). Sinon : terminer d'abord le site avec `site-pilote` jusqu'au déploiement (ou, en scénario A, continuer sans site si la personne veut seulement un blog), puis revenir.
- [ ] Techno du site : **A** HTML/CSS/JS pur, ou **B** framework avec rendu serveur ou statique (Next.js, Astro, SvelteKit, Nuxt, Remix). Voir `package.json`, `next.config.*`, `astro.config.*` si la personne hésite.

## Choix du scénario

Si `.studio/blog.json` contient déjà `scenario` (choisi dans `blog-pilote`), le reprendre en une ligne et demander confirmation au lieu de reposer la question. Domaine et stack connus dans `.studio/state.json` (`existant`) : ne pas les redemander.

| Scénario | URL publique du blog | Disponible si | Coût / effort |
|---|---|---|---|
| **A** URL PikaPods | `https://<pod>.pikapod.net` | A ou B | aucun DNS, immédiat (recommandé sans domaine) |
| **B** Sous-domaine | `https://blog.<domaine>` | A ou B, domaine possédé | un CNAME chez le registrar, propagation DNS |
| **C** Headless API | `<SITE_URL>/blog`, rendu par le framework | B uniquement | du code côté framework, scaffold via `blog-integrate-headless` (Next.js) |

Recommande A sans domaine, B avec domaine et sans envie de toucher au code, C pour un framework supporté. Pour B, proposer `blog.<domaine>` par défaut. Pour C, Ghost reste à l'URL PikaPods (`<GHOST_BACKEND_URL>`, jamais visible des visiteurs) et le thème Ghost est inutile : sauter `blog-theme`.

## Étapes

Copie cette checklist et coche :

- [ ] 1. Compte PikaPods
- [ ] 2. Lancer le pod Ghost
- [ ] 3. Sous-domaine (scénario B seulement)
- [ ] 4. Compte admin Ghost et réglages de base
- [ ] 5. Custom integration (clés API)
- [ ] 6. Brancher le service MCP Ghost et tester
- [ ] 7. Mode privé (optionnel)
- [ ] 8. Écrire `ghost-config.md` et contrôler

Pour chaque étape, suivre `references/procedure.md`. Points d'attention :

- Étape 2 : relever l'URL technique du pod (`<PIKAPOD_URL>`). Taille et région : voir la procédure ; les prix et crédits changent, ne rien promettre de chiffré.
- Étape 3 : après le CNAME, vérifier avec `dig +short <SUBDOMAIN>`, puis ajouter le domaine dans le pod. En cas d'erreur SSL, attendre puis revérifier le CNAME avant de recommencer.
- Étape 5 : la personne crée l'intégration dans l'admin Ghost (Settings, Integrations, Add custom integration) et garde les clés pour l'étape 6, sans les coller dans le chat.
- Étape 6 : le service MCP Ghost demande l'URL de l'instance, la clé Admin et la clé Content. Test : lister les 5 derniers posts (les articles de démo Ghost doivent apparaître). Erreur 401 : régénérer les clés dans l'admin Ghost. Si aucun service MCP Ghost n'est disponible, dire qu'il faut en installer un compatible Admin API et Content API (la personne choisit et installe), ne pas inventer de commande d'installation.
- Étape 7 : proposer le mode privé tant que le blog est vide (évite d'indexer les articles de démo) et rappeler de le désactiver dès le premier vrai article publié, sinon Google ne peut pas indexer.

## Vérification finale (boucle : revenir à l'étape fautive tant qu'un point échoue)

- [ ] `<BLOG_URL>` répond (écran Ghost, ou page protégée si mode privé)
- [ ] Compte admin créé, titre, description, fuseau `Europe/Paris`, langue `fr` réglés
- [ ] Clés Admin et Content générées, stockées uniquement dans la config du service
- [ ] Le service Ghost répond et liste des posts
- [ ] Scénario B : `dig +short <SUBDOMAIN>` renvoie l'URL du pod et le domaine est validé côté PikaPods
- [ ] `ghost-config.md` écrit, sans aucun secret

## Clôture

Récapituler l'URL du blog, le scénario et l'état du mode privé, puis orienter :

- Scénarios A et B : `blog-theme` (thème Ghost à la charte).
- Scénario C : `blog-integrate-headless` (obligatoire), puis production d'articles avec `blog-article` (terminal) et/ou `blog-integrate-admin` (interface navigateur) ; les deux partagent `cocon.json` et gardent Ghost en `draft`.
- Parcours complet orchestré : `blog-pilote`.
