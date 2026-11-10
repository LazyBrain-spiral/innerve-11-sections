"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faq, faqCategories } from "@/lib/faq";

gsap.registerPlugin(ScrollTrigger);

export default function Faq() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  /* Re-play the static build's stagger animation whenever the tab changes. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const list = listRef.current;
    if (list && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.from(list.querySelectorAll(".qa"), {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power3.out",
      });
    }

    ScrollTrigger.refresh();
  }, [active]);

  const selectCategory = (index: number) => {
    setActive(index);
    setOpen(new Set());
  };

  const toggleQuestion = (index: number) => {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

    window.setTimeout(() => ScrollTrigger.refresh(), 500);
  };

  const category = faqCategories[active];

  return (
    <div className="ivf">
      <section className="faq" id="faq" data-tone="dark" data-name="Scrolls">
        <svg className="faq__branch" viewBox="0 0 380 320" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M376 8C332 24 302 48 280 80C256 114 238 148 206 176C172 206 126 222 70 226" />
            <path d="M304 48C316 30 336 20 360 16" />
            <path d="M262 108C248 96 240 80 242 60C260 64 272 80 262 108Z" />
            <path d="M236 148C220 140 210 124 210 104C230 106 242 122 236 148Z" />
            <path d="M198 186C182 180 170 164 168 144C188 144 202 160 198 186Z" />
            <path d="M156 208C140 204 128 188 126 168C146 168 160 184 156 208Z" />
            <path d="M112 220C96 216 84 200 82 180C102 180 116 196 112 220Z" />
            <path d="M280 80C274 108 276 136 284 160" />
            <circle cx="278" cy="92" r="3.5" />
            <circle cx="276" cy="104" r="3.5" />
            <circle cx="276" cy="116" r="3.5" />
            <circle cx="278" cy="128" r="3.5" />
            <circle cx="280" cy="140" r="3.5" />
            <circle cx="282" cy="152" r="3.5" />
            <path d="M236 148C232 172 234 196 240 218" />
            <circle cx="235" cy="160" r="3" />
            <circle cx="234" cy="172" r="3" />
            <circle cx="235" cy="184" r="3" />
            <circle cx="237" cy="196" r="3" />
            <circle cx="239" cy="208" r="3" />
            <path d="M168 144C160 162 156 180 156 198" />
            <circle cx="165" cy="156" r="2.8" />
            <circle cx="162" cy="167" r="2.8" />
            <circle cx="160" cy="178" r="2.8" />
            <circle cx="159" cy="189" r="2.8" />
          </g>
        </svg>

        <div className="wrap">
          <div className="eyebrow">FAQs</div>
          <h2 className="sec-title">
            Before you <em>enter</em>
          </h2>

          <div className="faq__tabs" role="tablist">
            {faqCategories.map((name, index) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={index === active}
                className="faq__tab"
                onClick={() => selectCategory(index)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="faq__list" ref={listRef}>
            {faq[category].map((item, index) => {
              const isOpen = open.has(index);
              return (
                <div key={item.q} className={`qa${isOpen ? " open" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleQuestion(index)}
                  >
                    {item.q}
                    <i aria-hidden="true" />
                  </button>
                  <div className="qa__a">
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
