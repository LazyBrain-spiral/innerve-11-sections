"use client";

/* Innerve 11 — landing hero, Rengoku Kyojuro (Flame Hashira).

   Poster layout (after the "GLASSES" reference): ivory field with hand-drawn
   red scribbles, a giant red INNERVE across the middle, two small labels
   tucked under its left and right edges, corner metadata, and a solid red
   band across the bottom. Rengoku stands centred, in front of the type, his
   legs straddling the ivory/red boundary.

   Geometry lives in CSS variables on the stage (--fig, --figBottom, --bandTop)
   so the figure, band and copy keep their relationship at every size.

   One motion system per wrapper, so no two systems ever write the same transform:
     .rc-*  curtain   → ScrollTrigger scrub while #tracks slides up over us
     .rz-*  scroll    → ScrollTrigger scrub over the first viewport height
     .re-*  entrance  → one-shot timeline on load (~1.5s, ease-out)
     .rf-*  ambient   → CSS keyframes (breathe), infinite
   Anything laid over the character art goes inside .rf-art next to the <img>
   so it inherits every transform and stays pixel-locked to Rengoku.

   The stage is CSS-sticky in a 300svh track: 100svh of scroll choreography,
   then #tracks (pulled up 100svh) rises over the stuck stage.

   prefers-reduced-motion: no timelines, no tapes, no scramble; the settled
   poster renders as-is. */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INNERVE } from "@/lib/data";
import { scramble } from "@/lib/scramble";

const WORD = "INNERVE".split("");
const MID = (WORD.length - 1) / 2;


/* event facts, all derived from lib/data.ts (or the site's existing copy) */
const DATES = "30–31 Jan 2027";
const START = `${INNERVE.eventStart.slice(11, 16)} IST`; // eventStart is +05:30
const FACTS_L = `24 Hours · ${INNERVE.tracks.length} Tracks`;
const FACTS_R = `₹${INNERVE.poolLacs}L+ Prize Pool`;
const REG = INNERVE.timeline[0]; // { date: "15 Nov 2026", title: "Registration Starts" }

/* crossed tapes: event facts on repeat, wiped in by scroll */
const TAPE = ["Innerve 11", DATES, FACTS_L, FACTS_R, "OSS Club · AIT Pune"];
const TAPE_RUN = Array.from({ length: 6 }, () => TAPE).flat();

/* hand-drawn scribbles (1440×900 artboard, sliced to cover) */
const SCRIBBLES = [
  "M-40 230C90 130 230 300 360 210S560 70 640 170S570 360 470 310S510 120 700 110S980 270 1090 170S1300 50 1480 150",
  "M-60 640C70 540 190 720 310 610S430 430 570 480S610 650 510 610S460 470 640 430",
  "M1500 540C1380 620 1260 460 1160 540S1000 720 900 610S960 430 1090 460S1230 610 1310 390S1420 270 1500 310",
  "M760 -30C820 50 700 110 770 180S940 210 920 120S820 60 860 -30",
];

/* screen-reader text + decoding visual twin */
const Scramble = ({ text }: { text: string }) => (
  <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true" data-scramble={text} className="tabular-nums">{text}</span>
  </>
);

/* a label that slides up from behind its own baseline */
const Slide = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`block overflow-hidden ${className}`}>
    <span className="re-in block">{children}</span>
  </span>
);

