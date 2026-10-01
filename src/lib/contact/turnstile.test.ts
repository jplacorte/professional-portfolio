import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstile } from './turnstile';

afterEach(() => vi.unstubAllGlobals());

describe('verifyTurnstile', () => {
  it('passes when no secret is configured (local development)', async () => {
    expect(await verifyTurnstile(undefined, undefined)).toBe(true);
  });

  it('fails without a token when a secret is configured', async () => {
    expect(await verifyTurnstile('secret', undefined)).toBe(false);
  });

  it('returns the verification result from Cloudflare', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal('fetch', fetchMock);

    expect(await verifyTurnstile('secret', 'token', '203.0.113.1')).toBe(true);
    const body = fetchMock.mock.calls[0]?.[1]?.body;
    expect(body).toBeInstanceOf(URLSearchParams);
    expect(Object.fromEntries(body as URLSearchParams)).toEqual({
      secret: 'secret',
      response: 'token',
      remoteip: '203.0.113.1',
    });
  });

  it('fails closed on network errors and timeouts', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('The operation timed out.', 'TimeoutError')));
    expect(await verifyTurnstile('secret', 'token')).toBe(false);
  });

  it('fails closed on an unexpected response shape', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: 'yes' })));
    expect(await verifyTurnstile('secret', 'token')).toBe(false);
  });

  it('fails closed when Cloudflare errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('oops', { status: 500 })));
    expect(await verifyTurnstile('secret', 'token')).toBe(false);
  });
});
