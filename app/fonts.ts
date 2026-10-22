import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

// Self-hosted at build time: no runtime request to Google, no font JS (Q4).
// Only the display face is preloaded; it carries the hero headline.
export const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: false,
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});
