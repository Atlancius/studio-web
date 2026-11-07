---
name: design-branding
description: "Tire d'un logo une identité visuelle complète (palette contrôlée en contraste, typographies, tokens de composants, ton, charte) ou audite un site existant face à son logo. Déclencheurs : charte depuis mon logo, couleurs de ma marque."
argument-hint: "<fichier ou URL du logo> [--audit]"
---

# Identité visuelle à partir d'un logo

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : Claude `AskUserQuestion`, Codex dans le chat, une à la fois. Suivi : `TodoWrite` (Claude) ou `update_plan` (Codex). Les fichiers de `references/` sont en anglais : ils servent à l'agent, les explications à l'élève restent en français simple.

Construit un système d'identité prêt pour la production à partir d'un seul logo : chaque couleur, police, rayon et trait de ton se rattache au logo. Ce skill écrit le système et sa spec, pas les fichiers d'icônes. Pas encore de logo : `design-pilote` propose une direction et une palette de départ. Suite logique : `design-pilote` (direction des pages) puis `site-architecture` (structure du site).

## Avant de commencer

- **Charte existante** : si l'élève a déjà une charte (couleurs HEX, polices, règles du logo, ton), ses valeurs priment. Ne dériver que ce qui manque et signaler chaque écart au lieu de l'écraser.
- **Où écrire** : dans le projet de l'élève (tokens dans le CSS global, charte dans `DESIGN.md` ou `docs/`). Enregistrer aussi les couleurs et typos retenues dans `direction_design` de `.studio/state.json` et dans `.studio/design.json` s'ils existent.
- **Qualité du logo** : illisible ou basse résolution → demander un meilleur fichier (SVG de préférence) avant la phase 1.

## Checklist

```
- [ ] 1. Analyse du logo validée par l'élève (porte)
- [ ] 2. Système de couleurs — rapport de contraste : 0 FAIL, clair et sombre
- [ ] 3. Système typographique (licences notées)
- [ ] 4. Tokens de composants
- [ ] 5. Applications de la marque
- [ ] 6. Ton de la marque
- [ ] 7. Charte + fichiers de tokens écrits
- [ ] 8. Validation finale passée
```

## Phase 1 — Analyse du logo

Lire l'image du logo et en extraire :

- **Formes** : cercles (communauté, protection), carrés (stabilité, confiance), triangles (innovation, puissance), organique (croissance, créativité) ; angles arrondis (amical), vifs (précis), mixtes (sophistiqué) ; trait fin (élégant) ou épais (affirmé) ; symétrique (équilibré) ou asymétrique (dynamique).
- **Couleurs** : chaque HEX ; principale (plus grande surface), secondaires ; chaleur ; saturation.
- **Typographie** du logotype : serif / sans / script / display / sur mesure ; graisse ; style.
- **Personnalité** sur cinq axes : Ludique ↔ Sérieux, Moderne ↔ Classique, Minimal ↔ Riche, Chaleureux ↔ Froid, Affirmé ↔ Discret.

**Porte** : présenter l'analyse en mots simples et faire valider la personnalité avant de générer quoi que ce soit.

## Phase 2 — Couleurs

Dériver la palette des couleurs du logo ([references/color-system.md](references/color-system.md)) :

| Rôle | Nombre | Dérivation |
|------|-------|-----------|
| Primaire | 10 nuances (50–900) | Couleur dominante du logo, inchangée à son palier |
| Secondaire | 10 nuances | Décalage de teinte de 15 à 30°, ou 2ᵉ couleur du logo |
| Accent | 10 nuances | Complémentaire ou à fort contraste |
| Neutre | 10 nuances | Teinte primaire, chroma très faible |
| Sémantiques | 4 | Succès, alerte, erreur, info, accordées à la palette |

