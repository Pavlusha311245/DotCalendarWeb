import { test, expect } from "@playwright/test";
import { gotoApp, CURRENT_YEAR } from "./helpers.ts";

/**
 * Week note tests: opening the dialog, saving/cancelling notes,
 * dot glow indicator, and persistence across page reload.
 */
test.describe("Notes", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  // ─── Dialog lifecycle ─────────────────────────────────────────────────────

  test("clicking a week dot opens the note dialog", async ({ page }) => {
    const dot = page.locator(`#year${CURRENT_YEAR} calendar-dot`).first();
    await dot.click();
    await expect(page.locator("#note-dialog")).toBeVisible();
  });

  test("note dialog contains a textarea and Save / Cancel buttons", async ({ page }) => {
    await page.locator(`#year${CURRENT_YEAR} calendar-dot`).first().click();
    await expect(page.locator(".note-textarea")).toBeVisible();
    await expect(page.locator("#save-note")).toBeVisible();
    await expect(page.locator("dialog button:has-text('Cancel')")).toBeVisible();
  });

  test("Cancel closes the dialog without saving", async ({ page }) => {
    await page.locator(`#year${CURRENT_YEAR} calendar-dot`).first().click();
    await page.locator(".note-textarea").fill("unsaved text");
    await page.locator("dialog button:has-text('Cancel')").click();
    await expect(page.locator("#note-dialog")).not.toBeVisible();

    // Re-open same dot — textarea should be empty (nothing was saved)
    await page.locator(`#year${CURRENT_YEAR} calendar-dot`).first().click();
    const content = await page.locator(".note-textarea").inputValue();
    expect(content).toBe("");
  });

  test("clicking outside the dialog (backdrop) closes it", async ({ page }) => {
    await page.locator(`#year${CURRENT_YEAR} calendar-dot`).first().click();
    await expect(page.locator("#note-dialog")).toBeVisible();
    // Click the dialog element itself (outside content = backdrop area)
    await page.locator("#note-dialog").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("#note-dialog")).not.toBeVisible();
  });

  // ─── Save flow ────────────────────────────────────────────────────────────

  test("saving a note closes the dialog", async ({ page }) => {
    await page.locator(`#year${CURRENT_YEAR} calendar-dot`).first().click();
    await page.locator(".note-textarea").fill("My first note");
    await page.locator("#save-note").click();
    await expect(page.locator("#note-dialog")).not.toBeVisible();
  });

  test("saved note is loaded when the dot is clicked again", async ({ page }) => {
    const dot = page.locator(`#year${CURRENT_YEAR} calendar-dot`).first();
    await dot.click();
    await page.locator(".note-textarea").fill("remember this");
    await page.locator("#save-note").click();

    // Re-open
    await dot.click();
    await expect(page.locator(".note-textarea")).toHaveValue("remember this");
  });

  test("dot gets glow class (dot-has-notes) after note is saved", async ({ page }) => {
    const dot = page.locator(`#year${CURRENT_YEAR} calendar-dot`).first();
    await expect(dot).not.toHaveClass(/dot-has-notes/);

    await dot.click();
    await page.locator(".note-textarea").fill("some thought");
    await page.locator("#save-note").click();

    await expect(dot).toHaveClass(/dot-has-notes/);
  });

  test("saving an empty note removes the glow class", async ({ page }) => {
    const dot = page.locator(`#year${CURRENT_YEAR} calendar-dot`).first();

    // First save with content
    await dot.click();
    await page.locator(".note-textarea").fill("temporary note");
    await page.locator("#save-note").click();
    await expect(dot).toHaveClass(/dot-has-notes/);

    // Now clear it
    await dot.click();
    await page.locator(".note-textarea").fill("");
    await page.locator("#save-note").click();
    await expect(dot).not.toHaveClass(/dot-has-notes/);
  });

  // ─── Persistence ─────────────────────────────────────────────────────────

  test("note persists after page reload", async ({ page }) => {
    const dot = page.locator(`#year${CURRENT_YEAR} calendar-dot`).first();
    await dot.click();
    await page.locator(".note-textarea").fill("persistent note");
    await page.locator("#save-note").click();

    // Reload keeps the same browser context → localStorage intact
    await page.reload();
    await page.waitForSelector("#yearsList calendar-dot");

    // Dot should still have the glow
    await expect(page.locator(`#year${CURRENT_YEAR} calendar-dot`).first()).toHaveClass(
      /dot-has-notes/,
    );

    // Content should still be there
    await page.locator(`#year${CURRENT_YEAR} calendar-dot`).first().click();
    await expect(page.locator(".note-textarea")).toHaveValue("persistent note");
  });

  test("note is stored in localStorage under the correct week key", async ({ page }) => {
    const dot = page.locator(`#year${CURRENT_YEAR} calendar-dot`).first();
    const weekId = await dot.getAttribute("data-week");
    expect(weekId).toBeTruthy();

    await dot.click();
    await page.locator(".note-textarea").fill("stored note");
    await page.locator("#save-note").click();

    const stored = await page.evaluate((key: string) => localStorage.getItem(key), weekId!);
    expect(stored).toBe("stored note");
  });
});
