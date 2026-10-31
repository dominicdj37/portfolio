# Portfolio — project guide for Claude

## What this is

Personal portfolio for Daniel Dominic (senior Android engineer). Plan: docs/plan.md. How we work: docs/workflow.md.
Mobile-first. Content is 2D and must never depend on WebGL. 3D lives at /explore only.
Stack and pinned versions: docs/adr/0001-nextjs-r3f-stack.md (Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, pnpm, Node 24).
Windows dev machine, Linux CI. Use forward slashes and cross-platform Node scripts, never shell-specific ones.

## Commands

- `pnpm dev` | `pnpm build` | `pnpm start`
- `pnpm typecheck` | `pnpm lint` | `pnpm format`
- `pnpm test` (Vitest, `tests/unit/**`)
- `pnpm e2e` (Playwright: android, iphone, desktop) | `pnpm e2e:mobile`. Both run against the production server, so run `pnpm build` first.
- `pnpm lhci` (Lighthouse CI, needs a build)
- `BASE_URL=<url> pnpm smoke`, or `$env:BASE_URL="<url>"; pnpm smoke` in PowerShell (smoke test against a deployed site)

## How we work

1. **Spec first.** Before building a feature, write a spec in docs/specs/ from docs/specs/\_template.md with `Status: Draft` and stop. Build only once Daniel approves it (he changes the Status line to **Approved**, or tells you to). Public content comes from the approved spec.
2. **ADRs** in docs/adr/ record real decisions (stack, architecture, budgets).
3. **Tests run on demand only.** Nothing runs automatically in CI. After each feature PR is merged and Vercel has deployed it, ask Daniel whether to run any of: unit (`pnpm test`), e2e (`pnpm e2e`), Lighthouse (`pnpm lhci`), smoke (`pnpm smoke` against production). Run them locally, or through the manual `Tests` and `Production smoke` GitHub workflows.

## Notes

- Server components by default; `"use client"` only where interaction needs it.
- Next.js 16 differs from older versions. Check the version-matched docs in `node_modules/next/dist/docs/` before using a Next.js API.
- Don't read `.env*`, `assets-raw/` or `docs/private/`.
- No camera/AR features (getUserMedia, WebXR). They're out of scope.
