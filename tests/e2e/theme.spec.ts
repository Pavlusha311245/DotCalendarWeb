import { test, expect } from "@playwright/test";
import { gotoApp } from "./helpers.ts";

test.describe("Theme", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  test("default theme is dark", async ({ page }) => {
    expect(await page.locator("html").getAttribute("data-theme")).toBe("dark");
  });

  test("toggle switches to light", async ({ page }) => {
    await page.locator("#theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("toggle twice returns to dark", async ({ page }) => {
    await page.locator("#theme-toggle").click();
    await page.locator("#theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("theme persists in localStorage", async ({ page }) => {
    await page.locator("#theme-toggle").click();
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  });

  test("light theme persists after reload", async ({ page }) => {
    await page.locator("#theme-toggle").click();
    await page.reload();
    await page.waitForSelector("#yearsList calendar-dot");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("sun visible in dark, moon visible in light", async ({ page }) => {
    await expect(page.locator("#sun-circle")).toBeVisible();
    await expect(page.locator("#moon")).not.toBeVisible();
    await page.locator("#theme-toggle").click();
    await expect(page.locator("#moon")).toBeVisible();
    await expect(page.locator("#sun-circle")).not.toBeVisible();
  });
});
