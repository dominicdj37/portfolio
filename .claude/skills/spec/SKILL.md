---
name: spec
description: Draft a feature spec in docs/specs/ from the template with Status Draft, then stop for Daniel's approval. Use when starting any feature, fix or content change that has no Approved spec yet.
argument-hint: <issue number or short feature description>
---

# /spec: draft a spec, then stop

Input: $ARGUMENTS (a GitHub issue number, or a short description of the feature).

This skill writes **one file** and changes nothing else: no branch, no tests, no code. CLAUDE.md allows implementation only from a spec whose `Status:` line says **Approved**, and only Daniel sets that.

## Steps

1. **Gather context.**
   - For an issue number, read it with `gh issue view <n>`.
   - Read `CLAUDE.md`, the matching section of `docs/plan.md`, any related spec in `docs/specs/`, and the accepted ADRs in `docs/adr/`.
   - For content work, read `docs/content/claims.md`.
   - Don't read `docs/private/`.
2. **Check that it's new.** If a spec for this feature already exists, update that file instead and keep its Status. If its Status is Approved, ask Daniel before changing anything, because an edit to an approved spec needs his approval again.
3. **Ask, don't guess.** Ask Daniel about anything you can't settle from the repo: what the visitor gets, scope boundaries, copy, and any metric or claim. Never invent numbers, employers, dates or results. A claim that isn't in `claims.md` with a source goes under "Risks / open questions", not into the spec.
4. **Write `docs/specs/<slug>.md`** from `docs/specs/_template.md`. Use a short kebab-case slug, matching the branch you'd later create (`feat/<slug>`).
   - Keep the template's headings and order.
   - Set the status line to exactly `Status: **Draft** <!-- only Daniel changes this to Approved -->`.
   - Fill in `Plan reference:` with the plan section and `Issue: #<n>`, or `#—` if there's no issue.
   - Number the acceptance criteria `AC1`, `AC2`, …. Each one must be observable and testable, and should name its test type (unit, component, e2e on android/iphone/desktop, a11y, Lighthouse). A criterion that only Daniel can check, like a real-phone test, is marked **Daniel:**.
   - Write the UX notes mobile first, at 320 px and 390 px before desktop.
   - In Technical approach, prefer server components, and note any JS-budget impact. Flag anything that needs a new dependency or an ADR.
   - Under "Risks / open questions", number the decisions Daniel needs to make (`Q1`, `Q2`, …) and give a recommendation for each.
   - Keep the feature small enough for one PR of about 400 changed lines. If it's bigger, split it into slices, like `sprint-0-foundation.md` does.
5. **Format** the file with Prettier (the format-on-write hook does this automatically).
6. **Stop.** Reply with the path, a summary of the scope and acceptance criteria in three to five lines, and the open questions. Say that Daniel approves by changing the Status line, or by telling you to. Don't create a branch, commit, or start tests until the spec is Approved.

Never set `Status: Approved` yourself. The only exception is when Daniel explicitly tells you to in this session; then record it as `Status: **Approved** — Daniel, <date> (line updated by Claude on instruction)`.
