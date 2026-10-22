import { expect, test } from "@playwright/test";

import { isMobile, PAGES, resumeIsPublished } from "./helpers/pages";

test.describe("layout shell", () => {
  // AC10
  for (const path of PAGES) {
    test(`${path} has a skip link first, one header, main#main and a footer`, async ({
      page,
      browserName,
    }) => {
      await page.goto(path);
      await expect(page.locator("header")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);

      if (browserName === "webkit") {
        // WebKit's Tab skips links by default (Safari's "Press Tab to
        // highlight each item" is off), so focus the first focusable element
        // in document order directly.
        await page
          .locator("a[href], button, input, [tabindex]:not([tabindex='-1'])")
          .first()
          .focus();
      } else {
        await page.keyboard.press("Tab");
      }
      const focused = page.locator(":focus");
      await expect(focused).toHaveAttribute("href", "#main");
      await expect(focused).toHaveText("Skip to content");
      await expect(focused).toBeVisible();
    });
  }

  // AC12
  test("marks the current page's nav link", async ({ page }, testInfo) => {
    await page.goto("/about");
    if (isMobile(testInfo.project.name)) {
      await page.getByRole("button", { name: "Menu" }).click();
    }
    const nav = page.getByRole("navigation", {
      name: isMobile(testInfo.project.name) ? "Menu" : "Main",
    });
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(nav.getByRole("link", { name: "Work" })).not.toHaveAttribute(
      "aria-current",
      /.*/,
    );
  });

  // AC13
  test("renders the stack-trace 404 with HTTP 404", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
    const main = page.getByRole("main");
    await expect(main).toContainText("E/Router: ActivityNotFoundException");
    for (const name of ["Home", "Work", "Contact"]) {
      await expect(main.getByRole("link", { name, exact: true })).toBeVisible();
    }
  });
});

test.describe("mobile menu", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), "the sheet is below md only");
  });

  // AC11
  test("opens with every nav link, closes on Esc and returns focus", async ({
    page,
  }) => {
    await page.goto("/");
    const menu = page.getByRole("button", { name: "Menu" });
    // Open it from the keyboard: Safari doesn't focus buttons on tap, so
    // focus return is a keyboard (and screen-reader) behaviour.
    await menu.focus();
    await page.keyboard.press("Enter");

    const sheet = page.locator("#site-menu");
    await expect(sheet).toBeVisible();
    for (const name of ["Work", "Lab", "About", "Contact"]) {
      await expect(
        sheet.getByRole("link", { name, exact: true }),
      ).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(menu).toBeFocused();
  });

  // AC11 + Q13
  test("navigates on link tap and leaves the sheet closed", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("#site-menu")).toBeHidden();
  });

  // AC11 + Q13: tapping the current page's link also closes the sheet.
  test("closes when the current page's link is tapped", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "Menu" }).click();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: "About" })
      .click();
    await expect(page.locator("#site-menu")).toBeHidden();
  });

  // AC14
  test("reaches Contact, and the resume once published, in two taps", async ({
    page,
  }) => {
    const resume = await resumeIsPublished(page);
    for (const path of ["/", "/work/casabot", "/about", "/lab"]) {
      await page.goto(path);
      await page.getByRole("button", { name: "Menu" }).click();
      const sheet = page.locator("#site-menu");
      await expect(sheet.getByRole("link", { name: "Contact" })).toBeVisible();
      await expect(sheet.getByRole("link", { name: /Resume/ })).toHaveCount(
        resume ? 1 : 0,
      );
      await sheet.getByRole("link", { name: "Contact" }).click();
      await expect(page).toHaveURL(/\/contact$/);
    }
  });
});

test.describe("mobile menu without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test.beforeEach(({}, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), "the sheet is below md only");
  });

  // AC11: the native popover needs no script.
  test("opens and closes on Esc", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.locator("#site-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-menu")).toBeHidden();
  });
});
