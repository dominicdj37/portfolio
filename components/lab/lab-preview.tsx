import { PlaneGrid } from "@/components/lab/plane-grid";

// Plan §7: the experiments the Lab will hold (Phase 3).
const EXPERIMENTS = [
  "3D playground",
  "Android Architecture Explorer",
  "AI-augmented engineering workflow",
  "Compose UI playground",
];

/** What the Lab will contain, over the plane-grid visual: plain HTML and CSS. */
export function LabPreview() {
  return (
    <div className="surface relative overflow-hidden rounded-xl p-8 pb-40 md:p-12 md:pb-48">
      <PlaneGrid />
      <h2 className="text-heading relative font-semibold text-fg">
        Planned experiments
      </h2>
      <ul className="relative mt-5 grid gap-3 sm:grid-cols-2">
        {EXPERIMENTS.map((name, i) => (
          <li
            key={name}
            className="flex items-center gap-3 rounded-md border border-line bg-bg/70 px-4 py-3 text-fg"
          >
            <span className="text-label font-mono text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
