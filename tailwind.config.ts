import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17120e",
        ink2: "#221a15",
        night: "#0b0908",
        band: "#b83d34",
        paper: "#f2ebe3",
        paper2: "#e8ddd0",
        red: "#dc4f45",
        red2: "#a8392f",
        gold: "#d6a640",
        green: "#1f6b4a",
        wis: "#9b7fd1",
        amber: "#ffb36b",
        rose: "#ff6a80",
        blood: "#ff2a48",
        card: "#f7f1e8",
        glow: "#ff6a4d",
        blossom: "#f2b8b2",
      },
      fontFamily: {
        display: ["Anton", "Impact", "Arial Narrow Bold", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        kanji: ["Shippori Mincho B1", "Hiragino Mincho ProN", "serif"],
        brush: ["Yuji Syuku", "Shippori Mincho B1", "serif"],
      },
      spacing: {
        gut: "clamp(16px, 4vw, 56px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
