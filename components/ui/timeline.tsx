import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type TimelineItem = {
  key: string;
  title: ReactNode;
  meta: ReactNode;
  body?: ReactNode;
};

/**
 * An ordered list with a line that draws as it scrolls in (M4). `horizontal`
 * lays the stops out in a row from lg.
 */
export function Timeline({
  items,
  horizontal,
}: {
  items: TimelineItem[];
  horizontal?: boolean;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        data-timeline-line=""
        className={cn(
          "absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent/60",
          horizontal &&
            "lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left",
        )}
      />
      <ol
        className={cn(
          "stagger relative grid gap-8",
          horizontal && "lg:grid-cols-4 lg:gap-6",
        )}
      >
        {items.map((item) => (
          <li
            key={item.key}
            className={cn("relative pl-8", horizontal && "lg:pt-8 lg:pl-0")}
          >
            <span
              aria-hidden="true"
              className="absolute top-1 left-0 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg"
            />
            <p className="text-label font-mono tracking-[0.08em] text-muted uppercase">
              {item.meta}
            </p>
            <h3 className="text-heading mt-1 font-semibold text-fg">
              {item.title}
            </h3>
            {item.body ? (
              <div className="mt-2 text-muted">{item.body}</div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
