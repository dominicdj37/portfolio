import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** A text link with an arrow that nudges on hover; `external` opens a new tab. */
export function ArrowLink({
  href,
  external,
  children,
  className,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const classes = cn(
    "group inline-flex min-h-11 items-center gap-1.5 font-medium text-accent underline-offset-4 hover:underline",
    className,
  );
  const arrow = (
    <span
      aria-hidden="true"
      className="transition-transform duration-150 group-hover:translate-x-0.5"
    >
      {external ? "↗" : "→"}
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        data-target=""
      >
        {children} {arrow}
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes} data-target="">
      {children}
      {arrow}
    </Link>
  );
}
