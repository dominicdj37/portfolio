import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Content width (1152 px) with the spec's gutters: 16 px, 24 px from sm, 32 px from lg. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}
