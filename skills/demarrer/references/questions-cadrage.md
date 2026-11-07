# Questions de cadrage

Une question à la fois. Les options entre crochets sont celles à proposer ; la première est la recommandation par défaut quand rien d'autre ne l'indique. Chaque question a son « pourquoi » à dire à l'élève.

## 1. Situation

**Q1. Où en es-tu ?** — pourquoi : on ne part pas pareil d'une page blanche ou d'un site qui existe.
[Je crée un nouveau site] [Je refais complètement mon site actuel] [Je veux modifier ou améliorer mon site actuel] [Je ne sais pas]

Saut : « nouveau » → passer au bloc 3.

## 2. Existant

**Q2. Quelle est l'adresse du site actuel ?** (texte libre ; « pas en ligne » accepté)

**Q3. Avec quoi est-il fait ?** — pourquoi : ça décide si on peut modifier le code directement.
[Du code dans un dépôt GitHub] [WordPress] [Wix, Webflow, Shopify ou Squarespace] [Je ne sais pas, regarde pour moi]
« Regarde pour moi » : inspecter la page (balises `generator`, chemins `/wp-content/`, domaines `wixsite`, `webflow.io`, `myshopify`) et annoncer le résultat.

**Q4. Qu'est-ce qui ne va plus ?** (plusieurs choix) [Le look est daté] [Il ne rapporte pas de contacts ou de ventes] [Il est lent ou mal fait sur mobile] [Il est dur à modifier] [Il n'est pas trouvé sur Google] [Autre]

**Q5. Qu'est-ce qu'on garde ?** (plusieurs choix) [Le nom de domaine] [Le logo et les couleurs] [Les textes] [Les photos] [La structure des pages] [Rien]

**Q6 (modification seulement). Liste les changements voulus**, même en vrac. Les reformuler en liste numérotée et faire valider.

## 3. Projet et utilité

**Q7. Comment s'appelle le projet, et que fais-tu en deux phrases ?** (texte libre)

**Q8. À quoi doit servir le site en priorité ?** — pourquoi : un site qui veut tout faire ne fait rien bien.
[Faire prendre rendez-vous ou demander un devis] [Vendre en ligne] [Récolter des contacts ou des inscrits] [Présenter et rassurer (vitrine)] [Publier du contenu et être trouvé sur Google] [Montrer mes réalisations (portfolio)]
Si deux utilités sont choisies, demander laquelle passe en premier.

## 4. Objectif

**Q9. Quel résultat chiffré veux-tu, et en combien de temps ?** — pourquoi : sans chiffre, impossible de savoir si le site marche.
Proposer 3 exemples adaptés à Q8 (« 10 demandes de RDV par mois », « 200 inscrits en 3 mois », « 5 devis par mois »). Refuser « le plus possible » : proposer un chiffre réaliste et le faire valider.

## 5. Persona

**Q10. Qui est ton client idéal ?** (âge, situation, métier ou contexte ; texte libre)
**Q11. Quel problème concret a-t-il quand il arrive chez toi ?**
**Q12. Qu'est-ce qui le pousse vraiment à agir ?** (gagner du temps, être rassuré, gagner de l'argent, se faire plaisir, éviter un risque…)
**Q13. Qu'est-ce qui pourrait le freiner ?** (prix, confiance, délai, « je peux le faire moi-même »…)
**Q14. Où passe-t-il son temps en ligne ?** [Google] [Instagram] [LinkedIn] [Facebook] [TikTok] [YouTube] [Bouche-à-oreille surtout]

Persona flou ou plusieurs publics : proposer `persona-parcours`.

## 6. Attentes

