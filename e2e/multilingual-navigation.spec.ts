import { test, expect } from "@playwright/test";

test.describe("Multilingual Public Navigation & Language Switcher", () => {
  test("Home page renders correctly in English (LTR)", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    // Check HTML attributes
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
    await expect(html).toHaveAttribute("dir", "ltr");

    // Check navbar links have English aria-labels
    await expect(page.locator("nav a[aria-label='Home']")).toBeAttached();
    await expect(page.locator("nav a[aria-label='About']")).toBeAttached();
    await expect(page.locator("nav a[aria-label='Courses']")).toBeAttached();
  });

  test("Home page renders correctly in Arabic (RTL)", async ({ page }) => {
    await page.goto("/ar", { waitUntil: "domcontentloaded" });

    // Check HTML attributes
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");

    // Check navbar links have Arabic aria-labels
    await expect(page.locator("nav a[aria-label='الرئيسية']")).toBeVisible();
    await expect(page.locator("nav a[aria-label='نبذة عني']")).toBeVisible();
    await expect(page.locator("nav a[aria-label='الكورسات']")).toBeVisible();
  });

  test("Language switcher toggles between English and Arabic", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" });

    // Find language switcher button (shows "AR" badge to switch to Arabic)
    const switcher = page.locator("nav button:has-text('AR'), nav button[aria-label*='العربية']").first();
    await expect(switcher).toBeVisible();
    await switcher.click();

    // Verify URL changed to /ar and layout switched to RTL
    await page.waitForURL("**/ar**");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", "ar");

    // Click switcher again (now shows "EN" badge to switch back to English)
    const switchBack = page.locator("nav button:has-text('EN'), nav button[aria-label*='English']").first();
    await expect(switchBack).toBeVisible();
    await switchBack.click();

    // Verify URL changed back to /en and layout switched to LTR
    await page.waitForURL("**/en**");
    await expect(html).toHaveAttribute("dir", "ltr");
    await expect(html).toHaveAttribute("lang", "en");
  });

  test("About page renders in English and Arabic", async ({ page }) => {
    // English
    await page.goto("/en/about", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("body")).toBeVisible();

    // Arabic
    await page.goto("/ar/about", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Contact page renders localized form", async ({ page }) => {
    // English
    await page.goto("/en/contact", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("input[name='name']").or(page.locator("input[placeholder*='name' i]")).first()).toBeVisible();

    // Arabic
    await page.goto("/ar/contact", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("input[name='name']").or(page.locator("input[placeholder*='الاسم' i]")).first()).toBeVisible();
  });
});
