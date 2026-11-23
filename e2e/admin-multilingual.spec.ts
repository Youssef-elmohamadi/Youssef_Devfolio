import { test, expect } from "@playwright/test";

test.describe("Admin Multilingual Protection & Content Forms", () => {
  test("Unauthenticated access to /en/admin redirects to /en/admin/login", async ({ page }) => {
    // Navigate and allow redirect
    await page.goto("/en/admin", { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/en/admin/login**", { timeout: 15000 });
    expect(page.url()).toContain("/en/admin/login");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
    await expect(html).toHaveAttribute("dir", "ltr");
  });

  test("Unauthenticated access to /ar/admin redirects to /ar/admin/login", async ({ page }) => {
    await page.goto("/ar/admin", { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/ar/admin/login**", { timeout: 15000 });
    expect(page.url()).toContain("/ar/admin/login");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("Admin login page has localized inputs and title", async ({ page }) => {
    // English Login
    await page.goto("/en/admin/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Arabic Login
    await page.goto("/ar/admin/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
});
