# Catalogue des comptes et outils

Les prix et offres gratuites changent : avant d'annoncer un tarif précis, vérifier la page tarifs officielle du service. Ici on indique seulement gratuit, payant, ou offre gratuite limitée.

## Comptes

### GitHub — toujours
- Sert à : sauvegarder le code du site et le relier à l'hébergeur ; chaque modification est historisée.
- Coût : gratuit.
- Inscription : https://github.com/signup
- Réglages : choisir un nom d'utilisateur professionnel (il apparaît dans les adresses) ; activer la double authentification.
- Vérification : `gh auth status` (après `gh auth login`, choisir GitHub.com, HTTPS, connexion par navigateur). Sans `gh` : `git --version` et un premier `git push` lors de la mise en ligne.

### Vercel — module site
- Sert à : héberger le site et le mettre en ligne à chaque modification ; fournit l'adresse `*.vercel.app` puis le nom de domaine.
- Coût : offre Hobby gratuite, réservée à un usage personnel et non commercial ; un site professionnel ou client relève de l'offre Pro, payante. Le dire honnêtement et laisser l'élève choisir.
- Inscription : https://vercel.com/signup avec « Continue with GitHub ».
- Vérification : `npx vercel whoami` (après `npx vercel login`).

### Resend — module formulaire
- Sert à : envoyer les e-mails du formulaire (notification à l'élève, confirmation au visiteur).
- Coût : offre gratuite limitée en volume.
- Inscription : https://resend.com/signup
- Réglages : sans domaine vérifié, les envois de test ne partent que vers l'adresse du compte ; pour écrire aux visiteurs, ajouter et vérifier son domaine (enregistrements DNS donnés par Resend).
- Clé : créée par l'élève dans API Keys, collée par lui dans `vercel env add RESEND_API_KEY`.
- Vérification : un envoi de test lors de `site-formulaire`.

### Airtable — module formulaire
- Sert à : stocker les demandes et inscriptions dans un tableau consultable.
- Coût : offre gratuite limitée.
- Inscription : https://airtable.com/signup
- Clé : jeton personnel (Builder hub > Personal access tokens) avec les droits `data.records:write` et `schema.bases:read`, limité à la base du projet ; collé par l'élève dans `vercel env add`.
- Vérification : création d'un enregistrement de test lors de `site-formulaire`.

### Outil de réservation — si prise de rendez-vous
- Cal.com (https://cal.com/signup) ou Calendly (https://calendly.com/signup) ; offre gratuite pour un type de rendez-vous.
- Vérification : le lien public s'ouvre et affiche des créneaux.

### PikaPods (hébergement Ghost) — module blog
- Sert à : faire tourner le blog Ghost (éditeur d'articles, abonnés, newsletter).
- Coût : payant, petit abonnement mensuel selon la puissance choisie (vérifier le tarif sur la page du service).
- Inscription : https://www.pikapods.com
- Vérification : l'administration `https://<adresse-du-blog>/ghost` s'ouvre ; la suite (clés API) est faite par `blog-setup-ghost`.

### Buffer — module réseaux
- Sert à : programmer les posts LinkedIn, Instagram, Facebook préparés par l'agent, après validation.
- Coût : offre gratuite limitée en nombre de réseaux et de posts programmés.
- Inscription : https://buffer.com/signup ; connecter ensuite chaque réseau dans Buffer.
- Réglages : Instagram doit être un compte professionnel relié à une page Facebook pour la publication programmée.
- Vérification : faite par `marketing-connect-buffer` (connexion du serveur MCP de Buffer, lecture des canaux).

### Comptes des réseaux — module réseaux
- LinkedIn (profil ou page), Instagram professionnel, page Facebook : à créer avant de les connecter à Buffer.

### Mesure d'audience — module analytics (un seul au choix)
- Vercel Web Analytics : rien à créer, activation dans le projet Vercel (onglet Analytics) ; sans cookies.
- Plausible : https://plausible.io/register ; payant avec période d'essai ; sans cookies.
- Google Analytics 4 : https://analytics.google.com avec un compte Google ; gratuit ; bandeau de consentement obligatoire.
- Vérification : faite par `analytics-setup` (visite de test visible dans le tableau de bord).

### Google Search Console — optionnel, recommandé dès la mise en ligne
- Sert à : voir sur quelles recherches Google affiche le site et signaler le plan du site.
- Coût : gratuit. https://search.google.com/search-console
- Vérification : propriété validée (enregistrement DNS ou balise), sitemap envoyé.

### Nom de domaine — optionnel
- Sert à : une adresse à soi (`monsite.fr`) au lieu de `*.vercel.app`.
- Coût : payant, à l'année. Acheter chez un registraire (OVHcloud, Gandi, Porkbun, Namecheap, ou directement chez Vercel).
- Vérification : faite par `site-pilote` lors du branchement (enregistrements DNS donnés par Vercel).

### Outils de design — si maquette choisie
- Pencil.dev : https://www.pencil.dev, éditeur de maquettes relié à l'agent.
- Figma : https://www.figma.com/signup, offre gratuite ; l'agent y accède via le serveur MCP de Figma si configuré.
- Frame0 (wireframes) : application de bureau https://frame0.app avec son serveur MCP.
- Aucun n'est obligatoire : sans eux, le pack fait wireframes et maquettes en HTML.

### Génération d'images — si choisie
- Utiliser l'outil d'image déjà disponible dans la session de l'agent (par exemple celui de Codex avec un abonnement ChatGPT). Un service payant à l'image seulement si l'élève le choisit, coût annoncé avant chaque lot.
- Sans génération : photos de l'élève ou banques libres (https://unsplash.com, https://www.pexels.com), sans compte.

## Outils locaux

| Outil | Sert à | Vérifier | Installer |
|---|---|---|---|
| Node.js (version LTS) | lancer les outils `npx` (Vercel, formulaires, Next.js) | `node -v` | https://nodejs.org (installateur LTS) |
| Git | enregistrer les versions du code | `git --version` | Mac : `xcode-select --install` ; Windows : https://git-scm.com |
| GitHub CLI | se connecter à GitHub depuis le terminal | `gh --version` | https://cli.github.com |
| Python 3 | prévisualiser un site HTML en local (`python3 -m http.server`) | `python3 --version` | Mac : souvent présent ; sinon https://www.python.org |
| Navigateur Chrome ou Edge | vérifier le rendu avec `verif-navigateur` | — | — |

Le CLI Vercel ne s'installe pas forcément : `npx vercel` suffit.
