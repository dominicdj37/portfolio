import { describe, expect, it } from "vitest";

import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { capabilities } from "@/data/skills";

// docs/specs/casabot-case-study.md: CASABOT text comes from the resume only,
// exactly as written in the spec's content inventory (CAS-1 to CAS-15).
const casabot = projects.find((p) => p.slug === "casabot");
const casabotRole = experience.find((r) => r.company.startsWith("CASABOT"));
const evidence = (title: string) =>
  capabilities.find((c) => c.title === title)?.evidence.text;

describe("CASABOT content", () => {
  // AC1
  it("fills the case study from the resume (CAS-1 to CAS-11)", () => {
    expect(casabot?.caseStudy).toMatchObject({
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
    });
    expect(casabot?.caseStudy.tradeOffs).toBeUndefined();
    expect(casabot?.caseStudy.learned).toBeUndefined();
  });

  // AC2
  it("uses the resume wording on the timeline and capability tiles (CAS-12 to CAS-15)", () => {
    expect(casabotRole?.highlights[2]).toBe(
      "Managed releases across QA, internal, closed-testing and production tracks.",
    );
    expect(evidence("Native Android")).toBe(
      "Built the CASABOT AI Home app with a 100% Jetpack Compose UI, MVVM, Hilt and Room.",
    );
    expect(evidence("Architecture & Product Ownership")).toBe(
      "Sole Android engineer, from an empty repository to a live product on Google Play.",
    );
    expect(evidence("Quality & AI-augmented Delivery")).toBe(
      "Managed QA, internal, closed-testing and production tracks, and diagnosed crashes and ANRs with Crashlytics.",
    );
  });

  // AC3: claims the resume doesn't make stay off the site.
  it("makes no CASABOT claim beyond the resume", () => {
    const text = JSON.stringify([
      casabot,
      casabotRole,
      capabilities.filter((c) => c.evidence.slug === "casabot"),
    ]);
    expect(text).not.toMatch(/Matter|four production releases|telemetry/i);
  });
});
