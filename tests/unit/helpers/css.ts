import { readFileSync } from "node:fs";
import { join } from "node:path";

export const globalsCss = readFileSync(
  join(process.cwd(), "app/globals.css"),
  "utf8",
);

/** The text between the brace that opens at `start` and its matching close. */
export function blockAt(css: string, start: number): string {
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unbalanced braces after offset ${start}`);
}

/** Every `--name: value;` declared directly in a block. */
export function declarations(block: string): Map<string, string> {
  const found = new Map<string, string>();
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    found.set(match[1] ?? "", (match[2] ?? "").trim());
  }
  return found;
}

const DARK_QUERY = "@media (prefers-color-scheme: dark)";

/** Colour tokens per scheme: light on the top-level `:root`, dark in the media query. */
export function schemeTokens(css: string = globalsCss) {
  const darkAt = css.indexOf(DARK_QUERY);
  if (darkAt < 0) throw new Error("no dark colour-scheme block");
  const lightAt = css.indexOf(":root {");
  const darkRootAt = css.indexOf(":root", darkAt);
  return {
    light: declarations(blockAt(css, lightAt)),
    dark: declarations(blockAt(css, darkRootAt)),
  };
}

/** Declarations in the `@theme` block (scheme-independent tokens). */
export function themeTokens(css: string = globalsCss) {
  const at = css.search(/@theme(\s+inline)?\s*\{/);
  if (at < 0) throw new Error("no @theme block");
  return declarations(blockAt(css, at));
}

/** Every @keyframes block, by name. */
export function keyframes(css: string = globalsCss): Map<string, string> {
  const found = new Map<string, string>();
  for (const match of css.matchAll(/@keyframes\s+([\w-]+)/g)) {
    found.set(match[1] ?? "", blockAt(css, match.index ?? 0));
  }
  return found;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two `#RRGGBB` colours. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}
