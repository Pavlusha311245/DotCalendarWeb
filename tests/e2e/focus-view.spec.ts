import { test, expect } from "@playwright/test";
import { gotoApp, CURRENT_YEAR } from "./helpers.ts";

/**
 * Focus View tests: split-screen overlay with clock, notes, and current-year dots.
 */
test.describe("Focus View", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  // ─── Toggle open / close ──────────────────────────────────────────────────

  test("focus-view toggle button is visible in the nav", async ({ page }) => {
    await expect(page.locator("#focus-view-toggle")).toBeVisible();
  });

  test("clicking toggle opens the focus view", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator("focus-view[data-open]")).toBeVisible();
  });

  test("toggle button gets aria-pressed=true when view is open", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator("focus-view[data-open]")).toBeVisible();
    // Button reflects open state
    await expect(page.locator("#focus-view-toggle")).toHaveAttribute("aria-pressed", "true");
    // Close via × — toggle state resets
    await page.locator("#focus-close").click();
    await expect(page.locator("#focus-view-toggle")).toHaveAttribute("aria-pressed", "false");
  });

  test("close button (×) dismisses the focus view", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator("focus-view[data-open]")).toBeVisible();

    await page.locator("#focus-close").click();
    await expect(page.locator("focus-view[data-open]")).not.toBeVisible();
  });

  test("pressing Escape closes the focus view", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator("focus-view[data-open]")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("focus-view[data-open]")).not.toBeVisible();
  });

  test("body overflow is hidden while focus view is open", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  test("body overflow is restored after focus view closes", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await page.locator("#focus-close").click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("");
  });

  // ─── Clock panel (left-top) ───────────────────────────────────────────────

  test("shows a live clock with HH:mm:ss format", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    const time = await page.locator("#focus-time").textContent();
    expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  test("clock displays the current date string", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    const dateText = await page.locator("#focus-date").textContent();
    expect(dateText).toBeTruthy();
    // Should contain the 4-digit current year
    expect(dateText).toContain(CURRENT_YEAR);
  });

  test("clock ticks (time changes within 2 seconds)", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    const t1 = await page.locator("#focus-time").textContent();
    await page.waitForTimeout(1_100);
    const t2 = await page.locator("#focus-time").textContent();
    // After 1+ second the seconds digit must have changed
    expect(t1).not.toBe(t2);
  });

  // ─── Current year dots (right panel) ─────────────────────────────────────

  test("right panel shows current year heading", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator(".focus-year-number")).toHaveText(CURRENT_YEAR);
  });

  test("right panel contains 52 or 53 week dots", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    const dots = page.locator(".focus-dots calendar-dot");
    const count = await dots.count();
    expect(count).toBeGreaterThanOrEqual(52);
    expect(count).toBeLessThanOrEqual(53);
  });

  test("focus view dots have red and green colors like the main calendar", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator(".focus-dots .dot-red").first()).toBeVisible();
    await expect(page.locator(".focus-dots .dot-green").first()).toBeVisible();
  });

  // ─── Notes panel (left-bottom) ────────────────────────────────────────────

  test("notes panel renders and shows the placeholder when no notes exist", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator(".focus-notes-panel")).toBeVisible();
    await expect(page.locator(".focus-no-notes")).toBeVisible();
  });

  test("notes panel title includes the current year", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    const title = await page.locator(".focus-notes-title").textContent();
    expect(title).toContain(CURRENT_YEAR);
  });

  test("saved note appears in the focus view notes list", async ({ page }) => {
    // Save a note from the main calendar first
    await page.locator(`#year${CURRENT_YEAR} calendar-dot`).first().click();
    await page.locator(".note-textarea").fill("focus view note test");
    await page.locator("#save-note").click();

    // Open focus view
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator(".focus-notes-list .focus-note-text").first()).toHaveText(
      "focus view note test",
    );
  });

  test("notes list refreshes automatically after saving a note from focus view dot", async ({
    page,
  }) => {
    await page.locator("#focus-view-toggle").click();
    await expect(page.locator(".focus-no-notes")).toBeVisible();

    // Click the first dot inside the focus view
    await page.locator(".focus-dots calendar-dot").first().click();
    await page.locator(".note-textarea").fill("written from focus view");
    await page.locator("#save-note").click();

    // Notes list should now show the note (no longer shows placeholder)
    await expect(page.locator(".focus-no-notes")).not.toBeVisible();
    await expect(page.locator(".focus-notes-list .focus-note-text").first()).toHaveText(
      "written from focus view",
    );
  });

  // ─── Dot interaction inside focus view ───────────────────────────────────

  test("clicking a dot in the focus view opens the note dialog", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    await page.locator(".focus-dots calendar-dot").first().click();
    await expect(page.locator("#note-dialog")).toBeVisible();
  });

  test("dot in focus view gets glow after saving a note", async ({ page }) => {
    await page.locator("#focus-view-toggle").click();
    const dot = page.locator(".focus-dots calendar-dot").first();
    await expect(dot).not.toHaveClass(/dot-has-notes/);

    await dot.click();
    await page.locator(".note-textarea").fill("glow test");
    await page.locator("#save-note").click();

    await expect(dot).toHaveClass(/dot-has-notes/);
  });
});
