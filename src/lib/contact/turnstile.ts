const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TIMEOUT_MS = 5_000;

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * - No secret configured → passes, so local development works without keys.
 * - Network error, timeout or unexpected response → fails closed.
 */
export async function verifyTurnstile(
  secret: string | undefined,
  token: string | undefined,
  ip?: string,
): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return false;
    const data: unknown = await res.json();
    return typeof data === 'object' && data !== null && 'success' in data && data.success === true;
  } catch {
    return false;
  }
}
