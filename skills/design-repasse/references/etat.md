# Gabarit de `.studio/repasse.md`

Créer à l'étape 0, mettre à jour à chaque étape avant de passer à la suivante. `-r` reprend à la première étape non cochée.

```markdown
---
etape: 0            # dernière étape terminée
mode: creation      # creation | upgrade
niveau: 1           # 0 à 3, échelle de design-animation
auto: false         # -a
direction: null     # A | B | C | mélange décrit
commit_analyse: <sha court du code analysé>
---

## Fiche essence
Produit / Public / Promesse / Ton / Signature / À garder / Contraintes

## Historique design repris
Charte retenue (lien), ADR et dérogations, diagnostics antérieurs et leur date

## Diagnostic (upgrade)
Tableau de references/diagnostic.md, preuves comprises

## Envies
Réponses au questionnaire ou arbitrages ; défauts retenus avec -a

## Recherche
Recherches lancées ; références retenues (URL) et valeurs reprises

## Directions
Les trois directions, la recommandation, le choix de l'élève

## Plan
Design system, blueprint par page et par section, planchers, retenu / écarté

## Validation
Par page : build, rendu 4 largeurs, a11y, Lighthouse, note ; itérations
```
