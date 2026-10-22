import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

type Assertion = [string, { maxNumericValue?: number; minScore?: number }];
const lighthouse = JSON.parse(read("lighthouserc.json")) as {
  ci: {
    collect: { url: string[] };
    assert: { assertions: Record<string, Assertion> };
  };
};

describe("JS budget (Q2)", () => {
  // AC1
  it("caps script transfer at 300 KB and keeps the score thresholds", () => {
    const { assertions } = lighthouse.ci.assert;
    expect(
      assertions["resource-summary:script:size"]?.[1].maxNumericValue,
    ).toBe(300 * 1024);
    expect(assertions["categories:performance"]?.[1].minScore).toBe(0.9);
    expect(assertions["categories:accessibility"]?.[1].minScore).toBe(0.95);
  });

  // AC1: the budget is stated the same way everywhere it's documented.
  it("documents 300 KB in CLAUDE.md, workflow §6, ADR 0001 and the README", () => {
    for (const path of [
      "CLAUDE.md",
      "docs/workflow.md",
      "docs/adr/0001-nextjs-r3f-stack.md",
      "README.md",
    ]) {
      const text = read(path);
      expect(text, path).toMatch(/300 KB/);
      // The old figure may appear only as history ("was 150 KB").
      for (const line of text.split("\n").filter((l) => /150 KB/.test(l))) {
        expect(line, path).toMatch(/was 150 KB/);
      }
    }
  });

  // AC49
  it("runs Lighthouse on /, /about and /work/casabot", () => {
    const paths = lighthouse.ci.collect.url.map((url) => new URL(url).pathname);
    expect(paths).toEqual(["/", "/about", "/work/casabot"]);
  });
});
