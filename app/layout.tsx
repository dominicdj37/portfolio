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

// Phones (below md) navigate without view transitions: with the sticky card
// stack (M3), WebKit hangs the navigation (Daniel, 2026-10-23). React checks
// for document.startViewTransition on every navigation, so hiding it before
// hydration is enough; it comes back if the viewport widens.
const NO_PHONE_VIEW_TRANSITIONS = `(function () {
  var d = document, start = d.startViewTransition;
  if (!start || !window.matchMedia) return;
  var phone = window.matchMedia("(max-width: 47.999rem)");
  function apply() {
    Object.defineProperty(d, "startViewTransition", {
      value: phone.matches ? undefined : start,
      configurable: true,
      writable: true,
    });
  }
  apply();
  phone.addEventListener("change", apply);
})();`;

// The shell lives here, not in each page: with cacheComponents, Next keeps
// recent routes mounted (hidden), so per-page headers would duplicate ids.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(display.variable, sans.variable, mono.variable)}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: NO_PHONE_VIEW_TRANSITIONS }}
        />
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
