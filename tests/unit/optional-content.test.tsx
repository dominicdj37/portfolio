import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CaseStudy } from "@/components/case-study/case-study";
import { ProjectCard } from "@/components/ui/project-card";
import type { Project } from "@/data/projects";

// AC24: a project with every optional field missing still renders cleanly.
const bare: Project = {
  slug: "bare",
  title: "Bare project",
  angle: "One line",
  tags: ["One", "Two", "Three"],
  categories: ["android"],
  status: "prototype",
  links: {},
  caseStudy: {},
};

function visibleText(root: HTMLElement): string[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.trim();
    if (text) texts.push(text);
  }
  return texts;
}

describe("optional content", () => {
  it("renders a card with no links as an unlinked card, without broken links", () => {
    const { container } = render(<ProjectCard project={bare} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByRole("heading", { name: "Bare project" })).toBeTruthy();
    for (const text of visibleText(container)) {
      expect(text).not.toMatch(/undefined|null|TBD|coming soon/i);
    }
  });

  it("renders a case study with only its hero, and no empty sections or labels", () => {
    const { container } = render(<CaseStudy project={bare} next={undefined} />);
    expect(container.querySelectorAll("section")).toHaveLength(0);
    expect(container.querySelector("a[href='']")).toBeNull();
    for (const text of visibleText(container)) {
      expect(text).not.toMatch(/undefined|null|TBD|coming soon/i);
    }
    // No role/period line when neither exists.
    expect(container.querySelector("[data-meta]")).toBeNull();
  });
});