Répartition 60-30-10 : 60 % surfaces neutres, 30 % structure en primaire, 10 % accent (boutons d'action, mises en avant).

**Contrôle obligatoire** : lister chaque paire texte/fond, libellé/bouton, icône/surface et anneau de focus/surface, en clair et en sombre, avec le ratio WCAG de chacune, **calculé** (petit calcul `node -e` à partir de la luminance relative, ou [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)), jamais estimé à l'œil. Seuils : texte 4,5:1, grand texte et éléments d'interface 3:1. Paire en échec : déplacer le token d'un ou deux paliers (jamais modifier la couleur du logo), recalculer, continuer seulement à 0 FAIL. Une couleur du logo qui n'atteint pas le seuil en texte reste décorative et reçoit une sœur plus foncée pour le texte.

**Livrer** : tableau HEX, tokens CSS (Tailwind v4 : primitifs dans `@theme`, sémantiques dans `:root`, surcharges `.dark` ; site HTML simple : variables CSS dans `:root`), rapport de contraste.

## Phase 3 — Typographie

Choisir les polices selon la personnalité du logo ([references/typography-system.md](references/typography-system.md)). Trois au plus : **Titres** (porte le caractère du logo), **Texte** (très lisible), **Mono** (seulement pour une marque technique).

| Élément | Taille | Graisse | Interligne | Espacement |
|---------|------|--------|-------------|----------------|
| H1 | `clamp(2rem, 1.25rem + 3vw, 3.5rem)` | 700 | 1.1 | −0.02em |
| H2 | `clamp(1.5rem, 1.1rem + 2vw, 2.5rem)` | 600 | 1.2 | −0.01em |
| H3 | `clamp(1.25rem, 1rem + 1.25vw, 1.75rem)` | 600 | 1.3 | 0 |
| Texte | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` | 400 | 1.5 | 0 |
| Petit | `0.875rem` | 400 | 1.4 | 0.01em |
| Légende | `0.75rem` | 500 | 1.3 | 0.02em |

**Livrer** : familles avec licence et chargement (Google Fonts ou fichiers auto-hébergés ; `next/font` en Next.js), piles de repli, échelle en tokens. Signaler toute police payante.

## Phase 4 — Tokens de composants

D'après les formes du logo ([references/component-system.md](references/component-system.md)) :

- **Rayon** : logo arrondi → base 12 px ; vif → 4 px ; mixte → 8 px ; plus `full` pour les pilules.
- **Espacement** : échelle base 4 px `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`.
- **Élévation** : cinq niveaux, plus doux pour une marque amicale, plus nets pour une marque professionnelle.
- **Specs** : boutons (primaire, secondaire, fantôme, tous les états), cartes, champs de formulaire, icônes (Lucide par défaut, trait accordé au logo), personnalité du mouvement (easing et durées ; outils et mouvement réduit : `design-animation`).

## Phase 5 — Applications

- **Site** : en-tête et navigation, hero, grille de cartes, pied de page, direction du mode sombre (le design des pages relève de `design-pilote`).
- **Réseaux sociaux** : post, story, post LinkedIn, photo de profil et bannière ([references/component-system.md](references/component-system.md#social-media-templates)).
- **Photographie** : lumière, température, saturation, composition, retouche ([references/brand-guidelines.md](references/brand-guidelines.md#photography-style-guide)).

## Phase 6 — Ton de la marque

Marque qui a déjà un ton défini : le reprendre tel quel. Nouvelle marque : associer la personnalité du logo à 4–5 traits (formes ludiques → conversationnel, plein d'esprit ; géométrie vive → précis, expert ; formes organiques → chaleureux, empathique ; couleurs vives → confiant, direct). **Livrer** : matrice trait → à faire → à éviter, ton selon le contexte, vocabulaire à utiliser et à éviter. Textes écrits dans ce ton : `copywriting`.

## Phase 7 — Charte

Compiler ([references/brand-guidelines.md](references/brand-guidelines.md)) :

```
1. Histoire de la marque (sens du logo, personnalité)
2. Usage du logo (zone de protection, taille minimale, variantes, à faire / à éviter)
3. Palette (HEX, RGB, HSL + règles d'usage + rapport de contraste)
4. Typographie (familles, licences, échelle, CSS)
5. Composants (rayons, ombres, espacements, boutons, cartes, champs, icônes, mouvement)
6. Photographie et images
7. Ton de la marque
8. Modèles réseaux sociaux
9. Design tokens (fichier CSS + JSON au format W3C DTCG)
```

Règles du logo par défaut quand il n'en a pas : zone de protection ≥ 0,5 × hauteur du logo ; largeur minimale 190 px web, 38 mm print ; variantes couleur, monochrome noir, monochrome blanc, niveaux de gris.

## Mode audit (`--audit`)

Phase 1, puis comparer le site, les composants et les visuels existants à l'ADN extrait : couleurs (valeurs exactes et contrastes calculés), polices, rayons, ombres, ton. Noter chaque catégorie ([references/brand-guidelines.md](references/brand-guidelines.md#brand-audit-method)) et livrer un rapport d'écarts : fichier ou URL, valeur actuelle, valeur attendue, correction exacte, classés par gravité. Lecture seule, sauf si l'élève demande les corrections.

## Validation finale

Tout doit être vrai ; sinon corriger et revérifier :

- [ ] Chaque couleur vient du logo ou de la charte ; la couleur du logo apparaît inchangée dans sa gamme.
- [ ] Rapport de contraste à 0 FAIL en clair et en sombre, ratio calculé pour chaque paire.
- [ ] Variantes claire et sombre livrées.
- [ ] Chaque police a sa licence et son mode de chargement ; polices payantes signalées.
- [ ] Les fichiers de tokens se chargent (CSS valide, JSON valide) et utilisent les mêmes noms que la charte.
