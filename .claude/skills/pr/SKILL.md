---
name: pr
description: Push the current branch and open a PR with the repo's template fully filled in (AC-to-test map, proof-of-red links, decisions to review). Run by Daniel after /self-review is clean.
argument-hint: "[spec path]"
disable-model-invocation: true
---

# /pr: open the pull request

Input: $ARGUMENTS (optional spec path).

This skill pushes and opens a PR, so only Daniel starts it. It never merges, never pushes to `main`, and never marks a PR ready to merge on his behalf.

## Preconditions

Stop and report if any of these fail:

1. You're on a `feat/*`, `fix/*`, `content/*` or `chore/*` branch, and the working tree is clean (`git status --short`).
2. The spec in `docs/specs/` has `Status: **Approved**`.
3. `pnpm verify` is green on the current `HEAD`. Run it if it hasn't run since the last commit.
4. `/self-review` ran on this `HEAD` with no blocking findings. If it didn't, say so and offer to run it first.

## Gather

- **Commits and size:** run `git log origin/main..HEAD --oneline` and `git diff origin/main...HEAD --shortstat`. If the diff is over about 400 changed lines (excluding the lockfile), say so in the PR and offer a split.
- **AC → test map:** take it from `/self-review`. Otherwise, build it by searching `tests/` for each AC ID. Every AC gets a test file and test name, **manual (Daniel)**, or **missing**. A missing AC blocks the PR unless Daniel says otherwise.
- **Proof of red** for each new gate (CLAUDE.md): the commit that broke it on purpose, and the CI run where it failed. Get the run from `gh run list --branch <branch>` / `gh run view <id>`. Never make up a run ID or link. If there's no proof of red yet, write "pending" and tell Daniel.
- **Decisions to review:** every deviation from the spec, anything beyond its scope, and every judgement call left open by `/self-review`.
- **New dependencies:** each one with its reason, or "none".
- **Screenshots** (UI changes only): capture `/` (and the changed routes) at 390 px and 1440 px with Playwright against `pnpm start`, into `test-results/pr-screenshots/`. `gh` can't attach images, so list the file paths and ask Daniel to drag them into the PR.

## Write and open

1. Fill in `.github/pull_request_template.md` and keep its headings in order. Add **Proof of red** and **Decisions to review** sections after Acceptance criteria:
   - **What / why:** `Spec: docs/specs/<file> (<slice ID>, if any) · Closes #<issue>` (or `#— (no issue)`), then two or three plain sentences.
   - **Acceptance criteria:** one checkbox per AC, as `AC — test: <file> (<test name>)`. Tick a box only when its test exists and passes. Manual ACs stay unticked with **Daniel:** and what he needs to do.
   - **Proof of red**, **Decisions to review**, **Screenshots** and **Checks** as gathered above. Tick a Checks box only if it's true, and write "n/a" with a reason where it doesn't apply.
   - End with the PR attribution lines from the session's instructions.
2. Write the body to a file in the scratchpad, not inline.
3. Run `git push -u origin <branch>`. This asks Daniel for permission.
4. Run `gh pr create --base main --head <branch> --title "<type>: <summary>" --body-file <file>`. The title is a conventional commit, because it becomes the squash commit. For a slice of a larger spec, end the title with the slice ID, like `(S9)`.
5. Watch CI with `gh pr checks <n> --watch` (in the background). Report the PR URL and the check results. If a check fails, read the logs (`gh run view <id> --log-failed`), and report the cause and a proposed fix. Don't push a fix without saying so.
