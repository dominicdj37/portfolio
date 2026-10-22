import Link from "next/link";
import type { CSSProperties } from "react";

import { Card } from "@/components/ui/card";
import { ProjectMedia } from "@/components/ui/project-media";
import { Tag } from "@/components/ui/tag";
import { projectHref, type Project } from "@/data/projects";

/**
 * One project: cover, title, angle, tags and status. The whole card is a
 * single link (stretched from the title), to the case study or, with none
 * yet, to the project's demo (Q11).
 */
export function ProjectCard({
  project,
  headingLevel = 3,
  style,
}: {
  project: Project;
  headingLevel?: 2 | 3;
  style?: CSSProperties;
}) {
  const target = projectHref(project);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const stretched =
    "after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none";
  const descriptionId = `${project.slug}-new-tab`;

  return (
    <Card
      interactive={Boolean(target)}
      spotlight
      style={style}
      className="flex h-full flex-col gap-5 bg-surface p-4 sm:p-5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent"
      data-categories={project.categories.join(" ")}
    >
      <ProjectMedia project={project} />
      <div className="flex flex-1 flex-col gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <Tag status={project.status}>
            {project.status === "live" ? "Live on Play Store" : "Prototype"}
          </Tag>
        </div>
        <Heading className="text-heading font-semibold text-fg">
          {target ? (
            target.external ? (
              <a
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby={descriptionId}
                className={stretched}
              >
                {project.title}
              </a>
            ) : (
              <Link href={target.href} className={stretched}>
                {project.title}
              </Link>
            )
          ) : (
            project.title
          )}
        </Heading>
        {target?.external ? (
          <span id={descriptionId} className="sr-only">
            Opens the demo video in a new tab
          </span>
        ) : null}
        <p className="text-muted">{project.angle}</p>
        <ul
          className="mt-auto flex flex-wrap gap-2 pt-2"
          aria-label="Technologies"
        >
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
