"use client";

import { useEffect, useState } from "react";
import { INNERVE } from "@/lib/data";

/* Counts down to INNERVE.eventStart (an absolute instant, +05:30), so every
   visitor sees the same remaining time whatever their timezone.
   SSR and the first client render both output the same "--" placeholders
   (no hydration mismatch); real values appear after mount. Digits are
   tabular and each unit has a fixed width, so nothing shifts as it ticks. */

const TARGET = new Date(INNERVE.eventStart).getTime();
const pad = (n: number, w = 2) => String(n).padStart(w, "0");

function parts(now: number) {
  const s = Math.max(0, Math.floor((TARGET - now) / 1000));
  return {
    done: now >= TARGET,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const n = Date.now();
      setNow(n);
      if (n >= TARGET) return; // stop ticking once the hackathon starts
      t = setTimeout(tick, 1000 - (n % 1000) + 5); // stay aligned to the second
    };
    tick();
    const onVis = () => { clearTimeout(t); if (!document.hidden) tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearTimeout(t); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const p = now === null ? null : parts(now);
  const units: [string, string][] = p
    ? [[pad(p.d, 3), "Days"], [pad(p.h), "Hrs"], [pad(p.m), "Min"], [pad(p.s), "Sec"]]
    : [["---", "Days"], ["--", "Hrs"], ["--", "Min"], ["--", "Sec"]];

  const label = p?.done ? "Hackathon is live" : "Hackathon begins in";
  const sr = p && !p.done ? `${label} ${p.d} days ${p.h} hours ${p.m} minutes` : label;

  return (
    <div className="mt-3 min-h-[64px] lg:mt-4" role="timer" aria-label={sr}>
      <span className="block text-[clamp(10px,0.8vw,12px)] font-medium uppercase tracking-[0.18em] text-haori/70">{label}</span>
      {!p?.done && (
        <span className="mt-1 flex items-start gap-[clamp(10px,1vw,16px)] font-body font-extrabold leading-none text-ember" aria-hidden="true">
          {units.map(([v, u], i) => (
            <span key={u} className="flex flex-col items-center" style={{ width: `${v.length}ch`, fontSize: "clamp(20px,1.9vw,30px)" }}>
              <span className="block w-full text-center tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>{v}</span>
              <span className="mt-1.5 block whitespace-nowrap pl-[0.18em] text-center text-[9px] font-medium uppercase leading-none tracking-[0.18em] text-haori/60">{u}</span>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
