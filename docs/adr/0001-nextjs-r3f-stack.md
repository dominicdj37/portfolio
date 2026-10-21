# ADR 0001 — Next.js + React Three Fiber stack

Status: **Accepted** — Daniel, 2026-10-21 (drafted by Claude)
Related: docs/plan.md §9, docs/workflow.md §3, docs/specs/sprint-0-foundation.md

## Context

The portfolio is a mostly static, content-heavy, mobile-first site (home, four case studies, about, contact). It also has two interactive parts: a Lab with browser demos, and an optional 3D Workspace at `/explore`. Constraints:

- Content must never depend on WebGL. 3D loads only on `/explore` and in the Lab.
- Mobile budgets: Lighthouse performance ≥ 90 and home-page JS ≤ 150 KB; the 3D scene ≤ 5 MB.
- Case studies are long-form, version-controlled writing.
- One developer, working mostly through a coding agent, so the stack should be mainstream and well documented, with fast feedback.
- Preview deploys per PR and a one-click rollback.

## Decision

| Concern | Choice |
|---|---|
| Framework | **Next.js, App Router**, React Server Components by default, static rendering where possible |
| Language | **TypeScript**, `strict` + `noUncheckedIndexedAccess` |
| Runtime | **Node.js Active LTS**, the same locally and in CI; exact major pinned in S2 (`.nvmrc`, `engines`) |
| Package manager | **pnpm**, version pinned via `packageManager` + corepack |
| Styling | **Tailwind CSS**; Radix primitives and Motion added when first needed (Phase 1) |
| Long-form content | **MDX** (Phase 2) |
| 3D | **React Three Fiber + drei + Three.js**, dynamically imported with `ssr: false`, only on `/explore` and Lab routes (Phase 3–4) |
| Lint / format | ESLint (flat config, `eslint` CLI) + Prettier |
| Tests | Vitest + Testing Library; Playwright (Android, iPhone, desktop projects) with `@axe-core/playwright`; Lighthouse CI against a local production build |
| CI | GitHub Actions |
| Hosting | **Vercel**: a preview per PR, production from `main` |

Versions: the latest stable release of each tool at the start of S2, recorded in `package.json` and the lockfile.

## Alternatives considered

- **Astro + React islands.** A strong fit for a content site and very low JS by default; R3F can run in an island. Not chosen because Next.js is what plan §9 assumes, and it has the larger ecosystem for MDX and React components. The JS budget in CI holds Next.js to a similar standard.
- **Vanilla Three.js** instead of R3F. Smaller runtime, but more glue code to keep the scene in sync with React UI (panels, List view). R3F/drei provide camera controls, loaders and `Html` overlays.
- **Netlify / Cloudflare Pages** instead of Vercel. They're viable. Vercel is the reference platform for Next.js, so features work without adapters.

## Consequences

- Client JS has to be watched: `"use client"` only where interaction needs it (a CLAUDE.md rule). The Lighthouse CI script-size budget fails PRs that exceed it.
- 3D code and assets never reach the home bundle, because of the dynamic import plus route-level separation. Phase 4 adds an e2e check for this.
- Hosting is tied to Vercel for preview and rollback. Moving away later means replacing preview-per-PR and the deployment-status smoke trigger.
- Next.js majors change often (for example, `next lint` was removed). Upgrades get their own `chore/` PR, never mixed with features.
- Revisit this ADR if the JS budget can't be met with App Router, or if `/explore` needs a different renderer.
