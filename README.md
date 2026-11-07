# Studio Web

Pack de skills pour créer ton site de A à Z avec un agent IA (Claude Code ou Codex) : cadrage, comptes, design, site, formulaire, blog, réseaux sociaux, SEO et mesure d'audience. L'agent te pose des questions une à une, te propose des choix et ne lance que les modules dont tu as besoin.

Auteur : Jeff Martini. Licence : voir `LICENSE` (usage personnel et pour tes clients, pas de redistribution, ne partage pas l'accès au dépôt).

## Installer

Le dépôt est privé : il faut d'abord que Jeff t'ait invité sur GitHub.

1. Donne ton pseudo GitHub à Jeff (crée un compte gratuit sur https://github.com/signup si besoin).
2. Accepte l'invitation reçue par e-mail, ou sur https://github.com/Atlancius/studio-web/invitations
3. Connecte ton ordinateur à GitHub une fois pour toutes (installe GitHub CLI : https://cli.github.com) :

```bash
gh auth login
```

Choisis GitHub.com, HTTPS, « Login with a web browser », et réponds oui pour configurer Git.

### Claude Code

Dans Claude Code, tape ces deux commandes :

```
/plugin marketplace add Atlancius/studio-web
/plugin install studio-web@studio-web
```

Puis redémarre Claude Code. Les skills apparaissent sous la forme `studio-web:demarrer`, `studio-web:site-pilote`, etc.

Mettre à jour plus tard : `/plugin marketplace update studio-web`.

### Codex

```bash
gh repo clone Atlancius/studio-web ~/outils/studio-web && bash ~/outils/studio-web/scripts/installer-codex.sh
```

Relance Codex : les skills s'appellent avec `$demarrer`, `$site-pilote`, etc. Mettre à jour plus tard : `cd ~/outils/studio-web && git pull && bash scripts/installer-codex.sh`.

## Démarrer

1. Crée un dossier vide pour ton projet et ouvre l'agent dedans.
2. Écris : « Démarre mon projet de site » (ou lance `demarrer`).
3. Réponds aux questions. À la fin du cadrage, l'agent t'affiche les modules retenus et la liste des comptes à créer.

Tu peux t'arrêter à tout moment en disant « pause » : tout est sauvegardé dans le dossier `.studio/` du projet. Pour reprendre, relance `demarrer`.

## Ce que fait le pack

```
demarrer ── cadrage (situation, utilité, persona, attentes, forme, blog, réseaux, design, analytics)
   │
   ├── comptes ─────────── seulement les comptes utiles, vérifiés un par un
   ├── design-pilote ───── direction visuelle, wireframe, maquette (optionnelle)
   ├── site-pilote ─────── brief → architecture → images → code → formulaire
   │                        → pages légales → SEO → mise en ligne Vercel → analytics
   ├── blog-pilote ─────── (si blog) Ghost, thème, cocon sémantique, articles, audit SEO
   ├── marketing-* ─────── (si réseaux) articles → posts LinkedIn, Instagram, Facebook via Buffer
   └── seo-visibilite ──── bilan Google et moteurs IA, plan sur 90 jours
```

Situations gérées : nouveau site, refonte d'un site existant, modifications d'un site existant (avec captures avant et après).

## Les skills

| Famille | Skills |
|---|---|
| Démarrage | `demarrer`, `comptes` |
| Site | `site-pilote`, `site-brief`, `site-architecture`, `site-images`, `site-build`, `site-corrige`, `site-formulaire`, `analytics-setup` |
| Design | `design-pilote`, `design-wireframe`, `design-mockup`, `design-code`, `design-components`, `design-review`, `design-branding`, `design-animation`, `design-repasse`, `accessibilite`, `persona-parcours` |
| Blog | `blog-pilote`, `blog-setup-ghost`, `blog-theme`, `blog-cocon`, `blog-article`, `blog-batch`, `blog-status`, `blog-corrige`, `blog-seo-audit`, `blog-knowledge-base`, `blog-link-validation`, `blog-integrate-headless`, `blog-integrate-admin` |
| Marketing | `marketing-connect-blog`, `marketing-connect-buffer`, `marketing-article-reseaux`, `marketing-programmer-articles`, `marketing-panel-audit` |
| Rédaction | `copywriting`, `redaction-naturelle`, `ux-copy`, `pages-legales` |
| SEO et contrôle | `seo-visibilite`, `seo-audit-code`, `verif-navigateur` |

Chaque skill peut aussi se lancer seul (par exemple `design-review` sur un site existant, ou `copywriting` pour réécrire une page).

## Comptes possibles

Selon tes réponses, l'agent te demandera seulement une partie de ces comptes : GitHub, Vercel, Resend, Airtable, Cal.com ou Calendly, PikaPods (blog Ghost), Buffer et tes réseaux, Vercel Web Analytics, Plausible ou Google Analytics, Google Search Console, un nom de domaine, Pencil.dev, Figma ou Frame0. Le skill `comptes` explique chacun, indique s'il est gratuit ou payant et vérifie qu'il fonctionne.

## Sécurité

- L'agent ne te demande jamais un mot de passe ni une clé dans le chat : tu les colles toi-même dans le terminal ou le tableau de bord du service.
- Rien n'est mis en production, publié ou payé sans ton « oui » au moment même.
- Le dossier `.studio/` contient tes réponses : il est exclu de Git.

## Pour Jeff : gérer les accès

```bash
scripts/inviter-eleve.sh pseudo1 pseudo2
scripts/retirer-eleve.sh pseudo1
```

Chaque élève reçoit un accès en lecture seule.
