import { Marquee } from "@/components/ui/marquee";
import { marquee } from "@/data/skills";

/** A full-bleed strip of the technologies behind the work (M9). */
export function TechMarquee() {
  return (
    <div className="border-y border-line py-4">
      <Marquee items={marquee} label="Technologies I work with" />
    </div>
  );
}
