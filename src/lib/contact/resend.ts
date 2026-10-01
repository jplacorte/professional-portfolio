import type { ContactEmail } from './email';

const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Portfolio <onboarding@resend.dev>';
const TIMEOUT_MS = 8_000;

export interface ResendOptions {
  apiKey: string;
  to: string;
  from?: string | undefined;
}

/** Sends the notification through Resend's REST API (no SDK needed). Throws on failure or timeout. */
export async function sendWithResend(email: ContactEmail, { apiKey, to, from }: ResendOptions): Promise<void> {
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from ?? DEFAULT_FROM,
      to: [to],
      reply_to: email.replyTo,
      subject: email.subject,
      html: email.html,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    // Resend's error body names the problem (e.g. "domain is not verified"); cap it so logs stay small.
    const detail = (await res.text()).slice(0, 300);
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }
}
