---
name: pages-legales
description: "Mentions légales, politique de confidentialité, cookies, CGU, CGV d'un site (France/UE) : rédige ou audite ces textes d'après le cadrage et ce que le site fait vraiment (formulaire, analytics, newsletter, paiement). Pas un avis juridique."
argument-hint: "[--audit]"
---

# Textes légaux alignés sur le code

Chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier qui contient ce SKILL.md). Questions à l'utilisateur : outil AskUserQuestion (Claude) ou question dans le chat (Codex). Suivi : TodoWrite (Claude) ou `update_plan` (Codex).

Produit les textes légaux d'un site ou d'un produit (mentions légales, politique de confidentialité, cookies, CGU, CGV) qui décrivent ce que le code fait vraiment, puis prouve l'alignement texte ↔ code. Par défaut : droit français et européen, textes en français. `--audit` : étapes 1, 2 et 6 seulement, sur les textes existants, sans rien écrire.

**Pas un avis juridique.** Le rapport final le dit en une phrase et recommande une relecture par un professionnel avant mise en ligne.

## Checklist

```text
- [ ] 1. Cadrage : cadrage et brief lus, statut, collectes, vente, marché, pages existantes repérées
- [ ] 2. Inventaire : script lancé, chaque indice confirmé dans le code, registre des traitements dressé
- [ ] 3. Identité de l'éditeur collectée (point de contrôle)
- [ ] 4. Documents à produire choisis
- [ ] 5. Textes écrits dans les fichiers réellement affichés
- [ ] 6. Audit d'alignement texte ↔ code à zéro écart (boucle)
- [ ] 7. Rapport livré
```

## 1. Cadrer (interactif)

Lire d'abord ce qui existe : `.studio/state.json`, `.studio/cadrage.md`, `brief.md`, `PRD.md` (racine ou `docs/`). Annoncer en une ligne ce qui est déjà connu (« site vitrine en français, formulaire de contact et Google Analytics prévus, je pars de là ? »). Puis poser seulement les questions manquantes, UNE à la fois, avec des choix (Claude : AskUserQuestion, option recommandée en premier ; Codex : choix numérotés), chacune avec une phrase qui explique pourquoi :

1. **Qui publie le site ?** Particulier (projet perso, sans activité commerciale), micro-entreprise / entreprise individuelle, société (SAS, SARL…), association. Explication : ça change les mentions obligatoires (SIRET, RCS, capital) et l'adresse affichée.
2. **Que collecte le site ?** (choix multiples, prérempli avec ce que les modules du cadrage prévoient) formulaire de contact, inscription newsletter, mesure d'audience (Google Analytics ou Plausible), comptes utilisateurs, paiement ou vente en ligne, commentaires ou avis, rien du tout. Explication : chaque collecte doit être décrite dans la politique de confidentialité.
3. **Tu vends quelque chose en ligne ?** Non (vitrine), oui à des particuliers, oui à des professionnels. Explication : la vente aux particuliers impose des CGV, le droit de rétractation et un médiateur.
4. **Public et pays** : France seulement (recommandé par défaut), UE, hors UE.

Marché hors UE (États-Unis, CCPA, arbitrage) : seulement si l'élève le vise, et à faire valider par un juriste du pays.

## 2. Inventorier les traitements réels

