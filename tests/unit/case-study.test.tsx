import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { generateStaticParams } from "@/app/work/[slug]/page";
import { CaseStudy, SECTION_ORDER } from "@/components/case-study/case-study";
import { projects, type Project } from "@/data/projects";

const full: Project = {
  slug: "full",
  title: "Full project",
  angle: "Angle",
  tags: ["One", "Two", "Three"],
  categories: ["android"],
  status: "live",
  domain: "Domain",
  role: "Role",
  period: "2020–2021",
  links: { playStore: "https://play.google.com/store/apps/details?id=x" },
  caseStudy: {
    title: "A full case study",
    summary: "Summary",
    context: "Context text",
    ownership: ["Owned A"],
    challenge: "Challenge text",
    architecture: "Architecture text",
    implementation: "Implementation text",
    tradeOffs: "Trade-off text",
    outcome: ["Outcome A"],
    learned: "Learned text",
  },
};

describe("case-study routes", () => {
  // AC41
  it("statically generates exactly the four slugs", async () => {
    expect(await generateStaticParams()).toEqual([
      { slug: "casabot" },
      { slug: "bevigil" },
      { slug: "my-tax-india" },
      { slug: "nexus-3d" },
    ]);
  });
});

describe("case-study template", () => {
  // AC42: plan §6 order, each section with an id for the TOC.
  it("renders the sections in plan §6 order with ids", () => {
    const { container } = render(
      <CaseStudy project={full} next={projects[0]} />,
    );
    const ids = [...container.querySelectorAll("section")].map((s) => s.id);
    expect(ids).toEqual([...SECTION_ORDER]);
    expect(SECTION_ORDER).toEqual([
      "context",
      "ownership",
      "challenge",
      "architecture",
      "implementation",
      "trade-offs",
      "outcome",
      "learned",
      "links",
    ]);
  });

  // AC42: empty sections render nothing.
  it("leaves out sections without content", () => {
    const partial: Project = {
      ...full,
      caseStudy: { context: "Only context", outcome: ["Shipped"] },
      links: {},
    };
    const { container } = render(
      <CaseStudy project={partial} next={undefined} />,
    );
    const ids = [...container.querySelectorAll("section")].map((s) => s.id);
    expect(ids).toEqual(["context", "outcome"]);
  });

  // AC42: the TOC lists exactly the rendered sections.
  it("builds the table of contents from the rendered sections", () => {
    render(<CaseStudy project={full} next={projects[0]} />);
    const toc = screen.getAllByRole("navigation", { name: "On this page" });
    expect(toc.length).toBeGreaterThan(0);
    const hrefs = [...toc[0]!.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(SECTION_ORDER.map((id) => `#${id}`));
  });

  // AC44
  it("renders a decorative reading-progress bar", () => {
    const { container } = render(<CaseStudy project={full} next={undefined} />);
    const bar = container.querySelector("[data-reading-progress]");
    expect(bar?.getAttribute("aria-hidden")).toBe("true");
  });

  it("links the next project", () => {
    render(<CaseStudy project={full} next={projects[1]} />);
    expect(
      screen.getByRole("link", { name: /Next project/ }).getAttribute("href"),
    ).toBe(`/work/${projects[1]?.slug}`);
  });
});
