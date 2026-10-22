// Site-wide content. Every value comes from docs/specs/site-v1.md (content
// inventory) or the plan sections it cites; nothing here is invented.

export type NavKey = "work" | "lab" | "about" | "contact";

export const site = {
  // ID-1, ID-2
  name: "Daniel Dominic",
  role: "Senior Android Engineer",
  location: "Bengaluru, India",

  // Hero (plan §2, spec Home §1)
  eyebrow: "Senior Android Engineer · Bengaluru",
  headline: "Building experiences beyond the screen.",
  intro:
    "I build production-grade Android products, real-time connected experiences, and immersive AR interfaces. My work spans app architecture, deployment, backend integrations, and engineering workflows designed for quality at scale.",
  positioning:
    "I design and ship production Android experiences — from architecture and real-time integrations to immersive AR — with the breadth to build across mobile, backend, and emerging platforms.",

  // Q5: built, off by default.
  availability: { enabled: false, text: "Open to senior Android roles" },

  footerLine: "Senior Android engineer building beyond the screen.",
  careerHeadline:
    "From solving platform problems to owning products end to end.",
  labTeaser: "Engineering Lab — interactive experiments, coming soon.",
  contactHeadline:
    "Have a complex mobile problem? Let's build something dependable.",

  // ID-3, ID-4, ID-5, LNK-4 (Q6: all published)
  contact: {
    email: "dominicdj37@gmail.com",
    phone: "+91 9947692661",
    phoneHref: "tel:+919947692661",
    linkedin: "https://www.linkedin.com/in/daniel-dominic-221680143/",
    github: "https://github.com/dominicdj37",
    starsList: "https://github.com/stars/dominicdj37/lists/side-projects",
  },

  // Q12: Daniel adds the PDF; links appear once it exists.
  resumePath: "/resume/daniel-dominic-resume.pdf",

  nav: [
    { key: "work", label: "Work", href: "/work" },
    { key: "lab", label: "Lab", href: "/lab" },
    { key: "about", label: "About", href: "/about" },
    { key: "contact", label: "Contact", href: "/contact" },
  ] satisfies { key: NavKey; label: string; href: string }[],

  // Proof bento: EXP-0, MET-1, EXP-1, SKL-AR (plan §5.2)
  proofPoints: [
    { display: "7+", count: 7, label: "years of Android engineering" },
    { display: "500K+", count: 500, label: "downloads of a tax/FinTech app" },
    { display: "End to end", label: "architecture to Play Store delivery" },
    { display: "AR/XR", label: "ARCore, Filament, Meta Quest" },
  ] as { display: string; count?: number; label: string }[],

  // About story (plan §8 "Example About introduction")
  story: [
    "I'm Daniel, a Bengaluru-based Senior Android Engineer with 7+ years of experience bringing mobile products from early design to production. My background is rooted in Kotlin and Android architecture, with recent work spanning real-time smart-home experiences, custom AR rendering, app-security products, Python backend services, Flutter, and VR.",
    "I care about maintainable systems, product quality, technical trade-offs, and shipping software that works outside a demo environment.",
  ],

  // PRN-1 to PRN-4: drafts Daniel asked for; he revises them later.
  principles: [
    {
      title: "Own it end to end.",
      body: "From an empty repository to the Play Store, I treat architecture, testing, releases and crash monitoring as one job.",
    },
    {
      title: "Architecture is a product decision.",
      body: "Clear layers, use cases and dependency injection keep features cheap to change long after the first release.",
    },
    {
      title: "Ship what works outside the demo.",
      body: "Real devices, real networks and real telemetry decide when something is done, not the happy path.",
    },
    {
      title: "Use AI, keep the judgement.",
      body: "Agents write code with me; I own the design decisions, the review and the tests that keep refactors safe.",
    },
  ],
};