Exécute l'inventaire (lecture seule, aucune valeur de `.env`) :

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/inventaire-traitements.sh" <racine-du-projet>
```

Sortie Markdown sur stdout, 15 fichiers par catégorie (`INVENTAIRE_MAX=<n>` pour tout voir) ; code 2 = erreur d'usage. Le script ne donne que des indices `chemin:ligne`. Ouvre chaque emplacement et confirme : SDK réellement appelé, données envoyées, moment (avant ou après consentement), région du service. Dresse le **registre des traitements**, source de vérité des textes :

| Donnée | Finalité | Base légale (RGPD art. 6) | Destinataire ou sous-traitant, pays | Durée | Preuve `chemin:ligne` |
|---|---|---|---|---|---|

Une ligne sans preuve dans le code ne se déclare pas ; un traitement trouvé dans le code et absent du cadrage s'ajoute, et se signale. Site pas encore construit : partir des réponses de l'étape 1 et marquer chaque ligne « à confirmer après le build », puis relancer ce skill en `--audit` une fois le site en ligne.

## 3. Identité de l'éditeur (point de contrôle)

Demande en une seule fois ce qui manque : nom ou dénomination, forme et capital, adresse, téléphone, immatriculation (RCS, RNE ou SIRET), TVA intracommunautaire, directeur de la publication, email de contact, hébergeur de chaque brique (front, base, fichiers), médiateur de la consommation si vente B2C.

- Préviens avant d'écrire : nom et adresse deviennent publics, c'est une obligation légale. Contournements : publier via une société ou une domiciliation commerciale. Particulier sans activité professionnelle : il peut ne publier que le nom de l'hébergeur et garder son identité chez l'hébergeur (LCEN, article 6) ; vérifier l'article en vigueur sur Légifrance.
- Aucun texte final avec un champ vide, `[Company]` ou valeur inventée : un document dont une mention obligatoire manque n'est pas écrit, il est listé au rapport.

## 4. Choisir les documents

Applique [exigences.md](references/exigences.md) §1 (situation constatée → document), puis le contenu minimal de chaque document dans la section correspondante. Ouvre §8 pour une app mobile, §9 si le produit appelle une IA, §10 avant de reprendre une clause d'un modèle anglo-saxon.

## 5. Écrire dans les fichiers réellement affichés

- Cible : les pages que l'application rend (route, composant, MDX). Vérifie qu'un champ de configuration qui « ressemble » à la source des textes est vraiment lu (`grep` de son nom hors de sa définition) ; un champ que rien ne lit ne change rien à l'écran.
- Site HTML du pack (`site-build`) : écris `mentions-legales.html` et `confidentialite.html` (et `cgv.html` si vente) avec le header et le footer communs du site, et ajoute leurs liens au footer.
- Aucune page légale dans le code : écris des fichiers Markdown à la racine (`mentions-legales.md`, `politique-confidentialite.md`, `cgu.md`, `cgv.md`) et signale qu'il reste à les publier.
- Une langue par site : si le produit est en anglais pour un public français, demande avant de mélanger.
- Mise en œuvre du consentement (aucun script de mesure avant l'accord) : le skill `analytics-setup` s'en charge. Ce skill n'écrit pas de code applicatif.

## 6. Auditer l'alignement texte ↔ code (boucle)

Pour chaque document, jusqu'à zéro écart :

1. Chaque affirmation du texte (donnée, sous-traitant, durée, droit offert, bouton de suppression, export, rétractation) a sa preuve dans le registre.
2. Chaque ligne du registre apparaît dans le texte.
3. Traces d'un modèle hérité dans les fichiers rendus : section « Textes hérités ou à compléter » de l'inventaire et `grep` des identités d'un autre éditeur (société, ville, nom d'app) → zéro ligne.
4. Écart → corrige le texte ; si c'est le code qui manque à la loi (suppression qui n'anonymise que l'email, export absent, traceur avant consentement, pas de fonction de rétractation en ligne), garde le texte vrai et note l'écart code au rapport. Ne promets jamais une fonction absente.

Relance l'inventaire et l'étape 6 après chaque correction.

## 7. Rapport

- Fichiers écrits ou à créer, et registre des traitements.
- Écarts code ↔ obligation, chacun avec sa preuve et l'obligation visée.
- Mentions manquantes et points à faire valider (articles dont la version en vigueur n'a pas pu être vérifiée sur Légifrance ou EUR-Lex).
- La phrase : « Ces textes ne constituent pas un avis juridique ; faites-les relire par un professionnel avant mise en ligne. »

## Règles

- Ne jamais lire de fichier `.env` réel ni afficher une valeur de secret ; seuls les noms de clés des fichiers d'exemple comptent.
- N'invente ni durée de conservation, ni sous-traitant, ni base légale : demande, ou marque le point comme ouvert.
- Le droit bouge : relis l'article cité dans [exigences.md](references/exigences.md) au moment de rédiger, et corrige la référence si elle a changé.
