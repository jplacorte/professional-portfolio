import { expect, test } from './fixtures';

test('the theme toggle switches, announces and remembers the theme', async ({ page, issues }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  const toggle = page.getByRole('button', { name: 'Dark theme' });

  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(await issues()).toEqual([]);
});

test('the operating-system preference is the default', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/about');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
