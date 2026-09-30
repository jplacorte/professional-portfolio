import type { APIRoute } from 'astro';
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { buildContactEmail, ContactSchema, isBot, sendWithResend, verifyTurnstile } from '@/lib/contact';

// The only server-rendered route; every other page is pre-rendered.
export const prerender = false;

/**
 * Handles the contact form. Responds with JSON for fetch() submissions and with a
 * 303 redirect for plain form posts, so the form also works without JavaScript.
 */
export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  const ok = () => (wantsJson ? Response.json({ ok: true }) : redirect('/contact?sent=1', 303));
  const fail = (status: number, error: string) =>
    wantsJson ? Response.json({ error }, { status }) : redirect('/contact?error=1', 303);

  const parsed = ContactSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? 'Invalid input');
  const submission = parsed.data;

  // Pretend success for bots so they don't retry.
  if (isBot(submission)) return ok();

  if (!(await verifyTurnstile(TURNSTILE_SECRET_KEY, submission['cf-turnstile-response'], clientAddress)))
    return fail(403, 'Spam check failed — please try again.');

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.warn('[contact] RESEND_API_KEY / CONTACT_TO_EMAIL not set; message not sent');
    return fail(503, 'Contact form is not configured yet — please email me directly.');
  }

  try {
    await sendWithResend(buildContactEmail(submission), {
      apiKey: RESEND_API_KEY,
      to: CONTACT_TO_EMAIL,
      from: CONTACT_FROM_EMAIL,
    });
  } catch (err) {
    console.error('[contact]', err);
    return fail(502, 'Could not send right now — please email me directly.');
  }
  return ok();
};
