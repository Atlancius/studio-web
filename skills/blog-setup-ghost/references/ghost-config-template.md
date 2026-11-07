# Modèle de ghost-config.md

Écrire à la racine du projet, remplacer les `<...>`, supprimer les lignes d'un scénario non choisi. **Aucun secret.** Ce fichier est lu par les autres skills `blog-*` ; ne pas renommer les rubriques.

```markdown
# Ghost, configuration

Date de mise en place : <YYYY-MM-DD>

## Site hôte

- Techno : <HTML/CSS/JS pur | Next.js | Astro | SvelteKit | Nuxt | Remix>
- Site (Vercel) : <SITE_URL>

## Hébergement du blog

- Scénario : <A URL PikaPods | B sous-domaine | C headless API>
- URL publique du blog : <BLOG_URL>
- Admin Ghost : <BLOG_URL ou GHOST_BACKEND_URL>/ghost
- Instance PikaPods : <PIKAPOD_URL>
- Mode privé : <oui | non>

## API

- Admin API Key : stockée dans la configuration du service MCP (pas ici)
- Content API Key : idem
- Service MCP Ghost : installé et testé (liste de posts OK)

## Lien depuis le site

<a href="<BLOG_URL>" target="_blank" rel="noopener">Blog</a>

## Scénario C uniquement

- Backend Ghost (jamais visible) : <GHOST_BACKEND_URL>
- Pages publiques : <SITE_URL>/blog et <SITE_URL>/blog/<slug>
- Mise en place du code : skill blog-integrate-headless
- Revalidation : webhook Ghost vers le site (à configurer)
- Thème Ghost : non utilisé
```
