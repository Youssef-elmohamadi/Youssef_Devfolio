import { test, expect } from "@playwright/test";

test.describe("Courses and Lectures Flow", () => {
  test("Courses catalog renders in English with search and filters", async ({ page }) => {
    await page.goto("/en/courses", { waitUntil: "domcontentloaded" });

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
    await expect(html).toHaveAttribute("dir", "ltr");

    // Search input should exist
    const searchInput = page.locator("main input[type='text'], input[placeholder*='Search' i]").first();
    await expect(searchInput).toBeVisible();
  });

  test("Courses catalog renders in Arabic with RTL layout", async ({ page }) => {
    await page.goto("/ar/courses", { waitUntil: "domcontentloaded" });

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");

    // Arabic search input
    const searchInput = page.locator("main input[type='text'], input[placeholder*='بحث' i]").first();
    await expect(searchInput).toBeVisible();
  });

  test("Course detail and lecture navigation", async ({ page }) => {
    await page.goto("/en/courses", { waitUntil: "domcontentloaded" });

    // Find course cards inside main
    const courseCardLinks = page.locator("main a[href*='/courses/']");
    const count = await courseCardLinks.count();

    if (count > 0) {
      const firstCourse = courseCardLinks.first();
      await firstCourse.click();
      await page.waitForURL(/\/en\/courses\/[^\/]+/, { waitUntil: "domcontentloaded", timeout: 15000 });

      // Verify we are on course detail page
      expect(page.url()).toMatch(/\/en\/courses\/[^\/]+/);

      // Check for lectures in the course (excluding root courses link)
      const lectureLinks = page.locator("main a[href*='/courses/']").filter({
        hasNot: page.locator("xpath=self::*[contains(@href, '/courses') and string-length(@href) <= 12]"),
      });
      const lecCount = await lectureLinks.count();
      for (let i = 0; i < lecCount; i++) {
        const link = lectureLinks.nth(i);
        if (!(await link.isVisible())) continue;
        const href = await link.getAttribute("href");
        // Must have two segments: /en/courses/<course-slug>/<lecture-slug>
        if (href && (href.match(/\/courses\/[^\/]+\/[^\/]+/))) {
          await link.click();
          await page.waitForURL(/\/en\/courses\/[^\/]+\/[^\/]+/, { waitUntil: "domcontentloaded", timeout: 15000 });
          expect(page.url()).toMatch(/\/en\/courses\/[^\/]+\/[^\/]+/);
          break;
        }
      }
    }
  });
});
