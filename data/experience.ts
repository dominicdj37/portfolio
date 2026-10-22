// EXP-2, EXP-6, EXP-10, EXP-11 and the plan §8 timeline, oldest first.

export type Role = {
  company: string;
  location?: string;
  title: string;
  period: string;
  /** One line for the home career snapshot (plan §8 "showcase angle"). */
  angle: string;
  /** Role highlights for the About timeline (resume bullets). */
  highlights: string[];
};

export const experience: Role[] = [
  {
    company: "Seven Seas High Tech Systems",
    location: "Kochi",
    title: "Android Developer",
    period: "Aug 2018–Feb 2019",
    angle: "Location tracking, performance and 100+ bug fixes",
    highlights: [
      "Improved a real-time vehicle and personal tracking app with Google location services.",
      "Resolved memory leaks and optimized location tracking with a foreground service.",
      "Closed 100+ pre-existing bugs.",
    ],
  },
  {
    company: "Quintet Solutions",
    location: "Kochi",
    title: "Software Engineer (Android)",
    period: "May 2019–May 2022",
    angle: "Multi-domain production apps and scale",
    highlights: [
      "Built and deployed Android apps across EdTech, FinTech and social domains.",
      "A tax calculation app reached 500,000+ downloads on the Play Store.",
      "Kotlin and MVVM codebases with Coroutines, LiveData and Room.",
    ],
  },
  {
    company: "CloudSEK",
    title: "SDE II",
    period: "Jun 2022–Jul 2025",
    angle: "BeVigil, backend, Flutter, LLM and VR experiments",
    highlights: [
      "Solely architected and built the BeVigil Android app from scratch.",
      "Backend services in Python FastAPI and MongoDB; LLM-generated report summaries.",
      "BeVigil Lite in Flutter for iOS and Android; a Unity + Meta Quest VR prototype.",
    ],
  },
  {
    company: "CASABOT Technology Ltd (via InsourceIndia)",
    title: "Senior Android Developer",
    period: "Jan 2026–present",
    angle: "Sole Android ownership, AR and releases",
    highlights: [
      "Sole Android engineer: took the app from an empty repository to a live product.",
      "Shipped the AR feature on SceneView, then re-platformed it onto custom ARCore + Filament.",
      "Four production releases.",
    ],
  },
];
