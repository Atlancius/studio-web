# Exigences par document (France et UE)

Contenu minimal attendu de chaque texte, avec son ancrage légal. Ce n'est pas un avis juridique : le droit bouge, relis l'article cité sur Légifrance ou EUR-Lex au moment de rédiger et signale au rapport tout point dont la version en vigueur n'a pas pu être vérifiée.

## Sommaire

1. Quels documents produire
2. Mentions légales
3. Politique de confidentialité
4. Cookies et traceurs
5. CGU
6. CGV vente aux consommateurs (B2C)
7. CGV vente aux professionnels (B2B)
8. Applications mobiles
9. Fonctionnalités d'IA
10. Clauses à ne pas reprendre d'un modèle américain

## 1. Quels documents produire

| Situation constatée (PRD + inventaire) | Document |
|---|---|
| Tout site ou app édité à titre professionnel | Mentions légales |
| Une donnée personnelle est collectée (compte, formulaire, logs, mesure d'audience, email) | Politique de confidentialité |
| Un traceur non exempté est déposé ou lu (analytics, replay, publicité, boutons sociaux) | Section ou page cookies + bandeau de consentement |
| Comptes, contenu publié par les utilisateurs, service gratuit | CGU |
| Vente ou abonnement à des consommateurs | CGV B2C |
| Vente à des professionnels uniquement | CGV B2B |

Un même texte peut regrouper CGU et CGV si les deux publics et les deux régimes restent distincts dans les articles.

## 2. Mentions légales

Ancrage : LCEN, article 1-1 (créé par la loi n° 2024-449 du 21 mai 2024 dite SREN, il reprend l'ancien article 6-III ; sanction pénale à l'article 1-2) ; article 19 pour le commerce électronique. Une source qui cite encore « article 6-III » est antérieure à mai 2024.

- Éditeur personne physique : nom, prénom, domicile, téléphone, numéro d'immatriculation s'il existe, mention « EI » pour un entrepreneur individuel.
- Éditeur personne morale : dénomination, forme, capital, siège, téléphone, numéro RCS ou RNE, numéro de TVA intracommunautaire.
- Email de contact direct ; directeur de la publication.
- Hébergeur : nom ou raison sociale, adresse, téléphone (pour chaque hébergeur réel : front, base, fichiers).
- Activité réglementée : autorité qui a délivré l'autorisation.

L'adresse publiée est réelle : pour ne pas publier son domicile, l'éditeur passe par une société ou une domiciliation commerciale. Dis-le avant de rédiger.

## 3. Politique de confidentialité

Ancrage : RGPD articles 13 (données collectées auprès de la personne) et 14 (données obtenues ailleurs) ; droits des articles 15 à 22.

- Identité et coordonnées du responsable de traitement ; contact du DPO s'il existe.
- Par traitement : données, finalité, base légale (article 6), intérêt légitime poursuivi s'il fonde le traitement.
- Destinataires et sous-traitants nommés, avec leur pays ; transferts hors UE et garanties (décision d'adéquation, clauses contractuelles types).
- Durée de conservation par catégorie, ou critère qui la fixe.
- Droits : accès, rectification, effacement, limitation, opposition, portabilité ; retrait du consentement à tout moment ; réclamation auprès de la CNIL.
- Caractère obligatoire ou facultatif des données et conséquence d'un refus.
- Décision automatisée ou profilage : existence, logique, conséquences.
- Date de dernière mise à jour.

Chaque ligne du tableau des traitements apparaît dans le texte, et rien d'autre.

## 4. Cookies et traceurs

Ancrage : article 82 de la loi Informatique et Libertés ; [CNIL, cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi).

- Consentement préalable pour tout traceur non exempté ; refuser aussi simple qu'accepter ; retrait aussi simple que l'accord ; jamais déduit de l'acceptation des CGU.
- Exemptés : choix de confidentialité, authentification, panier, personnalisation attendue de l'interface, équilibrage de charge, mesure d'audience conforme aux conditions CNIL.
- Liste par traceur : nom, émetteur, finalité, durée.
- Mise en œuvre technique : aucun script de mesure, de pub ou de réseau social chargé avant l'accord ; GA4 avec Consent Mode v2 en refus par défaut, ou Plausible sans cookie (exempté de bandeau s'il est configuré sans traceur). Le skill `analytics-setup` installe l'un ou l'autre.

## 5. CGU

- Objet du service, accès et création de compte, sécurité des identifiants.
- Règles d'usage et contenus interdits ; contenu publié par les utilisateurs : licence accordée, modération, signalement, suspension.
- Propriété intellectuelle du service ; responsabilité et disponibilité, sans exclure ce que la loi interdit d'exclure.
- Suppression du compte et sort des données (renvoi à la politique de confidentialité).
- Modification des CGU et information des utilisateurs ; droit applicable.

## 6. CGV vente aux consommateurs (B2C)

Ancrages : Code de la consommation, L221-5 (informations précontractuelles), L221-18 à L221-28 (rétractation), L215-1-1 (résiliation par voie électronique), L612-1 et L616-1 (médiation), L224-25-12 et suivants (conformité des contenus et services numériques).

- Identité du professionnel, caractéristiques essentielles, prix TTC, modalités de paiement, durée, reconduction et résiliation.
- Droit de rétractation de 14 jours, ou son exclusion motivée (L221-28) : service pleinement exécuté ou contenu numérique fourni avant la fin du délai, avec accord exprès et reconnaissance de la perte du droit, recueillis au moment de l'achat et non déduits des CGV.
- Contrat conclu via une interface en ligne : fonctionnalité de rétractation gratuite, libellée « renoncer au contrat ici » ou formule équivalente sans ambiguïté, visible, directement accessible pendant tout le délai, avec accusé de réception sur support durable (L221-21 et D221-5, issus de l'ordonnance n° 2026-2 et du décret n° 2026-3 du 5 janvier 2026, en vigueur depuis le 19 juin 2026 ; [CCI Paris Île-de-France](https://www.entreprises.cci-paris-idf.fr/actualites/e-commerce-et-droit-de-retractation-une-nouvelle-obligation-pour-les-professionnels)). C'est une fonction du produit : si elle manque dans le code, signale-la comme écart, ne la promets pas dans le texte.
- Abonnement souscrit en ligne : fonctionnalité gratuite de résiliation en ligne, directement accessible.
- Garantie légale de conformité (encadré dédié pour les contenus et services numériques) et garantie des vices cachés.
- Médiateur de la consommation : nom et coordonnées du médiateur auquel le professionnel adhère. Ne plus renvoyer à la plateforme européenne de règlement en ligne des litiges : plaintes closes le 20 mars 2025, plateforme supprimée au 20 juillet 2025 ([règlement (UE) 2024/3228](https://eur-lex.europa.eu/eli/reg/2024/3228/oj)) ; retire tout lien `ec.europa.eu/odr` hérité.

## 7. CGV vente aux professionnels (B2B)

Ancrage : Code de commerce, L441-1 (CGV communiquées à tout acheteur professionnel qui les demande).

- Conditions de vente, barème des prix, réductions, conditions de règlement, pénalités de retard et indemnité forfaitaire pour frais de recouvrement.
- Limitation de responsabilité, propriété intellectuelle, résiliation, juridiction compétente.
- Sous-traitance de données pour le client (article 28 RGPD) : accord de traitement (DPA) distinct, lié depuis les CGV.

## 8. Applications mobiles

- App Store : lien vers la politique de confidentialité dans App Store Connect et dans l'app ; la politique dit quelles données sont collectées et comment, leurs usages, que chaque tiers destinataire (SDK, analytics) offre une protection équivalente, la conservation, la suppression et le retrait du consentement ; suppression du compte dans l'app si l'app permet d'en créer un ([guidelines 5.1.1 (i) et (v)](https://developer.apple.com/app-store/review/guidelines/)).
- Google Play : chemin de suppression dans l'app et lien web de demande de suppression (qui nomme l'app ou le développeur), déclarés dans le formulaire Data safety ; les données conservées après suppression (fraude, obligation légale) sont décrites dans la politique ([exigences de suppression](https://support.google.com/googleplay/android-developer/answer/13327111)).
- Distribution dans l'UE : App Store, statut de professionnel (trader, DSA) déclaré par app dans App Store Connect ([aide Apple](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-compliance-information/)) ; Google Play, coordonnées vérifiées du compte développeur, publiques pour une organisation. Les coordonnées affichées sont celles des mentions légales.

## 9. Fonctionnalités d'IA

- Politique de confidentialité : fournisseur d'IA nommé comme sous-traitant, données envoyées, pays, réutilisation éventuelle pour l'entraînement selon le contrat du fournisseur.
- Transparence envers l'utilisateur (interaction avec une IA, contenu généré) : calendrier et obligations du règlement européen sur l'IA (AI Act, règlement (UE) 2024/1689, article 50 sur la transparence) à revérifier sur [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) avant publication.

## 10. Clauses à ne pas reprendre d'un modèle américain

- Arbitrage obligatoire ou renonciation aux recours face à un consommateur : clause présumée abusive (Code de la consommation, R212-2, 10°).
- Droit applicable étranger qui priverait un consommateur européen de la protection de son pays de résidence.
- Exclusion totale de responsabilité, y compris pour faute lourde ou dommage corporel.
- Mentions CCPA, Delaware, « class action waiver » : seulement si le produit vise réellement ces juridictions, et à faire valider.
