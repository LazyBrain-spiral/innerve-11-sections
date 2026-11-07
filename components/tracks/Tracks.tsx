"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PatternDefs from "@/components/tracks/PatternDefs";
import { pad, tracks } from "@/lib/tracks";

gsap.registerPlugin(ScrollTrigger);

export default function Tracks() {
  const listRef = useRef<HTMLOListElement>(null);
  const canHoverRef = useRef(false);

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
            Find your <em>breathing style.</em>
          </h2>
        </div>

        <ol className="tlist" id="tlist" ref={listRef}>
          {tracks.map((track, index) => (
            <li
              key={track.name}
              className="trow"
              onMouseEnter={(event) => onRowEnter(event.currentTarget)}
              onMouseLeave={(event) => onRowLeave(event.currentTarget)}
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
                <div className="trow__title">
                  <h3 className="trow__name">{track.name}</h3>
                  <div className="trow__hashira" aria-hidden="true">
                    <span className="trow__hname">{track.hashira}</span>
                    <span className="trow__hstyle">
                      {[...track.style].map((ch, i) => (
                        <span key={i} className={ch === " " ? "sp" : undefined}>
                          {ch === " " ? "\u00a0" : ch}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
                <p className="trow__meta">{track.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
