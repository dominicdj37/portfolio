# Sprint 0 — Foundation
Plan reference: docs/workflow.md §10, §13 (Sprint 0 is not in docs/plan.md §13)   Issue: #— (none yet; create one per slice)
Status: **Approved** — Daniel, 2026-10-21 (approved in session; line updated by Claude on instruction)

## Goal
No visitor-facing feature. After this sprint, every later feature can go spec → tests → PR → CI → preview → merge → deploy with all gates enforced automatically. To prove the loop works end to end, a placeholder home page goes through it last.

## Scope / Out of scope

**In scope**
- Next.js (App Router) + TypeScript strict scaffold, pnpm, Tailwind CSS.
- ESLint + Prettier; Vitest + Testing Library; Playwright with `android`, `iphone` and `desktop` projects; `@axe-core/playwright`; Lighthouse CI.
- GitHub Actions CI. Each tooling slice adds its own job, so the gates grow one at a time.
- `CLAUDE.md` (from workflow §4.2), `.claude/settings.json` permissions (§5.1) and hooks (§5.2), the 5 subagents (§5.3) and 7 skills (§5.4).
- PR template (§8), spec template (§4.3), ADR 0001 (stack).
- Post-deploy production smoke test (§8 Release step 2), limited to `/`.
- Placeholder home page, shipped through the full cycle (§2, stages 1–12).
- Human-only setup that Claude documents but does not do: Vercel project link, branch protection, local tool installs.

**Out of scope (and where each item goes)**
- Visual-regression tests and baselines → Phase 1 (workflow §10: "baselines established here"). The protection hook for baselines does land now.
- `@next/bundle-analyzer` → added the first time a JS budget fails. In Sprint 0 the JS budget is enforced by Lighthouse CI (see Technical approach).
- Link checker → Phase 1, once there are links to check.
- `assets:*` scripts, gltf-transform, the `asset-pipeline` agent and the `/add-asset` skill → Phase 4 (Q6).
- Content in `docs/content/claims.md` → Phase 0. This sprint only creates the file with headings and no claims.
- Design tokens, fonts, Radix, Motion, R3F, MDX, analytics, domain, MCP servers.

## Slices and acceptance criteria (each becomes ≥1 test or recorded check)

Each slice is one branch and one PR, kept under about 400 changed lines excluding the lockfile. "Proof of red" means the PR description links a CI run, from a throwaway commit or branch, where that slice's gate fails on a deliberate violation. A gate nobody has seen fail is not trusted.

### S1 · `docs/foundation` — docs, templates, ADR
- [ ] S1-AC1 `docs/plan.md` and `docs/workflow.md` exist (moved with `git mv`, history kept), and their cross-references point to the new paths.
- [ ] S1-AC2 `docs/specs/_template.md` matches workflow §4.3, with a `Status:` line added (see Q1).
- [ ] S1-AC3 `docs/adr/0001-nextjs-r3f-stack.md` (context → decision → consequences) records Next.js App Router, pnpm, Tailwind, the test stack, Vercel, and the Node LTS version. Status: Proposed until Daniel accepts it.
- [ ] S1-AC4 `.github/pull_request_template.md` matches workflow §8. This PR and every later PR use it.
- [ ] S1-AC5 This spec is committed with Status: Approved, set by Daniel.
- [ ] S1-AC6 The private notes are split out of `docs/plan.md` into gitignored `docs/private/` (Q7). `docs/workflow.md` reflects the decisions in this spec (`/self-review`, the spec Status rule, the baseline workflow, Lighthouse on a local build, assets tooling deferred).
- [ ] S1-AC7 S1 lands as a single clean root commit, prepared by Claude on a local branch. Daniel does the force-push to `main` and then makes the repo public (Q7a). This replaces the usual PR flow for this one slice, since nothing earlier exists to compare against.

