# Modèle de rapport de bug

Remplir depuis les outils disponibles (lecture de fichiers, commandes shell). Aucune valeur de clé, mot de passe ou jeton.

```markdown
# Rapport de bug, Blog Ghost, {date ISO}

## Description du problème
Ce que l'élève a essayé de faire, et ce qui s'est passé à la place.

## Zone identifiée
Setup Ghost / Thème / Cocon / Article / Batch / Autre

## Étapes tentées
1. …

## Sortie des commandes de diagnostic
(sortie brute de chaque commande lancée, secrets caviardés)

## Versions
- Pack Studio Web : version du plugin `studio-web` si installé
- Ghost : admin Ghost > bas de page > « About Ghost »
- Agent : `claude --version` ou `codex --version`
- Node : `node --version`
- OS : `uname -a`

## Contexte
Commande ou skill lancé, fichiers concernés, messages d'erreur.
```
