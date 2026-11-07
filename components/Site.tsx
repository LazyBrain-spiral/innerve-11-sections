"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INNERVE } from "@/lib/data";
import { initDriver } from "@/lib/driver";
import { CLOUDS, type Shape } from "@/lib/heroArt";
import RengokuHero from "@/components/RengokuHero";

/* Upper Moon captions, in flythrough order (mirrors lib/castle.ts) */
const MOONS: [string, string][] = [
  ["上弦の陸", "Upper Six · Daki"],
  ["上弦の伍", "Upper Five · Gyokko"],
  ["上弦の肆", "Upper Four · Hantengu"],
  ["上弦の参", "Upper Three · Akaza"],
  ["上弦の弐", "Upper Two · Doma"],
  ["上弦の壱", "Upper One · Kokushibo"],
  ["琵琶", "The Biwa · Nakime"],
];

const NIGHT_KANJI = ["壱", "弐", "参", "肆", "伍"];

interface Gate {
  k: string;
  n: string;
  day: string;
  yr: string;
  what: string;
  at: string;
  p: number;
}

/* hand-drawn cloud edge between paper and night; `down` hangs the puffs downward */
function CloudEdge({ down, className = "" }: { down?: boolean; className?: string }) {
  const c = CLOUDS.divider;
  const [x, y, w, h] = c.vb.split(" ").map(Number);
  return (
    <svg
      className={`art-scope art-paper pointer-events-none block h-auto w-[120%] max-w-none ${className}`}
      viewBox={c.vb}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g transform={down ? `translate(0 ${2 * y + h}) scale(1 -1)` : undefined}>
        <rect x={x} y={down ? y - 40 : y + h - 22} width={w} height={62} fill="#f2ebe3" />
        {c.shapes.map((s: Shape, i: number) => (
          <path key={i} d={s.d} className={s.c} />
        ))}
      </g>
    </svg>
  );
}

const Eyebrow = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <div className={`eyebrow mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] ${light ? "text-paper/80" : "text-ink/70"}`}>
    <span className="h-0.5 w-7 bg-red" aria-hidden="true" />
    {children}
  </div>
);

