import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent/90",
  secondary:
    "border border-muted/60 text-fg hover:border-fg hover:bg-surface-raised",
  ghost: "text-fg hover:bg-surface-raised",
};

const BASE =
  "ripple inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 font-medium transition-colors duration-150";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Desktop-only pointer pull (needs the pointer island). */
  magnetic?: boolean;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
  download?: boolean;
};

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

/** A link when given `href`, otherwise a native button. */
export function Button(props: LinkProps | NativeButtonProps) {
  const { children, variant = "primary", className, magnetic, ...rest } = props;
  const shared = {
    className: cn(BASE, VARIANTS[variant], magnetic && "magnetic", className),
    "data-variant": variant,
    "data-target": "",
    ...(magnetic ? { "data-pointer": "", "data-magnetic": "" } : {}),
  };

  if (rest.href === undefined) {
    return (
      <button
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        {...shared}
      >
        {children}
      </button>
    );
  }

  const { href, external, download } = rest as Omit<
    LinkProps,
    keyof CommonProps
  >;
  if (external || download) {
    return (
      <a
        href={href}
        download={download || undefined}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : undefined)}
        {...shared}
      >
        {children}
        {external ? " " : null}
        {external ? <span className="sr-only">(opens in new tab)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} {...shared}>
      {children}
    </Link>
  );
}
