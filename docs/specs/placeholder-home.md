# Placeholder home page

Plan reference: docs/specs/sprint-0-foundation.md S11 (the full-cycle proof); docs/plan.md §10 (accessibility minimums), §11 (SEO) Issue: #11
Status: **Approved** — Daniel, 2026-10-22 (line updated by Claude on instruction; Q1–Q5 as recommended)

## Goal

A visitor who finds the production URL sees one clean, readable screen: Daniel's name and a line saying the portfolio is coming soon. Search engines are told not to index it. Its real purpose is to take a trivial page through all 12 stages of the workflow (§2) once, so the loop is proven before Phase 1.

## Scope / Out of scope

**In scope**

- `/`: the name as the only `<h1>`, plus one line of copy (Q1), inside a `<main>` landmark.
- Site-wide metadata in `app/layout.tsx`: `lang`, `<title>`, meta description, and `robots: noindex, nofollow` until Phase 5 (Sprint 0 Q5).
- `docs/content/claims.md`, created with headings and no claims (S11-AC3). `CLAUDE.md` already refers to it.
- Updated unit and e2e tests for the new copy and metadata.
- The process steps of S11-AC1 and S11-AC4: an issue, a preview checked on real phones, the merge, the production smoke test, and a retro.

**Out of scope**

- Role, tagline, metrics, employers, or any other claim (Sprint 0 Q5). That waits for Phase 0 content.
- Links (LinkedIn, GitHub, email, resume). See Q2. The link checker comes in Phase 1.
- Design tokens, web fonts, logo, favicon, Open Graph image, `metadataBase` / canonical URLs (plan P6), `sitemap.ts`, `robots.ts`, and analytics. All of these are Phase 1 or Phase 5.

## Acceptance criteria (each becomes ≥1 test)

- [ ] AC1 — `/` renders exactly one `<h1>` reading "Daniel Dominic" and the line "Portfolio coming soon." (Q1), both inside `<main>`. _Component (Vitest) + e2e (android, iphone, desktop)._
- [ ] AC2 — The document has `<html lang="en">`, the `<title>` "Daniel Dominic — portfolio coming soon", and a non-empty meta description (Q1). _E2e (all 3 projects)._
- [ ] AC3 — The page sends `<meta name="robots" content="noindex, nofollow">`. There is no `robots.txt` `Disallow`, because that would stop crawlers from ever seeing the `noindex`. _E2e._
- [ ] AC4 — There is no horizontal scroll at 320 px wide (`scrollWidth <= clientWidth` at 320 × 568). The text stays readable at 200% zoom on a 390 px viewport. _E2e (android project, with the viewport overridden)._
- [ ] AC5 — There are zero axe violations with impact `serious` or `critical` (WCAG 2.2 A/AA), including colour contrast in both light and dark colour schemes (Q3). _E2e (all 3 projects, using `expectNoA11yViolations`; dark mode via `colorScheme: "dark"`)._
- [ ] AC6 — Every Sprint 0 budget holds: Lighthouse mobile performance ≥ 0.90, accessibility ≥ 0.95, and script transfer ≤ 150 KB. _Lighthouse CI (existing `lighthouse` job)._
- [ ] AC7 — No client JS beyond what Next.js requires: nothing under `app/` contains `"use client"`. _Unit (scans `app/**`), backed by the AC6 script budget._
- [ ] AC8 — The page makes no claim that needs `claims.md`: it shows only the name and the coming-soon line. `docs/content/claims.md` exists with its headings and no claims. _Unit (the rendered text equals exactly those two strings) + review._
- [ ] AC9 — **Daniel:** opens the Vercel preview on a real Android phone and a real iPhone and checks that it reads well and nothing is cut off or scrolls sideways. He notes the device and browser in the PR.
- [ ] AC10 — The full cycle happens, with each stage recorded in the PR:
  - Issue, spec, approval, a `feat/placeholder-home` branch, failing tests first, implementation.
  - `/self-review` clean, `/pr`, all CI checks green, the preview checked (AC9).
  - **Daniel:** squash merge.
  - Production deploy, then a green "Production smoke" run on the merge commit.
- [ ] AC11 — A retro after the merge, written by Claude in the PR or chat (`/retro` is deferred). It ends in at least one approved edit to `CLAUDE.md`, a hook or a skill, or an explicit "no changes" from Daniel.

