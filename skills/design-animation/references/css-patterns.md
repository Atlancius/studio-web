# CSS animation patterns

"The rule" in this file = [regles-motion.md](regles-motion.md).

## Contents

- Scroll-driven animations
- Staggered children
- Entry and exit without JavaScript
- View transitions
- Motion path
- Individual transform properties
- Visual effects
- will-change
- Reduced motion
- Support checks

Native CSS first: zero bundle, compositor thread, works in Server Components. Every pattern below is a progressive enhancement: the unanimated state must be complete and visible.

## Scroll-driven animations

Chromium and Safari support `animation-timeline`; Firefox stable does not. Always wrap the animation in `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`, never hide content outside that guard.

### Reveal when the element enters the viewport

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}
@keyframes reveal {
  from { opacity: 0; translate: 0 40px; }
  to { opacity: 1; translate: 0 0; }
}
```

### Reading progress bar (page scroll)

Scale the bar, never animate `width`.

```css
.progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 4px;
  transform-origin: 0 50%;
  scale: 0 1;
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .progress { animation: grow linear both; animation-timeline: scroll(root block); }
  }
}
@keyframes grow { to { scale: 1 1; } }
```

Without support, or with reduced motion, the bar stays at `scale: 0`: invisible, nothing broken.

### Parallax layer

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .parallax-layer { animation: parallax linear both; animation-timeline: scroll(nearest block); }
  }
}
@keyframes parallax { to { translate: 0 -50px; } }
```

## Staggered children

Pass the index from the markup; it works everywhere.

```html
<li class="card" style="--i: 0">…</li>
<li class="card" style="--i: 1">…</li>
```

```css
@media (prefers-reduced-motion: no-preference) {
  .card { animation: fade-up 0.4s ease-out both; animation-delay: calc(var(--i, 0) * 80ms); }
}
@keyframes fade-up { from { opacity: 0; translate: 0 12px; } }
```

`sibling-index()` can replace `--i` once every browser in the project's targets supports it.

## Entry and exit without JavaScript

`@starting-style` gives the first-frame values; `allow-discrete` lets `display` and `overlay` (top layer) wait for the exit transition.

```css
dialog {
  opacity: 0;
  translate: 0 8px;
  transition: opacity 0.25s, translate 0.25s, display 0.25s allow-discrete, overlay 0.25s allow-discrete;
}
dialog[open] { opacity: 1; translate: 0 0; }
@starting-style {
  dialog[open] { opacity: 0; translate: 0 8px; }
}
```

## View transitions

### Same document

```js
function update(change) {
  if (!document.startViewTransition) return change();
  document.startViewTransition(change);
}
```

```css
::view-transition-old(root) { animation: 0.2s ease-out both fade-out; }
::view-transition-new(root) { animation: 0.3s ease-out both fade-in; }
@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
```

### Cross document (multi-page site, Webflow)

Both pages, same origin. Chromium and Safari animate; other browsers navigate normally.

```css
@view-transition { navigation: auto; }
```

### Shared element

Give the element the same unique `view-transition-name` on both states (one element per name per page).

```css
.hero-image { view-transition-name: hero; }
::view-transition-group(hero) { animation-duration: 0.4s; }
```

### Circle reveal from the click point

```js
const transition = document.startViewTransition(() => updateDOM());
transition.ready.then(() => {
  const { clientX: x, clientY: y } = lastClickEvent;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.documentElement.animate(
    { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 500, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
  );
});
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

Next.js App Router: use React `<ViewTransition>` instead ([react-patterns.md](react-patterns.md)).

## Motion path

```css
@media (prefers-reduced-motion: no-preference) {
  .traveller {
    offset-path: path('M50,10 Q150,10 150,80 T50,150');
    offset-rotate: auto;
    animation: travel 8s ease-in-out infinite;
  }
}
@keyframes travel { to { offset-distance: 100%; } }
```

A looping animation longer than 5 seconds beside other content needs a pause control (WCAG 2.2.2). Basic shapes such as `circle()` in `offset-path` need more recent browsers than `path()`.

## Individual transform properties

Animate `translate`, `rotate` and `scale` independently; they always apply in that order.

```css
.card {
  transition: translate 0.2s ease-out, scale 0.2s ease-out;
}
.card:hover { translate: 0 -6px; scale: 1.02; }
```

## Visual effects

Decorative layers: `aria-hidden="true"`, `pointer-events: none`, colors from the project's tokens, text contrast measured on top of them.

```css
/* Glassmorphism card */
.glass {
  background: color-mix(in srgb, var(--surface) 60%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.4);
}

/* Grain: SVG noise at 2-5% opacity over a decorative layer */
.grain {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Aurora: radial gradients drifting with transform only */
.aurora {
  position: absolute; inset: -50%; pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 50%, var(--aurora-1), transparent 50%),
    radial-gradient(ellipse at 80% 20%, var(--aurora-2), transparent 50%);
}
@media (prefers-reduced-motion: no-preference) {
  .aurora { animation: drift 15s ease-in-out infinite; }
}
@keyframes drift {
  50% { translate: 2% -1%; rotate: 1deg; }
}

/* Conic gradient border on hover: a registered angle can be animated; the mask keeps only the 1px ring */
@property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
.gradient-border { position: relative; border-radius: 1rem; }
.gradient-border::before {
  content: ""; position: absolute; inset: 0; padding: 1px; border-radius: inherit; opacity: 0;
  pointer-events: none; transition: opacity 0.4s;
  background: conic-gradient(from var(--angle), var(--c1), var(--c2), var(--c3), var(--c1));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}
.gradient-border:hover::before { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .gradient-border::before { animation: spin-angle 4s linear infinite; }
}
@keyframes spin-angle { to { --angle: 360deg; } }

/* Glow button */
.glow { box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 40%, transparent); transition: box-shadow 0.3s; }
.glow:hover { box-shadow: 0 0 40px color-mix(in srgb, var(--accent) 60%, transparent); }
```

`@property` is Baseline 2024 (July 2024); without it the border simply does not rotate. The aurora and gradient-border loops last more than 5 seconds beside content: give a pause control or keep them subtle and non-essential (WCAG 2.2.2). Blur is costly on large areas on mobile: keep `backdrop-filter` to small surfaces.

## will-change

Never set statically. Add it when the interaction starts, remove it when it ends.

```js
el.addEventListener('pointerenter', () => { el.style.willChange = 'transform'; });
el.addEventListener('transitionend', () => { el.style.willChange = 'auto'; });
```

## Reduced motion

Prefer wrapping motion in `@media (prefers-reduced-motion: no-preference)`. As a global safety net for legacy CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

A softer alternative keeps meaning without movement: swap a slide for a short fade.

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
reduce.addEventListener('change', (e) => document.documentElement.classList.toggle('reduce-motion', e.matches));
```

## Support checks

Browser support moves fast: check the feature on MDN (Baseline status) before relying on it, and keep the `@supports` guard even when support looks universal.
