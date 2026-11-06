"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PatternDefs from "@/components/tracks/PatternDefs";
import { createBreathingFx, type BreathingFx } from "@/lib/breathing-fx";
import { pad, tracks, type BreathingForm, type Track } from "@/lib/tracks";

gsap.registerPlugin(ScrollTrigger);

/* Verbatim form data from the static build's forms.js. */
const STYLES: Record<
  BreathingForm,
  { col: string[]; sfx: string[]; kanji: string }
> = {
  water: { col: ["#3fb6ff", "#bfe9ff", "#ffffff", "#1d5fbf"], sfx: ["whoosh", "slash"], kanji: "水" },
  flame: { col: ["#ffd23a", "#ff8a00", "#ff3b00", "#fff1b8"], sfx: ["flame"], kanji: "炎" },
  insect: { col: ["#b9a3e3", "#6fc3c0", "#f2d0ff", "#ffffff"], sfx: ["koto", "whoosh"], kanji: "蟲" },
  mist: { col: ["#cfe7e1", "#ffffff", "#9fc9c0"], sfx: ["whoosh"], kanji: "霞" },
  sound: { col: ["#ffd23a", "#d6a640", "#ff4d6d", "#ffffff"], sfx: ["thunder", "taiko"], kanji: "音" },
  stone: { col: ["#8a7f72", "#5b5148", "#c9bba7", "#2c2621"], sfx: ["taiko", "heartbeat"], kanji: "岩" },
  serpent: { col: ["#ffffff", "#6a4fa0", "#b9a3e3"], sfx: ["whoosh", "slash"], kanji: "蛇" },
  love: { col: ["#f2a9c4", "#ff6fa8", "#8fd18a", "#ffffff"], sfx: ["koto", "whoosh"], kanji: "恋" },
  wind: { col: ["#e9efe9", "#8fd18a", "#2f6b3c", "#ffffff"], sfx: ["whoosh", "slash"], kanji: "風" },
};

type WindowWithImpact = Window & { Impact?: (heavy?: boolean) => void };

export default function Tracks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slamRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const fxRef = useRef<BreathingFx | null>(null);
  const canHoverRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fx = createBreathingFx(canvas);
    fxRef.current = fx;

    return () => {
      fx.destroy();
      fxRef.current = null;
    };
  }, []);

  /* Reveal + the touch-device "centred row wakes up" behaviour from main.js. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    canHoverRef.current = matchMedia("(hover: hover)").matches;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = [...list.querySelectorAll<HTMLElement>(".trow")];
    const reveal = gsap.from(rows, {
      y: 60,
      opacity: 0,
      stagger: 0.06,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: list, start: "top 85%" },
    });

    const triggers: ScrollTrigger[] = [];
    if (!canHoverRef.current) {
      rows.forEach((row) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top 58%",
            end: "bottom 58%",
            toggleClass: { targets: row, className: "is-on" },
          })
        );
      });
    }

    return () => {
      reveal.scrollTrigger?.kill();
      reveal.kill();
      triggers.forEach((trigger) => trigger.kill());
      rows.forEach((row) => row.classList.remove("is-on"));
    };
  }, []);

  /* Faithful port of forms.js → unleash(). */
  const unleash = (track: Track) => {
    const slam = slamRef.current;
    const style = STYLES[track.form];
    if (!slam || !style) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    style.sfx.forEach((sound, index) => {
      window.setTimeout(() => window.SFX?.play(sound), index * 140);
    });

    const k = slam.querySelector<HTMLElement>(".slam__k");
    const who = slam.querySelector<HTMLElement>(".slam__who");
    const jp = slam.querySelector<HTMLElement>(".slam__jp");
    const en = slam.querySelector<HTMLElement>(".slam__en");
    const wash = slam.querySelector<HTMLElement>(".slam__wash");
    if (!k || !who || !jp || !en || !wash) return;

    k.textContent = style.kanji;
    who.textContent = track.hashira;
    jp.textContent = track.formJp;
    en.textContent = track.formEn;
    slam.style.setProperty("--slam", style.col[0]);

    const lines = slam.querySelectorAll<HTMLElement>(".slam__line");
    gsap.killTweensOf([slam, k, ...lines]);
    gsap
      .timeline()
      .set(slam, { autoAlpha: 1 })
      .fromTo(wash, { opacity: 0 }, { opacity: 1, duration: 0.15 })
      .fromTo(
        k,
        { scale: 3.2, opacity: 0, rotation: -12 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.35, ease: "expo.out" },
        0
      )
      .fromTo(
        lines,
        { yPercent: 120 },
        { yPercent: 0, stagger: 0.06, duration: 0.45, ease: "expo.out" },
        0.12
      )
      .to(slam, { x: 10, duration: 0.03, yoyo: true, repeat: 5 }, 0.1)
      .to(slam, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.9);

    window.setTimeout(() => {
      (window as WindowWithImpact).Impact?.(
        track.form === "flame" || track.form === "love"
      );
    }, 60);

    fxRef.current?.play(track.form);
  };

  const onRowEnter = (row: HTMLLIElement) => {
    if (!canHoverRef.current) return;
    row.classList.add("is-on");
    window.SFX?.play("unsheathe");
  };

  const onRowLeave = (row: HTMLLIElement) => {
    if (!canHoverRef.current) return;
    row.classList.remove("is-on");
  };

  return (
    <div className="ivt">
      <PatternDefs />

      <section
        className="tracks paper"
        id="tracks"
        data-tone="light"
        data-name="Breathing Styles"
      >
        <div className="wrap">
          <div className="eyebrow">Tracks</div>
          <h2 className="sec-title">
            Choose your <em>breathing.</em>
          </h2>
          <p className="tracks__hint">
            Click a style to unleash its first form <span>↓</span>
          </p>
        </div>

        <ol className="tlist" id="tlist" ref={listRef}>
          {tracks.map((track, index) => (
            <li
              key={track.name}
              className="trow"
              tabIndex={0}
              role="button"
              data-i={index}
              aria-label={`${track.name}: unleash ${track.formEn}`}
              onMouseEnter={(event) => onRowEnter(event.currentTarget)}
              onMouseLeave={(event) => onRowLeave(event.currentTarget)}
              onClick={() => unleash(track)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  unleash(track);
                }
              }}
            >
              <div className="trow__bg" />
              <div className="trow__art" aria-hidden="true">
                <svg preserveAspectRatio="none">
                  <rect width="100%" height="100%" fill={`url(#${track.pat})`} />
                </svg>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={track.img} alt="" loading="lazy" />
                <span className="trow__kanji">{track.kanji}</span>
              </div>
              <div className="trow__in">
                <span className="trow__num">{pad(index + 1)}</span>
                <h3 className="trow__name">{track.name}</h3>
                <p className="trow__meta">
                  <b>
                    {track.style} · {track.hashira}
                  </b>
                  {track.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <canvas className="forms" ref={canvasRef} aria-hidden="true" />

      <div className="slam" id="slam" ref={slamRef} aria-hidden="true">
        <div className="slam__wash" />
        <div className="slam__k" />
        <div className="slam__txt">
          <div className="mask">
            <div className="slam__line slam__who" />
          </div>
          <div className="mask">
            <div className="slam__line slam__jp" />
          </div>
          <div className="mask">
            <div className="slam__line slam__en" />
          </div>
        </div>
      </div>
    </div>
  );
}
