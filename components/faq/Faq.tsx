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
        <div className="wrap">
          <div className="eyebrow">FAQs</div>
          <h2 className="sec-title">
            Quick answers, <em>slayer.</em>
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
