# Site v1 — design system, structure, pages and motion

Plan reference: docs/plan.md §2 (positioning), §3 + §3.1 (creative direction, 3D Workspace), §4 (IA), §5 (home), §6 (case-study model), §8 (about/skills), §10 (interaction), §11 (SEO/perf); docs/workflow.md §6 (budgets) Issue: #—
Status: **Approved** — Daniel, 2026-10-23 (line updated by Claude on instruction)

## Goal

A recruiter or tech lead opening the site on a phone understands in under 30 seconds who Daniel is (senior native Android engineer with AR/XR depth), sees real work, and can reach a case study, the resume or a contact action in two taps or fewer. The site feels crafted and current (motion, depth, tactile feedback) while staying inside the existing budgets. It is the base that the Phase 4 3D work plugs into without a redesign.

This is an **umbrella spec**: it defines the design system, the information architecture, every page's structure, the motion system and the content model, and ships it all in one PR (Daniel, 2026-10-23): it is the base that later specs change. If scope changes during implementation, this file is updated first.

It depends on PR #14 (`chore/remove-claims`): public content comes from this spec, not from `docs/content/claims.md`.

## Scope / Out of scope

**In scope**

- Design tokens (colour, type, spacing, radius, elevation, motion, breakpoints), dark and light.
- Fonts, base styles, primitives and layout shell (navbar, mobile nav, footer, skip link, 404).
- The motion system: CSS-first, progressive enhancement, reduced-motion behaviour, and a JS budget per interaction.
- Pages: `/` (home), `/work`, `/work/[slug]` (case-study template), `/about`, `/contact`, `/lab` (teaser), `not-found`, and `/styleguide` (Q7).
- A typed content model in `data/` holding the content in this spec and the plan sections it cites. A field with no value yet is optional and the UI omits it.
- Visual-regression baselines and the Daniel-only `update-snapshots` workflow (workflow §6, Sprint 0 Q3).
- 3D-ready slots: a `HeroStage` and a `ProjectMedia` slot that render static media now and can host a lazy R3F canvas in Phase 4.
- Raising the home-page JS budget from 150 KB to 300 KB (Q2), to optimize later.
- Replacing the placeholder home page. `placeholder-home.md` is superseded for `/` by this spec (see H1).

**Out of scope (and where each goes)**

- Full case-study writing for CASABOT, BeVigil, My Tax India and Nexus 3D → one content spec per project (Phase 2), each written with `/spec`.
- MDX pipeline → the first case-study content spec (Phase 2). This spec builds the template from typed data.
- Lab demos (Architecture Explorer etc.) → Phase 3. `/lab` is a teaser page here.
- `/explore`, React Three Fiber, any WebGL → Phase 4. Nothing in this spec loads Three.js.
- Analytics, custom domain, removing `noindex`, sitemap, Open Graph images per project → Phase 5.
- Contact form, CMS, i18n, blog.
- Real screenshots or video from CASABOT/CloudSEK until the private permission check clears them (Q8).

## Design system

### Concept: "Beyond the screen"

Daniel's work starts on the phone screen and goes past it (AR, rendering, backend, VR). The visual language borrows from that:

- **Plane grid.** A faint dot grid in the background, like ARCore plane detection. On desktop, dots near the pointer brighten (a CSS mask driven by two custom properties). On mobile it's static, with a very slow ambient pulse that stops under reduced motion.
- **Layers and depth.** Surfaces sit on stacked planes: subtle borders, a soft inner highlight on the top edge, and a translucent "glass" surface only for floating UI (navbar, menus). Never glass behind long text.
- **Device as stage.** The hero shows an Android device frame built in CSS. It's the `HeroStage` slot that Phase 4 can upgrade to 3D.
- **Android-native details, used sparingly:** a ripple on press, a status-bar strip in the device frame, `logcat`-style mono labels for section numbers (`01 · WORK`), and a 404 page styled as a stack trace.
- **Bento layout** for proof points and capabilities. Clear editorial typography for case studies.

The result should read as a senior engineer's product site: precise, calm and fast, with a few moments of delight. Not a gaming site, not a template.

### Colour tokens

Defined once in `app/globals.css` with Tailwind v4 `@theme` and CSS custom properties. Components use semantic names only (`bg-surface`, `text-muted`), never raw hex.

| Token              | Dark (default design) | Light     | Use                                      | Contrast (recomputed)                                     |
| ------------------ | --------------------- | --------- | ---------------------------------------- | --------------------------------------------------------- |
| `--bg`             | `#0C1324`             | `#F7F8FB` | Page background                          | —                                                         |
| `--surface`        | `#19253B`             | `#FFFFFF` | Cards, panels                            | —                                                         |
| `--surface-raised` | `#192B48`             | `#EEF1F7` | Elevated tiles, hover                    | —                                                         |
| `--text`           | `#F8FAFC`             | `#0B1220` | Body and headings                        | 17.7:1 / 17.6:1 on bg                                     |
| `--text-muted`     | `#AABAD1`             | `#4A5873` | Secondary text                           | 9.4 bg, 7.8 surface, 7.2 raised / 6.7 bg, 6.3 raised      |
| `--accent`         | `#7C9CF7`             | `#3557D6` | Links, focus, highlights, filled buttons | 7.0 bg, 5.4 raised / 5.7 bg, 5.3 raised                   |
| `--accent-strong`  | `#547CF3`             | `#3557D6` | Glows, gradients (decorative only)       | 4.9:1 on dark bg, so never text in dark                   |
| `--accent-soft`    | `#B8CCF7`             | `#C7D4FB` | Fine accents, chip fills                 | 11.5:1 on dark bg; **1.4:1 in light, so decorative only** |
| `--border`         | `#37475E`             | `#D5DCE8` | Dividers, outlines (decorative)          | 2.0 / 1.3, not used for meaning                           |
| `--success`        | `#5FD3A0`             | `#137A4F` | "Live on Play Store" chips               | 10.0 bg, 7.6 raised / 5.0 bg, 4.7 raised                  |

