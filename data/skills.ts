// Skills groups (plan §8), capability groups (plan §5.4) and the marquee.

export const skillGroups = [
  {
    group: "Core Android",
    skills: [
      "Kotlin",
      "Java",
      "Compose",
      "XML",
      "Coroutines",
      "Flow",
      "Room",
      "Hilt",
      "Navigation",
    ],
  },
  {
    group: "Architecture",
    skills: [
      "MVVM",
      "Clean Architecture",
      "Use cases",
      "Modular patterns",
      "Testing",
    ],
  },
  {
    group: "Immersive",
    skills: ["ARCore", "Filament", "EGL/OpenGL", "Unity", "Meta Quest"],
  },
  {
    group: "Backend & realtime",
    skills: ["Python", "FastAPI", "MongoDB", "REST", "WebSockets"],
  },
  {
    group: "Cross-platform & web",
    skills: ["Flutter", "Dart", "React", "TypeScript"],
  },
  {
    group: "Quality & delivery",
    skills: [
      "Firebase",
      "Crashlytics",
      "CI/CD",
      "GitHub Actions",
      "Play Store",
    ],
  },
  {
    group: "AI-augmented SDLC",
    skills: ["Claude Code", "MCP", "Konsist", "detekt", "ADRs"],
  },
];

export type Capability = {
  title: string;
  skills: string;
  /** A resume line, linked to the case study it comes from. */
  evidence: { text: string; slug: string };
};

export const capabilities: Capability[] = [
  {
    title: "Native Android",
    skills: "Kotlin, Jetpack Compose, Coroutines/Flow, Room, Hilt.",
    evidence: {
      text: "Built the CASABOT AI Home app on Compose, MVVM with use cases, Hilt and Room.",
      slug: "casabot",
    },
  },
  {
    title: "Architecture & Product Ownership",
    skills: "MVVM, Clean Architecture, testing, releases.",
    evidence: {
      text: "Sole Android engineer from an empty repository to four production releases.",
      slug: "casabot",
    },
  },
  {
    title: "Immersive Computing",
    skills: "ARCore, Filament, rendering, Unity/Meta Quest.",
    evidence: {
      text: "Re-platformed CASABOT's AR feature from SceneView onto a custom ARCore + Filament engine.",
      slug: "casabot",
    },
  },
  {
    title: "Backend & Real-time Systems",
    skills: "FastAPI, MongoDB, REST, WebSockets.",
    evidence: {
      text: "Built BeVigil's backend services in Python FastAPI and MongoDB.",
      slug: "bevigil",
    },
  },
  {
    title: "Cross-platform & Web",
    skills: "Flutter, React, TypeScript.",
    evidence: {
      text: "Designed and launched BeVigil Lite in Flutter for iOS and Android.",
      slug: "bevigil",
    },
  },
  {
    title: "Quality & AI-augmented Delivery",
    skills:
      "GitHub Actions, Crashlytics, Konsist/detekt, ADRs, AI coding workflows.",
    evidence: {
      text: "Managed QA, internal, closed-testing and production tracks, with Crashlytics telemetry.",
      slug: "casabot",
    },
  },
];

export const marquee = [
  "Kotlin",
  "Compose",
  "Coroutines/Flow",
  "Hilt",
  "Room",
  "ARCore",
  "Filament",
  "OpenGL",
  "Unity",
  "FastAPI",
  "Flutter",
  "MongoDB",
  "Firebase",
  "GitHub Actions",
];
