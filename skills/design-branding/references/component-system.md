# Component Design System Reference

## Table of Contents
1. [Border Radius by Brand Personality](#border-radius-by-brand-personality)
2. [Button Specs](#button-specs)
3. [Card Specs](#card-specs)
4. [Input & Form Specs](#input--form-specs)
5. [Shadow & Elevation](#shadow--elevation)
6. [Icon System](#icon-system)
7. [Motion Tokens](#motion-tokens)
8. [Social Media Templates](#social-media-templates)

---

Specs below use the semantic tokens of [color-system.md](color-system.md) (`--primary`, `--surface`, `--border`, `--ring`…). In a Tailwind v4 project, express them as utilities over those tokens with `cva` variants, as is common in shadcn-style projects; the CSS here is the spec, not the implementation.

## Border Radius by Brand Personality

| Radius | Vibe | Logo type |
|--------|------|-----------|
| 0-2px | Brutalist, raw, geometric | Sharp angular logos |
| 4px | Corporate, professional | Clean geometric logos |
| 8px | Balanced, modern | Mixed geometry logos |
| 12px | Friendly, approachable | Rounded logos |
| 16-20px | Soft, creative, playful | Organic/curved logos |
| 24px+ | Design-forward, ultra-soft | Blob/fluid logos |
| 9999px | Pills, tags, avatars | Any (specific use) |

Scale (pick BASE from the table):
```css
--radius-none: 0;
--radius-sm: 2px;
--radius-md: BASE;          /* matches the logo corners */
--radius-lg: calc(BASE * 1.5);
--radius-xl: calc(BASE * 2);
--radius-full: 9999px;
```

## Button Specs

```css
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  min-height: 44px;                 /* comfortable touch target */
  font-weight: 600;
  transition: background-color var(--duration-fast) var(--ease-default),
              transform var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
}
.btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: var(--shadow-2); }
.btn-primary:active { transform: translateY(0); box-shadow: var(--shadow-1); }
.btn-primary:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 1.5px solid var(--primary);
  border-radius: var(--radius-md);
  padding: calc(0.75rem - 1.5px) calc(1.5rem - 1.5px); /* same box as primary */
}
.btn-secondary:hover { background: color-mix(in oklch, var(--primary) 8%, transparent); }

.btn-ghost {
  background: transparent;
  color: var(--muted-foreground);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
}
.btn-ghost:hover { background: var(--muted); color: var(--foreground); }
```

States to deliver for every variant: default, hover, active, focus-visible, disabled, loading (spinner with an accessible name, width unchanged).

## Card Specs

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-1);
  transition: box-shadow var(--duration-normal) var(--ease-default),
              transform var(--duration-normal) var(--ease-default);
}
.card:hover { box-shadow: var(--shadow-3); transform: translateY(-2px); }

.card-image { border-radius: var(--radius-lg); overflow: hidden; }
.card-image img { aspect-ratio: 16 / 9; object-fit: cover; width: 100%; }
```

Featured card: same structure, accent border or tinted surface (`--accent` at low mix), never a second shadow scale.

## Input & Form Specs

```css
.input {
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 1rem;                 /* >= 16px prevents iOS zoom on focus */
  background: var(--surface);
  color: var(--foreground);
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.input:focus-visible { border-color: var(--ring); outline: 2px solid var(--ring); outline-offset: 1px; }
.input::placeholder { color: var(--muted-foreground); }
.input:disabled { background: var(--muted); cursor: not-allowed; opacity: 0.6; }
.input[aria-invalid="true"] { border-color: var(--destructive); }
```

Error state = border color plus a text message linked by `aria-describedby`; color is never the only signal. Checkbox, radio and select follow the same border, radius and focus tokens.

## Shadow & Elevation

**Friendly brands** (lower opacity, softer spread):
```css
--shadow-1: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-2: 0 2px 4px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04);
--shadow-3: 0 4px 8px rgb(0 0 0 / 0.08), 0 2px 4px rgb(0 0 0 / 0.04);
--shadow-4: 0 8px 16px rgb(0 0 0 / 0.10), 0 4px 8px rgb(0 0 0 / 0.04);
--shadow-5: 0 16px 32px rgb(0 0 0 / 0.12), 0 8px 16px rgb(0 0 0 / 0.06);
```

**Professional brands** (crisper):
```css
--shadow-1: 0 1px 3px rgb(0 0 0 / 0.08);
--shadow-2: 0 2px 6px rgb(0 0 0 / 0.10);
--shadow-3: 0 4px 12px rgb(0 0 0 / 0.12);
--shadow-4: 0 8px 24px rgb(0 0 0 / 0.15);
--shadow-5: 0 16px 48px rgb(0 0 0 / 0.18);
```

**Branded shadow**: `0 4px 12px color-mix(in oklch, var(--primary) 15%, transparent)`.

Dark mode: shadows barely read on dark surfaces; express elevation with a lighter surface step instead.

## Icon System

Icons default to Lucide. Match stroke and fill to the logo weight:

| Logo weight | Icon style | Stroke | Set |
|------------|------------|--------|-----|
| Thin / light | Outlined thin | 1.5px | Lucide (`strokeWidth={1.5}`) |
| Regular | Outlined | 2px | Lucide |
| Bold | Filled | — | Phosphor Fill (only if the brand truly needs filled icons) |
| Mixed | Duotone | 2px | Phosphor Duotone (same caveat) |

Sizes: 16 (inline), 20 (UI default), 24 (emphasis), 32 (feature). Interactive icons get a ≥ 44×44px hit area and an accessible name.

## Motion Tokens

The brand only sets the motion personality; tool choice, reduced motion and the forbidden patterns come from the `design-animation` skill and its motion rules.

```css
/* Friendly / playful */
--ease-default: cubic-bezier(0.34, 1.56, 0.64, 1);  /* slight overshoot */
--ease-enter:   cubic-bezier(0.22, 1, 0.36, 1);
--ease-exit:    cubic-bezier(0.55, 0, 1, 0.45);

/* Professional / corporate */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-enter:   cubic-bezier(0, 0, 0.2, 1);
--ease-exit:    cubic-bezier(0.4, 0, 1, 1);

--duration-fast: 150ms;    /* hover, focus */
--duration-normal: 250ms;  /* expand, slide */
--duration-slow: 400ms;    /* modal, page transition */
```

Animate only `transform` and `opacity` (plus `filter` when needed); never `transition: all`.

## Social Media Templates

Platform specs change: re-check the platform's current help page before exporting.

**Instagram feed (4:5, 1080×1350 standard export; Meta's ads guide recommends 1440×1800)** — margins ≥ 60px; logo + title in the top 20%, visual in the middle 60%, CTA + handle in the bottom 20%. Keep text and logo inside the centered 3:4 area: the profile grid crops thumbnails to 3:4.

**Story / Reel (9:16, 1080×1920 standard export; Meta recommends 1440×2560)** — keep text and logo out of the top 14%, the bottom 35% and 6% on each side (profile header, CTA and reply overlays, per Meta's Stories and Reels ad specs); brand-color background or full-bleed visual behind.

**LinkedIn post** — text-first platform: brand-color accent bar, short headline on the visual, logo small with the URL; the message lives in the post text.

**Profile picture (all platforms)** — logo symbol, not the full wordmark; 15–20% padding; primary brand color or white background; test the render at 32×32px (circle crop).
