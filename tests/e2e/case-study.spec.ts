import { expect, test } from "@playwright/test";

import { isMobile } from "./helpers/pages";

const SLUGS = ["casabot", "bevigil", "my-tax-india", "nexus-3d"];

test.describe("case studies", () => {
  // AC41
  test("serves the four slugs and 404s anything else", async ({ page }) => {
    for (const slug of SLUGS) {
      const response = await page.goto(`/work/${slug}`);
      expect(response?.status(), slug).toBe(200);
    }
    const missing = await page.goto("/work/not-a-project");
    expect(missing?.status()).toBe(404);
  });

  // AC45
  test("gives each case study a unique title and description", async ({
    page,
  }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const slug of SLUGS) {
      await page.goto(`/work/${slug}`);
      titles.add(await page.title());
      descriptions.add(
        (await page
          .locator('meta[name="description"]')
          .getAttribute("content")) ?? "",
      );
    }
    expect(titles.size).toBe(SLUGS.length);
    expect(descriptions.size).toBe(SLUGS.length);
    expect([...titles][0]).toMatch(/— Daniel Dominic$/);
  });

  // AC43: desktop sticky TOC with the active section marked.
  test("marks the active section in the desktop table of contents", async ({
    page,
  }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), "desktop TOC");
    await page.goto("/work/casabot");
    const toc = page.locator("[data-toc='desktop']");
    await expect(toc).toBeVisible();
    expect(await toc.evaluate((el) => getComputedStyle(el).position)).toBe(
      "sticky",
    );
    await page.locator("#outcome").scrollIntoViewIfNeeded();
    await expect(toc.getByRole("link", { name: "Outcome" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(toc.locator("[aria-current='true']")).toHaveCount(1);
  });

  // AC43: a collapsible TOC on phones.
  test("collapses the table of contents on phones", async ({
    page,
  }, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), "mobile TOC");
    await page.goto("/work/casabot");
    await expect(page.locator("[data-toc='desktop']")).toBeHidden();
    const details = page.locator("details[data-toc='mobile']");
    await expect(details).toBeVisible();
    await details.locator("summary").click();
    // 44 px touch targets (spec, Space, layout, shape).
    for (const box of await details
      .getByRole("link")
      .evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().height),
      )) {
      expect(box).toBeGreaterThanOrEqual(44);
    }
    await details.getByRole("link", { name: "Outcome" }).click();
    await expect(page).toHaveURL(/#outcome$/);
  });

  // AC44
  test("shows a decorative, CSS-only reading-progress bar", async ({
    page,
  }) => {
    await page.goto("/work/casabot");
    const bar = page.locator("[data-reading-progress]");
    await expect(bar).toHaveAttribute("aria-hidden", "true");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    // AC44: the bar still renders without any script.
    test("still renders the progress bar", async ({ page }) => {
      await page.goto("/work/casabot");
      await expect(page.locator("[data-reading-progress]")).toBeAttached();
    });
  });
});
