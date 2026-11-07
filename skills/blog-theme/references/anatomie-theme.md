# Anatomie d'un thème Ghost

Utile avant d'éditer un `.hbs`. Doc officielle : https://docs.ghost.org/themes

## Structure

```
mon-theme/
├── package.json     manifeste obligatoire (name, version, engines.ghost, config)
├── routes.yaml      routing custom, facultatif : ne pas en créer pour un blog standard
├── default.hbs      layout parent (head, header, {{{body}}}, footer)
├── home.hbs / index.hbs   accueil / liste d'articles
├── post.hbs  page.hbs  tag.hbs  author.hbs
├── partials/        réutilisables ({{> nom}}), Source les range dans components/
└── assets/          css, js, built/ (sortie de gulp, chargée par {{asset}})
```

`package.json` : `engines.ghost` (Source : `>=5.0.0`), `config.posts_per_page`, `config.image_sizes` (tailles pour `size="m"`), `config.custom` (réglages de thème visibles dans Ghost Admin > Design, lus par `@custom.<clé>`).

## Helpers à connaître

- `{{{body}}}` : contenu de la page dans `default.hbs` (triple accolade, pas d'échappement).
- `{{content}}` : HTML d'un post ou d'une page.
- `{{#foreach posts}}...{{/foreach}}` : itération ; `{{@index}}`, `{{@first}}`, `{{@last}}`.
- `{{date published_at format="DD MMMM YYYY"}}` : date (format Moment.js).
- `{{img_url feature_image size="m"}}` : image redimensionnée ; jamais `{{feature_image}}` brut dans une liste.
- `{{> partial}}` : partial. `{{#if}}`, `{{else}}`, `{{#unless}}`, `{{#match}}`, `{{#is "post, page"}}`.
- `{{asset "css/charte.css"}}` : URL d'un asset du thème avec cache-busting.
- `{{ghost_head}}`, `{{ghost_foot}}`, `{{body_class}}` : obligatoires, ne jamais supprimer.
- Globals : `@site.title`, `@site.url`, `@site.logo`, `@site.navigation` (`{{url}}`, `{{label}}`), `@custom.*`.
- Dans `post.hbs` : `title`, `excerpt`, `feature_image`, `primary_tag`, `tags`, `authors`, `published_at`, `reading_time`, `url`.

## Pièges

- `{{ghost_head}}` / `{{ghost_foot}}` / `{{body_class}}` retirés : tracking, code injection, membres et CSS de contexte cassés.
- Zip avec un dossier wrapper : Ghost rejette l'upload.
- Image servie en pleine taille dans un listing : utiliser `img_url` avec `size`.
- Accent et polices choisis dans Ghost Admin : injectés après le CSS du thème, ils l'emportent.

## Variations

- Mode sombre : bloc `@media (prefers-color-scheme: dark)` dans `charte.css` qui redéfinit `--color-primary-text`, `--color-secondary-text` et le fond ; re-zipper, ré-uploader.
- Page dédiée : `page-<slug>.hbs` (détecté par convention de nom), idem `tag-<slug>.hbs`, `author-<slug>.hbs`.
