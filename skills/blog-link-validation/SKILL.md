---
name: blog-link-validation
description: "Valide les liens internes d'un article généré (liste blanche, liens inventés réécrits vers le pilier parent, rapport). Utilisé avant l'envoi dans Ghost. Déclencheurs : vérifier les liens de l'article."
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Appelé par `blog-article` et `blog-batch` (Claude : outil Skill ; Codex : `$nom` ou lecture du `SKILL.md`). Liens morts d'un site déjà en ligne : `seo-visibilite`.

# Validation des liens internes d'un article

Étape de pipeline : après la génération P2 et le sanitizer HTML, avant le push Ghost. Un LLM peut inventer un slug (`/blog/le-bon-prompt`), un pilier mal orthographié ou une page qui n'existe pas : sans filet, l'article publié contient des 404 internes (SEO dégradé, lecteur perdu, maillage du cocon cassé). Objectif : zéro lien interne cassé en sortie.

## Politique

Pour chaque `href` du HTML :

| Catégorie | Motif | Action |
|---|---|---|
| Externe | `http://`, `https://`, `//`, `mailto:`, `tel:` | laissé tel quel |
| Ancre ou requête seule | commence par `#` ou `?` | laissé tel quel |
| Interne | tout le reste (en pratique commence par `/`) | comparé à la whitelist, sinon réécrit vers le fallback |

Le filtrage de `javascript:` et des protocoles dangereux appartient au sanitizer en amont ; ici ils tombent en « interne » et sont réécrits.

## Whitelist

Ensemble des URLs que l'article a le droit de citer, construit à la validation :

| Source | URLs | Origine |
|---|---|---|
| Mère du cocon | `/<mere-slug>` | `cocon.json` → `mere.slug` |
| Filles (piliers) | `/blog/pilier/<pilier-slug>` | `cocon.json` → `filles[].pilier_slug` |
| Articles publiés | `/blog/<slug>` | Ghost Content API, à l'instant de la validation |
| Outils du site | `/outils/<slug>` | `cocon.json` → `linked_outils[]` ou liste du projet |
| Pages CTA (formations, offres) | chemins du site | liste statique du projet |
| Pages structurelles | `/`, `/blog`, `/contact`… | liste statique du projet |

Les listes statiques (CTA, structurelles) sont propres au site de l'élève : les lire dans le projet ou les lui demander, ne pas les deviner. Passer la whitelist sous forme de `Set<string>` normalisé.

## Algorithme

Un seul passage regex sur les attributs `href`.

```typescript
const HREF_REGEX = /href=("|')([^"'>]+?)\1/g;

type ValidationResult = {
  cleaned: string;
  total: number;
  internal: number;
  external: number; // externes + ancres
  rewritten: Array<{ original: string; rewritten: string }>;
};

const isExternal = (h: string) => /^(https?:|\/\/|mailto:|tel:)/.test(h);
const isAnchor = (h: string) => h.startsWith("#") || h.startsWith("?");
const normalizeUrl = (h: string) =>
  h.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

export function validateLinks(
  html: string,
  allowedUrls: Set<string>,
  fallbackUrl: string, // pilier parent de l'article
): ValidationResult {
  const allowed = new Set([...allowedUrls].map(normalizeUrl));
  const rewritten: ValidationResult["rewritten"] = [];
  let total = 0, internal = 0, external = 0;

  const cleaned = html.replace(HREF_REGEX, (match, quote, href) => {
    total++;
    if (isExternal(href) || isAnchor(href)) { external++; return match; }
    internal++;
    if (allowed.has(normalizeUrl(href))) return match;
    rewritten.push({ original: href, rewritten: fallbackUrl });
    return `href=${quote}${fallbackUrl}${quote}`;
  });

  return { cleaned, total, internal, external, rewritten };
}
```

Normalisation : query, hash et slash final ignorés (`/blog/pilier/setup/` = `/blog/pilier/setup`). `href=""` n'est pas capturé par la regex : le signaler en warning.

## Fallback

Par défaut le **pilier parent** de l'article (`/blog/pilier/<slug>`) : thématiquement le plus proche du lien voulu, le maillage est rabattu vers le hub pertinent. Ne pas utiliser la mère (trop large) ni une page CTA (biais commercial).

## Rapport

Afficher à l'élève à la fin de la génération :

```
Liens vérifiés : 14 (8 internes, 6 externes)
2 liens internes cassés réécrits vers le pilier parent :
  /blog/article-bidon → /blog/pilier/setup
  /claude-pro         → /blog/pilier/setup
```

Si `rewritten` n'est pas vide de façon récurrente : la whitelist injectée dans le prompt P2 est incomplète ou le prompt ne la rend pas assez contraignante ; corriger la source, pas seulement le HTML.

## Vérification

Avant de publier : relancer `validateLinks` sur le HTML nettoyé, le résultat doit avoir `rewritten` vide.
