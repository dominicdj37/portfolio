// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  formatEslintMessages,
  planFor,
} from "../../../.claude/hooks/format-on-write.mjs";

// S8-AC1, S8-AC4

const ROOT_WIN = "D:\\dominic\\portfolio";
const ROOT_POSIX = "/home/runner/work/portfolio";

describe("planFor", () => {
  it.each([
    "app/page.tsx",
    "lib/x.ts",
    "scripts/build.js",
    ".claude/hooks/a.mjs",
  ])("runs ESLint --fix and Prettier on %s", (path) => {
    expect(planFor(path, ROOT_POSIX)).toEqual({ eslint: true, prettier: true });
  });

  it.each([
    "docs/plan.md",
    "content/post.mdx",
    "app/globals.css",
    "lighthouserc.json",
    ".github/workflows/ci.yml",
  ])("runs Prettier only on %s", (path) => {
    expect(planFor(path, ROOT_POSIX)).toEqual({
      eslint: false,
      prettier: true,
    });
  });

  it.each(["public/og.png", "README", ".gitignore", "pnpm-lock.yaml.bak"])(
    "ignores %s",
    (path) => {
      expect(planFor(path, ROOT_POSIX)).toBeNull();
    },
  );

  it("ignores files outside the project and in node_modules", () => {
    expect(planFor("C:\\Users\\me\\scratch.ts", ROOT_WIN)).toBeNull();
    expect(planFor("node_modules/next/index.js", ROOT_POSIX)).toBeNull();
  });

  it("normalises Windows paths and extension case", () => {
    expect(planFor("d:\\Dominic\\portfolio\\app\\Page.TSX", ROOT_WIN)).toEqual({
      eslint: true,
      prettier: true,
    });
    expect(planFor("D:/dominic/portfolio\\docs\\PLAN.MD", ROOT_WIN)).toEqual({
      eslint: false,
      prettier: true,
    });
  });
});

describe("formatEslintMessages", () => {
  it("lists each remaining problem with location and rule", () => {
    const text = formatEslintMessages("app/page.tsx", [
      {
        line: 3,
        column: 7,
        severity: 2,
        ruleId: "no-unused-vars",
        message: "'x' is unused.",
      },
      {
        line: 9,
        column: 1,
        severity: 1,
        ruleId: null,
        message: "Parsing warning.",
      },
    ]);
    expect(text).toContain(
      "app/page.tsx:3:7 error 'x' is unused. (no-unused-vars)",
    );
    expect(text).toContain("app/page.tsx:9:1 warning Parsing warning.");
  });

  it("returns an empty string when nothing is left", () => {
    expect(formatEslintMessages("app/page.tsx", [])).toBe("");
  });
});

describe("format-on-write.mjs as a hook process", () => {
  const script = join(process.cwd(), ".claude", "hooks", "format-on-write.mjs");
  const run = (file: string) =>
    spawnSync(process.execPath, [script], {
      input: JSON.stringify({
        hook_event_name: "PostToolUse",
        tool_name: "Write",
        tool_input: { file_path: file },
      }),
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PROJECT_DIR: process.cwd() },
      timeout: 60_000,
    });

  // A scratch folder inside the project, so the project's Prettier and ESLint configs apply.
  const withScratchFile = (
    name: string,
    content: string,
    fn: (file: string) => void,
  ) => {
    const dir = mkdtempSync(
      join(process.cwd(), "tests", "unit", "hooks", "tmp-"),
    );
    const file = join(dir, name);
    writeFileSync(file, content);
    try {
      fn(file);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it("fixes formatting and exits 0", { timeout: 60_000 }, () => {
    withScratchFile("ok.ts", "export const  greeting =   'hi'\n", (file) => {
      const result = run(file);
      expect(result.stderr).toBe("");
      expect(result.status).toBe(0);
      expect(readFileSync(file, "utf8")).toBe(
        'export const greeting = "hi";\n',
      );
    });
  });

  it(
    "reports remaining ESLint problems with exit 2",
    { timeout: 60_000 },
    () => {
      withScratchFile("bad.ts", "const unused = 1;\nexport {};\n", (file) => {
        const result = run(file);
        expect(result.status).toBe(2);
        expect(result.stderr).toMatch(/no-unused-vars/);
      });
    },
  );

  it("ignores files it doesn't handle", () => {
    const result = run(join(process.cwd(), "public", "missing.png"));
    expect(result.status).toBe(0);
  });
});
