/* Innerve 11 — sections build.
   Trimmed driver derived from the fan build's main.js: renders and animates only the
   kept sections (Infinity Castle, Prize pool, Testimonials, Past sponsors, Footer). */
(() => {
  const D = window.INNERVE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const animate = hasGsap && !reduced;
  const canHover = matchMedia("(hover: hover)").matches;

  // no audio in this build; keep the no-op interface castle.js and the scenes expect
  const SFX = (window.SFX = window.SFX || { play() {}, start() {}, toggle() { return false; }, on: false, level: () => 0 });

  /* ---------- Render content ---------- */
  $("#pcards").innerHTML = D.prizes.map((p) => `
    <article class="pcard${p.hot ? " pcard--hot" : ""}">
      <span class="pcard__k" aria-hidden="true">${p.kanji}</span>
      <div class="pcard__rank">${p.rank}</div>
      <div class="pcard__amt"><small>₹</small>${p.amt}</div>
      <ul>${D.prizePerks.map((x) => `<li>${x}</li>`).join("")}</ul>
    </article>`).join("");

  $("#vgrid").innerHTML = D.testimonials.map((t) => `
    <figure class="vcard">
      <blockquote>${t.quote}</blockquote>
      <figcaption class="vcard__who">
        <span class="hanko" aria-hidden="true">${t.name.split(" ").map((w) => w[0]).join("")}</span>
        <span><b>${t.name}</b><span>${t.org}</span></span>
      </figcaption>
    </figure>`).join("");

  $("#agrid").innerHTML = D.sponsors.map((s) => `
    <a class="atile${s.size ? " atile--" + s.size : ""}" href="${s.url}" target="_blank" rel="noopener">
      <span class="atile__tier">${s.tier}</span>
      <img src="assets/logos/sponsors/${s.logo}" alt="${s.name}" loading="lazy" />
    </a>`).join("");

  /* ---------- Split text into words/chars ---------- */
  const splitChars = (el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(" ")); return; }
            const word = document.createElement("span"); word.className = "word";
            [...w].forEach((c) => { const ch = document.createElement("span"); ch.className = "ch"; ch.textContent = c; word.appendChild(ch); });
            frag.appendChild(word);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  };
  $$(".castle__title .mask > span, .sec-title, .castle__bounty").forEach(splitChars);

  /* ---------- Static fallback ---------- */
  if (!animate) {
    document.documentElement.classList.add("no-anim");
    $("#poolNum").textContent = "12";
    $$("[data-scroll]").forEach((a) => a.addEventListener("click", (e) => {
      const t = $(a.getAttribute("href")); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }));
    return;
  }

  /* ================= ANIMATED PATH ================= */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true }); // mobile address-bar resizes were re-laying out the pinned castle mid-scroll
  const SECTIONS = $$("main > section"); // grab before pinning wraps them in spacers

  // Smooth scroll
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.LENIS = lenis;
  $$("[data-scroll]").forEach((a) => a.addEventListener("click", (e) => {
    const t = $(a.getAttribute("href")); if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { duration: 1.8 }) : t.scrollIntoView({ behavior: "smooth" });
  }));

  const flash = (o = .6) => gsap.fromTo("#flash", { opacity: o }, { opacity: 0, duration: .45, ease: "power2.out", overwrite: true });

  /* ----- INFINITY CASTLE (3D in castle.js; this drives it) ----- */
  const CASTLE = (window.CASTLE = window.CASTLE || { progress: 0 });
  const MOONS = [[0, "上弦の陸", "Upper Six · Daki"], [0, "上弦の伍", "Upper Five · Gyokko"], [0, "上弦の肆", "Upper Four · Hantengu"],
    [0, "上弦の参", "Upper Three · Akaza"], [0, "上弦の弐", "Upper Two · Doma"], [0, "上弦の壱", "Upper One · Kokushibo"], [0, "琵琶", "The Biwa · Nakime"]];
  const capEl = $("#castleCap"), barEl = $("#castleBar");
  let lastMoonSfx = 0;
  window.addEventListener("castle-moon", (e) => {
    const idx = e.detail;
    if (idx < 0) { gsap.to(capEl, { opacity: 0, x: 20, duration: .3 }); return; }
    capEl.innerHTML = `<b>${MOONS[idx][1]}</b><span>${MOONS[idx][2]}</span>`;
    gsap.fromTo(capEl, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .5, ease: "power3.out" });
    if (performance.now() - lastMoonSfx > 900) { lastMoonSfx = performance.now(); SFX.play(idx === 6 ? "biwa" : "koto"); }
  });
  window.addEventListener("castle-shift", () => flash(.22));

  /* ----- the three Nights (timeline milestones) shown over the flythrough ----- */
  const nightEl = $("#castleNight"), ticksEl = $("#castleTicks");
  let NIGHTS = null;
  const setGates = (list) => {
    NIGHTS = list;
    ticksEl.innerHTML = list.map((n) => `<i style="left:${(n.p * 100).toFixed(2)}%"><b>${n.k}</b></i>`).join("");
  };
  if (window.CASTLE && window.CASTLE.nights) setGates(window.CASTLE.nights);
  window.addEventListener("castle-gates", (e) => setGates(e.detail));
  window.addEventListener("castle-night", (e) => {
    const i = e.detail;
    if (i < 0 || !NIGHTS) { gsap.to(nightEl, { opacity: 0, y: 14, duration: .35, overwrite: true }); return; }
    const n = NIGHTS[i];
    nightEl.innerHTML = `<span class="castle__nk">${n.k} · Night ${n.n}</span><b>${n.day} <em>${n.yr}</em></b><span class="castle__nw">${n.what}</span>${n.at ? `<span class="castle__nt">${n.at}</span>` : ""}`;
    gsap.fromTo(nightEl, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: "power3.out", overwrite: true });
  });
  const castleTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#castle", start: "top top", end: "+=320%", pin: true, scrub: true, anticipatePin: 1,
      onUpdate: (self) => { CASTLE.progress = self.progress; barEl.style.transform = `scaleX(${self.progress})`; }
    }
  });
  castleTl
    .to(".castle__copy", { opacity: 0, y: -40, duration: .06 }, .08)
    .to(".castle__end", { opacity: 1, duration: .05 }, .9)
    .from(".castle__bounty .ch", { yPercent: 80, opacity: 0, stagger: .004, duration: .05 }, .9)
    .call(() => SFX.play("gong"), null, .9)
    .call(() => flash(.5), null, .965)
    .to({}, { duration: .02 }, .98);

  /* ----- PRIZES ----- */
  const pool = { v: 0 }, poolEl = $("#poolNum");
  gsap.timeline({ scrollTrigger: { trigger: ".prizes__pin", start: "top top", end: "+=70%", pin: true, scrub: 1 } })
    .from(".prizes__big", { scale: .6, opacity: 0, duration: .3 }, 0)
    .to(pool, { v: 12, duration: .5, ease: "power1.out", onUpdate: () => (poolEl.textContent = Math.round(pool.v)) }, 0)
    .call(() => SFX.play("taiko"), null, .02)
    .from(".prizes__note, .prizes .eyebrow", { opacity: 0, y: 20, duration: .2 }, .3)
    .to(".prizes__pin", { opacity: .15, scale: .92, duration: .3 }, .7);
  gsap.from(".pcard", { y: 80, opacity: 0, rotationX: -12, transformPerspective: 900, stagger: .1, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: "#pcards", start: "top 85%" } });

  /* ===== non-pinned triggers (created after every pin so positions include pin spacing) ===== */
  /* ----- generic reveals ----- */
  $$(".reveal").forEach((el) =>
    gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
  $$(".sec-title").forEach((el) =>
    gsap.from(el.querySelectorAll(".ch"), { yPercent: 100, rotation: 8, opacity: 0, stagger: .018, duration: .8, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%" } }));

  /* ----- VOICES + ALLIES ----- */
  gsap.from(".vcard", { y: 60, opacity: 0, stagger: .12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#vgrid", start: "top 85%" } });
  gsap.from(".atile", { y: 40, opacity: 0, scale: .96, stagger: .04, duration: .8, ease: "power3.out", scrollTrigger: { trigger: "#agrid", start: "top 85%" } });
  gsap.from(".hanko", { scale: 2.2, opacity: 0, rotation: -30, stagger: .15, duration: .5, ease: "back.out(2)", scrollTrigger: { trigger: "#vgrid", start: "top 70%" } });

  /* ----- magnetic 3D tilt on prize cards ----- */
  if (canHover) {
    $$(".pcard").forEach((c) => {
      gsap.set(c, { transformPerspective: 900 });
      const rx = gsap.quickTo(c, "rotationX", { duration: .6, ease: "power3.out" }), ry = gsap.quickTo(c, "rotationY", { duration: .6, ease: "power3.out" });
      c.addEventListener("mousemove", (e) => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 12); rx(-((e.clientY - r.top) / r.height - .5) * 10); });
      c.addEventListener("mouseleave", () => { rx(0); ry(0); });
    });
  }

  /* ----- tone per section (kept for any tone-dependent styling) ----- */
  SECTIONS.forEach((sec) => {
    const spacer = sec.parentElement.classList.contains("pin-spacer") ? sec.parentElement : sec;
    ScrollTrigger.create({ trigger: spacer, start: "top 32px", end: "bottom 32px",
      onToggle: (self) => { if (self.isActive) document.body.dataset.tone = sec.dataset.tone; } });
  });
  document.body.dataset.tone = "dark";

  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
