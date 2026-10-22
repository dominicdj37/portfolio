import { describe, expect, it } from "vitest";

import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { filters, projects } from "@/data/projects";
import { site } from "@/data/site";
import { capabilities, marquee, skillGroups } from "@/data/skills";

// AC22: values exactly as written in docs/specs/site-v1.md (content inventory)
// and the plan sections it cites.
describe("content inventory", () => {
  it("has the identity and contact details (ID-1 to ID-5, LNK-4)", () => {
    expect(site.name).toBe("Daniel Dominic");
    expect(site.role).toBe("Senior Android Engineer");
    expect(site.location).toBe("Bengaluru, India");
    expect(site.contact.email).toBe("dominicdj37@gmail.com");
    expect(site.contact.phone).toBe("+91 9947692661");
    expect(site.contact.phoneHref).toBe("tel:+919947692661");
    expect(site.contact.linkedin).toBe(
      "https://www.linkedin.com/in/daniel-dominic-221680143/",
    );
    expect(site.contact.github).toBe("https://github.com/dominicdj37");
    expect(site.contact.starsList).toBe(
      "https://github.com/stars/dominicdj37/lists/side-projects",
    );
  });

  it("has the hero, footer and contact copy from the spec and plan §2, §5", () => {
    expect(site.eyebrow).toBe("Senior Android Engineer · Bengaluru");
    expect(site.headline).toBe("Building experiences beyond the screen.");
    expect(site.intro).toBe(
      "I build production-grade Android products, real-time connected experiences, and immersive AR interfaces. My work spans app architecture, deployment, backend integrations, and engineering workflows designed for quality at scale.",
    );
    expect(site.footerLine).toBe(
      "Senior Android engineer building beyond the screen.",
    );
    expect(site.contactHeadline).toBe(
      "Have a complex mobile problem? Let's build something dependable.",
    );
    expect(site.careerHeadline).toBe(
      "From solving platform problems to owning products end to end.",
    );
    expect(site.labTeaser).toBe(
      "Engineering Lab — interactive experiments, coming soon.",
    );
  });

  it("keeps the availability chip off by default (Q5)", () => {
    expect(site.availability.enabled).toBe(false);
    expect(site.availability.text).toBe("Open to senior Android roles");
  });

  it("has the four proof points (EXP-0, MET-1, EXP-1, SKL-AR)", () => {
    expect(site.proofPoints.map((p) => [p.display, p.label])).toEqual([
      ["7+", "years of Android engineering"],
      ["500K+", "downloads of a tax/FinTech app"],
      ["End to end", "architecture to Play Store delivery"],
      ["AR/XR", "ARCore, Filament, Meta Quest"],
    ]);
  });

  it("has the About story (plan §8) and the four principles (PRN-1 to PRN-4)", () => {
    expect(site.story).toHaveLength(2);
    expect(site.story[0]).toMatch(
      /^I'm Daniel, a Bengaluru-based Senior Android Engineer with 7\+ years/,
    );
    expect(site.principles.map((p) => p.title)).toEqual([
      "Own it end to end.",
      "Architecture is a product decision.",
      "Ship what works outside the demo.",
      "Use AI, keep the judgement.",
    ]);
  });

  it("has the four career stops with the resume's dates (EXP-2, EXP-6, EXP-10, EXP-11)", () => {
    expect(experience.map((r) => [r.company, r.title, r.period])).toEqual([
      [
        "Seven Seas High Tech Systems",
        "Android Developer",
        "Aug 2018–Feb 2019",
      ],
      ["Quintet Solutions", "Software Engineer (Android)", "May 2019–May 2022"],
      ["CloudSEK", "SDE II", "Jun 2022–Jul 2025"],
      [
        "CASABOT Technology Ltd (via InsourceIndia)",
        "Senior Android Developer",
        "Jan 2026–present",
      ],
    ]);
  });

  it("has the education entry (EDU-1)", () => {
    expect(education).toEqual({
      degree: "B.Tech, Computer Science & Engineering",
      school: "CUSAT",
      period: "2014–2018",
      grade: "CGPA 7.0",
    });
  });

  it("has the four projects with their links (LNK-1, LNK-2, LNK-3, LNK-5, LNK-6)", () => {
    expect(projects.map((p) => p.slug)).toEqual([
      "casabot",
      "bevigil",
      "my-tax-india",
      "nexus-3d",
    ]);
    const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
    expect(bySlug.casabot?.links.playStore).toBe(
      "https://play.google.com/store/apps/details?id=com.casabot.android",
    );
    expect(bySlug.bevigil?.links.playStore).toBe(
      "https://play.google.com/store/apps/details?id=com.cloudsek.bevigil",
    );
    expect(bySlug["my-tax-india"]?.links.playStore).toBe(
      "https://play.google.com/store/apps/details?id=com.quintetsolutions",
    );
    expect(bySlug["nexus-3d"]?.links.demoVideo).toBe(
      "https://drive.google.com/file/d/1n66K1vjiZsl1Zda6hAn2YMhZs1jA-NSJ/view?usp=sharing",
    );
    expect(bySlug["nexus-3d"]?.links.showcase).toBe(
      "https://www.linkedin.com/posts/cloudsek_do-we-want-to-make-cybersecurity-fun-and-activity-7188760441068703746-LVKX",
    );
  });

  it("uses the plan §5.3 one-line angles", () => {
    expect(projects.map((p) => p.angle)).toEqual([
      "AI-powered smart-home Android platform with custom AR rendering",
      "Mobile security intelligence, LLM summaries, and backend integration",
      "Production tax/FinTech Android app with 500K+ downloads",
      "Immersive VR product showcase / 3D experience",
    ]);
  });

  it("gives every project 3–5 tags and a status (Q11: Nexus 3D is a prototype)", () => {
    for (const project of projects) {
      expect(project.tags.length, project.slug).toBeGreaterThanOrEqual(3);
      expect(project.tags.length, project.slug).toBeLessThanOrEqual(5);
    }
    expect(projects.map((p) => p.status)).toEqual([
      "live",
      "live",
      "live",
      "prototype",
    ]);
  });

  it("has the six capability groups from plan §5.4", () => {
    expect(capabilities.map((c) => c.title)).toEqual([
      "Native Android",
      "Architecture & Product Ownership",
      "Immersive Computing",
      "Backend & Real-time Systems",
      "Cross-platform & Web",
      "Quality & AI-augmented Delivery",
    ]);
  });

  it("has the seven skills groups from plan §8 and the marquee list", () => {
    expect(skillGroups.map((g) => g.group)).toEqual([
      "Core Android",
      "Architecture",
      "Immersive",
      "Backend & realtime",
      "Cross-platform & web",
      "Quality & delivery",
      "AI-augmented SDLC",
    ]);
    expect(marquee.slice(0, 11)).toEqual([
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
    ]);
  });

  it("has the /work filters in the spec's order", () => {
    expect(filters.map((f) => f.label)).toEqual([
      "All",
      "Android",
      "AR/XR",
      "Backend",
      "Cross-platform",
    ]);
  });
});

// AC23: open rows stay undefined; nothing holds a placeholder.
describe("no placeholder content", () => {
  it("has no TODO, TBD, example.com or dummy numbers anywhere in data/", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const dir = join(process.cwd(), "data");
    for (const file of readdirSync(dir)) {
      const text = readFileSync(join(dir, file), "utf8");
      expect(text, file).not.toMatch(
        // Dummy numbers are long zero runs; "500,000+" is real content.
        /\bTODO\b|\bTBD\b|example\.com|lorem|0{6,}/i,
      );
    }
  });
});
