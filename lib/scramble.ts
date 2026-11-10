/* Decode-in text: characters cycle through random glyphs, then lock into the
   real text left to right. Time-based by design (not scroll-scrubbed).
   The real text lives in `data-scramble` (falls back to textContent). The box
   is width-locked while it runs so neighbours never shift. Returns a cancel
   function that restores the final text immediately. */

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+/<>";

export function scramble(el: HTMLElement, { first = 0.6, last = 0.9, tick = 0.045 } = {}): () => void {
  const final = el.dataset.scramble ?? el.textContent ?? "";
  const chars = [...final];
  const n = chars.length;

  el.style.display = "inline-block";
  el.style.whiteSpace = "nowrap";
  el.style.width = `${el.offsetWidth}px`;

  const finish = () => {
    el.textContent = final;
    el.style.width = "";
  };

  let raf = 0;
  let lastStep = -1;
  const t0 = performance.now();
  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    const step = Math.floor(t / tick);
    if (step !== lastStep) {
      lastStep = step;
      let out = "";
      let done = true;
      for (let i = 0; i < n; i++) {
        const c = chars[i];
        // first char locks at `first`s, last char at `last`s
        const lockAt = first + (last - first) * (n > 1 ? i / (n - 1) : 1);
        if (c === " " || t >= lockAt) out += c;
        else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          done = false;
        }
      }
      if (done) return finish();
      el.textContent = out;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    finish();
  };
}
