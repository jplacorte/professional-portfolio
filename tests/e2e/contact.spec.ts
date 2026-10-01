import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// The preview server only serves static files, so the API is stubbed. Its logic is unit-tested
// in src/lib/contact/handler.test.ts.
test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  const fill = async (page: Page) => {
    await page.getByLabel('Name').fill('Ada Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Message').fill('Hello — I have a senior role you might like.');
  };

  test('blocks empty submissions in the browser', async ({ page }) => {
    let posted = false;
    await page.route('**/api/contact', (route) => {
      posted = true;
      return route.abort();
    });
    await page.getByRole('button', { name: 'Send message' }).click();
    expect(posted).toBe(false);
    await expect(page.getByLabel('Name')).toBeFocused();
  });

  test('shows a confirmation and resets after a successful send', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.fulfill({ json: { ok: true } }));
    await fill(page);
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('status')).toHaveText(/message sent/i);
    await expect(page.getByLabel('Name')).toHaveValue('');
  });

  test('shows the server’s error message when sending fails', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 502, json: { error: 'Could not send right now — please email me directly.' } }),
    );
    await fill(page);
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('status')).toHaveText('Could not send right now — please email me directly.');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
  });

  test('the honeypot field is hidden from people and assistive tech', async ({ page }) => {
    await expect(page.locator('input[name="website"]')).not.toBeInViewport();
    // Role queries use the accessibility tree, so this checks what screen readers actually expose.
    await expect(page.getByRole('textbox', { name: 'Website' })).toHaveCount(0);
  });
});
