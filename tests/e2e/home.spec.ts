import { expect, test } from "@playwright/test";

import { expectNoA11yViolations } from "./helpers/a11y";

test.describe("placeholder home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // AC1
  test("shows the name and the coming-soon line inside main", async ({
    page,
  }) => {
    const main = page.getByRole("main");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(main.getByRole("heading", { level: 1 })).toHaveText(
      "Daniel Dominic",
    );
    await expect(main.getByText("Portfolio coming soon.")).toBeVisible();
  });

  // AC2
  test("sets lang, title and description", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Daniel Dominic — portfolio coming soon");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S/,
    );
  });

  // AC3
  test("asks search engines not to index or follow", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );

    // A robots.txt Disallow would stop crawlers from ever seeing the noindex.
    const robots = await page.request.get("/robots.txt");
    if (robots.ok()) {
      expect(await robots.text()).not.toMatch(/^\s*Disallow:\s*\/\S*/im);
    }
  });

  // AC4
  for (const { label, width, height } of [
    { label: "at 320 px", width: 320, height: 568 },
    // 200% zoom on a 390 px phone leaves a 195 px CSS viewport.
    { label: "at 200% zoom on 390 px", width: 195, height: 422 },
  ]) {
    test(`has no horizontal scroll ${label}`, async ({ page }) => {
      await page.setViewportSize({ width, height });

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
      await expect(page.getByText("Portfolio coming soon.")).toBeInViewport();
    });
  }

  // AC5
  test("passes axe in the light colour scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await expectNoA11yViolations(page);
  });

  // AC5
  test("passes axe in the dark colour scheme", async ({ page }) => {
    const background = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.emulateMedia({ colorScheme: "light" });
    const light = await background();
    await page.emulateMedia({ colorScheme: "dark" });

    // Make sure dark mode actually applies, so this isn't a second light run.
    expect(await background()).not.toBe(light);
    await expectNoA11yViolations(page);
  });
});
