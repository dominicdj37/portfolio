import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("update-snapshots workflow", () => {
  const workflow = read(".github/workflows/update-snapshots.yml");

  // AC16: Daniel triggers it by hand for a chosen PR branch.
  it("runs only on manual dispatch, for a named branch", () => {
    expect(workflow).toMatch(/^on:\s*\n\s+workflow_dispatch:/m);
    expect(workflow).not.toMatch(/^\s+(pull_request|push):/m);
    expect(workflow).toMatch(/inputs:\s*\n\s+branch:/);
    expect(workflow).toMatch(/ref: \$\{\{ inputs\.branch \}\}/);
  });

  // AC16: regenerates the visual baselines on Linux and commits them.
  it("updates only the visual baselines on Linux and pushes them to the branch", () => {
    expect(workflow).toMatch(/runs-on: ubuntu-latest/);
    expect(workflow).toMatch(
      /playwright test tests\/e2e\/visual\.spec\.ts --update-snapshots/,
    );
    expect(workflow).toMatch(/git add tests\/e2e\/visual\.spec\.ts-snapshots/);
    expect(workflow).toMatch(/git push origin HEAD:\$\{\{ inputs\.branch \}\}/);
  });

  // AC16: pushes made with GITHUB_TOKEN don't start CI, so it starts CI itself.
  it("re-runs CI on the branch after committing", () => {
    expect(workflow).toMatch(/gh workflow run ci\.yml --ref/);
    expect(read(".github/workflows/ci.yml")).toMatch(/^\s+workflow_dispatch:/m);
  });
});
