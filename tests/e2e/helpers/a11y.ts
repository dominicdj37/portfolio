import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const WCAG_22_A_AA = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22a",
  "wcag22aa",
];

const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

/** Fails on any serious or critical axe violation of WCAG 2.2 A/AA rules. */
export async function expectNoA11yViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_22_A_AA)
    .analyze();

  const blocking = violations
    .filter((v) => v.impact && BLOCKING_IMPACTS.has(v.impact))
    .map((v) => ({
      rule: v.id,
      impact: v.impact,
      help: v.helpUrl,
      targets: v.nodes.map((n) => n.target.join(" ")),
    }));

  expect(blocking, "serious/critical axe violations").toEqual([]);
}
