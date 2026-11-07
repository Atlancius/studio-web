# Typography System Reference

## Table of Contents
1. [Font Classification & Personality](#font-classification--personality)
2. [Font Pairing Rules](#font-pairing-rules)
3. [Pairing Starting Points by Brand Type](#pairing-starting-points-by-brand-type)
4. [Modular Type Scale](#modular-type-scale)
5. [Responsive Fluid Typography](#responsive-fluid-typography)
6. [Spacing & Readability](#spacing--readability)
7. [Loading & Licensing](#loading--licensing)

---

## Font Classification & Personality

| Class | Communicates | Best for | Examples |
|-------|-------------|----------|---------|
| **Serif** | Tradition, credibility, prestige | Editorial, luxury, law, finance | Lora, EB Garamond, Playfair Display |
| **Sans-Serif** | Modern, clean, efficient | Tech, SaaS, apps, startups | Inter, Work Sans, Manrope, Figtree |
| **Slab Serif** | Sturdy, confident, bold | Headlines, bold statements | Roboto Slab, Zilla Slab |
| **Display** | Personality, impact, creative | Headlines only, never body | Bebas Neue, Abril Fatface, Fraunces |
| **Script** | Elegant, personal, handcrafted | Logos, accents (very limited) | Dancing Script, Pacifico |
| **Monospace** | Technical, precise, code | Code blocks, data | JetBrains Mono, Source Code Pro |

## Font Pairing Rules

1. **Maximum 3 fonts**: Display + Body + (optional Mono).
2. **Contrast or nothing**: pair fonts that differ clearly (serif + sans), never two that look almost the same.
3. **Match x-height**: lowercase height visually similar between paired fonts.
4. **Single-family option**: one variable family with several weights can replace two fonts (one file, guaranteed harmony).
5. **The logo dictates direction**:
   - Serif logo → serif display + sans body (or all-serif system)
   - Sans logo → sans display + serif body (or all-sans system)
   - Script logo → clean sans (never two scripts)
   - Custom lettering → pick the closest open font for headlines; never imitate the logo lettering in UI text.

## Pairing Starting Points by Brand Type

Starting points, not defaults: a pairing reused on every project gives the generic templated look. Justify the final pick from the logo.

| Brand type | Pairings to consider |
|---|---|
| Modern & minimal (tech, SaaS) | Inter + DM Serif Display · Geist + Geist Mono · Manrope + Newsreader |
| Sophisticated & editorial (luxury, media) | Playfair Display + Raleway · EB Garamond + Inter · Lora + Nunito |
| Bold & creative (agencies, youth) | Bebas Neue + Open Sans · Fraunces + Poppins · Montagu Slab + Figtree |
| Professional & corporate (B2B, finance) | Work Sans + Source Serif 4 · Manrope + Lora · IBM Plex Sans + IBM Plex Serif |
| Accessible & friendly (public, education) | Atkinson Hyperlegible + Source Sans 3 · Lexend + Merriweather |

## Modular Type Scale

| Ratio | Name | Contrast | Best for |
|-------|------|----------|----------|
| 1.125 | Major Second | Subtle | Dense UI, dashboards |
| 1.200 | Minor Third | Moderate | Most web projects |
| 1.250 | Major Third | Clear | Content-focused sites |
| 1.333 | Perfect Fourth | Strong | Marketing, landing pages |
| 1.414 | Augmented Fourth | Bold | Creative, editorial |
| 1.618 | Golden Ratio | Premium | Luxury, high-end |

Example (1.250, base 16px): caption 13, body 16, H4 20, H3 25, H2 31, H1 39, display 49 (px, rounded).

## Responsive Fluid Typography

Use `clamp(min, rem + vw, max)`. Always mix a `rem` term into the preferred value: a pure `vw` value ignores browser zoom and text-size settings (WCAG 1.4.4 Resize Text). Heuristic: keep max ≤ 2.5 × min so 200% zoom still enlarges the text.

```css
:root {
  --text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-xl:   clamp(1.25rem, 1rem + 1.2vw, 1.75rem);
  --text-2xl:  clamp(1.5rem, 1rem + 2vw, 2.5rem);
  --text-3xl:  clamp(1.875rem, 1rem + 3vw, 3.5rem);
  --text-4xl:  clamp(2.25rem, 1rem + 4vw, 4.5rem);
}
```

In a Tailwind v4 project, declare these as `--text-*` in `@theme` so they become utilities.

## Spacing & Readability

- **Line height**: body 1.5–1.6; headings 1.1–1.3; captions 1.3–1.4; longer lines need more.
- **Letter spacing**: body 0 to 0.01em; headings −0.02em to 0; all caps ≥ +0.05em; small text +0.02em.
- **Line length**: 45–75 characters (≈ 66 ideal), 35–40 on mobile; `max-width: 65ch` on text containers.

## Loading & Licensing

- Self-host fonts. Next.js: `next/font/google` or `next/font/local` downloads the files at build time and serves them from the site's own domain, so the visitor's browser sends no request to Google. Other stacks: `woff2` files with `@font-face` and `font-display: swap` (or `optional` + a metric-adjusted fallback to avoid layout shift). A Google Fonts `<link>` is acceptable only in a throwaway prototype.
- Prefer variable fonts (one file, every weight).
- Always name the license: Google Fonts use the SIL Open Font License (a few Apache 2.0, the Ubuntu family the Ubuntu Font License), all free for web and print; any commercial foundry font is flagged with its web-license requirement before it enters the system.
- Fallback stack for every family (e.g. `Inter, ui-sans-serif, system-ui, sans-serif`).
