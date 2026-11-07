---
name: marketing-connect-blog
description: "Identifie la plateforme du blog (Ghost, WordPress, headless, Notion, fichiers), branche son accès, teste la lecture du dernier article et écrit blog.json. Déclencheurs : connecter mon blog, blog.json, lire mes articles."
---

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Questions à l'utilisateur : `AskUserQuestion` (Claude) ou question dans le chat (Codex). Le serveur du blog est décrit comme un service (lecture et brouillon d'articles) quel que soit le nom de ses outils.

# Brancher le blog

Établit une fois où écrire un article et comment lire le dernier publié, pour `marketing-article-reseaux` et la production d'articles. Durée : 5 à 15 min. Installer Ghost lui-même : `blog-setup-ghost`.

## Avant de commencer

Lire `.studio/state.json` et `.studio/cadrage.md` s'ils existent. Si le module blog a déjà été monté par `blog-pilote` (fichier `.studio/blog.json` ou `ghost-config.md`), reprendre son URL et sa plateforme, l'annoncer en une ligne (« ton blog est sur Ghost à <url>, je pars de là ? ») et passer directement à l'étape 2.

## Garde-fous

- Aucune clé API en clair dans un fichier du projet ni dans le chat : elles vivent dans la configuration du client MCP ou un `.env` ignoré par git. `blog.json` ne contient que des URLs publiques et le nom du mode.
- Aucune publication ici : on lit, on configure, on teste.

## Étape 1. Plateforme

Demander, une seule question avec des choix, où vit le blog : `ghost`, `wordpress`, `headless` (CMS + site Next.js/Astro…), `notion`, `autre`, `aucun` (avec « je ne sais pas » : demander l'URL du blog et regarder la page pour deviner, puis faire confirmer).

Si `aucun` : proposer Ghost d'abord (`blog-setup-ghost`, ou tout le parcours `blog-pilote`) ou le mode dégradé `"mode": "fichiers"` (articles en markdown local, publiés à la main), puis passer à l'étape 4.

## Étape 2. Accès

- Ghost : créer une custom integration dans Ghost Admin (écran Integrations) pour obtenir l'Admin API key (écriture) et la Content API key (lecture), puis les placer dans la configuration d'un serveur MCP Ghost. Choisir ce serveur dans le catalogue MCP en lisant sa source ; il n'existe pas de paquet officiel `@tryghost/mcp`. Les clés donnent un accès complet en écriture : ne les coller nulle part ailleurs.
- WordPress : API REST (`https://<domaine>/wp-json/wp/v2`) avec un mot de passe d'application (profil utilisateur). Sans MCP WordPress : `"mode": "rest"`, appels HTTP directs.
- Headless : demander où vit le contenu (le CMS) et comment le site le lit ; on écrit dans le CMS, pas dans le site.
- Notion : vérifier qu'un connecteur Notion est connecté, demander l'URL de la base d'articles.

## Étape 3. Test de lecture (obligatoire)

Lire le dernier article publié et afficher titre, date, URL publique, 200 premiers caractères. En cas d'échec, corriger avant de continuer (causes usuelles : espace parasite dans la clé, `/` final dans l'URL).

## Étape 4. Écrire `blog.json`

À la racine du projet :

```json
{
  "mode": "ghost",
  "url_publique": "https://blog.exemple.com",
  "api": "https://blog.exemple.com/ghost/api/admin",
  "credentials": "configuration MCP (serveur ghost)",
  "dernier_test": "<date du test réussi>",
  "statut_par_defaut": "draft"
}
```

`credentials` dit où sont les clés, jamais leur valeur. `statut_par_defaut` reste `draft`.

## Clôture

Annoncer le mode retenu et le titre du dernier article lu. Suite : `marketing-article-reseaux` (un article vers des posts). Rien ne part en ligne sans relecture.
