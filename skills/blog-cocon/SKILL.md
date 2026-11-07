---
name: blog-cocon
description: "Construit le cocon sémantique du blog (1 mère, 3 à 7 filles, 3 à 5 petites-filles chacune) et l'écrit dans cocon.json après validation. Déclencheurs : cocon sémantique, plan SEO du blog, planifier les articles."
---

# Cocon sémantique du blog

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Questions à l'élève : outil `AskUserQuestion` (Claude) ou question dans le chat (Codex). Recherche web : l'outil de recherche web du runtime, sinon bascule manuelle (voir `references/validation-web.md`). Méthode de Laurent Bourrelly ;

**Pattern strict : tu proposes, l'élève valide ou modifie.** Jamais de question ouverte du genre « quels piliers veux-tu ? ». Tutoiement. Arbres ASCII pour montrer la structure (pas de prose). Pas de keyword research chiffré : les jugements volume et concurrence sont éditoriaux (haut/moyen/faible), à confirmer avec un outil SEO (Search Console, Ahrefs, Semrush).

Avant de proposer, lire `references/methode.md` (anatomie, maillage, pièges). Le format de sortie est dans `references/cocon-schema.md` : c'est le contrat lu par `blog-article`, `blog-batch`, `blog-status`, `blog-seo-audit`, `blog-corrige` et `blog-integrate-admin`.

## Pré-requis

- [ ] `brief.md` à la racine du projet. Sinon : « Le cocon se construit depuis le brief (objectif, audience, proposition de valeur). Lance d'abord `demarrer` (cadrage du projet) ou `site-brief`, puis reviens. » et arrête-toi.
- [ ] Ghost en place (`ghost-config.md`, skill `blog-setup-ghost`) : recommandé, non bloquant pour cartographier.
- [ ] Si `cocon.json` existe déjà : demander s'il faut l'écraser (une copie `cocon.json.bak` avant) ou l'étendre.

Si `.studio/blog.json` existe, partir de sa ligne éditoriale (`edito` : thèmes, mots-clés connus, concurrents) et du persona de `.studio/state.json` pour les propositions ; les concurrents servent à la validation web.

## Étapes (ne passer à la suivante qu'après validation)

Copie cette checklist et coche :

- [ ] 1. Lire le brief
- [ ] 2. Mère (3 candidates)
- [ ] 3. Filles (3 à 7)
- [ ] 4. Petites-filles (3 à 5 par fille, une fille à la fois)
- [ ] 5. Validation web des keywords
- [ ] 6. Consolidation finale
- [ ] 7. Écriture et contrôle de `cocon.json`

**1. Lire le brief.** Résume en 4 lignes : objectif, audience (qui et problème principal), proposition de valeur, ton. Attends « ok » ou corrections.

**2. Mère.** Propose 3 candidates de keyword (la requête commerciale la plus large que l'audience taperait). Pour chacune : keyword, volume, intention commerciale, concurrence (haut/moyen/faible), titre de page suggéré, une ligne de justification. Réponses acceptées : `1`/`2`/`3`, `autre: <keyword>` (demander alors le titre de page), `nouvelles`. Sortie : `mere` avec `slug`, `title`, `keyword_principal`, 2-3 `keywords_secondaires`.

**3. Filles.** Propose 3 à 7 piliers orthogonaux (test : un article entier sur chacun sans empiéter sur les autres ; recouvrement > 30 % : fusionner avant de présenter). Par pilier : `pilier_slug`, `slug`, `title`, `description` (160 caractères max), `keyword`, `persona`, `cta_principal` (URL relative de l'offre). Réponses par pilier : `valide F1`, `modifie F1: …`, `supprime F1`, `ajoute: …`. Ré-affiche l'arbre consolidé et demande la validation avant l'étape 4.

**4. Petites-filles.** Pilier par pilier, 3 à 5 niches longue traîne : `slug`, `title` (idéalement une vraie question), `keyword` (3-5 mots), `intent` (`informational`, `transactional`, `navigational`). Réponses : `valide`, `modifie F1.x: …`, `supprime F1.x`, `ajoute: …` (5 max par pilier). Signale tout keyword qui copie celui de sa fille (cannibalisation) et propose une variante.

**5. Validation web.** Suivre `references/validation-web.md` : verdict garder, repositionner ou drop par petite-fille, avant la consolidation.

**6. Consolidation.** Affiche l'arbre complet (mère, filles, petites-filles) et le total « 1 mère + N filles + M petites-filles = X articles ». Demande `oui` pour écrire ; sinon reboucle sur l'étape concernée.

**7. Écriture.** Écris `cocon.json` à côté de `brief.md`, JSON strict (schéma dans `references/cocon-schema.md`), `status: "planned"` partout, `site` repris du brief sinon `"TBD"`. Puis vérifie (boucle : corriger et réécrire tant qu'un point échoue) :

- [ ] `node "${CLAUDE_SKILL_DIR}/scripts/blog-outils.mjs" json-check cocon.json` répond « JSON valide » (`${CLAUDE_SKILL_DIR}` = dossier de ce skill ; Codex : dossier du SKILL.md)
- [ ] mère avec `slug`, `title`, `keyword_principal` et au moins 1 keyword secondaire
- [ ] 3 à 7 filles, `pilier_slug` uniques
- [ ] 3 à 5 petites-filles par fille, total >= 9
- [ ] aucun keyword de petite-fille identique à celui de sa fille
- [ ] tous les `status` à `"planned"`, un seul `cta_principal` par fille

## Clôture

Récapitule « 1 mère + N filles + M petites-filles = X articles » et indique la suite : `blog-article` pour le premier article (à la main d'abord), puis `blog-batch`. En cas de `cocon.json` cassé plus tard : `blog-corrige`.
