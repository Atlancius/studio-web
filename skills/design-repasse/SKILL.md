---
name: design-repasse
description: "Repasse graphique d'un site existant ou sans design : comprend son essence, note l'existant, cadre les envies, propose 3 directions inspirées de galeries publiques, fait choisir puis implémente page par page avec preuves."
argument-hint: "[-a] [-r] [--mode creation|upgrade] [--niveau 0|1|2|3] [url-deployee]"
---

# Repasse graphique

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Appeler un skill du pack : outil Skill (`studio-web:<nom>`) ou `$<nom>` / lecture de son SKILL.md. Questions à l'élève : `AskUserQuestion` (Claude) ou choix numérotés dans le chat (Codex), une à la fois. Sous-agents (si disponibles) : outil Agent ou `spawn_agent`. Suivi : TodoWrite / `update_plan`.

Amène le graphisme d'un site ou d'une app web à un très bon niveau, qu'il n'existe pas encore (mode **création**) ou qu'il faille le relever (mode **upgrade**, par exemple dans le cas « refonte » ou « modification » de `demarrer`). Ce skill comprend l'essence du produit, cadre les envies, cherche des références, fait choisir une direction, puis implémente et prouve. Il orchestre et tient les portes ; la direction et le design system s'appuient sur `design-pilote` et `design-branding`, le code d'animation sur `design-animation`.

```
/design-repasse                      → projet courant, mode détecté
/design-repasse https://exemple.fr   → idem + audits sur l'URL en ligne
/design-repasse -a --niveau 2        → enchaîne avec les recommandations, niveau d'animation 2
/design-repasse -r                   → reprend depuis .studio/repasse.md
```

## Checklist

```
- [ ] 0. Contexte, mode (création ou upgrade), reprise
- [ ] 1. Essence du produit écrite ; diagnostic noté en upgrade
- [ ] 2. Envies cadrées : questionnaire (création) ou propositions (upgrade)
- [ ] 3. Recherche : références publiques, 3 directions distinctes, choix
- [ ] 4. Plan : design system, plan par page et par section, planchers
- [ ] 5. Porte : plan validé explicitement par l'élève
- [ ] 6. Implémentation page par page, boucle de validation après chaque page
- [ ] 7. Note finale, itération (2 max) ou verdict ; livraison
```

État et décisions dans `.studio/repasse.md` du projet, selon le gabarit de [references/etat.md](references/etat.md). `-r` relit ce fichier et reprend à la première étape non cochée, après avoir vérifié que le code n'a pas changé depuis. Les décisions de direction se reportent aussi dans `.studio/design.json` (`direction`) et `direction_design` de `.studio/state.json` s'ils existent.

## 0. Contexte et mode

- Lire `.studio/state.json` et `.studio/cadrage.md` s'ils existent : situation (refonte, modification), ce qu'il faut garder et changer, références aimées, direction déjà choisie. Ne pas redemander ce qui y est.
- Charte ou identité existante (logo, couleurs, polices) : elle prime sur toute référence. Un écart volontaire se valide avec l'élève et se note.
- Historique design du projet : lire `DESIGN.md`, `STYLE-GUIDE.md`, `docs/**` et toute repasse antérieure (`.studio/repasse.md`) ; partir de leurs décisions plutôt que de les refaire.
- Projet : stack, pages, composants, tokens (`:root` ou `@theme` du CSS), conventions ; lecture de `package.json`, des composants et du CSS global. Site HTML simple : lire les `.html` et le CSS.
- Mode, sauf `--mode` : **création** si le projet n'a ni couleurs propres, ni polices choisies, ni direction visible (thème par défaut, CSS minimal, contenus provisoires) ; sinon **upgrade**. Annoncer le mode détecté et sa preuve.
- Sous-agents disponibles : audits en parallèle (un par volet du diagnostic). Sinon : enchaîner les volets.

## 1. Comprendre l'essence

Lire le code et les contenus (pages, textes, métadonnées, README, brief) puis écrire la fiche essence dans `.studio/repasse.md` :

```
Produit     : ce que c'est, en une phrase
Public      : qui, dans quel contexte d'usage
Promesse    : ce que le visiteur obtient
Ton         : trois adjectifs justifiés par le contenu
Signature   : l'élément propre au sujet qui peut devenir le moment mémorable
À garder    : ce qui fonctionne déjà (upgrade)
Contraintes : performance, accessibilité, pages critiques, délais
```

Mode upgrade : diagnostic noté, en lecture seule, selon [references/diagnostic.md](references/diagnostic.md). Chaque note cite sa preuve ; sans preuve, « non mesuré ». Le montrer à l'élève en mots simples (« ce qui marche déjà », « ce qui fait amateur »).

## 2. Cadrer les envies

