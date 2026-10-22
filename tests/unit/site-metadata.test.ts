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

describe("site metadata", () => {
  // AC2
  it("sets the coming-soon title and a description", () => {
    expect(metadata.title).toBe("Daniel Dominic — portfolio coming soon");
    expect(metadata.description).toBe(
      "The portfolio of Daniel Dominic is coming soon.",
    );
  });

  // AC3: set in the root layout so every page inherits it until Phase 5.
  it("tells search engines not to index or follow the site", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("no client components", () => {
  // AC7
  it('has no "use client" directive anywhere under app/', () => {
    const offenders = filesUnder(join(root, "app"))
      .filter((file) => /\.(tsx?|jsx?|mjs)$/.test(file))
      .filter((file) =>
        /^\s*["']use client["']/m.test(readFileSync(file, "utf8")),
      )
      .map((file) => relative(root, file).replaceAll("\\", "/"));

    expect(offenders).toEqual([]);
  });
});

describe("claims.md", () => {
  // AC8: the file exists with its sections and no claims yet.
  it("exists with headings and no claim rows", () => {
    const text = readFileSync(join(root, "docs/content/claims.md"), "utf8");

    expect(text).toMatch(/^# Claims/m);
    for (const section of [
      "Identity",
      "Experience",
      "Projects",
      "Metrics",
      "Links",
    ]) {
      expect(text).toMatch(new RegExp(`^## ${section}$`, "m"));
    }

    const tableRows = text
      .split("\n")
      .filter((line) => line.trimStart().startsWith("|"));
    const headerRows = tableRows.filter((line) => /\|\s*Claim\s*\|/.test(line));
    const separatorRows = tableRows.filter((line) =>
      /^\s*\|[\s|:-]+\|\s*$/.test(line),
    );
    // Only each section's header and separator; no claim rows.
    expect(tableRows.length).toBe(headerRows.length + separatorRows.length);
    expect(headerRows.length).toBe(5);
  });
});
