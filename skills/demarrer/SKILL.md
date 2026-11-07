---
name: demarrer
description: "Point d'entrée du pack Studio Web : cadrage interactif (projet, utilité, persona, attentes, design, landing ou multi-pages, blog, réseaux, analytics), comptes à créer, puis lancement des bons modules. Déclencheurs : démarrer, créer mon site, reprendre mon projet."
---

# Démarrer un projet Studio Web

Convention : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (Codex : le dossier qui contient ce SKILL.md). Un skill du pack se lance par son nom (Claude Code : `studio-web:<nom>` avec l'outil Skill ; Codex : `$<nom>` ou lecture de son SKILL.md).

Ce skill est le chef d'orchestre. Il ne construit rien lui-même : il comprend le projet, décide quels modules lancer (design, site, formulaire, blog, réseaux, analytics), fait préparer les comptes, puis passe la main au bon skill, dans le bon ordre. L'élève peut être débutant complet : parler simplement, expliquer chaque mot technique la première fois (« hébergeur : l'entreprise qui garde ton site allumé sur Internet »).

## Règles de conversation

- **Une question à la fois**, avec des choix proposés (Claude : `AskUserQuestion`, 2 à 4 options, la recommandée en premier ; Codex : choix numérotés). Toujours une sortie « je ne sais pas, propose-moi ».
- Dire **pourquoi** on pose la question en une phrase courte (« ça décide si on fait une seule page ou plusieurs »).
- Réponse floue : reformuler et proposer 2 interprétations, ne pas passer à la suite avec un flou.
- Toutes les 4 ou 5 questions : mini-récap d'une ligne (« Pour l'instant : site vitrine pour une naturopathe à Lyon, but = prises de RDV »).
- « stop » ou « pause » à n'importe quel moment : sauvegarder l'état, dire comment reprendre (« relance `demarrer` »).

## 0. Reprise ou nouveau projet

Lire `.studio/state.json` à la racine du dossier courant.

- **Présent** : afficher le projet, les modules actifs, la phase en cours et les phases terminées. Proposer : reprendre là où on s'est arrêté (recommandé), modifier une réponse du cadrage, voir l'état des comptes (`comptes`), recommencer à zéro (renommer l'ancien en `.studio/state-AAAA-MM-JJ.json`, ne jamais supprimer).
- **Absent** : vérifier que le dossier courant est bien le dossier du projet (vide ou contenant le site existant). Sinon proposer d'en créer un (`mkdir mon-projet && cd mon-projet`) et de relancer l'agent dedans. Créer `.studio/` et ajouter `.studio/` au `.gitignore` s'il y a un dépôt Git (les réponses peuvent être personnelles).

Présenter le parcours en 4 lignes : cadrage (10 à 15 minutes) → comptes → construction module par module avec validation à chaque étape → mise en ligne. Demander « on y va ? ».

## 1. Cadrage

Poser les questions de `${CLAUDE_SKILL_DIR}/references/questions-cadrage.md` dans l'ordre, en sautant celles que les réponses précédentes rendent inutiles (règles de saut dans ce fichier). Enregistrer chaque réponse au fil de l'eau dans `.studio/state.json` (schéma ci-dessous), pour ne rien perdre si la session coupe.

Blocs, dans l'ordre :

1. **Situation** : nouveau site, refonte complète d'un site existant, ou modifications sur un site existant.
2. **Existant** (si refonte ou modification) : URL, où est le code (GitHub, WordPress, Wix, Webflow, Shopify, je ne sais pas), ce qui marche, ce qui ne va plus, ce qu'on garde (textes, logo, couleurs, pages, nom de domaine). Si une URL est donnée : lancer `verif-navigateur` pour faire des captures desktop et mobile et lister les pages, puis résumer en 5 lignes ce qu'on a vu et le faire valider.
3. **Projet et utilité** : nom, activité en deux phrases, à quoi doit servir le site (vendre, faire prendre rendez-vous, récolter des contacts, rassurer et présenter, publier du contenu, montrer un portfolio).
4. **Objectif mesurable** : un chiffre et une période. Proposer des exemples adaptés à l'utilité choisie.
5. **Persona** : qui, problème, motivation profonde, objections, où il passe son temps en ligne. Persona flou ou plusieurs publics très différents : proposer `persona-parcours` maintenant (10 minutes) puis revenir.
6. **Attentes** : délai, budget mensuel pour les outils (0 €, moins de 20 €, plus), qui modifiera le site ensuite (l'élève seul, avec l'agent, un client), langues, contraintes (secteur réglementé, accessibilité, mentions particulières).
7. **Forme du site** : landing page ou multi-pages, avec l'arbre de décision du fichier de questions ; si multi-pages, première liste de pages.
8. **Blog** : besoin réel ou non, avec les 3 questions de décision du fichier (être trouvé sur Google par du contenu, capacité à publier au moins 2 articles par mois, expertise à démontrer). Réponses possibles : oui maintenant, plus tard (on prévoit la place dans le menu), non.
9. **Formulaire et contacts** : contact, demande de devis, prise de rendez-vous (lien Calendly ou Cal.com), newsletter, rien.
10. **Réseaux sociaux et marketing** : réseaux utilisés, envie de diffuser automatiquement les articles, envie de tester ses textes sur un panel de personas.
11. **Design** (premier niveau seulement, le détail est fait par `design-pilote`) : logo et couleurs existants ou non, 1 à 3 sites aimés et ce qui plaît, ce qu'on déteste, ambiance en 3 mots.
12. **Mesure d'audience** : savoir combien de visiteurs et d'où ils viennent ; présenter les options simplement (Vercel Web Analytics, Plausible, Google Analytics 4 avec bandeau cookies).
13. **Outils de création** : génération d'images (outil disponible dans la session, photos fournies, banque libre) ; maquette visuelle avant le code (oui avec Pencil.dev ou Figma, non : on passe directement au code).

## 2. Récapitulatif et plan

Écrire `.studio/cadrage.md` (lisible, en français, une section par bloc) puis afficher :

- le projet en 3 lignes (utilité, persona, objectif) ;
- **les modules activés et sautés**, chacun avec la raison tirée des réponses, par exemple :

| Module | Statut | Pourquoi |
|---|---|---|
| Design | actif | pas de charte existante |
| Site (landing) | actif | un seul objectif : prises de RDV |
| Formulaire | actif | demande de rendez-vous |
| Blog | sauté | pas de temps pour publier, pas d'enjeu SEO pour l'instant |
| Réseaux | sauté | dépend du blog |
| Analytics | actif | Vercel Web Analytics, sans cookies |

- l'ordre de travail prévu et une estimation honnête du nombre de sessions.

Faire valider (valider / modifier une réponse / stop). Rien ne se construit avant ce « oui ».

## 3. Comptes et outils

Lancer `comptes` avec les modules activés : il liste seulement les comptes nécessaires, explique à quoi sert chacun, guide la création et vérifie qu'ils marchent. Ne pas commencer la construction tant que les comptes **bloquants** du prochain module ne sont pas prêts ; les autres peuvent attendre leur module.

## 4. Construction

Enchaîner les modules activés, chacun par son pilote, en lui laissant lire `.studio/state.json` et `.studio/cadrage.md` (il ne repose pas les questions déjà répondues). Mettre à jour `phase_courante` et `phases_terminees` à chaque fin de module.

| Ordre | Module | Skill | Condition |
|---|---|---|---|
| 1 | Direction design, maquette | `design-pilote` | `modules.design` |
| 2 | Site : brief, architecture, images, code, formulaire, pages légales, SEO, mise en ligne, analytics | `site-pilote` | `modules.site` |
| 3 | Blog | `blog-pilote` | `modules.blog` |
| 4 | Réseaux sociaux | `marketing-connect-buffer` puis `marketing-article-reseaux`, `marketing-programmer-articles` | `modules.marketing` |
| 5 | Bilan de visibilité | `seo-visibilite` | site en ligne |

Cas particuliers :

- **Modification d'un site existant** (pas de refonte) : pas de module design complet. Lister les changements voulus, les classer (texte, visuel, nouvelle section, nouvelle page, technique), puis les faire un par un avec `site-corrige` (site du pack) ou directement dans le code existant, avec `verif-navigateur` avant et après chaque changement.
- **Site existant sur WordPress, Wix, Webflow ou Shopify** : expliquer que le pack construit des sites en code (HTML ou Next.js) hébergés sur Vercel. Proposer : reconstruire en code (refonte), ou garder la plateforme et n'utiliser du pack que la rédaction (`copywriting`), le design (`design-pilote`, `design-review`), le SEO (`seo-visibilite`) et les réseaux.
- **Blog « plus tard »** : demander à `site-pilote` de prévoir l'entrée « Blog » dans l'arborescence sans la publier.

## 5. Clôture

Quand tous les modules actifs sont terminés : résumer l'URL en ligne, les modules faits, les comptes utilisés, ce qui reste à faire par l'élève (domaine, premiers articles, Search Console), et comment reprendre une modification plus tard (relancer `demarrer`, choisir « modifier »). Archiver l'état en `.studio/state-AAAA-MM-JJ.json`.

## Schéma de `.studio/state.json`

```json
{
  "version": 1, "projet": "", "cree_le": "",
  "situation": "nouveau | refonte | modification",
  "existant": { "url": "", "depot": "", "stack": "", "garder": "", "changer": "" },
  "references": [ { "url": "", "ce_qui_plait": "" } ],
  "objectif": "", "utilite": "",
  "persona": { "qui": "", "probleme": "", "motivation": "", "objections": "", "ou_en_ligne": "" },
  "attentes": { "delai": "", "budget_outils": "", "qui_modifie": "", "contraintes": "" },
  "type_site": "landing | multi-pages", "pages": [],
  "direction_design": { "ambiance": "", "couleurs": "", "typo": "", "a_eviter": "", "logo_existant": false },
  "ton": [], "langues": ["fr"],
  "modules": { "design": true, "site": true, "formulaire": true, "blog": false, "blog_plus_tard": false, "marketing": false, "analytics": true },
  "formulaire": { "types": [] },
  "reseaux": [],
  "outils": { "images": "session | photos | banque", "maquette": "pencil | figma | aucune", "analytics": "vercel | plausible | ga4" },
  "comptes": {},
  "phase_courante": "cadrage", "phases_terminees": []
}
```

## Garde-fous

- Ne jamais demander un mot de passe, une clé API ou un code de carte dans le chat : l'élève les tape lui-même dans le terminal ou le tableau de bord du service.
- Aucune dépense, publication ou mise en production sans un « oui » explicite donné à ce moment-là.
- Ne jamais supprimer un fichier de l'élève ; une refonte travaille dans un nouveau dossier ou une nouvelle branche Git.
