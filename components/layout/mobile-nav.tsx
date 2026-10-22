import Link from "next/link";

import { NavState } from "@/components/layout/nav-state";
import { Wordmark } from "@/components/layout/wordmark";
import { site } from "@/data/site";

const SHEET_ID = "site-menu";

/**
 * Below md: a "Menu" button and a full-screen sheet on the Popover API, so it
 * opens, closes on Esc and returns focus with no JavaScript (AC11).
 */
export function MobileNav({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <>
      <button
        type="button"
        popoverTarget={SHEET_ID}
        className="ripple inline-flex min-h-11 items-center rounded-full border border-line px-4 font-medium text-fg md:hidden"
      >
        Menu
      </button>
      <div id={SHEET_ID} popover="auto" className="sheet md:hidden">
        <div className="flex h-full flex-col px-4 pt-3 pb-8">
          <div className="flex items-center justify-between pl-3">
            <Wordmark />
            <button
              type="button"
              popoverTarget={SHEET_ID}
              popoverTargetAction="hide"
              className="inline-flex min-h-11 items-center rounded-full border border-line px-4 font-medium text-fg"
            >
              Close
            </button>
          </div>
          <nav aria-label="Menu" className="mt-10 px-3">
            <ul className="flex flex-col gap-1">
              {site.nav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    data-nav=""
                    className="text-display-xl flex min-h-14 items-center font-display font-semibold text-fg aria-[current=page]:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="mt-auto flex flex-wrap gap-2 px-3">
            {resumeAvailable ? (
              <li>
                <a
                  href={site.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-fg"
                >
                  Resume{" "}
                  <span className="text-label font-mono text-muted">PDF</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={site.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-fg"
              >
                LinkedIn<span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={site.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-fg"
              >
                GitHub<span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <NavState menuId={SHEET_ID} />
    </>
  );
}
