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
2. Clé Admin API présente (format `id:secret`), **sans jamais l'afficher** : `printenv GHOST_ADMIN_API_KEY >/dev/null && echo définie || echo absente`. Absente : demander à l'élève de l'exporter lui-même dans son shell (`export GHOST_ADMIN_API_KEY=...`), sans la coller dans le chat ; à défaut, upload manuel (étape 6).
3. Outils : `git`, `zip`, `curl`, `openssl` (`command -v` chacun).
4. Répertoire courant = racine du projet (là où vivent `brief.md`, `charte.md`, `ghost-config.md`).

## 2. Charte

Demander si `charte.md` existe. Elle doit contenir au minimum une palette (primaire, texte, fond) et des fonts (titres, texte), idéalement Google Fonts. Manque l'un des deux : faire compléter, sinon impossible de produire un thème cohérent. Absente : la produire avec `design-pilote` ou `design-branding`, ou proposer un squelette court (couleurs, 2 fonts, rayon, largeur de prose) calé sur le site existant.

## 3. Récupérer Source

Source n'a pas de zip en release : cloner le dernier tag (le dossier `assets/built/` y est déjà compilé, pas de Node à installer).

```bash
TAG=$(git ls-remote --tags --refs --sort=-v:refname https://github.com/TryGhost/Source.git 'v*' | head -1 | sed 's#.*refs/tags/##')
git clone -q --depth 1 --branch "$TAG" https://github.com/TryGhost/Source.git theme && trash theme/.git
ls theme/package.json theme/default.hbs theme/assets/built/screen.css
```

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

Le zip doit avoir `package.json` à sa racine.

```bash
(cd theme && zip -qr ../theme.zip . -x "*.DS_Store" "node_modules/*" "AGENTS.md" "CLAUDE.md" "gulpfile.js" "pnpm-*" ".github/*" "renovate.json")
unzip -l theme.zip | grep -c ' package.json$'   # attendu : 1
npx --yes gscan -z theme.zip                       # zéro erreur exigée
```

Erreurs gscan : corriger, re-zipper, relancer jusqu'à zéro erreur. Avertissements de compatibilité : les lire, ne bloquer que sur erreur.

Upload puis activation via l'Admin API (Claude et Codex : `curl`). Si le serveur MCP Ghost de la session expose un outil d'upload de thème, il convient aussi ; sinon `curl`. URL depuis `ghost-config.md`, clé depuis l'environnement, jamais affichée :

```bash
GHOST_URL="<url sans slash final>"
KEY_ID="${GHOST_ADMIN_API_KEY%%:*}"; KEY_SECRET="${GHOST_ADMIN_API_KEY##*:}"
b64() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
IAT=$(date +%s); EXP=$((IAT + 300))
H=$(printf '{"alg":"HS256","typ":"JWT","kid":"%s"}' "$KEY_ID" | b64)
P=$(printf '{"iat":%s,"exp":%s,"aud":"/admin/"}' "$IAT" "$EXP" | b64)
S=$(printf '%s.%s' "$H" "$P" | openssl dgst -sha256 -mac HMAC -macopt "hexkey:$KEY_SECRET" -binary | b64)
JWT="$H.$P.$S"

curl -sS -X POST "$GHOST_URL/ghost/api/admin/themes/upload/" -H "Authorization: Ghost $JWT" -H "Accept-Version: v5.0" -F "file=@theme.zip"
curl -sS -X PUT  "$GHOST_URL/ghost/api/admin/themes/<name>/activate/" -H "Authorization: Ghost $JWT" -H "Accept-Version: v5.0"
```

`<name>` = `name` du `package.json`. Succès : réponse `{"themes":[{"name":"...","active":true}]}`. Le JWT expire en 5 min : le régénérer si l'upload tarde. Erreur 400 sur `package.json` : wrapper de dossier dans le zip, refaire le zip depuis l'intérieur de `theme/`. Erreur 401 : clé ou URL fausses, passer à `blog-corrige`.

Repli manuel : Ghost Admin > Settings > Design & branding > Change theme > Upload theme (`theme.zip`) > Activate.

## 7. Vérification et clôture

Ouvrir l'URL du blog, la comparer au site principal (typo, couleurs, nav, footer, une page article, une page tag). Écart : ajuster `charte.css`, re-zipper, ré-uploader (Ghost recharge le thème sans redémarrage). Remplir `theme/README.md` en 5 lignes (version de Source cloné, date, adaptations). Clore sur la suite : `blog-cocon`.

Pour itérer plus tard : modifier `charte.css`, relancer l'étape 6. Variantes (mode sombre via `@media (prefers-color-scheme: dark)` sur les variables, page `page-<slug>.hbs`) : voir la référence.
