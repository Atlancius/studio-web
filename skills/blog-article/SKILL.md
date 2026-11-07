---
name: blog-article
description: "Écrit un article du cocon : brief, rédaction, image hero, envoi dans Ghost en brouillon, mise à jour de cocon.json. Déclencheurs : écris l'article suivant, nouvel article de blog."
---

Chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : dossier de ce SKILL.md). Équivalences : sous-agent = outil Agent (Claude) ou `spawn_agent` (Codex) ; skill cité = outil Skill (Claude) ou lecture de son SKILL.md / `$nom` (Codex) ; question à la personne = message dans le chat ; MCP Ghost = les outils du service Ghost, quel que soit leur nom ; outil d'image = celui choisi au cadrage (`outils.images` de `.studio/state.json`).

> Images : utiliser l'outil d'image disponible dans la session (par exemple l'outil image de Codex inclus dans un abonnement ChatGPT) ; à défaut, les photos fournies par l'élève ou une banque libre de droits (Unsplash, Pexels). Un service payant (fal.ai ou autre) seulement si l'élève l'a choisi, avec le coût estimé annoncé avant chaque lot et son accord. Une image générée l'est entière : texte et logo passent par le prompt ou par le HTML de la page, jamais collés par-dessus l'image après coup.

# Article du cocon : P1, P2, image, Ghost draft

Les fichiers du projet sont à sa racine : `cocon.json`, `knowledge.json`, `brief.md`. Prompts et schémas : [references/prompts.md](references/prompts.md). Sanitizer et limites : [references/sanitize.md](references/sanitize.md). Skills liés : `blog-knowledge-base`, `blog-link-validation`, `blog-cocon` (structure de `cocon.json`).

## Garde-fous (jamais contournés)

- Statut Ghost toujours `draft` ; la personne relit et publie à la main dans l'admin Ghost.
- `knowledge.json` obligatoire pour P2 ; absent : arrêter et proposer d'en créer un squelette (voir `blog-knowledge-base`).
- Validation des liens internes obligatoire avant le push.
- Génération dans la session (modèle courant ou un sous-agent) : ni clé API, ni nom de modèle codé en dur, ni boucle qui consomme des crédits en plus de l'abonnement.

## Checklist

Copier et cocher :
- [ ] 1. Pré-requis vérifiés
- [ ] 2. Contexte chargé, petite-fille choisie
- [ ] 3. `linking_context` et whitelist construits
- [ ] 4. Brief P1 généré, validé par la personne
- [ ] 5. Article P2 généré
- [ ] 6. Sanitizer + clamp appliqués
- [ ] 7. Liens validés
- [ ] 8. Image hero (ou mode dégradé annoncé)
- [ ] 9. Post Ghost créé en `draft`
- [ ] 10. `cocon.json` mis à jour
- [ ] 11. Rapport final affiché

## 1. Pré-requis

Vérifier, et rediriger si absent (reprendre ensuite ici) :
- `cocon.json` existe et se parse (`mere`, `filles[]`, `filles[].petites_filles[]`) : sinon `blog-cocon`.
- Ghost en place et outil MCP Ghost disponible : sinon `blog-setup-ghost`.
- Thème Ghost actif : sinon `blog-theme`.
- Outil d'image disponible (voir encadré Images) : s'il manque, avertir et continuer sans image (le post aura une `feature_image` vide, à ajouter dans Ghost) après accord de la personne.

## 2. Contexte et choix de la petite-fille

1. Lire `cocon.json`, `knowledge.json` (obligatoire) et `brief.md` (marque, sujet, public pour les variables du prompt).
2. Lister les petites-filles `planned` ou `draft`, groupées par pilier, numérotées, avec keyword et statut. Demander laquelle écrire ; par défaut : la première `planned` du pilier qui a le plus d'articles `published` ou `draft`.
3. Petite-fille déjà `draft` : demander s'il faut régénérer (mettre à jour le post existant via `ghost_id` avec l'outil d'édition de post, jamais un doublon) ou annuler.
4. Retenir : slug, keyword, titre, persona, intent, pilier, `cta_principal`.

## 3. Linking context et whitelist

Depuis `cocon.json` : mère (`/<mere-slug>`), pilier-parent (`/blog/pilier/<pilier-slug>`), 2 ou 3 piliers-sœurs les plus proches thématiquement, `linked_outils[]` du pilier-parent, CTA principal.

Lister les slugs déjà publiés avec l'outil Ghost (browse des posts, filtre `status:published`, champ `slug`, toutes les pages) et construire la whitelist `ALLOWED_URLS` selon `blog-link-validation` (mère, piliers, articles publiés `/blog/<slug>`, outils, CTA, pages structurelles du site).

## 4. Brief P1

Générer avec le system prompt P1 de `references/prompts.md` (variables de marque remplies) et le message utilisateur P1. Valider le JSON contre `BRIEF_SCHEMA`.

Afficher le brief (H1, promesse, intent, ton, plan H2 avec ce que couvre chaque H2, takeaways, ancres suggérées) et demander : `accepter` / `modifier` (champ à ajuster) / `regenerer` (avec instruction en plus). Passer à P2 seulement sur `accepter`.

## 5. Article P2

Générer avec le system prompt P2 et le message utilisateur P2 (KB en premier, puis brief, whitelist, contraintes). Valider le JSON contre `ARTICLE_SCHEMA`.

## 6. Sanitizer

Appliquer `sanitizeArticle` puis `clampToWord` ([references/sanitize.md](references/sanitize.md)). Contrôle : plus aucun cadratin ni demi-cadratin, longueurs sous les maxima.

## 7. Validation des liens

Appliquer l'algorithme de `blog-link-validation` sur `html` avec `ALLOWED_URLS` et le pilier-parent comme repli. Garder le rapport (total, internes, externes, réécrits). Attendu : 4 à 6 liens internes ; plus de 2 réécritures signale une whitelist incomplète.

## 8. Image hero

Générer une image au format 16:9 (environ 2 000 px de large, JPEG) avec `feature_image_prompt` comme prompt, via l'outil d'image retenu (encadré Images). Service payant (ex. fal.ai, modèle `fal-ai/nano-banana-2`) : seulement si l'élève l'a choisi, coût annoncé avant. Pas d'outil : proposer une photo de l'élève ou d'une banque libre. Envoyer le fichier avec l'outil d'upload d'image de Ghost et garder l'URL Ghost (le blog ne dépend plus du générateur). Échec : continuer sans image et le dire dans le rapport.

## 9. Post Ghost en draft

Créer le post avec l'outil Ghost (création de post depuis du HTML, `source=html`) : `title` = `meta_title`, `slug` = slug de la petite-fille, `html`, **`status: "draft"`**, `feature_image` (ou vide), `tags` = `primary_tag` puis `tags`, `meta_title`, `meta_description`, `custom_excerpt`, `og_title`, `og_description`. La conversion HTML vers le format interne de Ghost est lossy : vérifier le rendu dans l'éditeur. Relever l'identifiant du post.

## 10. Mise à jour de `cocon.json`

Sur la petite-fille : `status: "draft"`, `ghost_id`, `drafted_at` (ISO). Réécrire le fichier entier avec une indentation de 2 espaces, après avoir vérifié que le JSON obtenu se parse.

## 11. Rapport final

Afficher : titre, slug, pilier, statut `draft`, lien d'édition dans l'admin Ghost, URL publique à venir, rapport de liens (réécritures listées), état de l'image, tokens si connus. Terminer : relire dans Ghost et cliquer « Publish » à la main ; suites possibles `blog-status`, article suivant, `blog-batch`.

## Boucle de reprise

Une étape échoue : corriger la cause, rejouer cette étape seulement, ne pas avancer tant que sa vérification ne passe pas. Deux échecs de la même étape : arrêter, exposer l'erreur exacte à la personne.
