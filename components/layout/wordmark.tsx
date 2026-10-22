import Link from "next/link";

/** The `daniel.` wordmark, linking home. */
export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="Daniel Dominic, home"
      className="inline-flex min-h-11 items-center rounded-sm font-display text-lg font-semibold tracking-tight text-fg"
    >
      daniel<span className="text-accent">.</span>
    </Link>
  );
}
