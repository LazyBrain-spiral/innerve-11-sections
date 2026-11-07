/* Innerve 11 — hero artwork generators.
   Everything here is deterministic (seeded) so server and client render the
   same SVG. Shapes are returned as { d, c } pairs; `c` is a CSS class that
   carries the fill/stroke (see the .art-* rules in app/globals.css), so a far
   layer can recolour the same drawing by changing its parent class. */

export type Shape = { d: string; c: string };

/* mulberry32 */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
/* template tag that rounds every interpolated number */
const P = (s: TemplateStringsArray, ...v: number[]) =>
  s.reduce((a, str, i) => a + str + (i < v.length ? r1(v[i]) : ""), "");

const qPt = (p0: number[], c: number[], p1: number[], t: number) => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
};

/* ---------------------------------------------------------------- roofs */

interface RoofOpts {
  flare?: number; // how far the eave tips reach past the wall
  lift?: number; // how high the eave tips sweep up
  ridge?: number; // ridge length
  red?: boolean; // vermilion ridge line
  tiles?: boolean;
}

/* A concave irimoya-style roof: flat underside, eaves that flare and lift at
   the tips, slopes that are steep near the ridge and flatten toward the eave. */
export function roof(cx: number, y: number, w: number, h: number, o: RoofOpts = {}): Shape[] {
  const flare = o.flare ?? w * 0.09;
  const lift = o.lift ?? h * 0.34;
  const rw = o.ridge ?? w * 0.3;
  const th = Math.max(3.5, h * 0.17);
  const lx = cx - w / 2 - flare, rx = cx + w / 2 + flare, ty = y - lift, top = y - h;
  const tipL = [lx + 2, ty - th * 0.7], tipR = [rx - 2, ty - th * 0.7];
  const cL = [cx - w * 0.27, y - th - h * 0.1], cR = [cx + w * 0.27, y - th - h * 0.1];
  const rL = [cx - rw / 2, top], rR = [cx + rw / 2, top];
  const out: Shape[] = [];
  out.push({
    c: "art-roof",
    d:
      P`M${lx} ${ty} Q${cx - w / 2} ${y + th * 0.15} ${cx - w / 2 + w * 0.12} ${y} L${cx + w / 2 - w * 0.12} ${y} Q${cx + w / 2} ${y + th * 0.15} ${rx} ${ty} L${tipR[0]} ${tipR[1]} ` +
      P`Q${cR[0]} ${cR[1]} ${rR[0]} ${rR[1]} L${rR[0] + 3} ${top - 3.5} L${rR[0] - 2} ${top - 1} L${rL[0] + 2} ${top - 1} L${rL[0] - 3} ${top - 3.5} L${rL[0]} ${rL[1]} Q${cL[0]} ${cL[1]} ${tipL[0]} ${tipL[1]} Z`,
  });
  // tile lines: sampled down from the real slope curve to the eave
  if (o.tiles !== false) {
    let d = "";
    const eaveY = y - th * 0.45;
    for (let t = 0.22; t < 0.98; t += 0.11) {
      const a = qPt(tipL, cL, rL, t), b = qPt(tipR, cR, rR, t);
      if (a[1] < eaveY - 2) d += P`M${a[0]} ${a[1] + 1.5}L${a[0] + (cx - a[0]) * 0.04} ${eaveY}`;
      if (b[1] < eaveY - 2) d += P`M${b[0]} ${b[1] + 1.5}L${b[0] + (cx - b[0]) * 0.04} ${eaveY}`;
    }
    for (let x = rL[0] + 7; x < rR[0] - 4; x += 8) d += P`M${x} ${top + 2}L${x} ${eaveY}`;
    out.push({ c: "art-tile", d });
  }
  // the pale bargeboard line along the underside of the eave
  out.push({
    c: "art-eave",
    d: P`M${lx + 1} ${ty + 0.5} Q${cx - w / 2} ${y + th * 0.15} ${cx - w / 2 + w * 0.12} ${y + 0.4} L${cx + w / 2 - w * 0.12} ${y + 0.4} Q${cx + w / 2} ${y + th * 0.15} ${rx - 1} ${ty + 0.5}`,
  });
  if (o.red) {
    out.push({
      c: "art-ridge",
      d: P`M${rL[0] - 3} ${top - 2.5}L${rR[0] + 3} ${top - 2.5}M${tipL[0] + 1} ${tipL[1] - 1}Q${cL[0]} ${cL[1] - 2} ${rL[0] - 1} ${rL[1] - 1}M${tipR[0] - 1} ${tipR[1] - 1}Q${cR[0]} ${cR[1] - 2} ${rR[0] + 1} ${rR[1] - 1}`,
    });
  }
  return out;
}

