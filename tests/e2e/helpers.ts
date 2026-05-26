import { Page } from "@playwright/test";

/** DOB used across all non-onboarding tests. */
export const TEST_DOB = "1990-06-15";

/**
 * Seeds localStorage BEFORE the page loads so the app skips onboarding
 * and renders the calendar immediately.
 *
 * Call this before page.goto().
 */
export async function seedStorage(page: Page, dob = TEST_DOB): Promise<void> {
  await page.addInitScript(
    ({ d }: { d: string }) => {
      localStorage.setItem("onboardingComplete", "true");
      localStorage.setItem("dob", d);
    },
    { d: dob },
  );
}

/**
 * Seeds localStorage and navigates to the app root,
 * then waits until the calendar dots are rendered.
 */
export async function gotoApp(page: Page, dob = TEST_DOB): Promise<void> {
  await seedStorage(page, dob);
  await page.goto("/");
  // Wait for at least one calendar dot to confirm the app has rendered
  await page.waitForSelector("#yearsList calendar-dot", { timeout: 10_000 });
}

/** The current year as a string (e.g. "2026"). */
export const CURRENT_YEAR = String(new Date().getFullYear());

/** CSS selector for the current year section in the calendar. */
export const currentYearSection = `#year${CURRENT_YEAR}`;
