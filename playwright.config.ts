import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
// Not 3000, so a running `next dev` is never mistaken for the production build.
const port = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "android", use: { ...devices["Pixel 7"] } },
    // iPhone 14 is 390 px wide, matching the PR template's mobile screenshots.
    { name: "iphone", use: { ...devices["iPhone 14"] } },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  // Production server only: run `pnpm build` first.
  webServer: {
    command: `pnpm start --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