/* a triangular chidori-hafu dormer gable sitting on a roof slope */
function chidori(cx: number, y: number, w: number, h: number): Shape[] {
  return [
    { c: "art-roof", d: P`M${cx - w / 2 - 4} ${y + 1} Q${cx - w * 0.18} ${y - h * 0.35} ${cx} ${y - h} Q${cx + w * 0.18} ${y - h * 0.35} ${cx + w / 2 + 4} ${y + 1} L${cx + w / 2 - 3} ${y + 3} L${cx - w / 2 + 3} ${y + 3} Z` },
    { c: "art-wall", d: P`M${cx - w / 2 + 7} ${y} Q${cx - w * 0.14} ${y - h * 0.36} ${cx} ${y - h + 7} Q${cx + w * 0.14} ${y - h * 0.36} ${cx + w / 2 - 7} ${y} Z` },
    { c: "art-line", d: P`M${cx} ${y - h + 9}L${cx} ${y - 1}M${cx - w * 0.22} ${y - h * 0.28}L${cx + w * 0.22} ${y - h * 0.28}` },
    { c: "art-gegyo", d: P`M${cx} ${y - h + 4}l3 4l-3 4l-3 -4z` },
  ];
}

/* a karahafu: the undulating cusped gable over an entrance */
function karahafu(cx: number, y: number, w: number, h: number): Shape[] {
  return [
    { c: "art-roof", d: P`M${cx - w / 2 - 5} ${y - 2} C${cx - w * 0.32} ${y - 2} ${cx - w * 0.28} ${y - h} ${cx} ${y - h} C${cx + w * 0.28} ${y - h} ${cx + w * 0.32} ${y - 2} ${cx + w / 2 + 5} ${y - 2} L${cx + w / 2} ${y + 2} L${cx - w / 2} ${y + 2} Z` },
    { c: "art-eave", d: P`M${cx - w / 2 + 2} ${y - 1} C${cx - w * 0.26} ${y - 2} ${cx - w * 0.22} ${y - h + 6} ${cx} ${y - h + 6} C${cx + w * 0.22} ${y - h + 6} ${cx + w * 0.26} ${y - 2} ${cx + w / 2 - 2} ${y - 1}` },
  ];
}

/* ---------------------------------------------------------------- walls */

