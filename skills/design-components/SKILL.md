---
name: design-components
description: Cherche, liste et gère les collections de composants UI (HTML/React) du registre local. Utiliser pour trouver un composant prêt à l'emploi, ajouter ou retirer une collection. Appelé par design-code et design-pilote.
---

# Registre de composants UI

Convention de chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Tous les chemins `registry/...` sont relatifs à lui, jamais au projet.

Le registre indexe des collections de composants ; il est livré vide, l'élève ajoute ses propres collections (par exemple des composants récupérés sur 21st.dev ou une bibliothèque libre, licence respectée et lien d'origine noté dans `source`).

## Première étape obligatoire

1. Lire `${CLAUDE_SKILL_DIR}/registry/registry.json`.
2. Pour chaque collection, lire `${CLAUDE_SKILL_DIR}/registry/<path>/manifest.json` (`<path>` = champ `path`, ex. `./collections/ma-collection`).
3. Répondre à partir de ces fichiers seulement.

Si `registry.json` ne liste aucune collection ou si un fichier manque : le dire et proposer d'ajouter une collection. Ne jamais inventer collection, composant ni chemin.

## Demandes prises en charge (langage naturel)

- **Chercher** : classer les composants par palier, catégorie exacte, puis tag, puis mot-clé dans `name`/`description` ; dédoublonner au palier le plus haut, tri alphabétique dans un palier.
- **Lister** : les collections, ou les composants d'une collection.
- **Détailler** : description, tags, formats et chemins d'un composant `<collection>/<id>`.
- **Ajouter** une collection : vérifier que son dossier contient un `manifest.json` valide, puis ajouter l'entrée dans `registry.json`.
- **Retirer** une collection : retirer l'entrée de `registry.json` seulement ; ne pas supprimer ses fichiers.
- **Lire le code** : `${CLAUDE_SKILL_DIR}/registry/collections/<collection>/<chemin du format>`.

## Formats

`registry/registry.json`
```json
{ "version": "1.0.0",
  "collections": [ { "name": "ma-collection", "description": "…", "path": "./collections/ma-collection",
                     "source": "https://…", "categories": ["hero", "pricing"] } ] }
```

`registry/collections/<nom>/manifest.json`
```json
{ "name": "ma-collection", "version": "1.0.0", "source": "https://…",
  "components": [ { "id": "hero-gradient", "name": "Hero Gradient", "category": "hero",
                    "tags": ["gradient", "dark"],
                    "formats": { "html": "components/hero-gradient.html", "react": "components/hero-gradient.tsx" },
                    "description": "…" } ] }
```

Champs obligatoires par composant : `id` (kebab-case, unique dans la collection), `name`, `category` (parmi les catégories de la collection), `tags`, `formats` (chemins relatifs au dossier de la collection), `description`.

Après un ajout ou un retrait, relire `registry.json` pour confirmer qu'il reste du JSON valide.

## Liens

Utilisé par `design-code` (réutiliser avant de générer) et `design-pilote` (raffinage).
