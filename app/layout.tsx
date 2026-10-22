import type { Metadata } from "next";

import { display, mono, sans } from "@/app/fonts";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SkipLink } from "@/components/layout/skip-link";
import { PointerTracker } from "@/components/motion/pointer-tracker";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { resumeAvailable } from "@/lib/resume";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
  // Site-wide until Phase 5 (Sprint 0 Q5): every page inherits it from here.
  robots: { index: false, follow: false },
};

// The shell lives here, not in each page: with cacheComponents, Next keeps
// recent routes mounted (hidden), so per-page headers would duplicate ids.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(display.variable, sans.variable, mono.variable)}
    >
      <body>
        <SkipLink />
        <Navbar resumeAvailable={resumeAvailable} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer resumeAvailable={resumeAvailable} />
        <PointerTracker />
      </body>
    </html>
  );
}
