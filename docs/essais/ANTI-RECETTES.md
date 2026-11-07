# Anti-recettes

## Citer un skill qui n'est pas dans le pack
- Cause : skills repris d'un environnement qui en contenait des centaines.
- Signe : un nom entre backticks absent de `skills/`.
- Alternative : remplacer par un skill du pack ou intégrer l'instruction utile dans `references/`.

## Promettre « hébergement gratuit » sur Vercel pour un site pro
- Cause : l'offre Hobby est réservée à l'usage personnel non commercial.
- Alternative : dire gratuit pour un site perso, offre Pro pour un site pro ou client.

## Commandes Unix dans un skill
- Cause : skills écrits sur Mac. Codex sous Windows lance PowerShell : pas de bash, jq, grep, sed ; `curl` est un alias en 5.1 ; pas de `&&` ; `>` écrit en UTF-16.
- Alternative : Node, npx, git, une commande par ligne, script `.mjs` au-delà de deux lignes.

## Exiger « zéro erreur gscan » sur un thème dérivé de Source
- Cause : Source brut sort déjà des erreurs gscan.
- Alternative : comparer au Source non modifié et ne corriger que les erreurs nouvelles.
