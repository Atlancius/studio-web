---
name: blog-theme
description: "Habille le blog Ghost aux couleurs du site : fork du thème Source, charte en CSS, zip, upload et activation. Inutile en headless. Déclencheurs : thème du blog, blog aux couleurs du site."
---

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Question à l'élève : `AskUserQuestion` (Claude) ou question dans le chat (Codex).

# Thème Ghost custom depuis la charte

Fait ressembler `blog.exemple.com` à `exemple.com` (typo, palette, nav, footer). Stratégie fixe : **forker le thème officiel Source** (TryGhost, MIT), surcharger ses variables CSS avec la charte, adapter header et footer, zipper, uploader. Jamais de thème écrit from scratch.

**Scénario C (blog headless dans le site Next.js)** : Ghost ne rend aucune page publique, ce skill ne sert à rien. Le dire et passer à `blog-integrate-headless`.

Tutoiement, une question à la fois. Anatomie d'un thème, helpers Handlebars, pièges : lire [references/anatomie-theme.md](references/anatomie-theme.md) avant d'éditer un `.hbs`.

## Checklist

- [ ] Pré-requis vérifiés
- [ ] `charte.md` lue (palette, fonts)
- [ ] Source cloné, `package.json` adapté
- [ ] `assets/css/charte.css` écrit et chargé
- [ ] `default.hbs`, nav, footer adaptés
- [ ] `gscan` sans erreur
- [ ] `theme.zip` uploadé puis activé
- [ ] Rendu du blog comparé au site

## 1. Pré-requis

