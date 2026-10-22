# Daniel Dominic — Portfolio Website Plan

> **Document type:** Product requirements, content plan, creative direction, and engineering implementation brief  
> **Version:** 1.1 — 21 October 2026 (merged with the 3D-workspace concept; changes marked **[v1.1]**)  
> **Working title:** **Engineering Beyond Mobile**  
> **Owner / portfolio subject:** Daniel Dominic  
> **Source:** `daniel_dominic_resume_2026_generic.pdf` (2 pages) and earlier planning discussions (not in the repo).  
> **Private notes:** open questions, verification items and permission checklists live in `docs/private/plan-notes.md`, which is gitignored and exists only on Daniel's machine. Content ships once Daniel puts it in an Approved spec.

---

## 1. Executive summary

Build a premium personal engineering portfolio for **Daniel Dominic**, a **Senior Android Engineer with 7+ years of experience**. The website should present him as a deeply experienced native Android specialist whose work also spans **AR/XR, backend systems, cross-platform applications, and AI-assisted engineering workflows**.

**Core concept:** A professional, fast, responsive engineering portfolio inspired by a dark, high-end product website, with selective interactive 3D elements that demonstrate immersive-technology expertise.

**[v1.1] Signature feature:** an optional, explorable **3D Workspace** — a stylized developer desk rendered in the browser that visitors can rotate, zoom and tap to jump into sections. It uses **no camera or AR session**, works on any modern phone, and always sits alongside the normal 2D site, never in front of it.

The portfolio must **prove ownership and engineering decision-making**, not merely list frameworks or display screenshots.

### Primary goals

1. Help hiring managers and senior technical interviewers understand Daniel's scope, strengths, and progression within **30–60 seconds**.
2. Convert interest into **project case-study reads, resume downloads, GitHub visits, LinkedIn visits, and contact actions**.
3. Establish credibility through **production software, architectural choices, technical trade-offs, deployment experience, and concrete outcomes**.
4. Demonstrate breadth beyond Android without weakening the identity of **Android specialist first**.
5. Create a maintainable base that can later support technical writing, open-source demos, and freelance/consulting inquiries.

### Intended audience

- **Primary (default):** Hiring managers, Android tech leads, staff/principal engineers, founders, and recruiters evaluating senior/lead mobile engineering roles.
- **Secondary:** Product teams and clients seeking mobile, AR/XR, or full-stack consulting.

Optimize for recruiting, with a secondary contact path for consulting (the final balance is a private-notes decision).

---

## 2. Personal positioning and messaging

### Identity

**Daniel Dominic**  
**Senior Android Engineer · Mobile Architect · Immersive Technology Builder**

### Positioning statement

> I design and ship production Android experiences — from architecture and real-time integrations to immersive AR — with the breadth to build across mobile, backend, and emerging platforms.

### Suggested hero content

**Eyebrow:** `SENIOR ANDROID ENGINEER · BENGALURU, INDIA`

**Headline:** `Building experiences beyond the screen.`

**Supporting text:**

> I build production-grade Android products, real-time connected experiences, and immersive AR interfaces. My work spans app architecture, deployment, backend integrations, and engineering workflows designed for quality at scale.

**Primary CTA:** `Explore My Work` → `/#work`  
**Secondary CTA:** `View Resume` → hosted resume PDF  
**Tertiary CTA:** `Let's Connect` → contact section

### Proof points for the home page

| Proof point           | Display                   | Evidence / interpretation                                      |
| --------------------- | ------------------------- | -------------------------------------------------------------- |
| Experience            | **7+ years**              | Resume summary and career history                              |
| App scale             | **500K+ downloads**       | FinTech/tax app built at Quintet; do not imply across all apps |
| Product ownership     | **End-to-end Android**    | CASABOT and BeVigil Android ownership                          |
| Specialized expertise | **AR/XR engineering**     | ARCore, Filament, OpenGL/EGL, Unity and Meta Quest work        |
| Engineering breadth   | **Mobile · Backend · XR** | Android, Flutter, Python/FastAPI, MongoDB, React/TypeScript    |

**Claims policy:** Only use outcomes supported by the resume or later independently verified. Do not invent performance improvements, revenue, user retention, team size, client names, or app ratings.

### Voice and tone

- Clear, technically confident, succinct, and specific.
- First person for personal introductions; straightforward case-study writing for projects.
- No exaggerated phrases such as “world-class,” “10x engineer,” or “revolutionary.”
- Explain _why_ a design decision was made, not just _what_ framework was used.
- Use strong verbs: **architected, built, shipped, migrated, integrated, optimized, validated**.

---

## 3. Creative direction

### Recommended direction: Engineering Portfolio × Immersive Developer Lab

Combine:

- **Concept 1 — Engineering Portfolio:** polished dark design, bold type, concise project cards, editorial case studies, architecture diagrams.
- **Concept 3 — Immersive Developer Lab:** selective interactive 3D work, short device demos, and an experimental technical showcase.

