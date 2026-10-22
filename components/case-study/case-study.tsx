import Link from "next/link";
import type { ReactNode } from "react";

import { TocSpy } from "@/components/case-study/toc-spy";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectMedia } from "@/components/ui/project-media";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/data/projects";

/** Plan §6 order; each id is a table-of-contents anchor. */
export const SECTION_ORDER = [
  "context",
  "ownership",
  "challenge",
  "architecture",
  "implementation",
  "trade-offs",
  "outcome",
  "learned",
  "links",
] as const;

type SectionId = (typeof SECTION_ORDER)[number];

const TITLES: Record<SectionId, string> = {
  context: "Context",
  ownership: "My ownership",
  challenge: "Engineering challenge",
  architecture: "Architecture",
  implementation: "Implementation",
  "trade-offs": "Trade-offs",
  outcome: "Outcome",
  learned: "What I learned",
  links: "Links",
};

function paragraph(text?: string): ReactNode {
  return text ? <p>{text}</p> : null;
}

function bullets(items?: string[]): ReactNode {
  return items && items.length > 0 ? (
    <ul className="list-disc space-y-2 pl-5 marker:text-accent">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : null;
}

function links(project: Project): ReactNode {
  const { playStore, demoVideo, showcase } = project.links;
  const items = [
    playStore && { label: "Google Play", href: playStore },
    demoVideo && { label: "Demo video", href: demoVideo },
    showcase && { label: "Product showcase", href: showcase },
  ].filter((item): item is { label: string; href: string } => Boolean(item));
  return items.length > 0 ? (
    <ul className="flex flex-wrap gap-x-6">
      {items.map((item) => (
        <li key={item.href}>
          <ArrowLink href={item.href} external>
            {item.label}
          </ArrowLink>
        </li>
      ))}
    </ul>
  ) : null;
}

function TableOfContents({ ids }: { ids: SectionId[] }) {
  return (
    <nav aria-label="On this page">
      <ul className="flex flex-col gap-0.5">
        {ids.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="flex min-h-11 items-center border-l-2 border-line pl-3 text-muted transition-colors duration-150 hover:text-fg aria-[current=true]:border-accent aria-[current=true]:text-fg"
            >
              {TITLES[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * The case-study template (plan §6). Renders only fields with content: empty
 * sections, the TOC and the meta line disappear rather than show filler.
 */
export function CaseStudy({
  project,
  next,
}: {
  project: Project;
  next: Project | undefined;
}) {
  const { caseStudy } = project;
  const bodies: Record<SectionId, ReactNode> = {
    context: paragraph(caseStudy.context),
    ownership: bullets(caseStudy.ownership),
    challenge: paragraph(caseStudy.challenge),
    architecture: paragraph(caseStudy.architecture),
    implementation: paragraph(caseStudy.implementation),
    "trade-offs": paragraph(caseStudy.tradeOffs),
    outcome: bullets(caseStudy.outcome),
    learned: paragraph(caseStudy.learned),
    links: links(project),
  };
  const ids = SECTION_ORDER.filter((id) => bodies[id] !== null);
  const meta = [project.role, project.period].filter(Boolean).join(" · ");

  return (
    <article>
      <div
        data-reading-progress=""
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      />
      <Container className="pt-28 md:pt-36">
        <div className="max-w-4xl">
          {project.domain ? <Eyebrow>{project.domain}</Eyebrow> : null}
          <h1 className="text-display-xl mt-3 font-semibold text-fg">
            {project.title}
          </h1>
          {caseStudy.title ? (
            <p className="text-display-lg mt-2 font-display text-muted">
              {caseStudy.title}
            </p>
          ) : null}
          {caseStudy.summary ? (
            <p className="text-body-lg mt-5 max-w-prose text-fg">
              {caseStudy.summary}
            </p>
          ) : null}
          {meta ? (
            <p data-meta="" className="mt-5 text-muted">
              {meta}
            </p>
          ) : null}
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            <li>
              <Tag status={project.status}>
                {project.status === "live" ? "Live on Play Store" : "Prototype"}
              </Tag>
            </li>
            {project.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </div>
        <ProjectMedia project={project} size="hero" className="mt-10" />

        {ids.length > 0 ? (
          <div className="mt-14 grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <div data-toc="desktop" className="sticky top-28">
                <TableOfContents ids={ids} />
                <TocSpy />
              </div>
            </aside>
            <div className="min-w-0">
              <details
                data-toc="mobile"
                className="surface rounded-md px-4 py-1 lg:hidden"
              >
                <summary className="flex min-h-11 cursor-pointer items-center font-medium text-fg">
                  On this page
                </summary>
                <div className="pb-3">
                  <TableOfContents ids={ids} />
                </div>
              </details>
              <div className="mt-10 flex max-w-prose flex-col gap-14 lg:mt-0">
                {ids.map((id) => (
                  <section key={id} id={id} aria-labelledby={`${id}-title`}>
                    <h2
                      id={`${id}-title`}
                      className="text-display-lg font-semibold text-fg"
                    >
                      {TITLES[id]}
                    </h2>
                    <div className="text-body-lg mt-4 space-y-4 text-muted">
                      {bodies[id]}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {next ? (
          <div className="mt-24 border-t border-line pt-10">
            <Link
              href={`/work/${next.slug}`}
              className="group inline-flex min-h-11 flex-col gap-1"
            >
              <span className="text-label font-mono tracking-[0.08em] text-muted uppercase">
                Next project
              </span>
              <span className="text-display-lg font-display font-semibold text-fg group-hover:text-accent">
                {next.title} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
