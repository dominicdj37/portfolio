// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Contract for .claude/ (S7-AC3, S8-AC5, S9-AC1). Loosening a guardrail means
// editing this list too, so it shows up as a visible diff in review.

const REQUIRED_DENY = [
  // Secrets
  "Read(./.env*)",
  "Bash(cat *.env*)",
  "PowerShell(Get-Content *.env*)",
  // History rewrites and direct pushes to main
  "Bash(git push --force*)",
  "Bash(git push -f*)",
  "PowerShell(git push --force*)",
  "PowerShell(git push -f*)",
  "Bash(git push * main)",
  "PowerShell(git push * main)",
  // Merging and production deploys are Daniel's
  "Bash(gh pr merge*)",
  "PowerShell(gh pr merge*)",
  "Bash(vercel --prod*)",
  "PowerShell(vercel --prod*)",
  // Running packages straight from the registry
  "Bash(pnpm dlx *)",
  "PowerShell(pnpm dlx *)",
];

const REQUIRED_ASK = [
  "Bash(pnpm add *)",
  "PowerShell(pnpm add *)",
  "Bash(git push*)",
  "PowerShell(git push*)",
  "Edit(/CLAUDE.md)",
  "Edit(/.claude/**)",
  "Edit(/.github/**)",
  "Edit(/docs/adr/**)",
  // Gate-defining configs (W12)
  "Edit(/eslint.config.*)",
  "Edit(/tsconfig.json)",
  "Edit(/vitest.config.*)",
  "Edit(/playwright.config.*)",
  "Edit(/lighthouserc.json)",
  "Edit(/package.json)",
];

// An unscoped allow for these would approve everything not denied or asked.
const FORBIDDEN_ALLOW = [
  "Bash",
  "Bash(*)",
  "PowerShell",
  "PowerShell(*)",
  "Edit",
  "Edit(*)",
  "Edit(/**)",
];

type Permissions = { allow?: string[]; ask?: string[]; deny?: string[] };

const settings = JSON.parse(
  readFileSync(join(process.cwd(), ".claude", "settings.json"), "utf8"),
) as { permissions?: Permissions };

const allow = settings.permissions?.allow ?? [];
const ask = settings.permissions?.ask ?? [];
const deny = settings.permissions?.deny ?? [];

describe(".claude/settings.json permissions", () => {
  it.each(REQUIRED_DENY)("denies %s", (rule) => {
    expect(deny).toContain(rule);
    expect(ask).not.toContain(rule);
    expect(allow).not.toContain(rule);
  });

  it.each(REQUIRED_ASK)("asks before %s", (rule) => {
    expect(ask).toContain(rule);
    expect(allow).not.toContain(rule);
  });

  it("has no unscoped allow rule for shells or edits", () => {
    expect(allow.filter((rule) => FORBIDDEN_ALLOW.includes(rule))).toEqual([]);
  });
});

// S8-AC5: both hooks stay registered, so removing one is a visible, failing diff.
type HookGroup = {
  matcher?: string;
  hooks?: { type?: string; command?: string }[];
};
const hooks = (settings as { hooks?: Record<string, HookGroup[]> }).hooks ?? {};

const registered = (event: string, script: string) =>
  (hooks[event] ?? []).filter((group) =>
    group.hooks?.some((hook) =>
      hook.command?.includes(`.claude/hooks/${script}`),
    ),
  );

describe(".claude/settings.json hooks", () => {
  it.each([
    [
      "PreToolUse",
      "protect-paths.mjs",
      ["Edit", "Write", "NotebookEdit", "Bash", "PowerShell"],
    ],
    ["PostToolUse", "format-on-write.mjs", ["Edit", "Write"]],
  ])("registers %s %s for %j", (event, script, tools) => {
    const matchers = registered(event, script).flatMap((group) =>
      (group.matcher ?? "").split("|"),
    );
    expect(matchers).toEqual(expect.arrayContaining(tools));
  });
});