### S2 · `chore/scaffold` — Next.js app + CI skeleton
- [ ] S2-AC1 `pnpm install && pnpm build` succeeds on a clean clone. `package.json` pins `packageManager` (pnpm via corepack) and `engines.node`, and `.nvmrc` matches.
- [ ] S2-AC2 `tsconfig.json` has `strict: true` and `noUncheckedIndexedAccess: true`. `pnpm typecheck` (`tsc --noEmit`) passes.
- [ ] S2-AC3 Tailwind is wired up: a utility class on the stub page appears in the built CSS.
- [ ] S2-AC4 The create-next-app boilerplate (demo SVGs, sample copy) is removed. `/` renders a bare stub.
- [ ] S2-AC5 `.gitignore` covers `.env*` (except `.env.example`), `assets-raw/`, `.next/`, `test-results/`, `playwright-report/`, `.lighthouseci/` and `coverage/`. (`.gitattributes` with `* text=auto eol=lf` already landed in S1.)
- [ ] S2-AC6 `.github/workflows/ci.yml` runs on `pull_request` and on push to `main`: install with pnpm cache, then `typecheck` and `build` jobs. Concurrency cancels superseded runs.
- [ ] S2-AC7 Proof of red: a type error fails `typecheck`.

### S3 · `chore/lint-format` — ESLint + Prettier
- [ ] S3-AC1 ESLint flat config through the `eslint` CLI (not `next lint`), with the Next.js core-web-vitals and TypeScript rules, and `eslint-config-prettier`.
- [ ] S3-AC2 Scripts `lint`, `format` and `format:check` are added. The whole repo passes both checks, docs included.
- [ ] S3-AC3 CI gets a `static` job (`format:check` + `lint`).
- [ ] S3-AC4 Proof of red: an unused variable and a misformatted file each fail `static`.

### S4 · `chore/unit-tests` — Vitest
- [ ] S4-AC1 Vitest + Testing Library + jsdom. Tests live in `tests/unit/**`. `pnpm test` runs them once (`vitest run`); `pnpm test --changed` works.
- [ ] S4-AC2 At least one real component test of the stub page. No `passWithNoTests`.
- [ ] S4-AC3 CI gets a `unit` job.
- [ ] S4-AC4 Proof of red: a failing assertion fails `unit`.

### S5 · `chore/e2e` — Playwright + axe
- [ ] S5-AC1 `playwright.config.ts` defines projects `android` (Pixel 7, Chromium), `iphone` (iPhone 14, WebKit, 390 px to match the PR template) and `desktop` (Chromium, 1440×900). Tests live in `tests/e2e/**`.
- [ ] S5-AC2 `webServer` runs the production build (`pnpm start`), not `next dev`. CI uses `retries: 1` and `forbidOnly: true`.
- [ ] S5-AC3 A shared `expectNoA11yViolations(page)` helper fails on any axe violation with impact `serious` or `critical`, tagged WCAG 2.2 A/AA.
- [ ] S5-AC4 A smoke spec checks that `/` returns 200, has no console errors, and passes the axe helper, on all 3 projects.
- [ ] S5-AC5 Scripts: `e2e` runs all projects. `e2e:mobile` runs `android` + `iphone`.
- [ ] S5-AC6 CI gets an `e2e` job (Linux, browsers installed with deps). The HTML report is uploaded as an artifact on failure.
- [ ] S5-AC7 Proof of red: an `<img>` without `alt` fails the axe check.

### S6 · `chore/lighthouse` — Lighthouse CI + JS budget
- [ ] S6-AC1 `lighthouserc.json` starts `pnpm start`, audits `/` with the mobile preset, and takes the median of 3 runs.
- [ ] S6-AC2 The run fails if performance < 0.90 or accessibility < 0.95, or if the `resource-summary:script:size` transfer size is over 150 KB (153 600 bytes).
- [ ] S6-AC3 Reports go to the filesystem and are uploaded as an Actions artifact, never to `temporary-public-storage`.
- [ ] S6-AC4 CI gets a `lighthouse` job. `pnpm verify` = `format:check → lint → typecheck → test → build → e2e`; `pnpm verify:full` adds `lhci`.
- [ ] S6-AC5 Proof of red: a temporary ~200 KB client bundle on the stub fails the script-size assertion.
- [ ] S6-AC6 **Daniel:** enables branch protection (or a ruleset) on `main`: PR required, required checks `static`, `typecheck`, `unit`, `build`, `e2e` and `lighthouse`, 0 required approvals (see W4), no force-push, no deletion. Claude writes the exact steps in the PR description.

