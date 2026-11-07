---
name: comptes
description: "Liste, fait créer et vérifie les comptes et outils nécessaires au projet (GitHub, Vercel, Resend, Airtable, Ghost/PikaPods, Buffer, analytics, outils design) selon les modules choisis. Déclencheurs : quels comptes créer, préparer mes outils, vérifier mes comptes."
---

# Comptes et outils du projet

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md).

But : avant de construire, l'élève a tous les comptes dont il aura besoin, et seulement ceux-là. Rien ne bloque en plein milieu d'une étape parce qu'il manque un compte.

## 1. Calculer la liste

Lire `.studio/state.json` (modules, outils choisis, situation). Absent : demander quels modules sont prévus (design, site, formulaire, blog, réseaux, analytics), une question à la fois.

Construire la liste à partir de `${CLAUDE_SKILL_DIR}/references/catalogue-comptes.md` : un compte entre dans la liste si sa condition est vraie. Le classer :

- **Bloquant maintenant** : nécessaire au prochain module.
- **Plus tard** : nécessaire à un module suivant ; on peut le créer maintenant pour fluidifier, ou attendre.
- **Optionnel** : utile mais pas indispensable (nom de domaine, Search Console).

Afficher un tableau : service, à quoi il sert en une phrase, gratuit ou payant, statut (à créer / déjà fait / à vérifier), classement. Demander si l'élève a déjà certains comptes.

## 2. Faire créer, un compte à la fois

Pour chaque compte à créer, dans l'ordre du catalogue (GitHub d'abord, car plusieurs services se connectent avec GitHub) :

1. Dire à quoi il sert et ce que ça coûte.
2. Donner le lien d'inscription et la méthode conseillée (ex. « Continuer avec GitHub » sur Vercel).
3. Donner les réglages à ne pas rater (catalogue).
4. Attendre « c'est fait ».
5. **Vérifier** avec la commande ou le test du catalogue. Échec : diagnostiquer (mauvais compte, e-mail non confirmé, CLI non connectée) avant de passer au suivant.
6. Noter le statut dans `comptes` de `.studio/state.json` (`ok`, `a_creer`, `plus_tard`, `inutile`). Jamais de clé, de mot de passe ni de jeton dans ce fichier.

L'élève crée ses comptes lui-même : l'agent ne remplit jamais un formulaire d'inscription, ne saisit jamais de mot de passe et ne demande jamais une clé dans le chat. Une clé API se colle par l'élève dans le terminal (variable d'environnement, `vercel env add`) ou dans le tableau de bord du service.

## 3. Outils sur l'ordinateur

Vérifier avec les commandes du catalogue (section « Outils locaux ») et proposer l'installation de ce qui manque, en expliquant chaque commande avant de la lancer. Sur Windows, privilégier les installateurs officiels ou `winget` ; sur Mac, `brew` si présent, sinon l'installateur officiel.

## 4. Bilan

Afficher le tableau final (tout `ok`, ou ce qui reste en `plus_tard` avec le module qui en aura besoin). Revenir à `demarrer` ou au pilote qui a appelé ce skill.

## Relance

Ce skill peut être relancé à tout moment (« vérifie mes comptes ») : il re-teste chaque compte marqué `ok` et signale ce qui a expiré (jeton Buffer, connexion Vercel, clé révoquée).
