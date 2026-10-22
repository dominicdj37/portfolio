import { defineConfig, devices } from "@playwright/test";

// Post-deploy smoke test (S10): runs against a deployed URL, never a local server.
const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error(
    "Set BASE_URL to the deployment to check, e.g. BASE_URL=https://example.vercel.app pnpm smoke",
  );
}

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "tests/smoke",
  forbidOnly: isCI,
  // A live site over the network: allow for a transient blip, not a broken page.
  retries: isCI ? 2 : 0,
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "android", use: { ...devices["Pixel 7"] } }],
});
