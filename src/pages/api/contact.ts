import type { APIRoute } from 'astro';
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { handleContact, sendWithResend, verifyTurnstile, type ContactEmail, type ContactResult } from '@/lib/contact';

// The only server-rendered route; every other page is pre-rendered.
// Cross-site posts are rejected by Astro before this runs (`security.checkOrigin`).
export const prerender = false;

const NO_STORE = { 'Cache-Control': 'no-store' };

const apiKey = RESEND_API_KEY;
const recipient = CONTACT_TO_EMAIL;
/** Undefined when email isn't configured, so the handler can answer 503 instead of failing later. */
const send =
  apiKey && recipient
    ? (email: ContactEmail) => sendWithResend(email, { apiKey, to: recipient, from: CONTACT_FROM_EMAIL })
    : undefined;

/**
 * Thin HTTP adapter around lib/contact/handler.ts. Responds with JSON for fetch() submissions and
 * with a 303 redirect for plain form posts, so the form also works without JavaScript.
 */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const result = await handleContact(request, clientAddress, {
    verifyHuman: (token, ip) => verifyTurnstile(TURNSTILE_SECRET_KEY, token, ip),
    send,
    log: console,
  });

  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  return wantsJson ? json(result) : redirectBack(result);
};

function json(result: ContactResult): Response {
  return result.ok
    ? Response.json({ ok: true }, { headers: NO_STORE })
    : Response.json({ error: result.error }, { status: result.status, headers: NO_STORE });
}

function redirectBack(result: ContactResult): Response {
  return new Response(null, {
    status: 303,
    headers: { ...NO_STORE, Location: result.ok ? '/contact?sent=1' : '/contact?error=1' },
  });
}
