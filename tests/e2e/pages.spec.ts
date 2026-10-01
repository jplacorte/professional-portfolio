import { expect, ROUTES, settle, test } from './fixtures';

test.describe('every page', () => {
  for (const { path, heading } of ROUTES) {
    test(`${path} renders with SEO metadata and no errors`, async ({ page, issues }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await settle(page);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(page).toHaveTitle(/John Phillip Lacorte/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\//);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/.+\.png$/);
      expect(await issues()).toEqual([]);
    });
  }

  test('unknown routes return the 404 page', async ({ page }) => {
    const response = await page.goto('/this-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/isn’t deployed/);
  });
});
