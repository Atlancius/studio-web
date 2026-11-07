---
name: marketing-connect-buffer
description: "Branche Buffer (planification de posts) via son serveur MCP officiel, vérifie organisation, fuseau, canaux, file et limites du plan, écrit buffer.json en lecture seule. Déclencheurs : connecter Buffer, buffer.json, erreur MCP Buffer."
---

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Questions à l'utilisateur : `AskUserQuestion` (Claude) ou question dans le chat (Codex). Buffer est décrit comme un service MCP (lecture de canaux et de file, création de posts) quel que soit le nom de ses outils.

# Brancher Buffer

Prérequis de `marketing-article-reseaux`. Si `.studio/state.json` existe, lire `modules.marketing` et les réseaux déjà choisis dans `.studio/cadrage.md` ou `.studio/marketing/reseaux.json` : ne connecter que ceux-là, sans redemander. Durée : environ 10 min, surtout côté navigateur.

## Garde-fous

- Aucun post créé ici : configuration et tests en lecture seule. La création passe par `marketing-article-reseaux`, toujours en brouillon.
- Un `channelId` ne se devine jamais : il vient de la liste des canaux du service.
- Aucune clé API dans un fichier du projet ni dans le chat.

## Étape 1. Compte et réseaux

- Compte Buffer existant ? Sinon buffer.com, offre Free (l'élève crée le compte lui-même ; `comptes` liste tous les comptes du parcours).
- Dans Buffer : Channels, puis Connect a channel, autorisation côté réseau. Aider au choix selon le persona du cadrage (`.studio/state.json`) ou le panel (`marketing-panel-audit`) : peu de réseaux bien tenus valent mieux que beaucoup d'absents.
- Instagram exige un compte professionnel (Business ou Creator) pour la publication automatique ; un compte personnel ne peut que recevoir une notification. Conditions TikTok : voir l'aide Buffer.

## Étape 2. Le serveur MCP

URL du serveur : `https://mcp.buffer.com/mcp`.

- Claude Code : `claude mcp add --transport http buffer https://mcp.buffer.com/mcp`, puis `/mcp`, choisir buffer et autoriser dans le navigateur (OAuth, aucune clé à copier).
- Claude web ou desktop : Customize, Connectors, connecteur Buffer, Connect.
- Autre client MCP (Codex inclus) : serveur HTTP à cette URL avec l'en-tête `Authorization: Bearer <clé API>`, clé créée dans les réglages API de Buffer et stockée dans la configuration du client (variable d'environnement), jamais dans le projet.

## Étape 3. Vérifier (lecture seule, dans cet ordre)

1. Compte : l'outil de compte retourne les organisations (avec leurs limites de plan), le fuseau horaire et l'heure locale courante. Plusieurs organisations : demander laquelle, ne pas choisir seul.
2. Canaux : lister les canaux de l'organisation retenue (nom, service, identifiant).
3. File : compter les posts en attente par canal et comparer aux limites de plan retournées à l'étape 1 (le plan Free plafonne canaux et posts en file ; ne pas figer de chiffre, lire le compte).

Afficher un état lisible : organisation, fuseau, canaux avec file, places libres.

## Étape 4. Écrire `buffer.json`

À la racine du projet :

```json
{
  "organisation": "<nom>",
  "fuseau": "Europe/Paris",
  "canaux": [{ "service": "linkedin", "nom": "<compte>", "channelId": "<24 hex>" }],
  "plan": "free",
  "mode_publication": "draft",
  "dernier_test": "<date>"
}
```

Les `channelId` ne sont pas des secrets. `mode_publication` reste `draft`.

## Dépannage

| Symptôme | Action |
|---|---|
| authentification échouée | `/mcp` puis se reconnecter à Buffer (ou clé API invalide) |
| canal non autorisé | accès refusé côté réseau : reprendre l'étape 1 |
| MCP introuvable | revérifier la commande d'ajout, relancer le client |
| le post ne part pas | date future obligatoire, canal bien connecté |
| trop de posts programmés | limite de file du plan : attendre une publication ou espacer |
| X refuse le mode rappel | demander une planification automatique (le mode notification ne vaut que sur certains réseaux) |
| Instagram refuse | image obligatoire et compte professionnel (Business ou Creator) |
| erreur 429 | limite de requêtes (fenêtres de 15 min, 24 h, 30 jours) : attendre le délai indiqué |

## Clôture

Annoncer : N canaux branchés, M places libres. Suite : `marketing-article-reseaux`. Tout arrive en brouillon, l'utilisateur relit et approuve.
