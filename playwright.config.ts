import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3003";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  // The local Chrome installation is used intentionally so E2E can run without
  // depending on a separately cached Playwright browser binary.
  use: { baseURL, channel: "chrome", headless: true, trace: "retain-on-failure" },
  projects: [
    { name: "chromium", testMatch: /flows\.spec\.ts/, use: { viewport: { width: 1280, height: 900 } } },
    { name: "mobile-375", testMatch: /mobile\.spec\.ts/, use: { viewport: { width: 375, height: 812 } } },
    { name: "mobile-390", testMatch: /mobile\.spec\.ts/, use: { viewport: { width: 390, height: 844 } } },
    { name: "mobile-430", testMatch: /mobile\.spec\.ts/, use: { viewport: { width: 430, height: 932 } } },
  ],
});
