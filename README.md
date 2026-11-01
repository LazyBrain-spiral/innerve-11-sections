# Innerve 11 — section extracts (private)

Selected sections lifted from the Demon Slayer fan build of the Innerve 11 hackathon site
(source: https://github.com/siddharthpathania/innerve-11). Kept private per that repo's
README, which notes it contains official Demon Slayer artwork and must not be published.

Included sections, in page order:

- **Infinity Castle** — 3D flythrough (three.js + bloom), driven by scroll (`castle.js`)
- **Prize pool** — the animated ₹12 Lacs+ counter plus the prize cards
- **Testimonials** — "Words from the survivors"
- **Past sponsors** — "Allies of the corps"
- **Footer**

## Run

Static site, no build step. GSAP, Lenis and three.js load from CDNs.

```sh
npx http-server -p 8000 -c-1
# open http://localhost:8000
```

## Files

| File | What it does |
|---|---|
| `index.html` / `styles.css` | Trimmed page with only the sections above; stylesheet unchanged |
| `data.js` | All content (prizes, testimonials, sponsors); edit here |
| `main.js` | Trimmed driver: content rendering, castle/prize scroll scenes, reveals |
| `castle.js` | 3D Infinity Castle flythrough, unchanged |
| `assets/logos/` | Sponsor logos and favicon used by the kept sections |

Removed from the original: loader/gate, hero, fall, breathing interlude, about, tracks,
frames gallery, timeline, mini-game, FAQ, register finale, and all audio (music/SFX,
`audio.js`/`music.js`/`forms.js`/`game.js`/`crazy.js`/`fx.js`) plus character artwork.
Note: the footer's "Navigate" links (`#tracks`, `#timeline`, `#faq`, `#top`) point at
sections that are not part of this extract and are inert here.
