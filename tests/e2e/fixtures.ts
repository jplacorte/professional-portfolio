import { test as base, expect, type Page } from '@playwright/test';

/** Every published route, with the heading a visitor should see. */
export const ROUTES = [
  { path: '/', heading: /full-stack products/i },
  { path: '/projects', heading: /decisions behind them/i },
  { path: '/projects/tonberry-cafe', heading: 'Tonberry Cafe' },
  { path: '/projects/swipeswap', heading: 'SwipeSwap' },
  { path: '/projects/personal-workstation', heading: 'Personal Workstation' },
  { path: '/projects/phillips-anime', heading: 'Phillips Anime' },
  { path: '/projects/hrs', heading: /Human Resource System/ },
  { path: '/projects/funnelworkforce', heading: 'FunnelWorkForce' },
  { path: '/projects/my-hobbies', heading: 'My Hobbies' },
  { path: '/projects/github-finder', heading: 'GitHub Finder' },
  { path: '/about', heading: /Engineer first/ },
  { path: '/contact', heading: /what you’re building/ },
] as const;

interface PageIssues {
  /** Console errors, uncaught exceptions and CSP violations collected during the test. */
  issues: () => Promise<string[]>;
}

/**
 * `page` that records console errors, page errors and Content-Security-Policy violations.
 * Tests assert `await issues()` is empty so a regression in any of them fails loudly.
 */
export const test = base.extend<PageIssues>({
  issues: async ({ page }, use) => {
    const collected: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') collected.push(`console: ${msg.text()}`);
    });
    page.on('pageerror', (err) => collected.push(`pageerror: ${err.message}`));
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (e) => {
        console.error(`CSP violation: ${e.violatedDirective} ${e.blockedURI}`);
      });
    });
    await use(() => Promise.resolve([...collected]));
  },
});

export { expect };

/** Waits for web fonts so layout-dependent assertions are stable. */
export async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}
