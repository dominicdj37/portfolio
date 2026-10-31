# Daniel Dominic Portfolio — Workflow

> **Builder:** Claude Code. **Owner:** Daniel — approves specs, merges PRs, owns what goes public.
> Simplified on 2026-10-31 (Daniel): only spec-first, ADRs, format-on-write and on-demand tests remain.

---

## 1. The cycle

```text
spec (Draft) → Daniel approves → branch + build → PR → Daniel merges → Vercel deploys
           → Claude asks: run unit / e2e / Lighthouse / smoke?
```

1. **Spec.** Claude writes `docs/specs/<slug>.md` from `docs/specs/_template.md` with `Status: Draft` and stops.
2. **Approve.** Daniel changes the Status line to **Approved**, or tells Claude to.
3. **Build** on a short-lived `feat/*`, `fix/*`, `content/*` or `chore/*` branch, with conventional commits, and open a PR.
4. **Merge.** Daniel squash-merges; Vercel deploys `main` to production.
5. **Tests on demand.** Claude asks whether to run any of the suites below, and runs only the ones Daniel picks.

## 2. ADRs

Write a short ADR in `docs/adr/` (context → decision → consequences) whenever a choice would be expensive to reverse: framework, 3D library, hosting, a budget.

## 3. Claude Code setup

- `.claude/settings.json`: a broad allow list (pnpm, git, gh, file edits), so routine work doesn't prompt.
- Hook: `format-on-write` runs Prettier (and ESLint `--fix` where it applies) on every file Claude edits.

## 4. Tests (on demand only)

Nothing runs automatically, locally or in CI.

| Suite      | Local                                                                         | GitHub Actions                                 |
| ---------- | ----------------------------------------------------------------------------- | ---------------------------------------------- |
| Unit       | `pnpm test`                                                                   | Actions → **Tests** → Run workflow (tick unit) |
| End-to-end | `pnpm build && pnpm e2e` (Android, iPhone, desktop)                           | **Tests** (tick e2e)                           |
| Lighthouse | `pnpm build && pnpm lhci`                                                     | **Tests** (tick lighthouse)                    |
| Smoke      | `BASE_URL=<url> pnpm smoke` (PowerShell: `$env:BASE_URL="<url>"; pnpm smoke`) | Actions → **Production smoke** → Run workflow  |

Budgets checked when Lighthouse runs (`lighthouserc.json`): performance ≥ 90, accessibility ≥ 95, script transfer ≤ 300 KB, on `/`, `/about` and `/work/casabot`. Later, for `/explore`: scene ≤ 5 MB, ≤ ~150K triangles, ≤ 100 draw calls.

## 5. 3D asset workflow (packs instead of Blender)

Start from license-cleared low-poly asset packs and an HDRI environment instead of modeling in Blender.

| Source             | License to check                               | Good for                                   |
| ------------------ | ---------------------------------------------- | ------------------------------------------ |
| Kenney asset packs | CC0                                            | Furniture, props, consistent style         |
| Quaternius         | CC0                                            | Stylized low-poly props and rooms          |
| Poly Pizza         | Per model (CC0 or CC-BY)                       | Individual objects (headset, plant, robot) |
| Sketchfab          | Per model (check commercial/attribution terms) | Specific hero objects if needed            |
| Poly Haven         | CC0                                            | HDRI environment lighting, textures        |

```text
download → assets-raw/<pack>/            (not shipped)
        → gltf-transform: dedupe, weld, Meshopt/Draco, textures ≤1024px, KTX2/WebP
        → public/models/workspace.glb
        → LICENSES-ASSETS.md updated      source URL, author, license, attribution
        → poster.webp                     static fallback for /explore
```

Daniel chooses the packs, the final composition and approves any attribution.

## 6. Release and rollback

1. Daniel merges to `main` → Vercel production deploy.
2. Claude asks whether to run the smoke test against production.
3. If production is broken, **roll back first, then fix forward**:
   1. **Daniel:** Vercel → project → Deployments → last good Production deployment → ⋯ → **Instant Rollback**.
   2. Claude opens a `fix/*` PR (a revert or a forward fix).
   3. **Daniel:** after the fix deploys, promote it (⋯ → Promote) so production follows `main` again.
