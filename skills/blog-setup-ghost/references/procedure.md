# Procédure détaillée Ghost + PikaPods

Contenu : 1 Pourquoi ce choix, 2 PikaPods, 3 Sous-domaine, 4 Admin Ghost, 5 Clés API, 6 Service MCP, 7 Mode privé, 8 Webhooks.

Les libellés de l'interface PikaPods et Ghost évoluent : si un libellé diffère, suivre l'équivalent à l'écran plutôt que forcer la procédure.

## 1. Pourquoi Ghost sur PikaPods

- Ghost expose une Content API (lecture, clé publique) et une Admin API (écriture, authentifiée) : le blog peut être rendu ailleurs (scénario C) ou par un thème Ghost (A, B). Doc : https://docs.ghost.org/content-api et https://docs.ghost.org/admin-api
- PikaPods héberge un pod Ghost prêt à l'emploi (région Europe disponible, HTTPS géré), sans administration serveur. Vérifier tarifs, crédits d'inscription et tailles sur https://www.pikapods.com au moment du choix : ne pas annoncer de montant.

## 2. PikaPods : compte et pod

1. https://www.pikapods.com : créer un compte (mot de passe fort, gestionnaire de mots de passe).
2. Catalogue, chercher Ghost, lancer le pod. Taille minimale suffisante pour démarrer (augmentable), région Europe pour la latence et le RGPD.
3. Attendre le démarrage (quelques minutes), relever l'URL technique `<pod>.pikapod.net`.

## 3. Sous-domaine (scénario B)

1. Chez le registrar, zone DNS du domaine : enregistrement **CNAME**, nom = préfixe (`blog`), cible = `<PIKAPOD_URL>`, TTL par défaut ou 3600.
2. Propagation : de quelques minutes à une heure. Vérifier `dig +short <SUBDOMAIN>` (doit renvoyer l'URL du pod) ou https://dnschecker.org.
3. Dans le pod PikaPods : section des domaines personnalisés, ajouter `<SUBDOMAIN>`. Le certificat HTTPS est provisionné automatiquement ; si erreur SSL ou délai, attendre 10 à 15 minutes puis revérifier le CNAME.
4. Test en navigation privée : `https://<SUBDOMAIN>` affiche l'écran d'accueil Ghost.

## 4. Admin Ghost

1. `<BLOG_URL>/ghost` : créer le compte owner (e-mail de la personne, mot de passe fort).
2. Réglages généraux : titre du site, description (150 caractères max, sert de meta description par défaut), fuseau `Europe/Paris`, langue `fr`, navigation de 3 à 4 entrées.

## 5. Custom integration

1. Settings, Integrations, Custom integrations, Add custom integration, nom `Claude Code` (ou le nom du projet).
2. Trois valeurs apparaissent : **Content API Key** (lecture seule, publique), **Admin API Key** (forme `id:secret`, lecture/écriture, secret hexadécimal), **API URL** (= `<BLOG_URL>`, ou `<GHOST_BACKEND_URL>` en scénario C).
3. L'Admin API Key peut tout faire, y compris supprimer des posts : secret absolu. Stockage : config du service MCP ; pour un framework déployé sur Vercel (scénario C), variables d'environnement `GHOST_URL`, `GHOST_CONTENT_API_KEY` (la clé Admin n'est pas utile au rendu public). Jamais dans git.

## 6. Service MCP Ghost

- Le service doit accepter l'URL de l'instance, la clé Admin et la clé Content, et exposer lecture, création et édition de posts, upload d'image.
- Installation : selon le runtime (commande `/mcp` ou configuration MCP de Claude Code ; fichier de configuration MCP de Codex). Si la personne a reçu un serveur MCP Ghost de son formateur, suivre ses instructions.
- Test : lister les 5 derniers posts. Instance neuve : articles de démo Ghost. 401 : clés incorrectes, régénérer dans Settings, Integrations.

## 7. Mode privé

Admin Ghost, Settings, section générale (parfois « Access » selon la version), activer « Make this site private ». Ghost bloque l'indexation et affiche un mot de passe partagé. Ce n'est pas une authentification forte. Le désactiver dès le premier article publié.

## 8. Webhooks (plus tard)

Utiles seulement pour un site qui met en cache (ISR Next.js, Astro) : notifier le site à chaque publication ou modification. Configurés par `blog-integrate-headless` (Settings, Integrations, intégration, Add webhook). Inutiles pour un site statique sans cache serveur.
