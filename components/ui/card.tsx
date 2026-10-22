import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A surface with a hairline border and top highlight. `interactive` cards are
 * one link (a stretched link inside), never nested links; `spotlight` adds the
 * pointer glow on hover-capable devices.
 */
export function Card({
  children,
  interactive,
  spotlight,
  className,
  style,
  ...data
}: {
  children: ReactNode;
  interactive?: boolean;
  spotlight?: boolean;
  className?: string;
  style?: CSSProperties;
  [key: `data-${string}`]: string | undefined;
}) {
  return (
    <article
      {...data}
      data-interactive={interactive ? "true" : undefined}
      data-pointer={spotlight ? "" : undefined}
      style={style}
      className={cn(
        "surface relative rounded-lg p-6",
        spotlight && "spotlight",
        interactive &&
          "transition-[border-color,box-shadow] duration-200 has-[a:hover]:border-accent/60 has-[a:focus-visible]:border-accent",
        className,
      )}
    >
      {children}
    </article>
  );
}