function wall(cx: number, yb: number, w: number, h: number, rnd: () => number, litP = 0.22): Shape[] {
  const taper = Math.min(5, w * 0.025);
  const x0 = cx - w / 2, x1 = cx + w / 2, yt = yb - h;
  const out: Shape[] = [
    { c: "art-wall", d: P`M${x0 + taper} ${yt}L${x1 - taper} ${yt}L${x1} ${yb}L${x0} ${yb}Z` },
    // shaded right flank gives the tier volume
    { c: "art-wshade", d: P`M${x1 - w * 0.2} ${yt}L${x1 - taper} ${yt}L${x1} ${yb}L${x1 - w * 0.2 + 1} ${yb}Z` },
    // shadow cast by the eave above
    { c: "art-wshadow", d: P`M${x0 + taper} ${yt}L${x1 - taper} ${yt}L${x1 - taper * 0.8} ${yt + h * 0.2}Q${cx} ${yt + h * 0.12} ${x0 + taper * 0.8} ${yt + h * 0.24}Z` },
  ];
  // timber posts + sill line, drawn faint
  let posts = P`M${x0 + 1} ${yb - h * 0.16}L${x1 - 1} ${yb - h * 0.16}`;
  const step = 16 + rnd() * 6;
  for (let x = x0 + step * 0.7; x < x1 - 4; x += step) posts += P`M${x} ${yt + h * 0.2}L${x} ${yb - h * 0.16}`;
  out.push({ c: "art-post", d: posts });
  // windows
  const n = Math.max(1, Math.floor(w / 34));
  const ww = 7 + rnd() * 3, wh = Math.min(15, h * 0.3);
  const gap = w / (n + 1);
  const wy = yt + h * 0.38;
  let dark = "", lit = "", lat = "";
  for (let i = 1; i <= n; i++) {
    const x = x0 + gap * i - ww / 2 + (rnd() - 0.5) * 3;
    const isLit = rnd() < litP;
    const rect = P`M${x} ${wy}h${ww}v${wh}h${-ww}Z`;
    if (isLit) lit += rect;
    else dark += rect;
    lat += P`M${x + ww / 3} ${wy}v${wh}M${x + (2 * ww) / 3} ${wy}v${wh}`;
  }
  if (dark) out.push({ c: "art-win", d: dark });
  if (lit) out.push({ c: "art-lit", d: lit });
  out.push({ c: "art-lat", d: lat });
  return out;
}

/* ---------------------------------------------------------------- towers */

export interface Tier {
  w: number;
  wall: number;
  roof: number;
  flare?: number;
  gable?: "chidori" | "chidori-l" | "chidori-r" | "kara" | "twin";
  red?: boolean;
  lit?: number;
  shift?: number; // horizontal offset of this tier (keeps keeps from looking stacked on a ruler)
}

/* Stacks tiers bottom-up. Drawn top-down so each lower roof overlaps the foot
   of the wall above it, the way a real tenshu reads. */
export function tower(cx: number, baseY: number, tiers: Tier[], seed: number, opts: { finial?: boolean; rail?: boolean } = {}): Shape[] {
  const rnd = rng(seed);
  const placed: { t: Tier; y: number; x: number }[] = [];
  let y = baseY;
  tiers.forEach((t) => {
    const x = cx + (t.shift ?? 0);
    placed.push({ t, y, x });
    y = y - t.wall - t.roof * 0.42;
  });
  const out: Shape[][] = [];
  placed.forEach(({ t, y, x }, i) => {
    const s: Shape[] = [];
    s.push(...wall(x, y, t.w, t.wall, rnd, t.lit ?? 0.22));
    const ey = y - t.wall + 3;
    const top = i === placed.length - 1;
    if (top && opts.rail) {
      // mawari-en balcony on the top storey
      const rw = t.w + 14, ry = y - t.wall * 0.18;
      let d = P`M${x - rw / 2} ${ry}L${x + rw / 2} ${ry}M${x - rw / 2} ${ry + 5}L${x + rw / 2} ${ry + 5}`;
      for (let px = x - rw / 2; px <= x + rw / 2 + 0.1; px += rw / 9) d += P`M${px} ${ry}L${px} ${ry + 7}`;
      s.push({ c: "art-rail", d });
    }
    s.push(...roof(x, ey, t.w, t.roof, { flare: t.flare, red: t.red, ridge: top ? t.w * 0.42 : undefined }));
    const gw = t.w * 0.34, gh = t.roof * 0.95;
    if (t.gable === "chidori") s.push(...chidori(x, ey - t.roof * 0.2, gw, gh));
    if (t.gable === "chidori-l") s.push(...chidori(x - t.w * 0.24, ey - t.roof * 0.16, gw * 0.8, gh * 0.85));
    if (t.gable === "chidori-r") s.push(...chidori(x + t.w * 0.24, ey - t.roof * 0.16, gw * 0.8, gh * 0.85));
    if (t.gable === "twin") s.push(...chidori(x - t.w * 0.22, ey - t.roof * 0.16, gw * 0.7, gh * 0.8), ...chidori(x + t.w * 0.22, ey - t.roof * 0.16, gw * 0.7, gh * 0.8));
    if (t.gable === "kara") s.push(...karahafu(x, ey + 1, gw * 0.9, t.roof * 0.55));
    if (top && opts.finial) {
      const fy = ey - t.roof;
      const rw = t.w * 0.21;
      // shachihoko: two curled fish-tail finials
      s.push({ c: "art-roof", d: P`M${x - rw} ${fy - 2}c-2 -6 -1 -12 4 -15c-1 4 0 8 3 11zM${x + rw} ${fy - 2}c2 -6 1 -12 -4 -15c1 4 0 8 -3 11z` });
      s.push({ c: "art-gegyo", d: P`M${x - rw + 1} ${fy - 13}l1.6 1.6l-1.6 1.6l-1.6 -1.6zM${x + rw - 1} ${fy - 13}l1.6 1.6l-1.6 1.6l-1.6 -1.6z` });
    }
    out.push(s);
  });
  return out.reverse().flat();
}

