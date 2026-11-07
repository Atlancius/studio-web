---
name: verif-navigateur
description: "Vérifie un site dans un vrai navigateur (Playwright) : captures en 4 tailles d'écran, erreurs console, performance, éléments clés. Déclencheurs : aperçu, capture d'écran, vérifier le rendu mobile, analyser un site existant."
---

# Vérification dans le navigateur (Playwright)

Aperçu et contrôle automatique d'un site, en local ou en ligne (URL d'un site existant à analyser avant une refonte, par exemple). Montrer les captures à l'élève et expliquer chaque problème en langage simple.

## Préparer (une fois par projet)

Toutes les commandes marchent à l'identique sur Mac, Linux et Windows (PowerShell) : Node.js suffit. Une commande par ligne, sans `&&`.

1. **Servir le site s'il est local** (inutile pour une URL en ligne). Dans un terminal à part ou en tâche de fond, depuis le dossier du site :
   ```
   npx --yes serve . -l 3000
   ```
   Projet Node (Next.js, Vite…) : sa commande `npm run dev` à la place. Attendre que la page réponde avant de capturer.
2. **Dossier de travail Playwright**, pour ne pas ajouter de dépendance au site lui-même. Depuis la racine du projet :
   ```
   node -e "require('fs').mkdirSync('.studio/verif',{recursive:true})"
   cd .studio/verif
   npm init -y
   npm i -D playwright
   npx playwright install chromium
   ```
   Déjà fait : `npx playwright --version` répond dans `.studio/verif`, passer directement à la capture. Projet qui a déjà Playwright dans son `package.json` : lancer depuis sa racine.

## Capturer

Depuis `.studio/verif` (Codex : remplacer `${CLAUDE_SKILL_DIR}` par le dossier de ce skill) :

```
node "${CLAUDE_SKILL_DIR}/scripts/capturer.mjs" http://localhost:3000
```

- **Aperçu rapide** (par défaut) : captures pleine page en 4 tailles (mobile 320 × 568, tablette 768 × 1024, ordinateur 1024 × 768, grand écran 1440 × 900), après chargement complet du réseau, débordement horizontal signalé, erreurs et avertissements de la console.
- **Contrôle complet** : ajouter `--complet` (performance TTFB, FCP, chargements ; requêtes en échec et 5 plus lourdes) et `--selecteurs "header,.cta,form"` pour inspecter des éléments clés (taille, couleurs, police, rôle, aria-label).
- Autre dossier de sortie : `--sortie captures-avant` (utile pour comparer avant et après une modification).

Sortie : rapport Markdown sur la sortie standard, captures PNG dans `captures/`. Code 1 : page injoignable (serveur arrêté, mauvaise URL) ; code 2 : Playwright absent ou URL invalide, le script affiche les commandes à lancer.

## Règles

- Toujours les 4 tailles, jamais une seule.
- Toujours signaler les erreurs console, même si les captures semblent bonnes.
- Montrer les captures à l'élève et expliquer chaque problème en langage simple (« sur téléphone, le bloc des prix dépasse à droite »).
- Le dossier `.studio/` est exclu de Git : les captures ne partent pas en ligne.

## Skills liés

- `site-corrige` : corriger ce que la vérification révèle.
- `accessibilite` : à combiner avec axe-core pour l'accessibilité.
- `seo-audit-code` : captures + audit SEO.
