# Color System Reference

## Table of Contents
1. [Color Harmony Rules](#color-harmony-rules)
2. [60-30-10 Distribution](#60-30-10-distribution)
3. [Generating Tints & Shades](#generating-tints--shades)
4. [Color Psychology by Industry](#color-psychology-by-industry)
5. [WCAG Contrast](#wcag-contrast)
6. [Design Tokens Architecture](#design-tokens-architecture)

---

## Color Harmony Rules

Select the harmony type from the brand personality validated in Phase 1:

| Harmony | Colors | Vibe | Best for |
|---------|--------|------|----------|
| **Monochromatic** | 1 hue, varied lightness | Sophisticated, clean | Luxury, minimal brands |
| **Analogous** | 2-4 adjacent hues | Calm, cohesive | Wellness, nature brands |
| **Complementary** | 2 opposite hues | Dynamic, energetic | Sports, tech, youth |
| **Split-Complementary** | 1 base + 2 neighbors of its opposite | Nuanced contrast | Premium brands |
| **Triadic** | 3 equidistant hues (120°) | Vibrant, balanced | Creative, gaming |
| **Tetradic** | 4 hues at 90° intervals | Complex, rich | Retail, design agencies |

## 60-30-10 Distribution

```
60% → Dominant (backgrounds, large surfaces) — usually neutral
30% → Supporting (structural: nav, headers, sections) — primary brand color
10% → Accent (CTAs, highlights, active states) — high-contrast pop
```

Application map:
- **60%**: `--background`, `--surface`, `--foreground`
- **30%**: `--primary`, navigation backgrounds, section accents
- **10%**: `--accent`, buttons, badges, hover highlights, links

## Generating Tints & Shades

Generate in **OKLCH** (perceptually uniform: equal lightness steps look equal, no muddy midtones), then deliver HEX. Keep OKLCH in the CSS only when the project already uses it; a charter that fixes HEX values stays in HEX.

Scale structure (10 steps per color):
```
50  — Lightest (backgrounds, subtle highlights)
100 — Light (hover states, secondary backgrounds)
200 — Light-medium (borders, dividers)
300 — Medium-light (disabled states)
400 — Medium (secondary text, icons)
500 — Base (the extracted logo color)
600 — Medium-dark (primary buttons, links)
700 — Dark (button hover, emphasis)
800 — Darker (headings on light bg)
900 — Darkest (primary text, high contrast)
```

Method: keep the logo hue, step lightness from ~97% (50) to ~25% (900), and lower chroma toward both ends so light tints do not glow and dark shades do not go muddy. Example ramp (hue 250):

```css
@theme {
  --color-primary-50:  oklch(97% 0.02 250);
  --color-primary-100: oklch(93% 0.04 250);
  --color-primary-200: oklch(87% 0.06 250);
  --color-primary-300: oklch(78% 0.09 250);
  --color-primary-400: oklch(68% 0.12 250);
  --color-primary-500: oklch(58% 0.15 250); /* base = logo color */
  --color-primary-600: oklch(50% 0.14 250);
  --color-primary-700: oklch(42% 0.12 250);
  --color-primary-800: oklch(34% 0.10 250);
  --color-primary-900: oklch(25% 0.08 250);
}
```

If the logo color is not exactly at step 500 lightness, pin it at the nearest step and rebuild the ramp around it: the logo value must appear unchanged in the scale.

## Color Psychology by Industry

| Color | Emotion | Industries | Caution |
|-------|---------|-----------|---------|
| **Blue** | Trust, calm, security | Tech, finance, health, B2B | Too cold = impersonal |
| **Red** | Energy, urgency, passion | E-commerce, food, automotive | Can feel aggressive |
| **Green** | Nature, growth, health | Wellness, eco, food | Dark = prestige, light = youth |
| **Orange** | Enthusiasm, creativity, fun | Startups, food, tech | Risk of looking cheap |
| **Purple** | Luxury, creativity, spirituality | Beauty, gaming, premium tech | Rarest in nature = premium |
| **Black** | Sophistication, power, prestige | Luxury, fashion, premium | Heavy = oppressive |
| **Yellow** | Optimism, energy, joy | Food, retail, youth | Hard to make accessible as text |
| **Pink** | Playfulness, warmth, care | Beauty, lifestyle, D2C | Can feel gendered |

## WCAG Contrast

Thresholds (WCAG 2.2 SC 1.4.3 and 1.4.11, Level AA; ratios are never rounded, 4.499:1 fails 4.5:1):

| Element | AA | AAA (info) |
|---------|----|-----------|
| Normal text | 4.5:1 | 7:1 |
| Large text: ≥ 18pt (24px), or ≥ 14pt (≈ 18.66px) bold | 3:1 | 4.5:1 |
| UI components, icons, focus indicators, input borders | 3:1 | none defined |

Verification (computed ratios, see the SKILL.md Phase 2 loop):
1. Every text / background pair, light and dark.
2. Button label on button background, every state (default, hover, disabled is exempt but must stay legible).
3. Icons, input borders and focus rings against their surroundings (`ui`).
4. Never rely on hue alone (deuteranopia, protanopia): pair color with text, icon or shape.

## Design Tokens Architecture

Three layers. Tailwind v4 projects put primitives in `@theme` and semantics in `:root` (plain HTML sites: CSS custom properties in `:root`).

**Layer 1 — Primitives** (raw values) and **Layer 2 — Semantic** (meaning), as JSON in the W3C Design Tokens format (DTCG 2025.10: `$type`, `$value`, aliases in braces):

```json
{
  "color": {
    "$type": "color",
    "blue": {
      "500": { "$value": { "colorSpace": "srgb", "components": [0.231, 0.51, 0.965], "hex": "#3B82F6" } },
      "600": { "$value": { "colorSpace": "srgb", "components": [0.145, 0.388, 0.922], "hex": "#2563EB" } }
    },
    "gray": {
      "500": { "$value": { "colorSpace": "srgb", "components": [0.42, 0.447, 0.502], "hex": "#6B7280" } },
      "900": { "$value": { "colorSpace": "srgb", "components": [0.067, 0.094, 0.153], "hex": "#111827" } }
    },
    "text": {
      "default": { "$value": "{color.gray.900}" },
      "muted": { "$value": "{color.gray.500}" }
    },
    "button": {
      "primary": { "$value": "{color.blue.600}" }
    }
  }
}
```

**Layer 3 — CSS implementation**:

```css
@theme {
  --color-blue-500: #3B82F6;
  --color-blue-600: #2563EB;
  --color-gray-50: #F9FAFB;
  --color-gray-200: #E5E7EB;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
}

:root {
  --background: var(--color-gray-50);
  --foreground: var(--color-gray-900);
  --primary: var(--color-blue-600);
  --primary-foreground: #FFFFFF;
  --border: var(--color-gray-200);
  --ring: var(--color-blue-500);
}

.dark {
  --background: var(--color-gray-900);
  --foreground: var(--color-gray-50);
  --primary: var(--color-blue-500);
  --border: var(--color-gray-700);
}
```

Dark mode is not an inversion: re-pick each semantic token from the scale and re-run the contrast check on the dark pairs.
