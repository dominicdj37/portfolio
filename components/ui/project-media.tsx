import { ViewTransition } from "react";

import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";

/**
 * A project's cover. Today a designed typographic cover (Q8: no screenshots
 * until cleared); Phase 4 can host a per-project 3D model in this slot. The
 * shared view-transition name morphs it from card to case study (AC50).
 */
export function ProjectMedia({
  project,
  size = "card",
  className,
}: {
  project: Project;
  size?: "card" | "hero";
  className?: string;
}) {
  const name = `cover-${project.slug}`;
  return (
    <ViewTransition name={name} share="morph" default="none">
      <div
        aria-hidden="true"
        data-cover={project.slug}
        data-vt-name={name}
        className={cn(
          "relative isolate overflow-hidden rounded-md border border-line bg-surface-raised",
          size === "hero" ? "aspect-[16/7]" : "aspect-[16/9]",
          className,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(var(--grid-dot)_1px,transparent_1.5px)] [background-size:16px_16px]" />
        <div className="absolute -top-1/3 -right-1/4 h-[140%] w-3/4 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent-strong)_35%,transparent),transparent)] blur-2xl" />
        <div className="relative flex h-full flex-col justify-between p-5">
          <span className="text-label font-mono tracking-[0.08em] text-accent uppercase">
            {project.domain}
          </span>
          <span
            className={cn(
              "font-display leading-none font-semibold tracking-tight text-fg/90",
              size === "hero"
                ? "text-[clamp(2.5rem,6vw,5rem)]"
                : "text-[clamp(1.75rem,4vw,2.5rem)]",
            )}
          >
            {project.title}
          </span>
        </div>
      </div>
    </ViewTransition>
  );
}