/* ishigaki: battered stone base with concave flanks and irregular courses */
export function ishigaki(cx: number, yb: number, h: number, wb: number, wt: number, seed: number): Shape[] {
  const rnd = rng(seed);
  const yt = yb - h;
  const out: Shape[] = [
    { c: "art-stone", d: P`M${cx - wt / 2} ${yt}L${cx + wt / 2} ${yt}Q${cx + wt / 2 + 2} ${yb - h * 0.25} ${cx + wb / 2} ${yb}L${cx - wb / 2} ${yb}Q${cx - wt / 2 - 2} ${yb - h * 0.25} ${cx - wt / 2} ${yt}Z` },
  ];
  let d = "";
  const rows = Math.max(3, Math.round(h / 11));
  for (let r = 1; r < rows; r++) {
    const y = yt + (h * r) / rows + (rnd() - 0.5) * 2;
    const k = (y - yt) / h;
    const half = wt / 2 + (wb / 2 - wt / 2) * k * k;
    d += P`M${cx - half + 2} ${y}`;
    let x = cx - half + 2;
    while (x < cx + half - 6) {
      const seg = 9 + rnd() * 16;
      const nx = Math.min(cx + half - 2, x + seg);
      d += P`L${nx} ${y + (rnd() - 0.5) * 1.6}`;
      x = nx;
      if (x < cx + half - 6 && rnd() < 0.8) d += P`M${x} ${y - h / rows + 1}L${x + (rnd() - 0.5) * 2} ${y}`;
    }
  }
  out.push({ c: "art-stoneln", d });
  return out;
}

