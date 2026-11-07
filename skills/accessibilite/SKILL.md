---
name: accessibilite
description: "Audite une page ou un composant (HTML, JSX, TSX) contre WCAG 2.2 AA et corrige les points CRITICAL et MAJOR. Déclencheurs : accessibilité, a11y, WCAG, contraste, navigation au clavier, lecteur d'écran."
---

# Audit d'accessibilité — WCAG 2.2 AA

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Aucun outil propre à un runtime n'est requis : lecture de fichiers, shell, navigateur piloté par Playwright.

Source unique des critères, patterns ARIA, gravités et vérifications : [references/checklist-wcag.md](references/checklist-wcag.md). Expliquer à l'élève en une phrase pourquoi c'est important : un site accessible est utilisable par tous (handicap, mobile, soleil sur l'écran) et mieux compris par Google.

## Checklist

- [ ] 1. Cadrer : fichiers ou pages à auditer (composant, page, site) ; framework et approche de style détectés.
- [ ] 2. Analyse statique : parcourir le code avec la checklist (section 1) et les patterns ARIA (section 2) de la référence.
- [ ] 3. Audit automatisé si un serveur de dev tourne (voir ci-dessous).
- [ ] 4. Rapport.
- [ ] 5. Corrections CRITICAL/MAJOR si demandées, puis relancer les étapes 2-3.

## Audit automatisé

Si `@axe-core/playwright` n'est pas installé dans le projet, le signaler et rester sur l'analyse statique (pas d'installation globale). Sinon :

```ts
import AxeBuilder from "@axe-core/playwright";

const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
  .analyze();
```

`withTags` restreint l'exécution aux règles portant ces tags ; `wcag22aa` y inclut explicitement WCAG 2.2 AA (sans `withTags`, axe lance toutes les règles non expérimentales). L'automatisme ne couvre qu'une partie des critères : le clavier, le zoom 200 %, le reflow à 320 px et les contrastes douteux se vérifient à la main (référence, section 4).

## Mode `--ui`

Sur « revois mon interface » ou conformité design : exécuter en plus `design-review` (6 principes visuels) et fusionner ses constats dans le rapport.

## Rapport

Gravités : CRITICAL (bloque la navigation) > MAJOR (contenu inaccessible) > MINOR (amélioration).

```
## Audit accessibilité — {page/composant}
Conformité : WCAG 2.2 {AA / non conforme} — {x} CRITICAL | {y} MAJOR | {z} MINOR

| Gravité | Critère WCAG | Fichier:ligne | Élément | Correctif |
|---|---|---|---|---|
| CRITICAL | 1.1.1 | hero.tsx:12 | <img> | alt descriptif |

Contrôles réussis : {liste courte}
Non vérifié : {ce que l'audit statique ne couvre pas}
```

Règles du rapport : chaque constat a un fichier, une ligne et son critère WCAG ; un constat de contraste donne le ratio mesuré et le ratio requis ; jamais de conseil vague.

## Corrections

- Correctifs en diff, comportement préservé, approche de style existante du projet.
- Ne jamais remplacer du HTML sémantique par des `div` + ARIA, ni retirer un attribut ARIA sans en comprendre l'usage, ni ajouter un `aria-label` redondant avec un libellé visible.
- Ne jamais masquer un constat par `@ts-ignore` ou `eslint-disable`.
- Commit Git : seulement si l'élève le demande.

## Skills liés

- `design-review` : contrôle visuel rapide (hiérarchie, couleurs, typo, responsive).
- `seo-visibilite` : SEO et visibilité dans les IA, pour un audit qualité global.
- `verif-navigateur` : captures et erreurs console pour l'audit automatisé.
