# Innerve 11 — Sections (Next.js + Tailwind)

Selected sections from the Innerve 11 hackathon site (Demon Slayer fan build):
Infinity Castle 3D flythrough, prize pool, testimonials, past sponsors and footer.

Migrated from the original static HTML/CSS/JS build to **Next.js (App Router) + Tailwind CSS**.
The pre-migration static build is preserved on the `legacy-static` branch for rollback.

## Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 3 (all styling migrated from the hand-written stylesheet; the only
  remaining custom CSS is a small `@layer` for pseudo-element effects: paper grain,
  the footer ichimatsu strip, the page vignette, and split-text spans)
- Three.js 0.160 (Infinity Castle flythrough, `lib/castle.ts` — behavior-frozen port
  of the original `castle.js`, wrapped in a start/dispose lifecycle)
- GSAP + ScrollTrigger + Lenis (scroll choreography, `lib/driver.ts` — faithful port
  of the original `main.js`)

## Structure

- `app/` — App Router shell (`layout.tsx` fonts/metadata, `page.tsx`, `globals.css`)
- `components/Site.tsx` — page markup (all Tailwind) + castle HUD as React state
  (moon captions, Night gate cards, progress ticks; previously `innerHTML` swaps)
- `lib/data.ts` — content (prizes, testimonials, sponsors, timeline)
- `lib/driver.ts` — scroll driver: pinning, counters, reveals, tilt, Lenis
- `lib/castle.ts` — WebGL flythrough (Three.js)
- `public/assets/` — images and logos

## Develop

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

Not affiliated with Demon Slayer, Koyoharu Gotouge or Ufotable.
