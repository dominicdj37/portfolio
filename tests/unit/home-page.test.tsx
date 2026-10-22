import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

const NAME = "Daniel Dominic";
const LINE = "Portfolio coming soon.";

describe("placeholder home page", () => {
  // AC1
  it("renders the name as the only top-level heading", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toBe(NAME);
  });

  // AC1
  it("puts the heading and the coming-soon line inside the main landmark", () => {
    render(<Home />);

    const main = screen.getByRole("main");
    expect(main.contains(screen.getByRole("heading", { level: 1 }))).toBe(true);
    expect(main.contains(screen.getByText(LINE))).toBe(true);
  });

  // AC8: no claims, so the page says exactly these two things and nothing else.
  it("shows only the name and the coming-soon line", () => {
    const { container } = render(<Home />);

    // Every text node, so text next to an element can't slip through.
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const texts: string[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim();
      if (text) texts.push(text);
    }
    expect(texts).toEqual([NAME, LINE]);
  });
});