1. `ghost-config.md` existe à la racine (URL du blog). Sinon : stopper, lancer `blog-setup-ghost`.
2. Outils et variables, sans jamais afficher la clé : `node "${CLAUDE_SKILL_DIR}/scripts/ghost-theme.mjs" check` (vérifie Node 20+, git, `GHOST_URL` et `GHOST_ADMIN_API_KEY` ; affiche seulement OK ou absent). `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Toutes les commandes de ce skill passent par ce script Node : elles sont identiques sur Mac, Linux et Windows (PowerShell ou Git Bash).
3. Variables absentes : l'élève quitte l'agent, définit les variables lui-même dans son terminal, sans coller la clé dans le chat, puis relance l'agent (`claude` ou `codex`) depuis ce même terminal pour qu'il en hérite (clé Admin au format `id:secret`, voir `ghost-config.md` pour l'URL) :
   - Mac / Linux / Git Bash : `export GHOST_URL="https://mon-blog.exemple.com"` puis `export GHOST_ADMIN_API_KEY="id:secret"`
   - Windows PowerShell : `$env:GHOST_URL = "https://mon-blog.exemple.com"` puis `$env:GHOST_ADMIN_API_KEY = "id:secret"`
   Ces variables ne durent que le temps du terminal. À défaut, upload manuel (étape 6).
4. Répertoire courant = racine du projet (là où vivent `brief.md`, `charte.md`, `ghost-config.md`).

## 2. Charte

Demander si `charte.md` existe. Elle doit contenir au minimum une palette (primaire, texte, fond) et des fonts (titres, texte), idéalement Google Fonts. Manque l'un des deux : faire compléter, sinon impossible de produire un thème cohérent. Absente : la produire avec `design-pilote` ou `design-branding`, ou proposer un squelette court (couleurs, 2 fonts, rayon, largeur de prose) calé sur le site existant.

## 3. Récupérer Source

Source n'a pas de zip en release : cloner le dernier tag (le dossier `assets/built/` y est déjà compilé, pas de Node à installer).

```bash
node "${CLAUDE_SKILL_DIR}/scripts/ghost-theme.mjs" fetch-source theme
```

Le script trouve le dernier tag `v*` de TryGhost/Source, le clone dans `theme/`, retire le dossier `.git` du clone et vérifie la présence de `package.json`, `default.hbs` et `assets/built/screen.css`.

Réseau bloqué : demander à l'élève de télécharger le code source de la dernière release sur https://github.com/TryGhost/Source/releases et de l'extraire dans `theme/` (`package.json` à la racine de `theme/`).

Adapter `theme/package.json` : `name` (slug kebab-case demandé à l'élève, ex. `monsite-blog`), `description`, et `config.custom.site_background_color.default` = fond de la charte. Garder `engines`, `config.image_sizes` et le reste.

## 4. Charte en CSS

Ne pas toucher `assets/built/` ni éditer `assets/css/screen.css` (source compilée par gulp, qui demande Node et pnpm). Créer `theme/assets/css/charte.css`, chargé **après** la feuille de Source :

```css
:root {
  --color-primary-text: <texte>;
  --color-secondary-text: <texte atténué>;
  --gh-font-heading: <font titres>;
  --gh-font-body: <font texte>;
  --font-mono: <font code>;
}
```

Variables réellement lues par Source : `--color-primary-text`, `--color-secondary-text`, `--color-border`, `--background-color` (réglée par le réglage de thème `site_background_color`), `--gh-font-heading`, `--gh-font-body`, `--font-sans`, `--font-serif`, `--font-mono`, `--ghost-accent-color`. En cas de doute, lire le bloc `:root` de `theme/assets/css/screen.css`. Ne pas inventer d'autres noms.

- **Couleur d'accent** (`--ghost-accent-color`) : injectée par `{{ghost_head}}`, donc non surchargeable ici. La demander à l'élève : Ghost Admin > Settings > Design & branding > Brand > Accent color.
- **Polices** : ne pas les choisir dans Admin (`--gh-font-*` injectées l'emporteraient sur `charte.css`). Charger la font Google dans `default.hbs` ; le titre et le texte de Source utilisent déjà ces variables.
- Pour une règle ciblée (largeur de prose, rayon), lire d'abord la classe réelle dans `post.hbs` ou `partials/` puis l'ajouter dans `charte.css`. Jamais supprimer une règle de Source.

## 5. Templates

Dans `theme/default.hbs` :

1. Ajouter, juste après `<link rel="stylesheet" ... built/screen.css>` : `<link rel="stylesheet" type="text/css" href="{{asset "css/charte.css"}}">`.
2. Font Google : `<link rel="preconnect" ...>` + `<link href="https://fonts.googleapis.com/css2?family=<Font>&display=swap" rel="stylesheet">` avant `{{ghost_head}}`.
3. Vérifier la présence de `{{ghost_head}}` (dernier tag de `<head>`), `{{body_class}}` sur `<body>`, `{{{body}}}`, `{{ghost_foot}}` avant `</body>`. Les conserver, sinon analytics, code injection et membres cassent.

Navigation et footer : Source les isole dans `partials/components/navigation.hbs` et `partials/components/footer.hbs`. Demander en une question : nav dynamique (`@site.navigation`, réglée dans Ghost Admin > Settings > Navigation, par défaut) ou liens du site existant (`Label → /url`, à écrire en dur). Même choix pour le footer. Garder les helpers et partials non concernés. `tag.hbs`, `page.hbs`, `index.hbs`, `post.hbs` : ne pas toucher en première itération.

## 6. Zip, validation, upload, activation

Le zip doit avoir `package.json` à sa racine (le script refuse sinon).

```bash
node "${CLAUDE_SKILL_DIR}/scripts/ghost-theme.mjs" zip theme theme.zip
npx --yes gscan -z theme.zip
```

Le zip exclut `.DS_Store`, `node_modules`, `AGENTS.md`, `CLAUDE.md`, `gulpfile.js`, `pnpm-*`, `.github`, `renovate.json`.

gscan : la version de Source téléchargée peut déjà remonter des erreurs avec la dernière version de gscan (constaté le 2026-11-07 avec Source v1.7.6 : 6 erreurs sur Source non modifié). Pour savoir ce qui vient de tes changements, lancer aussi gscan sur un Source non modifié (`node "${CLAUDE_SKILL_DIR}/scripts/ghost-theme.mjs" fetch-source source-ref`, puis zip et gscan) et comparer : toute erreur nouvelle par rapport à cette référence est à corriger, re-zipper, relancer. Avertissements : les lire, ne bloquer que sur erreur nouvelle. Si Ghost refuse l'upload à cause d'erreurs déjà présentes dans Source, le dire à l'élève et passer au repli manuel ou à une version plus ancienne de Source.

Upload puis activation via l'Admin API. Si le serveur MCP Ghost de la session expose un outil d'upload de thème, il convient aussi ; sinon le script (clé lue dans l'environnement, jamais affichée, JWT de 5 minutes régénéré à chaque appel) :

```bash
node "${CLAUDE_SKILL_DIR}/scripts/ghost-theme.mjs" upload theme.zip
node "${CLAUDE_SKILL_DIR}/scripts/ghost-theme.mjs" activate <name>
```

`<name>` = `name` du `package.json`. Succès : réponse `{"themes":[{"name":"...","active":true}]}`. Erreur 400 sur `package.json` : le zip a été fait depuis le mauvais dossier, relancer `zip theme theme.zip`. Erreur 401 : clé ou URL fausses, passer à `blog-corrige`.

Repli manuel : Ghost Admin > Settings > Design & branding > Change theme > Upload theme (`theme.zip`) > Activate.

## 7. Vérification et clôture

Ouvrir l'URL du blog, la comparer au site principal (typo, couleurs, nav, footer, une page article, une page tag). Écart : ajuster `charte.css`, re-zipper, ré-uploader (Ghost recharge le thème sans redémarrage). Remplir `theme/README.md` en 5 lignes (version de Source cloné, date, adaptations). Clore sur la suite : `blog-cocon`.

Pour itérer plus tard : modifier `charte.css`, relancer l'étape 6. Variantes (mode sombre via `@media (prefers-color-scheme: dark)` sur les variables, page `page-<slug>.hbs`) : voir la référence.
