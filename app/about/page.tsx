import type { Metadata } from "next";

import { ArrowLink } from "@/components/ui/arrow-link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { Timeline } from "@/components/ui/timeline";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { resumeAvailable } from "@/lib/resume";

export const metadata: Metadata = {
  title: "About",
  description:
    "Daniel Dominic: a Bengaluru-based Senior Android Engineer with 7+ years of experience.",
};

export default function AboutPage() {
  return (
    <>
      <Container className="pt-28 md:pt-40">
        <Eyebrow>About</Eyebrow>
        <h1 className="text-display-xl mt-3 font-semibold text-fg">
          {site.name}
        </h1>
        <div className="text-body-lg mt-6 max-w-prose space-y-5 text-muted">
          {site.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>

      <Section
        id="principles"
        number="01"
        eyebrow="Principles"
        title="Engineering principles"
      >
        <ul className="stagger grid gap-4 md:grid-cols-2">
          {site.principles.map((principle) => (
            <li
              key={principle.title}
              data-pointer=""
              className="surface spotlight rounded-lg p-6"
            >
              <h3 className="text-heading font-semibold text-fg">
                {principle.title}
              </h3>
              <p className="mt-2 text-muted">{principle.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="experience" number="02" eyebrow="Career" title="Experience">
        <Timeline
          items={[...experience].reverse().map((role) => ({
            key: role.company,
            meta: role.period,
            title: `${role.title} · ${role.company}`,
            body: (
              <ul className="list-disc space-y-1 pl-5 marker:text-accent">
                {role.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ),
          }))}
        />
      </Section>

      <Section id="skills" number="03" eyebrow="Skills" title="Skills">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <li key={group.group} className="surface rounded-lg p-6">
              <h3 className="text-heading font-semibold text-fg">
                {group.group}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Tag>{skill}</Tag>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="education" number="04" eyebrow="Education" title="Education">
        <div className="surface max-w-xl rounded-lg p-6">
          <p className="text-heading font-display font-semibold text-fg">
            {education.degree}
          </p>
          <p className="mt-1 text-muted">
            <span>{education.school}</span> · {education.period} ·{" "}
            {education.grade}
          </p>
        </div>
      </Section>

      <Section id="links" number="05" eyebrow="Links" title="Elsewhere">
        <ul className="flex flex-col gap-1">
          <li>
            <ArrowLink href={site.contact.linkedin} external>
              LinkedIn
            </ArrowLink>
          </li>
          <li>
            <ArrowLink href={site.contact.github} external>
              GitHub
            </ArrowLink>
          </li>
          <li>
            <ArrowLink href={site.contact.starsList} external>
              Side Projects on GitHub
            </ArrowLink>
          </li>
          {resumeAvailable ? (
            <li>
              <ArrowLink href={site.resumePath} external>
                Resume (PDF)
              </ArrowLink>
            </li>
          ) : null}
          <li>
            <ArrowLink href="/contact">Get in touch</ArrowLink>
          </li>
        </ul>
      </Section>
    </>
  );
}
