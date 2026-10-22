import { PlaneGrid } from "@/components/lab/plane-grid";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Section } from "@/components/ui/section";

export function LabTeaser() {
  return (
    <Section id="lab" number="04" eyebrow="Lab" title="Engineering Lab">
      <div className="surface relative overflow-hidden rounded-xl p-8 md:p-12">
        <PlaneGrid />
        <div className="relative max-w-xl">
          <p className="text-body-lg text-fg">
            Interactive experiments, coming soon.
          </p>
          <div className="mt-6">
            <ArrowLink href="/lab">Visit the Lab</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
