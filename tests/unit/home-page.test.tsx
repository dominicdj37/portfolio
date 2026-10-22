import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Capabilities } from "@/components/home/capabilities";
import { CareerSnapshot } from "@/components/home/career-snapshot";
import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedWork } from "@/components/home/featured-work";
import { Hero } from "@/components/home/hero";
import { ProofBento } from "@/components/home/proof-bento";
import { TechMarquee } from "@/components/home/tech-marquee";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

// AC36: the site v1 home page replaces the placeholder. The placeholder's
// "only the name and the coming-soon line" tests are retired by this AC.

describe("hero", () => {
  // AC26
  it("has one h1, the eyebrow, the intro, two CTAs and the hero stage", () => {
    const { container } = render(<Hero resumeAvailable={false} />);

    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]?.textContent).toBe(site.headline);
    expect(container.textContent).toContain(site.eyebrow);
    expect(container.textContent).toContain(site.intro);
    expect(
      screen
        .getByRole("link", { name: "Explore my work" })
        .getAttribute("href"),
    ).toBe("/#work");
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("figure")).toBeTruthy();
  });

  // AC26: with the resume PDF, the secondary CTA is the resume.
  it("links the resume as the secondary CTA once the PDF exists", () => {
    render(<Hero resumeAvailable />);
    const resume = screen.getByRole("link", { name: /Resume/ });
    expect(resume.getAttribute("href")).toBe(site.resumePath);
  });

  // AC26: until then, the plan §2 tertiary CTA takes its place.
  it("falls back to Let's connect without the PDF", () => {
    render(<Hero resumeAvailable={false} />);
    expect(screen.queryByRole("link", { name: /Resume/ })).toBeNull();
    expect(
      screen.getByRole("link", { name: "Let's connect" }).getAttribute("href"),
    ).toBe("/contact");
  });

  // AC26 + Q5: the availability chip is off by default.
  it("omits the availability chip while it's off", () => {
    render(<Hero resumeAvailable={false} />);
    expect(screen.queryByText(site.availability.text)).toBeNull();
  });
});

describe("proof bento", () => {
  // AC29
  it("shows four tiles whose accessible text is the final value", () => {
    render(<ProofBento />);
    const tiles = screen.getAllByRole("listitem");
    expect(tiles).toHaveLength(4);
    for (const [i, point] of site.proofPoints.entries()) {
      expect(within(tiles[i]!).getByText(point.display)).toBeTruthy();
      expect(tiles[i]!.textContent).toContain(point.label);
    }
  });
});

describe("featured work", () => {
  // AC30
  it("renders four cards, each a single link named by the project title", () => {
    render(<FeaturedWork />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(4);
    for (const [i, project] of projects.entries()) {
      const links = within(cards[i]!).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]?.textContent).toBe(project.title);
    }
  });

  // AC30: case studies with content are linked; Nexus 3D links to its video (Q11).
  it("links case studies, and Nexus 3D's demo video", () => {
    render(<FeaturedWork />);
    expect(
      screen.getByRole("link", { name: "CASABOT" }).getAttribute("href"),
    ).toBe("/work/casabot");
    const nexus = screen.getByRole("link", { name: "Nexus 3D" });
    expect(nexus.getAttribute("href")).toBe(
      projects.find((p) => p.slug === "nexus-3d")?.links.demoVideo,
    );
    expect(nexus.getAttribute("target")).toBe("_blank");
  });

  // AC30
  it("shows Live on Play Store or Prototype chips", () => {
    render(<FeaturedWork />);
    expect(screen.getAllByText("Live on Play Store")).toHaveLength(3);
    expect(screen.getAllByText("Prototype")).toHaveLength(1);
  });
});

describe("capabilities", () => {
  // AC32
  it("has six tiles with headings", () => {
    render(<Capabilities />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  });

  // AC32: evidence links point only at linked case studies.
  it("links evidence only to case studies that are linked", () => {
    render(<Capabilities />);
    const linked = new Set(
      projects.filter((p) => p.caseStudy.context).map((p) => `/work/${p.slug}`),
    );
    for (const link of screen.getAllByRole("link")) {
      expect(linked.has(link.getAttribute("href") ?? "")).toBe(true);
    }
  });
});

describe("tech marquee", () => {
  // AC33: the duplicate track is hidden from assistive tech.
  it("hides the duplicate list", () => {
    const { container } = render(<TechMarquee />);
    const lists = container.querySelectorAll("ul");
    expect(lists).toHaveLength(2);
    expect(lists[0]?.getAttribute("aria-hidden")).toBeNull();
    expect(lists[1]?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("career snapshot", () => {
  // AC34
  it("renders the four stops as an ordered list with employers and dates", () => {
    render(<CareerSnapshot />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    for (const [i, role] of experience.entries()) {
      expect(items[i]?.textContent).toContain(role.company);
      expect(items[i]?.textContent).toContain(role.period);
    }
  });
});

describe("contact CTA", () => {
  // AC35
  it("shows email, phone and LinkedIn, plus the resume once it exists", () => {
    render(<ContactCta resumeAvailable />);
    expect(
      screen
        .getByRole("link", { name: /dominicdj37@gmail.com/ })
        .getAttribute("href"),
    ).toBe("mailto:dominicdj37@gmail.com");
    expect(
      screen
        .getByRole("link", { name: /\+91 9947692661/ })
        .getAttribute("href"),
    ).toBe("tel:+919947692661");
    expect(
      screen.getByRole("link", { name: /LinkedIn/ }).getAttribute("href"),
    ).toBe(site.contact.linkedin);
    expect(screen.getByRole("link", { name: /Resume/ })).toBeTruthy();
  });

  // AC35: a channel with no value is omitted (the resume, until the PDF exists).
  it("omits the resume link without the PDF", () => {
    render(<ContactCta resumeAvailable={false} />);
    expect(screen.queryByRole("link", { name: /Resume/ })).toBeNull();
  });
});
