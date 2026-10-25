import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './07-testing-and-delivery/e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run demo',
    url: 'http://localhost:5173',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
