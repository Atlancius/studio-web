---
name: redaction-naturelle
description: "Rédige et révise un texte (article, post, email, page, réponse) pour qu'il colle à son support et ne sonne pas IA : réécris, humanise, « moins IA », « plus naturel ». Texte de vente : copywriting."
---

# Rédaction naturelle

Paths: `${CLAUDE_SKILL_DIR}` = ce dossier (Codex : le dossier qui contient ce SKILL.md). Aucun fichier groupé : tout est ici.

Écrire pour le contexte réel (support, lecteur, tâche). Une prose qui colle au support se lit humaine par effet de bord : ne pas viser « sonner humain » ni battre un détecteur. Ce skill sert à rédiger et réviser, pas à juger si un texte est écrit par une IA (la provenance : historique de révision, sources, usage d'IA déclaré).

Priorité en cas de conflit : vérité, sécurité, accessibilité, contraintes de plateforme > consigne explicite de l'utilisateur > normes du genre > règles ci-dessous.

## Option : tirets longs bannis

Aucun cadratin (`—`) ni demi-cadratin (`–`), jamais : virgule, deux-points, point, parenthèses ou `;`. Trait d'union des mots composés conservé. Appliquer si l'utilisateur le demande ou si le skill appelant l'impose (`blog-article`, `marketing-article-reseaux`) ; sinon non.

## Workflow

1. Fixer le support, le lecteur, le besoin et le rôle du texte. Si `.studio/state.json` existe, reprendre le persona et le ton (3 adjectifs, tutoiement ou vouvoiement) sans les redemander. Tâche orientée action : la réponse ou l'action suivante d'abord.
2. Texte long : choisir un fil conducteur et un cas concret qui porte du poids.
3. Rédiger pour ce contexte, puis lancer les contrôles ci-dessous (texte ≤ 150 mots : contrôles 1 à 5 et 7 ; sinon tous).
4. Couper ce qui est générique, cérémonial, trop modulaire ou faussement précis. Une relecture raccourcit presque toujours.

Checklist de livraison (ne pas afficher l'audit sauf demande) :
- [ ] 1. Registre : format, ponctuation et structure collent au support (web, docs, UI : réponse tôt, titres descriptifs, listes pour les étapes, liens explicites, alt utile).
- [ ] 2. Ancrage : chaque paragraphe substantiel porte un élément vérifiable (nom propre, chiffre autre qu'une date, citation, décision, détail observé). Critique ou analyse : au moins un paragraphe bâti sur un seul exemple concret.
- [ ] 3. Faits : les trois affirmations les plus fragiles (dates, citations, métriques, causalité, futur, motifs) sont sourcées, atténuées (« a coïncidé avec », « a été suivi de ») ou coupées.
- [ ] 4. Sources : citation exacte, paraphrase proche, métrique, événement prévu et lien causal sont couverts par la source exacte, pas par un sujet voisin.
- [ ] 5. Régularité : nommer le tic le plus répété ; s'il revient 3 fois ou domine deux paragraphes, en réécrire un.
- [ ] 6. Cadre répété : une métaphore ou opposition qui revient partout est un échafaudage ; la garder là où elle apporte, varier ou couper ailleurs.
- [ ] 7. Voix : genre à auteur visible (avis, critique, post) → énoncer le point de vue ; genre neutre (résumé, doc, dépêche) → rester neutre.
- [ ] 8. Pensée développée (> 4 paragraphes) : un exemple ou un détail noté hors de la ligne droite, si la matière s'y prête.
- [ ] 9. Forme (> 3 paragraphes) : organisation en 5 mots, thèse en une phrase ; refaire si c'est « état initial, changements, verdict », un paragraphe par jalon ou une étiquette par paragraphe.
- [ ] 10. Sur-correction : pas de fautes volontaires, argot, apartés forcés, fragments au hasard ni longueur de phrase calibrée.

## Règles

- **Support** : chat, commentaires, DM : prose courante, listes seulement si le contenu s'y prête ou si demandé, guillemets et apostrophes droits en texte brut. Email : prose d'abord, listes pour décisions et actions. Docs, specs, rapports : structure attendue. Articles, critiques, rétrospectives : un angle, pas de chronologie ou de seaux thématiques par défaut.
- **Concret avant général** : ordre usuel : ce qui s'est passé, où, quelle contrainte, ce qui a changé, ce que ça veut dire. Si le plus concret d'un paragraphe est un nom et une date, il est encore trop générique. Ne comptent pas : « plusieurs », « divers », « de nombreux », « des implications larges », « essentiellement », « fondamentalement ».
- **Précision gagnée** : peu de faits vérifiés plutôt que beaucoup de devinés. Pas de jalons, citations ou chiffres inventés ; pas de « les experts disent » sans source nommée ; pas de mécanisme caché raconté comme un fait. Preuve insuffisante : attribuer, atténuer ou couper.
- **Mots simples** : répéter le mot ordinaire quand c'est le bon ; verbes plutôt que nominalisations (« la latence a baissé », pas « une réduction de la latence a été observée »). Relier par pronoms et référence continue, pas par signaux (« de plus », « par ailleurs », « notamment ») posés par réflexe.
- **Ne pas jouer** : pas de cadence de keynote, de conclusion en applaudissement, de ton guichet (« excellente question », « n'hésitez pas à »). Commencer où la réponse commence, s'arrêter où elle s'arrête.
- **Rester utilisable** : ne jamais retirer titres, listes, liens, citations, réserves ou prochaines étapes au nom du style.
- **Tics à surveiller** (répétition, pas existence) : « il est important de noter que », « à l'ère de », « en conclusion », « ce n'est pas X, c'est Y », « le vrai enjeu est », « témoigne de », « joue un rôle clé » ; verbes creux (« tirer parti », « favoriser », « souligner », « mettre en lumière ») ; anglais : « delve », « tapestry », « landscape », « leverage », « robust », « seamless » ; triades réflexes (« plus clair, plus rapide, moins cher »), concession-plus-positif en boucle, définitions en fin de paragraphe (« le genre de X où Y »), mêmes arcs de paragraphe, mini-phrases empilées, emojis décoratifs, guillemets courbes et `…` en texte brut. Composés temporaires : trait d'union avant le nom (« un plan à long terme »), ouvert après quand l'usage l'autorise.

## Corrections types

- Général → spécifique : « Le changement a eu de larges implications » → « Le changement a réduit le temps de relecture, mais a poussé plus de cas limites vers la file d'escalade. »
- Éloge → conséquence : « Le projet témoigne de l'engagement de l'équipe » → « Le projet a remplacé trois réunions hebdomadaires par une checklist écrite. »
- Causalité abusive → relation tenue : « Le redesign a restauré la confiance » → « Après le redesign, les questions de remboursement ont baissé » (si la confiance n'est pas mesurée, ne pas dire qu'elle a bougé).
- Futur certain → timing sourcé : « La version arrive en avril » → « La version est prévue en avril, selon la feuille de route publiée. »
