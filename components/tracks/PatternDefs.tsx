/**
 * SVG patterns for the nine breathing styles. Ported from the original
 * index.html defs so the character art keeps its Demon Slayer textile motif.
 */
export default function PatternDefs() {
  return (
    <svg className="pattern-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g-insect" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#b9a3e3" />
          <stop offset=".55" stopColor="#6fc3c0" />
          <stop offset="1" stopColor="#2b2140" />
        </linearGradient>

        {/* Insect — butterfly wing */}
        <pattern id="p-insect" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="url(#g-insect)" />
          <path
            d="M0 120 L60 0 M30 120 L90 0 M60 120 L120 0 M0 60 Q60 40 120 60"
            stroke="#120c1c"
            strokeWidth="2"
            fill="none"
            opacity=".7"
          />
        </pattern>

        {/* Mist */}
        <pattern id="p-mist" width="80" height="40" patternUnits="userSpaceOnUse">
          <rect width="80" height="40" fill="#cfe7e1" />
          <path
            d="M0 40 a20 20 0 0 1 40 0 a20 20 0 0 1 40 0 M10 40 a10 10 0 0 1 20 0 M50 40 a10 10 0 0 1 20 0 M-20 20 a20 20 0 0 1 40 0 M20 20 a20 20 0 0 1 40 0 M60 20 a20 20 0 0 1 40 0"
            stroke="#5f8f86"
            strokeWidth="2"
            fill="none"
          />
        </pattern>

        {/* Flame */}
        <pattern id="p-flame" width="60" height="90" patternUnits="userSpaceOnUse">
          <rect width="60" height="90" fill="#f5c542" />
          <path
            d="M0 90 C10 60 0 40 15 15 C18 40 30 45 30 20 C40 45 55 50 45 0 C70 30 62 70 60 90 Z"
            fill="#e2401c"
          />
          <path
            d="M12 90 C18 70 14 55 22 45 C26 62 36 60 36 48 C46 62 50 78 46 90 Z"
            fill="#f08a1f"
          />
        </pattern>

        {/* Sound — gems */}
        <pattern id="p-sound" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#14111a" />
          <path d="M20 4 L34 20 L20 36 L6 20 Z" fill="none" stroke="#d6a640" strokeWidth="2" />
          <circle cx="20" cy="20" r="4" fill="#d6a640" />
        </pattern>

        {/* Stone */}
        <pattern id="p-stone" width="80" height="40" patternUnits="userSpaceOnUse">
          <rect width="80" height="40" fill="#5b5148" />
          <path
            d="M0 0 H80 M0 20 H80 M20 0 V20 M60 0 V20 M0 20 V40 M40 20 V40 M80 20 V40"
            stroke="#2c2621"
            strokeWidth="3"
          />
        </pattern>

        {/* Serpent — stripes */}
        <pattern
          id="p-serpent"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(90)"
        >
          <rect width="28" height="28" fill="#efe8dc" />
          <rect width="14" height="28" fill="#0b0a0c" />
        </pattern>

        {/* Love — shippō interlocking circles */}
        <pattern id="p-love" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#f2a9c4" />
          <g fill="none" stroke="#3f8f5a" strokeWidth="2.5">
            <circle cx="0" cy="0" r="20" />
            <circle cx="40" cy="0" r="20" />
            <circle cx="0" cy="40" r="20" />
            <circle cx="40" cy="40" r="20" />
            <circle cx="20" cy="20" r="20" />
          </g>
        </pattern>

        {/* Wind */}
        <pattern id="p-wind" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#e9efe9" />
          <path
            d="M-5 50 Q20 30 65 10 M-5 30 Q15 18 40 8 M20 62 Q40 48 65 40"
            stroke="#2f6b3c"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </pattern>

        {/* Water — Giyu half & half (kikkō hex) */}
        <pattern id="p-hex" width="34" height="58.9" patternUnits="userSpaceOnUse">
          <rect width="34" height="58.9" fill="#d6b53a" />
          <path
            d="M17 0 L34 9.8 L34 29.4 L17 39.3 L0 29.4 L0 9.8 Z M17 39.3 V58.9 M0 29.4 L0 49 M34 29.4 V49"
            fill="#2c6e49"
            stroke="#1d2b26"
            strokeWidth="2"
          />
        </pattern>
      </defs>
    </svg>
  );
}