### S7 · `chore/claude-config` — CLAUDE.md + permissions
- [ ] S7-AC1 `CLAUDE.md` follows the §4.2 skeleton. It lists only commands that exist, and puts `assets:*` under "Phase 4, not yet available". It defines `pnpm verify` exactly, states the spec Status rule, and says "Windows dev machine, Linux CI". The "Never" list says "never update visual baselines; Daniel runs the update-snapshots workflow" instead of "unless Daniel asks" (Q3).
- [ ] S7-AC2 `.claude/settings.json` implements §5.1 with the corrections in W2, W3 and W13. Deny covers `Read(./.env*)` and `Bash(cat .env*)`-style reads, `git push --force*`, `git push * main`, `gh pr merge*`, `vercel --prod*` and `pnpm dlx*`. Ask covers `pnpm add*`, `git push*`, and edits to `CLAUDE.md`, `.claude/**`, `.github/**`, `docs/adr/**` and gate-defining configs (`eslint.config.*`, `tsconfig.json`, `vitest.config.*`, `playwright.config.*`, `lighthouserc.json`, `package.json`).
- [ ] S7-AC3 A contract test (`tests/unit/claude-settings.test.ts`) parses `settings.json` and fails if any required deny or ask rule is missing or moved to allow. Loosening a guardrail must be a visible diff and must fail a test.
- [ ] S7-AC4 Manual check by Daniel, recorded in the PR: `cat .env.local` and `gh pr merge` are refused in a fresh session.

### S8 · `chore/claude-hooks` — hooks (§5.2)
Hooks are Node scripts (`.claude/hooks/*.mjs`), not shell scripts, so they behave the same on Windows and Linux. Their decision logic is in pure functions with unit tests.
- [ ] S8-AC1 **Format on write** (PostToolUse, Edit|Write): `.ts/.tsx/.js/.mjs` files get Prettier + `eslint --fix`; `.md/.mdx/.css/.json` files get Prettier only. Remaining ESLint errors go back to Claude (exit 2 + stderr). Other files are ignored.
- [ ] S8-AC2 **Protected paths** (PreToolUse, Edit|Write|NotebookEdit): writes to `.env*`, `assets-raw/**`, `**/*-snapshots/**` and `public/resume/**` are blocked with a reason.
- [ ] S8-AC3 **Protected paths, Bash** (PreToolUse, Bash): best-effort blocking of commands that clearly target those paths (redirects, `cp`/`mv`/`rm`/`tee`), of `--update-snapshots`/`-u` on Playwright, and of `rm -rf` on anything except `.next`, `test-results`, `playwright-report`, `.lighthouseci` and `coverage`. Documented as best-effort; branch protection and review are the backstop.
- [ ] S8-AC4 **Done check** (Stop): exits 0 without running anything if there is no `package.json`, if `stop_hook_active` is true (prevents loops), or if no `.ts/.tsx` file changed against `HEAD`. Otherwise it runs `pnpm typecheck && pnpm test --changed` and, on failure, returns `{"decision":"block"}` with the first errors.
- [ ] S8-AC5 **Session context** (SessionStart): prints the branch, the spec matched from the branch name (`<type>/<slug>` → `docs/specs/<slug>.md`, with its Status, or "no spec"), and `git status --short`.
- [ ] S8-AC6 Unit tests cover each hook's decision function, including path normalisation for Windows backslashes and mixed case.