export default function RengokuHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = el.querySelector<HTMLElement>(".flame__stage")!;
    const next = el.nextElementSibling as HTMLElement | null;
    const cancels: (() => void)[] = [];
    const decode = (scope: Element) =>
      scope.querySelectorAll<HTMLElement>("[data-scramble]").forEach((s) => cancels.push(scramble(s)));

    let intro: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      /* ================= 1. entrance (time-based, once, ~1.5s) ================= */
      const labels = gsap.utils.toArray<HTMLElement>(".re-label", el);
      const slides = labels.flatMap((l) => [...l.querySelectorAll<HTMLElement>(".re-in")]);
      const band = gsap.utils.toArray<HTMLElement>(".re-band", el);
      intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .to(".re-veil", { opacity: 0, duration: 0.3, ease: "power1.out" }, 0)
        .set(".re-veil", { visibility: "hidden" }, 0.3)
        // scribbles draw themselves in behind the type (entrance only)
        .fromTo(".re-scribble", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.08 }, 0)
        // red band rises from the bottom edge
        .from(".re-bandBg", { yPercent: 100, duration: 1, ease: "expo.out" }, 0.05)
        // headline: letters rise out of a mask, spread apart, then tighten into place
        .from(".re-ch", {
          yPercent: 110,
          xPercent: (i: number) => (i - MID) * 34,
          duration: 1.05,
          stagger: { each: 0.035, from: "center" },
        }, 0.08)
        // Rengoku: bottom-up wipe (counter-translated mask) while he rises a touch
        .from(".re-art", { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, 0.15)
        .from(".re-artIn", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 0.15)
        .from(".re-lift", { y: 30, duration: 1.2 }, 0.2)
        // only after those land: labels/metadata, then the band copy and CTA
        .from(slides, { yPercent: 105, duration: 0.5, stagger: 0.05 }, 0.95)
        .from(band, { opacity: 0, y: 12, duration: 0.45, stagger: 0.08, ease: "power3.out" }, 1.1)
        .add(() => {
          gsap.set([".re-bandBg", ".re-ch", ".re-art", ".re-artIn", ".re-lift", ...slides, ...band], { clearProps: "transform,opacity" });
        });
      labels.forEach((l, i) => intro!.call(() => decode(l), [], 0.95 + i * 0.05));

      /* ================= 2. scroll: layered split, not a zoom ================= */
      const scroll = { trigger: el, start: "top top", end: () => `+=${stage.offsetHeight}`, invalidateOnRefresh: true };
      gsap
        .timeline({ defaults: { ease: "none", duration: 1 }, scrollTrigger: { ...scroll, scrub: true } })
        // every element on its own rate, so the poster separates into layers
        // headline tears apart from its centre; each letter also lifts at its own speed
        .to(".rz-head", { scale: 1.18 }, 0)
        .to(".rz-ch", {
          x: (i: number) => (i - MID) * window.innerWidth * 0.26,
          y: (i: number) => [-30, 24, -54, 0, -40, 16, -22][i] ?? 0,
        }, 0)
        .to(".rz-ch", { opacity: (i: number) => (Math.abs(i - MID) < 1.5 ? 0 : 1), duration: 0.3 }, 0.6)
        // under-labels peel off sideways, slower than the letters
        .to(".rz-subL", { x: () => -window.innerWidth * 0.2, opacity: 0, duration: 0.7 }, 0)
        .to(".rz-subR", { x: () => window.innerWidth * 0.2, opacity: 0, duration: 0.7 }, 0)
        // scribbles: each line drifts at a different speed
        .to(".rz-path", { y: (i: number) => [-90, -190, -130, -250][i] ?? -120 }, 0)
        // corners leave first, at two different speeds
        .to(".rz-cornerL", { y: -90, opacity: 0, duration: 0.3 }, 0)
        .to(".rz-cornerR", { y: -45, opacity: 0, duration: 0.45 }, 0)
        // band description sinks away; the CTA stays put
        .to(".rz-bandL", { y: 50, opacity: 0, duration: 0.5 }, 0.05)
        // he barely moves and settles into the band
        .to(".rz-art", { scale: 0.94, yPercent: 3 }, 0);

      /* ================= 3. crossed tapes: wipe in from opposite sides, text runs ================= */
      gsap.timeline({ scrollTrigger: { ...scroll, scrub: 1 } })
        .fromTo(".rz-tapeA", { xPercent: -101 }, { xPercent: 0, duration: 0.42, ease: "power3.out" }, 0.04)
        .fromTo(".rz-tapeB", { xPercent: 101 }, { xPercent: 0, duration: 0.42, ease: "power3.out" }, 0.12)
        .fromTo(".rz-runA", { xPercent: 0 }, { xPercent: -18, duration: 1, ease: "none" }, 0)
        .fromTo(".rz-runB", { xPercent: -18 }, { xPercent: 0, duration: 1, ease: "none" }, 0);

      /* ================= 4. curtain: hero dims under the rising panel ================= */
      if (next) {
        gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } })
          .to(".rc-shade", { opacity: 0.45 }, 0)
          // Rengoku rises slower than the panel, so its edge crosses him feet-first
          .to(".rc-art", { yPercent: -36 }, 0);
      }
      /* ================= 5. pointer depth (desktop only): each layer at its own depth ================= */
      if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el).map((n) => ({
          d: Number(n.dataset.depth),
          x: gsap.quickTo(n, "x", { duration: 1.1, ease: "power3.out" }),
          y: gsap.quickTo(n, "y", { duration: 1.1, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d * 0.6); });
        };
        stage.addEventListener("pointermove", onMove);
        cancels.push(() => stage.removeEventListener("pointermove", onMove));
      }
    }, el);

    // stalled first frame? settle the entrance only, never the scrubbed timelines
    const watchdog = window.setTimeout(() => { if (intro && intro.progress() < 1) intro.progress(1); }, 4000);

    return () => {
      window.clearTimeout(watchdog);
      cancels.forEach((c) => c());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="arrival" data-tone="light" data-name="Arrival" className="flame relative h-[300svh] bg-haori text-coat">
      <div className="flame__stage sticky top-0 h-svh overflow-hidden">
        {/* ---------- scribbles ---------- */}
        <div className="rz-scribbles pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
          <div className="h-full w-full" data-depth="10">
            <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="rf-scribbles h-full w-full overflow-visible" fill="none">
              {SCRIBBLES.map((d, i) => (
                <path key={i} d={d} pathLength={1} strokeDasharray="1" className="rz-path re-scribble" stroke="#ea6a1c" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".6" />
              ))}
            </svg>
          </div>
        </div>

        {/* ---------- red band (background) ---------- */}
        <div className="flame-band pointer-events-none absolute inset-x-0 bottom-0 z-[1] overflow-hidden" aria-hidden="true">
          <div className="re-bandBg relative h-full w-full bg-coat">
            <div className="rf-glow absolute inset-0 bg-[radial-gradient(38%_75%_at_50%_62%,rgba(234,106,28,.5),rgba(184,18,44,.2)_55%,transparent_80%)]" />
          </div>
        </div>

        {/* ---------- headline + its two under-labels ---------- */}
        <div className="flame-headPos pointer-events-none absolute inset-x-0 z-[2] flex justify-center">
          <div className="rz-head" data-depth="18">
            <h1 className="flame-head font-body font-extrabold uppercase leading-[0.8]" aria-label="Innerve 11">
              <span className="flex overflow-hidden pb-[0.05em]" aria-hidden="true">
                {WORD.map((c, i) => (
                  <span key={i} className="rz-ch inline-block">
                    <span className="rf-ch inline-block" style={{ animationDelay: `${-i * 0.32}s` }}>
                      <span className="re-ch flame-letter inline-block">{c}</span>
                    </span>
                  </span>
                ))}
              </span>
            </h1>
            <div className="rz-sub re-label mt-[clamp(6px,1.2svh,14px)] flex items-start justify-between px-[0.4%] text-[clamp(12px,1.15vw,17px)] text-crimson">
              <span className="rz-subL block"><Slide className="font-semibold uppercase tracking-[0.08em]">{FACTS_L}</Slide></span>
              <span className="rz-subR block"><Slide className="font-semibold uppercase tracking-[0.08em]">{FACTS_R}</Slide></span>
            </div>
          </div>
        </div>

        {/* ---------- crossed tapes: in front of the type, behind Rengoku ---------- */}
        <div className="flame-stripPos pointer-events-none absolute inset-x-0 z-[3]" aria-hidden="true">
          <div data-depth="30">
            {/* literal class names so Tailwind keeps the component styles */}
            {[
              ["r-tapeRot r-tapeRotA", "rz-tapeA r-tape r-tapeA", "rz-runA flex w-max items-center"],
              ["r-tapeRot r-tapeRotB", "rz-tapeB r-tape r-tapeB", "rz-runB flex w-max items-center"],
            ].map(([rot, tape, run]) => (
              <div key={rot} className={rot}>
                <div className={tape}>
                  <div className={run}>
                    {TAPE_RUN.map((t, i) => (
                      <span key={i} className="flex items-center whitespace-nowrap">
                        {t}
                        <i className="r-tapeDot" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* curtain shade: dims the poster under the rising panel, stays under Rengoku and the CTA */}
        <div className="rc-shade pointer-events-none absolute inset-0 z-[4] bg-ink opacity-0" aria-hidden="true" />

        {/* ---------- Rengoku, straddling the band (overlays go inside .rf-art) ---------- */}
        <div className="flame-figPos pointer-events-none absolute left-1/2 z-[5] -translate-x-1/2" aria-hidden="true">
          <div data-depth="-16">
          <div className="rc-art">
            <div className="rz-art origin-bottom">
              <div className="re-lift">
                <div className="re-art overflow-hidden">
                  <div className="re-artIn">
                    <div className="rf-art relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/chars/rengoku.png" width={750} height={1186} alt="" fetchPriority="high" className="flame-fig block w-auto max-w-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* ---------- band copy + CTA (above every animated layer) ---------- */}
        <div className="flame-band flame-bandCopy absolute inset-x-0 bottom-0 z-[6] flex px-gut text-haori lg:justify-between lg:gap-8">
          <div className="rz-bandL re-band max-w-[30ch]">
            <span className="mb-3 flex gap-1.5" aria-hidden="true">
              <i className="rf-dot h-1.5 w-1.5 rounded-full bg-ember" style={{ animationDelay: "0.0s" }} />
              <i className="rf-dot h-1.5 w-1.5 rounded-full bg-flame" style={{ animationDelay: "0.25s" }} />
              <i className="rf-dot h-1.5 w-1.5 rounded-full bg-crimson" style={{ animationDelay: "0.5s" }} />
            </span>
            <p className="text-[clamp(13px,1vw,15px)] leading-[1.55] text-haori/80">
              India&apos;s largest student-driven hackathon. Twenty-four hours inside the Infinity Castle.
            </p>
          </div>
          <a href="#castle" data-scroll className="re-band group block text-right max-lg:text-left">
            <span className="block text-[clamp(12px,1.05vw,15px)] font-medium uppercase tracking-[0.18em] text-haori/80">
              {REG.title} · {REG.date}
            </span>
            <span className="mt-1 flex items-center gap-3 font-body text-[clamp(28px,3.1vw,50px)] font-extrabold uppercase leading-[1] tracking-[-0.02em] text-ember lg:justify-end">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">Enter the castle</span>
            </span>
          </a>
        </div>

        {/* ---------- corner metadata ---------- */}
        <div className="rz-labels pointer-events-none absolute inset-x-gut top-[clamp(18px,3svh,30px)] z-[7] flex items-start justify-between text-[clamp(10.5px,0.85vw,12.5px)] font-semibold uppercase leading-[1.5] tracking-[0.14em] text-crimson">
          <div className="rz-cornerL re-label">
            <Slide><Scramble text={DATES} /></Slide>
            <Slide><Scramble text={START} /></Slide>
          </div>
          <div className="rz-cornerR re-label text-right">
            <Slide>Innerve 11</Slide>
            <Slide>OSS Club · AIT Pune</Slide>
          </div>
        </div>

        {/* paints the poster ivory until the entrance starts (no flash of the settled state) */}
        <div className="re-veil r-veil pointer-events-none absolute inset-0 z-[20] bg-haori" aria-hidden="true" />
      </div>
    </section>
  );
}
