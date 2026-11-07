---
name: blog-corrige
description: "Diagnostique et répare les pannes du blog (service Ghost muet, thème refusé, cocon.json cassé, article ou image en échec, lot interrompu, erreur 422), sinon écrit un rapport. Déclencheurs : blog cassé, ça plante."
---

# SAV du blog Ghost

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Question à l'élève : `AskUserQuestion` (Claude) ou question dans le chat (Codex).

Objectif : identifier la zone, dérouler un diagnostic ciblé **une question à la fois**, proposer un fix concret, vérifier. Tutoiement, pas de jargon, pas de blabla.

**Règle secrets** : ne jamais afficher la valeur d'une clé (`GHOST_ADMIN_API_KEY`, `FAL_KEY`, `ANTHROPIC_API_KEY`) ni la coller dans `bug-*.md`. Tester la présence seulement :

```bash
for v in GHOST_URL GHOST_ADMIN_API_KEY FAL_KEY ANTHROPIC_API_KEY; do printenv "$v" >/dev/null && echo "$v : définie" || echo "$v : absente"; done
```

(Pour un site Next.js, les variables vivent dans `.env.local` : `grep -c '^NOM=' .env.local` vaut 1 si présente.)

## 1. Zone du problème

Demande laquelle :

1. Setup Ghost (instance inaccessible, sous-domaine 404, MCP muet) 
2. Thème (rendu cassé, non activé, ZIP rejeté)
3. Cocon (`cocon.json` absent ou corrompu)
4. Article (brief vide, image absente, upload Ghost en erreur)
5. Batch (interrompu, statuts incohérents)
6. Autre (à décrire : 2-3 questions, fix au cas par cas)

## 2. Diagnostic par zone

### 1. Setup Ghost

1. L'URL répond-elle ? `curl -I https://<ton-blog>` : on veut 200 ou 301 ; `connection refused` : instance endormie ou arrêtée.
2. DNS du sous-domaine propagé ? `dig <sous-domaine> +short` doit renvoyer une IP (5-10 min, jusqu'à 24 h).
3. HTTPS valide ? `SSL certificate problem` : le certificat Let's Encrypt n'est pas encore émis, attendre 1 à 3 min.
4. MCP Ghost listé ? `claude mcp list` (Claude Code) ou `codex mcp list` (Codex) : une ligne `ghost`. Absente : serveur non installé, ou session à redémarrer.
5. Clés bien recopiées ? Admin API : `<id>:<secret>` sans espace ; Content API : hex de 26 caractères. Ghost admin > Settings > Integrations.

Fixes : redémarrer la session (règle le MCP muet le plus souvent) ; retester après 2 min ; recopier les clés ; vérifier `GHOST_API_URL` / `GHOST_ADMIN_API_KEY` dans la config MCP. Procédure complète de mise en place : `blog-setup-ghost`.

### 2. Thème

1. ZIP présent et non vide ? `ls -lh theme.zip` (au moins quelques Ko). Absent : `blog-theme` a planté avant la fin.
2. Message de rejet Ghost : `missing default.hbs` (squelette manquant), `package.json is invalid` (JSON cassé), `unsupported features` (helpers trop récents pour la version de Ghost).
3. `package.json` valide ? `jq empty theme/package.json`.
4. Thème **activé** ? L'upload ne suffit pas : Settings > Design > Change theme > Activate.
5. Rendu cassé sur certaines pages seulement : cibler le `.hbs` (`post.hbs`, `index.hbs`, `tag.hbs`).

Fixes : régénérer le thème avec `blog-theme` ; valider avec gscan : `npm install -g gscan` puis `gscan theme.zip -z` (README : https://github.com/TryGhost/gscan) ; vider le cache navigateur (Cmd/Ctrl+Maj+R) ; en dernier recours, repasser sur Casper, vérifier le contenu, réactiver le thème custom.

### 3. Cocon

1. `brief.md` présent ? Sinon `blog-cocon` s'arrête dès le départ.
2. `cocon.json` valide ? `jq empty cocon.json`. `parse error` : virgule en trop, caractère orphelin ou non échappé.
3. Dernière version saine ? `git log --oneline cocon.json`.

Fixes : `cp cocon.json cocon.json.bak && git checkout HEAD~1 -- cocon.json` (écrase la copie locale, d'où la sauvegarde) puis `jq empty cocon.json` ; sans version saine, relancer `blog-cocon` (repart d'un fichier propre, avancement perdu). Schéma attendu : `references/cocon-schema.md` du skill `blog-cocon`.

### 4. Article

Pipeline : brief P1, article P2, image (outil choisi au cadrage ; `FAL_KEY` seulement si fal.ai a été choisi), upload Ghost.

1. Clés présentes ? Voir la commande de présence ci-dessus (`ANTHROPIC_API_KEY` pour P1/P2, `FAL_KEY` pour l'image, Ghost pour l'upload).
2. Article tronqué ? `stop_reason` vaut `max_tokens` au lieu de `end_turn` : augmenter `max_tokens` ou viser un article plus court.
3. Image absente ? `FAL_KEY` ok mais pas d'image : fal.ai surchargé ; l'article doit partir **sans** `feature_image` (mode dégradé), l'image s'ajoute ensuite dans Ghost admin.
4. Erreur Ghost 422 : `custom_excerpt` > 300 caractères (tronquer) ; `slug` déjà pris (suffixe ou supprimer l'ancien post) ; tags invalides (chaîne ou objet `{name}`) ; `feature_image` pointant vers une URL inaccessible (utiliser l'upload Ghost).

Fixes : relancer `blog-article` sur la même petite-fille (elle propose de régénérer le post existant sans doublon) ; pour un 422, relever le payload envoyé et le message : il désigne le champ fautif.

### 5. Batch

1. Combien de publiés / restants ? 
   ```bash
   jq '[.filles[].petites_filles[] | select(.status=="published")] | length' cocon.json
   jq '[.filles[].petites_filles[] | select(.status!="published")] | length' cocon.json
   ```
2. Quels articles sont réellement dans Ghost ? Vérifier les 2-3 derniers dans `<blog>/ghost/`.
3. Quel article a planté ? Le dernier `draft` ou `planned` touché dans `cocon.json`.

Fixes : **ne pas relancer le même `blog-batch`** (chaque appel crée un post, doublons) ; lancer d'abord `blog-status` ; reprendre avec `blog-article` article par article ; si `cocon.json` diverge de Ghost (publié mais `draft` dans le JSON, ou l'inverse), corriger le JSON à la main d'après Ghost, puis reprendre.

## 3. Si rien ne marche

Écris `bug-{AAAA-MM-JJ-HHmm}.md` à la racine avec le modèle de `references/bug-report.md` (description, zone, étapes tentées, sorties brutes des commandes, versions, contexte), sans aucune valeur secrète. Dis alors : « J'ai généré `bug-{date}.md`. Envoie-le à ton formateur (ou colle-le dans une nouvelle conversation) pour obtenir de l'aide. »

## Vérifications avant de clore

- [ ] Zone identifiée
- [ ] Au moins un fix proposé et son résultat vérifié (commande relancée, page rechargée)
- [ ] Si bloqué après plusieurs essais : `bug-{date}.md` écrit
