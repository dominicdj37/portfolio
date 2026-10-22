import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

/** The top of an inner page: eyebrow, h1 and an optional lead. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <Container className="pt-28 md:pt-40">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-display-xl mt-3 font-semibold text-fg">{title}</h1>
      {lead ? (
        <p className="text-body-lg mt-5 max-w-prose text-muted">{lead}</p>
      ) : null}
    </Container>
  );
}
