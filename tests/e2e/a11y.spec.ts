import AxeBuilder from '@axe-core/playwright';
import { expect, ROUTES, settle, test } from './fixtures';

/** WCAG 2.1 A and AA, which is what most accessibility policies and audits require. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('accessibility (axe)', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    for (const { path } of ROUTES) {
      test(`${path} has no WCAG A/AA violations in ${colorScheme} mode`, async ({ page }) => {
        // Reduced motion shows final states immediately, so contrast is checked on what people actually read.
        await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
        await page.goto(path);
        await settle(page);

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
        const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
        expect(summary).toEqual([]);
      });
    }
  }
});