### S9 · `chore/claude-agents-skills` — subagents + skills
- [ ] S9-AC1 Four agents in `.claude/agents/` (`reviewer`, `test-writer`, `perf-a11y-auditor`, `content-checker`), each with `name`, `description`, `tools` and a prompt that cites the docs it checks against.
- [ ] S9-AC2 `reviewer` and `content-checker` have no Edit/Write/NotebookEdit. `content-checker` also has no Bash. The contract test from S7-AC3 also asserts these frontmatter tool lists.
- [ ] S9-AC3 The `test-writer` path limit (`tests/**` only) is enforced by the S8 hook if hook input identifies the subagent; otherwise it relies on the prompt and on reviewer checks, and the PR says which (see W9).
- [ ] S9-AC4 Six skills in `.claude/skills/<name>/SKILL.md` (§5.4 minus `/add-asset`). Names don't collide with built-in commands (see W6). Skills with side effects (`implement`, `pr`, `ci-fix`) set `disable-model-invocation: true`.
- [ ] S9-AC5 `/spec` writes `docs/specs/<slug>.md` with `Status: Draft` and stops. `/implement` refuses unless the spec says `Status: Approved`.
### S10 · `chore/deploy-smoke` — production smoke test
- [ ] S10-AC1 **Daniel:** links the repo to a Vercel project. Previews deploy per PR and production deploys from `main`.
- [ ] S10-AC2 A Playwright `smoke` config reads `BASE_URL` and checks `/` (200, title present, no console errors).
- [ ] S10-AC3 A workflow triggered by `deployment_status` (state `success`, environment `Production`) runs the smoke test against the deployed URL.
- [ ] S10-AC4 Rollback steps (Vercel "Promote previous" or `git revert`) are written in `docs/workflow.md` §8 or in `CLAUDE.md`.

### S11 · `feat/placeholder-home` — the full-cycle proof
Runs exactly as §2 describes. It needs its own spec (`docs/specs/placeholder-home.md`) written with `/spec`.
- [ ] S11-AC1 Every stage from 1 to 12 happens: an issue, `/spec`, Daniel's approval, a branch, failing tests first, implementation, `/self-review` clean, `/pr`, all CI checks green, a Vercel preview checked on a real Android phone and an iPhone, a squash merge by Daniel, production deploy, smoke test green, `/retro`.
- [ ] S11-AC2 The page meets every Sprint 0 budget on all 3 projects, has no horizontal scroll at 320 px, sets `lang`, `<title>` and meta description, and sends `robots: noindex` until Phase 5 (see Q5).
- [ ] S11-AC3 The page makes no claims that would need `claims.md` (see Q5).
- [ ] S11-AC4 `/retro` output results in at least one approved edit to `CLAUDE.md`, a hook or a skill, or an explicit "no changes".

**Sprint 0 is done when** S1–S11 are merged, each gate has a recorded proof of red, and `main` is protected.

## UX notes (mobile first)
The only visitor-facing output is the placeholder page in S11: one screen with the name and a single line, readable at 320 px, with system fonts and no client JS beyond what Next.js requires. Design work starts in Phase 1.

## Technical approach
- **Versions:** latest stable Next.js, Tailwind, Playwright and Vitest when S2 starts, recorded in ADR 0001. Node uses the current **even-numbered LTS**, the same locally and in CI. The local machine has Node 25.9, an odd-numbered release that is already end-of-life.
- **Next.js 16+:** use the `eslint` CLI directly (`next lint` is gone). Turbopack is the default; Tailwind v4 uses CSS-first config.
- **Folder layout:** follows plan §9. Sprint 0 creates only `app/`, `tests/unit`, `tests/e2e`, `.claude/`, `.github/`, `docs/`.
- **JS budget:** measured as script transfer size on `/` through Lighthouse CI. That is the bytes a phone actually downloads, and it avoids depending on `next build` output, which changes between Next versions.
- **Lighthouse target:** CI runs Lighthouse against `next start` on the runner, not the Vercel preview. This is deterministic, needs no auth, and doesn't wait on a deploy (see Q2).
- **Hooks:** called as `node "$CLAUDE_PROJECT_DIR/.claude/hooks/<name>.mjs"`. Each one reads JSON from stdin, and its logic is exported for tests.
- **Prerequisites (Daniel):** `corepack enable` (pnpm is not installed), install `gh` and run `gh auth login` (not installed), install a Node LTS, and have a Vercel account.

