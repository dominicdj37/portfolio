import { expect, test } from "@playwright/test";

test.describe("card → case-study morph", () => {
  // AC50
  test("navigates from a card to its case study, with a view transition where supported", async ({
    page,
    browserName,
  }, testInfo) => {
    await page.addInitScript(() => {
      const w = window as typeof window & { __viewTransitions?: number };
      w.__viewTransitions = 0;
      const start = document.startViewTransition?.bind(document);
      if (start) {
        document.startViewTransition = ((arg: never) => {
          w.__viewTransitions = (w.__viewTransitions ?? 0) + 1;
          return start(arg);
        }) as typeof document.startViewTransition;
      }
    });
    await page.goto("/");
    // Let the case study prefetch, so the morph pair forms in one commit.
    await page.waitForLoadState("networkidle");
    await page.locator("#work").getByRole("link", { name: "CASABOT" }).click();
    await expect(page).toHaveURL(/\/work\/casabot$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const count = await page.evaluate(
      () =>
        (window as typeof window & { __viewTransitions?: number })
          .__viewTransitions,
    );
    if (testInfo.project.name !== "desktop") {
      // Phones skip view transitions: with the sticky card stack, WebKit
      // hangs the navigation (Daniel, 2026-10-23).
      expect(count).toBe(0);
    } else if (browserName === "chromium") {
      expect(count).toBeGreaterThan(0);
    }
  });

  // AC50 on phones: a tap during load still navigates (CI's Linux WebKit
  // used to hang here).
  test("navigates from a card tapped right after load on phones", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "phones only");
    await page.goto("/");
    expect(await page.evaluate(() => typeof document.startViewTransition)).toBe(
      "undefined",
    );
    await page.locator("#work").getByRole("link", { name: "BeVigil" }).click();
    await expect(page).toHaveURL(/\/work\/bevigil$/);
  });

  // AC50: both ends of the morph share one <ViewTransition name>.
  test("uses the same transition name on the card and the case-study hero", async ({
    page,
  }) => {
    await page.goto("/");
    const card = await page
      .locator("#work [data-cover='casabot']")
      .getAttribute("data-vt-name");
    await page.goto("/work/casabot");
    const hero = await page
      .locator("main [data-cover='casabot']")
      .getAttribute("data-vt-name");
    expect(card).toBe("cover-casabot");
    expect(hero).toBe(card);
  });
});