## UX notes (mobile first)

- **320 px:** one column with a 16 px side gutter. The `<h1>` uses about 1.875 rem with tight leading, and the coming-soon line is about 1 rem in a muted colour with at least 4.5:1 contrast. The content is vertically centred in the viewport (`min-h-dvh`), so it fills one screen without scrolling.
- **390 px:** the same layout. This is the PR template's mobile screenshot width.
- **Desktop (1440 px):** the same centred block, with the `<h1>` stepping up to about 2.25–3 rem. Text width is capped (`max-w-prose`); nothing is stretched edge to edge.
- System font stack (Tailwind's default `font-sans`) and no web fonts.
- Light and dark follow the OS setting (`prefers-color-scheme`, Tailwind `dark:`), if Q3 is yes.
- No motion, so there's nothing for `prefers-reduced-motion` to handle.

## Technical approach

- **`app/layout.tsx`** (server component): `metadata` gets `title`, `description` and `robots: { index: false, follow: false }`.
  - The robots setting lives in the layout, so every future page inherits `noindex` until Phase 5 flips it in one place.
  - `lang="en"` is already set.
  - A body class sets the base text and background colours for light and dark.
- **`app/page.tsx`** (server component): `<main>` with the `<h1>` and the paragraph, styled with Tailwind utilities only.
- **`docs/content/claims.md`**: a short header explaining the claims rule, then empty sections (Identity, Experience, Projects, Metrics, Links), each with a table header (Claim · Source · Status) and no rows.
- **JS budget:** no change. The page stays a server component with no client components or new dependencies, so script transfer stays at the framework baseline (~134 KB of 150 KB).
- **No new dependency, no ADR.**
- **Smoke test:** the production smoke test matches the title against `/Daniel Dominic/`, so it keeps passing with the new title.

## Test plan

- **Unit / component (Vitest):**
  - Update `tests/unit/home-page.test.tsx`: one `<h1>` with the name, the coming-soon line, and the rendered text equal to exactly those two strings (AC1, AC8).
  - A new test scans `app/**` for `"use client"` (AC7).
- **E2e (Playwright), on android, iphone and desktop:**
  - Extend the e2e smoke spec, or add `tests/e2e/home.spec.ts`, to check the heading and line (AC1), `lang`, title and description (AC2), and robots meta (AC3).
  - Check no horizontal scroll at 320 px (AC4).
  - Run axe in light and dark schemes (AC5).
- **Lighthouse:** the existing `lighthouse` job (AC6).
- **Manual:** a real-phone check on the preview (AC9); the process steps and retro (AC10, AC11).
- **Production:** a "Production smoke" run after the merge (AC10).

## Risks / open questions

- **Q1 — Exact copy.** Sprint 0 Q5 settled on "Daniel Dominic — portfolio coming soon", with no role or metrics. **Recommendation:**
  - `<h1>`: "Daniel Dominic".
  - Line: "Portfolio coming soon."
  - `<title>`: "Daniel Dominic — portfolio coming soon".
  - Meta description: "The portfolio of Daniel Dominic is coming soon."

  None of these is a claim.

- **Q2 — Any links?** For example GitHub, LinkedIn or email. **Recommendation: none for now.** Q5 said "a single line", and LinkedIn can't be link-checked automatically (W11). Links arrive with the Phase 1 footer.
- **Q3 — Dark mode?** **Recommendation: yes, following the OS setting.** It costs two or three Tailwind classes and no JS. A white screen at night on a phone is the first thing a visitor would notice. Axe then checks both schemes (AC5).
- **Q4 — The GitHub issue (stage 1 of the cycle).** **Recommendation:** after approval, Claude creates the issue "Placeholder home page (S11)" with `gh issue create`, linking this spec (that command asks for permission). The PR then closes it.
- **Q5 — Do previews count for the real-phone check?** Vercel previews are behind Deployment Protection, so your phones need to be logged in to Vercel, or you can use a shareable link from the Vercel toolbar. **Recommendation:** use the shareable link. Checking production after merge instead would skip a gate.
- **Risk — Lighthouse noise.** A near-empty page should score well above the thresholds. If CI comes in borderline, investigate rather than lower the threshold.
