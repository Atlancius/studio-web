---
name: site-formulaire
description: "Rend le formulaire du site opérationnel : chaque envoi est stocké dans Airtable et déclenche deux emails Resend, via une fonction Vercel. Déclencheurs : formulaire de contact, newsletter, inscription, le formulaire ne marche pas."
---

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion` ; Codex : choix numérotés dans le chat). Services Vercel, Resend, Airtable : par leur connecteur (MCP) s'il est branché, sinon par la CLI Vercel (`npx vercel …`) et les tableaux de bord resend.com et airtable.com.

# Formulaire opérationnel (Resend + Airtable + Vercel Function)

Transforme le `<form>` placeholder du site en formulaire qui stocke chaque soumission dans Airtable et envoie deux emails (bienvenue au visiteur, notification au propriétaire). Code, schéma Airtable et script client : [references/function-template.md](references/function-template.md) (à lire avant l'étape 4). Règles d'envoi Resend : [references/resend.md](references/resend.md).

## Checklist

- [ ] 1. Services connectés
- [ ] 2. Infos collectées
- [ ] 3. Base Airtable créée
- [ ] 4. Function générée
- [ ] 5. Variables Vercel posées
- [ ] 6. HTML branché
- [ ] 7. Preview déployée et testée de bout en bout

## 1. Services

Vérifier l'accès à Vercel (projet du site), Resend et Airtable (voir `comptes` dans `.studio/state.json`). Compte absent : s'arrêter, dire lequel manque et lancer `comptes` pour le créer, sans continuer à moitié.

## 2. Infos à demander

1. Nom de la base Airtable (proposer une valeur selon le type de site : « Inscrits newsletter », « Demandes de contact »).
2. Adresse qui reçoit les notifications.
3. Contenu de l'email de bienvenue (ou lignes directrices : texte simple, lien vers une ressource, PDF).
4. Slug de la Function : `/api/subscribe` (landing) ou `/api/contact` (site multi-pages).
5. Adresse d'envoi : domaine vérifié dans Resend (DKIM + SPF) de forme `Marque <adresse@domaine>`. Domaine perso non vérifié : proposer de le faire d'abord ; sans domaine vérifié, l'envoi reste un test et ne part pas en production.

## 3. Base Airtable

Créer la base et la table avec les colonnes du schéma (landing ou contact) de la référence. Noter l'ID de base (`app…`) et le nom de table. Aucune colonne IP : donnée personnelle inutile ici.

Le jeton Airtable (PAT) se crée dans la console développeur Airtable, avec le seul scope `data.records:write` et uniquement sur cette base. L'utilisateur le colle directement dans Vercel (étape 5), jamais dans le chat.

## 4. Function

Générer `api/subscribe.mjs` ou `api/contact.mjs` depuis la référence, en adaptant `FIELDS`, les sujets et le texte d'email aux réponses de l'étape 2. Aucune dépendance npm. Comportements à conserver :

- POST seulement ; entrée validée côté serveur (email, longueurs) ; honeypot anti-spam.
- Airtable d'abord : s'il échoue, pas d'email et réponse 502.
- Emails ensuite ; un échec d'email est loggé (statut seul) sans casser la réponse.
- Valeurs échappées dans le HTML des emails ; aucun email de visiteur dans les logs.

## 5. Variables d'environnement

Poser sur `production`, `preview` et `development` : `RESEND_API_KEY`, `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME`, `RESEND_FROM_EMAIL`, `NOTIFY_EMAIL`. Les trois clés/jetons en type Secret : l'élève les ajoute lui-même dans Vercel > projet > Settings > Environment Variables, ou dans son terminal avec `npx vercel env add NOM production` (la valeur se tape au clavier, pas dans le chat) ; les trois autres en Config. Ne jamais afficher une valeur, ni la mettre dans un fichier versionné ni dans un prompt ; `.env*` reste hors commit. Une clé créée par un outil (clé Resend créée via un connecteur) passe directement vers Vercel sans être affichée.

## 6. HTML

Repérer le fichier du `<form>` (`index.html` pour une landing, `contact.html` pour un site). Remplacer le formulaire et ajouter le script client de la référence (champs du schéma, message de succès/erreur stylé selon la charte, honeypot hors écran).

## 7. Test

Déployer une preview (`npx vercel`). Preview qui demande une connexion Vercel (401 ou redirection) : tester connecté au compte Vercel dans le navigateur, ou désactiver la protection dans Vercel > projet > Settings > Deployment Protection le temps du test. Faire soumettre le formulaire avec l'adresse de l'utilisateur, puis vérifier : message de succès, ligne dans Airtable, email de bienvenue reçu, notification reçue. Échec : lire les logs de la fonction (`npx vercel logs <url>` ou onglet Logs du projet), corriger, redéployer, recommencer ; les causes usuelles sont une variable mal nommée, un nom de table Airtable faux, un `from` non vérifié.

Fin : rappeler que les secrets restent dans Vercel et que la suite est `pages-legales`, `seo-audit-code`, puis la mise en production (`site-pilote`, phase 6).