**Q15. Pour quand ?** [Dans la semaine] [Dans le mois] [Pas de date]
**Q16. Budget mensuel pour les outils ?** — pourquoi : la plupart des outils du pack ont une offre gratuite, mais le blog (hébergement Ghost) et le nom de domaine sont payants.
[0 €, uniquement du gratuit] [Moins de 20 € par mois] [Plus si ça vaut le coup]
**Q17. Qui modifiera le site ensuite ?** [Moi, avec l'agent IA] [Moi, sans connaissances techniques] [Un client à qui je livre le site]
**Q18. Langues ?** [Français seulement] [Français et anglais] [Autre]
**Q19. Contraintes particulières ?** [Rien de particulier] [Métier réglementé (santé, droit, finance)] [Accessibilité renforcée] [Autre]

## 7. Forme du site

Arbre de décision (deux signaux convergents tranchent) :
1. Combien d'objectifs mesurables ? Un seul → landing. Plusieurs → multi-pages.
2. Les visiteurs viendront surtout de pub ou des réseaux → landing. De Google → multi-pages.
3. Expertise à démontrer par le contenu (conseil, santé, droit, formation) → multi-pages.

**Q20. Je te propose [landing page / site de plusieurs pages] parce que [raisons]. On part là-dessus ?** [Oui] [Non, plutôt l'autre] [Explique-moi la différence]
Différence à expliquer : landing = une seule page longue qui mène à une action ; multi-pages = plusieurs pages (accueil, services, à propos, contact…), meilleur pour Google, plus long à faire. En cas d'hésitation : commencer par une landing, étendre plus tard.

**Q21 (multi-pages). Quelles pages ?** Proposer une liste type selon Q8 (ex. Accueil, Services, À propos, Témoignages, Contact) ; 10 pages maximum au départ.

## 8. Blog

Trois questions de décision, une à une :
**Q22. Veux-tu que des inconnus te trouvent sur Google en cherchant des réponses à leurs questions ?** [Oui, c'est important] [Un peu] [Non, mes clients viennent d'ailleurs]
**Q23. Peux-tu publier (avec l'aide de l'agent) au moins 2 articles par mois, et les relire ?** [Oui] [Peut-être] [Non]
**Q24. Ton métier gagne-t-il à montrer ton expertise par des articles ?** [Oui] [Pas vraiment]

Règle : Q22 = oui ET Q23 = oui → proposer le blog maintenant. Deux « peut-être / un peu » → proposer « plus tard » (place prévue dans le menu). Q23 = non → pas de blog, dire pourquoi : un blog abandonné nuit plus qu'il n'aide.
**Q25. Je te propose [blog maintenant / plus tard / pas de blog]. D'accord ?** [Oui] [Non]
Blog maintenant : prévenir qu'il faut un hébergement Ghost (PikaPods, petit abonnement mensuel) et le noter pour `comptes`.

## 9. Formulaire et contacts

**Q26. Comment les visiteurs te contactent-ils depuis le site ?** (plusieurs choix) [Formulaire de contact] [Demande de devis] [Prise de rendez-vous en ligne] [Inscription à une newsletter] [Juste un e-mail ou un téléphone affiché] [Rien]
Formulaire, devis ou newsletter → `modules.formulaire = true` (emails via Resend, stockage dans Airtable). Rendez-vous → lien vers un outil de réservation (Cal.com, Calendly), pas de formulaire maison.

## 10. Réseaux sociaux et marketing

**Q27. Quels réseaux utilises-tu pour ton activité ?** (plusieurs choix) [LinkedIn] [Instagram] [Facebook] [TikTok] [Aucun]
Si blog actif et au moins un réseau parmi LinkedIn, Instagram, Facebook :
**Q28. Veux-tu que chaque article devienne automatiquement des posts à valider pour tes réseaux ?** [Oui] [Plus tard] [Non] → `modules.marketing`.
**Q29. Veux-tu tester tes textes (titres, offre) sur un panel de clients types avant publication ?** [Oui, pour les pages importantes] [Non] → note pour `marketing-panel-audit`.

## 11. Design (premier niveau)

**Q30. As-tu déjà un logo et des couleurs ?** [Oui, logo et couleurs] [Logo seulement] [Rien, on part de zéro]
Logo seulement → `design-branding` pourra en tirer une palette.
**Q31. Donne 1 à 3 sites que tu trouves beaux (même hors de ton métier), et ce qui te plaît dedans.** (texte libre ; « aucun » accepté : `design-pilote` en proposera)
**Q32. Un style que tu ne veux surtout pas ?** (texte libre)
**Q33. Ton site en 3 mots d'ambiance ?** Proposer des paires si besoin : [Chaleureux et humain] [Premium et épuré] [Moderne et technique] [Coloré et énergique]

## 12. Mesure d'audience

**Q34. Comment veux-tu suivre tes visiteurs ?** — pourquoi : savoir ce qui marche sans enfreindre le RGPD.
[Vercel Web Analytics : simple, sans cookies, inclus avec l'hébergement] [Plausible : très complet, sans cookies, payant] [Google Analytics 4 : gratuit et complet, mais bandeau cookies obligatoire] [Pas de mesure pour l'instant]

## 13. Outils de création

**Q35. Pour les images du site ?** [L'agent les génère avec l'outil d'image disponible] [J'ai mes propres photos] [Photos libres de droits (Unsplash, Pexels)] [Un mélange]
**Q36. Veux-tu voir une maquette avant que le site soit codé ?** [Non, directement le site en code, on ajuste ensuite] [Oui, avec Pencil.dev] [Oui, avec Figma]
Débutant : recommander « directement le site en code » (plus rapide, on voit le vrai rendu).
