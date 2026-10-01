import { buildContactEmail, type ContactEmail } from './email';
import { ContactSchema, isBot } from './schema';

/** Largest request body accepted. A full form with a 5,000-character message is well under this. */
export const MAX_BODY_BYTES = 16 * 1024;

const FORM_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data'];

export interface ContactDeps {
  /** Resolves true when the spam check passes. */
  verifyHuman: (token: string | undefined, ip: string | undefined) => Promise<boolean>;
  /** Delivers the notification, or `undefined` when email isn't configured. Throws on failure. */
  send: ((email: ContactEmail) => Promise<void>) | undefined;
  log: Pick<Console, 'warn' | 'error'>;
}

export type ContactResult = { ok: true } | { ok: false; status: 400 | 403 | 413 | 415 | 502 | 503; error: string };

const fail = (status: Extract<ContactResult, { ok: false }>['status'], error: string): ContactResult => ({
  ok: false,
  status,
  error,
});

/**
 * The contact-form workflow, independent of Astro and HTTP plumbing so every path is unit-tested:
 * size and type checks → validation → honeypot → spam check → send.
 */
export async function handleContact(
  request: Request,
  clientIp: string | undefined,
  deps: ContactDeps,
): Promise<ContactResult> {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) return fail(413, 'Message is too large.');

  const type = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() ?? '';
  if (!FORM_TYPES.includes(type)) return fail(415, 'Unsupported request.');

  let fields: Record<string, FormDataEntryValue>;
  try {
    fields = Object.fromEntries(await request.formData());
  } catch {
    return fail(400, 'Invalid form data.');
  }

  const parsed = ContactSchema.safeParse(fields);
  if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? 'Invalid input.');
  const submission = parsed.data;

  // Pretend success to bots so they don't retry or probe.
  if (isBot(submission)) return { ok: true };

  if (!(await deps.verifyHuman(submission['cf-turnstile-response'], clientIp))) {
    return fail(403, 'Spam check failed — please try again.');
  }

  if (!deps.send) {
    deps.log.warn('[contact] Email is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL); message not sent.');
    return fail(503, 'Contact form is not configured yet — please email me directly.');
  }

  try {
    await deps.send(buildContactEmail(submission));
  } catch (err) {
    deps.log.error('[contact] Sending failed:', err instanceof Error ? err.message : err);
    return fail(502, 'Could not send right now — please email me directly.');
  }
  return { ok: true };
}