/* a covered bridge (watari-rōka) between two points, with hanging struts */
export function bridge(x1: number, y1: number, x2: number, y2: number, seed: number, strut = 26): Shape[] {
  const rnd = rng(seed);
  const wallH = 13, roofH = 9;
  const out: Shape[] = [];
  let posts = "";
  const n = Math.max(2, Math.round(Math.abs(x2 - x1) / 22));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    posts += P`M${x} ${y}L${x + (rnd() - 0.5) * 2} ${y + strut * (0.6 + rnd() * 0.6)}`;
  }
  out.push({ c: "art-strut", d: posts });
  out.push({ c: "art-wall", d: P`M${x1} ${y1}L${x2} ${y2}L${x2} ${y2 - wallH}L${x1} ${y1 - wallH}Z` });
  out.push({ c: "art-wshadow", d: P`M${x1} ${y1 - wallH}L${x2} ${y2 - wallH}L${x2} ${y2 - wallH + 4}L${x1} ${y1 - wallH + 4}Z` });
  let win = "";
  for (let i = 1; i < n * 2; i++) {
    const t = i / (n * 2);
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    win += P`M${x - 2.5} ${y - wallH + 5}h5v5h-5Z`;
  }
  out.push({ c: "art-win", d: win });
  out.push({ c: "art-roof", d: P`M${x1 - 8} ${y1 - wallH + 2}L${x2 + 8} ${y2 - wallH + 2}L${x2 + 2} ${y2 - wallH - roofH}L${x1 - 2} ${y1 - wallH - roofH}Z` });
  out.push({ c: "art-eave", d: P`M${x1 - 7} ${y1 - wallH + 2.6}L${x2 + 7} ${y2 - wallH + 2.6}` });
  return out;
}

/* Infinity-castle stairs hanging in the distance */
export function stairs(x: number, y: number, steps: number, run: number, rise: number, dir = 1): Shape[] {
  let d = P`M${x} ${y}`, rail = P`M${x} ${y - 14}`;
  for (let i = 0; i < steps; i++) d += P`h${run * dir}v${-rise}`;
  rail += P`l${steps * run * dir} ${-steps * rise}`;
  let posts = "";
  for (let i = 0; i <= steps; i += 2) posts += P`M${x + i * run * dir} ${y - i * rise}l0 -14`;
  return [{ c: "art-stair", d: d + P`l${8 * dir} 0l0 6l${-(steps * run + 8) * dir} ${steps * rise}z` }, { c: "art-strut", d: rail + posts }];
}

/* ---------------------------------------------------------------- clouds */

interface CloudOpts {
  curl?: "l" | "r" | "both" | "none";
  height?: number; // overall mound height
  thick?: number; // depth of the cloud body under the puffs
  flat?: boolean; // a long band (section edges) rather than a single mound
  seed: number;
}

export interface Cloud {
  shapes: Shape[];
  vb: string;
}

/* A hand-style ukiyo-e cloud. Puffs of very different sizes pile up along a
   rising-and-falling baseline (so the outline climbs into a mound instead of
   running along a ruler), each puff bulging wider than its base so neighbours
   pinch into cusps. Big puffs get a nested contour line, the body gets a few
   long flow lines, and the ends can finish in a spiral curl. */
