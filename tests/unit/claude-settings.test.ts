// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// Contract for .claude/settings.json (S7-AC3). Loosening a guardrail means
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
