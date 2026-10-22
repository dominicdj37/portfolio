import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Wordmark } from "@/components/layout/wordmark";
import { site } from "@/data/site";

/** A floating glass pill; the glass fades in over the first 120 px of scroll (M6). */
export function Navbar({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="relative isolate mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-1 pr-1.5 pl-5">
        <span
          aria-hidden="true"
          data-nav-glass=""
          className="glass absolute inset-0 -z-10 rounded-full"
        />
        <Wordmark />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  data-nav=""
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-muted transition-colors duration-150 hover:text-fg aria-[current=page]:bg-surface-raised aria-[current=page]:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {resumeAvailable ? (
            <a
              href={site.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="ripple hidden min-h-11 items-center gap-2 rounded-full bg-accent px-4 font-medium text-on-accent md:inline-flex"
            >
              Resume{" "}
              <span className="text-label font-mono opacity-80">PDF</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          ) : null}
          <MobileNav resumeAvailable={resumeAvailable} />
        </div>
      </div>
    </header>
  );
}
