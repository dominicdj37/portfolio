# Portfolio — project guide for Claude

## What this is

Personal portfolio for Daniel Dominic (senior Android engineer). Plan: docs/plan.md. How we work: docs/workflow.md.
Mobile-first. Content is 2D and must never depend on WebGL. 3D lives at /explore only.
Stack and pinned versions: docs/adr/0001-nextjs-r3f-stack.md (Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, pnpm, Node 24).
Windows dev machine, Linux CI. Use forward slashes and cross-platform Node scripts, never shell-specific ones.

## Commands

- `pnpm dev` | `pnpm build` | `pnpm start`
- `pnpm typecheck` (`next typegen && tsc --noEmit`) | `pnpm lint` (fails on any warning) | `pnpm format` | `pnpm format:check`
- `pnpm test` (Vitest, `tests/unit/**`) | `pnpm test --changed`
- `pnpm e2e` (Playwright: android, iphone, desktop) | `pnpm e2e:mobile`. Both run against the production server, so run `pnpm build` first.
- `pnpm lhci` (Lighthouse CI on `/`, needs a build)
- `BASE_URL=<url> pnpm smoke` (post-deploy smoke test against a deployed site; CI runs it after each Production deploy)
- `pnpm verify` = `format:check → lint → typecheck → test → build → e2e`
- `pnpm verify:full` = `verify` + `lhci`
- Phase 4, not yet available: `pnpm assets:optimize` | `pnpm assets:check`

CI (`.github/workflows/ci.yml`) runs `static`, `typecheck`, `unit`, `build`, `e2e` and `lighthouse`. All six are required to merge into `main`.

## Rules

- Work only from a spec in docs/specs/ whose `Status:` line says **Approved**. Only Daniel sets that.
  If none exists, write one from docs/specs/\_template.md with `Status: Draft` and stop.
- Write or update tests before implementation. Never delete, skip or weaken a failing test to get green.
- Every new gate needs a proof of red: a throwaway commit showing the check fails on a deliberate violation, linked in the PR.
- Never loosen a budget or threshold silently (lighthouserc.json, lint rules, tsconfig). Propose it in a PR with the reason, and update docs/workflow.md §6 and the ADR.
- Server components by default; `"use client"` only where interaction needs it. The home page JS budget is 150 KB, and Next.js + React already use ~134 KB of it.
- Next.js 16 differs from older versions. Check the version-matched docs in `node_modules/next/dist/docs/` before using a Next.js API.
- Every public claim must exist in docs/content/claims.md with a source. Never invent metrics. Anything marked "pending verification" is unpublishable.
- No new dependency without stating why in the PR description.
- Keep PRs small: one spec (or one Sprint 0 slice) per PR, on a `feat/*`, `fix/*`, `content/*` or `chore/*` branch, with conventional commits.

## Never

- Push to `main`, merge PRs, or deploy to production. Branch protection enforces the first two.
- Update visual-regression baselines. Daniel runs the update-snapshots workflow.
- Read or commit `.env*`, anything from `assets-raw/`, `docs/private/`, or employer-confidential material.
- Add camera/AR (getUserMedia, WebXR) features. They're out of scope.

## Definition of done

Spec criteria covered by tests · `pnpm verify` green · /self-review clean ·
PR template complete, with mobile (390 px) and desktop (1440 px) screenshots for UI changes.