Retain **Concept 2 — Minimalist Product Engineer** as a light-theme alternative or a design reference for restraint and whitespace.

### Visual mood

- Premium, precise, modern, technical — never cluttered or overly gaming-oriented.
- Dark navy/graphite foundation with electric-blue emphasis.
- Clear visual hierarchy, generous spacing, high contrast.
- Subtle grids, fine dividers, and restrained glow/gradient effects.
- Real screenshots and demos take priority over abstract stock visuals.

### Suggested design tokens

| Token           | Value     | Usage                              |
| --------------- | --------- | ---------------------------------- |
| `--bg`          | `#0C1324` | Main background                    |
| `--surface`     | `#19253B` | Cards and secondary panels         |
| `--surface-alt` | `#192B48` | Elevated sections                  |
| `--accent`      | `#547CF3` | Links, highlights, selected states |
| `--accent-soft` | `#B8CCF7` | Fine accents and highlights        |
| `--text`        | `#F8FAFC` | Main text                          |
| `--text-muted`  | `#AABAD1` | Supporting text                    |
| `--border`      | `#37475E` | Outlines and separators            |

These are **starting values**, not mandatory final colors. Adjust to pass contrast tests.

### Typography

- Headings: **Space Grotesk** or **Sora**.
- Body: **Inter** or **Manrope**.
- Code / labels: **JetBrains Mono**.
- Limit to two or three font families; self-host or load efficiently.

### Motion language

- Short hover elevation/glow and text transitions.
- Light stagger on project cards.
- Scroll reveals that never hide important content if JavaScript is delayed.
- A short, polished device motion showcase in the hero, with a static fallback.
- Respect `prefers-reduced-motion`.
- **Avoid** long intro animations, custom cursor gimmicks, aggressive parallax, and heavy shaders on mobile.
- **[v1.1]** The only parallax allowed is the opt-in gyroscope tilt inside the 3D Workspace (see 3.1), never on regular pages.

### 3.1 [v1.1] 3D Workspace — interaction concept (no camera AR)

**Idea:** the portfolio's "world" is a small, low-poly developer desk. Visitors explore it like an object, not a game level.

| Scene object                 | Opens                            | Why it fits                                |
| ---------------------------- | -------------------------------- | ------------------------------------------ |
| Phone on a stand             | Featured work (Android projects) | Android specialist first                   |
| Headset                      | Nexus 3D / immersive work        | AR/XR breadth                              |
| Monitor                      | Architecture Explorer (Lab 02)   | Engineering depth, reused inside the scene |
| Smart-home hub / small robot | CASABOT case study               | Flagship project                           |
| Notebook                     | About + timeline                 | Story                                      |
| Mail tray                    | Contact + resume                 | Conversion                                 |

**Controls**