Notes:

- The plan's `#547CF3` is only **4.9:1** on the dark background and **3.8:1** under white text, so text links, focus rings and filled primary buttons use `--accent`. Filled buttons: `--accent` fill with `--bg` text in dark (7.0:1), white text in light (6.0:1). `--accent-strong` is for glows and gradients only.
- `--border` is 2:1 against the dark background. That's fine for decoration, but never the only signal for state or for input outlines (WCAG 1.4.11). Interactive outlines use `--text-muted`.
- Gradients (aurora glow, card spotlight) use `--accent-strong` at low alpha and never sit behind body text.

### Typography

| Role              | Family         | Weights | Notes                                        |
| ----------------- | -------------- | ------- | -------------------------------------------- |
| Display, headings | Space Grotesk  | 500–700 | Variable font, tight tracking at large sizes |
| Body, UI          | Inter          | 400–600 | Variable font                                |
| Labels, code      | JetBrains Mono | 400–500 | Section numbers, tags, code, 404             |

- Loaded with `next/font/google` (self-hosted at build, no runtime JS, no layout shift), `latin` subset, `display: swap`. Only the display font is preloaded (Q4).
- Fluid type scale with `clamp()`, from 320 px to 1440 px:

| Token         | Mobile → desktop  | Use                         |
| ------------- | ----------------- | --------------------------- |
| `display-2xl` | 2.5 → 5.5 rem     | Hero headline only          |
| `display-xl`  | 2 → 3.5 rem       | Page titles                 |
| `display-lg`  | 1.625 → 2.5 rem   | Section titles              |
| `heading`     | 1.25 → 1.5 rem    | Card titles                 |
| `body-lg`     | 1.0625 → 1.25 rem | Lead paragraphs             |
| `body`        | 1 rem             | Body (never below 16 px)    |
| `label`       | 0.75 → 0.8125 rem | Mono uppercase labels, tags |

- Measure: body text capped at ~68 characters (`max-w-prose`).

### Space, layout, shape

- Spacing on a 4 px base (Tailwind default scale). Section rhythm: `py-20` mobile, `py-32` desktop.
- Container: `max-w-6xl` (1152 px) content, `px-4` (16 px) gutter at 320–639 px, `px-6` from `sm`, `px-8` from `lg`.
- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Component-level layout uses **container queries** (`@container`) so cards adapt to their slot, not the viewport.
- Grid: 4 columns on mobile, 8 on `md`, 12 on `lg`.
- Radius: `--radius-sm` 8 px (chips), `--radius-md` 14 px (buttons, inputs), `--radius-lg` 24 px (cards), `--radius-xl` 32 px (hero device, large tiles).
- Elevation: no heavy drop shadows. Depth comes from surface colour, a 1 px border, a 1 px top inner highlight (`inset 0 1px 0 rgb(255 255 255 / 0.06)`), and on hover a soft accent glow.
- Touch targets ≥ 44 × 44 px. Focus ring: 2 px `--accent` outline with a 2 px offset on every interactive element.

### Motion tokens

