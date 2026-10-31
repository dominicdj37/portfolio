# CASABOT case study — resume-only content

Plan reference: docs/plan.md §6 (case-study model), §6.1 (CASABOT), §13 Phase 2; docs/specs/site-v1.md (case-study template, content inventory) Issue: #—
Status: **Approved** — Daniel, 2026-10-31 (line updated by Claude on instruction; Q1 and Q2 as recommended)

## Goal

A tech lead reading `/work/casabot` on a phone sees the full CASABOT story the resume tells: what Daniel owned, how the app is built, the AR re-platform and how it was released. Every statement on the page, and every CASABOT line elsewhere on the site, comes from the resume (`daniel_dominic_resume_2026_generic.pdf`, CASABOT section) and nothing else (Daniel, 2026-10-31). Anything beyond the resume is reviewed by Daniel at final deployment, not in this spec.

## Scope / Out of scope

**In scope**

- Fill the CASABOT case study's Context, My ownership, Engineering challenge, Architecture, Implementation and Outcome from the resume (inventory below). Trade-offs and What I learned stay empty, so the template leaves them out (site-v1 AC42).
- Remove the CASABOT claims the resume doesn't make: "Matter device onboarding", "four production releases" and "analytics telemetry", in `data/projects.ts`, `data/experience.ts` and `data/skills.ts`.
- One PR, `content/casabot-case-study`, data and tests only. No new components or dependencies.

**Out of scope**

- The MDX pipeline (Q1). The template already renders these sections from typed data.
- Diagrams, screenshots, AR video and code snippets: none of them are in the resume.
- BeVigil, My Tax India and Nexus 3D (one spec each, same approach).
- The About principles (PRN-1 to PRN-4), which Daniel revises separately.

## Content inventory (CASABOT, from the resume)

Text ships exactly as written here. "Resume" means the CASABOT bullet it is taken from.

| ID     | Where                                         | Content                                                                                                                                                                                                                                                          | Source               |
| ------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| CAS-1  | Case study · Context                          | CASABOT AI Home is a smart-home Android app: real-time smart-device control, a voice and chat assistant, live camera streaming, push notifications, and secure credential storage with biometric app lock.                                                       | Resume, bullet 4     |
| CAS-2  | Case study · My ownership                     | Owned the app end to end as the sole Android engineer: architecture, development, testing and Play Store releases.                                                                                                                                               | Resume, bullet 1     |
| CAS-3  | Case study · My ownership                     | Set the coding, testing and release standards and best practices for the Android codebase.                                                                                                                                                                       | Resume, bullet 2     |
| CAS-4  | Case study · My ownership                     | Coordinated with the backend and iOS teams on API contracts and shared app-behavior documentation, with work tracked in Jira.                                                                                                                                    | Resume, bullet 5     |
| CAS-5  | Case study · My ownership                     | Used agentic AI workflows (Claude Code with MCP tool integrations, custom hooks, ADRs) to speed up development, while owning design, code review and test coverage.                                                                                              | Resume, bullet 7     |
| CAS-6  | Case study · Engineering challenge            | The AR feature was the product's key differentiator. I shipped the first version on the SceneView library, then, after evaluating its limits, re-platformed it onto a custom engine.                                                                             | Resume, bullet 3     |
| CAS-7  | Case study · Architecture                     | A single-activity app with a 100% Jetpack Compose UI, MVVM with ViewModel and StateFlow, Hilt and Room.                                                                                                                                                          | Resume, bullet 2     |
| CAS-8  | Case study · Implementation                   | The AR feature runs on a custom multithreaded ARCore + Filament engine. I designed ViewNode, which renders live, touchable Compose UI onto 3D surfaces. For real-time smart-device control, I built capability-driven control UIs with optimistic state updates. | Resume, bullets 3, 4 |
| CAS-9  | Case study · Outcome                          | Took the app from an empty repository to a live product on Google Play.                                                                                                                                                                                          | Resume, bullet 1     |
| CAS-10 | Case study · Outcome                          | Managed the release cycle across QA, internal, closed-testing and production tracks.                                                                                                                                                                             | Resume, bullet 6     |
| CAS-11 | Case study · Outcome                          | Diagnosed crashes and ANRs using Firebase Crashlytics and Android Studio Profiler.                                                                                                                                                                               | Resume, bullet 6     |
| CAS-12 | About · career timeline, CASABOT highlight 3  | Managed releases across QA, internal, closed-testing and production tracks. (replaces "Four production releases.")                                                                                                                                               | Resume, bullet 6     |
| CAS-13 | Home · Capabilities, Android Engineering tile | Built the CASABOT AI Home app with a 100% Jetpack Compose UI, MVVM, Hilt and Room. (replaces "…on Compose, MVVM with use cases, Hilt and Room.")                                                                                                                 | Resume, bullet 2     |
| CAS-14 | Home · Capabilities, Architecture tile        | Sole Android engineer, from an empty repository to a live product on Google Play. (replaces "…to four production releases.")                                                                                                                                     | Resume, bullet 1     |
| CAS-15 | Home · Capabilities, Quality tile             | Managed QA, internal, closed-testing and production tracks, and diagnosed crashes and ANRs with Crashlytics. (replaces "…with Crashlytics telemetry.")                                                                                                           | Resume, bullet 6     |

