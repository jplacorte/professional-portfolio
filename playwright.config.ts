import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;
/** Optional: point at a preinstalled Chromium instead of Playwright's download (sandboxed environments). */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

/**
 * End-to-end tests against the production build, served with the same CSP and security headers
 * Vercel applies (tools/preview-server.mjs). Run `npm run build` first; `npm run test:e2e` does both.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `node tools/preview-server.mjs ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
