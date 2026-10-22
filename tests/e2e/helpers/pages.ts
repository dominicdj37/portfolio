import type { Page } from "@playwright/test";

/** Every route the site v1 spec builds (the 404 is tested separately). */
export const PAGES = [
  "/",
  "/work",
  "/work/casabot",
  "/work/bevigil",
  "/work/my-tax-india",
  "/work/nexus-3d",
  "/about",
  "/contact",
  "/lab",
  "/styleguide",
] as const;

export const RESUME_PATH = "/resume/daniel-dominic-resume.pdf";

/** Whether the resume PDF is published yet (Q12: Daniel adds it). */
export async function resumeIsPublished(page: Page): Promise<boolean> {
  const response = await page.request.get(RESUME_PATH);
  return response.ok();
}

/** True on the phone projects, where the Menu sheet replaces the nav links. */
export function isMobile(projectName: string): boolean {
  return projectName === "android" || projectName === "iphone";
}
