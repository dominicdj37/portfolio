import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { metadata } from "@/app/layout";

const root = process.cwd();

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

function clientFilesUnder(dir: string): string[] {
  return filesUnder(join(root, dir))
    .filter((file) => /\.(tsx?|jsx?|mjs)$/.test(file))
    .filter((file) =>
      /^\s*["']use client["']/m.test(readFileSync(file, "utf8")),
    )
    .map((file) => relative(root, file).replaceAll("\\", "/"));
}

describe("site metadata", () => {
  // AC36: replaces the placeholder's "coming soon" title and description.
  it("sets a default title, a per-page title template and the positioning as description", () => {
    expect(metadata.title).toEqual({
      default: "Daniel Dominic — Senior Android Engineer",
      template: "%s — Daniel Dominic",
    });
    expect(metadata.description).toBe(
      "I design and ship production Android experiences — from architecture and real-time integrations to immersive AR — with the breadth to build across mobile, backend, and emerging platforms.",
    );
  });

  // Placeholder AC3, kept: set in the root layout so every page inherits it until Phase 5.
  it("tells search engines not to index or follow the site", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("client components", () => {
  // Placeholder AC7, kept; AC39 (no "use client" under app/work/) follows from it.
  it('has no "use client" directive anywhere under app/', () => {
    expect(clientFilesUnder("app")).toEqual([]);
  });

  // Technical approach: "use client" only for the listed islands.
  it("limits client components to the islands the spec lists", () => {
    expect(clientFilesUnder("components").sort()).toEqual([
      "components/case-study/toc-spy.tsx",
      "components/layout/menu-closer.tsx",
      "components/motion/pointer-tracker.tsx",
    ]);
  });
});

describe("fonts", () => {
  // AC4
  it("loads the three families through next/font with display swap", () => {
    const fonts = readFileSync(join(root, "app/fonts.ts"), "utf8");
    expect(fonts).toMatch(/from "next\/font\/google"/);
    for (const family of ["Space_Grotesk", "Inter", "JetBrains_Mono"]) {
      expect(fonts, family).toMatch(new RegExp(`\\b${family}\\(`));
    }
    expect(fonts.match(/display: "swap"/g)).toHaveLength(3);
    // Q4: only the display font is preloaded.
    expect(fonts.match(/preload: false/g)).toHaveLength(2);
  });

  // AC4
  it("never links Google Fonts directly", () => {
    for (const file of [
      ...filesUnder(join(root, "app")),
      ...filesUnder(join(root, "components")),
    ]) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(
        /fonts\.googleapis\.com|fonts\.gstatic\.com/,
      );
    }
  });
});

describe("lab teaser", () => {
  // AC48
  it("uses no WebGL and no client code", () => {
    const files = [
      "app/lab/page.tsx",
      ...filesUnder(join(root, "components/lab")).map((f) => relative(root, f)),
    ];
    for (const file of files) {
      const text = readFileSync(join(root, file), "utf8");
      expect(text, file).not.toMatch(
        /["']use client["']|webgl|from ["']three["']|@react-three|<canvas/i,
      );
    }
  });
});
