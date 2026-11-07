# React animation patterns

"The rule" in this file = [regles-motion.md](regles-motion.md).

## Contents

- Motion
- View transitions in Next.js
- Reduced-motion hook without Motion
- React Three Fiber
- Spline
- Lottie
- Rive

Exact APIs: https://motion.dev/docs/react, https://nextjs.org/docs/app/guides/view-transitions, https://r3f.docs.pmnd.rs.

## Motion

Package `motion`, imports from `motion/react` (formerly Framer Motion; a project still on `framer-motion` keeps its imports). Components using it are Client Components.

### Reduced motion and bundle size

Wrap the app once. `reducedMotion="user"` disables transform and layout animations for reduced-motion users and keeps opacity and colour changes.

```tsx
'use client'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}
```

With `LazyMotion`, use `m.div` instead of `motion.div` (about 4.6 KB at first render). `domAnimation` covers animations, variants, exit and hover/tap/focus gestures; `domMax` adds drag and layout animations. `useReducedMotion()` returns the preference for custom branches.

### Enter, gestures, in view

```tsx
<m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} />

<m.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} />

<m.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
/>
```

### Variants and stagger

```tsx
const list = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

<m.ul variants={list} initial="hidden" animate="visible">
  {items.map((i) => <m.li key={i.id} variants={item}>{i.label}</m.li>)}
</m.ul>
```

### Exit animations

```tsx
import { AnimatePresence, m } from 'motion/react'

<AnimatePresence mode="wait">
  {open && (
    <m.div key="panel" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} />
  )}
</AnimatePresence>
```

### Layout and shared elements (`domMax`)

```tsx
<m.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>{content}</m.div>

{tabs.map((tab) => (
  <button key={tab} onClick={() => setSelected(tab)}>
    {tab}
    {selected === tab && <m.span layoutId="tab-underline" className="underline" />}
  </button>
))}
```

### Scroll-linked values

```tsx
import { m, useScroll, useTransform } from 'motion/react'

function ScrollParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  return <m.div ref={ref} style={{ y }} />
}
```

Motion values update outside React renders; never mirror them into state.

### Drag and SVG drawing (`domMax` for drag)

```tsx
<m.div drag="x" dragConstraints={{ left: -200, right: 0 }} dragElastic={0.2} />

<m.path d="M10 50 L90 50" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
```

## View transitions in Next.js

App Router, no configuration: React's `<ViewTransition>` animates during navigations, `<Suspense>` reveals and `startTransition` updates (not plain `setState`). Browsers without support navigate normally.

Shared element: same `name` on both pages.

```tsx
import { ViewTransition } from 'react'
import Image from 'next/image'

<ViewTransition name={`photo-${photo.id}`} share="morph" default="none">
  <Image src={photo.src} alt={photo.title} />
</ViewTransition>
```

```css
::view-transition-group(.morph) { animation-duration: 400ms; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

`default="none"` stops a named element from cross-fading on every unrelated transition; keep `share` on the pair. Directional route slides (`<Link transitionTypes={['nav-forward']}>` with `enter`/`exit` maps in each `page.tsx`, never the layout) and Suspense enter/exit: follow the Next.js guide above.

## Reduced-motion hook without Motion

```ts
import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(query)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
```

The server snapshot is `false`: the server-rendered markup must already be the visible final state.

## React Three Fiber

`@react-three/fiber` with `@react-three/drei`, loaded client-only behind the rule's guard (desktop, fine pointer, no reduced motion, static poster otherwise).

```tsx
// Scene.tsx
'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function Spinner() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.6 // frame-rate independent
  })
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Spinner />
    </Canvas>
  )
}
```

```tsx
// In a Client Component
const Scene = dynamic(() => import('./Scene'), { ssr: false, loading: () => <Poster /> })
```

- Mutate refs in `useFrame`; never `setState` per frame.
- Many identical objects: `<instancedMesh>`.
- A static scene: `frameloop="demand"` and `invalidate()` after changes.
- Scroll-linked 3D: drei `ScrollControls` + `useScroll`, or a GSAP ScrollTrigger tweening a ref's properties inside `useGSAP`.

## Spline

Design-led 3D scenes exported from Spline. In Next.js, `@splinetool/react-spline/next` renders a placeholder on the server.

```tsx
import Spline from '@splinetool/react-spline/next'

export function HeroScene() {
  return <Spline scene="https://prod.spline.design/<scene-id>/scene.splinecode" />
}
```

Not for custom shaders, particles or game logic: use React Three Fiber.

## Lottie

After Effects animations in the `.lottie` format with `@lottiefiles/dotlottie-react`.

```tsx
'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

export function Loader() {
  const reduced = usePrefersReducedMotion()
  return <DotLottieReact src="/animations/loader.lottie" loop={!reduced} autoplay={!reduced} />
}
```

## Rive

Interactive animations driven by a state machine, with `@rive-app/react-canvas` (Canvas2D; `@rive-app/react-webgl2` when the file uses Rive Renderer features such as vector feathering). Control them through data binding (view model properties); state machine inputs (`useStateMachineInput`) are deprecated.

```tsx
'use client'
import { useRive, useViewModelInstanceBoolean } from '@rive-app/react-canvas'

export function LikeButton() {
  const { rive, RiveComponent } = useRive({ src: '/animations/like.riv', stateMachine: 'Main', autoplay: true, autoBind: true })
  const { value: liked, setValue: setLiked } = useViewModelInstanceBoolean('liked', rive?.viewModelInstance)
  return (
    <button aria-label="Like" aria-pressed={!!liked} onClick={() => setLiked(!liked)}>
      <RiveComponent style={{ width: 48, height: 48 }} />
    </button>
  )
}
```

Check the view model property names and types (boolean, number, string, enum, trigger with `useViewModelInstanceTrigger`) in the `.riv` file before wiring them.
