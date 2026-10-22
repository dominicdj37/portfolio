import { ArrowLink } from "@/components/ui/arrow-link";
import { Section } from "@/components/ui/section";
import { Timeline } from "@/components/ui/timeline";
import { experience } from "@/data/experience";
import { site } from "@/data/site";

/** Four stops, Seven Seas → CASABOT: vertical on phones, a row from lg. */
export function CareerSnapshot() {
  return (
    <Section
      id="career"
      number="03"
      eyebrow="Career"
      title={site.careerHeadline}
    >
      <Timeline
        horizontal
        items={experience.map((role) => ({
          key: role.company,
          meta: role.period,
          title: role.company,
          body: (
            <p>
              {role.title} — {role.angle}
            </p>
          ),
        }))}
      />
      <div className="mt-10">
        <ArrowLink href="/about">More about me</ArrowLink>
      </div>
    </Section>
  );
}
