---
name: verif-navigateur
description: "Vérifie un site dans un vrai navigateur (Playwright) : captures en 4 tailles d'écran, erreurs console, performance, éléments clés. Déclencheurs : aperçu, capture d'écran, vérifier le rendu mobile, analyser un site existant."
---

# Vérification dans le navigateur (Playwright)

Aperçu et contrôle automatique d'un site, en local ou en ligne (URL d'un site existant à analyser avant une refonte, par exemple). Montrer les captures à l'élève et expliquer chaque problème en langage simple.

## Constraints

- NEVER run Playwright without checking if it is installed first — install if missing:
  ```bash
  npx playwright --version
  # Si absent :
  npm i -D @playwright/test && npx playwright install chromium
  ```
- ALWAYS serve the site before previewing if it is local: `npm run dev` for a Node project, otherwise `python3 -m http.server 3000` (or `npx serve .`) in the site folder; wait until it answers. A live URL needs no server.
- NEVER take screenshots without waiting for `networkidle` — partial renders are useless
- ALWAYS capture all 4 viewports — never skip breakpoints: mobile 320x568, tablet 768x1024, desktop 1024x768, wide 1440x900
- ALWAYS report console errors even if screenshots look fine
- NEVER leave browser instances open — always call `browser.close()` in a `finally` block

## Modes

- **Quick Preview** (default): 4-viewport screenshots + console errors/warnings → report with a layout verdict per viewport (e.g. "tablet has overflow on hero section")
- **Full Validation** (full check, specific route): Quick Preview + console warnings, performance, network, DOM inspection of key elements (e.g. cards, CTAs) → report with issues table

## Screenshots

```typescript
import { chromium } from 'playwright';

const viewports = [
  { name: 'mobile', width: 320, height: 568 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'wide', width: 1440, height: 900 },
];

async function screenshotAll(url: string) {
  const browser = await chromium.launch();
  try {
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `screenshot-${vp.name}.png`, fullPage: true });
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
```

Quick look without a script: `npx playwright screenshot <url> --viewport-size=320,568 screenshot-mobile.png` (same for `768,1024`, `1024,768`, `1440,900`). The CLI does not wait for `networkidle`: never use it for the report. Playwright needs a Node project: if the folder has no `package.json`, run the script from a scratch folder (`npm init -y` there) rather than adding dependencies to a plain HTML site.

## Checks (attach listeners before `page.goto`)

- **Console**: `console` events of type `error` and `warning`, plus `pageerror` messages (counted as errors)
- **Performance** (after `networkidle`, via `performance.getEntriesByType`): TTFB = `responseStart - requestStart`; DOM Loaded = `domContentLoadedEventEnd - startTime`; Full Load = `loadEventEnd - startTime`; First Paint and FCP from `paint` entries
- **Network**: `response` events → url, status, content-type, body size; report total, failed (status >= 400), 5 largest
- **DOM** (per key selector): tagName, classes, computed `display`, `position`, `width`, `height`, `color`, `backgroundColor`, `fontSize`, `fontFamily`, `innerHTML` truncated to 500 chars, `role`, `aria-label`, `tabindex`

## Output Format

```
## Browser Preview Report — {url}

### Screenshots
- mobile (320px): screenshot-mobile.png
- tablet (768px): screenshot-tablet.png
- desktop (1024px): screenshot-desktop.png
- wide (1440px): screenshot-wide.png

### Console
- Errors: {count}
- Warnings: {count}
{list if any}

### Performance
- TTFB: {ms}
- FCP: {ms}
- DOM Loaded: {ms}
- Full Load: {ms}

### Network
- Total requests: {count}
- Failed: {count}
- Largest assets: {list}

### Issues Found
| Severity | Issue | Details |
|----------|-------|---------|
```

## Skills liés

- `site-corrige` : corriger ce que la vérification révèle.
- `accessibilite` : à combiner avec axe-core pour l'accessibilité.
- `seo-audit-code` : captures + audit SEO.
