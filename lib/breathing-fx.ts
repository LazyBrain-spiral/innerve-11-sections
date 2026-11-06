import type { BreathingForm } from "@/lib/tracks";

/**
 * Full-screen breathing-technique particle system, ported from the original
 * forms.js. Each style gets a signature storm: water ribbons, flame plumes,
 * insect butterflies, mist blobs, sound rings, stone debris, serpents,
 * love spirals and wind streaks.
 */

const PALETTES: Record<BreathingForm, string[]> = {
  water: ["#3fb6ff", "#bfe9ff", "#ffffff", "#1d5fbf"],
  flame: ["#ffd23a", "#ff8a00", "#ff3b00", "#fff1b8"],
  insect: ["#b9a3e3", "#6fc3c0", "#f2d0ff", "#ffffff"],
  mist: ["#cfe7e1", "#ffffff", "#9fc9c0"],
  sound: ["#ffd23a", "#d6a640", "#ff4d6d", "#ffffff"],
  stone: ["#8a7f72", "#5b5148", "#c9bba7", "#2c2621"],
  serpent: ["#ffffff", "#6a4fa0", "#b9a3e3"],
  love: ["#f2a9c4", "#ff6fa8", "#8fd18a", "#ffffff"],
  wind: ["#e9efe9", "#8fd18a", "#2f6b3c", "#ffffff"],
};

type ParticleKind =
  | "ribbon"
  | "drop"
  | "fire"
  | "fly"
  | "blob"
  | "ring"
  | "spark"
  | "rock"
  | "snake"
  | "spiral"
  | "streak"
  | "cut";

interface Particle {
  k: ParticleKind;
  life: number;
  max: number;
  col: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  amp: number;
  ph: number;
  w: number;
  sp: number;
  delay: number;
  vr: number;
  rot: number;
  vrot: number;
  sides: number;
  a: number;
  rad: number;
  va: number;
  vrad: number;
  len: number;
  swirl: number;
}

export interface BreathingFx {
  play: (form: BreathingForm) => void;
  destroy: () => void;
}

const blank = (): Particle => ({
  k: "spark",
  life: 0,
  max: 1.8,
  col: "#ffffff",
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  r: 1,
  amp: 0,
  ph: 0,
  w: 1,
  sp: 1,
  delay: 0,
  vr: 0,
  rot: 0,
  vrot: 0,
  sides: 6,
  a: 0,
  rad: 0,
  va: 0,
  vrad: 0,
  len: 0,
  swirl: 0,
});

