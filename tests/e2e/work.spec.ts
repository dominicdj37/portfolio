import { expect, test, type Page } from "@playwright/test";

import { isMobile } from "./helpers/pages";

const visibleCards = (page: Page) =>
  page.locator("[data-categories]").filter({ visible: true });

test.describe("/work", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/work");
  });

  // AC38 + AC40
  test("shows every project by default, with counts in the filter labels", async ({
    page,
  }) => {
    const group = page.getByRole("group", { name: "Filter projects" });
    await expect(group.getByRole("radio", { name: "All (4)" })).toBeChecked();
    for (const name of [
      "Android (3)",
      "AR/XR (2)",
      "Backend (1)",
      "Cross-platform (1)",
    ]) {
      await expect(group.getByRole("radio", { name })).toBeVisible();
    }
    await expect(visibleCards(page)).toHaveCount(4);
  });

  // AC38: keyboard.
  test("filters with the keyboard", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), "keyboard on desktop");
    await page.getByRole("radio", { name: "All (4)" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("radio", { name: "Android (3)" }),
    ).toBeChecked();
    await expect(visibleCards(page)).toHaveCount(3);
    await page.keyboard.press("ArrowRight");
    await expect(visibleCards(page)).toHaveCount(2);
  });

  // AC38: touch.
  test("filters with a tap", async ({ page }, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), "touch on phones");
    await page.getByText("Backend (1)").tap();
    await expect(visibleCards(page)).toHaveCount(1);
    await expect(visibleCards(page)).toContainText("BeVigil");
    await page.getByText("All (4)").tap();
    await expect(visibleCards(page)).toHaveCount(4);
  });

  // AC38: CSS only, so it works without JavaScript too.
  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("still filters", async ({ page }) => {
      await page.goto("/work");
      await page.getByText("AR/XR (2)").click();
      await expect(visibleCards(page)).toHaveCount(2);
    });
  });
});
