---
name: blog-knowledge-base
description: "Crée et tient à jour knowledge.json, la base de faits vérifiés (prix, versions, chiffres, infos entreprise) injectée dans la rédaction pour éviter les inventions. Déclencheurs : base de connaissances, faits à jour."
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Skills liés : `blog-article`, `blog-batch` (Claude : outil Skill ; Codex : `$nom` ou lecture du `SKILL.md`).

# Base de connaissances factuelle du blog

Un fichier `knowledge.json` à la racine du projet, source unique de vérité injectée dans le prompt de rédaction (P2) de `blog-article` et `blog-batch`. Le modèle reste libre sur la forme, mais n'utilise que ces faits pour tout chiffre, prix, version ou statistique.

## Structure

Fichier lisible par un non-développeur, versionné dans git. Champs :

- `validated_at` : date ISO de la dernière validation manuelle.
- `version` : entier incrémenté à chaque mise à jour.
- `pricing` : tarifs des outils souvent cités.
- `models` : versions de modèles IA, fenêtre de contexte, date de sortie.
- `ecosystem` : description courte des produits et services cités.
- `business` : infos sur l'entreprise ou l'offre de l'élève (offres, prix, certifications, ancienneté, chiffres).
- `rules` : règles de rédaction.

Exemple de forme (valeurs fictives, à remplacer par des faits vérifiés à la source) :

```json
{
  "validated_at": "AAAA-MM-JJ",
  "version": 1,
  "pricing": {
    "outil-a": { "pro": { "price_eur_per_month": 0, "source": "https://…" } },
    "note": "Les prix évoluent : préférer « à partir de » à un montant absolu."
  },
  "models": { "outil-a": { "modele-x": { "context": "…", "released": "AAAA-MM" } } },
  "ecosystem": { "produit-b": "Description factuelle en une phrase." },
  "business": { "offre": "…", "apprenants": "…" },
  "rules": [
    "Ne jamais citer un prix exact sans le qualifier (« à partir de », « environ »).",
    "Ne jamais inventer une statistique : si elle n'est pas dans la KB, écrire « la majorité », « beaucoup de » ou l'omettre.",
    "Ne jamais attribuer une citation sans source explicite.",
    "Pour les fonctionnalités produit, n'utiliser que la section ecosystem."
  ]
}
```

Chaque fait qui change vite porte sa `source` (URL officielle). Ne jamais remplir la KB de mémoire : ouvrir la page officielle de l'outil.

## Injection dans le prompt P2

Sérialiser la KB en JSON dans le message utilisateur, **avant** les instructions créatives (ton, format, longueur) et avant le `linking_context` (voir `blog-cocon`). Ouverture stricte :

> KNOWLEDGE BASE (validée le {validated_at}) : utilise EXCLUSIVEMENT ces faits pour tout chiffre, prix, statistique ou version. Si une info manque : OMETS-LA ou utilise un conditionnel (« environ », « à partir de »).

## Maintenance

- Qui : l'élève ; aucune mise à jour automatique (les sources changent trop souvent).
- Quand : au moins chaque trimestre, et à chaque annonce touchant un outil cité (nouveau modèle, refonte tarifaire, nouvelle offre).
- Comment : éditer `knowledge.json`, incrémenter `version`, mettre `validated_at` à la date du jour, commiter avec un message explicite (`chore(kb): prix outil-a mis à jour`).
- Après une mise à jour : relire les articles existants qui citent le fait modifié et les rafraîchir avant de publier le suivant.

## Limite

La KB réduit la surface d'erreur sans la supprimer : le modèle peut halluciner sur un point annexe qu'elle ne couvre pas. Garde-fou complémentaire : statut Ghost forcé à `draft` et relecture humaine des chiffres, citations, dates et noms propres avant publication.
