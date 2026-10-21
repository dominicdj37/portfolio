import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("home page stub", () => {
  it("renders the name as the only top-level heading", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]?.textContent).toBe("Proof of red");
  });

  it("wraps the content in a main landmark", () => {
    render(<Home />);

    expect(screen.getByRole("main")).toBeDefined();
  });
});
