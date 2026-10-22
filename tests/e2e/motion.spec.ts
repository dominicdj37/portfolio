import { expect, test } from "@playwright/test";

test.describe("motion", () => {
  // AC5
  test("reduced motion shortens animations and turns off smooth scroll", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const word = page.locator("#hero h1 [data-word]").first();
    const duration = await word.evaluate((el) =>
      parseFloat(getComputedStyle(el).animationDuration),
    );
    expect(duration).toBeLessThanOrEqual(0.01);
    // No stagger delay either, or later words sit blurred while they wait.
    const delays = await page
      .locator("#hero h1 [data-word]")
      .evaluateAll((els) =>
        els.map((el) => parseFloat(getComputedStyle(el).animationDelay)),
      );
    expect(Math.max(...delays)).toBeLessThanOrEqual(0.01);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
  });

  // AC19: reduced motion.
  test("shows every revealed element fully on first paint with reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const states = await page.locator(".reveal").evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el);
        return { opacity: style.opacity, transform: style.transform };
      }),
    );
    expect(states.length).toBeGreaterThan(0);
    for (const state of states) {
      expect(state).toEqual({ opacity: "1", transform: "none" });
    }
  });

  // AC19: a browser without scroll-driven animations (the @supports test fails).
  test("shows every revealed element when scroll timelines aren't supported", async ({
    page,
  }) => {
    await page.route("**/*.css", async (route) => {
      const response = await route.fetch();
      const css = (await response.text()).replaceAll(
        /@supports\s*\(animation-timeline:\s*view\(\)\)/g,
        "@supports (animation-timeline: not-supported-anywhere)",
      );
      await route.fulfill({ response, body: css });
    });
    await page.goto("/");
    const states = await page.locator(".reveal").evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el);
        return { opacity: style.opacity, transform: style.transform };
      }),
    );
    expect(states.length).toBeGreaterThan(0);
    for (const state of states) {
      expect(state).toEqual({ opacity: "1", transform: "none" });
    }
  });

  // AC20: the pointer island only runs with a fine, hovering pointer.
  test("tracks the pointer only with a fine, hovering pointer", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    // The island attaches after hydration; the poll below retries until then.
    const gx = async () => {
      await page.mouse.move(200, 200);
      await page.mouse.move(400, 300);
      return page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--gx"),
      );
    };
    if (testInfo.project.name === "desktop") {
      await expect.poll(gx).toBe("400px");
    } else {
      expect(await gx()).toBe("");
    }
  });

  // AC51: no morph or slide under reduced motion.
  test("turns off view-transition animations under reduced motion", async ({
    page,
  }) => {
    await page.goto("/");
    const hasRule = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
          if (
            !(rule instanceof CSSMediaRule) ||
            !rule.conditionText.includes("prefers-reduced-motion: reduce")
          ) {
            continue;
          }
          // Chrome serialises "animation: none" in long form, so read the
          // longhand instead of matching cssText.
          for (const inner of rule.cssRules) {
            if (
              inner instanceof CSSStyleRule &&
              inner.selectorText.includes("::view-transition-group") &&
              inner.style.animationName === "none"
            ) {
              return true;
            }
          }
        }
      }
      return false;
    });
    expect(hasRule).toBe(true);
  });
});
