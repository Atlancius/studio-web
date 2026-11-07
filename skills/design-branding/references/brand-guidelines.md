# Brand Guidelines Reference

## Table of Contents
1. [Complete Brand Package Checklist](#complete-brand-package-checklist)
2. [Logo Usage Rules](#logo-usage-rules)
3. [Brand Voice Framework](#brand-voice-framework)
4. [Photography Style Guide](#photography-style-guide)
5. [Brand Audit Method](#brand-audit-method)

---

## Complete Brand Package Checklist

This skill specifies every item; the asset files themselves are produced by the asset skills named in SKILL.md.

### Core visual assets (spec only)
- [ ] Logo primary (SVG master; PNG exports)
- [ ] Simplified / symbol-only version
- [ ] Horizontal + vertical lockups
- [ ] Monochrome black, monochrome white, reversed, greyscale
- [ ] Favicon (SVG + 32×32 and 16×16 fallbacks)
- [ ] App icon master (1024×1024)

### Color system
- [ ] Primary, secondary, accent, neutral scales (HEX; OKLCH if the project uses it)
- [ ] Semantic colors (success, warning, error, info)
- [ ] Dark mode semantic mapping
- [ ] Contrast report with the computed ratio of each pair (all PASS)
- [ ] CSS tokens file + tokens JSON (DTCG format)

### Typography
- [ ] Families with license and loading method (self-hosted)
- [ ] Type scale (sizes, weights, line heights, letter spacing)
- [ ] Fallback stacks

### Component system
- [ ] Radius, spacing, elevation scales
- [ ] Buttons (all states), cards, inputs, icon spec
- [ ] Motion personality (easing, durations)

### Applications
- [ ] Website direction (header, hero, card grid, footer, dark mode)
- [ ] Social profile images and post templates
- [ ] Email signature, business card, presentation template (when asked)

### Documentation
- [ ] Brand guidelines document
- [ ] Voice guide
- [ ] Photography guide
- [ ] Do's and don'ts sheet

## Logo Usage Rules

Use the logo's own rules when they exist (the student's existing charter). Otherwise propose these defaults.

### Clear space
Minimum clear space = **0.5 × logo height** on all sides. No text, graphic or border enters it.

### Minimum size (defaults)
| Context | Min width |
|---------|-----------|
| Web, horizontal lockup | 190px |
| Web, vertical lockup | 160px |
| Print, horizontal | 38mm (1.5") |
| Print, vertical | 32mm (1.25") |
| Favicon | symbol only, 32×32px |

Below the minimum, switch to the symbol-only version.

### Required variations
1. Full color — primary usage
2. Monochrome black — light backgrounds
3. Monochrome white — dark backgrounds and photos
4. Greyscale — no color printing

### Do's & don'ts
Do: keep proportions, use approved color versions, ensure contrast with the background, respect clear space.
Don't: stretch, skew or rotate; recolor; add shadows, outlines or effects; place on busy or low-contrast backgrounds; recreate or approximate the logo; combine with other logos without co-branding rules; use outdated versions.

## Brand Voice Framework

When the brand already has a defined voice, reuse it, never derive a new one. For a new brand:

### Step 1 — Personality traits (pick 4-5)

| Logo signal | Voice trait |
|-------------|-------------|
| Rounded/organic shapes | Warm, conversational, empathetic |
| Sharp/geometric shapes | Precise, authoritative, clear |
| Bright/saturated colors | Energetic, confident, bold |
| Muted/pastel colors | Calm, thoughtful, measured |
| Playful typography | Witty, casual, approachable |
| Classic serif | Knowledgeable, trustworthy, refined |

### Step 2 — Voice chart

| Trait | We are... | We are NOT... |
|-------|-----------|---------------|
| [Trait 1] | [2-3 descriptors] | [2-3 anti-descriptors] |
| [Trait 2] | [2-3 descriptors] | [2-3 anti-descriptors] |

### Step 3 — Tone by context

| Context | Tone adjustment |
|---------|----------------|
| Marketing / sales | More energetic, benefit-focused |
| Support / help | More empathetic, solution-focused |
| Social media | More casual, community-oriented |
| Documentation | More precise, instruction-focused |
| Error messages | Reassuring, action-oriented |

### Step 4 — Vocabulary
Preferred terms; avoided terms (jargon, clichés, competitor language); capitalization rules (sentence case vs title case).

## Photography Style Guide

### Lighting
| Type | When |
|------|------|
| Natural / window | Authentic moments, testimonials |
| Soft studio | Product shots, clean backgrounds |
| Backlit | Mood, depth, drama |
| High-key | Airy, optimistic pages |

### Color treatment
| Brand type | Saturation | Contrast | Temperature |
|-----------|-----------|----------|-------------|
| Vibrant / youth | +15–20% | +10% | Warm |
| Professional / B2B | −10% | +5% | Neutral |
| Luxury / premium | −5% | +15% | Cool-neutral |
| Creative / agency | Duotone in brand colors | Variable | Brand-matched |

### Composition
Rule of thirds; generous negative space; leading lines toward the content; consistent depth of field (shallow for portraits, deep for products).

### Image sizing
| Context | Ratio | Minimum |
|---------|-------|---------|
| Hero banner | 16:9 | 1920×1080 |
| Card thumbnail | 3:2 or 4:3 | 800×600 |
| Social feed | 4:5 | 1080×1350 |
| Story / vertical | 9:16 | 1080×1920 |

AI-generated imagery follows the brand's visual direction; text and logos go through the prompt or the page HTML, never pasted over a generated image afterwards.

## Brand Audit Method

1. **Collect** every touchpoint in scope: website, social profiles, emails, decks, print, signage.
2. **Score** each touchpoint 0–10 per category:

| Category | Criteria |
|----------|----------|
| Logo usage | Correct version, clear space, minimum size |
| Colors | Exact values, 60-30-10 balance, contrast |
| Typography | Correct families, hierarchy, sizes |
| Imagery | Style consistency, quality |
| Voice / tone | Trait alignment, vocabulary |
| Components | Consistent radius, shadows, spacing |

3. **Compute** compliance per category and overall: `points scored / max points × 100`.

| Score | Rating | Action |
|-------|--------|--------|
| ≥ 95% | Excellent | Monitor |
| 85–94% | Good | Minor corrections |
| 75–84% | Fair | Fix the top issues, re-audit |
| < 75% | Needs overhaul | Rebuild the affected categories from Phase 2–4 |

4. **Report**: gaps ranked Critical (wrong logo or color) > Major (fonts off) > Minor (spacing drift); top 5 issues with file or URL, current value, expected value and the exact fix; quick wins first.
