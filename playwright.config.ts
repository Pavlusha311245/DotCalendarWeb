/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration for DotCalendar.
 * Dev server: bun index.html  (default port 3000)
 * Run tests:  bun run test:e2e
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: 1,

  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "bun index.html",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env["CI"],
    timeout: 30_000,
  },
});