export function cloud(x: number, y: number, len: number, o: CloudOpts): Cloud {
  const rnd = rng(o.seed);
  const H = o.height ?? 60, T = o.thick ?? 16;
  const phase = rnd() * 6;
  const env = (k: number) => {
    const kk = Math.min(1, Math.max(0, k));
    if (o.flat) return 0.45 + 0.3 * Math.sin(kk * 7.3 + phase) * Math.sin(kk * 2.1 + 1);
    const peak = 0.42;
    const m = kk < peak ? Math.sin((kk / peak) * Math.PI * 0.5) : Math.cos(((kk - peak) / (1 - peak)) * Math.PI * 0.5);
    return 0.12 + 0.88 * Math.pow(Math.max(0, m), 0.9) + 0.1 * Math.sin(kk * 11 + phase);
  };
  const humps: { x0: number; x1: number; h: number; by0: number; by1: number; big: boolean }[] = [];
  let cx = x, by = y - H * 0.5 * env(0);
  let prevBig = false;
  while (cx < x + len - 6) {
    // alternate loosely between big puffs and clusters of small ones
    const big: boolean = !prevBig && rnd() < 0.55;
    let wd = big ? H * (0.62 + rnd() * 0.5) : H * (0.24 + rnd() * 0.22);
    if (o.flat) wd *= 0.85;
    wd = Math.min(wd, x + len - cx);
    const k1 = (cx + wd - x) / len;
    const nby = y - H * 0.55 * env(k1) + (rnd() - 0.5) * H * 0.08;
    const h = wd * (big ? 0.4 + rnd() * 0.16 : 0.34 + rnd() * 0.14);
    humps.push({ x0: cx, x1: cx + wd, h, by0: by, by1: nby, big });
    cx += wd;
    by = nby;
    prevBig = big;
  }
  let minY = y;
  humps.forEach((p) => (minY = Math.min(minY, Math.min(p.by0, p.by1) - p.h * 0.95)));
  let minX = x, maxX = x + len;
  const last = humps[humps.length - 1];
  const endX = last.x1, endY = last.by1;
  let d = P`M${x} ${y}L${x} ${humps[0].by0}`;
  humps.forEach((p) => {
    const w = p.x1 - p.x0, top = Math.min(p.by0, p.by1);
    d += P`C${p.x0 - w * 0.32} ${top - p.h * 1.12} ${p.x1 + w * 0.32} ${top - p.h * 1.16} ${p.x1} ${p.by1}`;
  });
  d += P`L${endX} ${y}`;
  // underside: a slow wave back to the start
  const steps = Math.max(2, Math.round(len / 90));
  for (let i = steps - 1; i >= 0; i--) {
    const tx = x + (len * i) / steps;
    const mx = tx + len / steps / 2;
    d += P`Q${mx} ${y + T + (rnd() - 0.3) * T * 0.6} ${tx} ${y + T * (0.35 + rnd() * 0.3)}`;
  }
  d += "Z";
  const out: Shape[] = [{ c: "art-cloud", d }];
  // inner contour lines in roughly half the puffs
  let inner = "";
  humps.forEach((p) => {
    if (!p.big || rnd() < 0.2) return;
    const w = p.x1 - p.x0, base = Math.max(p.by0, p.by1), top = Math.min(p.by0, p.by1);
    // a nested contour hugging one side of the puff, open at the other
    if (rnd() < 0.5) inner += P`M${p.x0 + w * 0.1} ${base + p.h * 0.05}C${p.x0 - w * 0.12} ${top - p.h * 0.8} ${p.x1 + w * 0.05} ${top - p.h * 0.88} ${p.x1 - w * 0.12} ${top - p.h * 0.25}`;
    else inner += P`M${p.x1 - w * 0.08} ${base + p.h * 0.05}C${p.x1 + w * 0.1} ${top - p.h * 0.8} ${p.x0 - w * 0.05} ${top - p.h * 0.86} ${p.x0 + w * 0.14} ${top - p.h * 0.22}`;
  });
  // long flow lines through the body, offset and of unequal length
  for (let i = 0; i < (o.flat ? 2 : 3); i++) {
    const a = x + len * (0.05 + rnd() * 0.3), b = a + len * (0.3 + rnd() * 0.35);
    const ly = y - H * (0.06 + i * 0.12) + T * 0.2;
    inner += P`M${a} ${ly}Q${(a + b) / 2} ${ly - H * 0.08 * (rnd() + 0.3)} ${Math.min(b, x + len - 10)} ${ly + (rnd() - 0.5) * 6}`;
  }
  out.push({ c: "art-cloudin", d: inner });

  const spiral = (sx: number, sy: number, R: number, dir: 1 | -1) => {
    // fill the curl's disc, then draw a tightening spiral over it
    const cxs = sx + R * 0.95 * dir, cys = sy - R * 0.9;
    minX = Math.min(minX, cxs - R);
    maxX = Math.max(maxX, cxs + R);
    minY = Math.min(minY, cys - R);
    let fill = P`M${cxs + R} ${cys}`;
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 10) fill += P`L${cxs + Math.cos(a) * R} ${cys + Math.sin(a) * R}`;
    out.push({ c: "art-cloud", d: fill + "Z" });
    let s = P`M${sx} ${sy}`;
    const start = dir === 1 ? Math.PI * 0.75 : Math.PI * 0.25;
    for (let i = 0; i <= 44; i++) {
      const t = i / 44;
      const a = start + dir * t * Math.PI * 2.3;
      const r = R * (1 - t * 0.78);
      s += P`L${cxs + Math.cos(a) * r} ${cys + Math.sin(a) * r}`;
    }
    out.push({ c: "art-curl", d: s });
  };
  if (o.curl === "r" || o.curl === "both") spiral(endX - 2, endY - 2, Math.max(10, H * 0.24), 1);
  if (o.curl === "l" || o.curl === "both") spiral(x + 2, y - 2, Math.max(9, H * 0.2), -1);
  const pad = 4;
  const maxY = y + T * 1.25;
  return { shapes: out, vb: `${r1(minX - pad)} ${r1(minY - pad)} ${r1(maxX - minX + pad * 2)} ${r1(maxY - minY + pad * 2)}` };
}

