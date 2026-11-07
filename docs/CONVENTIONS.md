# Conventions du pack Studio Web (pour modifier ou ajouter un skill)

## Identité
- Plugin : `studio-web`, affiché « Studio Web », auteur Jeff Martini. Licence unique à la racine (`LICENSE`), pas de licence par skill.
- Langue : français, tutoiement de l'élève, phrases simples (public débutant).
- Aucun chemin propre à une machine, aucun secret, aucune règle propre à un auteur : un skill doit marcher chez n'importe quel élève.

## Appeler un autre skill
- Écrire le nom court entre backticks (`site-brief`). Dans Claude Code il s'appelle `studio-web:site-brief` (outil Skill) ; dans Codex `$site-brief` ou lecture de son SKILL.md. Ne citer QUE des skills du pack (liste ci-dessous). Un skill hors pack cité : soit le remplacer par un skill du pack, soit intégrer l'instruction utile directement (quelques lignes ou un fichier `references/`).

## Skills du pack
demarrer, comptes,
site-pilote, site-brief, site-architecture, site-images, site-build, site-corrige, site-formulaire, analytics-setup,
blog-pilote, blog-setup-ghost, blog-theme, blog-cocon, blog-article, blog-batch, blog-status, blog-corrige, blog-seo-audit, blog-knowledge-base, blog-link-validation, blog-integrate-headless, blog-integrate-admin,
design-pilote, design-wireframe, design-mockup, design-code, design-components, design-review, design-branding, design-animation, design-repasse, accessibilite, persona-parcours,
marketing-connect-blog, marketing-connect-buffer, marketing-article-reseaux, marketing-programmer-articles, marketing-panel-audit,
copywriting, redaction-naturelle, ux-copy, pages-legales, seo-visibilite, seo-audit-code, verif-navigateur

## État partagé (racine du projet de l'élève)
- `.studio/cadrage.md` : écrit par `demarrer` (réponses de cadrage lisibles).
- `.studio/state.json` : état global, écrit par `demarrer`. Schéma :
```json
{
  "version": 1, "projet": "", "cree_le": "",
  "situation": "nouveau | refonte | modification",
  "existant": { "url": "", "depot": "", "stack": "", "garder": "", "changer": "" },
  "references": [ { "url": "", "ce_qui_plait": "" } ],
  "objectif": "", "persona": { "qui": "", "probleme": "", "motivation": "", "objections": "" },
  "type_site": "landing | multi-pages", "pages": [],
  "direction_design": { "ambiance": "", "couleurs": "", "typo": "", "a_eviter": "" },
  "ton": [], "langues": ["fr"],
  "modules": { "design": true, "site": true, "formulaire": true, "blog": false, "marketing": false, "analytics": true },
  "outils": { "images": "codex | autre | photos", "maquette": "pencil | figma | aucun", "analytics": "ga4 | plausible" },
  "comptes": { "github": "ok | a_creer | inutile" },
  "phase_courante": "", "phases_terminees": []
}
```
- Chaque pilote garde son propre état : `.studio/site.json`, `.studio/blog.json`, `.studio/design.json` 
- Règle d'interactivité : un pilote ou un skill de cadrage LIT d'abord `.studio/state.json` et `.studio/cadrage.md`, reprend ce qui est déjà répondu (l'annonce en une ligne et demande « je garde ? ») et ne pose que les questions manquantes. Si le fichier n'existe pas (skill lancé seul), il pose ses questions lui-même.
- Questions : UNE à la fois, avec des choix proposés (Claude : AskUserQuestion avec 2 à 4 options, recommandée en premier ; Codex : choix numérotés dans le chat), toujours une option « je ne sais pas, propose-moi » quand c'est utile, et une courte explication en langage simple de pourquoi on pose la question.

## Images
Règle commune à tous les skills :
> Images : utiliser l'outil d'image disponible dans la session (par exemple l'outil image de Codex inclus dans un abonnement ChatGPT) ; à défaut, les photos fournies par l'élève ou une banque libre de droits (Unsplash, Pexels). Un service payant (fal.ai ou autre) seulement si l'élève l'a choisi, avec le coût estimé annoncé avant chaque lot et son accord. Une image générée l'est entière : texte et logo passent par le prompt ou par le HTML de la page, jamais collés par-dessus l'image après coup.

## Inspiration design
Demander à l'élève 1 à 3 sites qu'il aime (et ce qui lui plaît), puis consulter des galeries publiques (scrolltide.co/templates, 21st.dev, godly.website, land-book.com, awwwards.com) et retenir 2 à 4 références dont on note les décisions en valeurs (couleurs, tailles, espacements, mouvements), licences respectées, jamais de copie de code ou d'assets.

## Sécurité et publication
Garder les garde-fous existants : jamais de secret dans un fichier commité ni dans le chat (l'élève tape ses clés lui-même dans le terminal ou le tableau de bord), accord explicite avant toute mise en production, publication ou envoi.
