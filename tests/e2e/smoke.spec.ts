import { expect, test } from "@playwright/test";

import { expectNoA11yViolations } from "./helpers/a11y";

test("home page loads cleanly and passes axe", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await page.waitForLoadState("networkidle");
  expect(consoleErrors).toEqual([]);

  await expectNoA11yViolations(page);
});
