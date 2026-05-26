import { test, expect } from "@playwright/test";

/**
 * Onboarding flow tests.
 *
 * These tests navigate to the app WITHOUT seeding localStorage,
 * so the full onboarding is triggered.
 */
test.describe("Onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ─── Screen 1 ─────────────────────────────────────────────────────────────

  test("shows onboarding screen 1 on first visit", async ({ page }) => {
    await expect(page.locator("#onboarding-screen-1")).toBeVisible();
  });

  test("screen 1 contains title and legend", async ({ page }) => {
    await expect(page.locator("#onboarding-screen-1 h2")).toHaveText("Your life in weeks");
    // Red dots (weeks lived) and green dots (weeks remaining) both visible
    await expect(page.locator("#onboarding-screen-1 .dot-red").first()).toBeVisible();
    await expect(page.locator("#onboarding-screen-1 .dot-green").first()).toBeVisible();
  });

  test("main section is inert (non-interactive) while onboarding is active", async ({ page }) => {
    const isInert = await page.locator("#main-section").evaluate((el) => (el as HTMLElement).inert);
    expect(isInert).toBe(true);
  });

  test("Next button advances to screen 2", async ({ page }) => {
    await page.locator("#onboarding-screen-1-next").click();
    await expect(page.locator("#onboarding-screen-1")).not.toBeVisible();
    await expect(page.locator("#onboarding-screen-2")).toBeVisible();
  });

  // ─── Screen 2 ─────────────────────────────────────────────────────────────

  test("screen 2 shows DOB input and disabled Get started button", async ({ page }) => {
    await page.locator("#onboarding-screen-1-next").click();
    await expect(page.locator("#onboarding-dob")).toBeVisible();
    await expect(page.locator("#onboarding-screen-2-got-it")).toBeDisabled();
  });

  test("Get started button enables after entering DOB", async ({ page }) => {
    await page.locator("#onboarding-screen-1-next").click();
    await expect(page.locator("#onboarding-screen-2-got-it")).toBeDisabled();
    await page.locator("#onboarding-dob").fill("1990-06-15");
    await expect(page.locator("#onboarding-screen-2-got-it")).toBeEnabled();
  });

  test("completing onboarding stores DOB and shows the calendar", async ({ page }) => {
    await page.locator("#onboarding-screen-1-next").click();
    await page.locator("#onboarding-dob").fill("1990-06-15");
    await page.locator("#onboarding-screen-2-got-it").click();

    // Onboarding screens gone
    await expect(page.locator("#onboarding-screen-2")).not.toBeVisible();

    // Calendar dots are rendered
    await page.waitForSelector("#yearsList calendar-dot", { timeout: 8_000 });
    await expect(page.locator("#yearsList calendar-dot").first()).toBeVisible();

    // localStorage persisted both keys
    const stored = await page.evaluate(() => ({
      onboardingComplete: localStorage.getItem("onboardingComplete"),
      dob: localStorage.getItem("dob"),
    }));
    expect(stored.onboardingComplete).toBe("true");
    expect(stored.dob).toBe("1990-06-15");
  });

  test("main section becomes interactive after completing onboarding", async ({ page }) => {
    await page.locator("#onboarding-screen-1-next").click();
    await page.locator("#onboarding-dob").fill("1990-06-15");
    await page.locator("#onboarding-screen-2-got-it").click();

    await page.waitForSelector("#yearsList calendar-dot");
    const isInert = await page.locator("#main-section").evaluate((el) => (el as HTMLElement).inert);
    expect(isInert).toBe(false);
  });

  test("manipulating localStorage without DOB resets onboarding on next load", async ({ page }) => {
    // Simulate a DevTools attack: mark onboarding complete but leave DOB empty
    await page.evaluate(() => {
      localStorage.setItem("onboardingComplete", "true");
      localStorage.removeItem("dob");
    });
    await page.reload();

    // Guard in main.ts resets onboarding, screen 1 should appear
    await expect(page.locator("#onboarding-screen-1")).toBeVisible();
  });
});
