"use client";

/* Innerve 11 — arrival hero.
   An ivory/vermilion ukiyo-e poster: red sun, a floating castle cluster in
   hand-shaped clouds, cherry branches, falling petals and birds.

   Motion is layered in three nested wrappers per scene element so no two
   systems ever write the same transform:
     .p-*  outer  → GSAP ScrollTrigger parallax (scrubbed)
     .e-*  middle → GSAP entrance timeline (plays once)
     .f-*  inner  → CSS keyframes (float / drift / sway, infinite)
   With prefers-reduced-motion nothing animates and the poster is complete. */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CASTLE, CASTLE_VB, CLOUDS, FAR, FAR_VB, ISLANDS, PETALS, clusters, type Blossom, type Shape } from "@/lib/heroArt";

const PETAL = "M0 0C-4.6 -2.6 -6.6 -9.4 -3 -13.4L0 -11L3 -13.4C6.6 -9.4 4.6 -2.6 0 0Z";
const TINTS = ["#f4c6c1", "#eba6a0", "#f8dcd6"];

const Paths = ({ shapes }: { shapes: Shape[] }) => (
  <>
    {shapes.map((s, i) => (
      <path key={i} d={s.d} className={s.c} />
    ))}
  </>
);

function Flowers({ list }: { list: Blossom[] }) {
  return (
    <>
      {list.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r}) scale(${b.s})`}>
          <g className="hero-blossom">
            {b.bud ? (
              <>
                <path d="M0 2C-3 -1 -2.6 -6 0 -8C2.6 -6 3 -1 0 2Z" fill="#e48c86" />
                <path d="M0 2L0 6" stroke="#2a211b" strokeWidth="1" />
              </>
            ) : (
              <>
                {[0, 72, 144, 216, 288].map((a) => (
                  <path key={a} d={PETAL} transform={`rotate(${a})`} fill={TINTS[b.tint]} stroke="#c9645c" strokeWidth=".45" strokeOpacity=".55" />
                ))}
                <g stroke="#a8392f" strokeWidth=".6" strokeLinecap="round">
                  <path d="M0 0L0 -5.2M0 0L4.6 -2.2M0 0L3.2 4.2M0 0L-3.2 4.2M0 0L-4.6 -2.2" />
                </g>
                <circle r="1.9" fill="#dc4f45" />
              </>
            )}
          </g>
        </g>
      ))}
    </>
  );
}

const FLOWERS_R = clusters(
  [[300, 18, 1.15], [262, 62, 1], [226, 52, 0.9], [228, 100, 1.05], [160, 130, 1.1], [112, 198, 1.2], [94, 238, 0.95], [74, 176, 0.85], [334, 90, 0.9], [196, 176, 0.85]],
  401,
);
const FLOWERS_L = clusters([[118, 114, 1], [210, 150, 1.1], [276, 104, 1], [222, 194, 0.9], [160, 160, 0.8]], 409);

/* mirror a drawing inside its own viewBox (kept off the CSS-animated svg) */
const mirror = (vb: string) => {
  const [x, , w] = vb.split(" ").map(Number);
  return `translate(${2 * x + w} 0) scale(-1 1)`;
};

function CloudSvg({ c, className, flip }: { c: { shapes: Shape[]; vb: string }; className?: string; flip?: boolean }) {
  return (
    <svg className={className} viewBox={c.vb} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g filter="url(#hero-ink)" transform={flip ? mirror(c.vb) : undefined}>
        <Paths shapes={c.shapes} />
      </g>
    </svg>
  );
}

const T1 = "INNERVE".split("");
const T2 = "11.".split("");

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    let intro: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      const boughs = gsap.utils.toArray<SVGPathElement>(".hero-bough", el);
      boughs.forEach((p) => {
        const len = p.getTotalLength() + 2;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".e-sun", { yPercent: 45, opacity: 0, duration: 1.8, ease: "power2.out" }, 0)
        .from(".e-far", { opacity: 0, y: 40, duration: 1.4 }, 0.25)
        .from(".e-band", { opacity: 0, x: -50, duration: 1.4 }, 0.3)
        .from(".e-castle", { opacity: 0, y: 70, duration: 1.4 }, 0.4)
        .from(".e-front", { opacity: 0, y: 40, x: (i: number) => (i ? 60 : -60), duration: 1.3 }, 0.45)
        .to(boughs, { strokeDashoffset: 0, duration: 1.2, stagger: 0.07, ease: "power2.inOut" }, 0.55)
        .from(".hero-blossom", { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.4)", stagger: { each: 0.018, from: "random" } }, 1.1)
        .from(".hero-ch", { yPercent: 112, duration: 0.95, stagger: 0.045, ease: "power4.out" }, 0.55)
        .from(".e-copy", { opacity: 0, y: 18, duration: 0.8, stagger: 0.08 }, 0.95)
        .from(".e-chrome", { opacity: 0, duration: 1 }, 1.2)
        .from(".e-petals, .e-birds", { opacity: 0, duration: 1.2 }, 1.2)
        // leave the copy with no inline transform/opacity once it has landed
        .add(() => { gsap.set(".hero-ch, .e-copy", { clearProps: "transform,opacity" }); });

      // layered parallax: far things lag, near things rush past. No pin.
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(".p-sun", { yPercent: 28, ease: "none" }, 0)
        .to(".p-far", { yPercent: 14, ease: "none" }, 0)
        .to(".p-band", { yPercent: 18, xPercent: -4, ease: "none" }, 0)
        .to(".p-castle", { yPercent: 6, ease: "none" }, 0)
        .to(".p-frontL", { yPercent: -22, xPercent: -8, ease: "none" }, 0)
        .to(".p-frontR", { yPercent: -26, xPercent: 8, ease: "none" }, 0)
        .to(".p-branchR", { yPercent: -18, xPercent: 6, ease: "none" }, 0)
        .to(".p-branchL", { yPercent: 16, xPercent: -8, ease: "none" }, 0)
        .to(".p-petals", { yPercent: -16, ease: "none" }, 0)
        .to(".p-birds", { yPercent: -60, ease: "none" }, 0)
        .to(".p-copy", { y: -90, opacity: 0, ease: "none", duration: 0.6 }, 0)
        .to(".p-chrome", { opacity: 0, ease: "none", duration: 0.3 }, 0);
    }, el);

    // watchdog: if a stalled first frame left the entrance mid-flight, finish
    // it. Only the entrance timeline, never the scrubbed one.
    const watchdog = window.setTimeout(() => {
      if (intro && intro.progress() < 1) intro.progress(1);
    }, 4500);

    return () => {
      window.clearTimeout(watchdog);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="arrival" data-tone="light" data-name="Arrival" className="hero relative overflow-hidden bg-paper text-ink">
      {/* shared filters */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="hero-ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="hero-sunrough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="3" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
          </filter>
          <linearGradient id="hero-sunfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e5594d" />
            <stop offset=".62" stopColor="#dc4f45" />
            <stop offset="1" stopColor="#c9433a" />
          </linearGradient>
          <radialGradient id="hero-sunlight" cx="38%" cy="30%" r="70%">
            <stop offset="0" stopColor="#ff8a6a" stopOpacity=".45" />
            <stop offset=".6" stopColor="#ff6a4d" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="hero__stage relative flex min-h-svh flex-col overflow-hidden lg:block lg:h-svh lg:min-h-[640px]">
        {/* paper wash: warmer toward the sun side */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_72%_32%,rgba(255,236,222,.9),transparent_70%),radial-gradient(60%_50%_at_10%_100%,rgba(232,214,196,.55),transparent_70%)]" aria-hidden="true" />

        {/* ---------- birds (sky critters) ---------- */}
        <div className="p-birds pointer-events-none absolute left-[56%] top-[7%] z-[3] w-[150px] max-lg:left-[50%] max-lg:top-[3.5%] max-lg:w-[104px]" aria-hidden="true">
          <div className="e-birds">
            <div className="f-birds">
              <svg viewBox="0 0 150 60" className="block h-auto w-full" fill="none" stroke="#17120e" strokeLinecap="round" strokeLinejoin="round">
                {[[14, 30, 1.1, 0], [44, 18, 0.9, 0.2], [70, 34, 1, 0.45], [100, 12, 0.75, 0.1], [128, 26, 0.65, 0.3]].map(([x, y, s, d], i) => (
                  <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                    <path className="bird-wing" style={{ animationDelay: `${-d}s` }} d="M-11 1Q-6 -6 -1 0.5L0 1.6L1 0.5Q6 -6 11 1" strokeWidth="1.9" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* ---------- copy (clear zone) ---------- */}
        <div className="p-copy relative z-[8] px-gut pb-2 pt-[clamp(96px,13svh,150px)] lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[50%] lg:flex-col lg:justify-center lg:pb-[6svh] lg:pt-[4svh] xl:pl-[104px]">
          <div className="hero-copy max-w-[620px]">
            <p className="e-copy mb-[clamp(10px,1.6svh,18px)] flex items-center gap-3 font-kanji text-[clamp(13px,1.35vw,19px)] tracking-[0.22em] text-ink/80">
              <span className="inline-block h-[2px] w-7 bg-red" aria-hidden="true" />
              <span lang="ja">無限城、開門</span>
              <span className="font-body text-[0.68em] font-semibold uppercase tracking-[0.3em] text-ink/55">The gates open</span>
            </p>
            <h1 className="hero-title font-display uppercase leading-[0.86] tracking-[-0.005em] text-[clamp(84px,min(11.6vw,20svh),200px)]" aria-label="Innerve 11.">
              <span className="block overflow-hidden pb-[0.02em]" aria-hidden="true">
                {T1.map((c, i) => <span key={i} className="hero-ch inline-block">{c}</span>)}
              </span>
              <span className="hero-eleven block overflow-hidden px-[0.06em] pb-[0.06em] ml-[-0.06em]" aria-hidden="true">
                {T2.map((c, i) => <span key={i} className="hero-ch inline-block">{c}</span>)}
              </span>
            </h1>
            <p className="e-copy mt-[clamp(12px,2svh,22px)] max-w-[40ch] text-[clamp(15px,1.3vw,18px)] leading-[1.5] text-ink/80">
              India&apos;s largest student-driven hackathon. Twenty-four hours inside the Infinity Castle.
            </p>
            <div className="e-copy mt-[clamp(18px,3svh,30px)] flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#castle" data-scroll className="hero-cta group relative inline-flex items-center gap-3 bg-ink px-7 py-[15px] font-display text-[clamp(16px,1.4vw,19px)] uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:bg-red">
                <span className="absolute inset-0 translate-x-[5px] translate-y-[5px] border border-ink/70 transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[3px]" aria-hidden="true" />
                Enter the castle
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
              <span className="text-[12px] font-semibold uppercase tracking-[0.24em] text-ink/60">
                30–31 Jan 2027 <span className="mx-1.5 text-red" aria-hidden="true">◆</span> AIT, Pune
              </span>
            </div>
          </div>
        </div>

        {/* ---------- scene (castle region) ---------- */}
        <div className="hero-art relative z-[2] min-h-[calc(80vw+28px)] flex-1 md:max-lg:min-h-[calc(60vw+28px)] lg:absolute lg:inset-y-0 lg:left-[44%] lg:right-0 lg:min-h-0" aria-hidden="true">
          {/* sun */}
          <div className="p-sun absolute inset-x-0 top-[9%] flex justify-center max-lg:top-[-2%] lg:pl-[8%]">
            <div className="e-sun aspect-square w-[min(66%,62svh)] max-lg:w-[min(72%,420px)]">
              <svg viewBox="0 0 400 400" className="f-sun block h-full w-full">
                <circle cx="200" cy="200" r="186" fill="url(#hero-sunfill)" filter="url(#hero-sunrough)" />
                <circle cx="200" cy="200" r="182" fill="url(#hero-sunlight)" />
                {/* dry-brush streaks */}
                <g stroke="#b53a31" strokeLinecap="round" opacity=".18" filter="url(#hero-ink)">
                  <path d="M92 150Q160 140 214 146" strokeWidth="5" />
                  <path d="M120 236Q196 226 300 232" strokeWidth="3.5" />
                  <path d="M160 302Q220 296 262 300" strokeWidth="4" />
                  <path d="M240 112Q280 108 318 116" strokeWidth="3" />
                </g>
              </svg>
            </div>
          </div>

          {/* sun-crossing cloud */}
          <div className="p-band absolute left-[30%] top-[38%] w-[46%] max-lg:left-[18%] max-lg:top-[34%] max-lg:w-[52%]">
            <div className="e-band">
              <CloudSvg c={CLOUDS.sunBand} className="f-drift-a block h-auto w-full art-blush" />
            </div>
          </div>

          {/* far pavilions, stairs and their cloud islands */}
          <div className="p-far absolute inset-x-[-4%] bottom-[22%] top-[2%] max-lg:inset-x-[-14%] max-lg:bottom-[24%]">
            <div className="e-far h-full w-full">
              <svg viewBox={FAR_VB} preserveAspectRatio="xMidYMax meet" className="art-far block h-full w-full">
                <g filter="url(#hero-ink)">
                  <g className="f-float-4"><Paths shapes={FAR.stairs} /></g>
                  <g className="f-float-3"><Paths shapes={FAR.pagoda} /><Paths shapes={ISLANDS.pagoda} /></g>
                  <g className="f-float-4b"><Paths shapes={FAR.hall} /><Paths shapes={ISLANDS.hall} /></g>
                  <g className="f-float-2"><Paths shapes={FAR.tiny} /><Paths shapes={ISLANDS.tiny} /></g>
                </g>
              </svg>
            </div>
          </div>

          {/* cloud bank behind the castle */}
          <div className="p-band absolute bottom-[14%] left-[-6%] right-[-10%] max-lg:bottom-[16%]">
            <div className="e-band">
              <CloudSvg c={CLOUDS.backBand} className="f-drift-b block h-auto w-full art-blush" />
            </div>
          </div>

          {/* the castle */}
          <div className="p-castle hero-castle absolute bottom-[4%] left-[-3%] right-[-3%] top-[9%] max-lg:left-[-25vw] max-lg:right-auto max-lg:top-auto max-lg:w-[150vw] md:max-lg:left-[-5vw] md:max-lg:w-[110vw]">
            <div className="e-castle h-full w-full max-lg:h-auto">
              <svg viewBox={CASTLE_VB} preserveAspectRatio="xMidYMax meet" className="f-castle block h-full w-full overflow-visible max-lg:h-auto">
                <g filter="url(#hero-ink)">
                  <Paths shapes={CASTLE} />
                </g>
              </svg>
            </div>
          </div>

          {/* low mist between castle and front clouds */}
          <div className="hero-mist pointer-events-none absolute bottom-[2%] left-[-10%] right-[-10%] h-[26%]" />
        </div>

        {/* ---------- foreground clouds (full bleed) ---------- */}
        <div className="p-frontL pointer-events-none absolute bottom-[-2%] left-[-4%] z-[4] w-[min(44vw,740px)] max-lg:bottom-[-2%] max-lg:left-[-18%] max-lg:w-[86vw]" aria-hidden="true">
          <div className="e-front">
            <CloudSvg c={CLOUDS.frontL} className="f-drift-c block h-auto w-full art-front" />
          </div>
        </div>
        <div className="p-frontR pointer-events-none absolute bottom-[-3%] right-[-5%] z-[4] w-[min(54vw,920px)] max-lg:bottom-[-3%] max-lg:right-[-22%] max-lg:w-[92vw]" aria-hidden="true">
          <div className="e-front">
            <CloudSvg c={CLOUDS.frontR} flip className="f-drift-d block h-auto w-full art-front" />
          </div>
        </div>

        {/* ---------- cherry branches ---------- */}
        <div className="p-branchR pointer-events-none absolute right-[-1.5%] top-[-2%] z-[6] w-[min(34vw,440px)] max-lg:right-[-8%] max-lg:top-[-1.5%] max-lg:w-[min(48vw,250px)]" aria-hidden="true">
          <svg viewBox="0 0 420 300" className="f-sway-r block h-auto w-full overflow-visible">
            <g fill="none" stroke="#2a211b" strokeLinecap="round" filter="url(#hero-ink)">
              <path className="hero-bough" d="M436 -8C398 26 366 52 334 90" strokeWidth="9" />
              <path className="hero-bough" d="M334 90C306 126 266 150 226 168" strokeWidth="6" />
              <path className="hero-bough" d="M226 168C192 182 152 188 112 198" strokeWidth="4" />
              <path className="hero-bough" d="M372 44C354 26 330 18 300 18" strokeWidth="3.6" />
              <path className="hero-bough" d="M300 18C284 18 270 24 262 32" strokeWidth="2" />
              <path className="hero-bough" d="M334 90C318 70 292 60 262 62C246 62 236 58 226 52" strokeWidth="3" />
              <path className="hero-bough" d="M286 130C276 112 254 102 228 100" strokeWidth="2.8" />
              <path className="hero-bough" d="M226 168C214 146 190 132 160 130" strokeWidth="2.6" />
              <path className="hero-bough" d="M150 190C132 202 112 218 94 238" strokeWidth="2.2" />
              <path className="hero-bough" d="M112 198C98 196 86 188 74 176" strokeWidth="1.8" />
            </g>
            <Flowers list={FLOWERS_R} />
          </svg>
        </div>
        <div className="p-branchL pointer-events-none absolute bottom-[-1%] left-[-1.5%] z-[6] w-[min(24vw,320px)] max-lg:hidden" aria-hidden="true">
          <svg viewBox="0 0 320 260" className="f-sway-l block h-auto w-full overflow-visible">
            <g fill="none" stroke="#2a211b" strokeLinecap="round" filter="url(#hero-ink)">
              <path className="hero-bough" d="M-12 272C24 236 56 210 96 188" strokeWidth="8" />
              <path className="hero-bough" d="M96 188C132 168 168 160 210 150" strokeWidth="5" />
              <path className="hero-bough" d="M96 188C90 162 100 138 118 116" strokeWidth="3" />
              <path className="hero-bough" d="M210 150C236 140 258 126 276 104" strokeWidth="2.8" />
              <path className="hero-bough" d="M150 166C168 184 194 192 222 194" strokeWidth="2.2" />
            </g>
            <Flowers list={FLOWERS_L} />
          </svg>
        </div>

        {/* ---------- falling petals ---------- */}
        <div className="p-petals pointer-events-none absolute inset-0 z-[7]" aria-hidden="true">
          <div className="e-petals absolute inset-0">
            {PETALS.map((p, i) => (
              <span
                key={i}
                className="hero-petal absolute block"
                style={{
                  left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size,
                  animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
                  ["--dx" as string]: `${p.dx}px`, ["--rot" as string]: `${p.rot}deg`,
                }}
              >
                <svg viewBox="-8 -15 16 16" className="hero-petal__art block h-full w-full" style={{ animationDuration: `${p.sway}s` }}>
                  <path d={PETAL} fill={TINTS[p.tint]} stroke="#c9645c" strokeWidth=".6" strokeOpacity=".5" />
                </svg>
              </span>
            ))}
          </div>
        </div>

        {/* ---------- chrome: corner ticks, kanji rails, scroll hint ---------- */}
        <div className="p-chrome pointer-events-none absolute inset-0 z-[9]" aria-hidden="true">
          <div className="e-chrome absolute inset-0">
            <div className="absolute left-gut right-gut top-[22px] flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.3em] text-ink/70">
              <span className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center bg-red font-display text-[11px] tracking-normal text-paper">11</span>Innerve</span>
              <span className="max-sm:hidden">OSS Club · AIT Pune</span>
            </div>
            <i className="absolute left-[14px] top-[58px] h-12 w-px bg-ink/25 max-sm:hidden" />
            <i className="absolute right-[14px] bottom-[18px] h-12 w-px bg-ink/25 max-sm:hidden" />
            <div className="absolute left-[22px] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
              <span className="h-2 w-2 rounded-full bg-red" />
              <span lang="ja" className="font-kanji text-[24px] leading-none tracking-[0.18em] [writing-mode:vertical-rl]">無限城</span>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.34em] text-ink/55 [writing-mode:vertical-rl]">Mugen-jō</span>
              <span className="h-12 w-px bg-ink/30" />
            </div>
            <div className="absolute right-[22px] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
              <span className="h-8 w-[3px] bg-red" />
              <span lang="ja" className="font-kanji text-[24px] leading-none tracking-[0.18em] [writing-mode:vertical-rl]">上弦</span>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.34em] text-ink/55 [writing-mode:vertical-rl]">Upper Moons</span>
              <span className="h-12 w-px bg-ink/30" />
            </div>
            <div className="absolute bottom-[18px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-ink/60">
              <span>Scroll</span>
              <span className="hero-hint block h-9 w-px bg-ink/50" />
            </div>
          </div>
        </div>

        {/* paper grain over everything */}
        <div className="hero-grain pointer-events-none absolute inset-0 z-[10]" aria-hidden="true" />
      </div>
    </section>
  );
}
