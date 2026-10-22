import { expect, test } from "@playwright/test";

import { expectNoA11yViolations } from "./helpers/a11y";
import { isMobile, resumeIsPublished } from "./helpers/pages";

// AC36: replaces the placeholder home tests. The noindex, no-horizontal-scroll
// and axe checks carry over; the "coming soon" text checks are retired.
test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // AC26
  test("shows the hero: one h1, eyebrow, intro and two CTAs", async ({
    page,
  }) => {
    const hero = page.locator("#hero");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText(
      "Building experiences beyond the screen.",
    );
    await expect(hero).toContainText("Senior Android Engineer · Bengaluru", {
      ignoreCase: true,
    });
    await expect(
      hero.getByRole("link", { name: "Explore my work" }),
    ).toBeVisible();
    await expect(hero.getByRole("link")).toHaveCount(2);
    await expect(hero.getByRole("figure")).toBeAttached();
  });

  // Placeholder AC2, kept: lang, title and description.
  test("sets lang, title and description", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Daniel Dominic — Senior Android Engineer");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S/,
    );
  });

  // Placeholder AC3, kept.
  test("asks search engines not to index or follow", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    const robots = await page.request.get("/robots.txt");
    if (robots.ok()) {
      expect(await robots.text()).not.toMatch(/^\s*Disallow:\s*\/\S*/im);
    }
  });

  // AC4
  test("never requests Google Fonts at runtime", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.reload({ waitUntil: "load" });
    // Every font the page uses has been requested by the time this settles.
    // (networkidle can stall on Next's link prefetching.)
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    expect(
      requests.filter((url) => /fonts\.(googleapis|gstatic)\.com/.test(url)),
    ).toEqual([]);
  });

  // AC27
  for (const { width, height } of [
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    test(`keeps the hero text and primary CTA above the fold at ${width} × ${height}`, async ({
      page,
    }, testInfo) => {
      test.skip(!isMobile(testInfo.project.name), "phone viewports only");
      await page.setViewportSize({ width, height });
      await page.reload();
      const hero = page.locator("#hero");
      for (const target of [
        hero.getByRole("heading", { level: 1 }),
        hero.locator("[data-eyebrow]"),
        hero.locator("[data-intro]"),
        hero.getByRole("link", { name: "Explore my work" }),
      ]) {
        await expect(target).toBeInViewport({ ratio: 1 });
      }
    });
  }

  // Placeholder AC4, kept: no horizontal scroll (the marquee track is clipped).
  for (const { label, width, height } of [
    { label: "at 320 px", width: 320, height: 568 },
    { label: "at 200% zoom on 390 px", width: 195, height: 422 },
  ]) {
    test(`has no horizontal scroll ${label}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    });
  }

  // AC28
  test("uses visible hero text or a static image as the LCP element", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "LCP is a Chromium API");
    const lcp = await page.evaluate(
      () =>
        new Promise<{
          tag: string;
          inHero: boolean;
          lazy: boolean;
          hidden: boolean;
        }>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries() as (PerformanceEntry & {
              element: Element | null;
            })[];
            const el = entries.at(-1)?.element;
            if (!el) return;
            let hidden = false;
            for (
              let node: Element | null = el;
              node;
              node = node.parentElement
            ) {
              if (Number(getComputedStyle(node).opacity) < 1) hidden = true;
            }
            resolve({
              tag: el.tagName,
              inHero: !!el.closest("#hero"),
              lazy: el.getAttribute("loading") === "lazy",
              hidden,
            });
          }).observe({ type: "largest-contentful-paint", buffered: true });
        }),
    );
    expect(lcp.inHero).toBe(true);
    expect(["H1", "P", "SPAN", "IMG"]).toContain(lcp.tag);
    expect(lcp.lazy).toBe(false);
    expect(lcp.hidden).toBe(false);
  });

  // AC29
  test("shows the stat tiles' final values with reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const bento = page.locator("#proof");
    for (const value of ["7+", "500K+", "End to end", "AR/XR"]) {
      await expect(bento.getByText(value, { exact: true })).toBeAttached();
    }
    const counters = await bento.locator(".count-up").evaluateAll((els) =>
      els.map((el) => ({
        n: getComputedStyle(el).getPropertyValue("--n").trim(),
        running: el.getAnimations().length,
      })),
    );
    expect(counters).toEqual([
      { n: "7", running: 0 },
      { n: "500", running: 0 },
    ]);
  });

  // AC30
  test("links the project cards to their case studies", async ({ page }) => {
    const work = page.locator("#work");
    await expect(work.getByRole("article")).toHaveCount(4);
    await work.getByRole("link", { name: "BeVigil" }).click();
    await expect(page).toHaveURL(/\/work\/bevigil$/);
  });

  // AC31
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`keeps every project card tappable (${reducedMotion})`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== "android", "mobile stack effect");
      await page.emulateMedia({ reducedMotion });
      await page.reload();
      const cards = page.locator("#work").getByRole("article");
      for (let i = 0; i < 4; i++) {
        const link = cards.nth(i).getByRole("link");
        await link.scrollIntoViewIfNeeded();
        await link.click({ trial: true });
      }
      const position = await cards
        .first()
        .evaluate((el) => getComputedStyle(el).position);
      expect(position).toBe(reducedMotion === "reduce" ? "relative" : "sticky");
    });
  }

  // AC33
  test("pauses the marquee on hover and focus, and wraps it under reduced motion", async ({
    page,
  }, testInfo) => {
    const marquee = page.locator("[data-marquee]");
    const track = marquee.locator("[data-marquee-track]");
    const state = () =>
      track.evaluate((el) => getComputedStyle(el).animationPlayState);

    await marquee.focus();
    expect(await state()).toBe("paused");
    await marquee.blur();
    if (!isMobile(testInfo.project.name)) {
      await marquee.hover();
      expect(await state()).toBe("paused");
    }

    // A visitor's preference applies from page load (WebKit keeps a paused
    // animation's offset if the preference flips mid-session).
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    expect(
      await track.evaluate((el) => ({
        name: getComputedStyle(el).animationName,
        wrap: getComputedStyle(el).flexWrap,
      })),
    ).toEqual({ name: "none", wrap: "wrap" });
    await expect(marquee.locator("ul[aria-hidden='true']")).toBeHidden();

    // Wrapped, not clipped: every chip of the visible list fits the viewport.
    const viewport = page.viewportSize();
    const chips = marquee.locator("ul:not([aria-hidden]) > li");
    expect(await chips.count()).toBeGreaterThan(0);
    for (const box of await chips.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    )) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(viewport?.width ?? 0);
    }
  });

  // AC35
  test("shows the contact block with 44 px targets", async ({ page }) => {
    const resume = await resumeIsPublished(page);
    const contact = page.locator("#contact");
    const links = [
      contact.getByRole("link", { name: /dominicdj37@gmail\.com/ }),
      contact.getByRole("link", { name: /\+91 9947692661/ }),
      contact.getByRole("link", { name: /LinkedIn/ }),
    ];
    await expect(links[0]!).toHaveAttribute(
      "href",
      "mailto:dominicdj37@gmail.com",
    );
    await expect(links[1]!).toHaveAttribute("href", "tel:+919947692661");
    await expect(contact.getByRole("link", { name: /Resume/ })).toHaveCount(
      resume ? 1 : 0,
    );
    for (const link of links) {
      const box = await link.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }
  });

  // Placeholder AC5, kept.
  test("passes axe in the light colour scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await expectNoA11yViolations(page);
  });

  // Placeholder AC5, kept.
  test("passes axe in the dark colour scheme", async ({ page }) => {
    const background = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.emulateMedia({ colorScheme: "light" });
    const light = await background();
    await page.emulateMedia({ colorScheme: "dark" });

    expect(await background()).not.toBe(light);
    await expectNoA11yViolations(page);
  });
});
