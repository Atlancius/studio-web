---
name: analytics-setup
description: "Installe la mesure d'audience d'un site : Vercel Web Analytics ou Plausible (sans cookies), ou GA4 avec bandeau de consentement RGPD, plus les événements clés. Déclencheurs : analytics, statistiques, GA4, Plausible, bandeau cookies."
---

# Analytics d'un site HTML statique

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Questions : une à la fois, avec des choix (Claude : `AskUserQuestion` ; Codex : choix numérotés dans le chat).

Politique cookies et mentions : `pages-legales` (à mettre à jour après ce choix).

## Choix de l'outil

Lire `outils.analytics` dans `.studio/state.json`. Inconnu : expliquer simplement « on mesure combien de personnes viennent, d'où, et ce qu'elles font (clic, formulaire) », puis demander :

1. **Vercel Web Analytics** (recommandé si le site est sur Vercel) : sans cookies donc sans bandeau, gratuit dans une limite d'événements mensuelle (plan Hobby, à vérifier sur vercel.com/docs/analytics), activation en un clic dans le projet Vercel. Événements personnalisés réservés aux plans payants.
2. **Plausible** : sans cookies, sans bandeau, tableau de bord très simple ; payant après l'essai gratuit (tarif à vérifier sur plausible.io).
3. **Google Analytics 4** : gratuit et très complet, mais pose des cookies : bandeau de consentement obligatoire (RGPD), plus lourd à installer.
4. « Je ne sais pas » : recommander Vercel Web Analytics si hébergé sur Vercel, sinon Plausible pour la simplicité, GA4 si l'élève prévoit de la publicité Google.

Puis :
- Vercel : l'élève active Analytics dans Vercel > projet > Analytics > Enable.
- GA4 : demander l'ID de mesure `G-XXXXXXXXXX` (analytics.google.com, Admin, Flux de données) et confirmer l'ajout d'un bandeau de consentement.
- Plausible : demander le domaine déclaré dans Plausible.

Noter le choix dans `outils.analytics`.

## Balise Vercel Web Analytics

Site HTML statique : ajouter dans le `<head>` de TOUTES les pages :

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

Site Next.js : paquet `@vercel/analytics` et composant `<Analytics />` dans le layout racine. Vérifier la syntaxe actuelle sur vercel.com/docs/analytics avant d'écrire. Aucun bandeau. Les données n'apparaissent qu'une fois le site déployé sur Vercel (rien en local).

## Checklist

- [ ] Outil et identifiant confirmés (choix noté dans `.studio/state.json`)
- [ ] Balise injectée dans le `<head>` de TOUTES les pages HTML
- [ ] GA4 : bandeau + `consent update` branchés
- [ ] Événements branchés sur les vrais éléments du HTML
- [ ] Preview déployée et test d'installation passé

## Balise GA4

Ordre obligatoire (Google : `default` avant toute commande qui envoie des mesures, `config` ou `event`) : `dataLayer` et `gtag`, `consent default` refusé, chargement de gtag.js, puis `js` et `config`.

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied',
    ad_personalization: 'denied', analytics_storage: 'denied'
  });
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Ne pas ajouter `anonymize_ip` : GA4 ne journalise pas les IP. Ajouter `wait_for_update: 500` au `default` seulement si le bandeau se charge en asynchrone.

## Bandeau de consentement (GA4)

Fichiers `consent-banner.js` et `consent-banner.css` inclus dans toutes les pages (ou inline selon le projet), aux couleurs de la charte.

- Affiché à la première visite ; choix stocké en `localStorage` avec une expiration (6 mois recommandés par la CNIL, à confirmer sur cnil.fr).
- Boutons « Tout accepter » et « Tout refuser » de même poids visuel, plus « Personnaliser » (modale avec toggles Essentiel, Analytics, Marketing).
- Chaque choix appelle `gtag('consent', 'update', {...})` avec les quatre clés ; au chargement suivant, rejouer le choix stocké.
- Lien permanent « Paramètres cookies » dans le footer.
- Texte court, sans jargon juridique.

## Balise Plausible

Copier le snippet exact depuis Plausible (Site settings, General, Tracking, Site installation) dans le `<head>` : sa forme dépend de la version du script. Aucun bandeau.

## Événements

Proposer `form_submit`, `cta_click`, `scroll_depth` (25, 50, 75, 100 %), au choix de l'utilisateur. Lire le HTML pour identifier les vrais sélecteurs (jamais `querySelector('form')` à l'aveugle).

```js
// GA4
form.addEventListener('submit', () => gtag('event', 'form_submit', { form_name: 'contact' }));
// Plausible
form.addEventListener('submit', () => window.plausible && plausible('form_submit'));
```

Vercel Web Analytics : événements personnalisés seulement sur plan payant (fonction `track()` du paquet `@vercel/analytics`, syntaxe à vérifier dans la doc) ; en gratuit, se contenter des pages vues.

Plausible : déclarer chaque événement comme objectif (Goal, Custom event, même nom exact) dans les réglages du site, sinon rien n'apparaît.

## Test (boucle de validation)

1. Déployer en preview (`npx vercel`).
2. Navigation privée : le bandeau apparaît (GA4), aucun cookie `_ga*` avant le choix (des pings sans cookie peuvent partir en consentement refusé, c'est normal).
3. Après acceptation : cookies `_ga*` posés (GA4) ; requêtes `plausible` ou `/_vercel/insights` visibles dans l'onglet Network (Plausible, Vercel).
4. Temps réel GA4, tableau de bord Plausible ou onglet Analytics de Vercel : la visite remonte ; soumettre le formulaire, `form_submit` remonte.
5. Échec à une étape : corriger puis refaire le test depuis l'étape 1.

Clôture : les données apparaissent sous 24 à 48 h ; mise en production ensuite. Rappeler de mettre à jour la politique de confidentialité et de cookies avec `pages-legales`.
