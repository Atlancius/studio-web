---
name: site-pilote
description: "Pilote la création ou la refonte d'un site de A à Z (brief, plan, images, build, formulaire, SEO, mise en ligne Vercel, analytics), validé phase par phase avec reprise. Déclencheurs : crée mon site, refais mon site, reprendre mon site."
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion`, 2 à 4 options, la recommandée en premier ; Codex : choix numérotés dans le chat), plus « je ne sais pas, propose-moi » quand c'est utile. Autres skills du pack : Claude `studio-web:<nom>` (outil Skill), Codex `$<nom>` ou lecture de leur `SKILL.md`.

# Site complet, de A à Z

Ce skill orchestre. Chaque phase est faite par son skill ; ne pas refaire ici ce qu'il fait, l'appeler. L'élève valide chaque phase avant la suivante.

## 0. Lire ce qu'on sait déjà

1. Lire `.studio/state.json` et `.studio/cadrage.md` (écrits par `demarrer`). Présents : résumer en 3 lignes ce qui est acquis (situation, type de site, objectif, modules actifs) et demander « je garde tout ça ? ». Absents : proposer de lancer `demarrer` (recommandé, cadrage complet) ou de continuer ici avec les seules questions du site.
2. Lire `.studio/site.json` (état de ce pilote) :
   ```json
   { "projet": "", "cree_le": "", "mode": "nouveau | refonte | modification", "phase_courante": 0, "phases_terminees": [], "choix": {} }
   ```
   Présent : annoncer la phase atteinte et la dernière étape terminée, proposer reprendre / recommencer / aller à une phase précise. Absent : le créer.
3. « stop » à un checkpoint : écrire l'état, confirmer la sauvegarde, s'arrêter. Fin de parcours : copier en `.studio/site-AAAA-MM-JJ.json`.

## 1. Comptes prêts ?

Lire `comptes` dans `.studio/state.json`. GitHub ou Vercel absent ou « a_creer » : expliquer en une phrase pourquoi on en a besoin (GitHub garde le code, Vercel met le site en ligne ; offre gratuite pour un site perso, offre Pro pour un site pro ou client) et lancer `comptes` avant d'aller plus loin. Vérifier aussi que la CLI Vercel répond (`npx vercel --version`, puis `npx vercel whoami` ; non connecté : l'élève lance `npx vercel login` lui-même).

## 2. Situation : nouveau, refonte ou modification

Si `situation` n'est pas connue, demander :

- **Nouveau site** : on part de zéro → parcours des phases ci-dessous.
- **Refonte** : un site existe mais on le refait entièrement.
- **Modification** : on garde le site et on change des parties.

Refonte ou modification :
1. Demander l'URL en ligne et/ou le dossier ou dépôt GitHub du site (si dépôt : le cloner dans un dossier de travail).
2. Analyser l'existant avec `verif-navigateur` (captures mobile et desktop, erreurs console) et lire le code s'il est disponible : pages, contenus, couleurs, polices, formulaires, outils de mesure.
3. Faire un état des lieux simple (ce qui marche, ce qui gêne) et demander, une question à la fois : ce qu'on garde (textes, images, couleurs, logo, pages), ce qu'on change, ce qui manque. Noter dans `existant.garder` / `existant.changer` de `.studio/state.json`.
4. Identifier la stack et dire honnêtement ce que le pack couvre :
   - **HTML/CSS/JS** : tout le parcours s'applique, modification en place possible.
   - **Next.js / React** : modification en place possible (le pack sait lire et corriger ce code, `seo-audit-code` le couvre) ; le build HTML pur du pack ne s'applique pas, on travaille dans le projet existant. Blog headless : `blog-integrate-headless`.
   - **WordPress, Webflow, Wix, Squarespace** : le pack ne modifie pas ces outils de l'intérieur. Deux options à proposer : reconstruire le site en HTML avec le pack (contenus repris), ou garder l'outil et n'utiliser du pack que le cadrage, les textes (`copywriting`), le SEO (`seo-visibilite`), le blog et le marketing.
5. Demander : reconstruire (on enchaîne les phases en réutilisant les contenus gardés) ou modifier en place (on liste les changements, on les applique un par un avec `site-corrige` ou directement dans le code, on vérifie avec `verif-navigateur`, puis on reprend à la phase 6).

## 3. Phases

Annoncer le parcours (seulement les phases actives), puis demander « on y va ? ». Chaque phase finit par un checkpoint (valider / ajuster / stop) ; mettre à jour `.studio/site.json` et `phase_courante` / `phases_terminees` de `.studio/state.json` à chaque validation. Phase en échec (service non connecté, clé expirée) : montrer l'erreur, proposer le correctif, ne pas avancer.

| # | Phase | Skill | Sortie | Sautée si |
|---|---|---|---|---|
| 1 | Brief | `site-brief` | `brief.md`, type de site | — |
| 2 | Architecture | `site-architecture` | `sections.md` (landing) ou `arborescence.md` | — |
| 3 | Images | `site-images` | `./assets/` | l'élève a déjà ses photos (le demander) |
| 4 | Build | `site-build` | HTML/CSS/JS, vérifié en local avec `verif-navigateur` ; retouches par `site-corrige` | — |
| 5 | Formulaire | `site-formulaire` | formulaire qui enregistre et envoie des emails | `modules.formulaire` est faux |
| 6 | Pages légales, SEO, mise en ligne | `pages-legales`, `seo-audit-code`, section ci-dessous | site en ligne | — |
| 7 | Mesure d'audience | `analytics-setup` | statistiques actives | `modules.analytics` est faux |

Si `modules.design` est vrai et qu'une direction ou une maquette existe (`.studio/design.json`, `design-spec.json`, `charte.md`), la lire avant la phase 4 et la transmettre à `site-build`. Pas de direction du tout : proposer `design-pilote` (maquette d'abord) ou une direction rapide dans `site-brief`.

## Phase 6 : mise en ligne

1. Pages légales : vérifier que `mentions-legales.html` et `confidentialite.html` existent et sont remplies (`pages-legales`), pas des pages vides.
2. SEO : `seo-audit-code` sur toutes les pages.
3. Preview : depuis le dossier du site, `npx vercel` (crée ou relie le projet, renvoie une URL `*.vercel.app`). Build en échec : lire les logs (`npx vercel inspect <url> --logs`), corriger (fichier manquant, chemin d'image, balise cassée), redéployer. Preview qui demande une connexion Vercel : c'est la protection des déploiements ; l'élève peut la désactiver dans Vercel > projet > Settings > Deployment Protection, ou tester connecté à son compte.
4. Code sur GitHub (recommandé) : `git init`, premier commit, dépôt créé par l'élève sur github.com ou `gh repo create`, puis lier le dépôt au projet Vercel (Settings > Git) pour que chaque push redéploie.
5. Avant la production, présenter cette checklist et obtenir un « oui » explicite (la production rend le site public) ; refus : rester en preview.
   - [ ] Site testé en local puis sur la preview (mobile et desktop)
   - [ ] `seo-audit-code` passé ; `sitemap.xml` et `robots.txt` présents
   - [ ] Pages légales remplies
   - [ ] Formulaire testé de bout en bout (si phase 5 faite)
   - [ ] Orthographe relue, liens internes vérifiés
6. Production : `npx vercel --prod`.
7. Nom de domaine : demander s'il en a un (ou s'il veut en acheter un). L'ajouter au projet (`npx vercel domains add <domaine>` ou Settings > Domains) et afficher à l'élève les enregistrements DNS exacts renvoyés par Vercel (jamais de valeurs de mémoire), à saisir chez son registraire ; propagation de quelques minutes à 24 h, puis vérifier le domaine et le HTTPS.

## Clôture

Résumer : URL de production, outil de mesure, base Airtable, ce qui a été fait, et comment modifier plus tard (`site-corrige` ; un changement de template d'un thème se répercute sur toutes ses pages). Puis la suite selon `modules` : `blog-pilote` si `modules.blog` est vrai, `marketing-connect-blog` / `marketing-article-reseaux` si `modules.marketing` est vrai, `seo-visibilite` un mois après la mise en ligne. Rendre la main à `demarrer` s'il a lancé ce pilote.
