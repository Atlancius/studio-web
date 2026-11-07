# GSAP patterns

"The rule" in this file = [regles-motion.md](regles-motion.md).

## Contents

- Setup
- React and Next.js
- Tweens and timelines
- ScrollTrigger
- Responsive and reduced motion
- SplitText
- Flip
- SVG: DrawSVG and MorphSVG
- Observer and Draggable
- Magnetic and hover depth
- Stagger
- CSS variables
- Lenis bridge
- Performance

GSAP and every plugin are free (Webflow-sponsored) from the public `gsap` package (`gsap/ScrollTrigger`, `gsap/SplitText`, …); the [standard license](https://gsap.com/standard-license/) only prohibits tools that let users build visual animations without code and compete with Webflow's animation builder. React integration: `@gsap/react`. Exact API: https://gsap.com/docs/v3/. GSAP decisions and bans: [regles-motion.md](regles-motion.md).

## Setup

Register plugins once, in a shared module.

```ts
// lib/gsap.ts (imported only from Client Components)
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export { gsap, useGSAP, ScrollTrigger, SplitText }
```

## React and Next.js

`useGSAP` runs in a Client Component, scopes selector text to the container and reverts every tween, ScrollTrigger, SplitText and `matchMedia` created inside it on unmount. A project that already has its own hook keeps using it.

```tsx
'use client'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  const { contextSafe } = useGSAP(() => {
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
  }, { scope: root })

  // Tweens created later (event handlers) must be wrapped to be cleaned up.
  const spin = contextSafe(() => gsap.to('.hero-logo', { rotation: '+=360', duration: 0.6 }))

  return (
    <section ref={root}>
      <h1 className="hero-title">Title</h1>
      <button className="hero-logo" onClick={spin}>Logo</button>
    </section>
  )
}
```

Pass `dependencies` (and `revertOnUpdate: true` when the animation must rebuild) when props change the animation.

## Tweens and timelines

```js
gsap.to('.box', { x: 100, duration: 1, ease: 'power2.out' })
gsap.from('.box', { opacity: 0, y: 30 })
gsap.fromTo('.box', { x: 0 }, { x: 100 })
gsap.set('.box', { opacity: 1 })

const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.out' } })
tl.from('.hero h1', { opacity: 0, y: 30 })
  .from('.hero p', { opacity: 0, y: 20 }, '-=0.3') // overlap
  .from('.hero .cta', { opacity: 0, scale: 0.9 }, '<') // same start as previous
```

Build long sequences from functions that return timelines and `add()` them to a master timeline.

## ScrollTrigger

```js
// Reveal once
gsap.from('.section', {
  opacity: 0, y: 50, duration: 0.8,
  scrollTrigger: { trigger: '.section', start: 'top 80%', once: true },
})

// Scrub: progress linked to scroll
gsap.to('.bar', {
  scaleX: 1, transformOrigin: '0 50%', ease: 'none',
  scrollTrigger: { trigger: '.article', start: 'top top', end: 'bottom bottom', scrub: 1 },
})

// Pin
gsap.to('.panel', { scrollTrigger: { trigger: '.panel', pin: true, start: 'top top', end: '+=800' } })

// Horizontal scroll
const panels = gsap.utils.toArray<HTMLElement>('.panel')
gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.panels',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => '+=' + document.querySelector<HTMLElement>('.panels')!.offsetWidth,
    invalidateOnRefresh: true,
  },
})

// Many items entering the viewport (initial state set by JS, so it only hides when JS runs)
gsap.set('.item', { opacity: 0, y: 30 })
ScrollTrigger.batch('.item', {
  start: 'top 85%',
  onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, stagger: 0.1 }),
})
```

Call `ScrollTrigger.refresh()` after content that changes the page height loads late (images without dimensions, injected sections).

## Responsive and reduced motion

`gsap.matchMedia()` runs a setup per matching condition and reverts it when the condition stops matching.

```js
const mm = gsap.matchMedia()
mm.add(
  { isDesktop: '(min-width: 768px)', reduceMotion: '(prefers-reduced-motion: reduce)' },
  (context) => {
    const { isDesktop, reduceMotion } = context.conditions
    if (reduceMotion) return // content stays in its final, visible state
    gsap.from('.feature', {
      y: isDesktop ? 80 : 30, opacity: 0, stagger: 0.1,
      scrollTrigger: { trigger: '.features', start: 'top 75%', once: true },
    })
  }
)
```

## SplitText

Server HTML carries a screen-reader copy and an `aria-hidden` visual copy, because SEO and LLM extractors ignore `aria-label` and drop `aria-hidden` subtrees (rule). `aria: 'hidden'` keeps SplitText from adding a label. With `autoSplit: true`, SplitText re-splits when fonts load or the width changes; returning the tween from `onSplit` lets it rebuild and resync the animation.

```tsx
'use client'
import { useRef } from 'react'
import { gsap, useGSAP, SplitText } from '@/lib/gsap'

export function RevealHeading({ text }: { text: string }) {
  const root = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      SplitText.create('.split', {
        type: 'lines, words',
        mask: 'lines',
        aria: 'hidden',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 100, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
          }),
      })
    })
  }, { scope: root })

  return (
    <h2 ref={root}>
      <span className="sr-only">{text}</span>
      <span className="split" aria-hidden="true">{text}</span>
    </h2>
  )
}
```

## Flip

Animate a layout change (grid to list, reorder) from its previous state.

```js
const state = Flip.getState('.item')
container.classList.toggle('is-grid')
Flip.from(state, {
  duration: 0.5, ease: 'power2.out', stagger: 0.03, absolute: true,
  onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1 }),
  onLeave: (els) => gsap.to(els, { opacity: 0 }),
})
```

## SVG: DrawSVG and MorphSVG

```js
gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin)
gsap.from('#line', { drawSVG: 0, duration: 1.5, ease: 'power1.inOut' })
gsap.to('#shape-a', { morphSVG: '#shape-b', duration: 1, ease: 'power2.inOut' })
```

A standalone line draw needs no plugin: CSS `stroke-dasharray` / `stroke-dashoffset` ([css-patterns.md](css-patterns.md)).

## Observer and Draggable

```js
Observer.create({
  type: 'wheel,touch,pointer',
  onUp: () => goTo(index - 1),
  onDown: () => goTo(index + 1),
  tolerance: 10,
  preventDefault: true,
})

Draggable.create('.slider', { type: 'x', bounds: '.track', inertia: true })
```

`inertia: true` needs `InertiaPlugin` registered.

## Magnetic and hover depth

Pointer-driven effects: fine pointer and no reduced motion only (wrap in `gsap.matchMedia()`), never on touch. `gsap.quickTo` reuses one tween per property, so pointer moves stay cheap.

```tsx
'use client'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

export function MagneticButton({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const el = ref.current!
    const mm = gsap.matchMedia()
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => { xTo(0); yTo(0) } // reuse the quickTo tweens: a gsap.to on x/y would fight them
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    })
  }, { scope: ref })

  return <button ref={ref}>{children}</button>
}
```

Hover depth on a card (lift, shadow, slight scale) is a CSS `transition` on `translate`, `scale` and `box-shadow` ([css-patterns.md](css-patterns.md)); reach for GSAP only if the same property is also scrubbed or sequenced.

## Stagger

```js
gsap.from('.item', { y: 40, opacity: 0, stagger: 0.08 })
gsap.from('.item', { y: 40, opacity: 0, stagger: { amount: 0.5, from: 'center' } })
gsap.from('.cell', { scale: 0, stagger: { grid: 'auto', from: 'center', amount: 0.6 } })
```

Easing and durations come from the project's animation tokens, then the defaults in [regles-motion.md](regles-motion.md); scroll-scrubbed tweens use `ease: 'none'`.

## CSS variables

GSAP tweens custom properties directly.

```js
gsap.to(':root', { '--bg': '#0a0a0a', '--fg': '#fafafa', duration: 0.4, ease: 'power2.inOut' })
```

Colours tweened by GSAP stay in HEX, RGB or HSL, not `oklch` (rule).

## Lenis bridge

Desktop only, dynamically imported, off below 768 px and under reduced motion (rule). GSAP's ticker drives Lenis: no second `requestAnimationFrame` loop and no `autoRaf`.

```ts
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function startSmoothScroll() {
  const lenis = new Lenis() // respectReducedMotion is on by default
  const tick = (time: number) => lenis.raf(time * 1000)
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}
```

## Performance

- Tween transforms (`x`, `y`, `scale`, `rotation`) and `opacity`; never `left`, `top`, `width`, `height`.
- `gsap.delayedCall()` instead of `setTimeout`.
- Set `willChange: 'transform'` in `onStart` and clear it in `onComplete` on heavy elements only.
- No CSS transition on a property GSAP animates.
