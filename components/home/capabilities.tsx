import { ArrowLink } from "@/components/ui/arrow-link";
import { Section } from "@/components/ui/section";
import { hasCaseStudy, projects } from "@/data/projects";
import { capabilities } from "@/data/skills";

/** Six capability groups (plan §5.4), each with one line of evidence. */
export function Capabilities() {
  const linked = new Set(projects.filter(hasCaseStudy).map((p) => p.slug));

  return (
    <Section
      id="capabilities"
      number="02"
      eyebrow="Capabilities"
      title="Engineering capabilities"
    >
      <ul className="stagger grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => (
          <li
            key={capability.title}
            data-pointer=""
            className="surface spotlight flex flex-col gap-3 rounded-lg p-6"
          >
            <h3 className="text-heading font-semibold text-fg">
              {capability.title}
            </h3>
            <p className="text-muted">{capability.skills}</p>
            <p className="mt-auto border-t border-line pt-3 text-sm text-fg">
              {linked.has(capability.evidence.slug) ? (
                <ArrowLink
                  href={`/work/${capability.evidence.slug}`}
                  className="text-sm"
                >
                  {capability.evidence.text}
                </ArrowLink>
              ) : (
                capability.evidence.text
              )}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
