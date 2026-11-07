# Google Trends — Workflow SEO/AEO/GEO 2025-2026

## Contents

- [Concepts Fondamentaux](#concepts-fondamentaux)
- [Cas d'Usage Prioritaires](#cas-dusage-prioritaires)
- [Collecte sans code](#collecte-sans-code-mac-linux-et-windows)
- [Intégration dans l'Audit](#intégration-dans-laudit)
- [Autres sources](#autres-sources)
- [Limites et Précautions](#limites-et-précautions)


## Concepts Fondamentaux

### Données normalisées (0–100)
- Données relatives (pas de volume absolu)
- 100 = pic d'intérêt maximum sur la période
- Cross-validation obligatoire avec outils volume réel (SEMrush, Ahrefs, Ubersuggest)
- Comparer topics vs topics, keywords vs keywords (ne pas mixer)

### Topics vs Mots-clés
- **Topics** : groupe de termes partageant le même concept, toutes langues (ex: "Paris" inclut "capitale de la France")
- **Keywords** : phrase exacte → moins fiable pour comparaisons multi-langues
- **Règle** : Toujours préférer les Topics pour les comparaisons cross-marchés

## Cas d'Usage Prioritaires

### 1. Breakout Keyword Discovery
**Définition** : requête associée affichée « Breakout » = croissance > 5000 % sur la période analysée (Trends Help)

**Pourquoi ça marche** :
- Faible compétition au moment de la découverte
- Haute intention utilisateur (terme émergent, demande authentique)
- Fenêtre courte avant saturation

**Workflow** :
1. Ouvrir Google Trends → "Trending Now" (rafraîchi en moyenne toutes les 10 min ; filtres : pays/région, période, statut)
2. Dans "Explorer", filtrer par catégorie secteur + région
3. Identifier breakout queries dans "Related Queries" → section "Rising"
4. Valider avec SEMrush/Ahrefs (volume réel + difficulté)
5. Créer contenu answer-first dans les 48h si breakout confirmé

### 2. Seasonal Content Calendar
**Données** : Timeframe 5 ans pour identifier patterns annuels

**Workflow** :
1. Saisir keyword cible, timeframe = "5 dernières années"
2. Identifier les pics récurrents (mois/semaine)
3. Planifier publication **30–60 jours avant le pic**
4. Structurer en format AEO/GEO pour capturer AI + SEO

**Exemples** (hypothèses à confirmer sur 5 ans dans Trends) :
- "Black Friday deals" → pic fin novembre (semaine 47 ou 48 selon l'année) → publier en octobre
- "formation en ligne" → pics janvier + septembre → publier en novembre et en juillet
- "création entreprise" → pic janvier → publier début décembre

### 3. Geo-Targeting Local
**Usage** : Identifier régions à forte demande pour contenu local

**Workflow** :
1. Saisir keyword, timeframe = "12 derniers mois"
2. Descendre vers "Intérêt par sous-région"
3. Identifier Top 5 régions = créer pages/sections géo-spécifiques
4. Combiner avec Google Business Profile pour local SEO

**Format contenu geo** :
```
"[Service] à [Ville/Région]"
Ex : "consultant IA en Corse" → si la Corse ressort dans "Intérêt par sous-région"
```

### 4. Competitive Gap Analysis
**Usage** : Trouver les opportunités de contenu que les concurrents ne couvrent pas

**Workflow** :
1. Saisir noms des concurrents dans Google Trends
2. Analyser "Related Topics" et "Related Queries"
3. Identifier topics à haute croissance non couverts par votre site
4. Comparer tendances : si concurrent en déclin sur un topic → opportunité

### 5. Trend Validation
**Règle** : Ne JAMAIS baser une décision de contenu uniquement sur Google Trends
```
Trends (0–100) + Volume réel (SEMrush/Ahrefs) + Difficulté = Décision
```

**Grille de décision** :
| Trends | Volume | Difficulté | Action |
|--------|--------|-----------|--------|
| Croissant | Faible | Faible | Investir maintenant |
| Croissant | Élevé | Faible | Priorité top |
| Stable | Élevé | Élevé | Optimiser existant |
| Déclinant | Faible | Élevé | Éviter |

## Collecte sans code (Mac, Linux et Windows)

1. Ouvrir https://trends.google.com/trends/explore (navigateur de l'agent ou de l'élève).
2. Saisir jusqu'à 5 mots-clés à comparer, choisir le pays (France), la période (« 5 dernières années » pour la saisonnalité, « 12 derniers mois » pour la tendance récente) et le type de recherche (Web).
3. Bloc « Intérêt au fil du temps » : bouton de téléchargement → fichier CSV (`multiTimeline.csv`). Le ranger dans `.studio/trends/`.
4. Bloc « Requêtes associées » (onglet « En hausse ») : relever les requêtes marquées « Forte hausse » ou à fort pourcentage, et leur pays ou région si pertinent (bloc « Intérêt par sous-région »).
5. Analyser le CSV (tendance, pic, mois forts), une ligne identique partout :
   ```
   node "${CLAUDE_SKILL_DIR}/scripts/analyser-trends.mjs" .studio/trends/multiTimeline.csv
   ```
   (Codex : remplacer `${CLAUDE_SKILL_DIR}` par le dossier du skill `seo-visibilite`.)

Ne jamais inventer de chiffres : si Google Trends refuse l'accès (trop de requêtes, captcha), le dire, demander à l'élève de faire l'export lui-même et de déposer le CSV dans le projet.

## Intégration dans l'Audit

### Données à inclure dans le rapport

Pour chaque mot-clé analysé :
```markdown
#### [Keyword]
- **Tendance 12 mois** : Croissante / Stable / Déclinante
- **Score actuel** : XX/100
- **Breakout queries associées** : [liste]
- **Pic annuel** : [mois] → Publier en [mois - 30j]
- **Régions top** : [région 1], [région 2], [région 3]
- **Related queries rising** :
  - "[query]" : +XX%
  - "[query]" : Breakout
- **Recommandation** : [action concrète]
```

### Workflow complet audit Trends (30 min)

1. **Identifier 5 seed keywords** depuis l'URL + secteur + mots-clés fournis
2. **Analyser tendances 12 mois** → croissant/stable/déclinant
3. **Extraire breakout related queries** → liste d'opportunités immédiates
4. **Vérifier saisonnalité 5 ans** → timing optimal par keyword
5. **Analyser top régions** → potentiel local SEO
6. **Analyser concurrents** dans Trends → topics gaps
7. **Croiser avec volume réel** → valider avec SEMrush/Ahrefs
8. **Compiler en recommandations** → contenu calendar + priorités

## Autres sources

| Outil | Prix | Note |
|-------|------|------|
| **Google Trends UI** | Gratuit | Export CSV manuel |
| **Google Trends API (alpha)** | Sur candidature | Officiel ; 5 ans glissants, échelle cohérente entre requêtes (pas 0–100) ; related queries non documentées |
| **SerpApi** | Payant (dès 25 $/mois, 250 recherches gratuites) | Interest over time/region, related queries/topics |
| **Glimpse** | Freemium | Extension Chrome + data trends |
| **Exploding Topics** | Payant (essai 7 j) | Breakout detection automatique |
| **n8n** | Self-hosted gratuit | Planifier exports (SerpApi/HTTP) → Sheets |

Prix relevés le 2026-09-27 : revérifier sur la page tarifs de l'éditeur avant de les citer.

## Limites et Précautions

- **Accès limité** : Google Trends bloque parfois les consultations répétées (captcha, erreur 429) : espacer, ou faire faire l'export par l'élève
- **Données normalisées** : toujours croiser avec volume absolu
- **Biais géographique** : adapter la langue ET le pays (pays France et langue française)
- **Timeframe court vs long** : tendances récentes vs patterns saisonniers sont des analyses différentes

