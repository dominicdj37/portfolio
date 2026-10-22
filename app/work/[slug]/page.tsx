import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/case-study/case-study";
import { hasCaseStudy, projects, type Project } from "@/data/projects";

// Unlisted slugs wait for the full render instead of streaming the app shell,
// so notFound() can still answer 404 (AC41; dynamicParams is unavailable
// with cacheComponents).
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

function find(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The next project that has a case study, wrapping around. */
function nextCaseStudy(project: Project): Project | undefined {
  const start = projects.indexOf(project);
  for (let step = 1; step < projects.length; step++) {
    const candidate = projects[(start + step) % projects.length];
    if (candidate && hasCaseStudy(candidate)) return candidate;
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = find((await params).slug);
  if (!project) return {};
  return {
    title: project.caseStudy.title
      ? `${project.title}: ${project.caseStudy.title}`
      : project.title,
    description:
      project.caseStudy.summary ?? project.caseStudy.context ?? project.angle,
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const project = find((await params).slug);
  if (!project) notFound();

  return <CaseStudy project={project} next={nextCaseStudy(project)} />;
}
