/* Innerve 11 — sections driver.
   Faithful port of the static build's main.js: same GSAP/Lenis orchestration,
   same selectors, same event contract with the castle module. Content rendering
   and the castle HUD moved into React (components/Site.tsx). */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

declare global {
  interface Window {
    CASTLE?: { progress: number; visible?: boolean; nights?: unknown; info?: unknown };
    SFX?: { play: (n?: string) => void; start: () => void; toggle: () => boolean; on: boolean; level: () => number };
    LENIS?: Lenis | null;
  }
}

const $ = (s: string, r: Document | HTMLElement = document) => r.querySelector(s) as HTMLElement | null;
const $$ = (s: string, r: Document | HTMLElement = document) => [...r.querySelectorAll(s)] as HTMLElement[];

/* Split text nodes into .word > .ch spans (verbatim from the static build) */
const splitChars = (el: HTMLElement) => {
  const walk = (node: HTMLElement | Node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent || "").split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          [...w].forEach((c) => {
            const ch = document.createElement("span");
            ch.className = "ch";
            ch.textContent = c;
            word.appendChild(ch);
          });
          frag.appendChild(word);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n as HTMLElement);
    });
  };
  walk(el);
};

export function initDriver(): () => void {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = !reduced;
  const canHover = matchMedia("(hover: hover)").matches;
  const cleanups: (() => void)[] = [];

  // no audio in this build; keep the no-op interface the castle scene expects
  const SFX = (window.SFX = window.SFX || { play() {}, start() {}, toggle: () => false, on: false, level: () => 0 });

  /* ---------- split text into words/chars ---------- */
  $$(".castle__title .mask > span, .arrival__title .mask > span, .sec-title, .castle__bounty").forEach(splitChars);

  /* ---------- smooth anchor scrolling (both paths) ---------- */
  const bindAnchors = (lenis: Lenis | null) => {
    $$("[data-scroll]").forEach((a) => {
      const onClick = (e: Event) => {
        const href = a.getAttribute("href");
        const t = href ? $(href) : null;
        if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { duration: 1.8 });
        else t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      };
      a.addEventListener("click", onClick);
      cleanups.push(() => a.removeEventListener("click", onClick));
    });
  };

  /* ---------- static fallback ---------- */
  if (!animate) {
    document.documentElement.classList.add("no-anim");
    const poolEl = $("#poolNum");
    if (poolEl) poolEl.textContent = "12";
    bindAnchors(null);
    return () => cleanups.forEach((fn) => fn());
  }

  /* ================= ANIMATED PATH ================= */
  /* All GSAP work runs inside a context so React StrictMode's double effect
     (and dev Fast Refresh) can fully revert tweens/triggers/styles. Without
     this, a re-run creates duplicate from-tweens that record mid-flight
     values as their end state and freeze content invisible. */
  const ctx = gsap.context(() => {

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true }); // mobile address-bar resizes were re-laying out the pinned castle mid-scroll
  const SECTIONS = $$("main > section"); // grab before pinning wraps them in spacers

  // Smooth scroll
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  window.LENIS = lenis;
  cleanups.push(() => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    window.LENIS = null;
  });
  bindAnchors(lenis);

  const flash = (o = 0.6) =>
    gsap.fromTo("#flash", { opacity: o }, { opacity: 0, duration: 0.45, ease: "power2.out", overwrite: true });

  /* ----- INFINITY CASTLE (3D in lib/castle.ts; this drives it) ----- */
  const CASTLE = (window.CASTLE = window.CASTLE || { progress: 0 });
  const barEl = $("#castleBar");
  const onShift = () => flash(0.22);
  window.addEventListener("castle-shift", onShift);
  cleanups.push(() => window.removeEventListener("castle-shift", onShift));
  void SFX;

  const castleTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#castle", start: "top top", end: "+=320%", pin: true, scrub: true, anticipatePin: 1,
      onUpdate: (self) => {
        CASTLE.progress = self.progress;
        if (barEl) barEl.style.transform = `scaleX(${self.progress})`;
      },
    },
  });
  castleTl
    .to(".castle__copy", { opacity: 0, y: -40, duration: 0.06 }, 0.08)
    .to(".castle__end", { opacity: 1, duration: 0.05 }, 0.9)
    .from(".castle__bounty .ch", { yPercent: 80, opacity: 0, stagger: 0.004, duration: 0.05 }, 0.9)
    .call(() => SFX.play("gong"), [], 0.9)
    .call(() => flash(0.5), [], 0.965)
    .to({}, { duration: 0.02 }, 0.98);

  /* ----- PRIZES ----- */
  const pool = { v: 0 };
  const poolEl = $("#poolNum");
  gsap.timeline({ scrollTrigger: { trigger: ".prizes__pin", start: "top top", end: "+=70%", pin: true, scrub: 1 } })
    .from(".prizes__big", { scale: 0.6, opacity: 0, duration: 0.3 }, 0)
    .to(pool, { v: 12, duration: 0.5, ease: "power1.out", onUpdate: () => { if (poolEl) poolEl.textContent = String(Math.round(pool.v)); } }, 0)
    .call(() => SFX.play("taiko"), [], 0.02)
    .from(".prizes__note, .prizes .eyebrow", { opacity: 0, y: 20, duration: 0.2 }, 0.3)
    .to(".prizes__pin", { opacity: 0.15, scale: 0.92, duration: 0.3 }, 0.7);
  gsap.from(".pcard", {
    y: 80, opacity: 0, rotationX: -12, transformPerspective: 900, stagger: 0.1, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: "#pcards", start: "top 85%" },
  });

  /* ----- ARRIVAL hero: load-in + layered parallax (no pin, no scroll hijack) ----- */
  const branchPaths = $$(".arrival__branchArt path.bough") as unknown as SVGPathElement[];
  branchPaths.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
  });
  const enterTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  enterTl
    .from(".arrival__halo", { scale: 0.92, opacity: 0, duration: 1.6 }, 0)
    .from(".arrival__ring", { scale: 0.96, opacity: 0, duration: 1.7 }, 0.05)
    .from(".arrival__sun", { y: 60, scale: 0.85, opacity: 0, duration: 1.5 }, 0.1)
    .from(".arrival__castle", { y: 70, opacity: 0, duration: 1.3 }, 0.25)
    .from(".arrival__mist", { opacity: 0, y: 36, duration: 1.2, stagger: 0.12 }, 0.35)
    .to(branchPaths, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.08 }, 0.45)
    .from(".arrival__blossom", { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2.2)", stagger: { each: 0.045, from: "random" } }, 1.05)
    .from(".arrival__birds", { opacity: 0, x: -30, duration: 1.0 }, 1.05)
    .from(".arrival__title .ch", { yPercent: 110, stagger: 0.035, duration: 0.9, ease: "power4.out" }, 0.5)
    .from(".arrival__kicker, .arrival__sub, .arrival__cta", { opacity: 0, y: 18, duration: 0.8, stagger: 0.09 }, 0.85)
    .from(".arrival__rail", { opacity: 0, y: 20, duration: 0.9, stagger: 0.1 }, 1.05)
    .from(".arrival__frame", { opacity: 0, duration: 1.1 }, 1.15)
    .from(".arrival__hint", { opacity: 0, duration: 0.9 }, 1.3);
  gsap.timeline({ scrollTrigger: { trigger: "#arrival", start: "top top", end: "bottom top", scrub: true } })
    .to(".arrival__copy", { yPercent: -34, opacity: 0, ease: "none", duration: 0.5 }, 0)
    .to(".arrival__hint", { opacity: 0, ease: "none", duration: 0.18 }, 0)
    .to(".arrival__rail", { opacity: 0, ease: "none", duration: 0.4 }, 0)
    .to(".arrival__frame", { opacity: 0, ease: "none", duration: 0.5 }, 0)
    .to(".arrival__mist--l", { xPercent: -46, opacity: 0, ease: "none", duration: 1 }, 0)
    .to(".arrival__mist--r", { xPercent: 46, opacity: 0, ease: "none", duration: 1 }, 0)
    .to(".arrival__mist--c", { yPercent: -10, opacity: 0, ease: "none", duration: 0.8 }, 0)
    .to(".arrival__branch--r", { xPercent: 10, yPercent: -8, ease: "none", duration: 1 }, 0)
    .to(".arrival__branch--l", { xPercent: -12, yPercent: 14, ease: "none", duration: 1 }, 0)
    .to(".arrival__birds", { xPercent: 40, yPercent: -30, ease: "none", duration: 1 }, 0)
    .to(".arrival__halo", { yPercent: 18, ease: "none", duration: 1 }, 0)
    .to(".arrival__ring", { yPercent: 22, scale: 1.03, ease: "none", duration: 1 }, 0)
    .to(".arrival__sun", { yPercent: 34, scale: 1.05, ease: "none", duration: 1 }, 0)
    .to(".arrival__castle", { yPercent: 5, scale: 1.14, ease: "none", transformOrigin: "50% 100%", duration: 1 }, 0);

  /* ===== non-pinned triggers (created after every pin so positions include pin spacing) ===== */
  $$(".reveal").forEach((el) =>
    gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
  $$(".sec-title").forEach((el) =>
    gsap.from(el.querySelectorAll(".ch"), { yPercent: 100, rotation: 8, opacity: 0, stagger: 0.018, duration: 0.8, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%" } }));

  /* ----- VOICES + ALLIES ----- */
  gsap.from(".vcard", { y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#vgrid", start: "top 85%" } });
  gsap.from(".atile", { y: 40, opacity: 0, scale: 0.96, stagger: 0.04, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "#agrid", start: "top 85%" } });
  gsap.from(".hanko", { scale: 2.2, opacity: 0, rotation: -30, stagger: 0.15, duration: 0.5, ease: "back.out(2)", scrollTrigger: { trigger: "#vgrid", start: "top 70%" } });

  /* ----- magnetic 3D tilt on prize cards ----- */
  if (canHover) {
    $$(".pcard").forEach((c) => {
      gsap.set(c, { transformPerspective: 900 });
      const rx = gsap.quickTo(c, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(c, "rotationY", { duration: 0.6, ease: "power3.out" });
      const onMove = (e: Event) => {
        const me = e as MouseEvent;
        const r = c.getBoundingClientRect();
        ry(((me.clientX - r.left) / r.width - 0.5) * 12);
        rx(-((me.clientY - r.top) / r.height - 0.5) * 10);
      };
      const onLeave = () => { rx(0); ry(0); };
      c.addEventListener("mousemove", onMove);
      c.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        c.removeEventListener("mousemove", onMove);
        c.removeEventListener("mouseleave", onLeave);
      });
    });
  }

  /* ----- tone per section (kept for any tone-dependent styling) ----- */
  SECTIONS.forEach((sec) => {
    const spacer = sec.parentElement?.classList.contains("pin-spacer") ? (sec.parentElement as HTMLElement) : sec;
    ScrollTrigger.create({
      trigger: spacer, start: "top 32px", end: "bottom 32px",
      onToggle: (self) => { if (self.isActive) document.body.dataset.tone = sec.dataset.tone; },
    });
  });
  document.body.dataset.tone = "dark";

  /* fail-visible watchdog: if a slow first compile / stalled GPU init froze the
     ticker mid-entrance, settle non-scroll tweens and re-measure triggers */
  const watchdog = window.setTimeout(() => {
    gsap.globalTimeline.getChildren(true, true, false).forEach((t) => {
      if (!(t as unknown as { scrollTrigger?: unknown }).scrollTrigger) t.progress(1);
    });
    ScrollTrigger.refresh();
  }, 4000);
  cleanups.push(() => window.clearTimeout(watchdog));

  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);
  cleanups.push(() => window.removeEventListener("load", onLoad));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

  cleanups.push(() => ScrollTrigger.getAll().forEach((st) => st.kill()));

  });

  return () => {
    ctx.revert(); // kills + reverts every tween, trigger and inline style made above
    cleanups.forEach((fn) => fn());
  };
}