## Test plan
- Unit: hook decision functions, the settings/agents contract test, and the stub page component.
- E2E: smoke + axe on `android`, `iphone` and `desktop`; production smoke after deploy.
- A11y: axe, zero serious or critical violations. Perf: Lighthouse mobile on `/`, with the 150 KB JS budget.
- Each gate: a recorded proof of red.
- Real device: S11 only.

## Risks / open questions

### Decisions needed before S1 is approved
- **Q1 — How is a spec marked approved? ✅ Decided (2026-10-21): status line.** Each spec has `Status: Draft | Approved`, and only Daniel changes it to Approved. `/implement` and the SessionStart hook read it.
- **Q2 — Lighthouse against local build or Vercel preview? ✅ Decided (2026-10-21): local build in CI** (`next start` on the runner) is the required gate. A preview run can come later as a separate, non-required check; it needs a Vercel protection-bypass secret (W10).
- **Q3 — How are visual baselines created when the hook blocks writes to them? ✅ Decided (2026-10-21): a CI job only Daniel triggers.** A `workflow_dispatch` "update-snapshots" job regenerates them on Linux and commits them to the PR branch. The CLAUDE.md rule becomes "never update baselines; Daniel runs update-snapshots", which matches the hook. The job is built in Phase 1; the hook ships now.
- **Q4 — Node version. ✅ Decided (2026-10-21): current Active LTS,** pinned in `.nvmrc`, `engines` and CI. The exact version is confirmed at the start of S2. Daniel replaces the local Node 25 install before S2.
- **Q5 — Placeholder copy and indexing. ✅ Decided (2026-10-21):** "Daniel Dominic — portfolio coming soon", with no role or metrics, plus `noindex` until Phase 5.
- **Q6 — `asset-pipeline` agent and `/add-asset` now? ✅ Decided (2026-10-21): deferred to Phase 4,** where a slice adds them together with the `assets:*` scripts.
- **Q7 — Public or private repo? ✅ Decided (2026-10-21): public, with private notes split out.** Employer-permission notes, NDA cautions, unverified claims and open questions (plan §1 "Decision needed", §6 "Needs verification" blocks, §12 open questions) move to gitignored `docs/private/`, and `docs/plan.md` keeps a pointer. This goes into S1. The first commit (`f8deb46`, already on `origin/main`) contains the unsplit plan, so the history needs cleaning before the repo is public.
- **Q7a — History cleanup. ✅ Decided (2026-10-21): fresh history.** Daniel makes the repo private until S1 is ready. Claude prepares one clean root commit locally (split plan, no private content). Daniel does the force-push to `main`; Claude never force-pushes, per §5.1 deny rules. After that, Daniel makes the repo public. This happens before branch protection (S6-AC6), which would block the force-push.

