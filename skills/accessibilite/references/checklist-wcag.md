# Checklist WCAG 2.2 AA, patterns ARIA et vérifications

Référence du skill `accessibilite`. Gravités : CRITICAL (bloque la navigation) > MAJOR (contenu inaccessible) > MINOR (amélioration).

## 1. Checklist manuelle WCAG 2.2 AA

**Perceptible**
- [ ] 1.1 Alternatives textuelles : `alt` descriptif sur toutes les images ; décoratives `alt=""` seul (pas de `role` ajouté) ; icône interactive → `aria-label` sur le parent cliquable ; SVG → `<title>` ou `aria-label`
- [ ] 1.3 Adaptable : HTML sémantique (`<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`) ; headings hiérarchiques sans saut (h1 → h2 → h3) ; `<ul>`/`<ol>` pour les listes visuelles ; tableaux avec `<th>`, `<caption>`, `scope` ; `<label>` associé à chaque `<input>`
- [ ] 1.4 Contraste : texte normal ≥ 4.5:1 ; texte large (≥ 18pt ≈ 24px, ou ≥ 14pt ≈ 18.5px bold) ≥ 3:1 ; éléments UI et graphiques ≥ 3:1
- [ ] 1.4 Distinguable : pas de texte dans les images (sauf logo) ; lisible à 200% de zoom ; reflow à 320px sans scroll horizontal

**Utilisable**
- [ ] 2.1 Clavier : tout élément interactif focusable via Tab ; ordre logique (pas de `tabindex` > 0) ; focus visible `focus-visible:ring-2 focus-visible:ring-primary` ; pas de piège clavier (sortie Tab/Escape) ; Enter/Space active les boutons ; Escape ferme modals/dropdowns ; flèches dans menus/tabs/sliders
- [ ] 2.4 Navigable : skip link en haut de page "Aller au contenu principal" ; `<title>` descriptif et unique par page ; breadcrumbs si navigation profonde ; liens descriptifs (pas de "cliquez ici") ; élément focusé jamais entièrement masqué par un header sticky, bandeau cookies ou chat (2.4.11)
- [ ] 2.5 Modalités d'entrée : cibles ≥ 24x24 CSS px ou espacées d'autant (2.5.8, AA), viser 44x44 sur mobile (2.5.5, AAA) ; tout drag (slider, drag-and-drop, tri) a une alternative à simple clic (2.5.7) ; aucune fonctionnalité uniquement au hover (tooltip → aussi au focus, fermable par Escape, survolable, persistant — 1.4.13)

**Compréhensible**
- [ ] 3.1 Lisible : `<html lang="fr">` ; changements de langue balisés (`<span lang="en">`)
- [ ] 3.2 Prévisible : pas de changement de contexte au focus ni au changement de valeur (sauf prévenu) ; aide (contact, chat, FAQ) au même emplacement relatif sur toutes les pages (3.2.6)
- [ ] 3.3 Aide à la saisie : messages d'erreur descriptifs (pas juste "erreur"), liés au champ (`aria-describedby`), avec suggestion de correction si possible ; labels persistants (pas juste placeholder) ; info déjà saisie dans le même parcours pré-remplie ou sélectionnable (3.3.7) ; authentification sans test cognitif, coller et gestionnaire de mots de passe autorisés (3.3.8)

**Robuste**
- [ ] 4.1 Compatible : rôles/états ARIA corrects ; composants custom avec rôle, état et nom accessibles (4.1.2) ; IDs uniques, surtout ceux ciblés par `for`/`aria-*` (4.1.1 Parsing est retiré de WCAG 2.2) ; messages de statut annoncés sans déplacer le focus (4.1.3)

## 2. Patterns ARIA courants

- **Modal / Dialog** : `role="dialog"` + `aria-modal="true"` + `aria-labelledby` vers le titre ; focus piégé à l'intérieur, Escape ferme.
- **Menu / Dropdown** : bouton `aria-haspopup="true"` + `aria-expanded={open}` ; `role="menu"` > `role="menuitem"` ; flèches pour naviguer, Enter sélectionne, Escape ferme.
- **Tabs** : `role="tablist"` > `role="tab"` (`aria-selected`, `aria-controls` vers le panel) ; `role="tabpanel"` avec `aria-labelledby` vers l'`id` du tab ; flèches pour changer d'onglet.
- **Toast / Alert** : succès → `role="status"` (`aria-live="polite"`) ; erreur critique → `role="alert"` (`aria-live="assertive"`).

## 3. Corriger

- Prioriser CRITICAL > MAJOR > MINOR.
- Corriger par lot : tous les `alt` manquants, puis tous les focus, etc.

## 4. Vérifier

- [ ] Relancer l'audit (analyse statique + axe si disponible)
- [ ] Test clavier complet (Tab à travers toute la page)
- [ ] Zoom 200 %
- [ ] Affichage à 320 px sans défilement horizontal
- [ ] Contrastes vérifiés (WebAIM Contrast Checker ou calcul)
