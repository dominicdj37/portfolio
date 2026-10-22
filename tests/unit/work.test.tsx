import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WorkFilter } from "@/components/work/work-filter";
import { filterCount, filters, projects } from "@/data/projects";

describe("/work filters", () => {
  // AC40
  it("matches at least one project with every filter", () => {
    for (const filter of filters) {
      expect(filterCount(filter.id), filter.label).toBeGreaterThan(0);
    }
    expect(filterCount("all")).toBe(projects.length);
  });

  // AC38 + AC40: native radios in a fieldset, counts in the labels.
  it("renders native radios in a fieldset with server-rendered counts", () => {
    render(<WorkFilter />);
    const group = screen.getByRole("group", { name: "Filter projects" });
    expect(group.tagName).toBe("FIELDSET");
    const radios = within(group).getAllByRole("radio");
    expect(radios).toHaveLength(filters.length);
    for (const filter of filters) {
      expect(
        within(group).getByRole("radio", {
          name: `${filter.label} (${filterCount(filter.id)})`,
        }),
      ).toBeTruthy();
    }
    // AC38: "All" is the default.
    expect(
      (within(group).getByRole("radio", { name: /^All/ }) as HTMLInputElement)
        .checked,
    ).toBe(true);
  });

  // AC38: cards carry their categories for the CSS-only filter.
  it("tags every card with its categories", () => {
    const { container } = render(<WorkFilter />);
    const cards = container.querySelectorAll("[data-categories]");
    expect(cards).toHaveLength(projects.length);
    for (const [i, project] of projects.entries()) {
      expect(cards[i]?.getAttribute("data-categories")).toBe(
        project.categories.join(" "),
      );
    }
  });
});
