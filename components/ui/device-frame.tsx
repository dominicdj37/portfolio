import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** An Android device built in CSS: frame, status bar and a screen for children. */
export function DeviceFrame({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure
      aria-label={label}
      className={cn(
        "relative mx-auto aspect-[9/19] w-full max-w-[18rem] rounded-xl border border-line bg-surface p-2.5 shadow-[inset_0_1px_0_var(--highlight),0_30px_80px_-30px_color-mix(in_srgb,var(--accent-strong)_45%,transparent)]",
        className,
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-bg">
        <div
          data-status-bar=""
          aria-hidden="true"
          className="flex items-center justify-between px-5 pt-2.5 pb-1.5 font-mono text-[10px] text-muted"
        >
          <span>9:41</span>
          <span className="h-3.5 w-3.5 rounded-full bg-fg/80" />
          <span className="flex gap-1">
            <span className="h-2 w-3 rounded-[2px] bg-muted/70" />
            <span className="h-2 w-4 rounded-[2px] bg-muted/70" />
          </span>
        </div>
        <div className="relative flex-1">{children}</div>
      </div>
    </figure>
  );
}
