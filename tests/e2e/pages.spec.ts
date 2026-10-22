import { expect, test } from "@playwright/test";

import { expectNoA11yViolations } from "./helpers/a11y";
import { PAGES, RESUME_PATH, resumeIsPublished } from "./helpers/pages";

test.describe("every page", () => {
  for (const path of PAGES) {
    for (const colorScheme of ["light", "dark"] as const) {
      test(`${path} passes axe (${colorScheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await expectNoA11yViolations(page);
      });
    }
  }

  // AC9: /styleguide is never linked.
  test("never links /styleguide", async ({ page }) => {
    for (const path of PAGES.filter((p) => p !== "/styleguide")) {
      await page.goto(path);
      await expect(page.locator('a[href*="styleguide"]')).toHaveCount(0);
    }
  });
});

test.describe("/styleguide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/styleguide");
  });

  // AC9
  test("is noindex and shows every colour token and component", async ({
    page,
  }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    for (const token of [
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
    ]) {
      await expect(
        page.getByText(token, { exact: true }).first(),
      ).toBeVisible();
    }
    for (const name of [
      "Container",
      "Section",
      "Button",
      "ArrowLink",
      "Tag",
      "Card",
      "StatTile",
      "DeviceFrame",
    ]) {
      await expect(
        page.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
    }
  });

  // AC8: visible focus ring and 44 × 44 px targets.
  test("gives every interactive element a focus ring and a 44 px target", async ({
    page,
  }) => {
    const targets = page.locator("main [data-target]");
    const count = await targets.count();
    expect(count).toBeGreaterThan(4);
    for (let i = 0; i < count; i++) {
      const target = targets.nth(i);
      await target.focus();
      const ring = await target.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          style: style.outlineStyle,
          width: parseFloat(style.outlineWidth),
        };
      });
      expect(ring.style, `target ${i}`).not.toBe("none");
      expect(ring.width, `target ${i}`).toBeGreaterThanOrEqual(2);
      const box = await target.boundingBox();
      expect(box?.width, `target ${i}`).toBeGreaterThanOrEqual(44);
      expect(box?.height, `target ${i}`).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("/about", () => {
  // AC46
  test("shows story, principles, timeline, skills, education and links", async ({
    page,
  }) => {
    await page.goto("/about");
    const main = page.getByRole("main");
    await expect(main).toContainText("I'm Daniel, a Bengaluru-based");
    for (const heading of [
      "Engineering principles",
      "Experience",
      "Skills",
      "Education",
    ]) {
      await expect(
        main.getByRole("heading", { name: heading, level: 2 }),
      ).toBeVisible();
    }
    await expect(main.getByText("Own it end to end.")).toBeVisible();
    await expect(main.getByText("CUSAT")).toBeVisible();
    await expect(main).not.toContainText("%");
    await expect(
      main.getByRole("link", { name: /Side Projects/ }),
    ).toHaveAttribute(
      "href",
      "https://github.com/stars/dominicdj37/lists/side-projects",
    );
  });
});

test.describe("/contact", () => {
  // AC47
  test("shows email, phone, LinkedIn and GitHub cards and the resume once it exists", async ({
    page,
  }) => {
    await page.goto("/contact");
    const main = page.getByRole("main");
    await expect(
      main.getByRole("link", { name: /dominicdj37@gmail\.com/ }),
    ).toHaveAttribute("href", "mailto:dominicdj37@gmail.com");
    await expect(
      main.getByRole("link", { name: /9947692661/ }),
    ).toHaveAttribute("href", "tel:+919947692661");
    await expect(main.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/daniel-dominic-221680143/",
    );
    await expect(main.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/dominicdj37",
    );

    if (await resumeIsPublished(page)) {
      const response = await page.request.get(RESUME_PATH);
      expect(response.headers()["content-type"]).toContain("application/pdf");
      await expect(main.getByRole("link", { name: /Resume/ })).toHaveAttribute(
        "href",
        RESUME_PATH,
      );
    } else {
      await expect(main.getByRole("link", { name: /Resume/ })).toHaveCount(0);
    }
  });
});

test.describe("/lab", () => {
  // AC48
  test("is a teaser with no canvas and no WebGL", async ({ page }) => {
    await page.goto("/lab");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(
      page.getByRole("main").getByRole("link", { name: /Work/ }),
    ).toBeVisible();
  });
});
