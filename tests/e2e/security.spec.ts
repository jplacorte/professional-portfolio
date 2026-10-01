import { expect, test } from './fixtures';

test.describe('security headers', () => {
  test('pages ship a strict Content Security Policy and hardening headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    const csp = headers['content-security-policy'] ?? '';

    const scriptSrc = /script-src ([^;]+)/.exec(csp)?.[1] ?? '';
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).not.toContain('unsafe-inline');
    expect(scriptSrc).not.toContain('unsafe-eval');
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");

    expect(headers['strict-transport-security']).toContain('max-age=');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
  });

  test('the CSP blocks injected inline scripts', async ({ page }) => {
    await page.goto('/');
    const executed = await page.evaluate(() => {
      const script = document.createElement('script');
      script.textContent = 'window.__injected = true;';
      document.body.append(script);
      return (window as Window & { __injected?: boolean }).__injected === true;
    });
    expect(executed).toBe(false);
  });
});
