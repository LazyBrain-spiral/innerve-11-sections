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
            <div className="arrival__sun absolute left-1/2 top-[7%] aspect-square w-[clamp(260px,32vw,420px)] -translate-x-1/2 max-[640px]:top-[6%] max-[640px]:w-[230px]" aria-hidden="true">
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
                        <div className="arrival__mist arrival__mist--c pointer-events-none absolute bottom-[10%] left-[6%] h-[28%] w-[88%]" aria-hidden="true"><div className="arrival__mistArt arrival__mistArt--c h-full w-full" /></div>
            <div className="arrival__mist arrival__mist--l pointer-events-none absolute bottom-[3%] left-[-12%] h-[42%] w-[72%]" aria-hidden="true"><div className="arrival__mistArt arrival__mistArt--l h-full w-full" /></div>
            <div className="arrival__mist arrival__mist--r pointer-events-none absolute bottom-[1%] right-[-12%] h-[48%] w-[72%] max-[640px]:hidden" aria-hidden="true"><div className="arrival__mistArt arrival__mistArt--r h-full w-full" /></div>

                                                <div className="arrival__cloudWrap arrival__cloudWrap--a pointer-events-none absolute bottom-[15%] left-[-6%] w-[46%] max-[640px]:hidden" aria-hidden="true">
              <svg className="block h-auto w-full" viewBox="0 0 640 160" aria-hidden="true">
                <defs><filter id="cloudSoft" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="1.1" /></filter></defs>
                <path d="M28 150 L596 150 Q618 150 620 130 Q622 108 598 102 Q576 96 568 110 Q562 122 574 124 Q584 126 590 116 Q596 104 584 94 Q566 78 536 92 Q524 58 472 60 Q432 62 426 88 Q402 44 342 52 Q294 58 290 88 Q264 56 216 68 Q174 78 170 102 Q132 82 98 100 Q62 110 46 128 Q26 138 28 150 Z" fill="#f7f2e8" filter="url(#cloudSoft)" opacity=".96" />
                <path d="M44 128 C26 128 22 106 40 102 C54 99 58 116 46 118 C38 119 36 110 42 109" fill="none" stroke="#d9cfbf" strokeWidth="2.2" strokeLinecap="round" opacity=".7" /><path d="M92 116 Q168 76 252 92 Q336 106 420 76 Q488 54 552 92" fill="none" stroke="#ddd2c0" strokeWidth="2.5" strokeLinecap="round" opacity=".55" />
                <path d="M150 128 Q220 102 290 112 Q360 122 430 100" fill="none" stroke="#ddd2c0" strokeWidth="2" strokeLinecap="round" opacity=".4" />
              </svg>
            </div>
            <div className="arrival__castle absolute bottom-[1%] left-1/2 w-[min(980px,72vw)] -translate-x-1/2 max-[640px]:bottom-[5%] max-[640px]:w-[235vw]">
              <svg className="arrival__castleArt block h-auto w-full overflow-visible" viewBox="130 60 1140 340" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
                <defs>
                  <filter id="inkRough" x="-6%" y="-6%" width="112%" height="112%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.032" numOctaves="3" seed="7" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
                  </filter>
                </defs>
                <ellipse cx="700" cy="394" rx="640" ry="9" fill="#17120e" opacity=".15" />
                <g filter="url(#inkRough)">
                  <g fill="#17120e">
                    <path d="M78 400 L84 336 L186 336 L192 400 Z" />
                    <path d="M46 340 Q90 314 134 310 Q176 314 216 340 Q172 330 132 329 Q92 330 46 340 Z" />
                    <path d="M46 340 Q38 333 32 322 Q44 327 52 329 Z" />
                    <path d="M216 340 Q224 333 230 322 Q218 327 210 329 Z" />
                    <path d="M258 400 L266 322 L356 322 L364 400 Z" />
                    <path d="M226 328 Q272 302 312 298 Q352 302 396 328 Q350 317 311 316 Q270 317 226 328 Z" />
                    <path d="M226 328 Q218 321 212 310 Q224 315 232 317 Z" />
                    <path d="M396 328 Q404 321 410 310 Q398 315 390 317 Z" />
                    <path d="M276 322 L282 262 L340 262 L346 322 Z" />
                    <path d="M246 268 Q284 246 312 243 Q342 246 376 268 Q340 259 311 258 Q282 259 246 268 Z" />
                    <path d="M246 268 Q239 262 234 252 Q244 256 251 258 Z" />
                    <path d="M376 268 Q383 262 388 252 Q378 256 371 258 Z" />
                    <rect x="308" y="222" width="5" height="24" />
                    <circle cx="310" cy="218" r="4" />
                    <path d="M380 400 L384 356 L556 356 L560 400 Z" />
                    <path d="M364 360 Q430 340 470 338 Q512 340 572 360 Q512 351 470 350 Q428 351 364 360 Z" />
                    <path d="M596 400 L606 348 L794 348 L804 400 Z" />
                    <path d="M552 354 Q620 326 700 322 Q780 326 848 354 Q774 343 700 342 Q626 343 552 354 Z" />
                    <path d="M552 354 Q542 346 534 333 Q548 339 558 341 Z" />
                    <path d="M848 354 Q858 346 866 333 Q852 339 842 341 Z" />
                    <path d="M626 348 L634 280 L766 280 L774 348 Z" />
                    <path d="M588 286 Q644 260 700 256 Q756 260 812 286 Q754 275 700 274 Q646 275 588 286 Z" />
                    <path d="M588 286 Q580 279 573 268 Q585 273 593 275 Z" />
                    <path d="M812 286 Q820 279 827 268 Q815 273 807 275 Z" />
                    <path d="M650 280 L656 218 L744 218 L750 280 Z" />
                    <path d="M616 224 Q658 202 700 199 Q742 202 784 224 Q740 214 700 213 Q660 214 616 224 Z" />
                    <path d="M616 224 Q609 218 603 208 Q613 212 620 214 Z" />
                    <path d="M784 224 Q791 218 797 208 Q787 212 780 214 Z" />
                    <path d="M670 218 L675 164 L725 164 L730 218 Z" />
                    <path d="M642 170 Q672 152 700 150 Q728 152 758 170 Q726 162 700 161 Q674 162 642 170 Z" />
                    <path d="M642 170 Q636 165 631 156 Q640 160 646 161 Z" />
                    <path d="M758 170 Q764 165 769 156 Q760 160 754 161 Z" />
                    <rect x="697" y="100" width="6" height="52" />
                    <circle cx="700" cy="94" r="6.5" />
                    <path d="M687 126 Q700 120 713 126 Q700 131 687 126 Z" />
                    <path d="M689 138 Q700 133 711 138 Q700 143 689 138 Z" />
                    <path d="M812 400 L816 368 L1006 368 L1010 400 Z" />
                    <path d="M798 372 Q870 352 910 351 Q952 352 1024 372 Q952 362 910 362 Q868 362 798 372 Z" />
                    <path d="M1036 400 L1044 334 L1198 334 L1206 400 Z" />
                    <path d="M1002 340 Q1062 312 1121 309 Q1180 312 1240 340 Q1178 329 1121 328 Q1064 329 1002 340 Z" />
                    <path d="M1002 340 Q993 332 986 320 Q999 326 1008 328 Z" />
                    <path d="M1240 340 Q1249 332 1256 320 Q1243 326 1234 328 Z" />
                    <path d="M1062 334 L1068 266 L1174 266 L1180 334 Z" />
                    <path d="M1028 272 Q1076 248 1121 245 Q1166 248 1214 272 Q1164 261 1121 260 Q1078 261 1028 272 Z" />
                    <path d="M1028 272 Q1020 265 1014 254 Q1026 259 1034 261 Z" />
                    <path d="M1214 272 Q1222 265 1228 254 Q1216 259 1208 261 Z" />
                    <path d="M1084 266 L1089 208 L1153 208 L1158 266 Z" />
                    <path d="M1052 214 Q1088 194 1121 192 Q1154 194 1190 214 Q1152 205 1121 204 Q1090 205 1052 214 Z" />
                    <path d="M1052 214 Q1045 208 1040 198 Q1050 202 1057 204 Z" />
                    <path d="M1190 214 Q1197 208 1202 198 Q1192 202 1185 204 Z" />
                    <rect x="1118" y="166" width="5" height="28" />
                    <circle cx="1120" cy="162" r="4.5" />
                    <path d="M1266 400 L1272 344 L1370 344 L1376 400 Z" />
                    <path d="M1236 350 Q1282 326 1321 323 Q1360 326 1400 348 L1400 356 Q1358 339 1319 338 Q1280 339 1236 350 Z" />
                    <path d="M1236 350 Q1228 343 1222 332 Q1234 337 1242 339 Z" />
                  </g>
                  <g fill="none" stroke="#dc4f45" strokeWidth="3" strokeLinecap="round" opacity=".9">
                    <path d="M596 282 Q648 260 700 258 Q752 260 804 282" />
                    <path d="M624 220 Q662 202 700 201 Q738 202 776 220" />
                    <path d="M1060 210 Q1092 194 1121 193 Q1150 194 1182 210" />
                  </g>
                  <g fill="#f2ebe3">
                    <rect x="690" y="172" width="8" height="18" rx="1.5" opacity=".9" /><rect x="706" y="172" width="8" height="18" rx="1.5" opacity=".55" />
                    <rect x="672" y="230" width="9" height="19" rx="1.5" opacity=".8" /><rect x="696" y="230" width="9" height="19" rx="1.5" opacity=".5" /><rect x="720" y="230" width="9" height="19" rx="1.5" opacity=".85" />
                    <rect x="648" y="292" width="9" height="20" rx="1.5" opacity=".7" /><rect x="676" y="292" width="9" height="20" rx="1.5" opacity=".9" /><rect x="718" y="292" width="9" height="20" rx="1.5" opacity=".55" /><rect x="744" y="292" width="9" height="20" rx="1.5" opacity=".8" />
                    <rect x="622" y="360" width="10" height="22" rx="1.5" opacity=".75" /><rect x="656" y="360" width="10" height="22" rx="1.5" opacity=".5" /><rect x="700" y="360" width="10" height="22" rx="1.5" opacity=".9" /><rect x="744" y="360" width="10" height="22" rx="1.5" opacity=".6" /><rect x="776" y="360" width="10" height="22" rx="1.5" opacity=".85" />
                    <rect x="290" y="272" width="8" height="18" rx="1.5" opacity=".8" /><rect x="318" y="272" width="8" height="18" rx="1.5" opacity=".55" />
                    <rect x="282" y="334" width="9" height="20" rx="1.5" opacity=".75" /><rect x="316" y="334" width="9" height="20" rx="1.5" opacity=".5" /><rect x="340" y="334" width="9" height="20" rx="1.5" opacity=".8" />
                    <rect x="110" y="348" width="8" height="18" rx="1.5" opacity=".7" /><rect x="140" y="348" width="8" height="18" rx="1.5" opacity=".5" />
                    <rect x="410" y="366" width="8" height="18" rx="1.5" opacity=".6" /><rect x="450" y="366" width="8" height="18" rx="1.5" opacity=".8" /><rect x="500" y="366" width="8" height="18" rx="1.5" opacity=".55" />
                    <rect x="1104" y="216" width="8" height="18" rx="1.5" opacity=".85" /><rect x="1128" y="216" width="8" height="18" rx="1.5" opacity=".55" />
                    <rect x="1088" y="278" width="9" height="19" rx="1.5" opacity=".75" /><rect x="1116" y="278" width="9" height="19" rx="1.5" opacity=".9" /><rect x="1146" y="278" width="9" height="19" rx="1.5" opacity=".5" />
                    <rect x="1066" y="346" width="9" height="20" rx="1.5" opacity=".7" /><rect x="1104" y="346" width="9" height="20" rx="1.5" opacity=".85" /><rect x="1140" y="346" width="9" height="20" rx="1.5" opacity=".55" /><rect x="1172" y="346" width="9" height="20" rx="1.5" opacity=".8" />
                    <rect x="1296" y="356" width="8" height="18" rx="1.5" opacity=".65" /><rect x="1326" y="356" width="8" height="18" rx="1.5" opacity=".5" />
                    <rect x="850" y="374" width="8" height="18" rx="1.5" opacity=".6" /><rect x="900" y="374" width="8" height="18" rx="1.5" opacity=".8" /><rect x="950" y="374" width="8" height="18" rx="1.5" opacity=".55" />
                  </g>
                  <g fill="#ff6a4d" className="arrival__wglow">
                    <rect x="684" y="230" width="9" height="19" rx="1.5" />
                    <rect x="690" y="360" width="10" height="22" rx="1.5" />
                    <rect x="304" y="334" width="9" height="20" rx="1.5" />
                    <rect x="1128" y="346" width="9" height="20" rx="1.5" />
                    <path d="M684 400 L684 366 Q700 354 716 366 L716 400 Z" opacity=".95" />
                  </g>
                  <path d="M678 400 L678 362 Q700 346 722 362 L722 400 L716 400 L716 366 Q700 354 684 366 L684 400 Z" fill="#0b0705" />
                  <g fill="none" stroke="#f2ebe3" strokeWidth="2" opacity=".13" strokeLinecap="round">
                    <path d="M86 372 Q134 364 190 372" /><path d="M262 372 Q310 364 360 372" /><path d="M1044 380 Q1120 370 1200 380" /><path d="M1270 380 Q1320 372 1372 380" />
                  </g>
                </g>
              </svg>
            </div>
            <div className="arrival__cloudWrap arrival__cloudWrap--b pointer-events-none absolute bottom-[35%] right-[-4%] w-[30%] max-[640px]:bottom-[44%] max-[640px]:right-[-16%] max-[640px]:w-[58%]" aria-hidden="true">
              <svg className="block h-auto w-full" viewBox="0 0 480 130" aria-hidden="true">
                <path d="M22 122 L430 122 Q452 122 454 104 Q456 86 434 80 Q414 74 406 86 Q400 96 410 100 Q420 102 426 92 Q430 80 416 70 Q396 58 372 70 Q362 42 318 44 Q284 46 280 70 Q258 38 212 48 Q176 56 172 80 Q138 62 106 78 Q74 88 60 104 Q42 112 22 122 Z" fill="#f7f2e8" filter="url(#cloudSoft)" opacity=".9" />
                <path d="M70 96 Q140 62 210 76 Q282 90 350 62 Q392 46 424 72" fill="none" stroke="#ddd2c0" strokeWidth="2.2" strokeLinecap="round" opacity=".5" />
              </svg>
            </div>
            <div className="arrival__cloudWrap arrival__cloudWrap--c pointer-events-none absolute bottom-[-3%] left-[16%] z-[1] w-[58%] max-[640px]:left-[-10%] max-[640px]:w-[112%]" aria-hidden="true">
              <svg className="block h-auto w-full" viewBox="0 0 900 150" aria-hidden="true">
                <path d="M30 150 L846 150 Q874 150 876 128 Q878 106 852 100 Q828 94 819 110 Q813 123 826 125 Q837 127 843 115 Q849 101 834 90 Q812 74 780 90 Q768 58 712 62 Q668 66 662 92 Q636 50 570 58 Q518 64 512 94 Q482 56 420 66 Q368 74 362 102 Q330 70 270 80 Q220 88 214 112 Q176 92 134 106 Q92 118 64 136 Q40 142 30 150 Z" fill="#f7f2e8" filter="url(#cloudSoft)" opacity=".98" />
                <path d="M60 140 C40 140 36 116 56 112 C72 109 76 128 62 130 C52 131 50 120 58 119" fill="none" stroke="#d9cfbf" strokeWidth="2.4" strokeLinecap="round" opacity=".7" /><path d="M110 122 Q210 84 310 100 Q410 116 500 86 Q590 60 688 90 Q748 106 810 88" fill="none" stroke="#ddd2c0" strokeWidth="2.5" strokeLinecap="round" opacity=".5" />
                <path d="M190 136 Q270 114 350 122 Q430 130 510 112" fill="none" stroke="#ddd2c0" strokeWidth="2" strokeLinecap="round" opacity=".36" />
              </svg>
            </div>
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
            <div className="arrival__copy absolute inset-x-0 top-[11%] z-[5] flex flex-col items-center px-gut text-center max-[640px]:top-[21%]">
              <div className="arrival__kicker mb-3 flex items-center gap-4 font-kanji text-[clamp(14px,1.8vw,22px)] tracking-[0.28em] text-ink/80">
                <span className="h-px w-10 bg-ink/40" aria-hidden="true" />開幕 · The curtain rises<span className="h-px w-10 bg-ink/40" aria-hidden="true" />
              </div>
              <h1 className="arrival__title font-display uppercase leading-[0.84] tracking-[-0.01em] text-[clamp(60px,8.6vw,128px)]">
                <span className="mask block overflow-hidden"><span className="block">Innerve</span></span>
                <span className="mask block overflow-hidden pb-[0.1em] mb-[-0.1em]"><span className="block text-[#f2ebe3] [-webkit-text-stroke:5px_#17120e] [paint-order:stroke_fill]">11.</span></span>
              </h1>
              <p className="arrival__sub mt-[16px] max-w-[46ch] text-[clamp(14px,1.6vw,18px)] text-ink/75">India&apos;s largest student-driven hackathon. Six Upper Moons stand between you and dawn.</p>
              <a href="#castle" data-scroll className="arrival__cta group mt-7 inline-flex items-center gap-3 border border-ink/55 bg-[#f2ebe3]/40 px-7 py-3.5 font-display text-[clamp(15px,1.8vw,20px)] uppercase tracking-[0.12em] text-ink backdrop-blur-[2px] transition-[background,border-color,color,transform] duration-300 hover:border-[#dc4f45] hover:bg-[#dc4f45] hover:text-[#f2ebe3]">
                Enter the castle
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
              </a>
            </div>
            <div className="arrival__hint pointer-events-none absolute bottom-[26px] left-[6%] z-[6] flex flex-col max-[640px]:left-1/2 max-[640px]:-translate-x-1/2 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f2ebe3]/75">
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
