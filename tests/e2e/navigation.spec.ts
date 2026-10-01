import { expect, settle, test } from './fixtures';

test('a project row opens its case study', async ({ page, issues }) => {
  await page.goto('/projects');
  await page
    .getByRole('link', { name: /SwipeSwap/ })
    .first()
    .click();

  await expect(page).toHaveURL(/\/projects\/swipeswap$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SwipeSwap');
  await expect(page.getByRole('link', { name: /Source/ })).toHaveAttribute('href', /github\.com/);
  expect(await issues()).toEqual([]);
});

test('primary navigation marks the current section', async ({ page }) => {
  await page.goto('/projects/hrs');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
});

test('the skip link moves focus past the header', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Tab focus order differs by browser default settings.');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('case studies highlight the section being read', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The table of contents is desktop-only.');
  await page.goto('/projects/swipeswap');
  await settle(page);
  const toc = page.getByRole('navigation', { name: 'On this page' });
  await expect(toc.locator('a[aria-current="true"]')).toHaveCount(1);

  // Readers scroll a section to the top of the screen; the spy should follow.
  await page.evaluate(() => document.getElementById('key-decisions')?.scrollIntoView({ block: 'start' }));
  await expect(toc.getByRole('link', { name: 'Key decisions' })).toHaveAttribute('aria-current', 'true');
});
