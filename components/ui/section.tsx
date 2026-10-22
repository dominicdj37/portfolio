import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

/** A page section: a region named by its title, with a numbered mono eyebrow. */
export function Section({
  id,
  number,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  number?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("py-20 md:py-32", className)}
    >
      <Container>
        <div className="reveal max-w-3xl">
          <Eyebrow>{number ? `${number} · ${eyebrow}` : eyebrow}</Eyebrow>
          <h2
            id={titleId}
            className="text-display-lg mt-3 font-semibold text-fg"
          >
            {title}
          </h2>
          {intro ? (
            <p className="text-body-lg mt-4 max-w-prose text-muted">{intro}</p>
          ) : null}
        </div>
        {children ? <div className="mt-10 md:mt-14">{children}</div> : null}
      </Container>
    </section>
  );
}