/* ---------------------------------------------------------------- the scene */

/* Main castle cluster, viewBox 0 0 1000 800. A tall five-storey keep, a
   three-storey west tower on its own stone base, a squat east tower with a
   slender watch tower, a covered bridge and a low corridor tying them in. */
export const CASTLE_VB = "0 0 1000 800";
export const CASTLE: Shape[] = (() => {
  const s: Shape[] = [];
  // far side corridor first (behind everything)
  s.push(...bridge(640, 668, 790, 684, 31, 30));
  // west tower
  s.push(...ishigaki(206, 800, 58, 236, 196, 7));
  s.push(...tower(206, 742, [
    { w: 168, wall: 50, roof: 34, flare: 18, gable: "chidori-r" },
    { w: 126, wall: 42, roof: 30, flare: 14, lit: 0.4 },
    { w: 88, wall: 36, roof: 40, flare: 13, red: true, gable: "kara", shift: 3 },
  ], 13, { finial: true }));
  // covered bridge from the west tower up into the keep
  s.push(...bridge(272, 648, 370, 610, 17, 34));
  // east squat tower + watch tower
  s.push(...ishigaki(812, 800, 46, 214, 182, 9));
  s.push(...tower(812, 754, [
    { w: 160, wall: 46, roof: 36, flare: 20, gable: "kara", lit: 0.35 },
    { w: 104, wall: 40, roof: 42, flare: 15, gable: "chidori", shift: -4 },
  ], 21));
  s.push(...tower(934, 776, [
    { w: 46, wall: 86, roof: 24, flare: 9, lit: 0.6 },
    { w: 40, wall: 22, roof: 26, flare: 8, red: true },
  ], 23));
  // main keep
  s.push(...ishigaki(512, 800, 96, 392, 320, 3));
  s.push(...tower(512, 704, [
    { w: 300, wall: 62, roof: 42, flare: 28, gable: "twin", lit: 0.18 },
    { w: 246, wall: 54, roof: 40, flare: 24, gable: "kara", lit: 0.25, shift: -4 },
    { w: 200, wall: 52, roof: 38, flare: 21, gable: "chidori-l", lit: 0.3, shift: 2 },
    { w: 156, wall: 46, roof: 36, flare: 18, red: true, lit: 0.35, shift: -2 },
    { w: 116, wall: 44, roof: 50, flare: 18, red: true, lit: 0.5, gable: "chidori" },
  ], 5, { finial: true, rail: true }));
  // low gate house at the keep's foot
  s.push(...tower(388, 798, [{ w: 74, wall: 26, roof: 22, flare: 10, gable: "kara", lit: 0.5 }], 41));
  return s;
})();

