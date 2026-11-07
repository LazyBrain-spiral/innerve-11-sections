import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0a0c",
        ink2: "#17131a",
        paper: "#efe8dc",
        paper2: "#e3d9c8",
        red: "#c8102e",
        red2: "#8e0a1f",
        gold: "#d6a640",
        green: "#1f6b4a",
        wis: "#9b7fd1",
        amber: "#ffb36b",
        rose: "#ff6a80",
        blood: "#ff2a48",
        card: "#f7f2e9",
        haori: "#fbf4e4",
        ember: "#f6bd33",
        flame: "#ea6a1c",
        crimson: "#b8122c",
        coat: "#2a1b16",
      },
      fontFamily: {
        display: ["Anton", "Impact", "Arial Narrow Bold", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
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
