import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

/**
 * A big value and its label. With `count`, the number counts up in CSS (M7);
 * the animated digits are decoration and the real value is the text (Q15).
 */
export function StatTile({
  count,
  display,
  label,
  className,
}: {
  count?: number;
  display: string;
  label: string;
  className?: string;
}) {
  const suffix =
    count !== undefined && display.startsWith(String(count))
      ? display.slice(String(count).length)
      : undefined;

  return (
    <div
      className={cn("flex h-full flex-col justify-between gap-6", className)}
    >
      <p className="text-display-xl font-display font-semibold text-fg">
        {suffix !== undefined ? (
          <>
            <span className="sr-only">{display}</span>
            <span
              aria-hidden="true"
              className="count-up tabular-nums"
              style={{ "--n": count } as CSSProperties}
            />
            <span aria-hidden="true">{suffix}</span>
          </>
        ) : (
          display
        )}
      </p>
      <p className="text-muted">{label}</p>
    </div>
  );
}
