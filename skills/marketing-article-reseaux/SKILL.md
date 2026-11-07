---
name: marketing-article-reseaux
description: "Transforme un article publié en 3 à 5 posts (un angle par réseau, ton par réseau), avec une image chacun, en brouillons datés dans Buffer après validation. Déclencheurs : diffuser un article, article en posts. Jamais de publication directe."
---

`${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Questions à l'utilisateur : `AskUserQuestion` (Claude) ou question dans le chat (Codex). Buffer, le blog et la génération d'images sont décrits comme services connectés, quel que soit le nom de leurs outils. Autre skill : lire son SKILL.md dans le dossier skills du runtime.

# Un article, jusqu'à cinq posts

> Images : utiliser l'outil d'image disponible dans la session (par exemple l'outil image de Codex inclus dans un abonnement ChatGPT) ; à défaut, les photos fournies par l'élève ou une banque libre de droits (Unsplash, Pexels). Un service payant (fal.ai ou autre) seulement si l'élève l'a choisi, avec le coût estimé annoncé avant chaque lot et son accord. Une image générée l'est entière : texte et logo passent par le prompt ou par le HTML de la page, jamais collés par-dessus l'image après coup.

L'article est la source, les posts sont des portes d'entrée : chacun donne envie de lire l'article, aucun ne le résume. Durée : environ 10 min.

Marque : celle de l'élève. Lire `.studio/state.json` et `.studio/cadrage.md` (projet, persona, objectif, ton) ; n'annoncer que des offres qui existent vraiment. Pour écrire un post seul sans article, utiliser `copywriting` puis `redaction-naturelle`.

## Garde-fous

- `saveToDraft: true` sur chaque post, sans exception : rien n'est publié ni mis en file directement. L'utilisateur approuve dans Buffer, un post après l'autre.
- Validation humaine des textes avant le push ; pas de mode automatique.
- Pas de tiret cadratin ni demi-cadratin dans les posts (signe typique d'un texte écrit par une IA) : virgules, deux-points, parenthèses, points. Nettoyer avant le push, puis passer chaque texte par `redaction-naturelle`.
- Un `channelId` vient toujours de la liste des canaux du service, jamais deviné.

## Prérequis

Lire `buffer.json` et `blog.json` à la racine du projet : ne pas redemander ce qu'ils contiennent.

| Élément | Si absent |
|---|---|
| `buffer.json` + service Buffer | bloquant : `marketing-connect-buffer` |
| `blog.json` + service du blog | non bloquant : `marketing-connect-blog`, ou texte collé |
| service de génération d'images | mode dégradé sans image (Instagram sera refusé) |
| ton de la marque (`.studio/state.json` champ `ton`) | le demander à l'étape 2 |
| préférences réseaux (`.studio/marketing/reseaux.json`) | les demander à l'étape 2, puis les enregistrer |

## Checklist

- [ ] 1. Article source
- [ ] 2. Réseaux
- [ ] 3. Dates
- [ ] 4. Posts, validation
- [ ] 5. Images
- [ ] 6. Push en brouillon
- [ ] 7. Rapport

## 1. Article source

URL, slug, « le dernier » (blog branché) ou texte collé. Il faut titre, URL publique et corps : chaque post pointe vers l'URL. Article de moins de 300 mots : proposer 3 posts au lieu de 5.

## 2. Réseaux, fréquence et ton

Si `.studio/marketing/reseaux.json` existe : l'afficher en une ligne (« LinkedIn + Instagram, 2 posts par semaine, ton pro chaleureux sur LinkedIn, je garde ? ») et passer à la suite. Sinon, poser ces questions UNE à la fois, avec des choix (Claude : AskUserQuestion, option recommandée en premier ; Codex : choix numérotés), en expliquant en une phrase pourquoi on demande :

1. **Sur quels réseaux es-tu (ou veux-tu être) actif ?** (choix multiples) LinkedIn, Instagram, Facebook, X, Threads. Conseil à donner : deux réseaux bien tenus valent mieux que cinq abandonnés ; partir du réseau où se trouve le persona du cadrage. Option « je ne sais pas, propose-moi » : proposer 1 ou 2 réseaux d'après le persona et l'objectif.
2. **À quel rythme peux-tu tenir ?** 1 post par semaine, 2 à 3 par semaine (recommandé pour démarrer), 1 par jour ouvré. Expliquer : la régularité compte plus que le volume.
3. **Quel ton par réseau ?** Pour chaque réseau retenu, proposer un ton par défaut tiré des 3 adjectifs du cadrage (ex. LinkedIn : expert et posé ; Instagram : chaleureux et visuel) et demander « je garde ou tu ajustes ? ». Préciser aussi tutoiement ou vouvoiement.

Enregistrer les réponses dans `.studio/marketing/reseaux.json` :

```json
{ "reseaux": ["linkedin", "instagram"], "rythme": "2-3/semaine", "tons": { "linkedin": "expert, posé, vouvoiement", "instagram": "chaleureux, tutoiement" } }
```

Puis lire le compte Buffer (organisation, fuseau, heure locale) et ses canaux ; ne garder que les canaux des réseaux choisis. Le plan limite canaux et posts en file (limites données par le compte) : si le quota est de 3 canaux, faire 3 posts. Garder la liste `{channelId, service, nom}`.

## 3. Dates

Par défaut : étaler les posts selon le rythme choisi à l'étape 2 (2 à 3 par semaine : un post tous les deux jours ouvrés), 9 h locale. `dueAt` en ISO 8601 avec décalage (`AAAA-MM-JJThh:mm:ss±hh:mm`), fuseau et heure courante issus du compte, toujours dans le futur. Afficher et laisser ajuster.

## 4. Posts

Un post par réseau, un angle différent chacun, jamais le même texte décliné :

1. le problème (la douleur que l'article résout) ;
2. le contre-pied (une croyance que l'article démonte) ;
3. l'histoire (cas concret, avant/après, chiffre vécu) ;
4. la liste (trois points numérotés) ;
5. la coulisse (comment on en est arrivé à écrire ça).

Le ton de chaque post suit `reseaux.json` ; le tableau donne seulement la longueur et le format.

| Réseau | Longueur | Ton par défaut | Image |
|---|---|---|---|
| LinkedIn | 150 à 250 mots, lignes courtes | professionnel, première personne, une leçon | 1200 × 627 |
| X | 280 caractères ou fil court | direct, une idée par tweet | 16:9 |
| Instagram | 100 à 150 mots | visuel d'abord | 4:5 |
| Threads | 100 à 200 mots | conversationnel, une question | 1:1 |
| Facebook | 100 à 200 mots | accessible, narratif | 1200 × 627 |

Un seul appel à l'action par post, avec l'URL de l'article. Afficher réseau, angle, date et texte, puis attendre : `ok`, `<n> : consigne` pour ajuster, `retirer <n>`, `annuler`. Reboucler jusqu'à `ok`.

## 5. Images

Un prompt visuel par post, qui traduit l'angle du post et non le sujet générique (cinq images semblables = une seule image). Générer avec l'outil d'image retenu (voir l'encadré Images ; `outils.images` dans `.studio/state.json`), au format du réseau (16:9, 4:5, 1:1). Pas de texte ni de logo ajouté par-dessus l'image après génération. Échec pour un post : continuer sans image et le signaler. Instagram exige une image : en cas d'échec, retirer ce post.

Buffer récupère le média à la publication : l'URL doit être publique et stable jusqu'à l'envoi (pas d'URL signée ou expirante). Si l'URL du générateur ne le garantit pas, héberger l'image sur un stockage public permanent avant le push. Écrire pour chaque image un texte alternatif descriptif (pas le prompt).

## 6. Push

Pour chaque post, créer le post via le service Buffer avec : `channelId`, `text` nettoyé, `assets: [{ image: { url, metadata: { altText } } }]` (omis sans image), `mode: "customScheduled"`, `dueAt`, `schedulingType: "automatic"` (obligatoire ; sur X le mode rappel `notification` est refusé), `saveToDraft: true`. Instagram exige un compte professionnel (Business ou Creator) pour la publication automatique ; le mode `notification` ne vaut que pour Instagram, TikTok, YouTube et les groupes Facebook (aide Buffer, « notification publishing »).

Vérifier la réponse de chaque création : statut brouillon, canal et date attendus. Erreur : noter réseau et cause, ne pas réessayer en boucle.

## 7. Rapport

Afficher l'article, puis pour chaque post : réseau, date, angle, image OK ou non ; les échecs avec raison. Conclure : les brouillons attendent dans Buffer, rien ne part tant que l'utilisateur n'a pas approuvé. Pour répéter chaque semaine, créer une routine planifiée du runtime (Claude Code : `/schedule`) qui rejoue ce skill sur le dernier article ; le brouillon et la relecture restent obligatoires.

Vérification finale : angles distincts, URL et CTA unique dans chaque post, aucun cadratin, `channelId` issus de la liste, `dueAt` futurs, `saveToDraft: true` sur tous, textes validés avant le push.
