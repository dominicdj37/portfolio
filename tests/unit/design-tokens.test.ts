import { describe, expect, it } from "vitest";

import {
  contrast,
  globalsCss,
  keyframes,
  schemeTokens,
  themeTokens,
} from "./helpers/css";

const COLOURS = [
  "--bg",
  "--surface",
  "--surface-raised",
  "--text",
  "--text-muted",
  "--accent",
  "--accent-strong",
  "--accent-soft",
  "--border",
  "--success",
];

// Values from the spec's colour table (dark, light).
const SPEC_COLOURS: Record<string, [string, string]> = {
  "--bg": ["#0C1324", "#F7F8FB"],
  "--surface": ["#19253B", "#FFFFFF"],
  "--surface-raised": ["#192B48", "#EEF1F7"],
  "--text": ["#F8FAFC", "#0B1220"],
  "--text-muted": ["#AABAD1", "#4A5873"],
  "--accent": ["#7C9CF7", "#3557D6"],
  "--accent-strong": ["#547CF3", "#3557D6"],
  "--accent-soft": ["#B8CCF7", "#C7D4FB"],
  "--border": ["#37475E", "#D5DCE8"],
  "--success": ["#5FD3A0", "#137A4F"],
};

const THEME_TOKENS = [
  // Radius
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  // Spacing (4 px base)
  "--spacing",
  // Motion
  "--dur-fast",
  "--dur-base",
  "--dur-slow",
  "--dur-hero",
  "--ease-out",
  "--ease-in-out",
  "--ease-spring",
  // Type
  "--text-display-2xl",
  "--text-display-xl",
  "--text-display-lg",
  "--text-heading",
  "--text-body-lg",
  "--text-body",
  "--text-label",
  "--font-display",
  "--font-sans",
  "--font-mono",
];