### Things in the docs that are wrong or won't work as written
- **W1 — Plan mode can't write files.** §2 and §5.4 say `/spec` enters plan mode and drafts `docs/specs/<feature>.md`, but plan mode is read-only. Fix: draft in plan mode and write the file after the plan is approved, or skip plan mode and rely on `Status: Draft` + stop as the gate.
- **W2 — Edit/Write hooks and `Read(.env*)` deny don't cover Bash.** `cat .env`, `cp x assets-raw/` or `playwright -u` get around them. Fix: add the Bash PreToolUse hook (S8-AC3) and Bash deny patterns, and treat them as best-effort.
- **W3 — Some §5.1 rules can't be written as permission patterns.** "`rm -rf` outside `.next/` and `test-results/`" can't be expressed because deny overrides allow, and "pushing to main" can be bypassed with refspecs (`HEAD:main`, upstream tracking). Fix: enforce `rm` with a hook; branch protection is the real guard for `main`.
- **W4 — Required reviews would lock you out.** `gh pr create` runs under your account, so you're the PR author and GitHub won't let you approve your own PR. Set required approvals to 0 and require PR + checks only.
- **W5 — The Stop hook as described would loop and slow every turn.** It needs a `stop_hook_active` guard, a "no code changed" skip, and a no-op before `package.json` exists. Otherwise a red `main` would stop Claude from ever finishing, even in a docs-only session like this one.
- **W6 — `/review` may collide with a built-in command.** Claude Code ships review commands (`/code-review`, and historically `/review`). **✅ Decided (2026-10-21): renamed to `/self-review`.** `docs/workflow.md` §2 and §5.4 are updated in S1.
- **W7 — ESLint on `*.md(x)`** (§5.2) fails without a markdown plugin. Use Prettier only for md/css.
- **W8 — Visual baselines made on Windows won't match Linux CI** (font rendering). They must be generated on Linux (see Q3).
- **W9 — Subagent `tools` lists can't limit paths.** "test-writer: write under `tests/`" and "reviewer: read-only + run tests" can't be enforced that way, and giving the reviewer Bash already breaks "read-only". This is handled in S9-AC3; the docs should say the limit is enforced by the prompt or a hook, not by the tool list.
- **W10 — "Vercel preview" in CI ignores Deployment Protection.** Previews require Vercel login by default, so Lighthouse and smoke runs against them get 401 without a bypass secret.
- **W11 — LinkedIn returns HTTP 999 to automated link checkers.** The §3 promise to "catch dead LinkedIn links" won't hold. Allowlist LinkedIn in the checker and check it by hand before release (Phase 1/5).
- **W12 — §5.1 allowed paths miss files the project needs.** `styles/`, `public/`, `scripts/` and root config files aren't listed. Recommendation: gate-defining configs go under *ask* (S7-AC2). Loosening an ESLint rule or a Lighthouse threshold is the same as weakening a test, and §6 already says "never loosen budgets silently".
- **W13 — The CLAUDE.md skeleton and `pnpm verify` overpromise.** The skeleton lists commands that won't exist until Phase 4 (an agent will try to run them). "`pnpm verify` = everything CI runs" can't be true, because CI also runs preview Lighthouse and link checks. S6-AC4 and S7-AC1 define both precisely.
- **W14 — Minor:** the first commit message says it added `claude.md`, but no `CLAUDE.md` exists. Plan header says its source is "concepts discussed in this conversation", which isn't in the repo, so agents can't see it.

### Plan issues for later phases (not blocking Sprint 0)
- **P1 — 3D lighting contradicts itself.** Plan §11 says "lighting baked into textures"; plan §3.1 and workflow §7 say runtime HDRI environment lighting. A runtime HDRI also eats into the 5 MB budget. Decide in the Phase 4 ADR: bake, or use a small prefiltered env map that counts toward the budget.
- **P2 — Compression choices left open.** Workflow §7 lists both "Meshopt/Draco" and "KTX2/WebP". Pick one of each in that ADR.
- **P3 — Hero CTAs disagree.** Plan §2: secondary "View Resume", tertiary "Let's Connect". Plan §5.1: secondary "Download Resume", tertiary "Explore in 3D".
- **P4 — `/explore` placement is unclear.** It's #2 in the *Lab* release order, but it's a top-level route and the MVP table calls it the first post-launch feature. Lab 01 "may be folded" into it, so it's unclear whether Lab 01 exists at all.
- **P5 — Navbar "Resume ↗"** uses an external-link arrow for a same-site PDF.
- **P6 — No domain yet.** `metadataBase` and canonical URLs need one. Until Phase 5, use an env var set to the Vercel URL.

### Risks
- **Lighthouse noise on shared CI runners.** Mitigated by taking the median of 3 runs. The placeholder page should score well above the thresholds.
- **Sprint 0 will prompt a lot.** Almost every slice touches `.claude/`, `.github/` or configs, which are ask-first by design.
- **Bootstrap gap.** S1–S5 merge before every check exists, so S1–S5 rely on Daniel's review plus the proofs of red, and full enforcement starts at S6-AC6.
- **Windows-specific hook behaviour** (env var expansion, quoting in the hook `command`). Verify in S8 on Daniel's machine and in a Linux session.
