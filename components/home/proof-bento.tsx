import { Container } from "@/components/ui/container";
import { StatTile } from "@/components/ui/stat-tile";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

/** Four proof points: 2×2 on phones, one row with a wider first tile on desktop. */
export function ProofBento() {
  return (
    <section id="proof" aria-label="Proof points" className="pb-4">
      <Container>
        <ul className="stagger grid grid-cols-[repeat(auto-fit,minmax(8.25rem,1fr))] gap-3 md:grid-cols-5 md:gap-4">
          {site.proofPoints.map((point, i) => (
            <li
              key={point.display}
              className={cn(
                "surface spotlight rounded-lg p-5 md:p-6",
                i === 0 && "md:col-span-2",
              )}
              data-pointer=""
            >
              <StatTile
                count={point.count}
                display={point.display}
                label={point.label}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
