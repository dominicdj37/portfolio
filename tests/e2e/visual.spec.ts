import { expect, test } from "@playwright/test";

// AC15: baselines are Linux-only (Sprint 0 W8) and only Daniel's
// update-snapshots workflow writes them (Sprint 0 Q3, AC16).
const ROUTES = [
  ["home", "/"],
  ["work", "/work"],
  ["case-study", "/work/casabot"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["lab", "/lab"],
  ["styleguide", "/styleguide"],
  ["not-found", "/this-page-does-not-exist"],
] as const;

test.describe("visual regression", () => {
  test.skip(
    process.platform !== "linux",
    "baselines are generated on Linux only (font rendering differs)",
  );

  for (const [name, path] of ROUTES) {
    for (const colorScheme of ["light", "dark"] as const) {
      test(`${name} (${colorScheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`${name}-${colorScheme}.png`, {
          fullPage: true,
          animations: "disabled",
          maxDiffPixelRatio: 0.001,
        });
      });
    }
  }
});