describe("design tokens", () => {
  // AC2
  it("defines every colour token in both colour schemes, with the spec's values", () => {
    const { light, dark } = schemeTokens();
    for (const token of COLOURS) {
      const [darkValue, lightValue] = SPEC_COLOURS[token] ?? [];
      expect(dark.get(token)?.toUpperCase(), `dark ${token}`).toBe(darkValue);
      expect(light.get(token)?.toUpperCase(), `light ${token}`).toBe(
        lightValue,
      );
    }
  });

  // AC2
  it("defines the radius, spacing, motion and type tokens in @theme", () => {
    const theme = themeTokens();
    for (const token of THEME_TOKENS) {
      expect(theme.has(token), token).toBe(true);
    }
    expect(theme.get("--spacing")).toBe("0.25rem");
    expect(theme.get("--radius-sm")).toBe("8px");
    expect(theme.get("--radius-md")).toBe("14px");
    expect(theme.get("--radius-lg")).toBe("24px");
    expect(theme.get("--radius-xl")).toBe("32px");
    expect(theme.get("--dur-fast")).toBe("150ms");
    expect(theme.get("--dur-base")).toBe("250ms");
    expect(theme.get("--dur-slow")).toBe("500ms");
    expect(theme.get("--dur-hero")).toBe("900ms");
    expect(theme.get("--text-body")).toBe("1rem");
  });

  // AC2: components use semantic utilities, never raw hex.
  it("keeps raw hex colours out of components and pages", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? walk(join(dir, entry.name))
          : [join(dir, entry.name)],
      );
    const offenders = ["app", "components"]
      .flatMap((dir) => walk(join(process.cwd(), dir)))
      .filter((file) => /\.tsx?$/.test(file))
      .filter((file) => /#[0-9a-f]{6}\b/i.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});

describe("colour contrast", () => {
  const AA_BODY = 4.5;
  const TEXT = ["--text", "--text-muted", "--accent", "--success"];
  const SURFACES = ["--bg", "--surface", "--surface-raised"];

  for (const scheme of ["light", "dark"] as const) {
    // AC3
    it(`meets WCAG AA for every text token on every surface (${scheme})`, () => {
      const tokens = schemeTokens()[scheme];
      for (const fg of TEXT) {
        for (const bg of SURFACES) {
          const ratio = contrast(tokens.get(fg) ?? "", tokens.get(bg) ?? "");
          expect(ratio, `${fg} on ${bg}`).toBeGreaterThanOrEqual(AA_BODY);
        }
      }
    });
  }

  // AC3: filled buttons use --accent with --bg text in dark, white in light.
  it("meets WCAG AA for filled-button text on --accent", () => {
    const { light, dark } = schemeTokens();
    expect(
      contrast(dark.get("--bg") ?? "", dark.get("--accent") ?? ""),
    ).toBeGreaterThanOrEqual(AA_BODY);
    expect(
      contrast("#FFFFFF", light.get("--accent") ?? ""),
    ).toBeGreaterThanOrEqual(AA_BODY);
    expect(globalsCss).toMatch(/--on-accent:\s*#0C1324/i);
    expect(globalsCss).toMatch(/--on-accent:\s*#FFFFFF/i);
  });
});

describe("motion rules", () => {
  // AC5
  it("has a global reduced-motion rule that removes animation, transitions and smooth scroll", () => {
    const rule = globalsCss.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?animation-duration:\s*0\.01ms[\s\S]*?transition-duration:\s*0\.01ms[\s\S]*?scroll-behavior:\s*auto/,
    );
    expect(rule).not.toBeNull();
  });

  // AC18
  it("provides reveal, stagger, marquee, ripple and count-up utilities", () => {
    for (const name of ["reveal", "stagger", "marquee", "ripple", "count-up"]) {
      expect(globalsCss, name).toMatch(
        new RegExp(`(@utility ${name}\\b|\\.${name}\\b)`),
      );
    }
  });

  // AC18: every scroll-driven animation sits inside @supports.
  it("keeps every scroll timeline inside @supports (animation-timeline: view())", () => {
    const supports = [
      ...globalsCss.matchAll(/@supports \(animation-timeline: view\(\)\)/g),
    ];
    expect(supports.length).toBeGreaterThan(0);

    // Remove each @supports block, then nothing scroll-driven may remain.
    let outside = globalsCss;
    for (;;) {
      const at = outside.indexOf("@supports (animation-timeline: view())");
      if (at < 0) break;
      const open = outside.indexOf("{", at);
      let depth = 0;
      let end = open;
      for (let i = open; i < outside.length; i++) {
        if (outside[i] === "{") depth++;
        if (outside[i] === "}" && --depth === 0) {
          end = i;
          break;
        }
      }
      outside = outside.slice(0, at) + outside.slice(end + 1);
    }
    expect(outside).not.toMatch(/animation-timeline\s*:/);
    expect(outside).not.toMatch(/view-timeline/);
  });

  // AC21
  it("never animates layout properties", () => {
    const banned =
      /(^|[\s;{])(width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*|inset)\s*:/;
    const frames = keyframes();
    expect(frames.size).toBeGreaterThan(0);
    for (const [name, body] of frames) {
      expect(body, `@keyframes ${name}`).not.toMatch(banned);
    }
    // Transitions name only paint/composite properties.
    for (const match of globalsCss.matchAll(
      /transition(-property)?:\s*([^;]+);/g,
    )) {
      expect(match[2], match[0]).not.toMatch(
        /\b(width|height|top|left|margin|padding|all)\b/,
      );
    }
  });

  // AC21: "in the codebase" includes Tailwind classes in app/ and components/.
  it("never animates layout properties from component classes", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const { join, relative } = await import("node:path");
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? walk(join(dir, entry.name))
          : [join(dir, entry.name)],
      );
    const defined = new Set(keyframes().keys());
    const files = ["app", "components"]
      .flatMap((dir) => walk(join(process.cwd(), dir)))
      .filter((file) => /\.tsx?$/.test(file));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const name = relative(process.cwd(), file);
      const text = readFileSync(file, "utf8");
      expect(text, name).not.toMatch(/\btransition-all\b/);
      for (const match of text.matchAll(/transition-\[([^\]]+)\]/g)) {
        expect(match[1], `${name}: ${match[0]}`).not.toMatch(
          /\b(width|height|top|left|right|bottom|margin|padding|inset|all)\b/,
        );
      }
      // Arbitrary animations must use keyframes from globals.css, which the
      // test above checks.
      // The keyframe name ends at the first "_" (Tailwind's space).
      for (const match of text.matchAll(/animate-\[([a-zA-Z0-9-]+)/g)) {
        expect(defined.has(match[1] ?? ""), `${name}: ${match[0]}`).toBe(true);
      }
    }
  });
});
