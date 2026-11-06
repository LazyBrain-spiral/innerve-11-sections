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
            <div className="arrival__grain pointer-events-none absolute inset-0 z-[6]" aria-hidden="true" />
            <div className="arrival__halo absolute left-[56%] top-[-2%] aspect-square w-[clamp(320px,40vw,560px)] -translate-x-1/2 rounded-full bg-[#17120e]/[.055] max-[640px]:left-1/2 max-[640px]:top-[4%] max-[640px]:w-[300px]" aria-hidden="true" />
            <div className="arrival__ring pointer-events-none absolute left-1/2 top-[64%] aspect-square w-[86vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#17120e]/[.16] max-[640px]:top-[62%] max-[640px]:w-[118vmin]" aria-hidden="true" />
            <div className="arrival__sun absolute left-[46%] top-[5%] aspect-square w-[clamp(220px,28vw,350px)] -translate-x-1/2 max-[640px]:left-1/2 max-[640px]:top-[6%] max-[640px]:w-[210px]" aria-hidden="true">
              <svg className="arrival__sunArt block h-full w-full" viewBox="0 0 440 440" aria-hidden="true">
                <defs>
                  <filter id="sunRough" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="11" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="13" />
                  </filter>
                  <clipPath id="sunClip"><circle cx="220" cy="220" r="198" /></clipPath>
                  <radialGradient id="sunShade" cx="40%" cy="32%" r="75%">
                    <stop offset="0%" stopColor="#f2ebe3" stopOpacity=".16" />
                    <stop offset="55%" stopColor="#f2ebe3" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="220" cy="220" r="198" fill="#dc4f45" filter="url(#sunRough)" />
                <g clipPath="url(#sunClip)">
                  <circle cx="220" cy="220" r="198" fill="url(#sunShade)" />
                  <g stroke="#f2ebe3" strokeWidth="2.5" opacity=".13" strokeLinecap="round">
                    <line x1="148" y1="58" x2="148" y2="150" />
                    <line x1="196" y1="30" x2="196" y2="88" />
                    <line x1="238" y1="70" x2="238" y2="190" />
                    <line x1="286" y1="42" x2="286" y2="120" />
                    <line x1="322" y1="120" x2="322" y2="230" />
                    <line x1="120" y1="180" x2="120" y2="260" />
                    <line x1="180" y1="240" x2="180" y2="330" />
                  </g>
                  <g stroke="#a83a2c" strokeWidth="4" opacity=".16" strokeLinecap="round">
                    <line x1="168" y1="90" x2="168" y2="210" />
                    <line x1="262" y1="150" x2="262" y2="280" />
                    <line x1="214" y1="260" x2="214" y2="360" />
                    <line x1="300" y1="220" x2="300" y2="320" />
                  </g>
                </g>
              </svg>
            </div>
            <div className="arrival__birds absolute left-[57%] top-[17%] w-[130px] max-[640px]:left-[58%] max-[640px]:top-[13%] max-[640px]:w-[86px]" aria-hidden="true">
              <svg className="arrival__birdsArt block h-auto w-full" viewBox="0 0 130 44" fill="none" stroke="#17120e" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M2 12 Q8 4 14 12 Q20 4 26 12" />
                <path d="M46 28 Q51 21 56 28 Q61 21 66 28" />
                <path d="M84 8 Q90 1 96 8 Q102 1 108 8" />
                <path d="M112 30 Q115 26 118 30 Q121 26 124 30" strokeWidth="1.6" />
              </svg>
            </div>
            <svg className="arrival__castle absolute bottom-0 left-[55%] h-[44%] w-[min(1000px,155vw)] -translate-x-1/2 max-[640px]:left-1/2 max-[640px]:h-[30%] max-[640px]:w-[200vw]" viewBox="0 0 900 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <path d="M0 520 L0 480 Q150 444 300 454 Q430 462 520 446 Q700 426 900 474 L900 520 Z" fill="#17120e" opacity=".22" />
              <path d="M0 520 L0 502 Q220 478 420 488 Q620 496 900 496 L900 520 Z" fill="#17120e" opacity=".45" />
              <g fill="#17120e">
                {/* central keep */}
                <rect x="444" y="58" width="12" height="42" />
                <path d="M450 44 L457 60 L443 60 Z" />
                <path d="M398 110 Q450 78 502 110 L488 124 L412 124 Z" />
                <rect x="416" y="124" width="68" height="46" />
                <path d="M368 178 Q450 144 532 178 L513 193 L387 193 Z" />
                <rect x="393" y="193" width="114" height="54" />
                <path d="M334 256 Q450 216 566 256 L543 273 L357 273 Z" />
                <rect x="363" y="273" width="174" height="62" />
                <path d="M296 346 Q450 302 604 346 L576 365 L324 365 Z" />
                <rect x="330" y="365" width="240" height="72" />
                <rect x="300" y="437" width="300" height="46" />
                <rect x="268" y="483" width="364" height="37" />
                {/* left tower */}
                <rect x="258" y="252" width="10" height="26" />
                <path d="M238 252 Q263 236 288 252 L279 262 L247 262 Z" />
                <path d="M204 302 Q263 274 322 302 L306 317 L220 317 Z" />
                <rect x="230" y="317" width="66" height="120" />
                <rect x="294" y="372" width="40" height="14" />
                {/* right tower */}
                <rect x="642" y="288" width="9" height="24" />
                <path d="M624 288 Q646.5 274 669 288 L661 297 L632 297 Z" />
                <path d="M588 332 Q647 304 706 332 L690 347 L604 347 Z" />
                <rect x="614" y="347" width="66" height="90" />
                <rect x="570" y="380" width="44" height="13" />
                {/* far pavilions */}
                <path d="M128 404 Q175 382 222 404 L208 417 L142 417 Z" />
                <rect x="150" y="417" width="50" height="66" />
                <path d="M722 414 Q766 394 810 414 L797 426 L735 426 Z" />
                <rect x="742" y="426" width="48" height="57" />
                {/* vermilion roof-ridge accents */}
                <g fill="none" stroke="#dc4f45" strokeWidth="2.2" opacity=".85" strokeLinecap="round">
                  <path d="M404 108 Q450 82 496 108" />
                  <path d="M374 176 Q450 149 526 176" />
                  <path d="M341 254 Q450 219 559 254" />
                  <path d="M304 343 Q450 305 596 343" />
                  <path d="M210 300 Q263 277 316 300" />
                  <path d="M594 330 Q647 307 700 330" />
                </g>
                {/* hanging lanterns */}
                <g fill="#ff6a4d" className="arrival__wglow">
                  <rect x="408" y="118" width="5" height="8" rx="2" />
                  <rect x="488" y="118" width="5" height="8" rx="2" />
                  <rect x="380" y="186" width="5" height="8" rx="2" />
                  <rect x="516" y="186" width="5" height="8" rx="2" />
                  <rect x="348" y="265" width="5" height="9" rx="2" />
                  <rect x="548" y="265" width="5" height="9" rx="2" />
                </g>
              </g>
              {/* lit windows — ivory */}
              <g fill="#f2ebe3">
                <rect x="436" y="136" width="7" height="13" opacity=".85" />
                <rect x="458" y="136" width="7" height="13" opacity=".55" />
                <rect x="414" y="206" width="7" height="13" opacity=".7" />
                <rect x="446" y="206" width="7" height="13" opacity=".9" />
                <rect x="482" y="206" width="7" height="13" opacity=".5" />
                <rect x="386" y="288" width="8" height="14" opacity=".8" />
                <rect x="418" y="288" width="8" height="14" opacity=".55" />
                <rect x="474" y="288" width="8" height="14" opacity=".85" />
                <rect x="506" y="288" width="8" height="14" opacity=".6" />
                <rect x="352" y="382" width="8" height="14" opacity=".75" />
                <rect x="392" y="382" width="8" height="14" opacity=".5" />
                <rect x="500" y="382" width="8" height="14" opacity=".8" />
                <rect x="540" y="382" width="8" height="14" opacity=".55" />
                <rect x="252" y="334" width="7" height="13" opacity=".7" />
                <rect x="636" y="362" width="7" height="12" opacity=".65" />
                <rect x="166" y="434" width="7" height="12" opacity=".6" />
                <rect x="758" y="440" width="7" height="11" opacity=".55" />
              </g>
              {/* lit windows — vermilion glow */}
              <g fill="#ff6a4d" className="arrival__wglow">
                <rect x="446" y="136" width="7" height="13" />
                <rect x="446" y="288" width="8" height="14" />
                <rect x="432" y="382" width="8" height="14" />
                <rect x="446" y="452" width="9" height="15" />
                <rect x="268" y="334" width="7" height="13" />
                <rect x="652" y="362" width="7" height="12" />
              </g>
            </svg>
            <div className="arrival__mist arrival__mist--c pointer-events-none absolute bottom-[10%] left-[6%] h-[28%] w-[88%]" aria-hidden="true"><div className="arrival__mistArt arrival__mistArt--c h-full w-full" /></div>
            <div className="arrival__mist arrival__mist--l pointer-events-none absolute bottom-[3%] left-[-12%] h-[42%] w-[72%]" aria-hidden="true"><div className="arrival__mistArt arrival__mistArt--l h-full w-full" /></div>
            <div className="arrival__mist arrival__mist--r pointer-events-none absolute bottom-[1%] right-[-12%] h-[48%] w-[72%] max-[640px]:hidden" aria-hidden="true"><div className="arrival__mistArt arrival__mistArt--r h-full w-full" /></div>

            <svg className="arrival__cloud arrival__cloud--a pointer-events-none absolute bottom-[24%] left-[-6%] h-[13%] w-[72%] max-[640px]:hidden" viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 88 Q40 52 84 76 Q110 40 158 62 Q190 30 238 58 Q268 36 312 58 Q344 30 392 56 Q424 38 466 60 Q500 34 546 60 Q580 42 622 64 Q656 44 700 68 Q744 50 800 78 L800 120 L0 120 Z" fill="#ffffff" opacity=".92" />
              <path d="M0 92 Q40 58 84 80 Q110 46 158 68 Q190 36 238 64 Q268 42 312 64 Q344 36 392 62 Q424 44 466 66 Q500 40 546 66 Q580 48 622 70 Q656 50 700 74 Q744 56 800 84" fill="none" stroke="#e7ded2" strokeWidth="3" opacity=".8" />
            </svg>
            <svg className="arrival__cloud arrival__cloud--b pointer-events-none absolute bottom-[38%] right-[-8%] h-[10%] w-[56%] max-[640px]:hidden" viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 86 Q46 54 92 76 Q124 44 172 64 Q206 38 252 60 Q288 40 332 62 Q368 36 414 60 Q450 42 494 64 Q532 44 578 66 Q616 48 660 68 Q700 52 744 72 Q776 58 800 72 L800 120 L0 120 Z" fill="#ffffff" opacity=".7" />
            </svg>
            <div className="arrival__petals pointer-events-none absolute inset-0 z-[3]" aria-hidden="true">
              <svg className="arrival__petal absolute left-[24%] top-[6%] h-[11px] w-[11px]" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#e59a93" /></svg>
              <svg className="arrival__petal absolute left-[68%] top-[3%] h-[9px] w-[9px]" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#d97a6f" /></svg>
              <svg className="arrival__petal absolute left-[82%] top-[22%] h-[12px] w-[12px] max-[640px]:hidden" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#e59a93" /></svg>
              <svg className="arrival__petal absolute left-[12%] top-[30%] h-[8px] w-[8px]" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#d97a6f" /></svg>
              <svg className="arrival__petal absolute left-[44%] top-[2%] h-[10px] w-[10px] max-[640px]:hidden" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#e59a93" /></svg>
              <svg className="arrival__petal absolute left-[58%] top-[26%] h-[8px] w-[8px]" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#d97a6f" /></svg>
              <svg className="arrival__petal absolute left-[33%] top-[44%] h-[9px] w-[9px] max-[640px]:hidden" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#e59a93" /></svg>
              <svg className="arrival__petal absolute left-[90%] top-[52%] h-[10px] w-[10px] max-[640px]:hidden" viewBox="0 0 10 10"><path d="M5 0 C8 2 8 8 5 10 C2 8 2 2 5 0Z" fill="#d97a6f" /></svg>
            </div>
            <div className="arrival__branch arrival__branch--r pointer-events-none absolute right-[-2%] top-[-2%] h-[44%] w-[min(400px,46vw)] max-[640px]:right-[-6%] max-[640px]:top-[-3%] max-[640px]:w-[220px]" aria-hidden="true">
              <svg className="arrival__branchArt block h-full w-full" viewBox="0 0 340 300" fill="none" aria-hidden="true">
                <defs>
                  <g id="bl">
                    <g fill="#e59a93">
                      <circle cx="0" cy="-4.6" r="3.6" /><circle cx="4.4" cy="-1.4" r="3.6" /><circle cx="2.7" cy="3.8" r="3.6" /><circle cx="-2.7" cy="3.8" r="3.6" /><circle cx="-4.4" cy="-1.4" r="3.6" />
                    </g>
                    <circle r="1.7" fill="#a83a2c" />
                  </g>
                  <g id="bl2">
                    <g fill="#d97a6f">
                      <circle cx="0" cy="-4.2" r="3.3" /><circle cx="4" cy="-1.3" r="3.3" /><circle cx="2.5" cy="3.5" r="3.3" /><circle cx="-2.5" cy="3.5" r="3.3" /><circle cx="-4" cy="-1.3" r="3.3" />
                    </g>
                    <circle r="1.6" fill="#7e2a20" />
                  </g>
                </defs>
                <path className="bough" d="M342 8 Q300 44 272 84 Q244 124 200 148 Q168 164 128 168" stroke="#2a211b" strokeWidth="5.5" strokeLinecap="round" />
                <path className="bough" d="M272 84 Q250 68 222 70" stroke="#2a211b" strokeWidth="3.5" strokeLinecap="round" />
                <path className="bough" d="M310 40 Q292 24 268 22" stroke="#2a211b" strokeWidth="3" strokeLinecap="round" />
                <path className="bough" d="M200 148 Q184 128 158 122" stroke="#2a211b" strokeWidth="3" strokeLinecap="round" />
                <path className="bough" d="M236 128 Q222 112 198 108" stroke="#2a211b" strokeWidth="2.5" strokeLinecap="round" />
                <use href="#bl" className="arrival__blossom" transform="translate(268 20) scale(1.1)" />
                <use href="#bl2" className="arrival__blossom" transform="translate(224 68) scale(1.0) rotate(20)" />
                <use href="#bl" className="arrival__blossom" transform="translate(198 106) scale(.9) rotate(-15)" />
                <use href="#bl2" className="arrival__blossom" transform="translate(158 120) scale(1.05) rotate(30)" />
                <use href="#bl" className="arrival__blossom" transform="translate(128 168) scale(1.25) rotate(-10)" />
                <use href="#bl2" className="arrival__blossom" transform="translate(298 52) scale(.8) rotate(45)" />
                <use href="#bl" className="arrival__blossom" transform="translate(246 134) scale(.85) rotate(10)" />
                <use href="#bl2" className="arrival__blossom" transform="translate(176 160) scale(.95) rotate(-30)" />
                <circle cx="320" cy="30" r="2.6" fill="#d97a6f" className="arrival__blossom" />
                <circle cx="212" cy="140" r="2.4" fill="#e59a93" className="arrival__blossom" />
                <path className="bough" d="M128 168 Q110 178 92 176" stroke="#2a211b" strokeWidth="2.5" strokeLinecap="round" />
                <use href="#bl2" className="arrival__blossom" transform="translate(92 176) scale(1.0) rotate(15)" />
                <use href="#bl" className="arrival__blossom" transform="translate(286 100) scale(.75) rotate(-40)" />
                <use href="#bl2" className="arrival__blossom" transform="translate(328 14) scale(.9) rotate(60)" />
                <circle cx="252" cy="90" r="2.2" fill="#e59a93" className="arrival__blossom" />
                <circle cx="150" cy="150" r="2.4" fill="#d97a6f" className="arrival__blossom" />
              </svg>
            </div>
            <div className="arrival__branch arrival__branch--l pointer-events-none absolute bottom-[3%] left-[-3%] h-[32%] w-[min(320px,38vw)] max-[640px]:hidden" aria-hidden="true">
              <svg className="arrival__branchArt block h-full w-full" viewBox="0 0 280 220" fill="none" aria-hidden="true">
                <path className="bough" d="M4 216 Q44 164 74 130 Q108 92 158 74" stroke="#2a211b" strokeWidth="4.5" strokeLinecap="round" />
                <path className="bough" d="M108 92 Q98 70 76 62" stroke="#2a211b" strokeWidth="3" strokeLinecap="round" />
                <use href="#bl" className="arrival__blossom" transform="translate(158 72) scale(1.05)" />
                <use href="#bl2" className="arrival__blossom" transform="translate(76 60) scale(.9) rotate(25)" />
                <use href="#bl" className="arrival__blossom" transform="translate(128 84) scale(.8) rotate(-20)" />
                <use href="#bl2" className="arrival__blossom" transform="translate(52 158) scale(.75) rotate(15)" />
              </svg>
            </div>
            <div className="arrival__frame pointer-events-none absolute inset-0 z-[4]" aria-hidden="true">
              <i className="absolute left-[3.2%] top-[4.5%] h-[74px] w-px bg-[#17120e]/30" />
              <i className="absolute left-[3.2%] top-[4.5%] h-px w-[74px] bg-[#17120e]/30" />
              <i className="absolute bottom-[5%] right-[3.2%] h-[74px] w-px bg-[#17120e]/30" />
              <i className="absolute bottom-[5%] right-[3.2%] h-px w-[74px] bg-[#17120e]/30" />
              <i className="absolute right-[3.2%] top-[4.5%] h-2 w-2 rounded-full bg-[#dc4f45]" />
            </div>
            <div className="arrival__rail absolute left-gut top-1/2 z-[5] hidden -translate-y-1/2 flex-col items-center gap-4 min-[960px]:flex">
              <span className="h-2 w-2 rounded-full bg-[#dc4f45]" />
              <span className="font-kanji text-[26px] tracking-[0.2em] [writing-mode:vertical-rl]">無限城</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.34em] opacity-60 [writing-mode:vertical-rl]">Mugen-jō</span>
              <span className="h-14 w-px bg-ink/35" />
              <span className="grid h-9 w-9 place-items-center bg-[#dc4f45] font-display text-sm text-[#f2ebe3]">11</span>
            </div>
            <div className="arrival__rail absolute right-gut top-1/2 z-[5] hidden -translate-y-1/2 flex-col items-center gap-4 min-[960px]:flex">
              <span className="h-9 w-[3px] bg-[#dc4f45]" />
              <span className="font-kanji text-[26px] tracking-[0.2em] [writing-mode:vertical-rl]">上弦</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.34em] opacity-60 [writing-mode:vertical-rl]">Upper Moons</span>
              <span className="h-14 w-px bg-ink/35" />
            </div>
            <div className="arrival__copy absolute inset-x-0 top-[19%] z-[5] flex flex-col items-center px-gut text-center max-[640px]:top-[21%]">
              <div className="arrival__kicker mb-3 flex items-center gap-4 font-kanji text-[clamp(14px,1.8vw,22px)] tracking-[0.28em] text-ink/80">
                <span className="h-px w-10 bg-ink/40" aria-hidden="true" />開幕 · The curtain rises<span className="h-px w-10 bg-ink/40" aria-hidden="true" />
              </div>
              <h1 className="arrival__title font-display uppercase leading-[0.84] tracking-[-0.01em] text-[clamp(64px,11vw,160px)]">
                <span className="mask block overflow-hidden"><span className="block">Innerve</span></span>
                <span className="mask block overflow-hidden"><span className="block text-[#dc4f45] [-webkit-text-stroke:5px_#f2ebe3] [paint-order:stroke_fill]">11.</span></span>
              </h1>
              <p className="arrival__sub mt-[16px] max-w-[46ch] text-[clamp(14px,1.6vw,18px)] text-ink/75">India&apos;s largest student-driven hackathon. Six Upper Moons stand between you and dawn.</p>
              <a href="#castle" data-scroll className="arrival__cta group mt-7 inline-flex items-center gap-3 border border-ink/55 bg-[#f2ebe3]/40 px-7 py-3.5 font-display text-[clamp(15px,1.8vw,20px)] uppercase tracking-[0.12em] text-ink backdrop-blur-[2px] transition-[background,border-color,color,transform] duration-300 hover:border-[#dc4f45] hover:bg-[#dc4f45] hover:text-[#f2ebe3]">
                Enter the castle
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
              </a>
            </div>
            <div className="arrival__hint pointer-events-none absolute bottom-[26px] left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f2ebe3]/75">
              <span>Scroll to descend</span>
              <span className="arrival__hintLine block h-8 w-px bg-[#f2ebe3]/50" aria-hidden="true" />
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
