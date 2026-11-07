# Sanitizer et limites Ghost

## Sommaire
- stripEmDashes
- sanitizeArticle
- clampToWord et limites
- Idempotence

Filet obligatoire après le parsing du JSON P2, avant la validation des liens et le push Ghost : le modèle glisse parfois un cadratin malgré la consigne. Code de référence TypeScript ; sans runtime TypeScript, appliquer les mêmes règles avec un court script Node.

## stripEmDashes

Règles dans cet ordre (cadratin U+2014, demi-cadratin U+2013) :

| Entrée | Sortie |
|---|---|
| espace + cadratin + espace | `, ` |
| cadratin + espace | `: ` |
| espace + cadratin | `,` |
| cadratin seul | `:` |
| demi-cadratin | `-` |

```ts
function stripEmDashes(text: string): string {
  return text
    .replace(/ — /g, ", ")
    .replace(/— /g, ": ")
    .replace(/ —/g, ",")
    .replace(/—/g, ":")
    .replace(/–/g, "-");
}
```

## sanitizeArticle

Applique `stripEmDashes` à chaque champ string de l'article (`html`, `meta_*`, `og_*`, `custom_excerpt`, `feature_image_prompt`) et à chaque string de `tags`.

```ts
function sanitizeArticle<T extends Record<string, unknown>>(article: T): T {
  const out: Record<string, unknown> = { ...article };
  for (const [key, value] of Object.entries(out)) {
    if (typeof value === "string") out[key] = stripEmDashes(value);
    else if (Array.isArray(value)) out[key] = value.map((v) => (typeof v === "string" ? stripEmDashes(v) : v));
  }
  return out as T;
}
```

## clampToWord et limites

Les limites comptent des caractères, pas des mots. Dépassement : couper au dernier mot entier et ajouter `…`.

| Champ | Max caractères |
|---|---|
| `meta_title` | 60 |
| `meta_description` | 155 |
| `custom_excerpt` | 297 (Ghost : 300) |
| `og_title` | 60 |
| `og_description` | 200 |

```ts
function clampToWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const truncated = s.slice(0, max - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const cut = lastSpace > max * 0.7 ? truncated.slice(0, lastSpace) : truncated;
  return cut + "…";
}
```

Vérification : après sanitizer, aucune occurrence de U+2014 ou U+2013 et toutes les longueurs sous leur max ; sinon corriger avant de continuer.