export default function Site() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const nightRef = useRef<HTMLDivElement>(null);
  const [moon, setMoon] = useState(-1);
  const [night, setNight] = useState<Gate | null>(null);
  const [gates, setGates] = useState<Gate[]>([]);
  const gatesRef = useRef<Gate[]>([]);

  /* castle HUD listeners — registered before the castle module starts so the
     import-time `castle-gates` event is not missed */
  useEffect(() => {
    const onMoon = (e: Event) => setMoon((e as CustomEvent<number>).detail);
    const onNight = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      setNight(i < 0 ? null : gatesRef.current[i] ?? null);
    };
    const onGates = (e: Event) => {
      const list = (e as CustomEvent<Gate[]>).detail;
      gatesRef.current = list;
      setGates(list);
    };
    window.addEventListener("castle-moon", onMoon);
    window.addEventListener("castle-night", onNight);
    window.addEventListener("castle-gates", onGates);
    return () => {
      window.removeEventListener("castle-moon", onMoon);
      window.removeEventListener("castle-night", onNight);
      window.removeEventListener("castle-gates", onGates);
    };
  }, []);

  /* moon caption slide-in/out */
  useEffect(() => {
    const el = capRef.current;
    if (!el) return;
    if (moon < 0) {
      gsap.to(el, { opacity: 0, x: 20, duration: 0.3 });
    } else {
      gsap.fromTo(el, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [moon]);

  /* Night gate card rise/settle */
  useEffect(() => {
    const el = nightRef.current;
    if (!el) return;
    if (!night) {
      gsap.to(el, { opacity: 0, y: 14, duration: 0.35, overwrite: true });
    } else {
      gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", overwrite: true });
    }
  }, [night]);

  /* scroll driver + 3D flythrough */
  useEffect(() => {
    const stopDriver = initDriver();
    let stopCastle: (() => void) | undefined;
    let cancelled = false;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      import("@/lib/castle").then((m) => {
        if (cancelled) return;
        stopCastle = m.startCastle(canvas);
      });
    }
    return () => {
      cancelled = true;
      stopCastle?.();
      stopDriver();
    };
  }, []);

  return (
    <>
      <div id="flash" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[58] bg-white opacity-0" />

      <main id="smooth">
        <span id="top" />
        {/* ===== HERO: Rengoku landing (the previous castle poster lives on in components/Hero.tsx, unused) ===== */}
        <RengokuHero />

        {/* ===== ABOUT + TRACKS ===== (pulled up 100svh: slides over the stuck Rengoku stage like a curtain) */}
        <section id="tracks" data-tone="light" data-name="Tracks" className="tracks paper-grain z-[5] -mt-[100svh] overflow-hidden rounded-t-[clamp(22px,3vw,44px)] pb-[clamp(110px,14vw,190px)] pt-[clamp(70px,9vw,130px)] shadow-[0_-24px_60px_rgba(0,0,0,.5)]">
          <div className="wrap mx-auto w-[min(1320px,100%)] px-gut">
            <div className="grid grid-cols-[1.05fr_1fr] items-end gap-x-16 gap-y-8 max-[960px]:grid-cols-1">
              <div>
                <Eyebrow>About Innerve</Eyebrow>
                {/* mixed-type reveal (lib/driver.ts): sans from the left, italic serif accent from the right */}
                <h2 className="mix-title font-display uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(46px,7.4vw,118px)]">
                  <span className="mix-a inline-block">Nine paths through the</span>{" "}
                  <em className="mix-b inline-block font-serif text-[1.08em] normal-case italic leading-[0.8] tracking-normal">castle.</em>
                </h2>
              </div>
              <div className="reveal max-w-[52ch] pb-2">
                <p className="text-[clamp(16px,1.3vw,18px)] leading-[1.6] text-ink/80">
                  Innerve is India&apos;s largest student-driven hackathon, organised by the OSS Club at the Army Institute of
                  Technology, Pune. For the eleventh edition, teams get twenty-four hours to build. Choose a path, find your
                  form, and survive the night.
                </p>
                <dl className="mt-7 grid grid-cols-3 border-y border-ink/20">
                  {[
                    ["24", "hours"],
                    [String(INNERVE.tracks.length), "tracks"],
                    [`₹${INNERVE.poolLacs}L+`, "prize pool"],
                  ].map(([v, k], i) => (
                    <div key={k} className={`py-4 ${i ? "border-l border-ink/20 pl-5" : ""}`}>
                      <dt className="sr-only">{k}</dt>
                      <dd className="font-display text-[clamp(30px,3vw,44px)] leading-none">{v}</dd>
                      <dd className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/55">{k}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <ol id="tgrid" className="tgrid mt-[clamp(40px,6vw,76px)] grid list-none grid-cols-3 gap-px border border-ink/20 bg-ink/20 max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
              {INNERVE.tracks.map((t, i) => (
                <li key={t.name} className="tcard group relative flex min-h-[220px] flex-col bg-paper p-[26px_26px_24px] transition-colors duration-500 hover:bg-[#efe3d6]">
                  <div className="flex items-start justify-between">
                    <span lang="ja" aria-hidden="true" className="seal h-[58px] w-[58px] text-[30px] transition-[background,color] duration-500 group-hover:bg-red group-hover:text-paper">{t.kanji}</span>
                    <span className="font-display text-sm tracking-[0.2em] text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-auto pt-8 font-display text-[clamp(28px,2.6vw,38px)] uppercase leading-none">{t.name}</h3>
                  <p className="mt-2.5 max-w-[34ch] text-[14.5px] leading-[1.5] text-ink/70">{t.desc}</p>
                  <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-red transition-[width] duration-500 group-hover:w-full" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== INFINITY CASTLE (3D) ===== */}
        <section id="castle" data-tone="dark" data-name="Infinity Castle" className="castle relative bg-[#0c0508] text-paper">
          <div className="castle__stage svh relative overflow-hidden">
            <canvas ref={canvasRef} id="castleGL" aria-label="A 3D flythrough of the Infinity Castle" className="absolute inset-0 block h-full w-full" />
            <div className="castle__vig pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_50%,transparent_40%,rgba(12,5,8,.85))]" />
            <div className="castle__copy absolute bottom-[14vh] left-gut z-[2] max-w-[680px]">
              <div className="castle__kicker mb-2 font-kanji text-[clamp(16px,2vw,24px)] tracking-[0.2em] text-glow">無限城 · Mugen-jō</div>
              <h2 className="castle__title font-display uppercase leading-[0.84] tracking-[-0.01em] text-[clamp(64px,11vw,190px)] [text-shadow:0_10px_50px_rgba(0,0,0,.6)]">
                <span className="mask block overflow-hidden"><span className="block">Infinity</span></span>
                <span className="mask block overflow-hidden"><span className="block">Castle.</span></span>
              </h2>
              <p className="castle__sub mt-[18px] max-w-[44ch] opacity-[.85]">Every room is a problem statement. Six Upper Moons stand between you and dawn.</p>
            </div>
            <div ref={capRef} id="castleCap" className="castle__cap absolute bottom-[14vh] right-gut z-[2] text-right opacity-0 max-[640px]:bottom-[8vh]">
              {moon >= 0 && (
                <>
                  <b className="block font-kanji text-[clamp(30px,4vw,56px)] text-red [text-shadow:0_0_30px_rgba(220,79,69,.6)]">{MOONS[moon][0]}</b>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">{MOONS[moon][1]}</span>
                </>
              )}
            </div>
            <div ref={nightRef} id="castleNight" aria-live="polite" className="castle__night pointer-events-none absolute bottom-[14vh] left-gut z-[2] max-w-[min(560px,62vw)] opacity-0 [text-shadow:0_4px_30px_rgba(0,0,0,.8)] max-[640px]:bottom-[22vh] max-[640px]:max-w-[58vw]">
              {night && (
                <>
                  <span className="castle__nk mb-2 block font-kanji text-[clamp(14px,1.6vw,20px)] tracking-[0.2em] text-amber">{night.k} · Night {night.n}</span>
                  <b className="block font-display uppercase leading-[0.9] text-[clamp(44px,7vw,108px)] text-paper max-[640px]:text-[clamp(38px,12vw,56px)]">
                    {night.day} <em className="ml-[0.15em] text-[0.42em] not-italic text-rose">{night.yr}</em>
                  </b>
                  <span className="castle__nw mt-2.5 block font-display text-[clamp(20px,2.4vw,34px)] uppercase tracking-[0.02em] text-glow max-[640px]:text-[18px]">{night.what}</span>
                  {night.at && <span className="castle__nt mt-1 block text-xs font-semibold uppercase tracking-[0.3em] opacity-[.85]">{night.at}</span>}
                </>
              )}
            </div>
            <div className="castle__end pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center text-center opacity-0">
              <div className="castle__kicker mb-2 font-kanji text-[clamp(16px,2vw,24px)] tracking-[0.2em] text-amber">The doors open on</div>
              <div className="castle__bounty font-display uppercase leading-[0.85] text-[clamp(70px,14vw,240px)] [text-shadow:0_0_80px_rgba(255,106,77,.7)]">The Bounty</div>
            </div>
            <div className="castle__bar absolute left-gut right-gut top-[84px] z-[2] h-0.5 bg-paper/15">
              <i id="castleBar" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-red to-glow" />
              <div id="castleTicks" className="castle__ticks pointer-events-none absolute inset-0">
                {gates.map((g) => (
                  <i key={g.n} style={{ left: `${(g.p * 100).toFixed(2)}%` }} className="absolute top-[-5px] h-3 w-0.5 -translate-x-[1px] bg-amber">
                    <b className="absolute left-1/2 top-[14px] -translate-x-1/2 font-kanji text-[13px] font-normal text-amber">{g.k}</b>
                  </i>
                ))}
              </div>
            </div>
            {/* the paper world's cloud edge hanging into the night */}
            <div className="pointer-events-none absolute inset-x-0 top-[-2px] z-[4] flex justify-center overflow-hidden">
              <CloudEdge down className="h-[clamp(56px,7vw,110px)]" />
            </div>
          </div>
        </section>

        {/* ===== PRIZES ===== */}
        <section id="prizes" data-tone="light" data-name="The Bounty" className="prizes paper-grain relative overflow-hidden pb-[clamp(80px,10vw,140px)]">
          <div className="pointer-events-none absolute inset-x-0 top-[-2px] z-[3] flex justify-center overflow-hidden bg-[#0c0508]">
            <CloudEdge className="h-[clamp(56px,7vw,110px)]" />
          </div>
          <div className="prizes__pin svh relative flex flex-col items-center justify-center px-gut text-center">
            <div className="prizes__sun pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(62vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_40%_32%,#e86a5c,#dc4f45_58%,#c6433a)] opacity-[.92] max-[640px]:w-[86vw]" aria-hidden="true" />
            <Eyebrow>Prize pool</Eyebrow>
            <div className="prizes__big relative flex items-start font-display leading-[0.8] tracking-[-0.02em] text-ink text-[clamp(110px,26vw,400px)] [text-shadow:0.03em_0.03em_0_#f2ebe3]">
              <span className="rs mr-[0.05em] mt-[0.25em] text-[0.32em] text-paper">₹</span>
              <span id="poolNum">0</span>
              <span className="lacs mb-[0.2em] ml-[0.1em] self-end text-[0.18em] text-paper">Lacs+</span>
            </div>
            <p className="prizes__note relative mt-6 max-w-[46ch] text-ink/80">Cash, goodies, certificates and a few surprises for those who survive the night.</p>
          </div>
          <div className="wrap mx-auto w-[min(1320px,100%)] px-gut">
            <div id="pcards" className="pcards grid grid-cols-6 gap-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
              {INNERVE.prizes.map((p, i) => (
                <article
                  key={p.rank}
                  className={`pcard group relative flex min-h-[300px] flex-col overflow-hidden border p-[28px_28px_26px_84px] transition-[transform,border-color] duration-[400ms] max-[960px]:col-span-1 max-[960px]:first:col-span-2 max-[640px]:min-h-[240px] max-[640px]:first:col-span-1 ${
                    i === 3 || i === 4 ? "col-span-3 max-[960px]:col-span-1" : "col-span-2"
                  } ${p.hot ? "pcard--hot border-red bg-red text-paper" : "border-ink/20 bg-card text-ink hover:border-red"}`}
                >
                  <span aria-hidden="true" className={`pcard__k absolute left-[18px] top-[22px] font-brush text-5xl leading-none [writing-mode:vertical-rl] ${p.hot ? "text-ink" : "text-red"}`}>{p.kanji}</span>
                  <div className="pcard__rank text-xs font-semibold uppercase tracking-[0.3em]">{p.rank}</div>
                  <div className="pcard__amt mb-auto mt-[14px] font-display leading-none text-[clamp(56px,6vw,96px)]"><small className="mr-1 align-top text-[0.45em]">₹</small>{p.amt}</div>
                  <ul className="mt-6 list-none text-[13px] opacity-[.85]">
                    {INNERVE.prizePerks.map((x) => (
                      <li key={x} className={`border-t py-2 ${p.hot ? "border-paper/30" : "border-ink/15"}`}><span className={`mr-1 align-[2px] text-[9px] ${p.hot ? "text-ink" : "text-red"}`}>◆</span>{x}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TIMELINE ===== */}
        <section id="timeline" data-tone="light" data-name="Timeline" className="timeline paper-grain border-t border-ink/10 pb-[clamp(80px,10vw,140px)] pt-[clamp(80px,10vw,140px)]">
          <div className="wrap mx-auto w-[min(1320px,100%)] px-gut">
            <Eyebrow>Timeline</Eyebrow>
            <h2 className="sec-title font-display uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(46px,8vw,130px)]">Five nights to <em>dawn.</em></h2>
            <ol id="tline" className="tline relative mt-[clamp(40px,6vw,80px)] grid list-none grid-cols-5 gap-6 max-[960px]:grid-cols-1 max-[960px]:gap-0">
              <span className="tline__rule absolute left-0 right-0 top-[29px] h-px origin-left bg-ink/35 max-[960px]:bottom-0 max-[960px]:left-[29px] max-[960px]:right-auto max-[960px]:top-0 max-[960px]:h-auto max-[960px]:w-px" aria-hidden="true" />
              {INNERVE.timeline.map((t, i) => (
                <li key={t.title} className="tnode relative max-[960px]:grid max-[960px]:grid-cols-[58px_1fr] max-[960px]:gap-x-5 max-[960px]:pb-9">
                  <span lang="ja" aria-hidden="true" className={`seal relative h-[58px] w-[58px] text-[26px] ${i === 3 ? "bg-red text-paper" : "bg-paper"}`}>{NIGHT_KANJI[i]}</span>
                  <div className="pt-5 max-[960px]:pt-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/55">Night {String(i + 1).padStart(2, "0")}</div>
                    <div className="mt-1.5 font-display text-[clamp(30px,2.6vw,40px)] uppercase leading-none">{t.date}</div>
                    <h3 className="mt-2 font-display text-[19px] uppercase tracking-[0.02em] text-red">{t.title}</h3>
                    <p className="mt-2 text-[14px] leading-[1.5] text-ink/70">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== VOICES ===== */}
        <section id="voices" data-tone="light" data-name="Survivors" className="voices paper paper-grain border-t border-ink/10 pb-[clamp(40px,6vw,80px)] pt-[clamp(80px,10vw,150px)]">
          <div className="wrap mx-auto w-[min(1320px,100%)] px-gut">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="sec-title font-display uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(48px,9vw,150px)]">Words from the <em>survivors.</em></h2>
            <div id="vgrid" className="vgrid mt-[clamp(32px,5vw,60px)] grid grid-cols-3 gap-5 max-[960px]:grid-cols-1">
              {INNERVE.testimonials.map((t) => (
                <figure key={t.name} className="vcard relative flex flex-col border border-ink/15 bg-card p-[34px_28px_28px]">
                  <span aria-hidden="true" className="h-[44px] font-display text-[110px] leading-[0.6] text-red">&ldquo;</span>
                  <blockquote className="flex-1 text-[15.5px]">{t.quote}</blockquote>
                  <figcaption className="vcard__who mt-[26px] flex items-center gap-3.5 border-t border-ink/15 pt-[18px]">
                    <span aria-hidden="true" className="hanko grid h-[46px] w-[46px] flex-none rotate-[-6deg] place-items-center rounded-md border-2 border-red font-display text-lg text-red">
                      {t.name.split(" ").map((w) => w[0]).join("")}
                    </span>
                    <span><b className="block text-[15px]">{t.name}</b><span className="text-xs opacity-[.65]">{t.org}</span></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ALLIES ===== */}
        <section id="allies" data-tone="light" data-name="Allies" className="allies paper paper-grain pb-[clamp(80px,10vw,150px)] pt-[clamp(60px,8vw,110px)]">
          <div className="wrap mx-auto w-[min(1320px,100%)] px-gut">
            <Eyebrow>Past sponsors</Eyebrow>
            <h2 className="sec-title font-display uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(48px,9vw,150px)]">Allies of the <em>corps.</em></h2>
            <div id="agrid" className="agrid mt-[clamp(32px,5vw,60px)] grid auto-rows-[150px] grid-cols-4 gap-3 max-[960px]:auto-rows-[120px] max-[960px]:grid-cols-2">
              {INNERVE.sponsors.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className={`atile group relative flex items-center justify-center overflow-hidden border border-ink/15 bg-card p-[34px_24px_20px] transition-[background,border-color] duration-[400ms] hover:border-red hover:bg-red ${
                    s.size === "xl" ? "atile--xl col-span-2 row-span-2" : s.size === "l" ? "atile--l col-span-2" : ""
                  }`}
                >
                  <span className="atile__tier absolute left-[14px] top-3 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-60 group-hover:text-paper group-hover:opacity-90">{s.tier}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`assets/logos/sponsors/${s.logo}`}
                    alt={s.name}
                    loading="lazy"
                    className={`max-w-[76%] object-contain transition-[transform,background,padding] duration-[400ms] group-hover:scale-[1.06] ${
                      s.size === "xl"
                        ? "max-h-[110px] bg-paper px-6 py-[18px]"
                        : "max-h-[54px] group-hover:bg-paper group-hover:px-4 group-hover:py-2.5"
                    }`}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="foot foot-ichimatsu relative grid grid-cols-[2fr_1fr_1fr] gap-10 bg-ink px-gut pb-7 pt-[70px] text-paper max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
          <div className="foot__brand max-[960px]:col-span-2 max-[640px]:col-span-1">
            <div className="foot__word font-display leading-[0.9] text-[clamp(48px,7vw,100px)]">INNERVE <b className="font-normal text-red">11</b></div>
            <p className="mt-3.5 max-w-[40ch] opacity-70">India&apos;s largest student-driven hackathon.<br />Organised by the OSS Club, Army Institute of Technology, Pune.</p>
          </div>
          <div className="foot__col">
            <h4 className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-red">Venue</h4>
            <p className="mb-2.5 opacity-80">Army Institute of Technology<br />Dighi Hills, Pune 411015</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Army+Institute+of+Technology+Pune" target="_blank" rel="noopener" className="block py-[3px] opacity-[.85] hover:text-red">Open in Maps ↗</a>
          </div>
          <div className="foot__col">
            <h4 className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-red">Navigate</h4>
            <a href="#tracks" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">Tracks</a>
            <a href="#prizes" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">Prizes</a>
            <a href="#timeline" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">Timeline</a>
            <a href="#voices" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">Testimonials</a>
            <a href="#allies" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">Sponsors</a>
          </div>
          <div className="foot__base col-span-full flex flex-wrap justify-between gap-5 border-t border-paper/10 pt-6 text-xs opacity-60">
            <span>© 2026 Innerve · OSS Club AIT</span>
            <span>A fan-made tribute theme. Not affiliated with Demon Slayer, Koyoharu Gotouge or Ufotable.</span>
            <a href="#top" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">Back to the top ↑</a>
          </div>
        </footer>
      </main>
    </>
  );
}
