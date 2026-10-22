import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** A logcat-style mono label, e.g. "01 · WORK". */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-label font-mono font-medium tracking-[0.08em] text-accent uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
