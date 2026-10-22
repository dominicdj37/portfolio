import type { CSSProperties } from "react";

import { ArrowLink } from "@/components/ui/arrow-link";
import { ProjectCard } from "@/components/ui/project-card";
import { Section } from "@/components/ui/section";
import { projects } from "@/data/projects";

/** Four project cards: a sticky stack on phones (M3), a 2×2 grid from md. */
export function FeaturedWork() {
  return (
    <Section id="work" number="01" eyebrow="Work" title="Featured work">
      <div
        data-stack=""
        style={{ "--count": projects.length } as CSSProperties}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            style={{ "--i": i } as CSSProperties}
          />
        ))}
      </div>
      <div className="mt-8">
        <ArrowLink href="/work">All projects</ArrowLink>
      </div>
    </Section>
  );
}
