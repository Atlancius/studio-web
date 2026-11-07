---
name: ux-copy
description: "Écrit ou relit les petits textes d'interface : boutons, messages d'erreur, états vides, confirmations, infobulles, formulaires, textes d'accueil. Pas les textes de vente (copywriting). Déclencheurs : texte de bouton, message d’erreur."
argument-hint: "<contexte ou texte à relire>"
---

# Textes d'interface (UX copy)

Convention de chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Questions à l'utilisateur : AskUserQuestion (Claude Code) ou question dans le chat (Codex).

Les petits textes dans le site ou l'app. Les textes de conversion (landing, emails, pubs, titres) passent par `copywriting`.

## Entrées

Les prendre dans la demande, l'écran ou les fichiers du projet ; ne demander que ce qui manque et change la formulation :

- Contexte : quel écran, quel parcours, quelle fonction (formulaire de contact, inscription newsletter, page 404…).
- État de l'utilisateur : ce qu'il essaie de faire, ce qu'il ressent (bloqué, inquiet, terminé).
- Ton et contraintes : limite de caractères, langue, tutoiement ou vouvoiement.
- Voix : lire `.studio/state.json` (champ `ton`) et `.studio/cadrage.md` s'ils existent ; sinon reprendre les termes et le ton déjà présents sur le site. Demander seulement si rien n'existe (une question, avec des choix).

## Principes

1. Clair : dire exactement ce qui se passe, sans jargon.
2. Concis : le moins de mots possible sans perdre le sens.
3. Cohérent : un seul terme par notion dans tout le site.
4. Utile : chaque mot aide la personne à finir sa tâche.
5. Humain : écrire comme une personne serviable, pas comme un système.

## Modèles

- **Bouton d'action** : un verbe + le résultat (« Recevoir le guide », « Enregistrer »), jamais « Valider » ou « Envoyer » seuls quand on peut être précis.
- **Erreur** : ce qui s'est passé + pourquoi + comment corriger. Exemple : « Adresse email incomplète. Il manque le @. Vérifie et réessaie. » Ne jamais accuser la personne ; jamais de code technique comme message.
- **État vide** : ce qu'est cet endroit + pourquoi il est vide + comment commencer.
- **Confirmation** : l'action et sa conséquence (« Supprimer 3 fichiers ? C'est définitif. ») ; boutons nommés par l'action (« Supprimer » / « Garder »), pas « OK » / « Annuler ».
- **Formulaire envoyé** : confirmer ce qui va se passer et quand (« Merci, je te réponds sous 48 h. »).
- **Infobulle** : courte, ajoute ce que le libellé ne dit pas.
- **Chargement** : dire ce qui se passe et combien de temps.
- **404** : dire que la page n'existe pas et proposer un chemin (accueil, recherche, contact).

Ton par moment : succès, content mais sobre ; erreur, empathique et concret ; avertissement, clair ; neutre, informatif.

## Processus

1. Fixer contexte, état de l'utilisateur, ton et limites.
2. Proposer le texte recommandé et 2 variantes de ton différent.
3. Vérifier : même terme qu'ailleurs, limite respectée, verbe sans ambiguïté, chaque bouton compréhensible hors contexte.
4. En relecture : citer chaque ligne, nommer le problème, donner la réécriture.

## Sortie

```markdown
## Textes d'interface : [contexte]

### Texte recommandé
**[Élément]** : [texte]

### Variantes
| Option | Texte | Ton | Idéal pour |
|--------|-------|-----|------------|
| A | | | |
| B | | | |

### Pourquoi
[état de l'utilisateur, clarté, action]

### Notes de traduction
[expressions à éviter, texte plus long dans une autre langue]
```
