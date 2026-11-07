---
name: site-images
description: "Produit les images d'un site (hero, Open Graph 1200x630, illustrations, avatars) cohérentes avec la charte, par l'outil d'image disponible ou les photos de l'élève, puis les optimise. Déclencheurs : image hero, og:image, visuels du site."
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion` ; Codex : choix numérotés dans le chat).

# Images de site cohérentes avec la charte

> **Images** : utiliser l'outil d'image disponible dans la session (par exemple l'outil image de Codex inclus dans un abonnement ChatGPT) ; à défaut, les photos fournies par l'élève ou une banque libre de droits (Unsplash, Pexels). Un service payant (fal.ai ou autre) seulement si l'élève l'a choisi, avec le coût estimé annoncé avant chaque lot et son accord. Une image générée l'est entière : texte et logo passent par le prompt ou par le HTML de la page, jamais collés par-dessus l'image après coup.

Source des images : lire `outils.images` dans `.studio/state.json`. Inconnu : demander « Tu as déjà des photos (les tiennes, ton activité, ton équipe) ? » puis, pour le reste, proposer : outil d'image de la session (recommandé s'il existe), banque d'images libre de droits, service payant (coût annoncé). Les vraies photos de l'élève passent toujours avant une image générée pour montrer une personne, un lieu ou un produit réels.

## Checklist

- [ ] 1. Contexte et charte lus
- [ ] 2. Besoin cadré (usage, nombre)
- [ ] 3. Prompt validé par l'utilisateur
- [ ] 4. Images générées
- [ ] 5. Post-traitement et sauvegarde
- [ ] 6. Intégration HTML

## 1. Contexte

Lire dans l'ordre : `charte.md` (ou la section charte de `brief.md`) pour couleurs, polices, 3 adjectifs de ton ; `sections.md` ou `arborescence.md` pour la place de l'image ; `brief.md` pour l'audience. Rien de tout cela : demander marque, univers visuel et 3 adjectifs.

## 2. Besoin

Demander l'usage et le nombre de variantes (1 à 4, 3 conseillé). Service payant : annoncer le coût estimé du lot et attendre l'accord avant de générer.

| Usage | Format demandé à l'outil | Fichier final |
|---|---|---|
| Hero | `16:9` | 1600×900 |
| Open Graph | `16:9` puis recadrage centré | 1200×630, JPEG ou PNG, < 300 Ko |
| Illustration de section | `1:1` | 800×800 |
| Avatar, portrait | `1:1` | 600×600 |
| Bannière large | `21:9` puis recadrage centré | 1920×600 |
| Logo, pastille | `1:1` | 512×512 PNG |

La plupart des outils ne proposent pas le format 1.91:1 : d'où le recadrage. Laisser une marge calme au centre pour les sujets recadrés.

## 3. Prompt

Un prompt de base commun à tout le site (style + palette + ambiance + ton) ; seuls le sujet et le cadrage changent. Sept éléments :

```
[Sujet concret], [style], palette [couleurs hex de la charte], lumière [ambiance],
ton [3 adjectifs], cadrage [composition, espace négatif pour le texte],
[contraintes : pas de texte dans l'image, pas de logo tiers, fond].
```

Exemple hero : « Une personne qui prend des notes à une grande table en bois clair, photographie éditoriale moderne, palette terracotta (#C44D2F) et crème (#F5EDE0), lumière naturelle chaude venant de la gauche, ton chaleureux et inspirant, cadrage trois-quarts avec espace négatif à droite, pas de texte, arrière-plan flou. »

Cohérence : un seul style dominant (photo OU illustration), même palette, même lumière, même traitement sur toutes les images. Montrer le prompt complet à l'utilisateur et attendre son accord avant de générer.

Interdits : visage de personne célèbre, logo de marque, œuvre protégée, faux portrait présenté comme réel. Portrait réel (équipe, client) : partir de la photo d'origine et ne retoucher que le fond ou la lumière, avec le mode édition de l'outil s'il existe.

## 4. Génération

- **Outil d'image de la session** : générer avec le prompt validé et le format du tableau, une image par appel, puis enregistrer les fichiers dans `./assets/` (brouillons).
- **Banque libre de droits** : chercher sur Unsplash ou Pexels avec les mots-clés du prompt, proposer 3 choix par emplacement, télécharger celle choisie dans `./assets/` et noter l'auteur et le lien (crédit en pied de page si la licence le demande).
- **Service payant choisi par l'élève** : vérifier qu'il est connecté (sa clé reste dans sa configuration, jamais dans un fichier du projet ni dans le chat), annoncer le coût du lot, attendre l'accord, générer.
- Aucun outil disponible : le dire, proposer les photos de l'élève ou la banque libre.

## 5. Post-traitement

Outil unique, identique sur Mac, Linux et Windows : `sharp-cli`, lancé par `npx` (Node.js suffit, rien à installer à part). Le premier appel le télécharge (quelques secondes). Une commande par ligne, à lancer depuis la racine du site :

- Images du site en WebP < 200 Ko (idéal 100), 1600 px de large au plus :
  ```
  npx --yes sharp-cli -i assets/brouillon-hero.png -o assets/hero-principal.webp -f webp -q 80 resize 1600 --withoutEnlargement
  ```
  Trop lourd : relancer avec `-q 70`, puis `-q 60`.
- Recadrage centré (Open Graph 1200 × 630, bannière) :
  ```
  npx --yes sharp-cli -i assets/brouillon-hero.png -o assets/og-image.jpg -f jpeg -q 85 resize 1200 630 --fit cover --position attention
  ```
  `--position attention` garde la zone la plus intéressante ; `centre` pour un recadrage strictement centré.
- Plusieurs fichiers d'un coup : `-i assets/brouillons/*.png -o "assets/{name}.webp"` (le motif `{name}` reprend le nom d'origine ; guillemets obligatoires sous PowerShell).
- Contrôle poids et dimensions de tout le dossier (signale ce qui dépasse) :
  ```
  node "${CLAUDE_SKILL_DIR}/scripts/controle-images.mjs" assets
  ```
- Open Graph en JPEG ou PNG sous 300 Ko : WebP n'est pas garanti sur tous les réseaux sociaux.
- Noms descriptifs : `hero-principal`, `og-image`, `service-coaching`. Contrôler taille et dimensions de chaque fichier final avant de passer à l'étape 6.

## 6. Intégration

Si le site a des pages HTML : insérer chaque image avec `alt` factuel de 8 à 15 mots, `width` et `height`, `loading="lazy"` sous la ligne de flottaison, hero en `eager`. Référencer `og-image` dans `og:image` (URL absolue). Mettre à jour `sections.md` / `arborescence.md` si l'image y figure.

Clôture : lister les fichiers (chemin, taille, dimensions) et suggérer `seo-audit-code` pour contrôler les `alt`.
