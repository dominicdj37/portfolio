import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { DeviceFrame } from "@/components/ui/device-frame";
import { Section } from "@/components/ui/section";
import { StatTile } from "@/components/ui/stat-tile";
import { Tag } from "@/components/ui/tag";

// AC6: the primitives render with the right roles, names and variants.
describe("Container", () => {
  it("wraps its children in a width-limited box", () => {
    render(<Container>inside</Container>);
    expect(screen.getByText("inside").className).toMatch(/max-w-6xl/);
  });
});

describe("Section", () => {
  it("is a region labelled by its title, with a mono eyebrow", () => {
    render(
      <Section id="work" number="01" eyebrow="Work" title="Featured work">
        <p>body</p>
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Featured work" });
    expect(region.id).toBe("work");
    expect(region.textContent).toContain("01 · Work");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Featured work",
    );
  });
});

describe("Button", () => {
  // AC7
  it("renders a link when given href", () => {
    render(<Button href="/work">Explore my work</Button>);
    const link = screen.getByRole("link", { name: "Explore my work" });
    expect(link.getAttribute("href")).toBe("/work");
    expect(screen.queryByRole("button")).toBeNull();
  });

  // AC7
  it("renders a button without href", () => {
    render(<Button type="button">Menu</Button>);
    expect(screen.getByRole("button", { name: "Menu" })).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("supports the primary, secondary and ghost variants", () => {
    render(
      <>
        <Button href="/a">A</Button>
        <Button href="/b" variant="secondary">
          B
        </Button>
        <Button href="/c" variant="ghost">
          C
        </Button>
      </>,
    );
    for (const [name, variant] of [
      ["A", "primary"],
      ["B", "secondary"],
      ["C", "ghost"],
    ] as const) {
      expect(screen.getByRole("link", { name }).dataset.variant).toBe(variant);
    }
  });

  it("opens external links in a new tab, safely", () => {
    render(
      <Button href="https://example.org/" external>
        Out
      </Button>,
    );
    const link = screen.getByRole("link", { name: /Out/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("ArrowLink", () => {
  // AC7
  it("is a plain same-tab link by default", () => {
    render(<ArrowLink href="/about">About me</ArrowLink>);
    const link = screen.getByRole("link", { name: "About me" });
    expect(link.getAttribute("target")).toBeNull();
  });

  // AC7
  it("opens external links in a new tab and says so", () => {
    render(
      <ArrowLink href="https://example.org/" external>
        Play Store
      </ArrowLink>,
    );
    const link = screen.getByRole("link", {
      name: "Play Store (opens in new tab)",
    });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("Tag", () => {
  it("renders a plain tech tag", () => {
    render(<Tag>Kotlin</Tag>);
    expect(screen.getByText("Kotlin").dataset.status).toBeUndefined();
  });

  it("renders status chips", () => {
    render(
      <>
        <Tag status="live">Live on Play Store</Tag>
        <Tag status="prototype">Prototype</Tag>
      </>,
    );
    expect(screen.getByText("Live on Play Store").dataset.status).toBe("live");
    expect(screen.getByText("Prototype").dataset.status).toBe("prototype");
  });
});

describe("Card", () => {
  it("renders an article by default and supports the interactive variant", () => {
    render(
      <>
        <Card>plain</Card>
        <Card interactive>linked</Card>
      </>,
    );
    expect(screen.getByText("plain").tagName).toBe("ARTICLE");
    expect(screen.getByText("linked").dataset.interactive).toBe("true");
  });
});

describe("StatTile", () => {
  it("shows the final value as accessible text and animates only decoration", () => {
    const { container } = render(
      <StatTile count={500} display="500K+" label="downloads" />,
    );
    // Screen readers get the real value, never the moving counter (Q15).
    expect(screen.getByText("500K+").className).toMatch(/sr-only/);
    const counter = container.querySelector(".count-up");
    expect(counter?.getAttribute("aria-hidden")).toBe("true");
    expect(counter?.getAttribute("style")).toContain("--n: 500");
  });

  it("renders text values without a counter", () => {
    const { container } = render(
      <StatTile display="End to end" label="architecture" />,
    );
    expect(screen.getByText("End to end")).toBeTruthy();
    expect(container.querySelector(".count-up")).toBeNull();
  });
});

describe("DeviceFrame", () => {
  it("is a labelled figure with a status bar and a screen", () => {
    render(
      <DeviceFrame label="Android app preview">
        <p>screen</p>
      </DeviceFrame>,
    );
    const figure = screen.getByRole("figure", { name: "Android app preview" });
    expect(figure.querySelector("[data-status-bar]")).not.toBeNull();
    expect(figure.textContent).toContain("screen");
  });
});
