import { expect, test } from "@playwright/test";

// TEMPORARY CI diagnostic for the iPhone card-tap failure on Linux WebKit.
// Each variant switches one suspect off. Removed in the fix commit.
const VARIANTS: Record<
  string,
  (page: import("@playwright/test").Page) => Promise<void>
> = {
  baseline: async () => {},
  "no stack animation": async (page) => {
    await page.addStyleTag({
      content: "[data-stack] > article { animation: none !important; }",
    });
  },
  "no sticky": async (page) => {
    await page.addStyleTag({
      content:
        "[data-stack] > article { position: relative !important; animation: none !important; }",
    });
  },
  "no smooth scroll": async (page) => {
    await page.addStyleTag({
      content: "html { scroll-behavior: auto !important; }",
    });
  },
  "reduced motion": async (page) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  },
  "no view transitions": async (page) => {
    await page.evaluate(() => {
      // @ts-expect-error diagnostic
      document.startViewTransition = undefined;
    });
  },
  "after networkidle": async (page) => {
    await page.waitForLoadState("networkidle");
  },
};

for (const [name, setup] of Object.entries(VARIANTS)) {
  test(`DEBUG card tap: ${name}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "iphone", "iphone only");
    await page.goto("/");
    await setup(page);
    await page.locator("#work").getByRole("link", { name: "BeVigil" }).click();
    await expect(page).toHaveURL(/\/work\/bevigil$/);
  });
}