// S9: the reviewer agent and the core skills. Frontmatter is simple
// `key: value` lines, so a tiny parser avoids a YAML dependency.
const frontmatter = (path: string) => {
  const text = readFileSync(join(process.cwd(), path), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const fields: Record<string, string> = Object.fromEntries(
    (match?.[1] ?? "")
      .split(/\r?\n/)
      .map((line) => /^([\w-]+):\s*(.*)$/.exec(line))
      .filter((field) => field !== null)
      .map(([, key, value]) => [key, value!.trim()]),
  );
  return { fields, body: text.slice(match?.[0].length ?? 0) };
};

describe(".claude/agents/reviewer.md", () => {
  // Read inside each test, so a missing file fails these tests, not the file.
  const reviewer = () => frontmatter(".claude/agents/reviewer.md");

  it("is named reviewer and says when to use it", () => {
    const { fields } = reviewer();
    expect(fields.name).toBe("reviewer");
    expect(fields.description).toBeTruthy();
  });

  it("can read and run checks but has no editing tools (S9-AC1)", () => {
    // Omitting `tools` would give the agent every tool, including Edit and Write.
    const tools = (reviewer().fields.tools ?? "").split(",");
    expect(tools.map((tool) => tool.trim()).sort()).toEqual([
      "Bash",
      "Glob",
      "Grep",
      "Read",
    ]);
  });

  it("reviews against the spec, CLAUDE.md and accepted ADRs", () => {
    const { body } = reviewer();
    expect(body).toMatch(/docs\/specs\//);
    expect(body).toMatch(/CLAUDE\.md/);
    expect(body).toMatch(/docs\/adr\//);
  });
});

describe(".claude/skills", () => {
  // Built-in commands a skill must not shadow (W6).
  const BUILT_INS = [
    "review",
    "code-review",
    "security-review",
    "init",
    "pr-comments",
  ];

  it.each(["spec", "self-review", "pr"])(
    "%s has a SKILL.md named after its folder",
    (name) => {
      const { fields } = frontmatter(`.claude/skills/${name}/SKILL.md`);
      expect(fields.name).toBe(name);
      expect(fields.description).toBeTruthy();
      expect(BUILT_INS).not.toContain(name);
    },
  );

  it("only Daniel can trigger /pr, since it pushes and opens a PR (S9-AC2)", () => {
    expect(
      frontmatter(".claude/skills/pr/SKILL.md").fields[
        "disable-model-invocation"
      ],
    ).toBe("true");
  });

  // One assertion per clause of S9-AC3, so dropping a clause from a skill fails.
  it("/spec writes a Draft from the template, stops, and never approves (S9-AC3)", () => {
    const { body } = frontmatter(".claude/skills/spec/SKILL.md");
    expect(body).toMatch(/Status: \*\*Draft\*\*/);
    expect(body).toMatch(/docs\/specs\/_template\.md/);
    expect(body).toMatch(/\*\*Stop\.\*\*/);
    expect(body).toMatch(/Never set `Status: Approved` yourself/);
  });

  it("/self-review runs reviewer, applies mechanical fixes, lists the rest (S9-AC3)", () => {
    const { body } = frontmatter(".claude/skills/self-review/SKILL.md");
    expect(body).toMatch(/Launch the `reviewer` subagent/);
    expect(body).toMatch(/\*\*Apply\*\* fixes the reviewer marks _mechanical_/);
    expect(body).toMatch(/\*\*Don't apply, list for Daniel:\*\*/);
  });

  it("/pr fills the template with AC → test map and proof of red, then uses gh (S9-AC3)", () => {
    const { body } = frontmatter(".claude/skills/pr/SKILL.md");
    expect(body).toMatch(/\.github\/pull_request_template\.md/);
    expect(body).toMatch(/\*\*AC → test map:\*\*/);
    expect(body).toMatch(/\*\*Proof of red\*\*/);
    expect(body).toMatch(/gh pr create/);
  });
});
