---
name: blog-pilote
description: "Pilote la création du blog de A à Z (Ghost, thème ou intégration, cocon, premiers articles, audit SEO) en reprenant le cadrage du projet, avec questions guidées et reprise. Déclencheurs : créer mon blog, reprendre mon blog."
---

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Skill cité = outil Skill (Claude, `studio-web:<nom>`) ou `$nom` / lecture de son SKILL.md (Codex). Question à l'élève : `AskUserQuestion` avec 2 à 4 options, la recommandée en premier (Claude) ; choix numérotés dans le chat (Codex). Services Ghost = les outils MCP du service, quel que soit leur nom.

# Parcours complet du blog

Tu enchaînes les phases dans l'ordre, une à la fois, avec un **checkpoint validé** avant la suivante. « Stop » possible à tout moment : sauvegarder l'état et s'arrêter. Tutoiement, mots simples. Ce skill ne refait rien : chaque phase **lit et applique le skill indiqué**.

> Images : utiliser l'outil d'image disponible dans la session (par exemple l'outil image de Codex inclus dans un abonnement ChatGPT) ; à défaut, les photos fournies par l'élève ou une banque libre de droits (Unsplash, Pexels). Un service payant (fal.ai ou autre) seulement si l'élève l'a choisi, avec le coût estimé annoncé avant chaque lot et son accord. Une image générée l'est entière : texte et logo passent par le prompt ou par le HTML de la page, jamais collés par-dessus l'image après coup.

## Étape 0 : reprendre ce qui est déjà su

1. Lire `.studio/state.json` et `.studio/cadrage.md` s'ils existent (écrits par `demarrer`). En tirer, sans les redemander : nom du projet, `situation` et `existant` (site déjà en ligne ? URL, dépôt, stack), `type_site`, `objectif`, `persona`, `ton`, `langues`, `direction_design`, `outils.images`, `modules.marketing`, état des `comptes`.
2. Annoncer en 3 à 5 lignes ce que tu as repris (« Ton site : landing HTML sur Vercel, cible : …, ton : … ») et demander « Je garde tout ça ? » (oui / je corrige un point).
3. Si `modules.blog` vaut `false` : le signaler (« au cadrage, tu avais dit pas de blog ») et demander s'il faut l'activer ; si oui, passer `modules.blog` à `true` dans `.studio/state.json`.
4. Lire `.studio/blog.json` (état du blog).
   - **Présent** : afficher la phase atteinte et la dernière étape terminée, puis proposer : reprendre, recommencer, aller à une phase précise. JSON illisible : proposer de le reconstruire depuis `ghost-config.md` et `cocon.json`.
   - **Absent** : le créer :

```json
{
  "projet": "",
  "cree_le": "<date ISO>",
  "phase_courante": 1,
  "phases_terminees": [],
  "ghost_url": null,
  "scenario": null,
  "techno": null,
  "cocon_path": null,
  "brouillons_crees": 0,
  "edito": { "themes": [], "frequence": null, "longueur": null, "ton": null, "relecture": null, "mots_cles": [], "concurrents": [] }
}
```

`.studio/blog.json` ne contient aucun secret ; l'ajouter au `.gitignore` si l'élève ne veut pas le versionner.

Sans `.studio/state.json` (skill lancé seul) : demander le nom du projet, l'URL du site s'il existe, puis poser toi-même les questions de cible et de ton de l'étape 2.

## Étape 1 : choisir le scénario Ghost (proposé, pas demandé à froid)

Détecter la techno : `existant.stack` du cadrage, sinon les fichiers du projet (`package.json` avec `next`, `next.config.*` → Next.js ; seulement des `.html` → HTML pur ; `astro.config.*`, `svelte.config.*`, `nuxt.config.*` → autre framework). Puis **proposer** le scénario avec une explication simple :

| Situation détectée | Scénario proposé | Explication à donner |
|---|---|---|
| Pas de domaine perso, ou site HTML et envie d'aller vite | **A** : blog à l'adresse PikaPods (`https://<nom>.pikapod.net`) | « Ton blog vit à sa propre adresse, rien à régler côté domaine. Le plus simple pour démarrer. » |
| Domaine perso possédé (HTML ou autre framework) | **B** : sous-domaine `blog.<ton-domaine>` | « Ton blog a une adresse à ton nom. Il faudra ajouter une ligne chez ton registraire de domaine. » |
| Site Next.js (App Router) et envie d'avoir le blog sur `<site>/blog` | **C** : headless | « Ghost sert d'éditeur caché, ton site Next.js affiche les articles sur `/blog`. Le mieux pour le SEO, mais demande du code. » |

Question avec options (recommandée en premier, + « explique-moi la différence »). Ne jamais proposer `<site>/blog` par réécriture Vercel vers PikaPods (liens canoniques et sitemap faux, voir `blog-setup-ghost`). Noter `scenario` et `techno` dans `.studio/blog.json`.

## Étape 2 : ligne éditoriale (une question à la fois, seulement si inconnue)

Chaque question : une phrase pour dire à quoi elle sert, des options, « je ne sais pas, propose-moi ». Proposer des options **tirées du cadrage** (persona, objectif, offre).

1. **Thèmes du blog** : proposer 3 à 5 grands thèmes déduits du persona et de l'offre ; l'élève coche, corrige ou ajoute. (Sert à orienter le cocon.)
2. **Fréquence** : 1 article par semaine (recommandé pour démarrer) / 2 par mois / 1 par mois / par vagues (lots). (Sert au rythme de `blog-batch` et à la planification.)
3. **Longueur et ton des articles** : courts et pratiques (800 à 1 200 mots) / guides complets (1 500 à 2 500 mots) / mix ; ton repris du cadrage, à confirmer (tutoiement ou vouvoiement).
4. **Qui relit avant publication** : toi seul (recommandé) / un collègue ou client / personne (déconseillé : les articles restent en brouillon de toute façon).
5. **Mots-clés déjà connus** : en saisir quelques-uns, ou « je n'en ai pas, propose » (le cocon les proposera).
6. **Concurrents ou blogs de référence** : 1 à 3 URL, ou « aucun ». (Sert à la validation web des mots-clés dans `blog-cocon`.)

Enregistrer les réponses dans `edito` de `.studio/blog.json`. Si `brief.md` est absent mais que le cadrage existe, le produire avec `site-brief` (qui reprend le cadrage) ; sans cadrage ni brief : lancer `demarrer`.

## Étape 3 : comptes nécessaires

Avant la phase 1, récapituler les comptes et vérifier leur état dans `comptes` de `.studio/state.json` ; ceux à créer passent par `comptes` (qui donne liens et pas à pas) :

- **PikaPods** (hébergement de Ghost, payant à l'usage : faire vérifier le tarif actuel sur pikapods.com, ne rien promettre de chiffré).
- **Vercel + GitHub** si le site doit être (re)déployé, toujours en scénario C.
- **Outil d'image** retenu au cadrage (abonnement ChatGPT pour Codex, ou service payant choisi par l'élève), sinon photos.
- **Registraire du domaine** (accès à la zone DNS) en scénario B.

Ne pas avancer tant qu'un compte bloquant manque : proposer de faire `comptes` maintenant ou de s'arrêter.

## Phases

Présenter les phases et demander « On y va ? ». Annoncer le coût avant les phases qui génèrent des images avec un service payant (phases 4 et 5) ; ne pas citer de montants non vérifiés.

| # | Phase | Skill à appliquer | Sortie |
|---|---|---|---|
| 1 | Ghost en ligne | `blog-setup-ghost` | `ghost-config.md`, service Ghost OK |
| 2 | Thème (scénarios A, B) | `blog-theme` | thème actif dans Ghost |
| 2-bis | Intégration headless (scénario C) | `blog-integrate-headless` | `<site>/blog` rend du HTML |
| 3 | Base de faits | `blog-knowledge-base` | `knowledge.json` |
| 4 | Cocon sémantique | `blog-cocon` | `cocon.json` |
| 5 | Premier article, à la main | `blog-article` (+ `blog-integrate-admin` si scénario C et envie d'une interface) | un post Ghost en brouillon |
| 6 | Lot d'articles | `blog-batch` (taille selon la fréquence choisie, 3 par défaut) | brouillons Ghost |
| 7 | Audit SEO | `blog-seo-audit` | `seo-audit-<date>.md` |

Phase en échec : appliquer `blog-corrige` avant d'avancer. Vue d'ensemble à tout moment : `blog-status`.

## Déroulé de chaque phase

1. Annoncer « Phase N/7 » et ce qui va être produit, en une phrase simple.
2. Lire et appliquer le skill de la table, en lui passant ce qui est déjà su (scénario, ligne éditoriale, charte) pour qu'il ne redemande pas.
3. Vérifier la sortie attendue (fichier présent, service qui répond).
4. Checkpoint : valider / ajuster / stop.
5. Mettre à jour `.studio/blog.json` (`phases_terminees`, `phase_courante`, valeurs utiles) et ajouter `blog` à `phases_terminees` de `.studio/state.json` à la fin.

Particularités :

- **Phase 1** : noter `ghost_url`. Scénario C : phase 2-bis au lieu de 2 ; A ou B : ignorer la 2-bis.
- **Phase 2** : la charte vient de `charte.md`, sinon de `direction_design` du cadrage, sinon des couleurs et polices du site existant (`design-branding` peut la produire). Itérer tant que l'élève n'est pas satisfait.
- **Phase 4** : passer à `blog-cocon` les thèmes, mots-clés et concurrents de `edito`. Noter `cocon_path`.
- **Phase 5** : premier article **assisté, jamais en lot**, pour comprendre le fonctionnement. Scénario C : proposer terminal (`blog-article`, recommandé pour le premier) ou interface navigateur (`blog-integrate-admin`). Appliquer longueur, ton et relecteur choisis. Incrémenter `brouillons_crees`.
- **Phase 6** : si le premier article laisse un doute, en refaire un ou deux à la main avant.

## Clôture

Bilan en langage simple : adresse du blog, scénario, thème ou intégration, nombre de piliers et d'articles planifiés, brouillons créés, rapport d'audit, rythme conseillé (selon la fréquence choisie). Marquer `phase_courante: 8` (terminé).

Suite :
- Écrire au rythme choisi : `blog-article` (un) ou `blog-batch` (plusieurs) ; suivre l'avancement : `blog-status`.
- Si `modules.marketing` vaut `true` dans `.studio/state.json` : proposer `marketing-article-reseaux` (transformer chaque article publié en posts réseaux) et `marketing-programmer-articles` (production régulière automatique) ; branchement préalable du blog : `marketing-connect-blog`.
- Sinon, revenir à `demarrer` pour la phase suivante du projet.

## Règles

- Une phase à la fois, jamais d'enchaînement sans checkpoint.
- Le statut Ghost reste **toujours brouillon** : l'élève publie à la main dans l'admin Ghost.
- Les clés Ghost ne passent jamais par le chat ni par un fichier `.studio/` : l'élève les tape lui-même dans la configuration du service ou dans son terminal.
