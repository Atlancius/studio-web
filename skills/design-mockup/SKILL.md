---
name: design-mockup
description: "Crée une maquette haute fidélité (couleurs, typo, espacement, images) depuis un wireframe ou une description, avec Pencil.dev, Figma ou directement en HTML, et sort une design spec JSON. Déclencheurs : maquette, mockup, mise en forme visuelle."
---

# Maquette haute fidélité

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : Claude `AskUserQuestion`, Codex dans le chat, une à la fois.

Applique un style visuel à une structure (section map de `design-wireframe` ou description libre).

> Images : utiliser l'outil d'image disponible dans la session (par exemple l'outil image de Codex inclus dans un abonnement ChatGPT) ; à défaut, les photos fournies par l'élève ou une banque libre de droits (Unsplash, Pexels). Un service payant (fal.ai ou autre) seulement si l'élève l'a choisi, avec le coût estimé annoncé avant chaque lot et son accord. Une image générée l'est entière : texte et logo passent par le prompt ou par le HTML de la page, jamais collés par-dessus l'image après coup. Génération d'images du site : `site-images`.

## Outils (aucun n'est obligatoire)

| Choix | Ce qu'il faut | Si absent |
|---|---|---|
| **HTML** (repli par défaut, rien à installer) | Un navigateur pour voir le rendu | Décrire la maquette en texte et passer au code |
| **Pencil.dev** | App desktop Pencil lancée avec un fichier `.pen` ouvert, son serveur MCP connecté | Proposer HTML ou Figma |
| **Figma** | Un serveur MCP Figma capable de créer des designs (connexion OAuth ; jamais de clé collée dans le chat ni dans un fichier) | Proposer HTML ou Pencil |

Lister les outils réellement exposés avant de commencer. Si l'outil choisi manque, proposer le repli HTML.

## Procédure

Checklist :
- [ ] 0. Outil : déjà fixé (`mockup.tool` dans `.studio/design.json`) si appelé par `design-pilote`, sinon demander (HTML recommandé pour débuter).
- [ ] 1. Entrée : section map (Pencil : ouvrir le `.pen` du wireframe ; Figma : recréer les frames d'après la section map ; HTML : partir de `wireframe.html` s'il existe) ou description.
- [ ] 2. Direction visuelle : reprendre la direction choisie et le design system de `.studio/design.json` / `DESIGN.md`. Seulement s'ils manquent, demander une question à la fois : ambiance ; palette (primaire, secondaire, accent, neutres) ; typographies (titres et corps).
- [ ] 3. Construire section par section, de haut en bas : fonds, typo, espacement, images, rayons et ombres. Pencil : petits lots de modifications (environ 25 opérations au plus), jamais toute la page d'un coup. HTML : `maquette.html` autonome (polices Google Fonts, styles inline ou `<style>`), ouverte dans le navigateur. Capture après chaque grosse section.
- [ ] 4. Contrôle avec `design-review` : contraste AA, échelle typographique, rythme d'espacement, cohérence des couleurs, version mobile. Corriger, recontrôler.
- [ ] 5. Montrer la capture : **approuver**, **ajuster** (cibler les sections) ou **refaire la direction** (retour à 2). Répéter jusqu'à approbation.

## Sortie

1. Source : `maquette.html`, chemin du `.pen` (Pencil) ou URL du fichier (Figma).
2. Capture pleine page (PNG) desktop et mobile.
3. Design spec JSON, consommée par `design-code` et enregistrée dans `.studio/design.json` :
   - `tool`, `source`
   - `colors` (primaire, secondaire, accent, neutres, fond, texte)
   - `typography` (familles, tailles, graisses, interlignes par niveau)
   - `spacing_base` et échelle, `border_radius`
   - `sections` : résumé des styles par section
