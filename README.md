# Cybaethrex

Site for Cybaethrex — a **cybersecurity consulting practice** led by AI security
and AI risk, with training as a separate destination.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

Next.js 16 (App Router) · React 19 · Tailwind CSS v4.

## Architecture

A multi-page site, not a single scrolling page. Depth lives on real routes so
the homepage can stay a summary rather than a catalogue.

| Route | Purpose |
| --- | --- |
| `/` | Consulting homepage — the argument, not the detail |
| `/services` | 5 practices · 31 services · deliverables · engagement models |
| `/industries` | Six sectors, marked where published work backs them |
| `/insights` | Point of view; `/insights/[slug]` for each piece |
| `/about` | Practice model, principles, credentials |
| `/training` | Separate training destination with its own nav context |
| `/contact` | Enquiry form |

**Positioning:** consulting first. On `/`, training appears only as a nav item,
a tertiary hero link, one bridge band and a footer column — never as programme
cards or cohort CTAs.

**Design system:** one editorial grid (`src/components/ui/Layout.tsx`). A single
1240px measure, a numbered spine down the left of every section, and hairline
rules between them — the consistency is what makes it read as one document.

**Type:** Archivo for display (headlines carry the same structural weight as the
logo's heavy grotesque), Geist Sans for body, Geist Mono for technical labels.

**Brand:** extracted from `logo/Logo.pptx`. The cloud gradient runs `#f87f17` →
`#c11126` over charcoal `#434343`. Orange carries interaction, red carries risk,
and both are re-tuned per theme because raw `#f87f17` scores only 2.46 contrast
on a light ground.

**Content:** `src/lib/content.ts` (practices, cases, frameworks),
`src/lib/site.ts` (engagement models, deliverables, industries, insights,
practice model), `src/lib/content.training.ts` (training). No component holds
copy.

## The motion system

Every timing and easing comes from `src/lib/motion.ts` — nothing is ad-hoc.

| Band      | Duration   | Used for                                    |
| --------- | ---------- | ------------------------------------------- |
| fast      | 220ms      | hover, press, focus, micro-interactions     |
| normal    | 420ms      | reveals, card state changes, nav            |
| cinematic | 850ms      | headlines, stage expansion, image reveals   |
| ambient   | 2–8s       | particles, orbits, data flow, pulses        |

Easing is `ease-out` / custom cubic-bezier / spring. Linear is reserved for
continuous technical flows (data dashes, border pulse).

### Themes

Dark is the brand default; light is a full second palette, not an inversion —
every channel flips, including the RGB triplets the canvas and SVG diagrams
read (`--rgb-signal`, `--rgb-threat`, `--rgb-hair`, …) and per-theme
intensities like `--canvas-boost` and `--grid-alpha`.

- First visit follows the OS (`prefers-color-scheme`), falling back to dark.
- The toggle in the nav overrides that and persists in `localStorage`
  (`cyb-theme`); the OS is then no longer followed for that visitor.
- An inline script in `layout.tsx` stamps `data-theme` on `<html>` before the
  first paint, so there is no flash. `<html>` carries
  `suppressHydrationWarning` for that reason.

Colours are only ever written as `var(--token)` or
`rgb(var(--rgb-token) / <alpha>)` — no literal hex or `rgba()` in components,
so a palette change is a one-file edit.

shadcn ships its own neutral token set (`--background`, `--primary`, `--radius`,
a `.dark` class). Those names are kept but **bridged onto Cybaethrex tokens** in
`globals.css`, and its `dark:` variant is redefined against our `data-theme`
attribute. That is what stops the primitives becoming a second design system:
one palette, one radius, one border treatment.

### Motion profile

`src/components/motion/MotionProfile.tsx` resolves three flags before first
paint and every animated component reads them:

- `reduced` — `prefers-reduced-motion`. Scroll-pinned sections fall back to
  static stacked layouts, ambient loops stop, cursor effects are removed. All
  content and navigation stay fully usable.
- `lite` — small screen or coarse pointer. Horizontal pinning, parallax, the
  large canvas and pointer tracking are replaced with lighter equivalents.
- `fine` — hover-capable pointer. Gates every cursor-driven effect.

### Section intensity

Deliberately uneven, so the page has rhythm:

**Homepage (`/`)**

| Section | Intensity | Mechanism |
| --- | --- | --- |
| Hero | ★★★★★ | canvas security graph + periodic attack path |
| Practices | ★★☆☆☆ | numbered editorial rows |
| What we assess | ★★★★☆ | scroll-driven SVG assembly |
| AI Security | ★★★★★ | pinned architecture build, DrawSVG |
| How to engage | ★★☆☆☆ | four engagement models |
| How findings land | ★★★★★ | pinned compromise chain |
| Method | ★★★★☆ | Assess → Advise → Architect → Assure |
| Industries · Work · Insights | ★★☆☆☆ | reveals, cursor light |
| Standards · FAQ | ★★☆☆☆ | framework band, accordion |
| Training bridge · CTA | ★★★☆☆ | one doorway, converging grid |

**Training (`/training`)** — its own hero (no canvas, so it never mimics the
consulting front door), the pinned programme track, the Learn → Practice →
Apply → Achieve timeline, lab tooling orbit, university partnerships, training
FAQ and a training-specific CTA.

### Performance

- Canvas is DPR-capped, parked by `IntersectionObserver` and on
  `visibilitychange`, and runs a reduced particle count on `lite`.
- Animation is restricted to `transform`, `opacity`, `pathLength` and SVG
  attributes; scroll progress goes through `useSpring` rather than per-frame
  React state.
- Scroll-pinned sections cap their diagram height in `vh` so short laptop
  viewports scale the drawing instead of clipping it.

## Structure

```
src/app/                 layout, / (consulting), /training, /contact
src/components/motion/   motion profile provider, Lenis smooth scroll
src/components/theme/    theme provider + nav toggle
src/components/ui/       Cybaethrex primitives + shadcn primitives (button,
                         input, textarea, label, toggle-group, sheet)
src/components/layout/   Nav, Footer, PageTransition
src/components/sections/ one file per homepage section
src/lib/content.ts       consulting copy: pillars, engagement, frameworks, cases
src/lib/content.training.ts  training copy: programmes, method, tooling, audiences
src/lib/motion.ts        durations, easings, shared variants (Motion)
src/lib/gsap.ts          plugin registration, scrub settings (GSAP)
src/lib/hooks.ts         cursor light, viewport, scroll helpers
```

## Not wired up yet

- **Contact form** (`src/app/contact/ContactForm.tsx`) validates and shows a
  confirmation state, but does not post anywhere. Point `onSubmit` at your
  inbox, CRM or ticketing system before going live.
- **Legal pages** (privacy, terms, responsible disclosure, refunds) are linked
  from the footer but point at `/contact` until the documents exist.
- **Claims to confirm before launch.** Two from the previous site were left
  out deliberately: the "cyber attacks every 39 seconds" statistic (unsourced
  and widely recycled) and the "50+ universities" figure, which appeared only
  inside an FAQ answer. If the partnership number is real it belongs in the
  hero, not buried; if it is aspirational it should not ship at all.