export function createBreathingFx(canvas: HTMLCanvasElement): BreathingFx {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { play: () => {}, destroy: () => {} };
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0;
  let H = 0;
  let parts: Particle[] = [];
  let style: BreathingForm = "water";
  let startedAt = 0;
  let running = false;
  let raf = 0;

  const size = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  size();
  window.addEventListener("resize", size);

  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const add = (palette: string[], options: Partial<Particle>) => {
    parts.push({ ...blank(), col: pick(palette), ...options } as Particle);
  };

  const spawn = (key: BreathingForm) => {
    parts = [];
    const zoom = window.innerWidth < 700 ? 0.55 : 1;
    const palette = PALETTES[key];
    const put = (options: Partial<Particle>) => add(palette, options);

    if (key === "water") {
      for (let i = 0; i < 7; i++) {
        put({
          k: "ribbon",
          y: H * rand(0.25, 0.75),
          amp: rand(30, 110),
          ph: rand(0, 6),
          w: rand(6, 26),
          sp: rand(0.9, 1.4),
          max: 2,
        });
      }
      for (let i = 0; i < 160 * zoom; i++) {
        put({
          k: "drop",
          x: rand(0, W),
          y: H * rand(0.2, 0.8),
          vx: rand(6, 14),
          vy: rand(-4, 4),
          r: rand(1, 4),
        });
      }
    }

    if (key === "flame") {
      for (let i = 0; i < 420 * zoom; i++) {
        const angle = rand(0, Math.PI * 2);
        put({
          k: "fire",
          x: W / 2 + Math.cos(angle) * rand(40, W * 0.45),
          y: H * 0.9,
          vx: rand(-1, 1),
          vy: rand(-9, -4),
          r: rand(10, 40),
          swirl: rand(-0.05, 0.05),
        });
      }
    }

    if (key === "insect") {
      for (let i = 0; i < 70 * zoom; i++) {
        const angle = rand(0, Math.PI * 2);
        put({
          k: "fly",
          x: W / 2,
          y: H / 2,
          vx: Math.cos(angle) * rand(2, 7),
          vy: Math.sin(angle) * rand(2, 7),
          r: rand(8, 20),
          ph: rand(0, 6),
        });
      }
    }

    if (key === "mist") {
      for (let i = 0; i < 40 * zoom; i++) {
        put({
          k: "blob",
          x: rand(0, W),
          y: rand(0, H),
          vx: rand(-1.5, 1.5),
          vy: rand(-0.6, 0.6),
          r: rand(60, 220),
        });
      }
    }

    if (key === "sound") {
      for (let i = 0; i < 9; i++) {
        put({
          k: "ring",
          x: rand(W * 0.15, W * 0.85),
          y: rand(H * 0.2, H * 0.8),
          r: 0,
          vr: rand(9, 16),
          delay: i * 0.12,
          max: 1.4,
        });
      }
      for (let i = 0; i < 240 * zoom; i++) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(4, 16);
        put({
          k: "spark",
          x: W / 2,
          y: H / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: rand(1, 3),
        });
      }
    }

    if (key === "stone") {
      for (let i = 0; i < 80 * zoom; i++) {
        put({
          k: "rock",
          x: rand(0, W),
          y: H + 40,
          vx: rand(-3, 3),
          vy: rand(-26, -14),
          r: rand(8, 34),
          rot: rand(0, 6),
          vrot: rand(-0.2, 0.2),
          sides: Math.floor(rand(5, 8)),
        });
      }
    }

    if (key === "serpent") {
      for (let i = 0; i < 6; i++) {
        put({
          k: "snake",
          y: H * rand(0.15, 0.85),
          amp: rand(40, 120),
          ph: rand(0, 6),
          w: rand(10, 22),
          sp: rand(1, 1.6),
          max: 2,
        });
      }
    }

    if (key === "love") {
      for (let i = 0; i < 320 * zoom; i++) {
        put({
          k: "spiral",
          a: rand(0, Math.PI * 2),
          rad: rand(0, 30),
          va: rand(0.05, 0.12),
          vrad: rand(4, 9),
          r: rand(3, 9),
        });
      }
    }

    if (key === "wind") {
      for (let i = 0; i < 200 * zoom; i++) {
        put({
          k: "streak",
          x: rand(-W, 0),
          y: rand(0, H),
          vx: rand(30, 60),
          vy: rand(-14, -4),
          len: rand(60, 260),
          w: rand(1, 4),
        });
      }
    }

    put({ k: "cut", max: 0.6, col: "#ffffff" });
  };

  const heart = (x: number, y: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + r * 0.3);
    ctx.bezierCurveTo(x, y, x - r, y, x - r, y + r * 0.3);
    ctx.bezierCurveTo(x - r, y + r * 0.7, x, y + r, x, y + r * 1.2);
    ctx.bezierCurveTo(x, y + r, x + r, y + r * 0.7, x + r, y + r * 0.3);
    ctx.bezierCurveTo(x + r, y, x, y, x, y + r * 0.3);
    ctx.fill();
  };

  const step = (now: number) => {
    const elapsed = (now - startedAt) / 1000;
    const dt = 1 / 60;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation =
      style === "stone" || style === "serpent" ? "source-over" : "lighter";

    let alive = 0;

    for (const p of parts) {
      p.life += dt;

      if (p.delay && elapsed < p.delay) {
        alive++;
        continue;
      }

      const fade = Math.max(0, 1 - p.life / p.max);
      if (fade <= 0) continue;
      alive++;

      ctx.globalAlpha = Math.min(1, fade * 1.4);
      ctx.fillStyle = p.col;
      ctx.strokeStyle = p.col;

      switch (p.k) {
        case "ribbon":
        case "snake": {
          const progress = Math.min(1, p.life * p.sp);
          const wave = p.k === "snake" ? 0.012 : 0.006;
          ctx.lineWidth = p.w * fade;
          ctx.lineCap = "round";
          ctx.beginPath();
          for (let x = 0; x <= W * progress; x += 12) {
            const envelope =
              p.k === "snake" ? 1 : Math.sin((x / W) * Math.PI);
            const y =
              p.y + Math.sin(x * wave + p.ph + elapsed * 4) * p.amp * envelope;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          if (p.k === "snake") {
            ctx.setLineDash([18, 18]);
            ctx.strokeStyle = "#0b0a0c";
            ctx.lineWidth = p.w * fade * 0.5;
            ctx.stroke();
            ctx.setLineDash([]);
          }
          break;
        }

        case "drop":
          p.x += p.vx;
          p.y += p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "fire": {
          p.vx += p.swirl * 6;
          p.x += p.vx;
          p.y += p.vy;
          p.r *= 0.985;
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          gradient.addColorStop(0, p.col);
          gradient.addColorStop(1, "rgba(255,40,0,0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "fly": {
          p.x += p.vx + Math.sin(elapsed * 3 + p.ph) * 2;
          p.y += p.vy + Math.cos(elapsed * 2 + p.ph) * 1.5;
          const flap = Math.abs(Math.sin(elapsed * 18 + p.ph));
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.atan2(p.vy, p.vx) + 1.57);
          ctx.beginPath();
          ctx.ellipse(-p.r * 0.5 * flap, 0, p.r * 0.55 * flap + 1, p.r * 0.8, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(p.r * 0.5 * flap, 0, p.r * 0.55 * flap + 1, p.r * 0.8, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;
        }

        case "blob": {
          p.x += p.vx;
          p.y += p.vy;
          p.r *= 1.006;
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          gradient.addColorStop(0, "rgba(220,240,235,.35)");
          gradient.addColorStop(1, "rgba(220,240,235,0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "ring":
          p.r += p.vr;
          ctx.lineWidth = 6 * fade;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case "spark":
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97;
          p.vy *= 0.97;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "rock": {
          p.vy += 0.9;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vrot;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.beginPath();
          for (let side = 0; side < p.sides; side++) {
            const angle = (side / p.sides) * Math.PI * 2;
            const radius = p.r * (0.7 + (side % 2) * 0.3);
            if (side === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          break;
        }

        case "spiral": {
          p.a += p.va;
          p.rad += p.vrad;
          const x = W / 2 + Math.cos(p.a) * p.rad;
          const y = H / 2 + Math.sin(p.a) * p.rad * 0.8;
          if (Math.random() < 0.3) {
            heart(x, y, p.r);
          } else {
            ctx.beginPath();
            ctx.arc(x, y, p.r * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case "streak":
          p.x += p.vx;
          p.y += p.vy;
          ctx.lineWidth = p.w;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.len, p.y - (p.len * p.vy) / p.vx);
          ctx.stroke();
          break;

        case "cut": {
          const progress = Math.min(1, p.life / 0.18);
          ctx.globalCompositeOperation = "source-over";
          ctx.lineWidth = 10 * fade;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-50, H * 0.78);
          ctx.lineTo(-50 + (W + 100) * progress, H * 0.22);
          ctx.stroke();
          ctx.globalCompositeOperation =
            style === "stone" || style === "serpent" ? "source-over" : "lighter";
          break;
        }
      }
    }

    ctx.globalAlpha = 1;

    if (alive > 0 && elapsed < 3.2) {
      raf = requestAnimationFrame(step);
    } else {
      ctx.clearRect(0, 0, W, H);
      running = false;
    }
  };

  return {
    play(form: BreathingForm) {
      if (prefersReduced) return;
      style = form;
      spawn(form);
      startedAt = performance.now();

      if (!running) {
        running = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      running = false;
      parts = [];
      ctx.clearRect(0, 0, W, H);
      window.removeEventListener("resize", size);
    },
  };
}
