# Daniel Dominic — Portfolio

Personal portfolio of Daniel Dominic, senior Android engineer. Built with Claude Code; Daniel approves what gets built and merges every change.

> **Live:** https://portfolio-mu-inky-3anc9yn1ky.vercel.app (marked `noindex` until launch)

## How it's built

1. **Spec first.** Each feature starts as a spec in `docs/specs/`. Nothing is built until Daniel approves it.
2. **ADRs** in `docs/adr/` record the decisions that would be expensive to reverse.
3. **Tests on demand.** Nothing runs automatically. After a merge and Vercel deploy, Claude asks whether to run unit, e2e, Lighthouse or smoke tests.

Details: [docs/workflow.md](docs/workflow.md). The full plan: [docs/plan.md](docs/plan.md).

## What's next

| Phase                   | Goal                                                          |
| ----------------------- | ------------------------------------------------------------- |
| **2 · Case studies**    | Project deep-dives (CASABOT first)                            |
| **3 · Engineering Lab** | An interactive architecture explorer                          |
| **4 · 3D workspace**    | An optional 3D scene at `/explore`, with a full 2D fallback   |
| **5 · Launch**          | Custom domain, SEO switched on (`noindex` removed), analytics |

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Vitest · Playwright · axe-core · Lighthouse CI · GitHub Actions · Vercel · Claude Code.

Mobile first: content never depends on WebGL, and 3D lives only at `/explore`. The decision record is [ADR 0001](docs/adr/0001-nextjs-r3f-stack.md).

## Run it locally

Needs Node 24 and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # unit
pnpm build && pnpm e2e   # end-to-end on Android, iPhone and desktop
pnpm lhci         # Lighthouse budgets (after a build)
```

## Repository map

```text
app/                    the site (server components by default)
components/, data/      UI and the typed content
tests/unit/             Vitest
tests/e2e/              Playwright on Android, iPhone and desktop, plus axe
tests/smoke/            check against the deployed site
.claude/                Claude Code settings and the format-on-write hook
.github/workflows/      manual "Tests" and "Production smoke" workflows
docs/plan.md            what is being built
docs/workflow.md        how it is built
docs/specs/             one approved spec per feature
docs/adr/               architecture decisions
CLAUDE.md               Claude's project guide
```
