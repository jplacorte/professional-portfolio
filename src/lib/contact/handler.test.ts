import { describe, expect, it, vi } from 'vitest';
import { handleContact, MAX_BODY_BYTES, type ContactDeps } from './handler';

const validFields = { name: 'Ada', email: 'ada@example.com', message: 'Hello, I have a role for you.' };

function formRequest(fields: Record<string, string>, headers: Record<string, string> = {}): Request {
  return new Request('https://example.com/api/contact', {
    method: 'POST',
    body: new URLSearchParams(fields),
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
  });
}

function deps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    verifyHuman: vi.fn().mockResolvedValue(true),
    send: vi.fn().mockResolvedValue(undefined),
    log: { warn: vi.fn(), error: vi.fn() },
    ...overrides,
  };
}

describe('handleContact', () => {
  it('sends the email for a valid submission', async () => {
    const d = deps();
    await expect(handleContact(formRequest(validFields), '203.0.113.1', d)).resolves.toEqual({ ok: true });
    expect(d.send).toHaveBeenCalledWith(expect.objectContaining({ replyTo: 'ada@example.com' }));
    expect(d.verifyHuman).toHaveBeenCalledWith(undefined, '203.0.113.1');
  });

  it('rejects oversized bodies before reading them', async () => {
    const d = deps();
    const result = await handleContact(
      formRequest(validFields, { 'content-length': String(MAX_BODY_BYTES + 1) }),
      undefined,
      d,
    );
    expect(result).toMatchObject({ ok: false, status: 413 });
    expect(d.send).not.toHaveBeenCalled();
  });

  it('rejects non-form content types', async () => {
    const request = new Request('https://example.com/api/contact', {
      method: 'POST',
      body: JSON.stringify(validFields),
      headers: { 'content-type': 'application/json' },
    });
    await expect(handleContact(request, undefined, deps())).resolves.toMatchObject({ ok: false, status: 415 });
  });

  it('returns the first validation message', async () => {
    const result = await handleContact(formRequest({ ...validFields, email: 'nope' }), undefined, deps());
    expect(result).toEqual({ ok: false, status: 400, error: 'Please use a valid email' });
  });

  it('pretends success for bots without checking or sending', async () => {
    const d = deps();
    await expect(handleContact(formRequest({ ...validFields, website: 'x' }), undefined, d)).resolves.toEqual({
      ok: true,
    });
    expect(d.verifyHuman).not.toHaveBeenCalled();
    expect(d.send).not.toHaveBeenCalled();
  });

  it('blocks submissions that fail the spam check', async () => {
    const d = deps({ verifyHuman: vi.fn().mockResolvedValue(false) });
    await expect(handleContact(formRequest(validFields), undefined, d)).resolves.toMatchObject({ status: 403 });
    expect(d.send).not.toHaveBeenCalled();
  });

  it('reports 503 when email is not configured', async () => {
    const d = deps({ send: undefined });
    await expect(handleContact(formRequest(validFields), undefined, d)).resolves.toMatchObject({ status: 503 });
    expect(d.log.warn).toHaveBeenCalled();
  });

  it('reports 502 and logs when the provider fails, without leaking details to the visitor', async () => {
    const d = deps({ send: vi.fn().mockRejectedValue(new Error('Resend responded 403: domain not verified')) });
    const result = await handleContact(formRequest(validFields), undefined, d);
    expect(result).toEqual({ ok: false, status: 502, error: 'Could not send right now — please email me directly.' });
    expect(d.log.error).toHaveBeenCalledWith('[contact] Sending failed:', 'Resend responded 403: domain not verified');
  });
});