- Drag to orbit, pinch to zoom (clamped so the desk can't be lost off-screen).
- Tap an object → camera eases to it → a 2D panel slides up with a summary and a link to the full page.
- Visible labels/hotspots on first load; no hidden "find the clickable thing" puzzles.
- Optional **"Tilt mode"**: gyroscope-driven parallax, off by default. iOS requires a motion-permission prompt after a user tap.

**Placement rules**

- Lives at `/explore`, reached from a hero CTA (`Explore in 3D`) and the Lab. The home page itself stays 2D and fast.
- A `Skip 3D / List view` button is always visible; every panel's content also exists as a normal page.
- Low-end detection (WebGL unavailable, low `deviceMemory`, or slow first frames) → show the static poster image and the list view automatically.

**Visual style:** match the site tokens — navy/graphite materials, electric-blue emissive accents, soft HDRI environment lighting (asset packs, not custom models). Stylized and calm, not a gaming room.

### Recommended visual hierarchy

1. Headline + key proof points.
2. Real production work.
3. Technical ownership and architecture.
4. Engineering lab/experiments.
5. Career story, contact and resume.

---

## 4. Information architecture and navigation

### Recommended sitemap

```text
/
├── Home
│   ├── Hero + proof points
│   ├── Featured work
│   ├── Engineering capabilities
│   ├── Selected Engineering Lab demos
│   ├── Career highlights
│   └── Contact CTA
├── /work
│   └── All featured work and experiments
├── /work/casabot
├── /work/bevigil
├── /work/my-tax-india
├── /work/nexus-3d
├── /explore             # [v1.1] 3D Workspace (optional entry, lazy-loaded)
├── /lab
│   ├── 3D Playground       # [v1.1] renamed; browser 3D, no camera
│   ├── Architecture Explorer
│   ├── AI-Augmented Engineering
│   └── Compose UI Playground
├── /about
│   ├── Professional story
│   ├── Experience timeline
│   └── Technical toolkit
└── /contact
```

**MVP simplification:** Build the home page, four project case studies, and About/Contact first. Engineering Lab can launch with one high-quality demo and expand later. **[v1.1]** `/explore` launches after the 2D site is live (Phase 4), so the site is never blocked on 3D work.

### Global navbar

`daniel.` logo · `Work` · `Engineering Lab` · `About` · `Contact` · `Resume ↗`

- Sticky on desktop; accessible menu on mobile.
- Display active page/section state.
- Contact and resume always easy to reach.

### Footer

Short positioning line · LinkedIn · GitHub · email contact · resume link · copyright.

---

## 5. Home page — detailed sections

### 5.1 Hero

**Content**

- Identity, headline, two-sentence positioning.
- Primary CTA: `Explore My Work`.
- Secondary CTA: `Download Resume`.
- Optional contextual links: LinkedIn / GitHub.
- Right-side visual: a device frame showing **actual project screenshots or a short muted demo**.
- **[v1.1] Decision:** no WebGL in the hero. Use a pre-rendered image or short video of the 3D Workspace as a teaser, with a tertiary CTA `Explore in 3D →` linking to `/explore`. This resolves the conflict with "avoid downloading 3D assets on the home page" (section 11).

**Behavior**

- Desktop: two-column split or oversized headline with device visual.
- Mobile: stacked text first, device visual second, CTAs immediately visible.
- Respect reduced motion and poor network conditions.

### 5.2 Proof bar

Show three or four concise cards:

- `7+ years` — Android engineering experience.
- `500K+` — downloads of a tax/FinTech app.
- `End to end` — architecture to Play Store delivery.
- `AR/XR` — immersive mobile and VR experience.

Prefer contextual labels over claims like “millions of users impacted.”

### 5.3 Featured work

Grid of four projects, with top priority to CASABOT and BeVigil:

| Order | Project          | One-line angle                                                       |
| ----- | ---------------- | -------------------------------------------------------------------- |
| 1     | **CASABOT**      | AI-powered smart-home Android platform with custom AR rendering      |
| 2     | **BeVigil**      | Mobile security intelligence, LLM summaries, and backend integration |
| 3     | **My Tax India** | Production tax/FinTech Android app with 500K+ downloads              |
| 4     | **Nexus 3D**     | Immersive VR product showcase / 3D experience                        |

**Card fields:** project title, one-line purpose, 3–5 relevant tags, cover media, `Read Case Study`.

### 5.4 Engineering capabilities

Instead of an icon wall, use 4–6 capability groups with short examples of work:

1. **Native Android** — Kotlin, Jetpack Compose, Coroutines/Flow, Room, Hilt.
2. **Architecture & Product Ownership** — MVVM, Clean Architecture, testing, releases.
3. **Immersive Computing** — ARCore, Filament, rendering, Unity/Meta Quest.
4. **Backend & Real-time Systems** — FastAPI, MongoDB, REST, WebSockets.
5. **Cross-platform & Web** — Flutter, React, TypeScript.
6. **Quality & AI-augmented Delivery** — GitHub Actions, Crashlytics, Konsist/detekt, ADRs, AI coding workflows.

### 5.5 Engineering Lab preview

Feature 2–3 demos, each showing a real technical concept. Link to `/lab`.

### 5.6 Career snapshot

Short timeline: Seven Seas → Quintet → CloudSEK → CASABOT.

Headline: `From solving platform problems to owning products end to end.`

### 5.7 About/contact CTA

Headline: `Have a complex mobile problem? Let's build something dependable.`

Support hiring, open-source collaborations, and relevant project inquiries without implying Daniel is currently available for all forms of work.

---

## 6. Case-study content model

**Use this consistent structure on every project page:**

1. **Hero:** Project name, domain, short description, role, dates, technology tags, cover media.
2. **The context:** What the product does and what user problem it addresses.
3. **My ownership:** What Daniel specifically built or was responsible for.
4. **Engineering challenge:** A hard requirement, constraint, or design decision.
5. **Architecture:** A diagram or concise explanation of relevant components and communication.
6. **Implementation:** Selected deep dives, code snippets from shareable/demo code, or UI/video examples.
7. **Trade-offs:** Why one approach was preferred and what was sacrificed.
8. **Outcome:** Concrete releases, features shipped, supported scale, and other verifiable results.
9. **What I learned:** Honest reflection or improvement opportunities.
10. **Links:** Play Store, shareable code, video demo, related work.

> Never publish confidential source, internal dashboards, proprietary diagrams, API keys, customer data, or employer-only information. Recreate generalized diagrams and synthetic demos if necessary.

### 6.1 CASABOT — flagship case study

**Suggested title:** `Architecting a smart-home Android app with immersive AR`  
**Role:** Senior Android Developer · CASABOT Technology Ltd (via InsourceIndia)  
**Period:** January 2026–present (as of the resume)  
**Public link:** https://play.google.com/store/apps/details?id=com.casabot.android

**Resume-supported facts**

- Sole Android engineer; owned app architecture, development, testing, and Play Store releases.
- Took the Android product from an empty repository to a live app.
- Established Compose + MVVM/use cases + Hilt + Room architecture and development standards.
- Led AR development, originally shipping with SceneView and later migrating to a custom ARCore + Filament engine.
- Delivered real-time smart-device controls, voice/chat assistant integration, live camera streaming, Matter onboarding, and push notifications.
- Collaborated with backend and iOS teams on API contracts and shared behavior documentation.
- Shipped four production releases and used Crashlytics/telemetry to investigate field issues.

**Recommended sections / diagrams**

- High-level Android feature/architecture map.
- `SceneView → custom ARCore + Filament` migration story: motivation, trade-offs, custom responsibilities; verify technical specifics with Daniel before publishing.
- Event flow for real-time device commands and updates (sanitized/generalized).
- Release lifecycle (QA → internal → closed testing → production).
- 20–40 second capture of a permitted AR experience.

**Possible headline copy**

> From architecture to launch: building a production smart-home Android experience, with real-time integrations and a custom mobile AR rendering stack.

**Needs verification / assets:** pending verification (see private notes). Nothing in this section ships until Daniel puts it in an Approved spec.

### 6.2 BeVigil — full-stack and security case study

**Suggested title:** `Building mobile access to app-security intelligence`  
**Role:** SDE II · CloudSEK  
**Period:** June 2022–July 2025  
**Public link:** https://play.google.com/store/apps/details?id=com.cloudsek.bevigil

**Resume-supported facts**

- Solely architected and built the BeVigil Android app from scratch.
- Offered mobile access to security-report data covering 1M+ Play Store apps.
- Integrated LLMs for automatically generated report summaries.
- Built backend services in Python FastAPI and MongoDB.
- Used Firebase Authentication and synchronization between mobile/server.
- Designed/launched BeVigil Lite in Flutter for Android and iOS.
- Explored TestFlight and App Store release/compliance work.
- Contributed to React frontend and TypeScript backend features elsewhere in the CloudSEK platform.

**Suggested deep dives**

- Mobile ↔ FastAPI ↔ MongoDB data flow (only verified public-safe details).
- LLM summarization UX: where summaries helped users navigate detailed reports.
- Flutter Lite: how functionality was adapted for two platforms.
- Testing, releases, and crash-monitoring ownership.

**Potential callout**

`Mobile security intelligence for a dataset covering 1M+ Play Store applications.`

_Important:_ This describes the **dataset**, not 1M+ BeVigil app users or installs.

### 6.3 My Tax India — scale and production experience

**Suggested title:** `Shipping Android finance experiences at consumer scale`  
**Company:** Quintet Solutions  
**Period:** May 2019–May 2022  
**Public link from resume:** https://play.google.com/store/apps/details?id=com.quintetsolutions (unverified; do not link until confirmed)

**Resume-supported facts**

- Built/deployed multiple Android applications across EdTech, FinTech, and social categories.
- Tax calculation app achieved **500K+ downloads** on Google Play.
- Worked with Kotlin, MVVM, Coroutines, LiveData, Room, Firebase, and MotionLayout.
- Contributed from Figma implementation to production delivery.

**Narrative angle**

Demonstrate proven delivery and product reliability, emphasizing architecture and UX rather than inventing conversion or retention metrics.

**Verify before publishing:** pending verification (see private notes), including the store listing and the downloads figure.

### 6.4 Nexus 3D — immersive experience

**Suggested title:** `Presenting products in an immersive 3D environment`  
**Public assets:** Product showcase and demo video listed in the resume (URLs not provided).

**Resume-supported facts**

- Resume lists `Nexus 3D` under VR App projects as a product showcase with a demo video.
- Separately, the CloudSEK experience includes a standalone Unity/Meta Quest data-visualization prototype using the Meta Interaction Toolkit.

**Caution:** Do **not** assume Nexus 3D and the CloudSEK data-visualization prototype are the same project without Daniel's confirmation.

**Recommended presentation**

- Short embedded demo video.
- Spatial navigation, interaction principles, and a technical overview.
- Screenshots or GIFs showing progression through the experience.
- Clearly mark as prototype/demo if it was not a public product.

---

## 7. Engineering Lab — interactive differentiators

The Lab is not a collection of toy apps. It should consist of **small, polished, public-safe technical exhibits** that connect directly to Daniel's experience.

### Lab 01 — 3D playground (browser, no camera) [v1.1 renamed]

**Goal:** Demonstrate rendering and interaction thinking.

**MVP:** A browser-based 3D model viewer with orbit, zoom, material selection, lighting presets, and a short side-by-side video of actual Android AR functionality where permitted.

**Implementation:** React Three Fiber + Three.js for the **web exhibit**. Clearly label it as a browser demo, not an ARCore app running in-browser.

**Stretch:** Toggle annotations describing planes, depth, anchors, and rendering pipeline concepts (using diagrams/video, not claiming native ARCore in the web demo).

### Lab 02 — Android Architecture Explorer

**Goal:** Make Clean Architecture understandable and interactive.

**Flow:**

```text
User interaction / Compose UI
            ↓
       ViewModel
            ↓
       Use Case
            ↓
     Repository
        ↙    ↘
 Local cache   Remote API
 (Room)       (Retrofit)
```

Clicking/tapping a node reveals:

- What that layer owns.
- Its dependency direction.
- A short, representative _public demo code_ snippet.
- Test boundaries or typical failure modes.

Add a visible note that the diagram is illustrative unless confirmed to be exactly representative of a production codebase.

### Lab 03 — AI-augmented engineering workflow

**Goal:** Demonstrate mature, controlled use of coding agents rather than merely listing AI tools.

**Interactive story:**

`Feature request → Architecture rules → Agent implementation → Static checks → Tests → Human review → Release`

Include sample public-safe examples of:

- ADR templates and machine-readable project guidance.
- Konsist/detekt architecture checks.
- Claude Code hooks and commit-verified documentation.
- Test safety nets for refactors.
- Custom MCP integrations, with sensitive details omitted.

**Emphasis:** Humans own design decisions, code review, correctness, and final release.

### Lab 04 — Compose UI playground

**Goal:** Show native Android UI craft.

**Ideas:**

- Compose navigation or state-management visualization.
- Motion/transition showcase with Android screen captures.
- Responsive Material 3 UI pattern gallery.
- Android Glance widget or Wear OS sample (optional later).

**Implementation note:** Browser exhibits can illustrate concepts; use real Android recordings or a repository for native behavior.

### Lab release order

1. **Architecture Explorer** — clearest engineering signal, low implementation cost. **[v1.1]** Build it as a standalone component so it can also open from the monitor in the 3D Workspace.
2. **3D Workspace (`/explore`)** — **[v1.1]** the signature visual differentiator; absorbs most of the original 3D Playground goals.
3. **3D Playground** — model viewer with materials/lighting presets; may be folded into the Workspace.
4. **AI-Augmented Workflow** — senior-level process and tooling differentiation.
5. **Compose Playground** — expandable over time.

---

## 8. About, experience and technology presentation

### About page outline

1. Two-paragraph professional story.
2. Guiding engineering principles.
3. Career timeline.
4. Capabilities with selected evidence.
5. Working style: cross-team collaboration, testing, releases, and ownership.
6. Links to resume, LinkedIn, GitHub and contact.

### Example About introduction

> I'm Daniel, a Bengaluru-based Senior Android Engineer with 7+ years of experience bringing mobile products from early design to production. My background is rooted in Kotlin and Android architecture, with recent work spanning real-time smart-home experiences, custom AR rendering, app-security products, Python backend services, Flutter, and VR.
>
> I care about maintainable systems, product quality, technical trade-offs, and shipping software that works outside a demo environment.

### Experience timeline

| Dates (per resume) | Company                                    | Role / showcase angle                                                 |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------- |
| Jan 2026–present   | CASABOT Technology Ltd (via InsourceIndia) | Senior Android Developer — sole Android ownership, AR and releases    |
| Jun 2022–Jul 2025  | CloudSEK                                   | SDE II — BeVigil, backend, Flutter, LLM and VR experiments            |
| May 2019–May 2022  | Quintet Solutions                          | Software Engineer (Android) — multi-domain production apps and scale  |
| Aug 2018–Feb 2019  | Seven Seas High Tech Systems               | Android Developer — location tracking, performance and 100+ bug fixes |

### Skills: evidence-based groups

| Group                    | Skills to display                                                    | Presentation rule                |
| ------------------------ | -------------------------------------------------------------------- | -------------------------------- |
| **Core Android**         | Kotlin, Java, Compose, XML, Coroutines, Flow, Room, Hilt, Navigation | Largest visual emphasis          |
| **Architecture**         | MVVM, Clean Architecture, use cases, modular patterns, testing       | Back with example diagrams       |
| **Immersive**            | ARCore, Filament, EGL/OpenGL, Unity, Meta Quest                      | Back with actual demos           |
| **Backend & realtime**   | Python, FastAPI, MongoDB, REST, WebSockets                           | Show through BeVigil and CASABOT |
| **Cross-platform & web** | Flutter, Dart, React, TypeScript                                     | Secondary emphasis               |
| **Quality & delivery**   | Firebase, Crashlytics, CI/CD, GitHub Actions, Play Store             | Tie to production ownership      |
| **AI-augmented SDLC**    | Claude Code, MCP, Konsist, detekt, ADRs                              | Show guardrails and examples     |

Avoid numeric self-ratings like `Kotlin 95%`. They are subjective and do not prove proficiency.

---

## 9. Tech stack and implementation architecture

### Recommended stack

| Concern                       | Tool                                                                                                            | Reason                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Web app                       | **Next.js + TypeScript**                                                                                        | SEO-friendly routes, strong React ecosystem, typed data                                                 |
| Styling                       | **Tailwind CSS**                                                                                                | Fast consistent responsive styling                                                                      |
| Components                    | **Accessible custom components / Radix primitives**                                                             | Robust keyboard, focus and dialog/menu behavior                                                         |
| Motion                        | **Motion**                                                                                                      | Controlled interactions and enter transitions                                                           |
| 3D visuals                    | **React Three Fiber + Three.js + drei**                                                                         | Interactive browser 3D for `/explore` and the Lab; `drei` gives camera controls, loaders, `Html` panels |
| 3D assets **[v1.1]**          | **Licensed low-poly asset packs** (CC0-first: Kenney, Quaternius, Poly Pizza) + **Poly Haven HDRI** environment | Decided: no custom Blender modeling for v1; assemble the desk from packs. See `docs/workflow.md` §7     |
| 3D asset pipeline **[v1.1]**  | **gltf-transform** (Meshopt/Draco, KTX2 textures)                                                               | Keep the scene within the mobile budget                                                                 |
| Camera transitions **[v1.1]** | `drei` `CameraControls` or GSAP                                                                                 | Smooth tap-to-focus moves                                                                               |
| Editorial content             | **MDX**                                                                                                         | Version-controlled long-form case studies                                                               |
| Icons                         | **Lucide**                                                                                                      | Consistent, lightweight technical icons                                                                 |
| Hosting                       | **Vercel**                                                                                                      | Straightforward Next.js deployment                                                                      |
| Analytics                     | **Privacy-aware analytics**                                                                                     | Evaluate CTA and case-study engagement                                                                  |

A CMS is unnecessary for the initial version unless Daniel expects non-developers to edit content.

### Architecture principles

- Static or server-rendered content wherever possible.
- Use client components only for interactions that need them.
- Dynamically import 3D experiences with loading/static fallbacks.
- Keep project data separate from page layout.
- Never require WebGL to navigate or read project details.
- Maintain shared components for project cards, media, stats, tags, timeline and case-study sections.

### Suggested repository structure

```text
portfolio/
├── app/
│   ├── page.tsx
│   ├── work/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── explore/page.tsx   # [v1.1] 3D Workspace, dynamic import, ssr:false
│   ├── lab/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/          # Navbar, Footer, Container
│   ├── home/            # Hero, ProofBar, FeaturedWork
│   ├── projects/        # ProjectCard, CaseStudyHeader, ProjectMedia
│   ├── lab/             # ArchitectureExplorer, ModelViewer, WorkflowDemo
│   ├── explore/         # [v1.1] Scene, Hotspot, InfoPanel, TiltToggle, QualityGate
│   └── ui/              # Button, Badge, Tabs, SectionHeading
├── content/
│   ├── projects/
│   │   ├── casabot.mdx
│   │   ├── bevigil.mdx
│   │   ├── my-tax-india.mdx
│   │   └── nexus-3d.mdx
│   └── writing/         # Optional future articles
├── data/
│   ├── projects.ts
│   ├── experience.ts
│   ├── skills.ts
│   └── site.ts
├── lib/
│   ├── mdx.ts
│   └── analytics.ts
├── public/
│   ├── images/projects/
│   ├── videos/
│   ├── models/          # [v1.1] workspace.glb (compressed), poster.webp fallback
│   ├── resume/daniel-dominic-resume.pdf
│   └── og-image.png
├── styles/
└── tests/
```

This is a **suggested** structure, not a requirement to include every folder at launch.

### Project metadata model (illustrative)

```ts
export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  period?: string;
  technologies: string[];
  coverImage: string;
  featured: boolean;
  links?: {
    playStore?: string;
    github?: string;
    demoVideo?: string;
  };
  metrics?: Array<{ value: string; label: string }>;
};
```

All displayed metrics must have a source or editorial verification note.

---

## 10. Interaction and responsive behavior

### Navigation

- Accessible desktop navigation and mobile menu.
- Visible focus indicators, keyboard operation, `aria` labeling where relevant.
- Smooth anchor scrolling only when motion preference permits.

### Project cards

- Clear hover/focus affordance.
- No hover-only essential content; mobile users must see title, role and link.
- Use real thumbnail media when available; fallback to designed typographic cover.

### Case-study pages

- Scannable intro, sticky contents sidebar on wide screens (optional).
- Expandable technical diagrams with a text explanation underneath.
- Videos with captions/poster frames and user-controlled playback.
- Code samples legible on narrow screens.

### Mobile-first layout

| Breakpoint            | Intent                                                            |
| --------------------- | ----------------------------------------------------------------- |
| Small mobile          | Single-column flow; quick CTA access; static 3D preview if needed |
| Large mobile / tablet | Flexible 1–2 column cards; readable diagrams                      |
| Desktop               | Split hero, 2-column featured work, optional sticky contents      |
| Wide desktop          | Restrained max-width; do not stretch paragraphs edge to edge      |

### Accessibility minimums

- Target WCAG 2.2 AA where feasible.
- Keyboard-operable nav, dialogs and demos.
- Text alternatives for screenshots/diagrams; captions/transcripts for meaningful videos.
- Respect reduced motion and color contrast standards.
- Provide a non-WebGL alternative for interactive 3D content.

---

## 11. SEO, performance, privacy and quality

### SEO

- Meaningful page titles, descriptions and canonical URLs.
- Open Graph/Twitter card assets per featured project if practical.
- Sitemap, robots directives, correct heading hierarchy.
- Structured data for `Person` and relevant creative works where accurate.
- Clean URL slugs (`/work/casabot`, etc.).
- No keyword-stuffed claims or misleading experience titles.

### Performance targets (aspirational; validate on real devices)

- Good Core Web Vitals on typical mobile connections.
- Optimize images (AVIF/WebP when suitable), responsive `sizes`, deferred below-fold media.
- Compress demo video and prefer click-to-play for large media.
- Avoid downloading 3D assets on the home page unless necessary.
- Prefer system font fallback while web fonts load.
- Include loading/error fallbacks for media and models.

### [v1.1] 3D Workspace budget (mid-range Android is the reference device)

| Metric                    | Target                                                           |
| ------------------------- | ---------------------------------------------------------------- |
| Total scene download      | ≤ 5 MB (GLB + textures), loaded only on `/explore`               |
| Draw calls                | ≤ 100 (merge meshes, texture atlases)                            |
| Triangles                 | ≤ ~150K                                                          |
| Lighting                  | Baked into textures; at most one cheap real-time light           |
| Frame rate                | Steady 60 fps target, 30 fps acceptable floor                    |
| Pixel ratio               | Capped at 2 (`dpr={[1, 2]}`), adaptive drop when frames are slow |
| Time to first interaction | Poster image instantly; scene interactive in ≤ 3 s on 4G         |

Render on demand (no continuous loop when idle) to save battery.

### Analytics events (privacy-conscious)

- `resume_click`
- `project_open` (with project slug)
- `github_click`
- `linkedin_click`
- `contact_click`
- `lab_demo_open`
- `explore_open`, `explore_object_tap` (object id), `explore_skip` **[v1.1]** — tells you whether the 3D Workspace earns its place

Do not track sensitive form data or invasive device identifiers. Only use analytics appropriate to the website's privacy obligations.

### QA checklist

- Keyboard navigation and screen-reader basics.
- Layout at 320px mobile widths through desktop.
- Light/slow network conditions and JavaScript errors.
- All store/social/demo links and file downloads work.
- Images have meaningful alt text; animations can be reduced.
- No private source or internal screenshots accidentally published.
- Lighthouse/performance check after adding 3D/media.
- **[v1.1]** `/explore` tested on a mid-range Android phone and an iPhone: touch controls, tilt-mode permission flow, low-end fallback, and that the List view reaches every section.

---

## 12. Asset and information checklist

### Must obtain before the polished launch

The asset and permission checklist is kept in the private notes. Publicly, the rule is: no screenshot, video, diagram or branding ships without a recorded permission, and every third-party 3D asset is listed in `LICENSES-ASSETS.md`.

### Existing URLs from resume

- **LinkedIn:** https://www.linkedin.com/in/daniel-dominic-221680143/
- **CASABOT:** https://play.google.com/store/apps/details?id=com.casabot.android
- **BeVigil:** https://play.google.com/store/apps/details?id=com.cloudsek.bevigil
- **My Tax India (resume listing):** https://play.google.com/store/apps/details?id=com.quintetsolutions (unverified; do not link until confirmed)
- **Side-project repositories list:** https://github.com/stars/dominicdj37/lists/side-projects

> These URLs are transcribed from the resume. Verify that they still resolve to the intended public resources before publication. Do not assume the starred-list URL represents Daniel's own repositories; select his public work explicitly.

### Missing facts / open questions

Tracked in the private notes and resolved during Phase 0. The production domain is not yet decided, so no domain should be hard-coded.

---

## 13. Suggested implementation phases

### Phase 0 — Content and permission audit

**Outputs:** Verified facts, approved assets, final positioning, project outline, target audience.

- Resolve the open questions in the private notes.
- Collect case-study screenshots, demo videos and technical narratives.
- Confirm public vs restricted information.
- Write 100–200 word summaries for the four featured projects.

**Definition of done:** No major public claim or project story depends on assumptions.

### Phase 1 — Design system and home page

**Outputs:** Responsive home page and reusable UI components.

- Set fonts, colors, spacing and components.
- Build navbar, hero, proof cards, featured work, capabilities, timeline preview, footer.
- Add SEO metadata and responsive behavior.
- Test mobile usability and reduced motion.

**Definition of done:** Someone can understand the profile, see work and open a contact or resume action within 30 seconds.

### Phase 2 — Case-study pages

**Outputs:** CASABOT, BeVigil, My Tax India, Nexus 3D pages.

- Establish MDX and project metadata.
- Create shared case-study components.
- Prioritize CASABOT and BeVigil depth.
- Add diagrams, media and evidence-based outcomes.

**Definition of done:** Every featured card leads to an informative, credible case study.

### Phase 3 — Lab MVP

**Outputs:** One real interactive demo and Lab index.

- Ship Architecture Explorer first.
- Add real/native supporting clips where appropriate.
- Include accessible text fallback.
- Profile performance and isolate client-side bundles.

**Definition of done:** The Lab demonstrates an engineering concept without requiring knowledge of the original company's proprietary code.

### Phase 4 — Immersive polish + 3D Workspace

**Outputs:** `/explore` 3D Workspace, enhanced media presentation, optional animations.

- **[v1.1]** Sketch the desk layout and object → section mapping.
- **[v1.1]** Assemble the scene from asset packs, light it with an HDRI environment, compress with gltf-transform, check the budget.
- **[v1.1]** Build hotspots, tap-to-focus camera, info panels, List view, low-end fallback, opt-in tilt mode.
- Reuse Architecture Explorer inside the monitor panel.
- Improve transitions and microinteractions.
- Re-test page performance and accessibility.
- Keep all key information readable without animation/WebGL.

**Definition of done:** Visual polish supports technical credibility rather than slowing down or distracting from it.

### Phase 5 — Launch and iteration

**Outputs:** Deployed website, monitored links, updated resume and analytics.

- Domain/DNS and HTTPS.
- Open Graph and SEO audit.
- Device/browser QA.
- Verify all links, media and downloadable files.
- Ask peers or hiring managers to complete a 30-second comprehension test.
- Refine based on navigation and project engagement.

**Definition of done:** Public portfolio is accurate, fast, maintainable and easy to share.

---

## 14. MVP scope vs future scope

| Feature                                   |      MVP      |             Later             |
| ----------------------------------------- | :-----------: | :---------------------------: |
| Dark responsive design system             |       ✓       |                               |
| Home page with credible proof points      |       ✓       |                               |
| Featured work cards                       |       ✓       |                               |
| CASABOT and BeVigil detailed case studies |       ✓       |                               |
| My Tax India and Nexus 3D pages           |       ✓       |                               |
| Resume, contact, social links             |       ✓       |                               |
| Career timeline and grouped skills        |       ✓       |                               |
| Architecture Explorer demo                | Optional MVP+ |               ✓               |
| 3D Workspace at `/explore` **[v1.1]**     |               | ✓ (first post-launch feature) |
| Browser-based 3D viewer                   |               |               ✓               |
| AI engineering workflow demo              |               |               ✓               |
| Compose demo library                      |               |               ✓               |
| Technical blog and tutorials              |               |               ✓               |
| CMS, multilingual site or complex admin   |               |        Only if needed         |

**Delivery rule:** Strong content and clear navigation matter more than shipping several incomplete interactive demos.

---

## 15. Acceptance criteria

The first public version should pass these checks:

**Messaging**

- [ ] Visitor can identify Daniel as a senior native Android engineer immediately.
- [ ] Breadth in AR/XR, backend and Flutter is visible without dominating Android expertise.
- [ ] Experience and quantitative claims are properly scoped and verified.

**Projects**

- [ ] CASABOT demonstrates architectural ownership and AR specialization.
- [ ] BeVigil shows mobile, backend and cross-platform engineering.
- [ ] My Tax India shows production delivery/scale without invented performance metrics.
- [ ] Nexus 3D is clearly labeled and not conflated with another VR prototype.

**Experience**

- [ ] The timeline correctly reflects the resume.
- [ ] A working resume download and professional links are present.
- [ ] Contact action requires minimal effort.

**Engineering and UX**

- [ ] Navigation works with keyboard and mobile touch.
- [ ] 3D or motion never prevents access to content.
- [ ] **[v1.1]** `/explore` meets the 3D budget on a mid-range Android phone and always offers List view.
- [ ] Major layouts work on small phones, tablets and large screens.
- [ ] No employer-private content or credentials are exposed.
- [ ] Public launch performance, accessibility and metadata have been tested.

---

## 16. Final recommendation

**Build a recruiter-first, technically rich portfolio with CASABOT and BeVigil as the anchor case studies.** Use premium dark design, concise proof points, and authentic product media. Add the Engineering Lab as an evolving demonstration of AR/XR, architecture and AI-augmented engineering, rather than trying to launch every experiment at once.

### Suggested sequence

`Verify content → Design home → Publish case studies → Launch → Add Lab demos → Iterate`

### One-line brief for a designer or AI coding agent

> Create a polished, mobile-first portfolio for Daniel Dominic, a senior Android engineer with 7+ years of production experience. Use a restrained dark-navy visual system, premium typography, real project evidence, in-depth architecture-focused case studies, and selective accessible 3D interactions, including an optional explorable 3D desk (no camera AR) at /explore that maps scene objects to portfolio sections. Prioritize CASABOT, BeVigil, My Tax India and Nexus 3D. The result should feel like a credible senior engineer's personal product website, not a generic template or an effects-heavy tech demo.

---

_End of document._
