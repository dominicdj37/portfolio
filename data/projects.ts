// Projects (plan §5.3, §6, §9) and their case studies. Only facts from the
// resume and the spec's content inventory; case-study sections without
// content stay undefined and render nothing (spec, Case study).

export type Category = "android" | "ar-xr" | "backend" | "cross-platform";

export type CaseStudyContent = {
  title?: string;
  summary?: string;
  context?: string;
  ownership?: string[];
  challenge?: string;
  architecture?: string;
  implementation?: string;
  tradeOffs?: string;
  outcome?: string[];
  learned?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Plan §5.3 one-line angle. */
  angle: string;
  domain?: string;
  role?: string;
  period?: string;
  tags: string[];
  categories: Category[];
  status: "live" | "prototype";
  links: { playStore?: string; demoVideo?: string; showcase?: string };
  caseStudy: CaseStudyContent;
};

export const projects: Project[] = [
  {
    slug: "casabot",
    title: "CASABOT",
    angle: "AI-powered smart-home Android platform with custom AR rendering",
    domain: "Smart home · AR",
    role: "Senior Android Developer · CASABOT Technology Ltd (via InsourceIndia)",
    period: "Jan 2026–present",
    tags: ["Kotlin", "Jetpack Compose", "ARCore", "Filament", "Hilt"],
    categories: ["android", "ar-xr"],
    status: "live",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.casabot.android",
    },
    caseStudy: {
      title: "Architecting a smart-home Android app with immersive AR",
      summary:
        "From architecture to launch: building a production smart-home Android experience, with real-time integrations and a custom mobile AR rendering stack.",
      context:
        "CASABOT AI Home is a smart-home Android app: real-time smart-device control, a voice and chat assistant, live camera streaming, push notifications, and secure credential storage with biometric app lock.",
      ownership: [
        "Owned the app end to end as the sole Android engineer: architecture, development, testing and Play Store releases.",
        "Set the coding, testing and release standards and best practices for the Android codebase.",
        "Coordinated with the backend and iOS teams on API contracts and shared app-behavior documentation, with work tracked in Jira.",
        "Used agentic AI workflows (Claude Code with MCP tool integrations, custom hooks, ADRs) to speed up development, while owning design, code review and test coverage.",
      ],
      challenge:
        "The AR feature was the product's key differentiator. I shipped the first version on the SceneView library, then, after evaluating its limits, re-platformed it onto a custom engine.",
      architecture:
        "A single-activity app with a 100% Jetpack Compose UI, MVVM with ViewModel and StateFlow, Hilt and Room.",
      implementation:
        "The AR feature runs on a custom multithreaded ARCore + Filament engine. I designed ViewNode, which renders live, touchable Compose UI onto 3D surfaces. For real-time smart-device control, I built capability-driven control UIs with optimistic state updates.",
      outcome: [
        "Took the app from an empty repository to a live product on Google Play.",
        "Managed the release cycle across QA, internal, closed-testing and production tracks.",
        "Diagnosed crashes and ANRs using Firebase Crashlytics and Android Studio Profiler.",
      ],
    },
  },
  {
    slug: "bevigil",
    title: "BeVigil",
    angle:
      "Mobile security intelligence, LLM summaries, and backend integration",
    domain: "App security",
    role: "SDE II · CloudSEK",
    period: "Jun 2022–Jul 2025",
    tags: ["Kotlin", "FastAPI", "MongoDB", "Flutter", "LLMs"],
    categories: ["android", "backend", "cross-platform"],
    status: "live",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.cloudsek.bevigil",
    },
    caseStudy: {
      title: "Building mobile access to app-security intelligence",
      summary:
        "Mobile security intelligence for a dataset covering 1M+ Play Store applications.",
      context:
        "BeVigil gives mobile access to security reports for a dataset of 1M+ Play Store apps.",
      ownership: [
        "Solely architected and built the BeVigil Android app from scratch, from coding to Play Store publishing and crash monitoring.",
        "Integrated LLMs to generate automated summaries of security reports.",
        "Built backend services in Python FastAPI and MongoDB, with Firebase Auth for user management and sync between mobile and server.",
        "Designed and launched BeVigil Lite in Flutter for iOS and Android.",
      ],
      outcome: [
        "Published on Google Play, with crash monitoring.",
        "BeVigil Lite launched on both iOS and Android.",
      ],
    },
  },
  {
    slug: "my-tax-india",
    title: "My Tax India",
    angle: "Production tax/FinTech Android app with 500K+ downloads",
    domain: "FinTech",
    role: "Software Engineer (Android) · Quintet Solutions",
    period: "May 2019–May 2022",
    tags: ["Kotlin", "MVVM", "Coroutines", "Room", "Firebase"],
    categories: ["android"],
    status: "live",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.quintetsolutions",
    },
    caseStudy: {
      title: "Shipping Android finance experiences at consumer scale",
      context:
        "A tax calculation app on Google Play, one of several Android apps built at Quintet across EdTech, FinTech and social domains.",
      ownership: [
        "Engineered Kotlin and MVVM codebases, with Coroutines for asynchronous work and Jetpack components (LiveData, Room).",
        "Took features from Figma designs to production in an Agile team.",
        "Integrated Firebase services (FCM, Auth, Crashlytics) and used MotionLayout for UI animations.",
      ],
      outcome: ["Reached 500,000+ downloads on the Play Store."],
    },
  },
  {
    slug: "nexus-3d",
    title: "Nexus 3D",
    angle: "Immersive VR product showcase / 3D experience",
    domain: "VR",
    tags: ["VR", "3D", "Product showcase"],
    categories: ["ar-xr"],
    status: "prototype",
    links: {
      demoVideo:
        "https://drive.google.com/file/d/1n66K1vjiZsl1Zda6hAn2YMhZs1jA-NSJ/view?usp=sharing",
      showcase:
        "https://www.linkedin.com/posts/cloudsek_do-we-want-to-make-cybersecurity-fun-and-activity-7188760441068703746-LVKX",
    },
    // Q11: shown as a prototype; no context until Daniel confirms what it is,
    // so the case study isn't linked from cards yet.
    caseStudy: {
      title: "Presenting products in an immersive 3D environment",
    },
  },
];

export const filters: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "android", label: "Android" },
  { id: "ar-xr", label: "AR/XR" },
  { id: "backend", label: "Backend" },
  { id: "cross-platform", label: "Cross-platform" },
];

export function filterCount(id: Category | "all"): number {
  return id === "all"
    ? projects.length
    : projects.filter((p) => p.categories.includes(id)).length;
}

/** A case study is linked from cards only once it has context (spec, Case study). */
export function hasCaseStudy(project: Project): boolean {
  return Boolean(project.caseStudy.context);
}

/** Where a project card points: its case study, else its demo video, else nowhere. */
export function projectHref(
  project: Project,
): { href: string; external: boolean } | undefined {
  if (hasCaseStudy(project)) {
    return { href: `/work/${project.slug}`, external: false };
  }
  const external = project.links.demoVideo ?? project.links.showcase;
  return external ? { href: external, external: true } : undefined;
}
