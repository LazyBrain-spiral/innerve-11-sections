"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { INNERVE } from "@/lib/data";
import { initDriver } from "@/lib/driver";

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

interface Gate {
  k: string;
  n: string;
  day: string;
  yr: string;
  what: string;
  at: string;
  p: number;
}

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

  /* moon caption slide-in/out (was gsap on innerHTML swaps) */
  useEffect(() => {
    const el = capRef.current;
    if (!el) return;
    if (moon < 0) {
      gsap.to(el, { opacity: 0, x: 20, duration: 0.3 });
    } else {
      gsap.fromTo(el, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [moon]);

  /* Night gate card rise/settle (was gsap on innerHTML swaps) */
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
        {/* ===== ARRIVAL (ivory/vermilion poster hero: layered parallax, no pin) ===== */}
        <section id="arrival" data-tone="light" data-name="Arrival" className="arrival relative overflow-hidden bg-[#f2ebe3] text-ink">
          <div className="arrival__stage svh relative overflow-hidden">
            <div className="arrival__grain pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="arrival__sun absolute left-1/2 top-[12%] aspect-square w-[clamp(210px,30vw,390px)] -translate-x-1/2 rounded-full max-[640px]:top-[9%]" aria-hidden="true" />
            <svg className="arrival__birds absolute left-[55%] top-[19%] w-[110px] max-[640px]:left-[60%] max-[640px]:top-[15%] max-[640px]:w-[80px]" viewBox="0 0 120 40" fill="none" stroke="#17120e" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 12 Q8 4 14 12 Q20 4 26 12" />
              <path d="M46 26 Q51 19 56 26 Q61 19 66 26" />
              <path d="M84 8 Q90 1 96 8 Q102 1 108 8" />
            </svg>
            <svg className="arrival__castle absolute bottom-0 left-1/2 h-[60%] w-[min(760px,130vw)] -translate-x-1/2" viewBox="0 0 600 400" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <path d="M0 400 L0 356 Q140 312 300 320 Q460 312 600 358 L600 400 Z" fill="#17120e" opacity=".28" />
              <g fill="#17120e">
                <rect x="228" y="330" width="144" height="70" />
                <path d="M216 330 L300 306 L384 330 Z" />
                <rect x="196" y="356" width="48" height="44" />
                <path d="M186 356 L220 338 L254 356 Z" />
                <rect x="360" y="360" width="52" height="40" />
                <path d="M350 360 L386 343 L422 360 Z" />
                <rect x="250" y="278" width="100" height="56" />
                <path d="M240 278 L300 256 L360 278 Z" />
                <rect x="266" y="232" width="68" height="50" />
                <path d="M258 232 L300 214 L342 232 Z" />
                <rect x="279" y="192" width="42" height="44" />
                <path d="M272 192 L300 177 L328 192 Z" />
                <rect x="290" y="152" width="20" height="42" />
                <path d="M284 152 L300 140 L316 152 Z" />
                <rect x="297" y="122" width="6" height="24" />
              </g>
              <g fill="#f2ebe3">
                <rect x="262" y="292" width="7" height="12" opacity=".9" />
                <rect x="288" y="292" width="7" height="12" opacity=".6" />
                <rect x="318" y="292" width="7" height="12" opacity=".85" />
                <rect x="248" y="348" width="8" height="13" opacity=".7" />
                <rect x="294" y="348" width="8" height="13" opacity=".95" />
                <rect x="338" y="348" width="8" height="13" opacity=".6" />
                <rect x="285" y="244" width="6" height="11" opacity=".8" />
                <rect x="289" y="203" width="6" height="10" opacity=".9" />
                <rect x="296" y="160" width="5" height="9" opacity=".75" />
              </g>
            </svg>
            <div className="arrival__mist arrival__mist--l pointer-events-none absolute bottom-[8%] left-[-10%] h-[34%] w-[68%]" aria-hidden="true" />
            <div className="arrival__mist arrival__mist--r pointer-events-none absolute bottom-[5%] right-[-10%] h-[40%] w-[68%] max-[640px]:hidden" aria-hidden="true" />
            <svg className="arrival__branch arrival__branch--r pointer-events-none absolute right-[-2%] top-[-2%] h-[42%] w-[min(380px,44vw)]" viewBox="0 0 300 260" fill="none" aria-hidden="true">
              <path d="M300 0 Q262 40 238 78 Q214 116 176 142 Q150 158 118 164" stroke="#2a211b" strokeWidth="5" strokeLinecap="round" />
              <path d="M238 78 Q214 66 188 70" stroke="#2a211b" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M176 142 Q162 124 140 118" stroke="#2a211b" strokeWidth="3" strokeLinecap="round" />
              <g className="arrival__blossoms">
                <circle cx="118" cy="164" r="10" fill="#dc4f45" />
                <circle cx="138" cy="150" r="8" fill="#e89b93" />
                <circle cx="152" cy="162" r="9" fill="#dc4f45" opacity=".85" />
                <circle cx="188" cy="70" r="9" fill="#dc4f45" />
                <circle cx="206" cy="76" r="7" fill="#e89b93" />
                <circle cx="140" cy="118" r="8" fill="#e89b93" />
                <circle cx="238" cy="66" r="7" fill="#dc4f45" opacity=".8" />
                <circle cx="100" cy="150" r="6" fill="#e89b93" />
              </g>
            </svg>
            <svg className="arrival__branch arrival__branch--l pointer-events-none absolute bottom-[4%] left-[-3%] h-[30%] w-[min(300px,36vw)] max-[640px]:hidden" viewBox="0 0 260 200" fill="none" aria-hidden="true">
              <path d="M0 200 Q40 150 66 118 Q96 82 142 62" stroke="#2a211b" strokeWidth="4.5" strokeLinecap="round" />
              <g>
                <circle cx="142" cy="62" r="9" fill="#dc4f45" />
                <circle cx="124" cy="72" r="7" fill="#e89b93" />
                <circle cx="152" cy="78" r="7" fill="#dc4f45" opacity=".85" />
                <circle cx="104" cy="92" r="6" fill="#e89b93" />
              </g>
            </svg>
            <div className="arrival__rail absolute left-gut top-1/2 z-[2] hidden -translate-y-1/2 flex-col items-center gap-4 min-[960px]:flex">
              <span className="h-2 w-2 rounded-full bg-[#dc4f45]" />
              <span className="font-kanji text-[26px] tracking-[0.2em] [writing-mode:vertical-rl]">無限城</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.34em] opacity-60 [writing-mode:vertical-rl]">Mugen-jō</span>
              <span className="h-14 w-px bg-ink/35" />
              <span className="grid h-9 w-9 place-items-center bg-[#dc4f45] font-display text-sm text-[#f2ebe3]">11</span>
            </div>
            <div className="arrival__copy absolute inset-x-0 top-[26%] z-[2] flex flex-col items-center px-gut text-center max-[640px]:top-[25%]">
              <div className="arrival__kicker mb-3 font-kanji text-[clamp(14px,1.8vw,22px)] tracking-[0.28em] text-ink/80">開幕 · The curtain rises</div>
              <h1 className="arrival__title font-display uppercase leading-[0.84] tracking-[-0.01em] text-[clamp(72px,14vw,220px)]">
                <span className="mask block overflow-hidden"><span className="block">Innerve</span></span>
                <span className="mask block overflow-hidden"><span className="block text-[#dc4f45]">11.</span></span>
              </h1>
              <p className="arrival__sub mt-[18px] max-w-[46ch] text-[clamp(14px,1.6vw,18px)] text-ink/75">India&apos;s largest student-driven hackathon. Six Upper Moons stand between you and dawn.</p>
              <a href="#castle" data-scroll className="arrival__cta group mt-8 inline-flex items-center gap-3 border border-ink/55 bg-[#f2ebe3]/40 px-7 py-3.5 font-display text-[clamp(15px,1.8vw,20px)] uppercase tracking-[0.12em] text-ink backdrop-blur-[2px] transition-[background,border-color,color,transform] duration-300 hover:border-[#dc4f45] hover:bg-[#dc4f45] hover:text-[#f2ebe3]">
                Enter the castle
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
              </a>
            </div>
            <div className="arrival__hint pointer-events-none absolute bottom-[26px] left-1/2 z-[2] -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.34em] text-ink/55">
              Scroll to descend
            </div>
          </div>
        </section>

        {/* ===== INFINITY CASTLE ===== */}
        <section id="castle" data-tone="dark" data-name="Infinity Castle" className="castle relative bg-[#0c0508]">
          <div className="castle__stage svh relative overflow-hidden">
            <canvas ref={canvasRef} id="castleGL" aria-label="A 3D flythrough of the Infinity Castle" className="absolute inset-0 block h-full w-full" />
            <div className="castle__vig pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_50%,transparent_40%,rgba(12,5,8,.85))]" />
            <div className="castle__copy absolute bottom-[14vh] left-gut z-[2] max-w-[680px]">
              <div className="castle__kicker mb-2 font-kanji text-[clamp(16px,2vw,24px)] tracking-[0.2em] text-amber">無限城 · Mugen-jō</div>
              <h2 className="castle__title font-display uppercase leading-[0.84] tracking-[-0.01em] text-[clamp(64px,11vw,190px)] [text-shadow:0_10px_50px_rgba(0,0,0,.6)]">
                <span className="mask block overflow-hidden"><span className="block">Infinity</span></span>
                <span className="mask block overflow-hidden"><span className="block">Castle.</span></span>
              </h2>
              <p className="castle__sub mt-[18px] max-w-[44ch] opacity-[.85]">Every room is a problem statement. Six Upper Moons stand between you and dawn.</p>
            </div>
            <div ref={capRef} id="castleCap" className="castle__cap absolute bottom-[14vh] right-gut z-[2] text-right opacity-0 max-[640px]:bottom-[8vh]">
              {moon >= 0 && (
                <>
                  <b className="block font-kanji text-[clamp(30px,4vw,56px)] text-red [text-shadow:0_0_30px_rgba(200,16,46,.6)]">{MOONS[moon][0]}</b>
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
                  <span className="castle__nw mt-2.5 block font-display text-[clamp(20px,2.4vw,34px)] uppercase tracking-[0.02em] text-blood max-[640px]:text-[18px]">{night.what}</span>
                  {night.at && <span className="castle__nt mt-1 block text-xs font-semibold uppercase tracking-[0.3em] opacity-[.85]">{night.at}</span>}
                </>
              )}
            </div>
            <div className="castle__end pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center text-center opacity-0">
              <div className="castle__kicker mb-2 font-kanji text-[clamp(16px,2vw,24px)] tracking-[0.2em] text-amber">The doors open on</div>
              <div className="castle__bounty font-display uppercase leading-[0.85] text-[clamp(70px,14vw,240px)] [text-shadow:0_0_80px_rgba(255,26,60,.7)]">The Bounty</div>
            </div>
            <div className="castle__bar absolute left-gut right-gut top-[84px] z-[2] h-0.5 bg-paper/15">
              <i id="castleBar" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-red to-amber" />
              <div id="castleTicks" className="castle__ticks pointer-events-none absolute inset-0">
                {gates.map((g) => (
                  <i key={g.n} style={{ left: `${(g.p * 100).toFixed(2)}%` }} className="absolute top-[-5px] h-3 w-0.5 -translate-x-[1px] bg-amber">
                    <b className="absolute left-1/2 top-[14px] -translate-x-1/2 font-kanji text-[13px] font-normal text-amber">{g.k}</b>
                  </i>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRIZES ===== */}
        <section id="prizes" data-tone="dark" data-name="The Bounty" className="prizes relative overflow-hidden bg-ink pb-[clamp(80px,10vw,140px)]">
          <div className="prizes__pin svh flex flex-col items-center justify-center px-gut text-center">
            <div className="eyebrow mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] opacity-80">
              <span className="h-0.5 w-7 bg-red" aria-hidden="true" />Prize pool
            </div>
            <div className="prizes__big flex items-start font-display leading-[0.8] tracking-[-0.02em] text-[clamp(110px,30vw,460px)]">
              <span className="rs mr-[0.05em] mt-[0.25em] text-[0.32em] text-red">₹</span>
              <span id="poolNum">0</span>
              <span className="lacs mb-[0.2em] ml-[0.1em] self-end text-[0.18em] text-red">Lacs+</span>
            </div>
            <p className="prizes__note mt-6 max-w-[46ch] opacity-75">Cash, goodies, certificates and a few surprises for those who survive the night.</p>
          </div>
          <div className="wrap mx-auto w-[min(1320px,100%)] px-gut">
            <div id="pcards" className="pcards grid grid-cols-6 gap-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
              {INNERVE.prizes.map((p, i) => (
                <article
                  key={p.rank}
                  className={`pcard group relative flex min-h-[300px] flex-col overflow-hidden border p-[28px_28px_26px_84px] transition-[transform,border-color] duration-[400ms] after:absolute after:top-0 after:left-[-60%] after:h-full after:w-[40%] after:skew-x-[-20deg] after:bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.12),transparent)] after:transition-[left] after:duration-700 after:content-[''] hover:after:left-[130%] max-[960px]:col-span-1 max-[960px]:first:col-span-2 max-[640px]:min-h-[240px] max-[640px]:first:col-span-1 ${
                    i === 3 || i === 4 ? "col-span-3 max-[960px]:col-span-1" : "col-span-2"
                  } ${p.hot ? "pcard--hot border-red bg-red" : "border-paper/20 bg-ink2 hover:border-red"}`}
                >
                  <span aria-hidden="true" className={`pcard__k absolute left-[18px] top-[22px] font-brush text-5xl leading-none [writing-mode:vertical-rl] ${p.hot ? "text-ink" : "text-red"}`}>{p.kanji}</span>
                  <div className="pcard__rank text-xs font-semibold uppercase tracking-[0.3em]">{p.rank}</div>
                  <div className="pcard__amt mb-auto mt-[14px] font-display leading-none text-[clamp(56px,6vw,96px)]"><small className="mr-1 align-top text-[0.45em]">₹</small>{p.amt}</div>
                  <ul className="mt-6 list-none text-[13px] opacity-[.85]">
                    {INNERVE.prizePerks.map((x) => (
                      <li key={x} className="border-t border-paper/20 py-2"><span className={`mr-1 align-[2px] text-[9px] ${p.hot ? "text-ink" : "text-red"}`}>◆</span>{x}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VOICES ===== */}
        <section id="voices" data-tone="light" data-name="Survivors" className="voices paper paper-grain pb-[clamp(40px,6vw,80px)] pt-[clamp(80px,10vw,150px)]">
          <div className="wrap mx-auto w-[min(1320px,100%)] px-gut">
            <div className="eyebrow mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] opacity-80">
              <span className="h-0.5 w-7 bg-red" aria-hidden="true" />Testimonials
            </div>
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
            <div className="eyebrow mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] opacity-80">
              <span className="h-0.5 w-7 bg-red" aria-hidden="true" />Past sponsors
            </div>
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
        <footer className="foot foot-ichimatsu relative grid grid-cols-[2fr_1fr_1fr] gap-10 border-t border-paper/15 bg-ink px-gut pb-7 pt-[70px] max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
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
            <a href="#faq" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">FAQ</a>
          </div>
          <div className="foot__base col-span-full flex flex-wrap justify-between gap-5 border-t border-paper/10 pt-6 text-xs opacity-60">
            <span>© 2026 Innerve · OSS Club AIT</span>
            <span>A fan-made tribute theme. Not affiliated with Demon Slayer, Koyoharu Gotouge or Ufotable. · psst… type <b className="text-red">hinokami</b></span>
            <a href="#top" data-scroll className="block py-[3px] opacity-[.85] hover:text-red">Back to the night ↑</a>
          </div>
        </footer>
      </main>
    </>
  );
}
