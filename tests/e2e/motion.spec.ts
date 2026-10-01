import { expect, settle, test } from './fixtures';

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('content is fully visible without waiting for animations', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const hidden = await page
      .locator('[data-reveal]')
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length);
    expect(hidden).toBe(0);
  });
});

test('the hero canvas draws without errors', async ({ page, issues }) => {
  await page.goto('/');
  const canvas = page.locator('[data-hero-field]');
  await expect(canvas).toBeVisible();
  const size = await canvas.evaluate((el: HTMLCanvasElement) => ({ w: el.width, h: el.height }));
  expect(size.w).toBeGreaterThan(0);
  expect(size.h).toBeGreaterThan(0);
  expect(await issues()).toEqual([]);
});