- **Création** : poser le questionnaire de [references/questionnaire.md](references/questionnaire.md), une question à la fois, options tirées de la fiche essence, recommandation en premier.
- **Upgrade** : présenter les améliorations classées par impact et effort (tableau : amélioration, pourquoi, preuve du diagnostic, niveau d'animation requis, coût de performance) et ne demander que les vrais arbitrages : niveau d'animation, éléments à garder, audace acceptée.

Avec `-a` : retenir les recommandations et les consigner.

## 3. Rechercher et choisir une direction

1. Demander à l'élève 1 à 3 sites qu'il aime et ce qui lui plaît (si ce n'est pas déjà dans le cadrage).
2. Consulter des galeries publiques pour chaque rôle (direction d'ensemble, hero, interaction signature, briques d'interface) : scrolltide.co/templates, 21st.dev, godly.website, land-book.com, awwwards.com. Requêtes courtes, un ou deux mots-clés en anglais (`hero`, `pricing`, `bento`, `text-reveal`, `scroll`, `3d`). Dix recherches au plus, tirées de la fiche essence et des réponses.
3. Retenir 2 à 4 références et noter leurs décisions **en valeurs** (couleurs HEX, polices et tailles, espacements, easing, durées, déclencheurs). Jamais de copie du code ou des visuels d'un site ; un composant repris d'une galerie respecte sa licence et garde son lien d'origine.
4. Construire **trois directions vraiment différentes** (mise en page, mouvement et matière, pas seulement la palette), au format de [references/directions.md](references/directions.md).
5. Optionnel, sur accord : une image de hero par direction avec `site-images` (règles d'images du pack : outil disponible dans la session, service payant seulement sur choix de l'élève avec coût annoncé).
6. Faire choisir une direction (ou un mélange explicite). Avec `-a` : la recommandée.

## 4. Plan

1. **Design system** : couleurs, typographies, espacements, rayons en tokens CSS (variables dans `:root`, ou `@theme` en Tailwind v4) ; couleurs de la charte en HEX exacts ; sans charte, partir de la direction choisie (et de `design-branding` si un logo existe).
2. **Plan par page** : sections dans l'ordre, composant existant, référence reprise (licence et lien), contenu réel.
3. **Plan d'animation** avec `design-animation` et sa règle, pour chaque section : technique, outil, durée, easing, déclencheur, rendu en mouvement réduit, coût mobile. Une seule séquence orchestrée par page, plafonnée par le niveau d'animation. Exemple de précision attendue :

   ```markdown
   #### Hero
   - Entrée : titre découpé par mots, power3.out, décalage 0.03 s ; mouvement réduit : texte final
   - Fond : dégradé animé lent, statique sous 768 px
   - Scroll : parallaxe d'un seul calque (scrub), desktop seulement
   ```

4. **Planchers**, toujours exigés : chaque largeur dessinée (320, 768, 1024, 1440 px) ; mode sombre si prévu ; LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 sur mobile ; WCAG 2.2 AA, focus visible, `prefers-reduced-motion`.
5. Écrire ce qui est retenu et ce qui est écarté, avec la raison.

## 5. Porte

Présenter fiche essence, direction retenue et plan, en mots simples. **Aucun code avant un accord explicite de l'élève**, même avec `-a`. Conseiller de travailler sur une branche Git ou une copie du projet pour pouvoir revenir en arrière.

## 6. Implémenter et valider

Ordre : tokens et styles globaux → mise en page commune (navigation, pied de page) → éléments de base et leurs états → hero → sections par priorité → micro-interactions → transitions de page → finitions.

Code d'animation : `design-animation` ; API exacte : doc officielle de la bibliothèque. Sous-agents d'implémentation en parallèle seulement sur des fichiers différents ; vérifier soi-même ce qu'ils déclarent.

Après chaque page, boucle jusqu'au vert :

1. Build et typecheck si le projet en a (gestionnaire du lockfile).
2. Rendu réel aux quatre largeurs (navigateur intégré, `verif-navigateur`), clavier, mouvement réduit, mode sombre ; captures avant/après.
3. `accessibilite` ; `seo-audit-code` si la page est publique.
4. Lighthouse mobile (Chrome DevTools ou PageSpeed Insights) : régression sous les planchers → corriger avant la page suivante.
5. Auto-revue sur la grille de [references/diagnostic.md](references/diagnostic.md), preuve à l'appui.

## 7. Note finale et livraison

Reprendre la grille en colonnes Avant / Après / Cible (création : Après / Cible), puis transformations appliquées et fichiers modifiés. Critique finale par `design-review` ou par un sous-agent qui ne voit que les captures et la grille. Dimension sous la cible : correctifs ciblés, revalidation. **Deux itérations au plus**, puis verdict à l'élève : score atteint, écarts restants, cause. Preuves finales : captures et mesures réelles, jamais un résultat supposé. Commit seulement si l'élève le demande ; ce skill ne déploie pas (déploiement : `site-pilote`).
