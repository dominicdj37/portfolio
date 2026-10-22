import { expect, test } from "@playwright/test";

// S10-AC2: the deployed home page answers 200, has a title and logs no errors.
test("deployed home page loads cleanly", async ({ page, baseURL }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  // A protected deployment redirects to Vercel's login page, which also
  // answers 200 with a title. Make sure we're still on the site under test.
  expect(baseURL).toBeTruthy();
  expect(new URL(page.url()).origin).toBe(new URL(baseURL ?? "").origin);

  await expect(page).toHaveTitle(/Daniel Dominic/);

  await page.waitForLoadState("networkidle");
  expect(consoleErrors).toEqual([]);
});
