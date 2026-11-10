import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innerve 11 — Infinity Castle, Prizes, Testimonials, Sponsors",
  description:
    "Selected sections from the Innerve 11 hackathon site (Demon Slayer fan build): Infinity Castle, prize pool, testimonials, past sponsors and footer.",
  icons: { icon: [{ url: "/assets/logos/favicon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0a0c",
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;800&family=Shippori+Mincho+B1:wght@800&family=Yuji+Syuku&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* React hoists these link tags into <head>; kept identical to the static build */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONT_URL} rel="stylesheet" />
        {children}
      </body>
    </html>
  );
}
