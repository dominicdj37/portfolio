import { ProjectCard } from "@/components/ui/project-card";
import { filterCount, filters, projects } from "@/data/projects";

/**
 * Filter chips as native radios; CSS (:has) hides non-matching cards, so it
 * needs no JavaScript (AC38). Counts are server-rendered into the labels (Q16).
 */
export function WorkFilter() {
  return (
    <div data-work-filter="">
      <fieldset className="min-w-0">
        <legend className="text-label font-mono tracking-[0.08em] text-muted uppercase">
          Filter projects
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <label
              key={filter.id}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-muted transition-colors duration-150 has-checked:border-accent has-checked:bg-accent has-checked:text-on-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent hover:text-fg has-checked:hover:text-on-accent"
            >
              <input
                type="radio"
                name="filter"
                value={filter.id}
                id={`filter-${filter.id}`}
                defaultChecked={filter.id === "all"}
                className="sr-only"
              />
              {filter.label} ({filterCount(filter.id)})
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} headingLevel={2} />
        ))}
      </div>
    </div>
  );
}