**Unchanged:** the CASABOT title, angle, domain, role, period, tags, status, Play Store link (LNK-1), the case-study title and summary line (site-v1, Q2), and the existing Immersive Computing capability tile, which already matches resume bullet 3.

**Superseded:** site-v1 inventory row EXP-5 ("four production releases") no longer ships; this spec replaces it.

## Acceptance criteria (each becomes ≥1 test)

- [ ] AC1 — The CASABOT `caseStudy` fields equal CAS-1 to CAS-11 exactly: context (CAS-1), ownership (CAS-2 to CAS-5, in order), challenge (CAS-6), architecture (CAS-7), implementation (CAS-8), outcome (CAS-9 to CAS-11, in order); `tradeOffs` and `learned` are undefined. _Unit (content test)._
- [ ] AC2 — The CASABOT timeline highlights and the three capability evidence lines equal CAS-12 to CAS-15. _Unit (content test)._
- [ ] AC3 — No CASABOT-related text in `data/` contains "Matter", "four production releases" or "telemetry". _Unit; proof of red in the PR._
- [ ] AC4 — `/work/casabot` shows, in plan §6 order, Context, My ownership, Engineering challenge, Architecture, Implementation, Outcome and Links, with no Trade-offs or What I learned section, and the table of contents lists the same seven. _Component + e2e (android, iphone, desktop)._
- [ ] AC5 — axe finds no violations on `/work/casabot`, `/` and `/about` in dark and light. _E2e a11y (existing suite)._
- [ ] AC6 — `/work/casabot` stays inside the Lighthouse gates (performance ≥ 0.90, accessibility ≥ 0.95, 300 KB script budget). _Lighthouse CI (existing)._
- [ ] AC7 — **Daniel:** reads `/work/casabot` on a real phone before the final deployment.

## UX notes (mobile first)

- **320 px / 390 px:** the existing single-column template; the collapsed "On this page" menu grows from three entries to seven. Paragraphs stay short (one to three sentences), so no section needs scrolling past a screen on its own.
- **Desktop:** the existing sticky table of contents and reading-progress bar.
- No new components, motion or media.

## Technical approach

- Data-only change in `data/projects.ts`, `data/experience.ts` and `data/skills.ts`. The template (`components/case-study/case-study.tsx`) already renders `challenge`, `architecture` and `implementation` as paragraphs and leaves out empty fields.
- No client JS, no new dependency, no ADR.

## Test plan

- **Unit:** extend `tests/unit/content.test.ts` with exact-string checks for CAS-1 to CAS-15 (AC1, AC2) and a check that CASABOT text has no "Matter", "four production releases" or "telemetry" (AC3, with a throwaway failing commit linked in the PR). Extend `tests/unit/case-study.test.tsx` for the seven CASABOT sections (AC4).
- **E2e:** CASABOT table of contents on all three devices (AC4); the existing axe runs (AC5).
- **Visual:** the `/`, `/about` and case-study baselines change with the new text, so Daniel runs `update-snapshots` on the PR.
- **Perf:** existing Lighthouse CI on `/work/casabot` (AC6).

## Risks / open questions

### Decided (2026-10-31): both as recommended

- **Q1 — MDX deferred. ✅** site-v1 put the MDX pipeline in "the first case-study content spec". Resume-only content is a few sentences per section, which typed data already handles. Recommend **deferring MDX** until a case study needs sub-heads, diagrams or code (and noting that in this spec instead of site-v1).
- **Q2 — Headline copy. ✅** The case-study title ("Architecting a smart-home Android app with immersive AR") and summary line come from plan §6.1 and were approved in site-v1; they paraphrase the resume rather than quote it. Recommend **keeping them**; say if you want them replaced with resume wording.

### Risks

- **Thinner page.** Without trade-offs or reflections the case study reads more like a structured résumé entry than a deep dive. That's the intended scope; more can come after Daniel's final-deployment review.
