---
name: self-review
description: Review the current branch with the reviewer subagent, apply its mechanical fixes, and list the rest for Daniel. Use after implementing a slice and before /pr.
argument-hint: "[spec path] [base, default origin/main]"
---

# /self-review: independent review before the PR

Input: $ARGUMENTS (optional spec path and base ref).

The reviewer runs in a separate context, so the code isn't graded by the same context that wrote it (workflow §5.3). Keep it that way. Pass the reviewer facts, not your reasoning or your opinion of the code.

## Steps

1. **Prepare.**
   - Make sure you're on a `feat/*`, `fix/*`, `content/*` or `chore/*` branch, not `main`.
   - Run `git fetch origin main` so `origin/main` is current. The base is `origin/main` unless the argument names another one.
   - Find the spec: the argument, otherwise the `docs/specs/` file that matches the branch.
2. **Run the reviewer.** Launch the `reviewer` subagent with only:
   - the branch name;
   - the base ref;
   - the spec path and slice ID;
   - which checks you've already run green, and when (for example, "`pnpm verify` green after the last commit").

   Don't summarise the change, explain your choices, or point it at areas to skip.

3. **Sort the findings.**
   - **Apply** fixes the reviewer marks _mechanical_ and that touch no guardrail: a clear bug, a missing test for an AC, a CLAUDE.md rule violation with one obvious fix, a typo, a lint issue. Behaviour fixes follow the usual order: first a test that fails, then the fix. Commit them as `fix:`/`test:`/`refactor:` commits on the branch.
   - **Don't apply, list for Daniel:** anything marked _judgement call_; anything that changes scope or deviates from the spec; anything that edits a budget, threshold, lint rule, `tsconfig.json`, `lighthouserc.json`, `.claude/**` permissions or a test's expectations; and any finding you disagree with. Give your reasoning, briefly, next to the reviewer's.
   - Never skip, delete or weaken a test to answer a finding.
4. **Re-check.** After fixes, run `pnpm verify`, or at least `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test` when only non-UI code changed. If a _blocking_ finding was fixed, run the reviewer once more on the new diff. Stop after two rounds and report whatever is still open.
5. **Content.** The `content-checker` agent doesn't exist yet (Sprint 0, Q8). If `content/`, `app/` copy or `docs/content/` changed, check every public claim against `docs/content/claims.md` yourself and report the result.

## Report

- The verdict: **clean** (no blocking findings left) or **blocked** (with the blockers).
- The fixes you applied, with their commits.
- The open items for Daniel, each with the reviewer's reason and your view.
- The reviewer's **AC → test map**, which `/pr` reuses.
