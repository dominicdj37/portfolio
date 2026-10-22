// @vitest-environment node
import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  checkCommand,
  checkPath,
  decide,
} from "../../../.claude/hooks/protect-paths.mjs";

// S8-AC2, S8-AC3, S8-AC4

const ROOT_WIN = "D:\\dominic\\portfolio";
const ROOT_POSIX = "/home/runner/work/portfolio";

describe("checkPath (Edit/Write/NotebookEdit)", () => {
  it.each([
    ".env",
    ".env.local",
    ".env.example",
    "app/.env.production",
    "assets-raw/model.blend",
    "assets-raw/textures/wood.png",
    "tests/e2e/home.spec.ts-snapshots/home-android-linux.png",
    "public/resume/daniel-dominic.pdf",
  ])("blocks %s", (path) => {
    expect(checkPath(path, ROOT_POSIX)).toEqual(expect.any(String));
  });

  it.each([
    "app/page.tsx",
    "docs/specs/placeholder-home.md",
    "public/og.png",
    "tests/unit/__snapshots__/x.snap",
    "lib/env.ts",
    "docs/environment.md",
  ])("allows %s", (path) => {
    expect(checkPath(path, ROOT_POSIX)).toBeNull();
  });

  it("normalises Windows backslashes and drive-letter case", () => {
    expect(
      checkPath("d:\\dominic\\portfolio\\.env.local", ROOT_WIN),
    ).not.toBeNull();
    expect(
      checkPath("D:\\dominic\\portfolio\\public\\resume\\cv.pdf", ROOT_WIN),
    ).not.toBeNull();
    expect(
      checkPath("D:\\dominic\\portfolio\\app\\page.tsx", ROOT_WIN),
    ).toBeNull();
  });

  it("normalises mixed slashes and mixed case", () => {
    expect(
      checkPath("D:/dominic/portfolio\\Assets-Raw/x.glb", ROOT_WIN),
    ).not.toBeNull();
    expect(
      checkPath("D:\\Dominic\\Portfolio/.ENV.Local", ROOT_WIN),
    ).not.toBeNull();
    expect(checkPath("Public/Resume/CV.pdf", ROOT_WIN)).not.toBeNull();
  });

  it("normalises Git Bash style drive paths", () => {
    expect(checkPath("/d/dominic/portfolio/.env", ROOT_WIN)).not.toBeNull();
  });

  it("resolves .. segments before matching", () => {
    expect(checkPath("app/../assets-raw/x.glb", ROOT_POSIX)).not.toBeNull();
    expect(checkPath("assets-raw/../app/page.tsx", ROOT_POSIX)).toBeNull();
  });

  it("blocks secrets outside the project too", () => {
    expect(checkPath("C:\\Users\\me\\.env", ROOT_WIN)).not.toBeNull();
  });
});

describe("checkCommand (Bash/PowerShell, best-effort)", () => {
  it.each([
    // Redirects into or out of protected paths
    "echo SECRET=1 > .env.local",
    "echo x >> .env",
    'echo x >"assets-raw/notes.txt"',
    "printf x 2> public/resume/cv.pdf",
    "node -e 1 < .env.local",
    // cp / mv / rm / tee touching protected paths
    "cp .env.local /tmp/leak",
    "cp model.glb assets-raw/",
    "mv cv.pdf public/resume/cv.pdf",
    "rm tests/e2e/home.spec.ts-snapshots/home.png",
    "echo x | tee .env",
    "git status && cp .env.example .env",
    // PowerShell equivalents
    "Copy-Item .env.local C:\\temp\\x",
    "Set-Content -Path .env -Value x",
    "Remove-Item assets-raw\\old.blend",
    // Playwright baseline updates
    "pnpm exec playwright test --update-snapshots",
    "pnpm e2e --update-snapshots=all",
    "pnpm e2e -u",
    "playwright test -u",
    "pnpm e2e:mobile -u",
    // Recursive deletes outside build output
    "rm -rf node_modules",
    "rm -rf .",
    "rm -fr app",
    "rm -r -f docs",
    "rm --recursive --force tests",
    "rm -rf .next src",
    "rm -rf ./*",
    "rm -rf $HOME",
    "Remove-Item -Recurse -Force app",
    "Remove-Item -Recurse -Force .next, app",
    "rm -Recurse -Force docs",
  ])("blocks %s", (command) => {
    expect(checkCommand(command)).toEqual(expect.any(String));
  });

  it.each([
    "pnpm test",
    "pnpm test -u",
    "pnpm e2e",
    "git commit -m 'update .env docs'",
    "cat README.md > /tmp/x",
    "cp app/page.tsx app/page.bak.tsx",
    "rm tmp.txt",
    "rm -rf .next",
    "rm -rf .next/ test-results playwright-report .lighthouseci coverage",
    "rm -rf ./.next",
    'rm -rf ".next"',
    "Remove-Item -Recurse -Force .next",
    "Remove-Item -Recurse -Force .next, coverage",
    "pnpm build 2>&1 | tail -20",
    "echo ok > /dev/null",
  ])("allows %s", (command) => {
    expect(checkCommand(command)).toBeNull();
  });
});

describe("decide (hook input)", () => {
  it("checks file_path for Edit and Write", () => {
    for (const tool_name of ["Edit", "Write"]) {
      expect(
        decide(
          { tool_name, tool_input: { file_path: `${ROOT_POSIX}/.env` } },
          ROOT_POSIX,
        ),
      ).not.toBeNull();
    }
  });

  it("checks notebook_path for NotebookEdit", () => {
    expect(
      decide(
        {
          tool_name: "NotebookEdit",
          tool_input: { notebook_path: "assets-raw/a.ipynb" },
        },
        ROOT_POSIX,
      ),
    ).not.toBeNull();
  });

  it("checks command for Bash and PowerShell", () => {
    for (const tool_name of ["Bash", "PowerShell"]) {
      expect(
        decide(
          { tool_name, tool_input: { command: "rm -rf app" } },
          ROOT_POSIX,
        ),
      ).not.toBeNull();
    }
  });

  it("ignores other tools and missing input", () => {
    expect(
      decide(
        { tool_name: "Read", tool_input: { file_path: ".env" } },
        ROOT_POSIX,
      ),
    ).toBeNull();
    expect(decide({ tool_name: "Edit" }, ROOT_POSIX)).toBeNull();
  });
});

describe("protect-paths.mjs as a hook process", () => {
  const script = join(process.cwd(), ".claude", "hooks", "protect-paths.mjs");
  const run = (input: unknown) =>
    spawnSync(process.execPath, [script], {
      input: JSON.stringify(input),
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PROJECT_DIR: process.cwd() },
    });

  it("exits 2 with the reason on stderr when blocked", () => {
    const result = run({
      hook_event_name: "PreToolUse",
      tool_name: "Write",
      tool_input: { file_path: join(process.cwd(), ".env.test"), content: "x" },
    });
    expect(result.status).toBe(2);
    expect(result.stderr).toMatch(/\.env/);
  });

  it("exits 0 silently when allowed", () => {
    const result = run({
      hook_event_name: "PreToolUse",
      tool_name: "Bash",
      tool_input: { command: "pnpm test" },
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });
});
