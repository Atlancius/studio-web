# Google Trends — Workflow SEO/AEO/GEO 2025-2026

## Contents

- [Concepts Fondamentaux](#concepts-fondamentaux)
- [Cas d'Usage Prioritaires](#cas-dusage-prioritaires)
- [Code Pytrends (Python)](#code-pytrends-python)
- [Intégration dans l'Audit](#intégration-dans-laudit)
- [Alternatives à Pytrends](#alternatives-à-pytrends)
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

## Code Pytrends (Python)

> pytrends est non officiel et son dépôt GitHub est archivé (lecture seule) depuis le 17 avril 2025 : usage ponctuel uniquement, casse possible sans correctif. Voir « Alternatives à Pytrends » ci-dessous.

### Installation
```bash
pip install pytrends requests
```

### Script de base
```python
from pytrends.request import TrendReq
import pandas as pd
import time

# Initialisation (hl = langue, tz = décalage en minutes, signe inversé : Paris = -60, -120 en été)
pytrends = TrendReq(hl='fr-FR', tz=-60)

# Keywords (max 5 simultanément)
keywords = ['audit SEO', 'GEO optimization', 'AEO content']

# Build payload
pytrends.build_payload(
    keywords,
    cat=0,           # 0 = all categories
    timeframe='today 12-m',  # Options: today 1-m, today 3-m, today 12-m, today 5-y
    geo='FR',        # FR, US, '' pour mondial
    gprop=''         # '' = web search, 'youtube', 'news', 'images'
)

# 1. Intérêt dans le temps
interest_time = pytrends.interest_over_time()
print(interest_time.head())

# 2. Intérêt par région
interest_region = pytrends.interest_by_region(resolution='REGION', inc_low_vol=True)
print(interest_region.sort_values(keywords[0], ascending=False).head(10))

# 3. Related queries (CRUCIAL pour trouver breakout)
related = pytrends.related_queries()
rising = related[keywords[0]]['rising']  # Trier par 'value' pour les breakout
top = related[keywords[0]]['top']

# 4. Related topics
related_topics = pytrends.related_topics()

# Rate limit non publié : espacer les appels ; après un 429, attendre ~60 s
time.sleep(5)

# Export CSV
interest_time.to_csv('trends_time.csv')
interest_region.to_csv('trends_region.csv')
rising.to_csv('trends_rising.csv')
```

### Script détection breakout
```python
from pytrends.request import TrendReq
import time

def find_breakout_keywords(seed_keywords, geo='FR', threshold=5000):
    """
    Trouve les keywords en croissance explosive (breakout).
    'value' = croissance en % ; Google affiche « Breakout » au-delà de +5000 %.
    """
    pytrends = TrendReq(hl='fr-FR', tz=-60)
    breakout_results = []

    for kw in seed_keywords:
        pytrends.build_payload([kw], timeframe='today 3-m', geo=geo)
        related = pytrends.related_queries()

        if related[kw]['rising'] is not None:
            rising_df = related[kw]['rising']
            breakout = rising_df[rising_df['value'] > threshold]
            breakout_results.extend(breakout['query'].tolist())

        time.sleep(3)  # Rate limit

    return list(set(breakout_results))

# Usage
seed = ['intelligence artificielle', 'formation IA', 'automatisation PME']
breakouts = find_breakout_keywords(seed, geo='FR')
print(f"Breakout queries trouvées : {breakouts}")
```

### Script analyse saisonnalité
```python
from pytrends.request import TrendReq
import pandas as pd

def analyze_seasonality(keyword, geo='FR'):
    """
    Analyse la saisonnalité sur 5 ans et retourne le mois optimal de publication.
    """
    pytrends = TrendReq(hl='fr-FR', tz=-60)
    pytrends.build_payload([keyword], timeframe='today 5-y', geo=geo)

    data = pytrends.interest_over_time()
    data.index = pd.to_datetime(data.index)

    # Groupe par mois et calcule la moyenne
    monthly_avg = data[keyword].groupby(data.index.month).mean()
    peak_month = monthly_avg.idxmax()

    months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

    print(f"Pic annuel pour '{keyword}': {months[peak_month-1]}")
    print(f"Publier en: {months[(peak_month-2) % 12]} (30 jours avant)")

    return monthly_avg

# Usage
analyze_seasonality('formation en ligne', geo='FR')
```

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

## Alternatives à Pytrends

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

- **Pytrends non officiel et archivé** → peut casser si Google change son endpoint, sans correctif
- **Rate limiting** : limite non publiée ; espacer les requêtes, pause ~60 s après un 429
- **Données normalisées** : toujours croiser avec volume absolu
- **Biais géographique** : adapter la langue ET le pays (geo='FR' + hl='fr-FR')
- **Timeframe court vs long** : tendances récentes vs patterns saisonniers sont des analyses différentes

