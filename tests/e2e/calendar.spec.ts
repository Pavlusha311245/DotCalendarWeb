import { test, expect } from "@playwright/test";
import { gotoApp, TEST_DOB, CURRENT_YEAR, currentYearSection } from "./helpers.ts";

/**
 * Calendar rendering, DOB input, and life-statistics tests.
 */
test.describe("Calendar", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  // ─── Rendering ────────────────────────────────────────────────────────────

  test("renders the current year section", async ({ page }) => {
    await expect(page.locator(currentYearSection)).toBeVisible();
  });

  test("current year heading shows the year number", async ({ page }) => {
    await expect(page.locator(`${currentYearSection} h2`)).toHaveText(CURRENT_YEAR);
  });

  test("renders 52 or 53 week dots for the current year", async ({ page }) => {
    const dots = page.locator(`${currentYearSection} calendar-dot`);
    const count = await dots.count();
    expect(count).toBeGreaterThanOrEqual(52);
    expect(count).toBeLessThanOrEqual(53);
  });

  test("past weeks are rendered in red, future weeks in green", async ({ page }) => {
    // With DOB 1990-06-15 and today 2026, the current year has both red
    // (passed) and green (remaining) dots
    const red = page.locator(`${currentYearSection} .dot-red`);
    const green = page.locator(`${currentYearSection} .dot-green`);
    await expect(red.first()).toBeVisible();
    await expect(green.first()).toBeVisible();
  });

  test("weeks before birth date are rendered in gray", async ({ page }) => {
    // DOB 1990-06-15 → years 1926-1989 have gray dots; birth year visible after
    // clicking "Show Previous Years"
    await page.locator("#show-past-years-btn").click();
    // Year 1988 (before birth) should contain only gray dots
    const grayDots = page.locator("#year1988 .dot-gray");
    await expect(grayDots.first()).toBeVisible();
    const nonGrayDots = page.locator("#year1988 .dot-red, #year1988 .dot-green");
    expect(await nonGrayDots.count()).toBe(0);
  });

  test("Show Previous Years button appears for past DOB", async ({ page }) => {
    await expect(page.locator("#show-past-years-btn")).toBeVisible();
  });

  test("Show Previous Years reveals past year sections", async ({ page }) => {
    await page.locator("#show-past-years-btn").click();
    await expect(page.locator("#year2024")).toBeVisible();
    await expect(page.locator("#year2020")).toBeVisible();
    // Button disappears after being used
    await expect(page.locator("#show-past-years-btn")).not.toBeVisible();
  });

  // ─── Life statistics panel ─────────────────────────────────────────────────

  test("stats panel shows non-zero passed weeks", async ({ page }) => {
    const passedText = await page.locator("#passedWeeks").textContent();
    expect(Number(passedText)).toBeGreaterThan(0);
  });

  test("stats panel shows non-zero remaining weeks", async ({ page }) => {
    const remainingText = await page.locator("#remainingWeeks").textContent();
    expect(Number(remainingText)).toBeGreaterThan(0);
  });

  test("passed + remaining equals total life weeks (start 100y ago → DOB+100y)", async ({
    page,
  }) => {
    const passed = Number(await page.locator("#passedWeeks").textContent());
    const remaining = Number(await page.locator("#remainingWeeks").textContent());
    const total = passed + remaining;
    // With TEST_DOB=1990 the range is 1926–2090 = 164 years × ~52 weeks
    expect(total).toBeGreaterThanOrEqual(8500);
    expect(total).toBeLessThanOrEqual(8800);
  });

  // ─── DOB input component (footer) ─────────────────────────────────────────

  test("DOB input component reflects the stored date", async ({ page }) => {
    const value = await page.locator("dob-input #date-of-birth").inputValue();
    expect(value).toBe(TEST_DOB);
  });

  test("changing DOB adds gray dots for pre-birth weeks", async ({ page }) => {
    // Change DOB to 2000 — any year before 2000 should become all-gray
    await page.locator("dob-input #date-of-birth").evaluate((el: HTMLInputElement, v) => {
      el.value = v;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, "2000-01-01");
    await page.waitForTimeout(300);

    // After DOB change the calendar re-renders with showPastYears:false,
    // so we need to click Show Previous Years again to see 1998.
    await page.locator("#show-past-years-btn").click();

    // Year 1998 is before DOB 2000 → all gray
    const grayDots1998 = page.locator("#year1998 .dot-gray");
    expect(await grayDots1998.count()).toBeGreaterThan(0);

    // Year 1988 also fully gray
    const grayDots1988 = page.locator("#year1988 .dot-gray");
    expect(await grayDots1988.count()).toBeGreaterThan(0);
  });

  test("clearing DOB removes gray (before-birth) dots", async ({ page }) => {
    // First verify gray dots exist with a 1990 DOB
    await page.locator("#show-past-years-btn").click();
    await expect(page.locator("#year1988 .dot-gray").first()).toBeVisible();

    // Clear DOB
    await page.locator("#delete-dob").click();
    await page.waitForTimeout(300);

    // After clearing DOB, re-show past years (button reappears after delete)
    const btn = page.locator("#show-past-years-btn");
    if (await btn.isVisible()) await btn.click();

    // Without DOB there are no gray dots — only red/green based on current date
    const grayDots = page.locator("#year1988 .dot-gray");
    expect(await grayDots.count()).toBe(0);
  });
});
