# Gabarit du document UX

## Table des matières
- Plan du document
- Wireframe d'un écran
- Checklist accessibilité WCAG 2.2 AA

## Plan du document

```markdown
# UX Design: <nom>

## Vue d'ensemble
Problème utilisateur. Objectifs UX mesurables (ex. onboarding < 2 min, tunnel complété > 80 %).

## Personas
Par persona : profil (nom fictif, âge, rôle, contexte), bio en 2-3 phrases, objectifs, frustrations, comportements numériques, citation type.

## Parcours
Par parcours : persona, objectif, contexte.
| Étape | Action | Pensée | Émotion | Friction | Opportunité |
Moments clés : moment de vérité (continuer ou abandonner), moment de réussite. Métriques : conversion étape X vers Y, abandon, temps par étape.

## Architecture de l'information (si plusieurs sections)
Sitemap en arbre et navigation : principale, secondaire, contextuelle (comportement desktop / mobile).

## Wireframes
Un bloc par écran (voir ci-dessous).

## Évaluation
Heuristiques de Nielsen (statut + correctif), micro-interactions notables (déclencheur, retour, règle : retour sous 300 ms ou indicateur de chargement), accessibilité.

## Décisions UX
| Décision | Justification | Alternatives écartées |

## Métriques UX
Task success > 90 %, taux d'erreur, temps par tâche, SUS > 70 : cibles et méthode de mesure.

## Questions ouvertes
- [ ] question, qui répond
```

## Wireframe d'un écran

```markdown
### Écran : <nom>
Objectif : ce que l'utilisateur accomplit ici. Provenance : d'où il vient. Destination : où il va ensuite.
```

```
┌─────────────────────────────────────┐
│ [Header / navigation]               │
├─────────────────────────────────────┤
│ [Titre]                             │
│ ┌─────────────────────────────────┐ │
│ │ [Composant principal]           │ │
│ └─────────────────────────────────┘ │
│ [Zone secondaire]                   │
│ ┌─────────────┐ ┌─────────────┐     │
│ │ [CTA 1]     │ │ [CTA 2]     │     │
│ └─────────────┘ └─────────────┘     │
├─────────────────────────────────────┤
│ [Footer / navigation basse]         │
└─────────────────────────────────────┘
```

```markdown
| Zone | Contenu | Priorité | Interactions |
États : vide / chargement / erreur / succès (ce que voit l'utilisateur dans chacun).
```

## Checklist accessibilité WCAG 2.2 AA

Perceptible
- [ ] Contraste texte/fond >= 4,5:1 (3:1 grand texte et composants d'interface)
- [ ] Texte agrandissable à 200 % sans perte
- [ ] Alternatives textuelles aux images, sous-titres aux vidéos

Utilisable
- [ ] Tout au clavier, sans piège, ordre de tabulation logique, focus visible
- [ ] Cibles de pointage >= 24 x 24 px CSS (AA) ; viser 44 x 44 px (AAA) en tactile
- [ ] Temps suffisant pour lire et agir

Compréhensible
- [ ] Langage clair, navigation cohérente
- [ ] Libellés explicites sur les champs, messages d'erreur utiles

Robuste
- [ ] HTML sémantique, compatible lecteurs d'écran, ARIA seulement si nécessaire