| Token           | Value                               | Use                           |
| --------------- | ----------------------------------- | ----------------------------- |
| `--dur-fast`    | 150 ms                              | Hover, press, colour          |
| `--dur-base`    | 250 ms                              | Menus, small transitions      |
| `--dur-slow`    | 500 ms                              | Reveals                       |
| `--dur-hero`    | 900 ms                              | Hero entrance (once per load) |
| `--ease-out`    | `cubic-bezier(0.16, 1, 0.3, 1)`     | Default (expo-out)            |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)`    | Route and morph transitions   |
| `--ease-spring` | CSS `linear()` spring approximation | Press release, chips          |

Rules: animate only `transform`, `opacity`, `filter: blur()` at small radii, and `clip-path`. Never animate layout properties. No animation longer than 1 s except ambient loops, and ambient loops pause when off-screen.

### Components

| Component         | Notes                                                                                            | JS                                   |
| ----------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `Container`       | Width + gutters                                                                                  | none                                 |
| `Section`         | `<section>` with `aria-labelledby`, mono eyebrow (`02 · CAPABILITIES`), title, intro             | none                                 |
| `Button`          | `primary` (filled), `secondary` (outline), `ghost`; renders `<a>` or `<button>`; ripple on press | none (CSS)                           |
| `ArrowLink`       | Text link with an arrow that nudges on hover; `external` variant adds ↗ and `rel`                | none                                 |
| `Tag` / `Chip`    | Mono label chips for tech; `status` variant for "Live on Play Store" / "Prototype"               | none                                 |
| `Card`            | Surface + border + highlight; `interactive` variant (whole card is one link, no nested links)    | none                                 |
| `SpotlightCard`   | `Card` with a pointer-following glow (desktop, `hover: hover` only)                              | tiny island, shared                  |
| `StatTile`        | Big value + label + optional source footnote; omitted when its value is missing                  | none                                 |
| `DeviceFrame`     | CSS Android frame with status bar; children are the screen                                       | none                                 |
| `HeroStage`       | Wraps `DeviceFrame`; **3D slot** (see Technical approach)                                        | none now                             |
| `ProjectMedia`    | Poster image, optional click-to-play video, or typographic cover; **3D slot**                    | video: tiny island                   |
| `Timeline`        | Ordered list with a scroll-drawn line                                                            | none                                 |
| `Marquee`         | Tech names strip; duplicated list `aria-hidden`; static wrap under reduced motion                | none                                 |
| `Navbar`          | Floating glass pill on scroll; no active-section indicator (Q17)                                 | none                                 |
| `MobileNav`       | Full-screen sheet using the **Popover API** (`popover` + `popovertarget`)                        | close-on-navigate: tiny island (Q13) |
| `Footer`          | Positioning line, links, resume, © year                                                          | none                                 |
| `SkipLink`        | First focusable element                                                                          | none                                 |
| `CaseStudyLayout` | Header, sticky table of contents (desktop), reading progress bar, next-project footer            | TOC scroll-spy: tiny island          |

"Tiny island" means a small `"use client"` component. There is no per-island size cap; all JS on a page stays under the page budget (AC1).

## Information architecture

```text
/                     Home (single scroll, anchored sections)
├── /work             All projects, filterable (no JS)
│   └── /work/[slug]  Case-study template (casabot, bevigil, my-tax-india, nexus-3d)
├── /about            Story, principles, timeline, skills, education
├── /contact          Contact options + resume
├── /lab              Teaser: "experiments coming soon" (Phase 3 fills it)
├── /styleguide       Tokens and components, noindex, not linked (Q7)
└── not-found         404 as an Android stack trace
(/explore reserved for Phase 4; not linked, not built)
```

- **Navbar:** `daniel.` wordmark · Work · Lab · About · Contact · `Resume` (opens the PDF in a new tab, labelled "PDF"; no external-link arrow, per plan P5).
- **Mobile:** wordmark + a "Menu" button that opens the popover sheet. The sheet lists the same links in large type, plus Resume, LinkedIn and GitHub, and closes on Esc (native) and on link tap (a tiny island, Q13).
- **Footer:** "Senior Android engineer building beyond the screen." · LinkedIn · GitHub · Email · Phone · Resume · © year (Q6).

## Pages

### Home `/`

Content IDs in brackets refer to the content inventory below.

| #   | Section             | Content                                                                                                                                                                                                                      | Layout mobile → desktop                                                                                     | Motion                                                                                                                                         |
| --- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**            | Eyebrow `SENIOR ANDROID ENGINEER · BENGALURU` [ID-1, ID-2]. H1 "Building experiences beyond the screen." Two-sentence intro (plan §2). CTAs: Explore my work (primary), Resume (secondary). Optional availability chip (Q5). | Text, then CTAs, then `HeroStage` below → two columns, device right                                         | Words of the H1 rise and unblur in sequence (CSS, once, starting from visible; Q14). Device floats in. Plane grid reacts to pointer (desktop). |
| 2   | **Proof bento**     | 4 tiles: `7+ years` Android [EXP-0] · `500K+` downloads, _tax/FinTech app_ [MET-1] · `End to end` architecture → Play Store [EXP-1] · `AR/XR` ARCore, Filament, Meta Quest [SKL-AR].                                         | 2×2 → 4 across, first tile wider                                                                            | Tiles reveal on scroll; number tiles do a short CSS count-up (`@property` integer; Q15)                                                        |
| 3   | **Featured work**   | 4 project cards (CASABOT, BeVigil, My Tax India, Nexus 3D) with the one-line angle from plan §5.3, 3–5 tags, status chip, cover.                                                                                             | **Sticky stacking cards** (each card pins and the previous one scales back) → 2×2 grid with spotlight hover | Scroll-driven stack on mobile; spotlight + cover zoom on desktop hover; card → case study morph (AC50)                                         |
| 4   | **Capabilities**    | 6 bento tiles (plan §5.4 groups), each with 1–2 lines of evidence linking to a case study.                                                                                                                                   | 1 column → 3×2 bento                                                                                        | Reveal; spotlight on desktop                                                                                                                   |
| 5   | **Tech marquee**    | Kotlin · Compose · Coroutines/Flow · Hilt · Room · ARCore · Filament · OpenGL · Unity · FastAPI · Flutter · …                                                                                                                | Full-bleed strip                                                                                            | Slow horizontal loop; pauses on hover/focus; static under reduced motion                                                                       |
| 6   | **Career snapshot** | "From solving platform problems to owning products end to end." 4 stops: Seven Seas → Quintet → CloudSEK → CASABOT, each one line [EXP-*]. Link to About.                                                                    | Vertical timeline → horizontal on `lg`                                                                      | Line draws with scroll; stops fade in                                                                                                          |
| 7   | **Lab teaser**      | "Engineering Lab — interactive experiments, coming soon." Teaser card with the plane-grid visual.                                                                                                                            | Single card                                                                                                 | Grid pulse                                                                                                                                     |
| 8   | **Contact CTA**     | "Have a complex mobile problem? Let's build something dependable." Email, phone, LinkedIn, Resume (Q6).                                                                                                                      | Big type block                                                                                              | Headline reveal; magnetic primary button (desktop only, CSS + shared pointer island)                                                           |

### Work `/work`

- Title, one-line intro, filter chips: All · Android · AR/XR · Backend · Cross-platform.
- **Filtering with no JS:** chips are a radio group; cards are shown or hidden with `:has()` selectors. Without `:has()` support every card stays visible.
- The same `ProjectCard` as home, in a responsive grid (1 → 2 columns).

### Case study `/work/[slug]` (template)

Sections follow plan §6 in this order: Hero (name, domain, role, period, tags, links, cover) · Context · My ownership · Engineering challenge · Architecture (diagram slot + text) · Implementation · Trade-offs · Outcome · What I learned · Links · Next project.

- Desktop: sticky table of contents on the left with the current section highlighted. Mobile: a collapsible "On this page" `<details>` at the top.
- A thin reading-progress bar under the navbar (CSS `scroll()` timeline, no JS).
- Statically generated for the four slugs (`generateStaticParams`). Unknown slugs → 404.
- The template renders **only fields that have content**. Sections with no content show nothing (not "coming soon" filler), and a case study with no context section at all isn't linked from cards yet.

### About `/about`

Two-paragraph story (plan §8 "Example About introduction") · Engineering principles (4 short cards [PRN-1–4]) · Full timeline with role highlights (plan §8) · Skills as evidence-based groups (plan §8 table, no percentage bars) · Education [EDU-1] · Links, including the GitHub "Side Projects" stars list [LNK-4].

### Contact `/contact`

Short line, contact options as large tappable cards (Email `mailto:`, Phone `tel:`, LinkedIn, GitHub), Resume download. No form (Q6).

### Lab `/lab`

A single teaser: what the Lab will contain, the plane-grid visual, link back to Work.

### 404

Rendered as a monospace stack trace: `E/Router: ActivityNotFoundException: no route for /<path>` · `at daniel.portfolio.Navigation.resolve(...)` followed by friendly links: Home, Work, Contact. Readable by screen readers as normal text, not an image.

## Motion system

Principles: **motion explains, it doesn't decorate**; **content is never hidden behind motion** (if an animation doesn't run, the content is still visible); **CSS first, JS only for pointer tracking**.

| #   | Interaction                                      | Technique                                                                                         | Fallback (no support)   | Reduced motion          | JS      |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------- | ------- |
| M1  | Hero headline entrance                           | `@keyframes` rise + unblur, per-word `--i` delay (Q14)                                            | n/a (widely supported)  | Instant, no transform   | 0       |
| M2  | Scroll reveals                                   | `animation-timeline: view()` inside `@supports`                                                   | Visible immediately     | Off                     | 0       |
| M3  | Sticky stacking project cards                    | `position: sticky` + `view()` timeline scaling the outgoing card                                  | Plain stacked list      | Plain list              | 0       |
| M4  | Timeline line draw                               | `scaleY` on a `view()` timeline                                                                   | Full line shown         | Full line shown         | 0       |
| M5  | Reading progress bar                             | `animation-timeline: scroll(root)`                                                                | Hidden                  | Hidden                  | 0       |
| M6  | Navbar condense on scroll                        | `scroll()` timeline over the first 120 px                                                         | Always condensed style  | Same                    | 0       |
| M7  | Stat count-up                                    | `@property --n` (integer) + `counter()` (Q15)                                                     | Final value             | Final value             | 0       |
| M8  | Press ripple                                     | `:active` radial gradient from `--x/--y` (centre if unknown)                                      | Colour change           | Colour change           | 0       |
| M9  | Marquee                                          | `transform` loop, paused with `:hover`, `:focus-within`, and when off-screen                      | Static wrap             | Static wrap             | 0       |
| M10 | Pointer spotlight, plane-grid glow, magnetic CTA | One shared island sets `--x/--y` on `pointermove`, only when `(hover: hover) and (pointer: fine)` | Static                  | Disabled                | ~1 KB   |
| M11 | Menu sheet open/close                            | Popover API + `@starting-style` + `transition-behavior: allow-discrete`                           | Opens without animation | No animation            | 0       |
| M12 | Card → case-study morph                          | React `<ViewTransition>` (from `react`) + `next/link` `transitionTypes` (Q3)                      | Normal navigation       | Cross-fade only or none | ~0–2 KB |
| M13 | Ambient aurora + grid pulse                      | Slow `transform`/`opacity` loop on a pre-blurred gradient layer; paused off-screen                | Static gradient         | Static                  | 0       |

Browser note: scroll-driven animations ship in Chromium and Safari 26+, and are still missing or behind a flag in Firefox. That's why every scroll effect is inside `@supports (animation-timeline: view())` and the default state is "visible".

## Content model

- `data/site.ts` (name, role, location, links, nav), `data/projects.ts`, `data/experience.ts`, `data/skills.ts`, `data/education.ts`. All typed; the `Project` type follows plan §9.
- Values come from this spec and the plan sections it cites, as written. Never invented: a value this spec doesn't give is an optional field left `undefined`, and the UI omits it without placeholder text (CLAUDE.md).
- **Contact details (Q6, decided):** email, phone, LinkedIn and GitHub are all published.

### Content inventory (from the resume)

These go into `data/*.ts`. Rows marked _open_ have no value yet (Q18) and ship as omitted fields until Daniel adds them.

| ID     | Content                                                                                                                                                                                 | Source                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ID-1   | Name: Daniel Dominic; title: Senior Android Engineer                                                                                                                                    | Resume header + summary                                                               |
| ID-2   | Based in Bengaluru, India                                                                                                                                                               | Resume header                                                                         |
| ID-3   | LinkedIn URL `linkedin.com/in/daniel-dominic-221680143`                                                                                                                                 | Resume header                                                                         |
| ID-4   | Email `dominicdj37@gmail.com`                                                                                                                                                           | Resume header                                                                         |
| ID-5   | Phone `+91 9947692661` (`tel:+919947692661`)                                                                                                                                            | Resume header; Daniel, 2026-10-23                                                     |
| EXP-0  | 7+ years of Android experience                                                                                                                                                          | Resume summary                                                                        |
| EXP-1  | Builds native apps end to end, architecture to Play Store release                                                                                                                       | Resume summary                                                                        |
| EXP-2  | CASABOT Technology Ltd (via InsourceIndia), Senior Android Developer, Jan 2026–present                                                                                                  | Resume, experience                                                                    |
| EXP-3  | CASABOT: sole Android engineer, empty repo to live product                                                                                                                              | Resume, CASABOT bullet 1                                                              |
| EXP-4  | CASABOT: AR feature shipped on SceneView, re-platformed to custom ARCore + Filament                                                                                                     | Resume, CASABOT bullet 3                                                              |
| EXP-5  | CASABOT: four production releases                                                                                                                                                       | Resume, CASABOT bullet 6                                                              |
| EXP-6  | CloudSEK Information Security, SDE II, Jun 2022–Jul 2025                                                                                                                                | Resume, experience                                                                    |
| EXP-7  | BeVigil Android built solely from scratch; dataset of 1M+ Play Store apps                                                                                                               | Resume, CloudSEK bullet 1                                                             |
| EXP-8  | BeVigil Lite in Flutter for iOS and Android                                                                                                                                             | Resume, CloudSEK bullet 4                                                             |
| EXP-9  | Unity + Meta Quest VR data-visualization prototype                                                                                                                                      | Resume, CloudSEK bullet 6                                                             |
| EXP-10 | Quintet Solutions, Kochi, Software Engineer (Android), May 2019–May 2022                                                                                                                | Resume, experience                                                                    |
| EXP-11 | Seven Seas High Tech Systems, Kochi, Android Developer, Aug 2018–Feb 2019; 100+ bugs closed                                                                                             | Resume, experience                                                                    |
| MET-1  | Tax calculation app (Quintet) reached 500,000+ downloads on Play Store                                                                                                                  | Resume summary + Quintet bullet                                                       |
| EDU-1  | B.Tech, Computer Science & Engineering, CUSAT, 2014–2018, CGPA 7.0                                                                                                                      | Resume, education                                                                     |
| SKL-AR | ARCore (planes, depth, Cloud Anchors), Filament, EGL/OpenGL, Unity for Meta Quest                                                                                                       | Resume, skills                                                                        |
| SKL-\* | One entry per skills group, as in the plan §8 skills table                                                                                                                              | Resume, skills; plan §8                                                               |
| LNK-1  | CASABOT Play Store URL `https://play.google.com/store/apps/details?id=com.casabot.android`                                                                                              | Resume, projects; plan §6.1                                                           |
| LNK-2  | BeVigil Play Store URL `https://play.google.com/store/apps/details?id=com.cloudsek.bevigil`                                                                                             | Resume, projects; plan §6.2                                                           |
| LNK-3  | My Tax India Play Store URL `https://play.google.com/store/apps/details?id=com.quintetsolutions` (correct as on the resume)                                                             | Resume, projects; Daniel, 2026-10-23                                                  |
| LNK-4  | GitHub profile `https://github.com/dominicdj37` (Q10); "Side Projects" stars list `https://github.com/stars/dominicdj37/lists/side-projects`, linked from About                         | Resume, projects; Daniel, 2026-10-23                                                  |
| LNK-5  | Nexus 3D demo video `https://drive.google.com/file/d/1n66K1vjiZsl1Zda6hAn2YMhZs1jA-NSJ/view?usp=sharing` (linked, not embedded)                                                         | Resume, projects ("demo video" link)                                                  |
| LNK-6  | Nexus 3D product showcase `https://www.linkedin.com/posts/cloudsek_do-we-want-to-make-cybersecurity-fun-and-activity-7188760441068703746-LVKX` (resume's tracking query string dropped) | Resume, projects ("product showcase" link)                                            |
| PRN-1  | **Own it end to end.** From an empty repository to the Play Store, I treat architecture, testing, releases and crash monitoring as one job.                                             | Draft from the resume, written at Daniel's request (2026-10-23); Daniel revises later |
| PRN-2  | **Architecture is a product decision.** Clear layers, use cases and dependency injection keep features cheap to change long after the first release.                                    | Draft from the resume, written at Daniel's request (2026-10-23); Daniel revises later |
| PRN-3  | **Ship what works outside the demo.** Real devices, real networks and real telemetry decide when something is done, not the happy path.                                                 | Draft from the resume, written at Daniel's request (2026-10-23); Daniel revises later |
| PRN-4  | **Use AI, keep the judgement.** Agents write code with me; I own the design decisions, the review and the tests that keep refactors safe.                                               | Draft from the resume, written at Daniel's request (2026-10-23); Daniel revises later |
| PRJ-1  | Nexus 3D: VR product showcase with a demo video; relationship to EXP-9 to confirm (Q11)                                                                                                 | Resume, projects                                                                      |

Everything on the resume is in the inventory (Q6, Q12: nothing is dropped). Phrases like "significantly enhancing" are kept as resume wording but aren't turned into metrics; case studies describe what was built.

## Acceptance criteria (each becomes ≥1 test)

Everything ships in **one branch and one PR**, `feat/site-v1` (Daniel, 2026-10-23: this is the base that later specs change). The groups below are for reading and review only; they aren't separate PRs. Visual-regression baselines are generated by Daniel's `update-snapshots` run on that PR.

### Budget

- [ ] AC1 — The home-page JS budget is raised from 150 KB to **300 KB** (Q2) in `lighthouserc.json`, `docs/workflow.md` §6, ADR 0001, `CLAUDE.md` and `README.md`, with the reason in the PR. Lighthouse perf ≥ 0.90 and a11y ≥ 0.95 on `/` are unchanged. _Lighthouse CI + proof of red: a page over 300 KB fails._

### Design system

- [ ] AC2 — All colour, radius, spacing, motion and type tokens in this spec exist in `app/globals.css` (`@theme` + custom properties) for dark and light. _Unit: parses the CSS and asserts every token name exists in both schemes._
- [ ] AC3 — Every text/background pair the colour table marks as text (`--text`, `--text-muted`, `--accent`, `--success` on `--bg`, `--surface` and `--surface-raised`; filled-button text on `--accent`) meets WCAG AA (4.5:1 body, 3:1 large text) in both schemes. _Unit: contrast computed from the token values._
- [ ] AC4 — Fonts load via `next/font` (no `<link>` to Google, no runtime font JS), with `display: swap`. _Unit (layout source) + e2e: no request to `fonts.googleapis.com`._
- [ ] AC5 — A global `prefers-reduced-motion: reduce` rule sets animation and transition durations to near zero and disables `scroll-behavior: smooth`. _E2e with `reducedMotion: "reduce"`: computed `animation-duration` on a sample element ≤ 0.01 s._
- [ ] AC6 — `Container`, `Section`, `Button`, `ArrowLink`, `Tag`, `Card`, `StatTile`, `DeviceFrame` exist as server components with typed props. _Component tests per primitive (roles, names, variants)._
- [ ] AC7 — `Button` renders `<a>` when given `href` and `<button>` otherwise; external `ArrowLink` sets `target="_blank"` and `rel="noopener noreferrer"` and announces "opens in new tab". _Component._
- [ ] AC8 — Interactive elements have a visible focus ring and are at least 44 × 44 px. _E2e on `/styleguide` (keyboard focus + bounding box)._
- [ ] AC9 — `/styleguide` renders every token and component in both schemes, is `noindex`, and isn't linked from any page (Q7). _E2e + axe (light and dark)._

### Layout shell

- [ ] AC10 — Every page has a skip link as the first focusable element, one `<header>`, `<main id="main">`, and `<footer>`. _E2e (all 3 projects)._
- [ ] AC11 — Below `md`, "Menu" opens a popover sheet with all nav links; Esc closes it and focus returns to the button. Tapping a link navigates and leaves the sheet closed on the new page (Q13). The sheet opens and Esc works with JS disabled. _E2e (android, iphone; one run with `javaScriptEnabled: false`)._
- [ ] AC12 — The current page's nav link has `aria-current="page"`. _E2e._
- [ ] AC13 — Unknown routes render the stack-trace 404 with links Home, Work, Contact, and HTTP 404. _E2e._
- [ ] AC14 — Contact and Resume are reachable from any page in ≤ 2 taps on mobile. _E2e (android)._

### Visual regression

- [ ] AC15 — Playwright `toHaveScreenshot` for `/`, `/work`, one case study, `/about`, `/contact`, `/lab`, `/styleguide` and the 404, in dark and light, on all 3 projects, with animations disabled. _E2e._
- [ ] AC16 — A `workflow_dispatch` workflow `update-snapshots` regenerates baselines on Linux and commits them to the chosen PR branch. Only Daniel runs it (Sprint 0 Q3). _Proof of red: a 1 px colour change fails CI._
- [ ] AC17 — The `protect-paths` hook still blocks local writes to `*-snapshots/`. _Existing hook tests stay green._

### Motion

- [ ] AC18 — Reveal, stagger, marquee, ripple and count-up utilities exist as CSS (classes or `@utility`), all scroll effects inside `@supports (animation-timeline: view())`. _Unit: CSS parse._
- [ ] AC19 — With scroll-driven animations unsupported or reduced motion on, every revealed element is fully visible (`opacity: 1`, no transform) on first paint. _E2e: reduced motion + a test page forcing the fallback._
- [ ] AC20 — One shared pointer island sets `--x/--y` and attaches only when `(hover: hover) and (pointer: fine)`. _Component + e2e (iphone: no listener effect)._
- [ ] AC21 — No animation in the codebase animates `width`, `height`, `top`, `left`, `margin` or `padding`. _Unit: CSS scan._

### Content model

- [ ] AC22 — `data/*.ts` hold every inventory row and the plan copy this spec cites, with values exactly as written here. _Unit: values match a fixture taken from this spec._
- [ ] AC23 — Rows marked _open_ are optional fields left `undefined`; nothing in `data/` holds a placeholder value (`TODO`, `TBD`, `example.com`, `000`). _Typecheck + unit._
- [ ] AC24 — A component given data with every optional field missing renders without empty labels, broken links or placeholder text. _Component test with a fixture._
- [ ] AC25 — **Daniel:** reviews `data/*.ts` in the PR against the resume.

### Home

- [ ] AC26 — Hero: one `<h1>`, eyebrow, intro, two CTAs, `HeroStage`. Missing optional fields are omitted without breaking layout. _Component + e2e._
- [ ] AC27 — The hero is fully visible and the primary CTA is above the fold at 390 × 844 and 320 × 568. _E2e (android, iphone; viewport overrides)._
- [ ] AC28 — The LCP element is text or a static image, never a lazy or animated-in element (Q14). _Lighthouse: LCP element type._
- [ ] AC29 — Proof bento: four `StatTile`s whose final values match the content text exactly, and whose accessible text is the final value at all times (Q15). _Component + e2e (reduced motion shows final values)._
- [ ] AC30 — Four `ProjectCard`s, each a single link with an accessible name equal to the project title; status chips "Live on Play Store" (when the project has a Play Store link) or "Prototype". _Component + e2e._
- [ ] AC31 — On mobile, cards use the sticky-stack effect where supported, and all four cards remain reachable and tappable with it off. _E2e (android with and without reduced motion)._
- [ ] AC32 — Capabilities: six tiles with headings; evidence lines link to case studies only when that case study is linked (see case-study rule). _Component._
- [ ] AC33 — Marquee duplicates are `aria-hidden`, it pauses on hover and focus, and renders as a static wrap under reduced motion. _E2e._
- [ ] AC34 — Timeline renders 4 stops as an ordered list with the employers and dates from the inventory. _Component._
- [ ] AC35 — The contact block shows email (`mailto:`), phone (`tel:+919947692661`), LinkedIn and Resume, each with a 44 px target. _E2e._
- [ ] AC36 — This PR replaces the placeholder page. The placeholder-home tests for the "Portfolio coming soon." line, the title "Daniel Dominic — portfolio coming soon" and "shows only the name and the coming-soon line" (`tests/unit/home-page.test.tsx`, `tests/e2e/home.spec.ts`, and the production smoke test if it checks the text) are replaced by home tests, with this AC as the reason. The site-wide `noindex` tests stay. _Unit + e2e._
- [ ] AC37 — **Daniel:** checks the home page on a real Android phone and iPhone (feel, legibility, no jank).

### Work and case studies

- [ ] AC38 — `/work` filter chips are native radios in a `<fieldset>` with a legend; choosing one hides non-matching cards via CSS only; "All" is the default. _E2e (keyboard + touch)._
- [ ] AC39 — No `"use client"` under `app/work/` outside the case-study TOC island. _Unit._
- [ ] AC40 — Every filter matches at least one card, and each chip's label includes its server-rendered count, e.g. "AR/XR (2)" (Q16). _Unit (data) + e2e._
- [ ] AC41 — `generateStaticParams` returns exactly the four slugs; others 404. _Unit + e2e._
- [ ] AC42 — Case-study section order follows plan §6; empty sections render nothing; each section has an `id` for the table of contents. _Component._
- [ ] AC43 — Desktop: sticky TOC with `aria-current` on the active section. Mobile: `<details>` TOC. _E2e (desktop, android)._
- [ ] AC44 — Reading progress bar is decorative (`aria-hidden`) and uses no JS. _Unit + e2e._
- [ ] AC45 — Each case-study page has a unique `<title>` and description from data. _E2e._

### About, contact, lab

- [ ] AC46 — About shows story, principles [PRN-1–4], full timeline, skills groups (no percentages), education, and the GitHub "Side Projects" stars list link. _Component + e2e._
- [ ] AC47 — Contact shows email, phone, LinkedIn and GitHub cards and the resume download; the resume link returns 200 with `application/pdf` once the PDF exists (until then, the link is omitted). _E2e._
- [ ] AC48 — Lab teaser has no WebGL and no client JS. _Unit._
- [ ] AC49 — Lighthouse CI also runs on `/about` and `/work/casabot` with the same thresholds as `/`. _Lighthouse CI config._

### View transitions

- [ ] AC50 — Navigating from a project card to its case study morphs the cover (shared `<ViewTransition name>`) where supported; elsewhere navigation is normal. _E2e (desktop Chromium): view-transition path taken; webkit: navigation still works._
- [ ] AC51 — Under reduced motion the transition is a cross-fade or none. _E2e._

**This spec is done when** the PR is merged, every new gate (AC1 budget, AC16 visual regression) has a proof of red, and Daniel has checked the home page on a real Android phone and iPhone.

## UX notes (mobile first)

- **320 px:** single column, 16 px gutters, hero H1 at 2.5 rem with balanced wrapping (`text-wrap: balance`), CTAs full-width and stacked, device frame at ~70% width below the CTAs. Bento tiles 2×2 with 12 px gaps. No horizontal scroll anywhere (except the marquee track, which is clipped).
- **390 px:** same as 320 with more breathing room; this is the PR screenshot width.
- **Tablet (768 px):** hero still stacked but CTAs inline; cards 2 columns; container queries switch card layouts.
- **Desktop (1440 px):** hero split 7/5 columns, plane-grid pointer effect on, spotlight cards, horizontal timeline. Content max 1152 px; text max ~68 characters.
- **Thumb zone:** the Menu button sits top-right; primary actions in content are full-width on phones.
- **Feedback:** every tap gives an immediate visual response (ripple or colour) within 100 ms.
- **Dark/light:** follows OS (Q1). Dark is the hero design; light is equally tested.
- **Loading:** no splash screens or intro animations that delay content. The hero entrance finishes within ~900 ms and never blocks reading.
- **Copy tone:** first person, specific, no superlatives (plan §2).

## Technical approach

- **Server components everywhere**; `"use client"` only for: the pointer island (M10), the case-study TOC scroll-spy, video click-to-play, and the menu close-on-navigate (Q13).
- **JS budget (Q2):** home-page JS goes from 150 KB to **300 KB** (today 137.5 KB, per CI), to optimize later. CSS-first stays the default because it covers everything listed; an animation library (Motion, GSAP) may be added where it clearly simplifies an effect, with the reason in the PR (CLAUDE.md).
- **Tailwind v4:** tokens in `@theme`; custom utilities with `@utility`; dark mode via `prefers-color-scheme` (`dark:` variant) unless Q1 changes it.
- **Next.js 16 APIs:** check `node_modules/next/dist/docs/` before using `generateStaticParams`, `next/font` and `<ViewTransition>` (CLAUDE.md rule). The installed 16.4.2 docs (`02-guides/view-transitions.md`) import `ViewTransition` from `react` and add `transitionTypes` on `next/link`, with no `experimental.viewTransition` flag. The implementation re-checks this; if a flag turns out to be needed, it records that in ADR 0002.
- **3D slots (Phase 4 readiness):**
  - `HeroStage` takes a `variant: "static" | "interactive"` prop. Now it always renders `DeviceFrame` with a static screen (CSS UI skeleton or a cleared screenshot) as the LCP-safe poster.
  - Phase 4 can render a lazily imported R3F canvas _on top of_ the poster after load, only when visible and capable, with the poster as fallback, so LCP and the home JS budget are unaffected.
  - `ProjectMedia` has the same pattern for per-project models.
  - Nothing in this spec imports `three` or `@react-three/*`.
- **Folder layout:** `components/{layout,ui,home,work,case-study,motion}`, `data/`, following plan §9.
- **Dependencies:** none new expected. If the PR needs one, it's justified in the PR (CLAUDE.md).
- **ADR:** ADR 0001 is amended for the 300 KB budget (CLAUDE.md: budget changes update workflow §6 and the ADR). A new ADR 0002 only if view transitions need an experimental Next.js flag.

## Test plan

- **Unit/component (Vitest):** token presence and contrast, CSS scans (no layout-property animations, `@supports` wrapping), primitives, content data (values match this spec, no placeholders, optional fields omitted), `"use client"` only where listed, static params.
- **E2e (Playwright, android/iphone/desktop):** landmarks and skip link, mobile popover nav (with and without JS), 404, ≤ 2-tap reach, hero above the fold at 320 and 390, reduced-motion visibility, filters by keyboard and touch, TOC, view transitions.
- **A11y:** `expectNoA11yViolations` on every page in light and dark; keyboard-only journey: home → work → case study → contact.
- **Visual regression:** from V1, per page, both schemes, 3 projects, animations disabled; baselines only via `update-snapshots`.
- **Performance:** Lighthouse CI on `/` (existing), plus `/about` and one case study from P1. The 300 KB budget is checked on every Lighthouse run.
- **Manual (Daniel):** real-phone check (AC37); `data/` review (AC25).

## Risks / open questions

### Decided (2026-10-23)

- **Q1 — Light/dark. ✅ As recommended:** follow the OS, no toggle in v1. Dark is designed first and is the default "look"; light is fully supported and tested. A toggle needs a no-flash inline script and client JS; add it later if wanted.
- **Q2 — JS budget and animation library. ✅ Changed by Daniel:** raise the home-page budget to 300 KB and optimize later. CSS-first stays the default; a library is allowed with its reason in the PR.
- **Q3 — View Transitions (VT1). ✅ As recommended:** yes, progressive only. If Next.js 16 still needs an experimental flag, record that in ADR 0002 and keep it easy to switch off (the 16.4.2 docs suggest no flag; see Technical approach).
- **Q4 — Fonts. ✅ As recommended:** Space Grotesk + Inter + JetBrains Mono, variable, latin subset, preload display only. Alternative for maximum speed: Inter for everything + JetBrains Mono.
- **Q5 — Availability chip. ✅ As recommended:** in the hero (e.g. "Open to senior Android roles"), built as an optional, data-driven chip, off by default. Turning it on is a one-line data change.
- **Q6 — Contact channels. ✅ Publish everything:** email (`mailto:`), phone (`tel:`), LinkedIn and GitHub. No contact form in v1 (no backend, no spam handling).
- **Q7 — `/styleguide` in production. ✅ As recommended:** keep it, `noindex`, unlinked. It's the visual-regression target and a "how this was built" artefact.
- **Q8 — Media before permissions clear. ✅ As recommended:** designed typographic covers and CSS UI skeletons inside the device frame until screenshots are cleared privately. No CASABOT or CloudSEK imagery ships without a recorded permission.
- **Q9 — Android-flavoured details. ✅ As recommended:** ripple, status bar, logcat labels, stack-trace 404, subtle.
- **Q10 — GitHub link. ✅ As recommended:** the profile `github.com/dominicdj37`, with pinned repos curated before launch.
- **Q11 — Nexus 3D. ✅ As recommended:** show it as "Prototype" with the demo video once Daniel confirms what it is and where the video lives; until then it's a card without a case-study link.
- **Q12 — Resume PDF on the site. ✅ The full resume as is, phone number included,** at `public/resume/daniel-dominic-resume.pdf`, added by Daniel (the path is hook-protected).

### Decided (2026-10-23), from checking the draft against the repo: all as recommended

- **Q13 — Mobile menu doesn't close on link tap by itself.** The draft says link taps close the sheet natively, but popover light-dismiss only covers Esc and taps outside. `next/link` navigates client-side and the navbar lives in the persistent root layout, so the sheet stays open on the new page. **Decided:** a tiny island (well under 1 KB) that hides the popover on link click, added to the `"use client"` allowlist. Without JS, links still navigate (full page load), which closes it. Alternative: plain `<a>` links in the sheet (always a full reload, no island).
- **Q14 — Hero entrance vs LCP.** If the H1 words start at `opacity: 0`, Chrome doesn't count them for LCP until they're visible, which pushes LCP back by up to ~900 ms and puts AC28 and the perf ≥ 0.90 gate at risk. **Decided:** rise + unblur from a visible state (opacity starts at 1, or the eyebrow/intro is the LCP candidate). The look stays almost the same.
- **Q15 — Count-up accessibility.** A number drawn by CSS `counter()` in `::after` isn't reliably read by screen readers, and they'd hear the moving value. **Decided:** the real final value is in the DOM as text for assistive tech; the animated counter is `aria-hidden` decoration.
- **Q16 — `/work` result count.** The draft's AC asked for the count to be announced via an `aria-live` CSS counter. Screen readers don't announce CSS-generated content changes, and with no JS nothing triggers `aria-live`. **Decided:** server-render each chip's count in its label ("AR/XR (2)"), so the count is heard when choosing. AC40 is written that way.
- **Q17 — Navbar active-section indicator on home.** Tracking the visible section needs JS (scroll-spy); the components table says no JS. **Decided:** drop it for v1. `aria-current` on page links (AC12) stays. Alternative: reuse the TOC scroll-spy island on home.
- **Q18 — Content still to come. ✅** Daniel gave the phone number and confirmed the My Tax India URL and the "Side Projects" stars list. The Nexus 3D demo video and product showcase links come from the resume (LNK-5, LNK-6). The four About "engineering principles" (PRN-1–4) are drafts Claude wrote from the resume at Daniel's request; Daniel revises them later. Nothing else is open.
- **Q19 — `--accent-soft` in light mode is 1.4:1.** **Decided:** keep it as a decorative fill only (chip backgrounds with `--text` on top), never as text or an outline. The colour table now says so.
- **Q20 — Filled-button colour.** The draft's token table had `--accent-strong` for filled buttons while its notes said `#7C9CF7` (white text on `#547CF3` is 3.8:1). **Decided:** filled buttons use `--accent`, as the notes said; the table is updated to match.
- **Q21 — Sticky card stack vs view transitions on phones. ✅ Decided by Daniel (2026-10-23, during PR #15): drop view transitions on phones.** On CI's Linux WebKit, tapping a card in the sticky stack (M3) hung the navigation whenever a view transition ran. Below `md`, an inline script in the root layout hides `document.startViewTransition` before hydration, so phones navigate without M12; tablets and desktop keep the morph. AC50's "where supported" now means "from `md` up".

### Risks

- **Firefox lacks scroll-driven animations.** Covered by `@supports` and visible defaults; Firefox users get a static but complete site.
- **Sticky stacking cards can feel heavy on low-end Android.** Only `transform`/`opacity` are animated; Daniel's real-phone check (AC37) decides whether it stays.
- **Visual-regression flakiness** from fonts and animation. Mitigated by disabling animations in screenshot runs, Linux-only baselines and a small diff threshold.
- **Public contact details.** The phone number and email will be in a public repo and on the site, so expect some scraping and spam calls. Accepted by Daniel (Q6).
- **One large PR.** Daniel chose one PR over 12 slices (2026-10-23), so the ~400-line PR guideline doesn't apply to this spec. The PR description groups the diff by the AC headings to keep review manageable.
- **Bigger JS budget.** At 300 KB, mid-range Android load times can slip. Lighthouse perf ≥ 0.90 still gates, and optimization is a later spec.
- **Depends on PR #14.** This spec assumes `claims.md` is gone. If #14 isn't merged, the content model has to go back to a claim guard.