/* Distant pavilions + hanging stairs, viewBox 0 0 1200 700, drawn pale. */
export const FAR_VB = "0 0 1200 700";
export const FAR = {
  stairs: [...stairs(120, 330, 9, 15, 11, 1), ...stairs(1110, 250, 8, 14, 12, -1), ...stairs(820, 470, 6, 16, 10, 1)],
  // a thin far pagoda on the left, floating on its own cloud
  pagoda: tower(150, 520, [
    { w: 82, wall: 28, roof: 22, flare: 12 },
    { w: 70, wall: 22, roof: 20, flare: 11, shift: 2 },
    { w: 58, wall: 20, roof: 18, flare: 10 },
    { w: 46, wall: 18, roof: 24, flare: 9, red: true },
  ], 61, { finial: true }),
  // a hall with a long low roof on the right
  hall: tower(1030, 460, [
    { w: 150, wall: 30, roof: 30, flare: 18, gable: "kara" },
    { w: 86, wall: 22, roof: 30, flare: 14 },
  ], 63),
  // a tiny pavilion high up, tied to the hall by a bridge
  tiny: [...tower(900, 210, [{ w: 54, wall: 18, roof: 22, flare: 9, red: true }], 65), ...bridge(944, 206, 1012, 228, 67, 20)],
};

/* the cloud islands the far pavilions rest on (far viewBox coordinates) */
export const ISLANDS = {
  pagoda: cloud(56, 548, 200, { seed: 101, height: 58, thick: 14, curl: "l" }).shapes,
  hall: cloud(930, 490, 220, { seed: 103, height: 56, thick: 12, curl: "r" }).shapes,
  tiny: cloud(858, 236, 168, { seed: 105, height: 36, thick: 9, curl: "r" }).shapes,
};

/* sky / foreground clouds: one per svg so each can drift alone */
export const CLOUDS = {
  backBand: cloud(0, 160, 900, { seed: 111, height: 120, thick: 30, curl: "r" }),
  frontL: cloud(0, 220, 600, { seed: 121, height: 118, thick: 40, curl: "r" }),
  frontR: cloud(0, 220, 660, { seed: 127, height: 112, thick: 40, curl: "l" }),
  sunBand: cloud(0, 90, 380, { seed: 131, height: 74, thick: 16, curl: "both" }),
  divider: cloud(0, 90, 1400, { seed: 141, height: 80, thick: 26, curl: "r", flat: true }),
};

/* blossom clusters for the corner branches: each anchor sprouts 2-4 flowers
   and the odd bud, sizes and turns varied */
export interface Blossom { x: number; y: number; s: number; r: number; tint: number; bud: boolean }
export function clusters(anchors: [number, number, number][], seed: number): Blossom[] {
  const rnd = rng(seed);
  const out: Blossom[] = [];
  anchors.forEach(([x, y, k]) => {
    const n = 2 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, dist = i === 0 ? 0 : 7 + rnd() * 9;
      out.push({ x: r1(x + Math.cos(a) * dist * k), y: r1(y + Math.sin(a) * dist * k), s: r1((0.75 + rnd() * 0.55) * k), r: Math.round(rnd() * 72), tint: Math.floor(rnd() * 3), bud: false });
    }
    if (rnd() < 0.7) {
      const a = rnd() * Math.PI * 2;
      out.push({ x: r1(x + Math.cos(a) * 17 * k), y: r1(y + Math.sin(a) * 17 * k), s: r1(k * (0.8 + rnd() * 0.4)), r: Math.round(rnd() * 360), tint: 2, bud: true });
    }
  });
  return out;
}

/* petal positions for the falling layer (deterministic) */
export const PETALS = (() => {
  const rnd = rng(777);
  return Array.from({ length: 22 }, (_, i) => ({
    left: r1(rnd() * 100),
    top: r1(rnd() * 92),
    size: r1(8 + rnd() * 9),
    dur: r1(10 + rnd() * 9),
    delay: r1(-rnd() * 18),
    dx: Math.round((rnd() - 0.3) * 160),
    rot: Math.round(240 + rnd() * 420),
    sway: r1(2.4 + rnd() * 2.2),
    tint: i % 3,
  }));
})();
