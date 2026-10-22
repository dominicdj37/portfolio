import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const STATUS = {
  // No tinted fill: the text keeps its full contrast on any surface.
  live: "border-success/50 text-success",
  prototype: "border-accent/50 text-accent",
};

/** A mono chip for a technology, or a project status. */
export function Tag({
  children,
  status,
}: {
  children: ReactNode;
  status?: keyof typeof STATUS;
}) {
  return (
    <span
      data-status={status}
      className={cn(
        "text-label inline-flex items-center rounded-sm border px-2.5 py-1 font-mono tracking-normal",
        status ? STATUS[status] : "border-line text-muted",
      )}
    >
      {children}
    </span>
  );
}
